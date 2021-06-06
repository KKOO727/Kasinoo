const BASECONTROL = require("../basecontroller")
const { Paymentconfig, PaymentMenuModel,paymentuserdetail,payoutchannel, resstrictionDays} = require("../../models/paymentGateWayModel")
var mongoose = require('mongoose');
const reportsControl = require("../reportcontroller")
const usercontrol = require("../userscontroller")
const cashconfigid = "5ff884449a092214343aa2e2";
const PCONFIG = require("../../config/pconfig")
const moment= require('moment')
const Paymoro = require("./paymoro");

exports.Loadresstrictiondays = async (req, res ,next) => {
    let params = req.body.params;
    let filters = req.body.filters;
    if (params && filters) {
        let array = [];
        let pages = {};
        let totalcount = await resstrictionDays.countDocuments({type : filters});
        pages = reportsControl.setpage(params,totalcount);
        if (totalcount > 0) {
            array = await resstrictionDays.find({type : filters}).skip(pages.skip).limit(pages.limit);
        } 
        pages = reportsControl.setpage(params,0);
        
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

exports.Saveresstrictiondays = async (req, res ,next) => {
    let row = req.body.row;

    let item = {
        comment : row.comment,
        RestrictionDate: moment(new Date(row.RestrictionDate)).format('YYYY-MM-DD'),
        type : row.type
    }

    let lastitem = await BASECONTROL.BfindOne(resstrictionDays, {RestrictionDate : item.RestrictionDate, type : item.type});
    if (lastitem) {
        res.send({status : false, data : "already exist"});
        return next();
    } else {
        let sh = await BASECONTROL.data_save(item,resstrictionDays);
        if (sh) {
            this.Loadresstrictiondays(req,res,next);
        } else {
            res.send({status : false, data : "error"});
            return next(); 
        }
    }
}

exports.Updateresstrictiondays = async (req, res ,next) => {
    let row = req.body.row;
    if (row) {
        let paymentData = {
            comment : row.comment,
            RestrictionDate: moment(new Date(row.RestrictionDate)).format('YYYY-MM-DD'),
            type : row.type
        }
        let up = await BASECONTROL.BfindOneAndUpdate(resstrictionDays , {_id : row._id} , paymentData);
        if (up) {
            this.Loadresstrictiondays(req,res,next);
        } else {
            res.send({status : false, data : "error"});
            return next();
        }
    } else {
        res.send({status : false, data : "error"});
        return next();
    }
}


exports.deleteresstrictiondays = async (req, res ,next) => {
    let data = req.body.row;
    if (data) {
        let Dhan = await BASECONTROL.BfindOneAndDelete(resstrictionDays,{_id : data._id});
        if (Dhan) { 
            this.Loadresstrictiondays(req,res,next);
        } else {
            res.send({status : false, data : "error"});
            return next();
        } 

    }else {
        res.send({status : false, data : "error"});
        return next();
    }
}

exports.getbanktotal = async (req,res,next) => {
    let mainuser = req.user;
    let userslist = await usercontrol.get_players_items(mainuser);
    let useroptions = [{value : "" , label : "All"}];
    for (var i in userslist) {
        useroptions.push({
            label : userslist[i].email,
            value : userslist[i]._id
        })
    }

    res.send({status : true, data : useroptions});
    return next(); 

}

exports.getbankdetail = async (req,res,next) =>{
    let params = req.body.params;
    let filters = req.body.filters;
    if (params && filters) {
        let array = [];
        let orquery = [];
        let mainuser = req.user;
        let userid = filters.userid;
        let pages = {};
        if (userid && userid.length > 0) {
            orquery.push({userid : mongoose.Types.ObjectId(userid)})
        } else {
            let userslist = await usercontrol.get_players_items(mainuser);
            for (var i in userslist) {
                orquery.push({userid :mongoose.Types.ObjectId(userslist[i]._id)})
            }
        }

        if (orquery.length > 0) {
            let totalcount = await paymentuserdetail.countDocuments({paymentconfigid: mongoose.Types.ObjectId(cashconfigid) , $or : orquery});
            pages = reportsControl.setpage(params,totalcount);
            if (totalcount > 0) {
                array = await paymentuserdetail.find({paymentconfigid: mongoose.Types.ObjectId(cashconfigid),$or : orquery}).skip(pages.skip).limit(pages.limit).populate("paymentconfigurationid").populate("userid");
            } 
        } else {
            pages = reportsControl.setpage(params,0);
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

exports.savebankdetail = async (req,res,next) =>{
    
    let row = req.body.row;
    let item = {
        paymentconfigid : cashconfigid,
        paymentData : row,
        userid : row.userid
    }

    let lastitem = await BASECONTROL.BfindOne(paymentuserdetail, {userid : mongoose.Types.ObjectId(row.userid),paymentconfigid: mongoose.Types.ObjectId(cashconfigid)});
    if (lastitem) {
        res.send({status : false, data : "already exist"});
        return next();
    } else {
        let sh = await BASECONTROL.data_save(item,paymentuserdetail);
        if (sh) {
            this.getbankdetail(req,res,next);
        } else {
            res.send({status : false, data : "error"});
            return next(); 
        }
    }
}

exports.updatebankdetail = async (req,res,next) =>{
    let row = req.body.row;
    if (row) {
        let paymentData = {
            accountName : row.accountName,
            accountNumber: row.accountNumber,
            IfscCode: row.IfscCode,
            depositBankCode: row.depositBankCode,
            paymerodepositBankCode : row.paymerodepositBankCode
        }
        let up = await BASECONTROL.BfindOneAndUpdate(paymentuserdetail , {_id : row._id} ,{paymentData : paymentData});
        if (up) {
            this.getbankdetail(req,res,next);
        } else {
            res.send({status : false, data : "error"});
            return next();
        }
    } else {
        res.send({status : false, data : "error"});
        return next();
    }
}

exports.deletebankdetail = async (req,res,next) =>{
    let data = req.body.row;
    if (data) {
        let Dhan = await BASECONTROL.BfindOneAndDelete(paymentuserdetail,{_id : data._id});
        if (Dhan) { 
            this.getbankdetail(req,res,next);
        } else {
            res.send({status : false, data : "error"});
            return next();
        } 

    }else {
        res.send({status : false, data : "error"});
        return next();
    }
}

exports.getPayoutchannel = async (req,res,next) => {

    let params = req.body.params;
    if (params) {
        let totalcount = await payoutchannel.countDocuments();
        let pages = reportsControl.setpage(params,totalcount);
        let array = [];
        let typeoptions = await Paymentconfig.aggregate([
            {
                $project:{
                    label:'$type',
                    value:'$_id',
               }
            }
        ]);
        let paymoroBanks = await Paymoro.paymoroGettingPayoutBanks();
        
        let yaarpaybanks = [
            {
                "value" : "YP_AXIS", 
                "label" : "Axis Bank"
            }, 
            {
                "value" : "YP_ICICI", 
                "label" : "ICICI Bank"
            }, 
            {
                "value" : "YP_INDNB", 
                "label" : "Indian Bank"
            }
        ]

        if (totalcount > 0) {
            array = await payoutchannel.find().skip(pages.skip).limit(pages.limit).populate("paymentconfigurationid");
        } 
        
        pages["skip2"] = (pages.skip) + array.length;
        res.send({
            status : true ,data:array, 
            pageset : pages,
            typeoptions : typeoptions,
            yaarpaybanks : yaarpaybanks,
            paymoroBanks : paymoroBanks
        });
        return next();

    } else {
        res.send({status : false, data : "error"});
        return next(); 
    }
}

exports.savePayoutchannel = async (req,res,next) => {
    let data = req.body.row;
    let row = {
        bank : data.bank,
        accountName : data.accountName,
        status : data.status,
        paymentconfigurationid : mongoose.Types.ObjectId(data.type)
    }
    if (data) {
        let lastpayout = await BASECONTROL.BfindOne(payoutchannel, {paymentconfigurationid : row.paymentconfigurationid});
        if (lastpayout) {
            res.send({status : false, data : "already exist"});
            return next();
        } else {
            if (data.status) {
                let update = await payoutchannel.findOneAndUpdate({status : true},{status : false});
            }
            let sh = await BASECONTROL.data_save(row, payoutchannel);
            if (sh) {
                this.getPayoutchannel(req,res,next);
            } else {
                res.send({status : false, data : "error"});
                return next();                
            }
        }
    } else {
        res.send({status : false, data : "error"});
        return next();
    }
}

exports.updatePayoutchannel = async (req,res,next) =>{
    let data = req.body.row;
    if (data) {

        if (data.status) {
            let update = await payoutchannel.findOneAndUpdate({status : true},{status : false});
        }
        let row = data;
        row["paymentconfigurationid"] = mongoose.Types.ObjectId(data.type)
        let update = await payoutchannel.findOneAndUpdate({_id : data._id},row);
        if (update) {
            this.getPayoutchannel(req,res,next)
        } else {
            res.send({status : false, data : "error"});
            return next();
        }
    } else {
        res.send({status : false, data : "error"});
        return next();
    }
}

exports.activechangepayoutchnnel = async (req,res,next) =>{
    let data = req.body.row;
    if (data) {
        if (data.status) {
            let update = await payoutchannel.findOneAndUpdate({status : true},{status : false});
        }
        let row = data;
        let update = await payoutchannel.findOneAndUpdate({_id : data._id},row);
        if (update) {
            this.getPayoutchannel(req,res,next)
        } else {
            res.send({status : false, data : "error"});
            return next();
        }
    } else {
        res.send({status : false, data : "error"});
        return next();
    } 
}

exports.deletePayoutchannel = async (req,res,next) =>{
    let data = req.body.row;
    if (data) {
        let Dhan = await BASECONTROL.BfindOneAndDelete(payoutchannel,{_id : data._id});
        if (Dhan) { 
            this.getPayoutchannel(req,res,next);
        } else {
            res.send({status : false, data : "error"});
            return next();
        } 

    }else {
        res.send({status : false, data : "error"});
        return next();
    }
}


exports.BalanceUpdate = async(email, amount,order_no,wallets)=>{

   
    
}

exports.PayoutOrder = async(req,res,next,mainuser)=>{

    return res.json({ status:true,data : ""});
}

exports.paymentConfigSave = async(req,res,next)=>{
    let data = req.body.params;
    let error = await Paymentconfig.findOneAndUpdate({type:data.type}, data, { upsert: true });
    if(error){
        return res.json({status:true, data:"success"})
    }else{
        return res.json({status:false, data:"error"})
    }
}

exports.paymentConfigLoad = async(req,res,next)=>{
    let result = await Paymentconfig.findOne({ type:req.body.type })
    if(result){
        return res.json({ status:true, data:result })
    }else{
        return res.json({ status:false, data:'error' })
    }
}

exports.menuupdate = async(req,res,next)=>{
    var indata = req.body.data;
    if (indata && indata.length > 0) {
        for(let i in indata)
        {
            await BASECONTROL.BfindOneAndUpdate(PaymentMenuModel,{_id : {_id : indata[i]._id}},indata[i]);
        }
        this.adminmenuload(req,res,next);
    } else {
        return res.json({status : false,data : "fail"})
    }

}

exports.menusave = async(req,res,next)=>{
    var indata = JSON.parse(req.body.data);
    let image = req.body.imagesrc;
    if(image){
        indata["image"] = image;
    }

    req.body.params = indata.parsedFilter;
    
    if(indata._id){

        indata["paymentconfigurationid"] = mongoose.Types.ObjectId(indata.type);
        let udata = await BASECONTROL.BfindOneAndUpdate(PaymentMenuModel,{_id : indata._id},indata);
        if(udata){
            this.adminmenuload(req,res,next);
        }else{
            return res.json({status : false,data : "fail"})
        }
    }else{
        var top =  await BASECONTROL.BSortfind(PaymentMenuModel,{},{order : -1});
        let order = 0;
        if(top.length > 0){
            order = top[0]["order"] + 1;
        }
        indata["order"] = order;
        indata["paymentconfigurationid"] = mongoose.Types.ObjectId(indata["type"]);
        let savehandle = await BASECONTROL.data_save(indata,PaymentMenuModel)
        if(!savehandle){
            return res.json({status : false,data : "fail"})
        }else{
            this.adminmenuload(req,res,next);
        }
    }
}

exports.menudelete = async(req,res,next)=>{
    var indata = req.body.data;
    var outdata = await BASECONTROL.BfindOneAndDelete(PaymentMenuModel,{_id : indata._id});
    if(!outdata){
        return res.json({status : false,data : "fail"})
    }else{
        this.adminmenuload(req,res,next);
    }
}


exports.adminmenuload = async(req,res,next)=>{
    
    let typeoptions = await Paymentconfig.aggregate([
        {
            $project:{
                label:'$type',
                value:'$_id',
            }
        }
    ]);
    let array = await PaymentMenuModel.find().sort({order : 1}).populate({ path : "paymentconfigurationid" , select : "type"});
    res.send({
        status : true ,data:array, 
        typeoptions : typeoptions
    });
    return next();
}

exports.playermenuloads = async(req,res,next)=>{
    

    let today =  moment(new Date()).format('YYYY-MM-DD');
    var type = req.body.type;

    if (type == 2) {
        let isCheck = await resstrictionDays.findOne({ type : "payment",RestrictionDate : {  $regex :today}});
        if (isCheck) {
            return res.json({status:false, data:isCheck.comment})
        } else {

        }
    }

    var PAYMENTCONFIG = req.pconfig;
    let query  = {
        status : true,
    }
    if(type == PAYMENTCONFIG.WalletType.Withdrawl){
        query["paymentMethodType.value"] = "payout";
    }else{
        query["paymentMethodType.value"] = "deposit";
    }

    let findhandle = await PaymentMenuModel.find(query).sort({order : 1}).populate("paymentconfigurationid");
    if(!findhandle){
        return res.json({status:false, data:{bool:3, data:"server error"}})
    }else{
        let rows = [];
        let id = req.user._id;
        for(let i in findhandle){

            let row =  findhandle[i]._doc ? findhandle[i]._doc : findhandle[i] ;
            
            if (row.paymentType == "PMNetBanking") {
                row['depositBankCode'] = await Paymoro.paymoroGettingNetBankingBanks(findhandle[i].paymentconfigurationid.configData);
            } else if (row.paymentType == "Wallet") {
                row['depositBankCode'] = await Paymoro.paymoroGettingWalletBanks(findhandle[i].paymentconfigurationid.configData);
            } else if (row.paymentType == "CASH") {
                row['depositBankCode'] = await Paymoro.paymoroGettingPayoutBanks(findhandle[i].paymentconfigurationid.configData);
            }

            let itemuser = await BASECONTROL.BfindOne(paymentuserdetail,{userid : id,paymentconfigid: mongoose.Types.ObjectId(row._id)});
            let userdetail =  itemuser && itemuser._doc ? itemuser._doc.paymentData : null;

            row = Object.assign(row,{userdetail : userdetail});
            rows.push(row);
        }
        return res.json({status:true, data:rows})
    }
}