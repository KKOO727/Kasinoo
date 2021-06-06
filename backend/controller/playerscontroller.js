const users_model = require("../models/users_model");
const sessionmodel = users_model.usersessionmodel;
const gamesessionmodel = users_model.gamesessionmodel;
const playersUser = users_model.GamePlay;
const Users = users_model.adminUser;
const totalusermodel = users_model.totalusermodel;
const totalgamesusermodel = users_model.totalgamesusermodel;
const wallethistory = users_model.wallethistory;
const {TransactionsHistory} = require("../models/paymentGateWayModel");
var mongoose = require('mongoose');
const parse = require('xml-parser');
const BASECONTROL = require("./basecontroller");
const request  = require("request");
const BASECONFIG = require("../servers/provider.json");
const HOMECONFIG = require("../servers/home.json");
const MAINCONFIG = require("../config/index.json");
const UsersControl = require("./userscontroller");
const playerlimits = users_model.playerlimit;
const documentModel = require('../models/profile_model').documentModel;
const Satta_ModelS = require('../models/matka_model');
const BazaarModel = Satta_ModelS.BazaarModel;
const matka_betmodels = Satta_ModelS.matka_betmodels;
const Amount_Type =MAINCONFIG.AMOUNT_TYPE;
const GAMELISTMODEL = require("../models/games_model").GAMELISTMODEL;
const bethistory_model = require('../models/bethistory_model').BettingHistory_model;  
const Reportscontrol = require("./reportcontroller");
const { adminUser, GamePlay } = require("../models/users_model");
const BonusMenuModel = require("../models/promotion_model").BonusMenumodel;
const BonusHistory = require("../models/promotion_model").BonusHistory;
const PCONFIG = require("../config/pconfig")
const {firstpagesetting} = require("../models/firstpage_model")
const SATACONFIG = require("../config/sconfig")

exports.players_load = async(req,res,next)=>{

    var role = BASECONTROL.getUserItem(req);
    var userslist = await UsersControl.get_players_items(role);
    res.json({
        status : true,
        data : userslist,
    });
    return next();
}

exports.get_inactivePlayers = async(req,res,next)=>{
    var role = BASECONTROL.getUserItem(req);
    var start = BASECONTROL.get_stand_date_first(req.body.start);
    var end = BASECONTROL.get_stand_date_end(req.body.end);
    var userslist = await UsersControl.get_players_items(role);
    var news = [];
    for(var i = 0 ; i < userslist.length ; i++){
        if(userslist[i].permission == MAINCONFIG.USERS.player ){
            var flag = await BASECONTROL.BfindOne(totalusermodel,{email : userslist[i].email, date :{$gte: start, $lte:end}});
            if(!flag ){
                news.push(userslist[i]);
            }
        }
    }
    res.json({
        status : true,
        data : news
    });
    return next();
}

exports.realtimeusers_load =async (req,res,next) =>{

    var mainuser = BASECONTROL.getUserItem(req);
    var playerslist = await UsersControl.get_players_items(mainuser);
    var start = BASECONTROL.get_stand_date_first(req.body.start);
    var end = BASECONTROL.get_stand_date_end(req.body.end);
    var indexs = await this.get_index_users(start,end,playerslist)
    var rdata = await BASECONTROL.Bfind(sessionmodel);
    var rows= [];
    for(var i in rdata){
        var item = playerslist.find(obj => obj.email == rdata[i].email);
        if(item){     
            let row = Object.assign({},item._doc ? item._doc  : item,rdata[i]._doc ? rdata[i]._doc  :rdata[i]);
            rows.push(row);
        }
    }
    if(!rows){ 
        res.json({
            status : false
        });
        return next();
    }else{
        res.json({
            status : true,
            data : rows,count : indexs
        });
        return next();
    }
}

exports.get_index_users = async (start,end,userlist) =>{
    var webindex = 0;
    var appindex = 0;
    var data = await totalusermodel.aggregate([
        {$match: { $and: [ { "date": { $gte: start ,$lte: end} }]}},
        {$group: { _id: { "email": "$email"}}}])
    if(data.length > 0){
        for(var i in data){
            var email = data[i]._id.email;
            var item = userlist.find(obj=>obj.email === email);
            if(item){
                if( item.signup_device){
                    appindex ++;
                }else{
                    webindex ++;
                }
            }
        }
    }
    return {webindex : webindex,appindex:appindex}
}


exports.get_index_players = async (start,end,userlist) =>{
    var webindex = 0;
    var appindex = 0;
    var data = await totalgamesusermodel.aggregate([
        {$match: { $and: [ { "date": { $gte: start ,$lte: end} }]}},
        {$group: { _id: { "email": "$email"}}}])
    if(data.length > 0){
        for(var i in data){
            var email = data[i]._id.email;
            var item = userlist.find(obj=>obj.email === email);
            if(item){
                if( item.signup_device){
                    appindex ++;
                }else{
                    webindex ++;
                }
            }
        }
    }
    return {webindex : webindex,appindex:appindex}
}

exports.gamesrealtimeusers_load = async (req,res,next) =>{
    var mainuser = BASECONTROL.getUserItem(req);
    var playerslist = await UsersControl.get_users_items(mainuser);
    var start = BASECONTROL.get_stand_date_first(req.body.start);
    var end = BASECONTROL.get_stand_date_end(req.body.end);
    var indexs = await this.get_index_players(start,end,playerslist)
    var rdata = await BASECONTROL.Bfind(gamesessionmodel);
    var rows = [];
    for(var i in rdata){
        var item = playerslist.find(obj => obj.email == rdata[i].email);
        if(item){
            var row = Object.assign({},rdata[i]._doc,{data : item._doc})
            rows.push(row);
        }
    }

    if(!rows){ 
        res.json({ status : false });
        return next();
    }else{
        res.json({ status : true, data : rows ,count : indexs});
        return next();
    }
}

exports.gamesrealtimeusers_delete = async (req,res,next) =>{
    
    var update = await BASECONTROL.BfindOneAndDelete(gamesessionmodel,{email : req.body.email});
    this.gamesrealtimeusers_load(req,res,next);
}

exports.balances_load= async(req,res,next) =>{
    var rdata = await BASECONTROL.Bfind(playersUser);
    if(!rdata){
        res.json({
            status : false
        })
    }else{
        res.json({status : true,
        data : rdata})
    }

}

exports.bonusoptions = async(amount, userid,id) => {

    let playeritem = await GamePlay.findOne({id : userid});
    let bonusid =  id;
    if (!bonusid && bonusid.length <= 0){
        return;
    }
    let reloadbonus = await BonusMenuModel.findOne({_id : mongoose.Types.ObjectId(bonusid),isdelete : false});
    if (reloadbonus) {
        let min = reloadbonus.min;
        let max = reloadbonus.max;
        let bonus = 0;
        if (amount >= min && amount <= max) {
            bonus = amount;
        } else if (amount > max) {
            bonus = max;
        } else {
            return true;
        }
        let bonusamount = bonus * (reloadbonus.percent / 100);

        let expiredAt = new Date(new Date().valueOf() + (60 * 60 * 1000 * 24) * parseInt(reloadbonus.timeline));
        let row = {
            userid : mongoose.Types.ObjectId(playeritem.id),
            bonusid : mongoose.Types.ObjectId(reloadbonus._id),
            status : "0",
            expiredAt :expiredAt ,
            amount : bonusamount,
            lastbalance : playeritem.bonusbalance,
            walletbalance : amount,

        }
        let sd = new BonusHistory(row);

        let order_no = new Date().valueOf();

        var wallets_ = {
            commission:0,
            status :"DEPOSIT",
            roundid :order_no,
            transactionid : order_no,
            userid : mongoose.Types.ObjectId(playeritem.id),
            credited : bonusamount,
            debited : 0,
            lastbalance : playeritem.bonusbalance,
            bonus : true,
            bonushisid : mongoose.Types.ObjectId(sd._id)
        }

        var  plcurrent =  await BASECONTROL.email_bonusbalanceupdate(playeritem.email,bonusamount,wallets_); 
        sd["updatedbalance"] = plcurrent;

         await BASECONTROL.BSave(sd);
      
    } else {
        return true
    }
}

exports.deposit_func  = async(req) =>{

    
    var item = BASECONTROL.getUserItem(req);
    var inputdata = req.body.data;
    if(!inputdata ){
        return({ status : false,data : "Please provide valid data."});
    }
    var bonusid = inputdata.bonusid;
    var amount = parseInt(inputdata.amount);
    var amounttype = inputdata.amounttype;
    var comment = inputdata.comment;
    var reasoncomment = inputdata.reasoncomment;
    
    var playeritem = await BASECONTROL.BfindOne(playersUser,{email : inputdata.email});
    var adminitem = await BASECONTROL.BfindOne(playersUser,{email : item.email});
    if (!playeritem || !adminitem ){
        return({ status : false,data : "we are sorry. Server has some issues"});
    }

    if(amount <= 0){
        return({ status : false,data : "Amount error"});
    }

    var order_no = "admin-"+new Date().valueOf();

    let row ={};
    row["type"] = "admin";
    row["email"] = inputdata.email;
    row["order_no"] = order_no;
    row["status"] = PCONFIG.Approve;
    row["amount"] = amount;
    row["wallettype"] = "DEPOSIT";
    row["comment"] = comment;
    row["reasoncomment"] = reasoncomment;
    
    row["resultData"] = { createdby : adminitem.email };
    row["userid"] = mongoose.Types.ObjectId(playeritem.id);
    row["lastbalance"] = playeritem.balance;
/// above player part    

    let row1 ={};
    row1["type"] = "admin";
    row1["email"] = adminitem.email;
    row1["order_no"] = order_no;
    row1["status"] = PCONFIG.Approve;
    row1["amount"] = amount;
    row1["wallettype"] = "WITHDRAWL";
    row1["comment"] = comment;
    row1["userid"] = mongoose.Types.ObjectId(adminitem.id);
    row1["lastbalance"] = adminitem.balance;
    row1["resultData"] = { auto : true };
    row1["reasoncomment"] = reasoncomment;

    let adminrow = new TransactionsHistory(row1);
    let playerrow = new TransactionsHistory(row);

    /// above admin part
    var plcurrent = 0;
    var adcurrent = 0;

    var wallets_ = {
        commission:0,
        status :"DEPOSIT",
        roundid :order_no,
        transactionid : order_no,
        userid : mongoose.Types.ObjectId(playeritem.id),
        credited : amount,
        debited : 0,
        lastbalance : playeritem.balance,
        paymentid : playerrow._id
    }

    var wallets_2 = {
        commission:0,
        status :"WITHDRAWL",
        roundid :order_no,
        transactionid : order_no,
        userid : mongoose.Types.ObjectId(adminitem.id),
        credited : 0,
        debited : amount,
        lastbalance : adminitem.balance,
        paymentid : adminrow._id
    }
  
    var balance = adminitem.balance;
    var bonusbalance = adminitem.bonusbalance;

    if(amounttype == Amount_Type.BALANCE){

        this.bonusoptions(amount, playeritem.id, bonusid)

        if ( item.permission != MAINCONFIG.USERS.superadmin && balance >= amount ){
            // withdrwal admin 
            adcurrent =  await BASECONTROL.email_balanceupdate( adminitem.email,-1 * amount,wallets_2);  
            // deposit play 
            plcurrent =  await BASECONTROL.email_balanceupdate(playeritem.email,amount,wallets_); 
        }else if(item.permission == MAINCONFIG.USERS.superadmin){
            // withdrwal admin 
            adcurrent =  await BASECONTROL.email_balanceupdate( adminitem.email,0,wallets_2);  
            // deposit play 
            plcurrent =  await BASECONTROL.email_balanceupdate(playeritem.email,amount,wallets_); 
        }else{
            return({ status : false,data : " we are sorry. Your account is  insufficient balance. Please deposit your balance"});
        }
    }else{
        wallets_2['lastbalance'] = bonusbalance;
        wallets_2['bonus'] = true;
        wallets_['lastbalance'] = playeritem.bonusbalance;
        wallets_['bonus'] = true;
        //bonus part
        if ( item.permission != MAINCONFIG.USERS.superadmin && bonusbalance >= amount ){
            // withdrwal admin 
            adcurrent =  await BASECONTROL.email_bonusbalanceupdate( adminitem.email,-1 * amount,wallets_2);  
            // deposit play 
            plcurrent =  await BASECONTROL.email_bonusbalanceupdate(playeritem.email,amount,wallets_); 
        }else if(item.permission == MAINCONFIG.USERS.superadmin){
            // withdrwal admin 
            adcurrent =  await BASECONTROL.email_bonusbalanceupdate( adminitem.email,0,wallets_2);  
            // deposit play 
            plcurrent =  await BASECONTROL.email_bonusbalanceupdate(playeritem.email,amount,wallets_); 
        }else{
            return({ status : false,data : " we are sorry. Your account is  insufficient balance. Please deposit your Bonus balance"});
        }

        playerrow["resultData"][["Bonus"]] = true;
        adminrow["resultData"]["Bonus"] = true;
    }
    
    playerrow["updatedbalance"] = plcurrent;
    adminrow["updatedbalance"] = adcurrent;
    let sh1 = await BASECONTROL.BSave(playerrow);
    let sh2 = await BASECONTROL.BSave(adminrow);
    if(sh1 && sh2){
        return ({status : true});
    }else{
        return({ status : false,data : "we are sorry. Server has some issues"});
    }
}

// admin deposit action
exports.deposit_action = async (req,res,next) =>{
    let ressult =  await this.deposit_func(req,res,next);
    if(ressult.status){
        this.players_load(req,res,next);
    }else{
        res.json({ status : false,data : ressult.data});
        return next();
    }
}

exports.withdrawlfunc = async (req) =>{

    var item = BASECONTROL.getUserItem(req);
    var inputdata = req.body.data;

    if(!inputdata ){
        return({ status : false,data : "Please provide valid data."});
    }
    var amount = parseInt(inputdata.amount);
    var amounttype = inputdata.amounttype;
    var comment = inputdata.comment;
    var reasoncomment = inputdata.reasoncomment;
    
    var playeritem = await BASECONTROL.BfindOne(playersUser,{email : inputdata.email});
    var adminitem = await BASECONTROL.BfindOne(playersUser,{email : item.email});
    if (!playeritem || !adminitem ){
        return({ status : false,data : "we are sorry. Server has some issues"});
    }

    if(amount <= 0){
        return({ status : false,data : "Amount error"});
    }

    var order_no = "admin-"+new Date().valueOf();

    let row ={};
    row["type"] = "admin";
    row["email"] = inputdata.email;
    row["order_no"] = order_no;
    row["status"] = PCONFIG.Approve;
    row["amount"] = amount;
    row["wallettype"] = "WITHDRAWL";
    row["comment"] = comment;
    row["resultData"] = { createdby : adminitem.email };
    row["userid"] = mongoose.Types.ObjectId(playeritem.id);
    row["lastbalance"] = playeritem.balance;
    row["reasoncomment"] = reasoncomment;
    
/// above player part    

    let row1 ={};
    row1["type"] = "admin";
    row1["email"] = adminitem.email;
    row1["order_no"] = order_no;
    row1["status"] = PCONFIG.Approve;
    row1["amount"] = amount;
    row1["wallettype"] = "DEPOSIT";
    row1["comment"] = comment;
    row1["userid"] = mongoose.Types.ObjectId(adminitem.id);
    row1["lastbalance"] = adminitem.balance;
    row1["resultData"] = { auto : true };
    row1["reasoncomment"] = reasoncomment;
    
    let adminrow = new TransactionsHistory(row1);
    let playerrow = new TransactionsHistory(row);

    /// above admin part
    var plcurrent = 0;
    var adcurrent = 0;

    var wallets_ = {
        commission:0,
        status :"WITHDRAWL",
        roundid :order_no,
        transactionid : order_no,
        userid : mongoose.Types.ObjectId(playeritem.id),
        credited : 0,
        debited : amount,
        lastbalance : playeritem.balance,
        paymentid : playerrow._id
    }

    var wallets_2 = {
        commission:0,
        status :"DEPOSIT",
        roundid :order_no,
        transactionid : order_no,
        userid : mongoose.Types.ObjectId(adminitem.id),
        credited : amount,
        debited : 0,
        lastbalance : adminitem.balance,
        paymentid : adminrow._id
    }
  
    var balance = playeritem.balance;
    var bonusbalance = playeritem.bonusbalance;

    if(amounttype == Amount_Type.BALANCE){
        if ( item.permission != MAINCONFIG.USERS.superadmin && balance >= amount ){
            // withdrwal admin 
            adcurrent =  await BASECONTROL.email_balanceupdate( adminitem.email, amount,wallets_2);  
            // deposit play 
            plcurrent =  await BASECONTROL.email_balanceupdate(playeritem.email,-1 * amount,wallets_); 
        }
        else if(item.permission == MAINCONFIG.USERS.superadmin  && balance >= amount){
            // withdrwal admin 
            adcurrent =  await BASECONTROL.email_balanceupdate( adminitem.email,0,wallets_2);  
            // deposit play 
            plcurrent =  await BASECONTROL.email_balanceupdate(playeritem.email,-1 * amount,wallets_); 
        }else{
            return({ status : false,data : " we are sorry. Your account is  insufficient balance. Please deposit your balance"});
        }
    }else{
        wallets_2['lastbalance'] = adminitem.bonusbalance;
        wallets_2['bonus'] = true;
        wallets_['lastbalance'] = playeritem.bonusbalance;
        wallets_['bonus'] = true;
        //bonus part
        if ( item.permission != MAINCONFIG.USERS.superadmin && bonusbalance >= amount ){
            // withdrwal admin 
            adcurrent =  await BASECONTROL.email_bonusbalanceupdate( adminitem.email, amount,wallets_2);  
            // deposit play 
            plcurrent =  await BASECONTROL.email_bonusbalanceupdate(playeritem.email,-1 * amount,wallets_); 
        }
        else if(item.permission == MAINCONFIG.USERS.superadmin && bonusbalance >= amount){
            // withdrwal admin 
            adcurrent =  await BASECONTROL.email_bonusbalanceupdate( adminitem.email,0,wallets_2);  
            // deposit play 
            plcurrent =  await BASECONTROL.email_bonusbalanceupdate(playeritem.email,-1 * amount,wallets_); 
        }else{
            return({ status : false,data : " we are sorry. Your account is  insufficient balance. Please deposit your balance"});
        }
        playerrow["resultData"][["Bonus"]] = true;
        adminrow["resultData"]["Bonus"] =  true;
    }
    
    playerrow["updatedbalance"] = plcurrent;
    adminrow["updatedbalance"] = adcurrent;
    
    let sh1 = await BASECONTROL.BSave(playerrow);
    let sh2 = await BASECONTROL.BSave(adminrow);
    if(sh1 && sh2){
        return ({status : true});
    }else{
        return({ status : false,data : "we are sorry. Server has some issues"});
    }
}

exports.withdrawl_action = async (req,res,next) =>{
    let ressult =  await this.withdrawlfunc(req,res,next);
    if(ressult.status){
        this.players_load(req,res,next);
    }else{
        res.json({ status : false,data : ressult.data});
        return next();
    }
}

exports.multiblock_action = async (req,res,next) =>{
 
    var users =  req.body.users;
    for (var i in users){
        await BASECONTROL.BfindOneAndUpdate(Users,{email : users[i].email},{status : MAINCONFIG.USERS.status.block })
    }
    this.players_load(req,res,next);        
}

exports.playerupdate_action = async (req,res,next) =>{

    var indata = req.body.users;
    var row = Object.assign({},{email : indata.email},{firstname : indata.firstname},{lastname : indata.lastname});
    var rdata1 = await BASECONTROL.BfindOneAndUpdate(playersUser,{id : indata._id},row);
    var rdata = await BASECONTROL.BfindOneAndUpdate(Users,{_id :indata._id},req.body.users);
    if(!rdata){
        res.json({
            status : false,
            data: 'failture'
        });
        next();
    }else{
        this.players_load(req,res,next);
    }

}

exports.profile_userupdate = async (req,res,next) =>{

    var indata = req.body.users;
    var row = Object.assign({},{firstname : indata.firstname},{lastname : indata.lastname});
    var rdata1 = await BASECONTROL.BfindOneAndUpdate(playersUser,{id : indata._id},row);
    var rdata = await BASECONTROL.BfindOneAndUpdate(Users,{_id :indata._id},req.body.users);
    if(rdata && rdata1){
        res.json({status : true,data :rdata });
        return next();
    }else{
        res.json({ status : false, data: 'failture' });
        return next();
    }
}

exports.profile_userload = async (req,res,next) =>{

    var indata = req.body.user;
    var rdata = await BASECONTROL.BfindOne(Users,{email : indata})
    if(!rdata){
        res.json({ status : false, data: 'failture' });
        return next();
    }else{
        res.json({status : true,data :rdata });
        return next();
    }

}

exports.playerresetpass_action = async (req,res,next)=>{
    
    var user =  req.body.user;
    if(!user.password || !user.email){
        res.json({ status : false, data: 'failture' });
        return next();
    }        
    var item = await BASECONTROL.BfindOne(Users,{email : user.email});
    var password =  item.generateHash(user.password);    
    var rdata = await BASECONTROL.BfindOneAndUpdate(Users,{email : user.email},{password : password});
    if(!rdata){
        res.json({ status : false, data: 'failture' });
        return next();
    }else{
        res.json({ status : true });
        return next();   
    }
    // this.players_load(req,res,next);

}

exports.balance_history_total = async (req,res,next) =>{
    
    let filters = req.body.filters;
    let dates = filters.dates;
    let userslist = [];
    let orquery = [];
    let andquery = [];
    let wallettype = filters.bool;
    var useroptions = [{"label" : "All",value : ""}];

    if (dates.length > 2) {
        return res.send({status : false , error : "Please provide date."});
    }

    var start = BASECONTROL.get_stand_date_first(dates[0]);
    var end = BASECONTROL.get_stand_date_first(dates[1]);
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

        andquery = [{ createDate :{$gte: start, $lte:end},type :"admin",wallettype : wallettype,$or : orquery,"resultData.auto" : {$ne : true}}];
        
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

    res.json(
    {
        status:true, 
        data :  { useroptions : useroptions ,statusoptions : statusoptions},
    })
    return next();   

}

exports.balance_history_load = async (req,res,next) =>{

    let filters = req.body.filters;
    let params = req.body.params;
    let dates = filters.dates;
    let userslist = [];
    let orquery = [];
    let andquery = [];
    let wallettype = filters.bool;
    let status = filters.status;
    
    let pages = {};
    let array = [];

    if (dates.length > 2) {
        return res.send({status : false , error : "Please provide date."});
    }

    var start = BASECONTROL.get_stand_date_first(dates[0]);
    var end = BASECONTROL.get_stand_date_first(dates[1]);
    var role = BASECONTROL.getUserItem(req)
    userslist = await UsersControl.get_users_items(role);
    for (var i in userslist) {
        orquery.push({userid :mongoose.Types.ObjectId(userslist[i]._id)})
    }

    
    if(orquery.length > 0) {

        andquery = [{ createDate :{$gte: start, $lte:end},type :"admin",wallettype : wallettype,$or : orquery,"resultData.auto" : {$ne : true}, status : {  $regex: status}}];

        let totalcount =  await TransactionsHistory.countDocuments(
            { 
                $and: andquery,
                $or : orquery
            },
        );
        
        pages = Reportscontrol.setpage(params,totalcount);
        if (totalcount > 0) {
    
            array =  await TransactionsHistory.find(
            { 
                $and: andquery,
                $or : orquery
            })
            .populate("userid").skip(pages.skip).limit(pages.limit).sort({createDate : -1});
        }
        pages["skip2"] = (pages.skip) + array.length;
    }

    res.json(
    {
        status:true, 
        data:array,
        pageset : pages
    })
    return next(); 
    
}


exports.kickPlayerFromGames_action = async(req,res,next) =>{
    
}

exports.getaccount = async (req,res,next) =>{
    var status = await BASECONTROL.BfindOne(playersUser,{email : req.body.data});
    if(!status){
        res.json({ 
            data : status,
            status : false
        })
        return next();
     }else{
         res.json({
             data : status,
             status : true
         })
         return next();
    }
}

exports.get_guestgameaccount =async(req,res,next)=>{
     var gamedata = req.body.game;
     var width = req.body.width
     guset_launch_url(gamedata,width,(rdata)=>{
         if(rdata.status){
             res.json({
                 status : true,data : rdata.data
             });
             return next();
         }else{
             res.json({
                 status : false,data : rdata.data
             });
             return next();
         }
     })
}

exports.get_realgameaccount =async(req,res,next)=>{

    var width = req.body.width;
    var isTelegram = req.body.isTelegram;
     var gamedata = null;
     if (isTelegram) {

        width = 300
        gamedata = await BASECONTROL.BfindOne(GAMELISTMODEL,{_id : req.body.gameId});
        let uitem = await BASECONTROL.BfindOne(adminUser,{email : req.body.telegramId});
        
        gamedata.image =  gamedata.image ? gamedata.image.length > 0 ? gamedata.image.slice(0,5) === "https" ? gamedata.image : "https://cms.fairbets.co/uploads/" + gamedata.image : "" : ""
        
        if (!gamedata || !uitem) {
            res.json({status : false});
            return next();
        }
        req.user = uitem;
    } else {
        gamedata = req.body.game;
    }

     var limits = req.body.limits;
     var playaccount = await get_gameaccount(req,limits);
     if(!playaccount.status){
        res.json({status : false,data : playaccount.data,bool : playaccount.bool});
        return next();
     }else{
        var account = playaccount.data;
        var newtoken = await make_token(account);        
        get_launch_url(account,gamedata,newtoken,width,limits,async(rdata)=>{
             if(rdata.status){
                    var uhandle = await BASECONTROL.BfindOneAndUpdate(gamesessionmodel,{email : newtoken.email},newtoken);
                    if(uhandle){
                        res.json({
                            status : true,data : {url : rdata.url,token : newtoken , gamedata}
                        });
                        return next();
                    }else{
                        res.json({status : false,data : "You cannot bet Play",bool : 0});
                        return next();
                    }
            }else{
                 res.json({status : false,data : rdata.data,bool : 0});
                 return next();
            }
        });
 
     }
}
 
async function get_launch_url(account,gamedata,token,width,limits,callback){
     var LAUNCH_FLAG = gamedata.LAUNCHURL;
     var usersdata = await BASECONTROL.BfindOne(Users,{email: account.email});
     var currency = usersdata.currency == "" ? "INR" : usersdata.currency;
     switch(LAUNCH_FLAG){
         case "1" :{
            
            //  var url = BASECONFIG.betsoft.real+"bankId="+BASECONFIG.betsoft.bankId+"&gameId="+gamedata.ID+"&mode=real&token="+token.token+"&lang=en&homeUrl="+HOMECONFIG.homedomain;
            //betsoft
             var url =  "https://2vivo.com/FlashRunGame/RunRngGame.aspx?" + 
             "Token=" + token.token +
             "&GameID=" + gamedata.ID +
             "&OperatorId=" +BASECONFIG.vivo.operatorid +
             "&lang=EN" + 
             "&cashierUrl=" + HOMECONFIG.homedomain + 
             "&homeUrl=" + HOMECONFIG.homedomain;
             callback({status : true,url : url})
             break;
         }
         case "2" :{
             //xpg
             xpg_token(account,gamedata,(rdata)=>{
                 callback(rdata);
             });
             break;
         }
 
         case "3" :{
             //ezugi
             var  url = BASECONFIG.ezugi.url+"token="+token.token+"&operatorId="+BASECONFIG.ezugi.operatorId+"&language=en&clientType=html5&openTable="+ gamedata.ID +"&homeUrl="+HOMECONFIG.homedomain
             callback({status : true,url : url})
             break;
         }
 
         case "4" :{
             //vivo
             // var gametypes = {
             //     1 : "Roulette",
             //     2 : "Baccarat",
             //     3 : "Blackjack",
             //     4 : "Poker"
             // }
             var gametypes = {
                "Roulette":"roulette",
                "Baccarat":"baccarat",
                "Blackjack":"blackjack",
                "Poker":"casinoholdem"
            }
             var select_game = gametypes[gamedata.TYPE];
            // var limitIds = gamedata.WITHOUT;
                // if(limitIds.Mojos){
                //     var url = BASECONFIG.vivo.url2+
                //     "tableguid="+limitIds.tableguid+
                //     "&token=" +token.token +
                //     "&OperatorId="+BASECONFIG.vivo.operatorid+
                //     "&language=en"+
                //     "&cashierUrl="+HOMECONFIG.homedomain+
                //     "&homeURL="+HOMECONFIG.homedomain +
                //     "&currency="+currency +
                //     "&GameID=" + limitIds.gameid+
                //     "&mode=real"+
                //     "&operatorToken=" + limitIds.operatorToken+
                //     "&gametype=live&host=https://de-lce.svmsrv.com";
                //     callback({status : true,url : url})
                // }else{
                var limitId = limits ? limits.limitId : "";
                var  url = BASECONFIG.vivo.url+
                    "token="+token.token+
                    "&operatorid="+BASECONFIG.vivo.operatorid+
                    "&language=EN"+
                    "&serverid="+BASECONFIG.vivo.serverid+
                    "&modeselection=3D" +
                    "&responsive=true"+
                    "&isgamelauncher=true"+
                    "&isinternalpop=false" +
                    "&isswitchlobby=true"+
                    "&securedomain=true"+
                    "&tableid="+gamedata.ID+
                    "&limitid="+limitId+
                    "&application="+select_game+
                    "&homeurl="+HOMECONFIG.homedomain;
                    callback({status : true,url : url})
                // }
                break;
         }
 
         case "5" :{
            let con = await firstpagesetting.findOne({type : "WACCreential"});
            if (con) {
                let wac = con.content;
                var url = wac.LaunchUrl + "token="+token.token+"&pn="+ wac.operatorToken + "&lang=en&game="+ gamedata.ID + "&type=CHARGED";
                callback({status : true,url : url});
            } else {
                callback({status : false,data : "server error"});
            }
             //wac
             // https://pi-test.njoybingo.com/game.do?token=934fc6cc086a0bba00a8fe9bda626de2&pn=kasino9&lang=en&game=1X2-8008&type=CHARGED
            //  var url = BASECONFIG.wac.url + "token="+token.token+"&pn="+ BASECONFIG.wac.pn + "&lang=en&game="+ gamedata.ID+"&type=CHARGED";
            // callback({status : true,url : url});
            break;
         }

        case "6" : {

            let con = await firstpagesetting.findOne({type : "XpressCredential"});
            if (con) {
                var privateKey = con.content.privateKey;
                var xpressUrl = con.content.launchUrl;

                var clientPlatform = width < 768 ?  "mobile" : "desktop";
                var mode = gamedata.mode ? "0" : "1";
                var hashstring = token.token + gamedata.ID + HOMECONFIG.homedomain + mode + "enmaster" + clientPlatform + HOMECONFIG.homedomain + privateKey;
                 var hash = BASECONTROL.md5convert(hashstring);

                 var url = xpressUrl + "?token="+token.token + "&game=" + gamedata.ID +  "&backurl="+HOMECONFIG.homedomain+
                 "&mode="+ mode + "&language=en"+ "&group=master"+ "&clientPlatform="+clientPlatform + "&cashierurl="+HOMECONFIG.homedomain+ "&h="+hash;

                 callback({status : true,url : url});
            } else {
                callback({status : false,data : "server error"});
            }
             break;
        }
        case "7" :{
            var URL = BASECONFIG.betgames.url +
            "/ext/client/index/" + BASECONFIG.betgames.apicode +
            "/" + token.token + 
            "/" + "en" +
            "/" + "0" + 
            "/" + "0" + 
            "/" + gamedata.ID + 
            "/" + "india" + 
            "?" + HOMECONFIG.homedomain;
            callback({status : true,url : URL});
            break;
        }

        case "8" : {
            var clientPlatform = width < 768 ?  "1" : "0";
            var URL = BASECONFIG.MySlotty.URL + 
            "action=" + "real_play" +
            "&secret=" + BASECONFIG.MySlotty.RPCSecret +
            "&game_id=" + gamedata.ID +
            "&player_id=" + account.id +
            "&currency=" + "INR" +
            "&mobile=" + clientPlatform;
            var options = {
                'method': 'GET',
                'url': URL,
                'headers': {
                }
              };
              request(options, function (error, response) {
                if (error) {
                    callback({status : false,data : "We are sorry. You can't play"});                
                } else{
                    var outdata = JSON.parse(response.body);
                    if (outdata.status != 200){
                        callback({status : false,data : outdata.message});
                    }else{
                        var game_url = outdata.response.game_url;
                        callback({status : true,url : game_url});
                    }
                }
            });
            break;
        }
        case "9" : {
            var projectid = BASECONFIG.EVOPLAY.projectId;
            var signature = BASECONTROL.md5convert(projectid + "*" + "1" +"*" + token.token +"*" +gamedata.ID + "*" +  account.id + ":" + 
            HOMECONFIG.homedomain + ":" + HOMECONFIG.homedomain + ":" + "en" + ":" + "1" + "*" + "1" + "*" + currency + "*" + "1" + "*" + "2" + "*" + BASECONFIG.EVOPLAY.secret_key);
            var url = BASECONFIG.EVOPLAY.getURL + 
            "project=" + projectid +
            "&version=1" + 
            "&signature=" + signature +
            "&token=" + token.token +
            "&game=" + gamedata.ID +
            "&settings[user_id]=" + account.id +
            "&settings[exit_url]=" + HOMECONFIG.homedomain +
            "&settings[cash_url]=" + HOMECONFIG.homedomain +
            "&settings[language]=" + "en" +
            "&settings[https]=" + "1" +
            "&denomination=" + "1" +
            "&currency=" + currency +
            "&return_url_info=" + "1" +
            "&callback_version=" + "2";
            var options = {
                'method': 'GET',
                'url': url,
                'headers': { }
              };
            request(options, function (error, response) {
                if (error) {
                    callback({status : false,data : "We are sorry. You can't play"});
                }else{
                    var rdata = JSON.parse(response.body);
                    if (rdata.status == "ok"){
                        callback({status : true,url : rdata.data.link});
                    }else{
                        callback({status : false,data : rdata.error.message});
                    }
                }
              });
            break;              
        }
        case "10" : {
            var url =  BASECONFIG.winnerpoker.URL+
            "token="+token.token +
            "&operator="+BASECONFIG.winnerpoker.operator + 
            "&gameid=" + gamedata.ID;
            callback({status : true,url : url});
            break;
        }

        case "12" : {

            let con = await firstpagesetting.findOne({type : "MojosCreential"});
            if (con) {

                var casinoHost = con.content.casinoHost;
                var LiveCasinoHost = con.content.LiveCasinoHost;
                var LaunchUrl = con.content.LaunchUrl;
                var operatorToken = con.content.operatorToken;

                var host = gamedata.WITHOUT.casino ? casinoHost : LiveCasinoHost;
                var gametype = gamedata.WITHOUT.casino ? "slots" : "live";
                var url =  LaunchUrl + "host=" + host + "&gameType=" + gametype + "&gameToken=" + gamedata.WITHOUT.gameToken +
                "&playerToken=" +  token.token + "&operatorToken=" + operatorToken;

                callback({status : true,url : url});
            } else {
                callback({status : false,data : "server error"});
            }
            break;
        }
    }
}


async function make_token(account){
    
    let times = 1000 * 900;
    let Expires = await firstpagesetting.findOne({type : "SessionExpiresSetting"});
    if (Expires) {
        times =  parseInt(Expires.content.GameSession) * 1000;
    }
    var row = {};
    row['intimestamp'] = new Date(new Date().valueOf() + times);
    row['id'] = account.id;
    row['username'] = account.username;
    row['email'] = account.email;
    row['currency'] = account.currency;
    row['lastname'] = account.lastname;
    row['firstname'] = account.firstname;
    var token = BASECONTROL.md5convert(JSON.stringify(row));
    row['token'] = token;
    await BASECONTROL.data_save({email:account.email},totalgamesusermodel);    
    return row;

}
 
function xpg_token(rdata,game,callback){
    var username =rdata.username;
    var accessPassword = "";
    var registerToken ="";
    var serverurl = BASECONFIG.xpg.serverurl + "registerToken";
    var parameter = "";
    var privatekey = BASECONFIG.xpg.passkey;
    var operatorId = BASECONFIG.xpg.operatorid;
    var headers = {'Content-Type': 'application/x-www-form-urlencoded'};// method: 'POST', 'cache-control': 'no-cache', 
    var ap_para  = '';
    ap_para = {
        operatorId : operatorId,
        username : username,
        props : ""
    } 
    accessPassword = BASECONTROL.get_accessPassword(privatekey,ap_para);
    parameter = {
        accessPassword : accessPassword,
        operatorId : operatorId,
        username : username,
        props : ""
    }
    request.post(serverurl,{ form : parameter, headers: headers, },async (err, httpResponse, body)=>{
        if (err) {
            callback({status : false});
        }else{
            var xml =parse(body);
            var xmld = xml.root;
            var errorcode = xmld['children'][0]['content'];
            switch(errorcode){
                case "0" :
                    var registerToken = xmld['children'][1]['content'];
                    // var Security = BASECONTROL.md5convert(privatekey+"operatorId="+operatorId+"&loginToken="+registerToken);
                    // var SecurityCode = Security.toLocaleUpperCase();
                    var livecasino_url_ = BASECONFIG.xpg.url+'operatorId='+operatorId+'&token='+registerToken+'&username='+username+'&gameId='+game.ID+'&gameType='+game.TYPE +"&limitId="+game.WITHOUT.limitId+'&DefaultCategory=Roulette';
                    callback({status : true,url : livecasino_url_});
                break;
                default :
                callback({status : false});
                break;
            }
        }    
    });
}
 
async function get_gameaccount(req,limits){

    var user = req.user;
    var limitMinvalue = limits && limits.limitMin ? limits.limitMin : 50;
    var rdata = await BASECONTROL.BfindOne(playersUser,{email : user.email});
    if(rdata){ 
        if( (rdata.balance + rdata.bonusbalance) > limitMinvalue){
            return {status : true,data : rdata} 
        }else{
            return {status : false,data : "please deposit",bool : 1}
        }
    }else{
        return {status : false,data : " server error",bool : 0}
    }
}

function guset_launch_url(gamedata,width,callback){
    var LAUNCH_FLAG = gamedata.LAUNCHURL;
    switch(LAUNCH_FLAG){
        case "1" :{
                let url = ""
//                https://games.vivogaming.com/?token=&operatorID=&language=en&returnUrl=lobby&serverID=6401748
            // var url = BASECONFIG.betsoft.guest+"bankId="+BASECONFIG.betsoft.bankId+"&gameId="+gamedata.ID+"&lang=en&homeUrl="+HOMECONFIG.homedomain;
            callback({status : true,data : url})
            break;
        }
        case "5" :{
            //wac
            // https://pi-test.njoybingo.com/game.do?token=934fc6cc086a0bba00a8fe9bda626de2&pn=kasino9&lang=en&game=1X2-8008&type=CHARGED
            var url = BASECONFIG.wac.url + "token=934fc6cc086a0bba00a8fe9bda626de2&pn="+ BASECONFIG.wac.pn + "&lang=en&game="+ gamedata.ID+"&type=FREE";
            callback({status : true,data : url});
            break;
        }

        case "6" : {
            var clientPlatform = width < 768 ?  "mobile" : "desktop";
            var mode = "0";
            var hashstring = gamedata.ID+HOMECONFIG.homedomain+mode+"enmaster"+clientPlatform+HOMECONFIG.homedomain+BASECONFIG.xpress.hashkey;
             var hash = BASECONTROL.md5convert(hashstring);
             var url = BASECONFIG.xpress.url + 
             "token="+ 
             "&game=" + gamedata.ID + 
             "&backurl="+HOMECONFIG.homedomain+
             "&mode="+ mode +
             "&language=en"+
             "&group=master"+
             "&clientPlatform="+clientPlatform +
             "&cashierurl="+HOMECONFIG.homedomain+
             "&h="+hash;
             callback({status : true,data : url});
             break;
        }

        case "7" :{
            var URL = BASECONFIG.betgames.url +
            "/ext/client/index/" + BASECONFIG.betgames.apicode +
            "/" + "-" + 
            "/" + "en" +
            "/" + "0" + 
            "/" + "0" + 
            "/" + gamedata.ID + 
            "/" + "india" + 
            "?" + HOMECONFIG.homedomain;
            callback({status : true,data : URL});
            break;
        }

        case "8" : {
            if ( gamedata.WITHOUT.is_demo_supported){
                var url = gamedata.WITHOUT.demo_url
                callback({status : true,data : url});
            }else{
                callback({status : false,data : "We are sorry . Demo is not supported"});
            }
            break;
        }        
        
        default :{
            callback({status : false,data : "We are sorry You can't play"})
            break;
        }
    }
}

exports.get_kycmenuLoad = async(req,res,next)=>{
    var status =req.body.status;
    var rdata = await BASECONTROL.Bfind(documentModel,{status : status});
    var role = BASECONTROL.getUserItem(req)
    var userslist = await UsersControl.get_users_items(role);
    var rows = [];
    for(var i = 0 ; i < rdata.length ; i++){
        var item = userslist.find(obj=>obj.email == rdata[i].email);
        if(item){
            rows.push(rdata[i])
        }
    }
    if(!rdata){
        res.json({status : false});
        return next();
    }else{
        res.json({status : true,data : rows})
        return next();
    }
}

exports.update_kycmenu = async(req,res,next)=>{
    var bool = req.body.data.bool;
    var email = req.body.data.email;
    var rdata =await BASECONTROL.BfindOneAndUpdate(documentModel,{email : email},{status : req.body.data.bool})
    if(!rdata){
        res.json({status : false});
        return next();
    }else{
        req.body.status = bool;
        if(bool == "2"){
            var udata = await BASECONTROL.BfindOneAndUpdate(Users,{email : email},{idverify : true });
            if(!udata){
                res.json({status : false});
                return next();
            }else{
               this.get_kycmenuLoad(req,res,next) 
            }
        }else{
            this.get_kycmenuLoad(req,res,next)             
        }
    }
}

exports.playerlimit_load = async (req,res,next) =>{
    var news = await BASECONTROL.Bfind(playerlimits);
    let rows = []
    for (var i in news) {
        if (news[i].userid) {
            rows.push(news[i]);
        } else { 
            await BASECONTROL.BfindOneAndDelete(playerlimits,{email : news[i].email});
        }
    }

    res.json({ status : true, data : rows });
    return next();
}


exports.get_playerlimit = async(req,res,next)=>{
    var role = BASECONTROL.getUserItem(req);
    var userslist = await UsersControl.get_players_items(role);
    for (var i = 0 ; i < userslist.length ; i++) {
        var data = await BASECONTROL.BfindOne(playerlimits,{email : userslist[i].email});
        if (!data) {
            var newrow = {
                daylimit : MAINCONFIG.USERS.daylimit,
                weeklimit : MAINCONFIG.USERS.weeklimit,
                email : userslist[i].email,
                monthlimit :MAINCONFIG.USERS.monthlimit ,
                userid : mongoose.Types.ObjectId(userslist[i]._id)
            }
            var shandle = await BASECONTROL.data_save(  newrow,playerlimits);
        }
    }

    this.playerlimit_load(req, res,next);
}

exports.update_playerlimit = async(req,res,next)=>{
    var email = req.body.data.email;
    var data = await BASECONTROL.BfindOneAndUpdate(playerlimits,{email : email},req.body.data);
    if(!data){
        res.json({status :false});
        return next()
    }else{
        this.playerlimit_load(req, res,next);
    }
}

exports.get_wallet_mainuser4 = async (req,res,next) =>{
    var u_item = req.body.user;
    if(!u_item){
        var user = req.user;
    }else{
        user = await BASECONTROL.BfindOne(Users,{email: u_item.email});
    }
    var playerslist = await UsersControl.get_players_items(user);
    var start = BASECONTROL.get_stand_date_first(req.body.startDate);
    var end = BASECONTROL.get_stand_date_end(req.body.endDate);
    var matka = await this.get_bazaars_revenus(playerslist,start,end);
    res.json({status : true,data :matka })
    return next();

    
}

exports.get_wallet_mainuser3 = async (req,res,next) =>{

    var total = {};
    var u_item = req.body.user;
    if(!u_item){
        var user = req.user;
    }else{
        user = await BASECONTROL.BfindOne(Users,{email: u_item.email});
    }

    var start = BASECONTROL.get_stand_date_first(req.body.startDate);
    var end = BASECONTROL.get_stand_date_end(req.body.endDate);
    
    var positiontaking = parseInt(user.positiontaking);
    var c_pos_tak = positiontaking > 0 && positiontaking < 100 ? (100 - positiontaking) : 0;
    total = Object.assign(total,{positiontaking : c_pos_tak})
 

    var rdata=  await TransactionsHistory.aggregate([
        {$match: { $and: [{wallettype : "WITHDRAWL"},{email : user.email},{ "createDate": { $gte: start } }, { "createDate": { $lte:end} }]}},
        {$group: { _id: null, AMOUNT: {$sum: '$amount'},}}
    ]);
    if(rdata.length > 0){
        total = Object.assign(total,{receive : rdata[0].AMOUNT})
    }else{
        total = Object.assign(total,{receive : 0})
    }

     rdata=  await TransactionsHistory.aggregate([
        {$match: { $and: [{wallettype : "DEPOSIT"},{"resultData.createdby" : user.email},{ "createDate": { $gte: start } }, { "createDate": { $lte:end} }]}},
        {$group: { _id: null, AMOUNT: {$sum: '$amount'},}}
    ]);
    if(rdata.length > 0){
        total = Object.assign(total,{given : rdata[0].AMOUNT})
    }else{
        total = Object.assign(total,{given : 0})
    }

     rdata=  await TransactionsHistory.aggregate([
        {$match: { $and: [{wallettype : "WITHDRAWL"},{"resultData.createdby" : user.email},{ "createDate": { $gte: start } }, { "createDate": { $lte:end} }]}},
        {$group: { _id: null, AMOUNT: {$sum: '$amount'},}}
    ]);
    if(rdata.length > 0){
        total = Object.assign(total,{withdrawls : rdata[0].AMOUNT})
    }else{
        total = Object.assign(total,{withdrawls : 0})
    }
    
    res.json({status : true,data :total })
    return next();


   
}

exports.get_bazaars_revenus = async (userslist,start,end) =>{

    
    let andquery = [ { "DATE": { $gte: start, $lte: end } }];
    let orquery = [];
    let array = [];

    for (var i in userslist) {
        orquery.push({userid :mongoose.Types.ObjectId(userslist[i]._id)})
    }
    var newrows = [];

    array =  await matka_betmodels.aggregate([
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
                _id: {
                    "type" : "$type",
                    "status" : "$status"
                }, 
                "bookCount": { "$sum": "$amount" },
                "winCount": { "$sum": "$winamount" },
                COUNT: {$sum: 1},
            }
        },
        
        { 
            "$group": 
            {
                "_id": "$_id.type",
                "counts" : {
                    $push : {
                        count : "$COUNT"
                    }
                },
                "wallets": { 
                    "$push": { 
                        "status": "$_id.status",
                        "count": "$bookCount",
                        "win": "$winCount",
                    },
                },
            }
        },
    ]);

    if (array && array.length > 0) {


        newrows = [];

        for (var i in array) {
            let row = {};
            let wallet = {
                pending : 0,
                win : 0,
                lost : 0,
                cancel : 0,
                GGR : 0,
                count : 0
            }
            for(var j in array[i].wallets){
                
                let item = array[i]["wallets"][j]["status"];
                let betam = parseInt(array[i]["wallets"][j]["count"]);
                let winam = parseInt(array[i]["wallets"][j]["win"]);
                wallet[item] = item == SATACONFIG.StatusKey.win ? winam : betam;

            }

            wallet['count'] = array[i].counts.length && array[i].counts[0].count ?  array[i].counts[0].count : 0
            wallet["GGR"] = wallet.lost - wallet.win;
            wallet['bazarname'] = SATACONFIG.KeyString[array[i]._id];
            row = Object.assign(row,wallet);
            newrows.push(row)
        }
    
    }

    return newrows

}



exports.get_accountstatement = async (req,res,next) =>{

    let data = req.body.row;
    let params = req.body.params;
    let start = BASECONTROL.get_stand_date_end(data.start);
    let end = BASECONTROL.get_stand_date_end(data.end);
    var andquery = {
        userid : mongoose.Types.ObjectId(data.id),
        updated: { $gte: start ,$lte:end}
    }
    
    var Sattaconfig = req.sattaconfig;

    let totalcount = await wallethistory.countDocuments(andquery);
    var pages = Reportscontrol.setpage(params,totalcount);
    var rows = [];
    if (totalcount > 0) {
        rows=  await wallethistory.find(andquery)
            .populate({ path : "gameid",select : "TYPE NAME PROVIDERID"})
            .populate({ path : "paymentid",select :"type"})
            .populate({ path : "bazaarid" , select :"bazaartype bazaarname"})
            .populate({ path : "matkabetid", select : "betnumber"})
            .populate({ path : "bonushisid", select : "bonusid"})
            .populate({ path : "sportid" })
            .sort({updated : -1}).skip(pages.skip).limit(pages.limit);
    }
    pages["skip2"] = (pages.skip) + rows.length;

    var newarray = [];
    for( var i in rows) {
        var row = Object.assign({},rows[i]._doc ? rows[i]._doc : rows[i] );
        if (row.paymentid) {
            row = Object.assign(
                row,{
                    PROVIDERID : row.paymentid.type,
                    TYPE : "CASH",
                    NAME : row.paymentid.type,
                }
            );
        } else if (row.gameid) {
            row = Object.assign(
                row,{
                    PROVIDERID : row.gameid.PROVIDERID,
                    TYPE : row.gameid.TYPE,
                    NAME : row.gameid.NAME,
                }
            );
        } else if (row.bazaarid && row.matkabetid) {
            row = Object.assign(
                row,{
                    PROVIDERID : Sattaconfig.KEY_SATTATYPES[row.bazaarid.bazaartype],
                    TYPE : row.bazaarid.bazaarname,
                    NAME : row.matkabetid.betnumber,
                }
            );
        } else if (row.bonushisid) {
            if (row.bonushisid.bonusid && row.bonushisid.Bonusname) {
                row = Object.assign(
                    row,{
                        NAME : row.bonushisid.bonusid.Bonusname,
                        PROVIDERID : "Bonus",
                        TYPE : row.bonushisid.bonusid.Bonusname,
                    }
                );

            } else {
                row = Object.assign(
                    row,{
                        NAME : "bonus",
                        PROVIDERID : "Bonus",
                        TYPE : "bonus",
                    }
                );
            }
        } else if (row.sportid) {
            row = Object.assign(
                row,{
                    PROVIDERID : row.sportid.sport_name,
                    NAME : row.sportsData.OutcomeName,
                    TYPE : row.sportsData.MatchName,
                }
            );
        }
        newarray.push(row);
    }
    
    res.json({
        status : true,
        data : newarray,pageset : pages,
    });
    return next();
}



exports.get_bets_profit = async (req,res,next) =>{
    let data = req.body;
    let user = req.body.user;
    let start = BASECONTROL.get_stand_date_end(data.start);
    let end = BASECONTROL.get_stand_date_end(data.end);


    var casinobets = {BET : 0,WIN : 0,CANCELED_BET: 0};

  
        // var totals = await bethistory_model.aggregate(
        //     [
        //         {$match: { $and: [{DATE: {$gte: start,$lte:end}, userid :mongoose.Types.ObjectId(user._id) }]}},
        //         {$group: 
        //             {  
        //                 _id: {"TYPE" : "$TYPE"},
        //                 AMOUNT: {$sum: '$AMOUNT'},
        //                 COUNT: {$sum: 1},
        //             }
        //         }
        //     ]
        // )
        // for(var k in totals){
        //     casinobets[totals[k]["_id"].TYPE] += totals[k].AMOUNT;
        //     casinobets["betindex"] += totals[k].COUNT;
        // }


    var totalgrand = (parseInt(casinobets.WIN - casinobets.BET - casinobets.CANCELED_BET))

    var sports = {type:"Sportsbook","win-loose" : 0 , Total:0};
    var exchange = {type:"Exchange","win-loose" : 0, Total:0};
    var cardgames = {type:"Card Games","win-loose" : 0, Total:0};
    var ca_bets = {type : "casino","win-loose" :casinobets.WIN +" - " + parseInt(casinobets.BET - casinobets.CANCELED_BET) , "Total" : parseInt(casinobets.WIN - casinobets.BET - casinobets.CANCELED_BET)};
    var grands = {type : "Grand Total","win-loose": "-",Total : totalgrand};
    
    var rows = [sports,exchange,cardgames,ca_bets,grands];
    res.json({ status : true,data : rows });
    return next();

    // async function get_bazzars_bets(BazaarType){
    //     var datas = await BASECONTROL.Bfind(BazaarModel,{status : true,bazaartype : BazaarType});
    //     var row = {BET : 0,WIN : 0,CANCELED_BET : 0}
    //     for(var j in datas){
    //         let bet = 0;
    //         let win = 0;
    //         var dd = await BASECONTROL.Bfind(matka_betmodels,{USERID : user._id,bazaarid : datas[j]._id, $or : [{status : "2"},{status : "1"}] ,"DATE": { $gte: start ,$lte:end}});
    //         if(dd.length > 0){
    //             for(var i in dd){
    //                 bet += dd[i].amount;
    //             }
    //         }
    //         dd = await BASECONTROL.Bfind(matka_betmodels,{USERID : user._id,bazaarid : datas[j]._id,status : "3","DATE": { $gte: start ,$lte:end}});
    //         if(dd.length > 0){
    //             for(var i in dd){
    //                 win += dd[i].amount;
    //             }
    //         }
    //         row.BET += bet;
    //         row.WIN += win;
    //     }

    //     return row     
    // }
}
