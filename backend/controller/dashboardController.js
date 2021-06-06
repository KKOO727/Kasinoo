const bethistory_model = require('../models/bethistory_model').BettingHistory_model;  
const adminUser = require('../models/users_model').adminUser;  
const totalusermodel = require('../models/users_model').totalusermodel;  
const TransactionsHistory = require('../models/paymentGateWayModel').TransactionsHistory;  
const CONFIG = require("../config/index.json");
const BASECONTROL = require("./basecontroller");
const UsersControl = require("./userscontroller");
const SessionModel = require("../models/users_model").sessionmodel;
const permission_model = require("../models/users_model").permission_model;
var mongoose = require('mongoose');
const PCONFIG = require("../config/pconfig")

// const PAYMENTCONFIG = require("../config/paymenterror.json")

// exports.BettingHistory_model = (dt) =>{
//     return bethistory_model.BettingHistory_model(dt);
// }

exports.get_bettingtable_prefix =(start,i) =>{
    var date = new Date(start);
    var year = date.getFullYear();
    var smonth = date.getMonth() + 1;
    var addyear = parseInt((i + smonth) / 13);
    var fullyear = year + addyear;
    var addmonth = (i + smonth) % 12;
    addmonth = addmonth == 0 ? "12" : addmonth
    var fullmonth = addmonth > 9 ? addmonth : "0" + addmonth;
    var datestring = fullyear + "-"+fullmonth;
    return datestring
}

exports.get_Months =(start,end) =>{
    var date1 = new Date(start);
    var date2 = new Date(end);
    var index1 = (date2.getMonth() + 1) + 1;
    var index2 = 12 - (date1.getMonth() + 1);
    var year = date2.getFullYear() - date1.getFullYear() - 1;
    var total = index1 + index2 + year * 12;
    return total;
}

exports.getMainUsers = async (mainuser,CONFIG) =>{
    var m_users = [];
    m_users = await getPermissions(mainuser)
    return m_users;

    async function getPermissions(role){
        var data = [];
        async function recurse(email){
            var rows = await BASECONTROL.Bfind(adminUser,{isdelete : false,created : email, permission : {$ne : CONFIG.USERS.player }});
            if (rows.length == 0) {
                return;
            } else {
                for (var i = 0 ; i < rows.length ; i++) {
                    data.push(rows[i]);
                    await recurse(rows[i].email);
                }
            }
        }

        if (role.permission == CONFIG.USERS.superadmin) {
            let rows = await BASECONTROL.Bfind(adminUser,{isdelete : false, permission : {$ne : CONFIG.USERS.player }});
            data = rows;
        } else {
            data.push(role);
            await recurse(role.email);
        }
        return data;
    }
}

exports.getUserLoad = async (req,res,next) =>{
    var mainuser = BASECONTROL.getUserItem(req);
    var CONFIG = req.homeConfig;
    var m_users =  await this.getMainUsers(mainuser,CONFIG);
    let data = [];
    for (var i in m_users) {
        data.push({value : m_users[i].email,label : m_users[i].email + "    " + m_users[i].permissionid.title + "    " + ( 100 - parseInt(m_users[i].positiontaking)) });
    }
    res.json({status : true,data : data});
    return next();
}

exports.get_wallet_mainuser1 = async (req,res,next) =>{


    var start = BASECONTROL.get_stand_date_first(req.body.startDate);
    var end = BASECONTROL.get_stand_date_end(req.body.endDate);
    var u_item = req.body.user;
    if(!u_item){
        var user = req.user;
    }else{
        user = await BASECONTROL.BfindOne(adminUser,{email: u_item.email});
    }

    var Profit =  await this.get_profit(start,end,user);
    res.send({status :true,data : Profit});
    return next();
}

exports.get_wallet_mainuser2 =async (req,res,next) =>{

    var start = BASECONTROL.get_stand_date_first(req.body.startDate);
    var end = BASECONTROL.get_stand_date_end(req.body.endDate);
    var u_item = req.body.user;
    var user = null;
    if(!u_item){
        user = req.user;
    }else{
        user = await BASECONTROL.BfindOne(adminUser,{email: u_item.email});
    }
    var total =  await this.get_revenue_from_user(user,start,end,req);
    await res.json({status:true, data:total});
    return next();
}

exports.get_revenue_from_user = async (user,start,end,req) =>{
    
    async function get_deposit_withdrawal(userlistquery,start, end){

        let  trandata =  await TransactionsHistory.aggregate([
            {$match: { $and: [{status : PCONFIG.Approve,  "createDate": { $gte: start, $lte:end}}],
                        $or : userlistquery
            }},
            {$group: {
                _id: { "wallettype": "$wallettype", },
                AMOUNT: {$sum: '$amount'},
                COUNT: {$sum: 1},
            }},
        ]);

        let g_row = {
            WITHDRAWL : {amount : 0,index: 0},
            DEPOSIT : {amount : 0,index: 0},
        }
        for(var i in trandata){
            g_row[trandata[i]["_id"]["wallettype"]].amount = trandata[i].AMOUNT;
            g_row[trandata[i]["_id"]["wallettype"]].index = trandata[i].COUNT;
        }

        return g_row;
    }

    var role = user;
    var total = {};
    var playersagentBalance = 0;

    var childrole = await BASECONTROL.Bfind(permission_model,{pid : role.permission,permission : {$ne :CONFIG.USERS.player }});

    let orquery = [];

    for(let i in childrole){
        if( childrole[i].permission != CONFIG.USERS.player ){
            orquery.push({permission : childrole[i].id})
        }else{

        }
    }


    let row = [];
    if(orquery.length > 0){
        row =  await  adminUser.find(
            { 
                $and : [{created : user.email,permission : {$ne :CONFIG.USERS.player }}],
                $or : orquery
            }
        )
    }
    if(row.length > 0){
        for(let j in row){
            playersagentBalance += parseInt(row[j]["playerid"].balance);
        }
    }


    total = await Object.assign(total, {playersagentBalance:playersagentBalance});    

    var userslist = await UsersControl.get_users_for_permission(role,start,end);
    total = await Object.assign(total, {playersRegistered:userslist.length});    

    userslist = await UsersControl.get_players_items(role);
    
    
   var totallogincount =   await totalusermodel.aggregate([
        {$match : { $and: [ { "date": { $gte: start, $lte:end} }] }},
        {$group : { _id:{"email":"$email"}, totallogincount:{$sum:1} }}
    ]);

    total = await Object.assign(total, {totallogincount:totallogincount.length});
    
    var Playerslogged = [];
    var totalPlayerBalance = 0;
    var totalPlayerBonusBalance = 0;
    var MakingDepositsAmount = 0;
    var playersMakingWithdrawl = 0;
    var MakingWithdrawlAmount = 0;
    var playersMakingDeposit = 0;

    var orquery1 = [];
    var userquery = [];
    for(var i in userslist){
        orquery1.push({id :(userslist[i]._id)})
        userquery.push({userid :mongoose.Types.ObjectId(userslist[i]._id)})

        totalPlayerBalance += userslist[i].playerid.balance;
        totalPlayerBonusBalance += userslist[i].playerid.bonusbalance;
    }


        if(orquery1.length > 0){

            let item = await BASECONTROL.Bfind(SessionModel,{ $or : orquery1});
            if(item && item.length){
                Playerslogged = item.length;
            }
        }

            if(userquery.length > 0){

                let transdata = await get_deposit_withdrawal(userquery,start,end);
    
                MakingWithdrawlAmount += transdata['WITHDRAWL'].amount;
                MakingDepositsAmount += transdata['DEPOSIT'].amount;
                playersMakingWithdrawl += transdata['WITHDRAWL'].index;
                playersMakingDeposit += transdata['DEPOSIT'].index;
            }
    
        
    total = await Object.assign(total, 
    {playersLoggedIn:Playerslogged},
    {playersBalance:totalPlayerBalance},
    {playersBonusBalance:totalPlayerBonusBalance},
    {playersMakingDeposit:playersMakingDeposit},
    {MakingDeposits:MakingDepositsAmount},
    {playersMakingWithdrawals:playersMakingWithdrawl},
    {MakingWithdrawals:MakingWithdrawlAmount});

    return total;
}

exports.get_profit = async ( start,end, role) =>{
    var totalwallet = {
        BET : 0,
        WIN : 0,
        betindex : 0,
        Profit : 0
    };
    if(role.permission == CONFIG.USERS.superadmin){
        var roles = await BASECONTROL.Bfind(adminUser,{permission : CONFIG.USERS.supermaster,isdelete : false});
        for(var i in roles){
            let wallet =  await this.get_profit_agent(start,end,roles[i]);
            let c_profit = wallet["Profit"];
            totalwallet["BET"] += parseInt(wallet["BET"]);
            totalwallet["WIN"] += parseInt(wallet["WIN"]);
            totalwallet["betindex"] += (wallet["betindex"]);

            var positiontaking = parseInt(roles[i].positiontaking);
            var c_pos_tak1 = positiontaking > 0 && positiontaking < 100 ? (100 - positiontaking)/100 : 0;
            var c_pos_tak2 = positiontaking > 0 && positiontaking < 100 ? positiontaking/100 : 0;

            if (c_pos_tak1) {
                let profit = (c_profit * c_pos_tak2 / c_pos_tak1);
                totalwallet["Profit"] += parseInt(profit);
            }

        }
    }else{

        let wallet =  await this.get_profit_agent(start,end,role);
        totalwallet["BET"] += parseInt(wallet["BET"]);
        totalwallet["WIN"] += parseInt(wallet["WIN"]);
        totalwallet["Profit"] += parseInt(wallet["Profit"]);
        totalwallet["betindex"] += parseInt(wallet["betindex"]);
    }

    return totalwallet;
}

exports.get_profit_agent = async ( start,end, role) =>{

    var positiontaking = parseInt(role.positiontaking);
    var c_pos_tak = positiontaking > 0 && positiontaking < 100 ? (100 - positiontaking) / 100 : 0;
    var userslist = await UsersControl.get_players_items(role);

    var totalwallet = {
        BET : 0,
        WIN : 0,
        CANCELED_BET : 0,
        betindex : 0
    };

    var orquery = [];
    for(var i in userslist){
        orquery.push({userid :mongoose.Types.ObjectId(userslist[i]._id)})
    }

    if(orquery.length > 0)
    {
        var totals = await bethistory_model.aggregate(
            [
                {
                    $match: 
                    { 
                        $and: 
                        [
                            { 
                                DATE: {$gte: start,$lte:end},
                                AMOUNT : { $ne : 0 }
                            },
                        ],
                        $or : orquery
                    }
                },
                {
                    $group: 
                    {  
                        _id  : "$TYPE",
                        AMOUNT: {$sum: '$AMOUNT'},
                        COUNT: {$sum: 1},
                    }
                }
            ]
        )
            
        for(var k in totals){
            totalwallet[totals[k]["_id"]] = totals[k].AMOUNT;
            if ( totals[k]["_id"] == "BET") {
                totalwallet["betindex"] = totals[k].COUNT 
            }
        }
    }
    
    var Profit = (totalwallet.BET - totalwallet.CANCELED_BET - totalwallet.WIN) * c_pos_tak;

    return { 
        Profit : Profit, 
        BET : totalwallet.BET - totalwallet.CANCELED_BET,
        WIN : totalwallet.WIN,
        betindex : totalwallet.betindex
    }
}
