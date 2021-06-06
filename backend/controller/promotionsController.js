const BASECONTROLL = require("./basecontroller");
const bethistory_model = require('../models/bethistory_model').BettingHistory_model;  
const BonusMenuModel = require("../models/promotion_model").BonusMenumodel;
const BonusHistory = require("../models/promotion_model").BonusHistory;
const BonusConfig = require("../models/promotion_model").BonusConfig;
const mongoose = require('mongoose');
const reportcontrol = require("./reportcontroller")
const UsersControl = require("./userscontroller")

exports.getBonusTotal = async (req,res,next) => {
    
    let filters = req.body.filters;
    let dates = filters.dates;
    let userslist = [];
    let orquery = [];
    let andquery = [];
    var useroptions = [{"label" : "All",value : ""}];
    var bonusoptions = [{"label" : "All",value : ""}];

    if (dates.length > 2) {
        return res.send({status : false , error : "Please provide date."});
    }
    
    let options = await this.bonusoptions();
    bonusoptions = [...bonusoptions,...options];
    
    var start = BASECONTROLL.get_stand_date_first(dates.start);
    var end = BASECONTROLL.get_stand_date_first(dates.end);
    
    var role = BASECONTROLL.getUserItem(req)

    userslist = await UsersControl.get_players_items(role);
    for (var i in userslist) {
        orquery.push({userid :mongoose.Types.ObjectId(userslist[i]._id)})
    }

    if(orquery.length > 0) {

        andquery = [{ createdAt : {$gte : start , $lte : end}},{isdelete : false}];
        
        let betuser =  await BonusHistory.aggregate(
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

    res.json(
    {
        status:true, 
        data :  { 
            useroptions : useroptions ,
            bonusoptions : bonusoptions
        },
    })
    return next();      
}

exports.BonusConfig = async (req,res,next) => {
    let method = req.body.method;
    switch (method) {
        case "get":
            this.getBonusConfig(req,res,next);
        break;
        case "set":
            this.setBonusConfig(req,res,next);
        break;
        default:
            res.send({ status : false , data : "Method Failed"})
            return next();
    }
}

exports.getBonusConfig = async (req,res,next) => {
    let options = await this.bonusoptions();
    let data = await BonusConfig.findOne({type : "bonus"});
    let row = {
        options : options,
        data : data
    }
    res.send({
        status : true,
        data : row
    })
}

exports.setBonusConfig = async (req,res,next) => {
    let data = req.body.data;
    if (data) {
        let up = await BonusConfig.findOneAndUpdate({type : "bonus"},{type : "bonus",bonusid : mongoose.Types.ObjectId(data.bonusid),status : data.status},{upsert : true ,new : true});
        if (up) {
            res.send({status : true ,data : "success"})
            return next();            
        } else {
            res.send({ status : false , data : "fail"})
            return next();            
        }
    } else {
        res.send({ status : false , data : "fail"})
        return next();
    }
}

exports.bonusoptions = async () => {
    let data = await BonusMenuModel.aggregate([
        {
            $match : {
                $and : [{status : true, isdelete : false}]
            }
        },
        {
            $project : {
                label:'$Bonusname',
                value:'$_id',
            }
        }
    ]);
    let options = [];
    options = [...options,...data];
    return options;
}

exports.getBonusitems = async (req,res,next) => {
    let options = await this.bonusoptions();
    if (options) {
        res.send({status : true, data : options});
        return next();
    } else {
        res.send({status : false, data : "error"});
        return next();
    }
}

exports.getBonusHistory = async (req,res,next) => {
    let params = req.body.params;
    let filters = req.body.filters;
    if (params && filters) {
        let rows=[];
        let orquery = [];
        let userid = filters.userid;
        let bonusid =filters.bonusid;
        let mainuser = req.user;

        let dates = filters.dates;
        var start = BASECONTROLL.get_stand_date_first(dates.start);
        var end = BASECONTROLL.get_stand_date_first(dates.end);

        if (userid && userid.length > 0) {
            orquery.push({userid : mongoose.Types.ObjectId(userid)})
        } else {
            let userslist = await UsersControl.get_players_items(mainuser);
            for (var i in userslist) {
                orquery.push({userid :mongoose.Types.ObjectId(userslist[i]._id)})
            }
        }

        var andquery = {};
        if (userid && userid.length) {
            andquery = { $or : orquery,createdAt :  {$gte : start , $lte : end},bonusid : mongoose.Types.ObjectId(bonusid)};
        } else {
            andquery = { $or : orquery,createdAt :  {$gte : start , $lte : end}};
        }

        let totalcount = await BonusHistory.countDocuments(andquery);
        var  pages = reportcontrol.setpage(params,totalcount);
        let array = await BonusHistory.find(andquery).sort({createdAt : -1}).skip(pages.skip).limit(pages.limit).populate("userid").populate("bonusid");
        pages["skip2"] = (pages.skip) + array.length;

        for (var i in array) {

            var bitem = array[i]['bonusid'];
            if (bitem.bonusid && bitem.bonusid.length) {
                bitem = await BonusMenuModel.findOne({_id : bitem.bonusid});
            }

            let row = {};
            let item = array[i]._doc;
            let start = new Date(item['createdAt']);
            let end = new Date(item['expiredAt']);
            if (end.getTime() > new Date().getTime()) {

                let Achivedamount =  await this.getWagerFromDate(start,end,item.userid._id);
                let wager =  item.amount;
                let remaind = wager - Achivedamount;
                if (remaind > 0 ) {
                    row['accept'] = false;
                } else {
                    if (item.status != "1") {
                        row['accept'] = true;
                    }
                }

                row['Achivedamount'] = Achivedamount;
                
                row = Object.assign(item,row);
                row['bonusid'] = bitem._doc;
                rows.push(row)
            } else {
                // await BonusHistory.findOneAndUpdate({_id : item._id},{status : "2"})
            }

        }


        res.send({
            status : true ,data:rows, 
            pageset : pages,
        });
        return next();

    } else {
        res.send({status : false, data : "error"});
        return next(); 
    }
}

exports.bonus_menuload = async(req,res,next) =>{
    let params = req.body.params;
    if (params) {

        let options = await this.bonusoptions();
        let totalcount = await BonusMenuModel.countDocuments({isdelete : false});
        var  pages = reportcontrol.setpage(params,totalcount);
        let array = await BonusMenuModel.find({isdelete : false}).sort().skip(pages.skip).limit(pages.limit);
        pages["skip2"] = (pages.skip) + array.length;

        res.send({
            status : true ,data:array, 
            pageset : pages,
            options : options
        });
        return next();

    } else {
        res.send({status : false, data : "error"});
        return next(); 
    }
}

 exports.bonusmenu_delete =async (req,res,next)=>{
    var indata = req.body.data;
   if (indata) {
       var outdata =  await BASECONTROLL.BfindOneAndUpdate(BonusMenuModel,{_id : indata._id},{isdelete : true}) 
       if(!outdata){
           res.json({status : false,data : "fail"})
           return next();
       }else{
           this.bonus_menuload(req,res,next);
       }

   } else {
        res.json({status : false,data : "fail"})
        return next();
   }
}

 exports.bonusmenu_save = async(req,res,next)=>{
    var indata = req.body.data;
    if (indata) {
        let order = 1;
        let total = await BonusMenuModel.find({isdelete : false}).sort({order : -1}).limit(1);
        if (total.length > 0) {
            order = total[0]['order'] + 1;
        }
        indata['order'] = order;
        let d = new BonusMenuModel(indata);
        d['bonusid'] = d._id;
        var savehandle = await BASECONTROLL.BSave(d);
        if (!savehandle) {
            res.json({status : false,data : "fail"});
            return next();
        } else {
            this.bonus_menuload(req,res,next);
        }
    } else {
        res.json({status : false,data : "fail"});
        return next();
    }
}

 exports.bonus_menuupdate =async (req,res,next)=>{
    var indata = req.body.data;
    for(var i = 0 ; i < indata.length ; i++)
    {
        var updatehandle =  await BASECONTROLL.BfindOneAndUpdate(BonusMenuModel,{_id : indata[i]._id},indata[i],);
        if (!updatehandle) {
            res.json({status : false,data : "fail"});
            return next();
        }
    }
    this.bonus_menuload(req,res,next);
}

exports.Claim_request = async(req,res,next)=>{

    let bonusitem = req.body.data;

    
    let update = await this.AcceptBonus(bonusitem);
    if (update) {
        this.bonus_menuloads(req,res,next);
    } else {
        res.json({status : false,data : "fail"});
        return next();
    }
}
 

exports.AcceptBonus =async (bonusitem) => {

    let his = await BonusHistory.findOne({_id : bonusitem._id, status : "0"}).populate("userid").populate("bonusid");
    if (his) {
        let amount = his.amount;
        let order_no = new Date().valueOf();
        var wallets_ = {
            commission:0,
            status :"WITHDRAWL",
            roundid :order_no,
            transactionid : order_no,
            userid : mongoose.Types.ObjectId(his.userid._id),
            credited : 0,
            debited : amount,
            lastbalance : his.userid.playerid.bonusbalance,
            bonus : true,
            bonushisid : mongoose.Types.ObjectId(his._id)
        }

        var wallets_1 = {
            commission:0,
            status :"DEPOSIT",
            roundid :order_no,
            transactionid : order_no,
            userid : mongoose.Types.ObjectId(his.userid._id),
            credited : amount,
            debited : 0,
            lastbalance : his.userid.playerid.balance,
            // bonus : true,
            bonushisid : mongoose.Types.ObjectId(his._id)
        }

        var  plcurrent =  await BASECONTROLL.email_bonusbalanceupdate(his.userid.email,amount * -1,wallets_); 
        var  balcurrent =  await BASECONTROLL.email_balanceupdate(his.userid.email,amount,wallets_1); 

        var up = await BonusHistory.findOneAndUpdate({_id : bonusitem._id}, {status : "1"});
        if (up && plcurrent !== false && balcurrent !== false) {
            return true
        } else {
            return false;
        }
    } else {
        return false;
    }
}

exports.CreditBonus = async(req,res,next)=>{

    let bonusitem = req.body.row;
    let update = await this.AcceptBonus(bonusitem);
    if (update) {
        this.getBonusHistory(req,res,next);
    } else {
        res.json({status : false,data : "fail"});
        return next();
    }
}
    
exports.bonus_menuloads = async(req,res,next)=>{

    let userid = req.user._id;
    let his = await BonusHistory.find({ status : "0", userid : mongoose.Types.ObjectId(userid)}).populate("bonusid");
    let array = [];

    for (var i in his) {
        let item = his[i]._doc;
        let start = new Date(item['createdAt']);
        let end = new Date(item['expiredAt']);
        if (end.getTime() > new Date().getTime()) {

            var bitem = his[i]['bonusid'];
            if (bitem.bonusid && bitem.bonusid.length) {
                bitem = await BonusMenuModel.findOne({_id : bitem.bonusid,isdelete : false});
            }


            let amount =  await this.getWagerFromDate(start,end,userid);
            let wager =  item.amount;
            let remaind = wager - amount;
            let row = Object.assign({},bitem._doc);
            row['amount'] = item['amount'];
            row['_id'] = item['_id'];
            row['createdAt'] = item['createdAt'];
            row['expiredAt'] = item['expiredAt'];

            if (remaind > 0 ) {
                row['accept'] = false;
                row['remaind'] = remaind;
            } else {
                row['accept'] = true
            }


            array.push(row)

        } else {
            // await BonusHistory.findOneAndUpdate({_id : item._id},{status : "2"})
        }
    }
    res.send({status : true , data : array});
    return next()
}

exports.getWagerFromDate  = async (start, end, userid) => {
    let dd = await bethistory_model.aggregate([
        {
            $match : {
                $and : [{DATE : {$gte : start , $lte : end}, userid : mongoose.Types.ObjectId(userid), TYPE:'BET'}]
            },
        },
        {
            $group : { 
                _id :  "$TYPE",
                "wager": { "$sum": "$AMOUNT" },
            }
        }
    ]);
    let amount  = 0;
    if (dd.length > 0) {
        amount = dd[0]['wager']; 
    }
    return amount
}

