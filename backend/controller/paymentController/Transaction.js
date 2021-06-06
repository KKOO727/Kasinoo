
const { GamePlay } = require("../../models/users_model");
const UserModel = require("../../models/users_model").adminUser
const {TransactionsHistory,payoutchannel,paymentuserdetail} = require("../../models/paymentGateWayModel")
const BASECONTROL = require("../basecontroller")
const UsersControl = require("../userscontroller")
var mongoose = require('mongoose');
const ReportControl = require("../reportcontroller")
const Ruppepaycontrol = require("./Paygate10")
const PaymoroControl = require("./paymoro")
const Yaarpaycontrol = require("./YaarPay")
const PCONFIG = require("../../config/pconfig")
const {firstpagesetting} = require("../../models/firstpage_model")

exports.getConFig = async (type) => {
    let u = await firstpagesetting.findOne({type : type});
    if (u) {
        return u.content;
    } else {
        return false
    }
}

exports.Payout = async(req,res,next)=>{

    console.log(req.body)
    let data = req.body.data;
    var mainuser =  BASECONTROL.getUserItem(req);
    let {status,amount} = data;
    let PAYMENTCONFIG = req.pconfig;

    let last_item = await BASECONTROL.BfindOne(TransactionsHistory,{_id : data._id});
    if (!last_item) {
        res.json({status : false, data : "error"});
        return next();
    }

    var Pitem = await BASECONTROL.BfindOne(GamePlay,{email : data.email});
    if (!Pitem) {
        res.json({status : false, data : "we can't find this user"});
        return next();
    }

    if (last_item.status == PCONFIG.Pending || last_item.status == PCONFIG.OnHold) {
        if (status == PCONFIG.Reject) {
            let redata = await this.transactionupdate(data,mainuser);
            await this.balancRefund(Pitem,last_item,amount);
            this.admin_WithdrawHistoryLoad(req,res,next,"success")

        } else {

            let activepayoutchannel = await payoutchannel.findOne({status : true}).populate("paymentconfigurationid");
            if (activepayoutchannel && activepayoutchannel.paymentconfigurationid) {

                let itemuser = await BASECONTROL.BfindOne(paymentuserdetail,{userid : mongoose.Types.ObjectId(Pitem.id),paymentconfigid: mongoose.Types.ObjectId("5ff884449a092214343aa2e2")});
                if (itemuser) {
                    console.log(activepayoutchannel.paymentconfigurationid.type)
                    switch(activepayoutchannel.paymentconfigurationid.type){
                        
                        case "YaarPay" : 
                            Yaarpaycontrol.YaarPayPayout(amount,activepayoutchannel,itemuser,async(rdata) =>{
                                if (rdata.status) {
                                    data["status"] = PCONFIG.Paid;
                                } else {
                                    data["status"] = PCONFIG.Reject;
                                    await this.balancRefund(Pitem,last_item,amount);
                                }
                                let redata = await this.transactionupdate(data,mainuser);
                                this.admin_WithdrawHistoryLoad(req,res,next,rdata.error)
                            })
                        break;

                        case "Paygate10" :
                            Ruppepaycontrol.Paygate10Payout(last_item,activepayoutchannel.paymentconfigurationid,data, itemuser,async(rdata)=>{
                                if (rdata.status) {
                                    data["status"] = PCONFIG.Paid;
                                    data["order_no"] = rdata.data;
                                } else {
                                    data["status"] = PCONFIG.Reject;
                                    data["order_no"] = last_item.order_no;
                                    await this.balancRefund(Pitem,last_item,amount);
                                }
                                let redata = await this.transactionupdate(data,mainuser);
                                this.admin_WithdrawHistoryLoad(req,res,next,rdata.error)
                            })
                        break;

                        case "Paymero" :
                            PaymoroControl.payoutBankTransfer(last_item,activepayoutchannel,data, itemuser,async(rdata)=>{
                                if (rdata.status) {
                                    data["status"] = PCONFIG.Paid;
                                } else {
                                    data["status"] = PCONFIG.Reject;
                                    await this.balancRefund(Pitem,last_item,amount);
                                }

                                let redata = await this.transactionupdate(data,mainuser);
                                this.admin_WithdrawHistoryLoad(req,res,next,rdata.error)
                            })
                        break;


                        case "cash" :
                            let redata = await this.transactionupdate(data,mainuser);
                            this.admin_WithdrawHistoryLoad(req,res,next,"success");
                        break;
                        
                        default:
                            res.json({status : false,data : "fail"});
                            return next();
                    }

                } else {
                    res.json({status : false, data : "Please set withdrawal bank detail about by this user"});
                    return next();
                }
            } else {
                res.json({status : false, data : "Please active payout chnnel"});
                return next();
            }
        }
    } else {
        res.json({status : false,data : "fail"});
        return next();
    }
}


exports.transactionupdate = async(data,mainuser) =>{
    var error =  await TransactionsHistory.findOneAndUpdate(
        { _id : data._id},
        {
            status: data.status,
            "resultData.createdby" : mainuser.email,
            comment : data.comment,
            "resultData.verify" : data.verify,
            order_no : data.order_no
        }
    )

    if(error){
        return true;
    }else{
        return false
    }
}

exports.balancRefund = async (playerItem,transitem) => {

    let amount = transitem.amount + transitem.commission;
    var wallets_ = {
        commission:0,
        status :"DEPOSIT",
        roundid :transitem.order_no,
        transactionid : transitem.order_no,
        userid : mongoose.Types.ObjectId(playerItem.id),
        debited : 0,
        credited : amount,
        lastbalance : playerItem.balance,
        paymentid : mongoose.Types.ObjectId(transitem._id)
    }
    var error2 =  await BASECONTROL.email_balanceupdate(playerItem.email,amount,wallets_);
    return true;
}


exports.deposittransactionHistoryLoad = async(req,res,next)=>{
   
   

    let user = req.user;
    let data = req.body.row;
    let params = req.body.params;
    let start = BASECONTROL.get_stand_date_end(data.start);
    let end = BASECONTROL.get_stand_date_end(data.end);

    let andquery = {createDate :{$gte: start, $lte:end},userid: mongoose.Types.ObjectId(user._id),wallettype : "DEPOSIT"}
    var rows = [];
    
    let totalcount = await TransactionsHistory.countDocuments(andquery);
    var pages = ReportControl.setpage(params,totalcount);

    if (totalcount > 0) {
      rows = await TransactionsHistory.find(andquery,"amount comment createDate lastbalance updatedbalance status type commission").sort({createDate : -1}).skip(pages.skip).limit(pages.limit);
    }
    pages["skip2"] = (pages.skip) + rows.length;
  
    res.json({status : true,data : rows, pageset : pages, });
    return next();
}

exports.admindeposittransactionHistoryLoadTotal = async (req,res ,next) => {
     
    let filters = req.body.filters;
    let dates = filters.dates;
    let userslist = [];
    let orquery = [];
    let andquery = [];
    var useroptions = [{"label" : "All",value : ""}];

    if (dates.length > 2) {
        return res.send({status : false , error : "Please provide date."});
    }

    var start = BASECONTROL.get_stand_date_first(dates.start);
    var end = BASECONTROL.get_stand_date_first(dates.end);
    var role = BASECONTROL.getUserItem(req)
    userslist = await UsersControl.get_users_items(role);
    for (var i in userslist) {
        orquery.push({userid :mongoose.Types.ObjectId(userslist[i]._id)})
    }
    var statusoptions = [
        {label : "All" , value : ""}
    ];

    let tconfig = PCONFIG;
    for (let i in tconfig) {
        statusoptions.push({value : tconfig[i],label : tconfig[i]});
    }
    if(orquery.length > 0) {

        andquery = [{ createDate :{$gte: start, $lte:end},"resultData.auto" : {$ne : true}}];
        
        let betuser =  await TransactionsHistory.aggregate(
            [
                {
                    $match:    
                    { 
                        $and: andquery,
                        $or : orquery
                    },
                },
                {
                    $group: 
                    {  
                        _id: "$userid",
                    }
                },
                {
                    "$lookup": {
                        "from": "user_users",
                        "localField": "_id",
                        "foreignField": "_id",
                        "as": "user"
                    }
                },
                { "$unwind": "$user" },
                { "$project":{
                    label:'$user.username',
                    value: "$user._id", 
               }}
            ]
        )

        useroptions = [...useroptions,...betuser];
    }
console.log(useroptions)
    res.json(
    {
        status:true, 
        data :  { useroptions : useroptions,statusoptions : statusoptions },
    })
    return next();      
}

exports.admindeposittransactionHistoryLoad = async(req,res,next)=>{


    let params = req.body.params;
    let filters = req.body.filters;
    console.log(filters)
    console.log(params)
    if (params && filters) {
        let array = [];
        let orquery = [];
        let andquery = [];
        let mainuser = req.user;
        let userid = filters.userid;
        let wallettype = filters.wallettype;
        let status = filters.status;
        let dates = filters.dates;
        if (dates.length > 2) {
            return res.send({status : false , error : "Please provide date."});
        }
        var start = BASECONTROL.get_stand_date_first(dates.start);
        var end = BASECONTROL.get_stand_date_first(dates.end);
        let pages = {};
        if (userid && userid.length > 0) {
            orquery.push({userid : mongoose.Types.ObjectId(userid)})
        } else {
            let userslist = await UsersControl.get_users_items(mainuser);
            for (var i in userslist) {
                orquery.push({userid :mongoose.Types.ObjectId(userslist[i]._id)})
            }
        }
        
        andquery = {createDate :{$gte: start, $lte:end},$or : orquery,"resultData.auto" : {$ne : true}, wallettype : { $regex : wallettype}, status : { $regex : status}};
        

        if (orquery.length > 0) {
            let totalcount = await TransactionsHistory.countDocuments(andquery);
            pages = ReportControl.setpage(params,totalcount);
            if (totalcount > 0) {
                array = await TransactionsHistory.find(andquery).skip(pages.skip).limit(pages.limit).populate("userid").sort({createDate : -1});
            } 
        }
        
        pages["skip2"] = (pages.skip) + array.length;
        res.send({
            status : true ,data:array, 
            pageset : pages,
        });
        return next();

    } else {
        res.send({status : false, data : "error"});
        return next(); 
    }
}

exports.withdrawalCancel = async (req ,res ,next) => {
    let {data} = req.body;
    console.log(data)
    let user = req.user;
    let playeritem = await GamePlay.findOne({id : user._id});
    if (playeritem) {

        let order_no = new Date().valueOf();
        let amount = data.amount + data.commission;
        var wallets_ = {
            commission:0,
            status :"DEPOSIT",
            roundid :order_no,
            transactionid : order_no,
            userid : mongoose.Types.ObjectId(playeritem.id),
            credited : amount,
            debited : 0,
            lastbalance : playeritem.balance,
            paymentid : data._id
        }
        plcurrent =  await BASECONTROL.email_balanceupdate(playeritem.email,amount,wallets_); 

        let uprow = {
            updatedbalance : plcurrent,
            status  : PCONFIG.Reject
        }

        let up =  await TransactionsHistory.findOneAndUpdate({_id : data._id},uprow);
        if (up) {
            this.WithdrawHistoryLoad(req,res,next)
        } else {
            res.send({status :false ,data : "server error"});
            return next();
        }

    } else {
        res.send({status :false ,data : "server error"});
        return next();
    }

}

exports.WithdrawHistoryLoad = async(req,res,next)=>{

    let user = req.user;
    let data = req.body.row;
    let params = req.body.params;
    let start = BASECONTROL.get_stand_date_end(data.start);
    let end = BASECONTROL.get_stand_date_end(data.end);

    let andquery = {createDate :{$gte: start, $lte:end},userid: mongoose.Types.ObjectId(user._id),wallettype : "WITHDRAWL"}
    var rows = [];
    
    let totalcount = await TransactionsHistory.countDocuments(andquery);
    var pages = ReportControl.setpage(params,totalcount);

    if (totalcount > 0) {
      rows = await TransactionsHistory.find(andquery,"amount comment createDate lastbalance updatedbalance status type commission").sort({createDate : -1}).skip(pages.skip).limit(pages.limit);
    }
    pages["skip2"] = (pages.skip) + rows.length;
  
    res.json({status : true,data : rows, pageset : pages, });
    return next();

}

exports.adminwithdrawal_total =  async (req,res,next) =>{    
    let filters = req.body.filters;
    let dates = filters.dates;
    let userid = filters.userid;
    let status = filters.status;
    var total = [];
    var userslist = [];
    var orquery = [];
    var orquery1 = [];
    var useroptions = [{label : "All" , value : ""}];
    var andquery = [];

    if (dates.length > 2) {
        return res.send({status : false , error : "Please provide date."});
    }
    var statusoptions = [
        {label : "All" , value : ""}
    ];

    let tconfig = req.pconfig["PaymentStatus_bool"];
    for (let i in tconfig) {
        statusoptions.push({value : tconfig[i],label : tconfig[i]});
    }

    let start = BASECONTROL.get_stand_date_end(dates[0]);
    let end = BASECONTROL.get_stand_date_end(dates[1]);
    var mainuser = BASECONTROL.getUserItem(req);

    userslist = await UsersControl.get_players_items(mainuser);

    for (let i in userslist) {
        orquery1.push({userid :mongoose.Types.ObjectId(userslist[i]._id)})
    }
 
    if (userid && userid.length > 0) {
        let useritem = await BASECONTROL.BfindOne(UserModel,{_id : userid});
        if (useritem) {
            userslist = [];
            userslist.push(useritem)
        } else {
            return res.send({status : false , error : "Please provide date."});
        }
    }
    if (status && status.length > 0) {
        andquery = [ {createDate :{$gte: start, $lte:end} , status : status  } ]        
    } else {
        andquery = [ {createDate :{$gte: start, $lte:end} } ]
    }
    for (let i in userslist) {
        orquery.push({userid :mongoose.Types.ObjectId(userslist[i]._id)});
    }

    if (orquery.length > 0) {
        
        let dd= await  TransactionsHistory.aggregate([
            {
                $match: { 
                    $and: andquery,
                    $or : orquery
                }
            },
            {
                $group: {
                    _id: { 
                        "status": "$status",
                        "wallettype": "$wallettype",
                    },
                    AMOUNT: {$sum: '$amount'},
                    COUNT: {$sum: 1},
                }
            },
            {
                $group: {
                    _id: "$_id.wallettype",
                    "wallets": { 
                        "$push": { 
                            "status": "$_id.status",
                            "COUNT": "$COUNT",
                            "AMOUNT": "$AMOUNT",
                        },
                    },
                }
            }
        ]);

        let array = dd;

        for (var i in array) {
            let item = array[i]["wallets"];
            let row = {};
            for (let i in tconfig) {
                row[tconfig[i]] = {index : 0 , amount : 0}
            }
            for (let j in item) {
                row[item[j]['status']] = { index : item[j]["COUNT"] , amount : item[j]["AMOUNT"]};
            }

            total.push({type : array[i]["_id"],value : row});
        }

        let options = await this.getrealplayerscount(start,end,orquery1);
        useroptions = [...useroptions ,...options];
    }

    console.log(total)

    res.json({status : true,data : {total,statusoptions,useroptions}})
    return next();
}


exports.getrealplayerscount =  async (start,end,orquery) =>{
    let betuser =  await TransactionsHistory.aggregate(
        [
            {
                $match:    
                { 
                    $and: [ { "createDate": { $gte: start,$lte: end } }],
                    $or : orquery
                },
            },
            {
                $group: 
                {  
                    _id: "$userid",
                }
            },
            {
                "$lookup": {
                    "from": "user_users",
                    "localField": "_id",
                    "foreignField": "_id",
                    "as": "user"
                }
            },
            { "$unwind": "$user" },
            { "$project":{
                label:'$user.username',
                value: "$user._id", 
           }}
        ]
    )

    return betuser;
}

exports.admin_WithdrawHistoryLoad = async(req,res,next,string = null)=>{

    let filters = req.body.filters;
    let params = req.body.params;
    let dates = filters.dates;
    let userid = filters.userid;
    let status = filters.status;
    let array = [];
    var andquery = []
    if (dates.length > 2) {
        return res.send({status : false , error : "Please provide date."});
    }

    var start = BASECONTROL.get_stand_date_first(dates[0]);
    var end = BASECONTROL.get_stand_date_first(dates[1]);
    var mainuser = BASECONTROL.getUserItem(req);
    // var userslist = await UsersControl.get_players_items(mainuser);
    let orquery = [];
    if (userid && userid.length > 0) {
        let useritem = await BASECONTROL.BfindOne(UserModel,{_id : userid});
        if (useritem) {
            userslist.push(useritem)
        } else {
            return res.send({status : false , error : "Please provide date."});
        }
    } else {
        userslist = await UsersControl.get_players_items(mainuser);
    }

    if (status && status.length > 0) {
        andquery = [ { "createDate": { $gte: start ,$lte: end } ,wallettype : "WITHDRAWL" , status : status}]
    } else {
        andquery = [ {createDate :{$gte: start, $lte:end} ,wallettype : "WITHDRAWL" } ]
    }
    
    for (var i in userslist) {
        orquery.push({userid :mongoose.Types.ObjectId(userslist[i]._id)});
    }

    if (orquery.length > 0) {

        let totalcount =  await TransactionsHistory.countDocuments(
            { 
                $and: andquery,
                $or : orquery 
            })
            var pages = ReportControl.setpage(params,totalcount);

        if (totalcount > 0) {

            array =  await TransactionsHistory.find(
            { 
                $and: andquery,
                $or : orquery
            },
            ).populate("userid").sort({createDate : -1}).skip(pages.skip).limit(pages.limit);
        }
        pages["skip2"] = (pages.skip) + array.length;
    }  

    res.json(
    {
        status:true, 
        data:array,
        pageset : pages,
        error : string
    })
    return next(); 
}

exports.cashpayout = async (req,res,next) =>{

    var payoutdetail = req.body.payoutdetail;
    var paymentmenuid = req.body.paymentmenuid;
    
    var order_no = new Date().valueOf();
    var indata = req.body.data;
    var email = req.user.email;

    console.log(req.body)
    if (!payoutdetail || !paymentmenuid) {
        res.json({ status : false, data: 'fail' })
        return next()
    }

    
    var p_item = await BASECONTROL.BfindOne(GamePlay,{email : email});
    if (!p_item) {
        res.json({ status : false, data: 'fail' })
        return next()
    } 
    
    indata.amount = parseInt(indata.amount);
    if (parseInt(indata.amount) > p_item.balance) {
        res.json({ status : false, data: 'Insufficient funds' })
        return next()
    }

    await BASECONTROL.BfindOneAndUpdate(paymentuserdetail,{userid : mongoose.Types.ObjectId(p_item.id),paymentconfigid : paymentmenuid},{paymentData : payoutdetail});
    
    let percent = 0;
    let configs = await this.getConFig("WithdrawalComission");
    if (configs && configs.status) {
        console.log(configs)
        percent = parseInt(configs.comission)
        console.log(percent)
    } 
    
    var commission = indata.amount * percent / 100;
    var amount  = indata.amount - commission;

    console.log(commission)
    console.log(amount)
    let row ={};
    row["type"] = "cash";
    row["email"] = email;
    row["commission"] = commission;
    row["order_no"] = order_no;
    row["status"] = PCONFIG.Pending;
    row["amount"] = amount;
    row["wallettype"] = "WITHDRAWL";
    row["userid"] = mongoose.Types.ObjectId(p_item.id);
    row["lastbalance"] = p_item.balance;
    
    let transrow = new TransactionsHistory(row);

    // amount

    var wallets_ = {
        commission: commission,
        status :"WITHDRAWL",
        roundid :order_no,
        transactionid : order_no,
        userid : mongoose.Types.ObjectId(p_item.id),
        debited : amount,
        credited : 0,
        lastbalance : p_item.balance,
        paymentid : mongoose.Types.ObjectId(transrow._id)
    }
    var u_data = await BASECONTROL.email_balanceupdate(email,indata.amount * -1,wallets_);
    if (u_data !== false) {
        transrow["updatedbalance"] = u_data;
    
        var rdata = await BASECONTROL.BSave(transrow);
        if( rdata){
            this.WithdrawHistoryLoad(req,res,next);
        }else{
            res.json({ status : false, data: 'fail' })
            return next()
        }
    }   else {
        res.json({ status : false, data: 'fail' })
        return next()
    }
}

exports.deposit_withdrawl_historyload = async (req,res,next) =>{
    
    let data = req.body.row;
    let params = req.body.params;
    let start = BASECONTROL.get_stand_date_end(data.start);
    let end = BASECONTROL.get_stand_date_end(data.end);
    var andquery = {
        createDate :{$gte: start, $lte:end},userid : mongoose.Types.ObjectId(data.id),
    }

    
    let totalcount = await TransactionsHistory.countDocuments(andquery);
    var pages = ReportControl.setpage(params,totalcount);
    var rows = [];
    if (totalcount > 0) {
        rows=  await TransactionsHistory.find(andquery).sort({createDate : -1}).skip(pages.skip).limit(pages.limit);
    }
    pages["skip2"] = (pages.skip) + rows.length;

    res.json({status : true, data :rows,pageset : pages,});
    return next();

}