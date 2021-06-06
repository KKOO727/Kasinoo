const GAMELISTMODEL = require('../models/games_model').GAMELISTMODEL;  
const GamePlay = require('../models/users_model').GamePlay;  
const PROVIDERMODELS = require("../models/games_model").PROVIDERMODELS;
const UsersControl = require("./userscontroller")
const BASECONTROL = require("./basecontroller");
const UserModel = require("../models/users_model").adminUser
const TransactionsHistory = require('../models/paymentGateWayModel').TransactionsHistory;  
const mongoose = require('mongoose');
const bethistory_model = require('../models/bethistory_model').BettingHistory_model;  
const PCONFIG = require("../config/pconfig")
const {sportsBet, sportsTypeList} = require("../models/sports_model")
const {matka_betmodels,BazaarModel} = require("../models/matka_model")
const SATACONFIG = require("../config/sconfig")
// function BettingHistory_model (dt){
//     return bethistory_model.BettingHistory_model(dt);
// }


// function get_bettingtable_prefix(start,i){
//     var date = new Date(start);
//     var year = date.getFullYear();
//     var smonth = date.getMonth() + 1;
//     var addyear = parseInt((i + smonth) / 13);
//     var fullyear = year + addyear;
//     var addmonth = (i + smonth) % 12;
//     addmonth = addmonth == 0 ? "12" : addmonth
//     var fullmonth = addmonth > 9 ? addmonth : "0" + addmonth;
//     var datestring = fullyear + "-"+fullmonth;
//     return datestring
// }

// function get_Months(start,end){
//     var date1 = new Date(start);
//     var date2 = new Date(end);
//     var index1 = (date2.getMonth() + 1) + 1;
//     var index2 = 12 - (date1.getMonth() + 1);
//     var year = date2.getFullYear() - date1.getFullYear() - 1;
//     var total = index1 + index2 + year * 12;
//     return total;
// }



exports.report_bygameid_history = async (req,res,next)=>{


    let filters = req.body.filters;
    let params = req.body.params;
    let dates = filters.dates;
    let gameid = filters.gameid;
    let userslist = [];
    var array = [];
    var orquery = [];
    var andquery = [];
    var totalwallet = {
        BET : 0,
        WIN : 0,
        CANCELED_BET : 0
    };
    var pages = {};
    var newrows = [];


    var start = BASECONTROL.get_stand_date_first(dates.start);
    var end = BASECONTROL.get_stand_date_first(dates.end);
    var role = BASECONTROL.getUserItem(req)
    userslist = await UsersControl.get_players_items(role);
    for (var i in userslist) {
        orquery.push({userid :mongoose.Types.ObjectId(userslist[i]._id)})
    }

    if (gameid && gameid.length > 0) {
        let gameitem = await BASECONTROL.BfindOne(GAMELISTMODEL,{_id : gameid});
        if (gameitem) {
            andquery = [ { "DATE": { $gte: start, $lte: end } ,"gameid" : mongoose.Types.ObjectId(gameid) }];
        }else{
            return res.send({status : false , error : "Please provide date."});
        }
    } else {
        andquery = [ { "DATE": { $gte: start, $lte: end } }];
    }
    
    if (orquery.length > 0 ) {

        let countarray =  await bethistory_model.aggregate([
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
                        "gameid" : "$gameid",
                    }, 
                }
            },
        ]);


        var totalcount = 0;
        if (countarray && countarray.length > 0) {
            totalcount = countarray.length;
        }

        pages = this.setpage(params,totalcount);

        array =  await bethistory_model.aggregate([
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
                        "gameid" : "$gameid",
                        "TYPE" : "$TYPE"
                    }, 
                    "bookCount": { "$sum": "$AMOUNT" }
                }
            },
            
            { 
                "$group": 
                {
                    "_id": "$_id.gameid",
                    "wallets": { 
                        "$push": { 
                            "type": "$_id.TYPE",
                            "count": "$bookCount"
                        },
                    },
                }
            },
            {
                "$lookup": {
                    "from": "game_game_lists",
                    "localField": "_id",
                    "foreignField": "_id",
                    "as": "game"
                }
            },
            { "$unwind": "$game" },
        ]);
        
        pages["skip2"] = (pages.skip) + array.length;
        if (array && array.length > 0) {


            newrows = [];
            
            for (var i in array) {
                let row = {};
                row = Object.assign({},array[i]._doc ? array[i]._doc.game : array[i].game );
                let wallet = {
                    WIN : 0,
                    BET : 0,
                    CANCELED_BET : 0,
                    GGR : 0
                }
                for(var j in array[i].wallets){
                    wallet[array[i]["wallets"][j]["type"]] = parseInt(array[i]["wallets"][j]["count"]);
                    totalwallet[array[i]["wallets"][j]["type"]] += parseInt(array[i]["wallets"][j]["count"]);
                }
                wallet["BET"] = wallet.BET - wallet.CANCELED_BET;
                wallet["GGR"] = wallet.BET - wallet.CANCELED_BET - wallet.WIN;
                row = Object.assign(row,wallet);
                newrows.push(row)
            }
        
        }
    }
    
    res.json(
        {
            status:true, 
            data:newrows,
            pageset : pages
        })    
    return next();
}

exports.report_bygameid_total = async (req,res,next)=>{

    let filters = req.body.filters;
    let dates = filters.dates;
    let userslist = [];
    var array = [];
    var orquery = [];
    var andquery = [];
    var totalwallet = {
        BET : 0,
        WIN : 0,
        CANCELED_BET : 0
    };
    var totalwin = 0;
    var totalbet = 0;
    var totalggr = 0;
    var gameoptions = [{"label" : "All",value : ""}];
    var realplayerscount = 0
   

    var start = BASECONTROL.get_stand_date_first(dates.start);
    var end = BASECONTROL.get_stand_date_first(dates.end);
    var role = BASECONTROL.getUserItem(req)
    userslist = await UsersControl.get_players_items(role);
    for (var i in userslist) {
        orquery.push({userid :mongoose.Types.ObjectId(userslist[i]._id)})
    }

  
    andquery = [ { "DATE": { $gte: start, $lte: end } }];
    

    if (orquery.length > 0 ) {

        let players = await this.getrealplayerscount(start,end,orquery);
        if (players && players.length > 0) {
            realplayerscount = players.length;
        }
        
        let options = await this.getGameOptions(start,end,orquery);
        if (options && options.length > 0) {
            gameoptions = [...gameoptions, ...options];
        }

        array =  await bethistory_model.aggregate([
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
                        "gameid" : "$gameid",
                        "TYPE" : "$TYPE"
                    }, 
                    "bookCount": { "$sum": "$AMOUNT" }
                }
            },
            
            { 
                "$group": 
                {
                    "_id": "$_id.gameid",
                    "wallets": { 
                        "$push": { 
                            "type": "$_id.TYPE",
                            "count": "$bookCount"
                        },
                    },
                }
            },
            {
                "$lookup": {
                    "from": "game_game_lists",
                    "localField": "_id",
                    "foreignField": "_id",
                    "as": "game"
                }
            },
            { "$unwind": "$game" },
        ]);
        
        if (array && array.length > 0) {
           
            for (var i in array) {
                for (var j in array[i].wallets) {
                    totalwallet[array[i]["wallets"][j]["type"]] += parseInt(array[i]["wallets"][j]["count"]);
                }
            }
        
            totalwin =  totalwallet.WIN;
            totalbet =  totalwallet.BET - totalwallet.CANCELED_BET;
            totalggr = totalwallet.BET - totalwallet.CANCELED_BET - totalwallet.WIN;
        }
    }

    res.json(
        {
            status:true, 
            data :  {
                totalwin : totalwin ,totalbet : totalbet,totalggr : totalggr,realplayerscount : realplayerscount,
                gameoptions : gameoptions
            },
        })    
    return next();
}

exports.getGameOptions = async (start,end,orquery) =>{
    let array =  await bethistory_model.aggregate([
        {
            $match:    
            { 
                $and: [ { "DATE": { $gte: start, $lte: end }}],
                $or : orquery
            },
        },
        {
            $group: 
            {  
                _id: "$gameid", 
            }
        },
        {
            "$lookup": {
                "from": "game_game_lists",
                "localField": "_id",
                "foreignField": "_id",
                "as": "game"
            }
        },
        { "$unwind": "$game" },
        {$project:{
            label:'$game.NAME',
            value:'$game._id',
       }}
    ]);
    return array;
}

exports.SportsgetGameOptions = async (start,end,orquery) =>{
    let array =  await sportsBet.aggregate([
        {
            $match:    
            { 
                $and: [ { "DATE": { $gte: start, $lte: end }}],
                $or : orquery
            },
        },
        {
            $group: 
            {  
                _id: "$gameid", 
            }
        },
        {
            "$lookup": {
                "from": "sports_lists",
                "localField": "_id",
                "foreignField": "_id",
                "as": "game"
            }
        },
        { "$unwind": "$game" },
        {
            $project:{
                label:'$game.sport_name',
                value:'$game._id',
            }
        }   
    ]);
    return array;
}


exports.SattagetGameOptions = async (start,end,orquery) =>{
    let array =  await matka_betmodels.aggregate([
        {
            $match:    
            { 
                $and: [ { "DATE": { $gte: start, $lte: end }}],
                $or : orquery
            },
        },
        {
            $group: 
            {  
                _id: "$bazaarid", 
            }
        },
        {
            "$lookup": {
                "from": "matka_bazaars",
                "localField": "_id",
                "foreignField": "_id",
                "as": "bazar"
            }
        },
        { "$unwind": "$bazar" },
        {
            $project:{
                label:'$bazar.bazaarname',
                value:'$bazar._id',
            }
        }   
    ]);
    return array;
}

exports.report_byplayer_history = async (req,res,next)=>{


    let filters = req.body.filters;
    let params = req.body.params;
    let dates = filters.dates;
    let userid = filters.playerid;
    let userslist = [];
    var array = [];
    var orquery = [];
    var andquery = [];
    var totalwallet = {
        BET : 0,
        WIN : 0,
        CANCELED_BET : 0
    };
    var pages = {};
    var newrows = [];

   

    var start = BASECONTROL.get_stand_date_first(dates.start);
    var end = BASECONTROL.get_stand_date_first(dates.end);
    var role = BASECONTROL.getUserItem(req)
    
    if (userid && userid.length > 0) {
        let useritem = await BASECONTROL.BfindOne(UserModel,{_id : userid});
        if (useritem) {
            userslist = [];
            userslist.push(useritem)
        } else {
            return res.send({status : false , error : "Please provide date."});
        }
    } else {
        userslist = await UsersControl.get_players_items(role);
    }

    for (var i in userslist) {
        orquery.push({userid :mongoose.Types.ObjectId(userslist[i]._id)})
    }


    andquery = [ { "DATE": { $gte: start, $lte: end } }];

    
    
    if (orquery.length > 0 ) {

        let countarray =  await bethistory_model.aggregate([
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
                        "userid" : "$userid",
                    }, 
                }
            },
        ]);


        var totalcount = 0;
        if (countarray && countarray.length > 0) {
            totalcount = countarray.length;
        }

        pages = this.setpage(params,totalcount);

        array =  await bethistory_model.aggregate([
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
                        "userid" : "$userid",
                        "TYPE" : "$TYPE"
                    }, 
                    "bookCount": { "$sum": "$AMOUNT" }
                }
            },
            
            { 
                "$group": 
                {
                    "_id": "$_id.userid",
                    "wallets": { 
                        "$push": { 
                            "type": "$_id.TYPE",
                            "count": "$bookCount"
                        },
                    },
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
            { "$limit": pages.limit },
            { "$skip": pages.skip }
        ]);
        
        pages["skip2"] = (pages.skip) + array.length;
        if (array && array.length > 0) {


            newrows = [];

            for (var i in array) {

                let row = {};
                row = Object.assign({},array[i]._doc ? array[i]._doc.user : array[i].user );
                let wallet = {
                    WIN : 0,
                    BET : 0,
                    CANCELED_BET : 0,
                    GGR : 0
                }
                for(var j in array[i].wallets){
                    wallet[array[i]["wallets"][j]["type"]] = parseInt(array[i]["wallets"][j]["count"]);
                    totalwallet[array[i]["wallets"][j]["type"]] += parseInt(array[i]["wallets"][j]["count"]);
                }
                wallet["BET"] = wallet.BET - wallet.CANCELED_BET;
                wallet["GGR"] = wallet.BET - wallet.CANCELED_BET - wallet.WIN;
                row = Object.assign(row,wallet);
                newrows.push(row)
            }
        
        }
    }

    
    res.json(
        {
            status:true, 
            data:newrows,
            pageset : pages
        })    
    return next();
}

exports.report_byplayer_total = async (req,res,next)=>{

    let filters = req.body.filters;
    let dates = filters.dates;
    let userslist = [];
    var array = [];
    var andquery = [];
    var orquery1 = [];
    var totalwallet = {
        BET : 0,
        WIN : 0,
        CANCELED_BET : 0
    };
    var totalwin = 0;
    var totalbet = 0;
    var totalggr = 0;
    var realplayerscount = 0
    var useroptions = [{"label" : "All",value : ""}];

 

    var start = BASECONTROL.get_stand_date_first(dates.start);
    var end = BASECONTROL.get_stand_date_first(dates.end);
    var role = BASECONTROL.getUserItem(req)
    userslist = await UsersControl.get_players_items(role);

    for (var i in userslist) {
        orquery1.push({userid :mongoose.Types.ObjectId(userslist[i]._id)})
    }
 

    andquery = [ { "DATE": { $gte: start , $lte: end } }];


    if (orquery1.length > 0 ) {

        let  players = await this.getrealplayerscount(start,end,orquery1)
        if (players && players.length > 0) {
            realplayerscount = players.length;
            useroptions = [...useroptions ,...players];

        }

        array =  await bethistory_model.aggregate([
            {
                $match:    
                { 
                    $and: andquery,
                    $or : orquery1
                },
            },
            {
                $group: 
                {  
                    _id: {
                        "userid" : "$userid",
                        "TYPE" : "$TYPE"
                    }, 
                    "bookCount": { "$sum": "$AMOUNT" }
                }
            },
            
            { 
                "$group": 
                {
                    "_id": "$_id.userid",
                    "wallets": { 
                        "$push": { 
                            "type": "$_id.TYPE",
                            "count": "$bookCount"
                        },
                    },
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
        ]);
        
        if (array && array.length > 0) {
           
            for (var i in array) {
    
                for (var j in array[i].wallets) {
                    totalwallet[array[i]["wallets"][j]["type"]] += parseInt(array[i]["wallets"][j]["count"]);
                }
            }
        
            totalwin =  totalwallet.WIN;
            totalbet =  totalwallet.BET - totalwallet.CANCELED_BET;
            totalggr = totalwallet.BET - totalwallet.CANCELED_BET - totalwallet.WIN;
        }
    }

    res.json(
        {
            status:true, 
            data :  {
                totalwin : totalwin ,totalbet : totalbet,totalggr : totalggr,realplayerscount : realplayerscount,
                useroptions : useroptions
            },
        })    
    return next();
}

exports.report_byprovider_history = async (req,res,next)=>{


    let filters = req.body.filters;
    let params = req.body.params;
    let dates = filters.dates;
    let providerid = filters.providerid;
    let userslist = [];
    var array = [];
    var orquery = [];
    var andquery = [];
    var totalwallet = {
        BET : 0,
        WIN : 0,
        CANCELED_BET : 0
    };
    var pages = {};
    var newrows = [];


    var start = BASECONTROL.get_stand_date_first(dates.start);
    var end = BASECONTROL.get_stand_date_first(dates.end);
    var role = BASECONTROL.getUserItem(req)
    userslist = await UsersControl.get_players_items(role);
    for (var i in userslist) {
        orquery.push({userid :mongoose.Types.ObjectId(userslist[i]._id)})
    }

    
    if (providerid && providerid.length > 0) {
        let provideritem = await BASECONTROL.BfindOne(PROVIDERMODELS,{_id : providerid});
        if (provideritem) {
            andquery = [ { "DATE": { $gte: start, $lte: end } ,"providerid" : mongoose.Types.ObjectId(providerid) }];
        }else{
            return res.send({status : false , error : "Please provide date."});
        }
    } else {
        andquery = [ { "DATE": { $gte: start, $lte: end } }];
    }
    
    if (orquery.length > 0 ) {

        let countarray =  await bethistory_model.aggregate([
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
                        "providerid" : "$providerid",
                    }, 
                }
            },
        ]);

        var totalcount = 0;
        if (countarray && countarray.length > 0) {
            totalcount = countarray.length;
        }

        pages = this.setpage(params,totalcount);

        array =  await bethistory_model.aggregate([
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
                        "providerid" : "$providerid",
                        "TYPE" : "$TYPE"
                    }, 
                    "bookCount": { "$sum": "$AMOUNT" }
                }
            },
            
            { 
                "$group": 
                {
                    "_id": "$_id.providerid",
                    "wallets": { 
                        "$push": { 
                            "type": "$_id.TYPE",
                            "count": "$bookCount"
                        },
                    },
                }
            },
            {
                "$lookup": {
                    "from": "game_gameproviders",
                    "localField": "_id",
                    "foreignField": "_id",
                    "as": "provider"
                }
            },
            { "$unwind": "$provider" },
            { "$limit": pages.limit },
            { "$skip": pages.skip }
        ]);
        
        pages["skip2"] = (pages.skip) + array.length;
        if (array && array.length > 0) {

            newrows = [];

            for (var i in array) {

                let row = {};
                row = Object.assign({},array[i]._doc ? array[i]._doc.provider : array[i].provider );
                let wallet = {
                    WIN : 0,
                    BET : 0,
                    CANCELED_BET : 0,
                    GGR : 0
                }
                for (var j in array[i].wallets) {
                    wallet[array[i]["wallets"][j]["type"]] = parseInt(array[i]["wallets"][j]["count"]);
                    totalwallet[array[i]["wallets"][j]["type"]] += parseInt(array[i]["wallets"][j]["count"]);
                }
                wallet["BET"] = wallet.BET - wallet.CANCELED_BET;
                wallet["GGR"] = wallet.BET - wallet.CANCELED_BET - wallet.WIN;
                row = Object.assign(row,wallet);
                newrows.push(row)
            }
        }
    }
    
    res.json(
        {
            status:true, 
            data:newrows,
            pageset : pages
        })    
    return next();
}

exports.report_byprovider_total = async (req,res,next)=>{

    let filters = req.body.filters;
    let dates = filters.dates;
    let providerid = filters.providerid;
    let userslist = [];
    var array = [];
    var orquery = [];
    var andquery = [];
    var totalwallet = {
        BET : 0,
        WIN : 0,
        CANCELED_BET : 0
    };
    var totalwin = 0;
    var totalbet = 0;
    var totalggr = 0;
    var provideroptions = [];
    var realplayerscount = 0
  

    var start = BASECONTROL.get_stand_date_first(dates.start);
    var end = BASECONTROL.get_stand_date_first(dates.end);
    var role = BASECONTROL.getUserItem(req)
    userslist = await UsersControl.get_players_items(role);
    for (var i in userslist) {
        orquery.push({userid :mongoose.Types.ObjectId(userslist[i]._id)})
    }

    // if (providerid && providerid.length > 0) {
    //     let provideritem = await BASECONTROL.BfindOne(PROVIDERMODELS,{_id : providerid});
    //     if (provideritem) {
    //         andquery = [ { "DATE": { $gte: start, $lte: end } ,"providerid" : mongoose.Types.ObjectId(providerid) }];
    //     }else{
    //         return res.send({status : false , error : "Please provide date."});
    //     }
    // } else {
    // }
    
    andquery = [ { "DATE": { $gte: start, $lte: end } }];

    if (orquery.length > 0 ) {

        let players = await this.getrealplayerscount(start,end,orquery)
        if (players && players.length > 0) {
            realplayerscount = players.length;
        }

        provideroptions = await this.getProviderOPtions(start,end,orquery)


        array =  await bethistory_model.aggregate([
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
                        "providerid" : "$providerid",
                        "TYPE" : "$TYPE"
                    }, 
                    "bookCount": { "$sum": "$AMOUNT" }
                }
            },
            
            { 
                "$group": 
                {
                    "_id": "$_id.providerid",
                    "wallets": { 
                        "$push": { 
                            "type": "$_id.TYPE",
                            "count": "$bookCount"
                        },
                    },
                }
            },
            {
                "$lookup": {
                    "from": "game_gameproviders",
                    "localField": "_id",
                    "foreignField": "_id",
                    "as": "provider"
                }
            },
            { "$unwind": "$provider" },
        ]);
        
        if (array && array.length > 0) {
           
            for (var i in array) {
    
                for (var j in array[i].wallets) {
                    totalwallet[array[i]["wallets"][j]["type"]] += parseInt(array[i]["wallets"][j]["count"]);
                }
            }
        
            totalwin =  totalwallet.WIN;
            totalbet =  totalwallet.BET - totalwallet.CANCELED_BET;
            totalggr = totalwallet.BET - totalwallet.CANCELED_BET - totalwallet.WIN;
        }
    }

    res.json(
        {
            status:true, 
            data :  {
                totalwin : totalwin ,totalbet : totalbet,totalggr : totalggr,realplayerscount : realplayerscount,
                provideroptions : provideroptions
            },
        })    
    return next();
}

exports.getProviderOPtions = async (start,end,orquery) =>{
    let options = [{"label" : "All",value : ""}];
    let array =  await bethistory_model.aggregate([
        {
            $match:    
            { 
                $and: [ { "DATE": { $gte: start,$lte: end } }],
                $or : orquery
            },
        },
        {
            $group: 
            {  
                _id: "$providerid",
                "bookCount": { "$sum": "$AMOUNT" }
            }
        },
        {
            "$lookup": {
                "from": "game_gameproviders",
                "localField": "_id",
                "foreignField": "_id",
                "as": "provider"
            }
        },
        { "$unwind": "$provider" },
        {  
            $project:{
            label:'$provider.text',
            value:'$provider._id',
        }
    }
    ]);

    if ( array && array.length) {
        options = [...options,...array];
    }


    return options;
}


exports.report_bybet_history = async (req,res,next)=>{
    let filters = req.body.filters;
    let params = req.body.params;
    let dates = filters.dates;
    let userid = filters.userid;
    let userslist = [];
    var array = [];
    var orquery = [];
    let pages = {};


    var start = BASECONTROL.get_stand_date_first(dates.start);
    var end = BASECONTROL.get_stand_date_first(dates.end);
    var role = BASECONTROL.getUserItem(req);

    if (userid && userid.length > 0) {
        let useritem = await BASECONTROL.BfindOne(UserModel,{_id : userid});
        if (useritem) {
            userslist.push(useritem)
        } else {
            return res.send({status : false , error : "Please provide date."});
        }
    } else {
        userslist = await UsersControl.get_players_items(role);
    }

    for(var i in userslist){
        orquery.push({userid :mongoose.Types.ObjectId(userslist[i]._id)})
    }
    
    
    if(orquery.length > 0) {

        let totalcount =  await bethistory_model.countDocuments(
            { 
                $and: [ 
                    { "DATE": { $gte: start } }, { "DATE": { $lte: end } },{AMOUNT :{$ne : 0} }
                ],
                $or : orquery
            },
        );
        
        pages = this.setpage(params,totalcount);
        if (totalcount > 0) {
    
            array =  await bethistory_model.find(
            { 
                $and: [ 
                    { "DATE": { $gte: start } }, { "DATE": { $lte: end } },{AMOUNT :{$ne : 0} }
                ],
                $or : orquery
            },
            "AMOUNT TYPE DATE"
            ).populate("gameid",["TYPE", "NAME", "ID", "PROVIDERID", "image"])
            .populate("userid").skip(pages.skip).limit(pages.limit);

            
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

exports.report_bybet_total = async (req,res,next)=>{

    let filters = req.body.filters;
    let dates = filters.dates;
  
    let userid = filters.userid;
    var totalwallet = {
        BET : 0,
        WIN : 0,
        CANCELED_BET : 0
    };
    var orquery = []
    var realplayerscount = 0;
    var totalwin = 0;
    var totalbet = 0;
    var totalggr = 0;
    var useoptions = [{"label" : "All",value : ""}];

    var start = BASECONTROL.get_stand_date_first(dates.start);
    var end = BASECONTROL.get_stand_date_first(dates.end);
    var role = BASECONTROL.getUserItem(req)
    var userslist = [];
    var orquery1 = [];
    userslist = await UsersControl.get_players_items(role);

    for (var i in userslist) {
        orquery1.push({userid :mongoose.Types.ObjectId(userslist[i]._id)});
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

    for (var i in userslist) {
        orquery.push({userid :mongoose.Types.ObjectId(userslist[i]._id)});
    }

    if (orquery.length > 0) {

        let totalcount =  await bethistory_model.countDocuments(
            { 
                $and: [ 
                    { "DATE": { $gte: start , $lte: end } },{AMOUNT :{$ne : 0} }
                ],
                $or : orquery
            },
        );
        
        if (totalcount > 0) {
    
            let tdata =  await bethistory_model.aggregate(
                [
                    {
                        $match:    
                        { 
                            $and: [ { "DATE": { $gte: start ,$lte: end } }],
                            $or : orquery
                        },
                    },
                    {
                        $group: 
                        {  
                            _id: {
                                "TYPE" : "$TYPE",
                            }, 
                            "amount": { "$sum": "$AMOUNT" }
                        }
                    },
                ]
            )
    
            

            for ( var i in tdata ) {
                totalwallet[tdata[i]["_id"]["TYPE"]] += parseInt(tdata[i]["amount"]);
            }

            totalwin =  totalwallet.WIN;
            totalbet =  totalwallet.BET - totalwallet.CANCELED_BET;
            totalggr =   (totalwallet.BET - totalwallet.WIN - totalwallet.CANCELED_BET);

            let players = await this.getrealplayerscount(start,end,orquery1);
            if (players && players.length > 0) {
                realplayerscount = players.length;
                useoptions = [...useoptions,...players]
            }
        }
    }

    res.json(
    {
        status:true, 
        data :  {
            totalwin : totalwin ,totalbet : totalbet,totalggr : totalggr,realplayerscount : realplayerscount,
            useoptions : useoptions
        },
    })
    return next();    
}

exports.setpage =  (params,totalcount) =>{
    let { page, perPage } = params;
	let newparams = {};
	if (page !== undefined && perPage !== undefined) {
        var totalPages = Math.ceil(totalcount / perPage);
		let calculatedPage = (page - 1) * perPage;
	  	if (calculatedPage > totalcount) {
			newparams['page'] = 1;
			newparams['perPage'] = parseInt(perPage);
		} else {
            newparams['perPage'] = parseInt(perPage);
            newparams['page'] = parseInt(page);
		}
	} else {
		totalPages = Math.ceil(totalcount / 10);
        newparams['page'] = 1;
        newparams['perPage'] = 10;
	}

    let index1 = newparams.page == 0 ? 0 : newparams.page - 1; 
    let index2 = newparams.page == 0 ? 1 : newparams.page;
    let skip = index1 * (newparams.perPage);
    let limit = index2 * (newparams.perPage);
    
	return {totalPages : totalPages,params : newparams,skip  : skip ,limit : limit,totalRecords :totalcount }
}

exports.getrealplayerscount =  async (start,end,orquery) =>{
    let betuser =  await bethistory_model.aggregate(
        [
            {
                $match:    
                { 
                    $and: [ { "DATE": { $gte: start,$lte: end } }],
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
               }
            }
        ]
    )

    return betuser;
}


exports.Sportsgetrealplayerscount =  async (start,end,orquery) =>{
    let betuser =  await sportsBet.aggregate(
        [
            {
                $match:    
                { 
                    $and: [ { "DATE": { $gte: start,$lte: end } }],
                    $or : orquery
                },
            },
            {
                $group: 
                {  
                    _id: "$USERID",
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
               }
            }
        ]
    )

    return betuser;
}



exports.Sattagetrealplayerscount =  async (start,end,orquery) =>{
    let betuser =  await matka_betmodels.aggregate(
        [
            {
                $match:    
                { 
                    $and: [ { "DATE": { $gte: start,$lte: end } }],
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
               }
            }
        ]
    )

    return betuser;
}


exports.adminBetsHitoryTotalFromEmail = async (req,res,next) => {

    let row =req.body.row;
    if (req.body.player) {
        var playerid = req.user._id;
    } else {
        var playerid = row.id;
    }
    var playitem = await BASECONTROL.BfindOne(GamePlay,{id : mongoose.Types.ObjectId(playerid) });
    var totalwallet = {
        BET : 0,
        WIN : 0,
        CANCELED_BET : 0
    };
    var currentwalletbalance = playitem.balance;
    var start = BASECONTROL.get_stand_date_end(row.start);
    var end = BASECONTROL.get_stand_date_end(row.end);
    var totals = await bethistory_model.aggregate(
        [
            {$match: { $and: [{DATE: {$gte: start,$lte:end}, userid :mongoose.Types.ObjectId(playitem.id) }]}},
            {$group: {  _id: {"TYPE" : "$TYPE"}, AMOUNT: {$sum: '$AMOUNT'},}}
        ]
    )
    

    for(var i in totals){
        totalwallet[totals[i]["_id"].TYPE] += totals[i].AMOUNT;                                    
    }

    var MakingDepositsAmount = 0;
    var rdata =  await TransactionsHistory.aggregate([
        {$match: { $and: [{ "createDate": { $gte: start } }, { "createDate": { $lte: end } }, { "status": PCONFIG.Approve }, { wallettype : "DEPOSIT" },{userid : mongoose.Types.ObjectId(playitem.id)}]}},
        {$group: {  _id: null, AMOUNT: {$sum: '$amount'},}}
    ]);
    if(rdata && rdata.length > 0){
        MakingDepositsAmount = parseInt(rdata[0].AMOUNT);
    }

    var newrow = Object.assign({},{totalbet : parseInt(totalwallet.BET - totalwallet.CANCELED_BET)},
        {totalwin : parseInt(totalwallet.WIN)},
        {currentwalletbalance : parseInt(currentwalletbalance)},
        {totaldeposit : MakingDepositsAmount});
    res.json({status : true,data : newrow});
    return next();
}

exports.adminreports_email_load = async(req,res,next)=>{

    var row = req.body.row;
    let params = req.body.params;
    var start = BASECONTROL.get_stand_date_end(row.start);
    var end = BASECONTROL.get_stand_date_end(row.end);
    if (req.body.player) {
        var playerid = req.user._id;
    } else {
        var playerid = row.id;
    }
    var array = [];
    let andquery = {
        DATE: {$gte: start,$lte:end}, 
        userid :mongoose.Types.ObjectId(playerid),
        AMOUNT : {$ne : 0}
    }
    let totalcount = await bethistory_model.countDocuments(andquery);
    var pages = this.setpage(params,totalcount);
    if (totalcount > 0) {
        var array =  await bethistory_model.find(andquery)
        .sort({DATE : -1})
        .populate({ path : "gameid", select : "PROVIDERID NAME"})
        .skip(pages.skip).limit(pages.params.perPage);
    }
    pages["skip2"] = (pages.skip) + array.length;

    res.json({status : true, data : array, pageset : pages});
    return next();
}

exports.sportsBybetTotal = async (req ,res, next) => {
    let filters = req.body.filters;
    let dates = filters.dates;
  
    let userid = filters.userid;
    var totalwallet = {
        BET : 0,
        WIN : 0,
        CANCEL : 0,

    };
    var orquery = []
    var realplayerscount = 0;
    var totalwin = 0;
    var totalbet = 0;
    var totalggr = 0;
    var useoptions = [{"label" : "All",value : ""}];

    var start = BASECONTROL.get_stand_date_first(dates.start);
    var end = BASECONTROL.get_stand_date_first(dates.end);
    var role = BASECONTROL.getUserItem(req)
    var userslist = [];
    var orquery1 = [];
    userslist = await UsersControl.get_players_items(role);

    for (var i in userslist) {
        orquery1.push({USERID :mongoose.Types.ObjectId(userslist[i]._id)});
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

    for (var i in userslist) {
        orquery.push({USERID :mongoose.Types.ObjectId(userslist[i]._id)});
    }

    if (orquery.length > 0) {

        let totalcount =  await sportsBet.countDocuments(
            { 
                $and: [ 
                    { "DATE": { $gte: start , $lte: end } },{AMOUNT :{$ne : 0} }
                ],
                $or : orquery
            },
        );
        
        if (totalcount > 0) {
    
            let tdata =  await sportsBet.aggregate(
                [
                    {
                        $match:    
                        { 
                            $and: [ { "DATE": { $gte: start ,$lte: end } }],
                            $or : orquery
                        },
                    },
                    {
                        $group: 
                        {  
                            _id: {
                                "TYPE" : "$TYPE",
                            }, 
                            "amount": { "$sum": "$AMOUNT" }
                        }
                    },
                ]
            )
    
            

            for ( var i in tdata ) {
                totalwallet[tdata[i]["_id"]["TYPE"]] += parseInt(tdata[i]["amount"]);
            }

            totalwin =  totalwallet.WIN;
            totalbet =  totalwallet.BET - totalwallet.CANCEL;
            totalggr =   (totalwallet.BET - totalwallet.WIN - totalwallet.CANCEL);

            let players = await this.Sportsgetrealplayerscount(start,end,orquery1);
            if (players && players.length > 0) {
                realplayerscount = players.length;
                useoptions = [...useoptions,...players]
            }
        }
    }

    res.json(
    {
        status:true, 
        data :  {
            totalwin : totalwin ,totalbet : totalbet,totalggr : totalggr,realplayerscount : realplayerscount,
            useoptions : useoptions
        },
    })
    return next();    
}

exports.sportsBybethistory = async (req ,res, next) => {
    let filters = req.body.filters;
    let params = req.body.params;
    let dates = filters.dates;
    let userid = filters.userid;
    let userslist = [];
    var array = [];
    var orquery = [];
    let pages = {};


    var start = BASECONTROL.get_stand_date_first(dates.start);
    var end = BASECONTROL.get_stand_date_first(dates.end);
    var role = BASECONTROL.getUserItem(req);

    if (userid && userid.length > 0) {
        let useritem = await BASECONTROL.BfindOne(UserModel,{_id : userid});
        if (useritem) {
            userslist.push(useritem)
        } else {
            return res.send({status : false , error : "Please provide date."});
        }
    } else {
        userslist = await UsersControl.get_players_items(role);
    }

    for(var i in userslist){
        orquery.push({USERID :mongoose.Types.ObjectId(userslist[i]._id)})
    }
    
    
    if(orquery.length > 0) {
        let totalcount =  await sportsBet.countDocuments(
            { 

                $and: [ 
                    { "DATE": { $gte: start } }, { "DATE": { $lte: end } },{AMOUNT :{$ne : 0} }
                ],
                $or : orquery
            },
        );
        
        pages = this.setpage(params,totalcount);
        if (totalcount > 0) {
    
            array =  await sportsBet.find(
            { 
                $and: [ 
                    { "DATE": { $gte: start } }, { "DATE": { $lte: end } },{AMOUNT :{$ne : 0} }
                ],
                $or : orquery
            },
            ).populate("gameid")
            .populate("USERID").skip(pages.skip).limit(pages.limit);
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


exports.sportsByplayerhistory = async (req,res,next)=>{


    let filters = req.body.filters;
    let params = req.body.params;
    let dates = filters.dates;
    let userid = filters.playerid;
    let userslist = [];
    var array = [];
    var orquery = [];
    var andquery = [];
    var totalwallet = {
        BET : 0,
        WIN : 0,
        CANCEL : 0
    };
    var pages = {};
    var newrows = [];

    

    var start = BASECONTROL.get_stand_date_first(dates.start);
    var end = BASECONTROL.get_stand_date_first(dates.end);
    var role = BASECONTROL.getUserItem(req)
    
    if (userid && userid.length > 0) {
        let useritem = await BASECONTROL.BfindOne(UserModel,{_id : userid});
        if (useritem) {
            userslist = [];
            userslist.push(useritem)
        } else {
            return res.send({status : false , error : "Please provide date."});
        }
    } else {
        userslist = await UsersControl.get_players_items(role);
    }

    for (var i in userslist) {
        orquery.push({USERID :mongoose.Types.ObjectId(userslist[i]._id)})
    }


    andquery = [ { "DATE": { $gte: start, $lte: end } }];

    
    
    if (orquery.length > 0 ) {

        let countarray =  await sportsBet.aggregate([
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
                        "userid" : "$USERID",
                    }, 
                }
            },
        ]);


        var totalcount = 0;
        if (countarray && countarray.length > 0) {
            totalcount = countarray.length;
        }

        pages = this.setpage(params,totalcount);

        array =  await sportsBet.aggregate([
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
                        "userid" : "$USERID",
                        "TYPE" : "$TYPE"
                    }, 
                    "bookCount": { "$sum": "$AMOUNT" }
                }
            },
            
            { 
                "$group": 
                {
                    "_id": "$_id.userid",
                    "wallets": { 
                        "$push": { 
                            "type": "$_id.TYPE",
                            "count": "$bookCount"
                        },
                    },
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
            { "$limit": pages.limit },
            { "$skip": pages.skip }
        ]);
        
        pages["skip2"] = (pages.skip) + array.length;
        if (array && array.length > 0) {


            newrows = [];

            for (var i in array) {

                let row = {};
                row = Object.assign({},array[i]._doc ? array[i]._doc.user : array[i].user );
                let wallet = {
                    WIN : 0,
                    BET : 0,
                    CANCEL : 0,
                    GGR : 0
                }
                for(var j in array[i].wallets){
                    wallet[array[i]["wallets"][j]["type"]] = parseInt(array[i]["wallets"][j]["count"]);
                    totalwallet[array[i]["wallets"][j]["type"]] += parseInt(array[i]["wallets"][j]["count"]);
                }
                wallet["BET"] = wallet.BET - wallet.CANCEL;
                wallet["GGR"] = wallet.BET - wallet.CANCEL - wallet.WIN;
                row = Object.assign(row,wallet);
                newrows.push(row)
            }
        
        }
    }
    
    res.json(
        {
            status:true, 
            data:newrows,
            pageset : pages
        })    
    return next();
}

exports.sportsByplayerTotal = async (req,res,next)=>{

    let filters = req.body.filters;
    let dates = filters.dates;
    let userid = filters.playerid;
    let userslist = [];
    var array = [];
    var orquery = [];
    var andquery = [];
    var orquery1 = [];
    var totalwallet = {
        BET : 0,
        WIN : 0,
        CANCEL : 0
    };
    var totalwin = 0;
    var totalbet = 0;
    var totalggr = 0;
    var realplayerscount = 0
    var useroptions = [{"label" : "All",value : ""}];


    var start = BASECONTROL.get_stand_date_first(dates.start);
    var end = BASECONTROL.get_stand_date_first(dates.end);
    var role = BASECONTROL.getUserItem(req)
    userslist = await UsersControl.get_players_items(role);

    for (var i in userslist) {
        orquery1.push({USERID :mongoose.Types.ObjectId(userslist[i]._id)})
    }
 

    // if (userid && userid.length > 0) {
    //     let useritem = await BASECONTROL.BfindOne(UserModel,{_id : userid});
    //     if (useritem) {
    //         userslist = [];
    //         userslist.push(useritem)
    //     } else {
    //         return res.send({status : false , error : "Please provide date."});
    //     }
    // }

    // for (var i in userslist) {
    //     orquery.push({USERID :mongoose.Types.ObjectId(userslist[i]._id)})
    // }

    andquery = [ { "DATE": { $gte: start , $lte: end } }];


    if (orquery1.length > 0 ) {

        let  players = await this.Sportsgetrealplayerscount(start,end,orquery1)
        if (players && players.length > 0) {
            realplayerscount = players.length;
            useroptions = [...useroptions ,...players];

        }

        array =  await sportsBet.aggregate([
            {
                $match:    
                { 
                    $and: andquery,
                    $or : orquery1
                },
            },
            {
                $group: 
                {  
                    _id: {
                        "userid" : "$USERID",
                        "TYPE" : "$TYPE"
                    }, 
                    "bookCount": { "$sum": "$AMOUNT" }
                }
            },
            
            { 
                "$group": 
                {
                    "_id": "$_id.userid",
                    "wallets": { 
                        "$push": { 
                            "type": "$_id.TYPE",
                            "count": "$bookCount"
                        },
                    },
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
        ]);
        
        if (array && array.length > 0) {
           
            for (var i in array) {
    
                for (var j in array[i].wallets) {
                    totalwallet[array[i]["wallets"][j]["type"]] += parseInt(array[i]["wallets"][j]["count"]);
                }
            }
        
            totalwin =  totalwallet.WIN;
            totalbet =  totalwallet.BET - totalwallet.CANCEL;
            totalggr = totalwallet.BET - totalwallet.CANCEL - totalwallet.WIN;
        }
    }

    res.json(
        {
            status:true, 
            data :  {
                totalwin : totalwin ,totalbet : totalbet,totalggr : totalggr,realplayerscount : realplayerscount,
                useroptions : useroptions
            },
        })    
    return next();
}





exports.sportsBygameshistory = async (req,res,next)=>{


    let filters = req.body.filters;
    let params = req.body.params;
    let dates = filters.dates;
    let gameid = filters.gameid;
    let userslist = [];
    var array = [];
    var orquery = [];
    var andquery = [];
    var totalwallet = {
        BET : 0,
        WIN : 0,
        CANCEL : 0
    };
    var pages = {};
    var newrows = [];


    var start = BASECONTROL.get_stand_date_first(dates.start);
    var end = BASECONTROL.get_stand_date_first(dates.end);
    var role = BASECONTROL.getUserItem(req)
    userslist = await UsersControl.get_players_items(role);
    for (var i in userslist) {
        orquery.push({USERID :mongoose.Types.ObjectId(userslist[i]._id)})
    }

    if (gameid && gameid.length > 0) {
        let gameitem = await BASECONTROL.BfindOne(sportsTypeList,{_id : gameid});
        if (gameitem) {
            andquery = [ { "DATE": { $gte: start, $lte: end } ,"gameid" : mongoose.Types.ObjectId(gameid) }];
        }else{
            return res.send({status : false , error : "Please provide date."});
        }
    } else {
        andquery = [ { "DATE": { $gte: start, $lte: end } }];
    }
    
    if (orquery.length > 0 ) {

        let countarray =  await sportsBet.aggregate([
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
                        "gameid" : "$gameid",
                    }, 
                }
            },
        ]);


        var totalcount = 0;
        if (countarray && countarray.length > 0) {
            totalcount = countarray.length;
        }

        pages = this.setpage(params,totalcount);

        array =  await sportsBet.aggregate([
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
                        "gameid" : "$gameid",
                        "TYPE" : "$TYPE"
                    }, 
                    "bookCount": { "$sum": "$AMOUNT" }
                }
            },
            
            { 
                "$group": 
                {
                    "_id": "$_id.gameid",
                    "wallets": { 
                        "$push": { 
                            "type": "$_id.TYPE",
                            "count": "$bookCount"
                        },
                    },
                }
            },
            {
                "$lookup": {
                    "from": "sports_lists",
                    "localField": "_id",
                    "foreignField": "_id",
                    "as": "game"
                }
            },
            { "$unwind": "$game" },
        ]);
        
        pages["skip2"] = (pages.skip) + array.length;
        if (array && array.length > 0) {


            newrows = [];
            
            for (var i in array) {
                let row = {};
                row = Object.assign({},array[i]._doc ? array[i]._doc.game : array[i].game );
                let wallet = {
                    WIN : 0,
                    BET : 0,
                    CANCEL : 0,
                    GGR : 0
                }
                for(var j in array[i].wallets){
                    wallet[array[i]["wallets"][j]["type"]] = parseInt(array[i]["wallets"][j]["count"]);
                    totalwallet[array[i]["wallets"][j]["type"]] += parseInt(array[i]["wallets"][j]["count"]);
                }
                wallet["BET"] = wallet.BET - wallet.CANCEL;
                wallet["GGR"] = wallet.BET - wallet.CANCEL - wallet.WIN;
                row = Object.assign(row,wallet);
                newrows.push(row)
            }
        
        }
    }

    
    res.json(
        {
            status:true, 
            data:newrows,
            pageset : pages
        })    
    return next();
}

exports.sportsBygamesTotal = async (req,res,next)=>{

    let filters = req.body.filters;
    let dates = filters.dates;
    let gameid = filters.gameid;
    let userslist = [];
    var array = [];
    var orquery = [];
    var andquery = [];
    var totalwallet = {
        BET : 0,
        WIN : 0,
        CANCEL : 0
    };
    var totalwin = 0;
    var totalbet = 0;
    var totalggr = 0;
    var gameoptions = [{"label" : "All",value : ""}];
    var realplayerscount = 0


    var start = BASECONTROL.get_stand_date_first(dates.start);
    var end = BASECONTROL.get_stand_date_first(dates.end);
    var role = BASECONTROL.getUserItem(req)
    userslist = await UsersControl.get_players_items(role);
    for (var i in userslist) {
        orquery.push({USERID :mongoose.Types.ObjectId(userslist[i]._id)})
    }

    // if (gameid && gameid.length > 0) {
    //     let gameitem = await BASECONTROL.BfindOne(sportsTypeList,{_id : gameid});
    //     if (gameitem) {
    //         andquery = [ { "DATE": { $gte: start, $lte: end } ,"gameid" : mongoose.Types.ObjectId(gameid) }];
    //     }else{
    //         return res.send({status : false , error : "Please provide date."});
    //     }
    // } else {
        // }
    andquery = [ { "DATE": { $gte: start, $lte: end } }];
    
    if (orquery.length > 0 ) {

        let players = await this.Sportsgetrealplayerscount(start,end,orquery);
        if (players && players.length > 0) {
            realplayerscount = players.length;
        }
        let options = await this.SportsgetGameOptions(start,end,orquery);
        if (options && options.length > 0) {
            gameoptions = [...gameoptions, ...options];
        }

        array =  await sportsBet.aggregate([
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
                        "gameid" : "$gameid",
                        "TYPE" : "$TYPE"
                    }, 
                    "bookCount": { "$sum": "$AMOUNT" }
                }
            },
            
            { 
                "$group": 
                {
                    "_id": "$_id.gameid",
                    "wallets": { 
                        "$push": { 
                            "type": "$_id.TYPE",
                            "count": "$bookCount"
                        },
                    },
                }
            },
            {
                "$lookup": {
                    "from": "sports_lists",
                    "localField": "_id",
                    "foreignField": "_id",
                    "as": "game"
                }
            },
            { "$unwind": "$game" },
        ]);

        
        if (array && array.length > 0) {
           
            for (var i in array) {
                for (var j in array[i].wallets) {
                    totalwallet[array[i]["wallets"][j]["type"]] += parseInt(array[i]["wallets"][j]["count"]);
                }
            }
        
            totalwin =  totalwallet.WIN;
            totalbet =  totalwallet.BET - totalwallet.CANCEL;
            totalggr = totalwallet.BET - totalwallet.CANCEL - totalwallet.WIN;
        }
    }

    res.json(
        {
            status:true, 
            data :  {
                totalwin : totalwin ,totalbet : totalbet,totalggr : totalggr,realplayerscount : realplayerscount,
                gameoptions : gameoptions
            },
        })    
    return next();
}




exports.sattaByplayershistory = async (req,res,next)=>{


    let filters = req.body.filters;
    let params = req.body.params;
    let dates = filters.dates;
    let userid = filters.playerid;
    let userslist = [];
    var array = [];
    var orquery = [];
    var andquery = [];
   
    var pages = {};
    var newrows = [];


    var start = BASECONTROL.get_stand_date_first(dates.start);
    var end = BASECONTROL.get_stand_date_first(dates.end);
    var role = BASECONTROL.getUserItem(req)
    
    if (userid && userid.length > 0) {
        let useritem = await BASECONTROL.BfindOne(UserModel,{_id : userid});
        if (useritem) {
            userslist = [];
            userslist.push(useritem)
        } else {
            return res.send({status : false , error : "Please provide date."});
        }
    } else {
        userslist = await UsersControl.get_players_items(role);
    }

    for (var i in userslist) {
        orquery.push({userid :mongoose.Types.ObjectId(userslist[i]._id)})
    }


    andquery = [ { "DATE": { $gte: start, $lte: end } }];

    
    
    if (orquery.length > 0 ) {

        let countarray =  await matka_betmodels.aggregate([
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
                        "userid" : "$userid",
                    }, 
                }
            },
        ]);


        var totalcount = 0;
        if (countarray && countarray.length > 0) {
            totalcount = countarray.length;
        }
        pages = this.setpage(params,totalcount);

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
                        "userid" : "$userid",
                        "status" : "$status"
                    }, 
                    "bookCount": { "$sum": "$amount" },
                    "winCount": { "$sum": "$winamount" },
                }
            },
            
            { 
                "$group": 
                {
                    "_id": "$_id.userid",
                    "wallets": { 
                        "$push": { 
                            "status": "$_id.status",
                            "count": "$bookCount",
                            "win": "$winCount",
                        },
                    },
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
            { "$limit": pages.limit },
            { "$skip": pages.skip }
        ]);
        
        pages["skip2"] = (pages.skip) + array.length;

        if (array && array.length > 0) {


            newrows = [];

            for (var i in array) {
                let row = {};
                row = Object.assign({},array[i]._doc ? array[i]._doc.user : array[i].user );
                let wallet = {
                    bet : 0,
                    win : 0,
                    rollback : 0,
                    void : 0,
                    GGR : 0
                }
                
                for(var j in array[i].wallets){
                    
                    let item = array[i]["wallets"][j]["status"];
                    let betam = parseInt(array[i]["wallets"][j]["count"]);
                    let winam = parseInt(array[i]["wallets"][j]["win"]);
                    wallet[item] = item == SATACONFIG.StatusKey.win ? winam : betam;

                }

                wallet["WIN"] = wallet.win;
                wallet["void"] = wallet.void;
                wallet["BET"] = wallet.bet;
                wallet["rollback"] = wallet.rollback;
                wallet["GGR"] = wallet.bet - wallet.win - wallet.rollback;

                row = Object.assign(row,wallet);
                newrows.push(row)
            }
        
        }
    }

    
    res.json(
        {
            status:true, 
            data:newrows,
            pageset : pages
        })    
    return next();
}

exports.sattaByplayersTotal = async (req,res,next)=>{

    let filters = req.body.filters;
    let dates = filters.dates;
    let userslist = [];
    var array = [];
    var orquery = [];
    var andquery = [];
    var orquery1 = [];
    
    let wallet = {
        bet : 0,
        win : 0,
        rollback : 0,
        void : 0,
        GGR : 0
    }
   
    var realplayerscount = 0
    var useroptions = [{"label" : "All",value : ""}];

    

    var start = BASECONTROL.get_stand_date_first(dates.start);
    var end = BASECONTROL.get_stand_date_first(dates.end);
    var role = BASECONTROL.getUserItem(req)
    userslist = await UsersControl.get_players_items(role);

    for (var i in userslist) {
        orquery1.push({userid :mongoose.Types.ObjectId(userslist[i]._id)})
    }
 

    andquery = [ { "DATE": { $gte: start , $lte: end } }];


    if (orquery1.length > 0 ) {

        let  players = await this.Sattagetrealplayerscount(start,end,orquery1)
        if (players && players.length > 0) {
            realplayerscount = players.length;
            useroptions = [...useroptions ,...players];

        }

        array =  await matka_betmodels.aggregate([
            {
                $match:    
                { 
                    $and: andquery,
                    $or : orquery1
                },
            },
            {
                $group: 
                {  
                    _id:  "$status", 
                    "bookCount": { "$sum": "$amount" },
                    "winamount": { "$sum": "$winamount" },
                }
            }
        ]);
        
        if (array && array.length) {
            
            for (let i in array) {
                let betam = parseInt(array[i].bookCount);
                let winam = parseInt(array[i]["winamount"]);
                wallet[array[i]._id] +=  array[i]._id == SATACONFIG.StatusKey.win ? winam : betam;
            }
            wallet["GGR"] = wallet.bet - wallet.win - wallet.rollback;
        }
    }

    wallet['realplayerscount'] = realplayerscount
    wallet['useroptions'] = useroptions
    res.json(
        {
            status:true, 
            data : wallet,
        })    
    return next();
}



exports.sattaBymartkethistory = async (req,res,next)=>{

    let filters = req.body.filters;
    let params = req.body.params;
    let dates = filters.dates;
    let bazaarid = filters.bazaarid;
    let userslist = [];
    var array = [];
    var orquery = [];
    var andquery = [];
   
    var pages = {};
    var newrows = [];

    var start = BASECONTROL.get_stand_date_first(dates.start);
    var end = BASECONTROL.get_stand_date_first(dates.end);
    var role = BASECONTROL.getUserItem(req)
    
    userslist = await UsersControl.get_players_items(role);
    
    
    for (var i in userslist) {
        orquery.push({userid :mongoose.Types.ObjectId(userslist[i]._id)})
    }
    

    if (bazaarid && bazaarid.length > 0) {
        let gameitem = await BASECONTROL.BfindOne(BazaarModel,{_id : bazaarid});
        if (gameitem) {
            andquery = [ { "DATE": { $gte: start, $lte: end } ,"bazaarid" : mongoose.Types.ObjectId(bazaarid) }];
        }else{
            return res.send({status : false , error : "Please provide date."});
        }
    } else {
        andquery = [ { "DATE": { $gte: start, $lte: end } }];
    }
    
    // andquery = [ { "DATE": { $gte: start, $lte: end } }];

    
    
    if (orquery.length ) {

        let countarray =  await matka_betmodels.aggregate([
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
                        "bazaarid" : "$bazaarid",
                    }, 
                }
            },
        ]);

        var totalcount = 0;
        if (countarray && countarray.length > 0) {
            totalcount = countarray.length;
        }
        pages = this.setpage(params,totalcount);

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
                        "bazaarid" : "$bazaarid",
                        "status" : "$status"
                    }, 
                    "bookCount": { "$sum": "$amount" },
                    "winCount": { "$sum": "$winamount" },
                }
            },
            
            { 
                "$group": 
                {
                    "_id": "$_id.bazaarid",
                    "wallets": { 
                        "$push": { 
                            "status": "$_id.status",
                            "count": "$bookCount",
                            "win": "$winCount",
                        },
                    },
                }
            },
            {
                "$lookup": {
                    "from": "matka_bazaars",
                    "localField": "_id",
                    "foreignField": "_id",
                    "as": "bazar"
                }
            },
            { "$unwind": "$bazar" },
            { "$limit": pages.limit },
            { "$skip": pages.skip }
        ]);

        if (array && array.length > 0) {


            newrows = [];

            for (var i in array) {
                let row = {};
                row = Object.assign({},array[i]._doc ? array[i]._doc.bazar : array[i].bazar );
                let wallet = {
                    bet : 0,
                    win : 0,
                    rollback : 0,
                    void : 0,
                    GGR : 0
                }
                
                for(var j in array[i].wallets){
                    
                    let item = array[i]["wallets"][j]["status"];
                    let betam = parseInt(array[i]["wallets"][j]["count"]);
                    let winam = parseInt(array[i]["wallets"][j]["win"]);
                    wallet[item] = item == SATACONFIG.StatusKey.win ? winam : betam;

                }

                wallet["WIN"] = wallet.win;
                wallet["void"] = wallet.void;
                wallet["BET"] = wallet.bet;
                wallet["rollback"] = wallet.rollback;
                wallet["GGR"] = wallet.bet - wallet.win - wallet.rollback;

                row = Object.assign(row,wallet);
                newrows.push(row)
            }
        
        }
    }

    pages["skip2"] = (pages.skip) + array.length;
    
    res.json(
        {
            status:true, 
            data:newrows,
            pageset : pages
        })    
    return next();
}

exports.sattaBymartketTotal = async (req,res,next)=>{

    let filters = req.body.filters;
    let dates = filters.dates;
    // let gameid = filters.gameid;
    let userslist = [];
    var array = [];
    var orquery = [];
    var andquery = [];
    let wallet = {
        bet : 0,
        win : 0,
        rollback : 0,
        void : 0,
        GGR : 0
    }

    var gameoptions = [
        {"label" : "All",value : ""},
     
    ];
    var realplayerscount = 0
    var start = BASECONTROL.get_stand_date_first(dates.start);
    var end = BASECONTROL.get_stand_date_first(dates.end);
    var role = BASECONTROL.getUserItem(req)
    userslist = await UsersControl.get_players_items(role);
    for (var i in userslist) {
        orquery.push({userid :mongoose.Types.ObjectId(userslist[i]._id)})
    }

        andquery = [ { "DATE": { $gte: start, $lte: end } }];
    if (orquery.length > 0 ) {

        let players = await this.Sattagetrealplayerscount(start,end,orquery);
        if (players && players.length > 0) {
            realplayerscount = players.length;
        }
        let options = await this.SattagetGameOptions(start,end,orquery);
        gameoptions = [...gameoptions ,...options]

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
                    _id:  "$status", 
                    "bookCount": { "$sum": "$amount" },
                    "winamount": { "$sum": "$winamount" },
                }
            }
        ]);
        
        if (array && array.length) {
            
            for (let i in array) {
                let betam = parseInt(array[i].bookCount);
                let winam = parseInt(array[i]["winamount"]);
                wallet[array[i]._id] +=  array[i]._id == SATACONFIG.StatusKey.win ? winam : betam;
            }
            wallet["GGR"] = wallet.bet - wallet.win - wallet.rollback;
        }
    }

    wallet['realplayerscount'] = realplayerscount
    wallet['gameoptions'] = gameoptions
    res.json(
        {
            status:true, 
            data :   wallet
        })    
    return next();
}



exports.sattaByBazarhistory = async (req,res,next)=>{
    let filters = req.body.filters;
    let params = req.body.params;
    let dates = filters.dates;
    let bazaarid = filters.bazaarid;
    let userslist = [];
    var array = [];
    var orquery = [];
    var andquery = [];
   
    var pages = {};
    var newrows = [];

    var start = BASECONTROL.get_stand_date_first(dates.start);
    var end = BASECONTROL.get_stand_date_first(dates.end);
    var role = BASECONTROL.getUserItem(req)
    
    userslist = await UsersControl.get_players_items(role);
    
    
    for (var i in userslist) {
        orquery.push({userid :mongoose.Types.ObjectId(userslist[i]._id)})
    }
    

    if (bazaarid && bazaarid.length > 0) {
        andquery = [ { "DATE": { $gte: start, $lte: end } ,"type" : { $regex : bazaarid } }];
    } else {
        andquery = [ { "DATE": { $gte: start, $lte: end } }];
    }
    
    // andquery = [ { "DATE": { $gte: start, $lte: end } }];

    
    
    if (orquery.length ) {

        let countarray =  await matka_betmodels.aggregate([
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
                    }, 
                }
            },
        ]);

        var totalcount = 0;
        if (countarray && countarray.length > 0) {
            totalcount = countarray.length;
        }
        pages = this.setpage(params,totalcount);

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
                }
            },
            
            { 
                "$group": 
                {
                    "_id": "$_id.type",
                    "wallets": { 
                        "$push": { 
                            "status": "$_id.status",
                            "count": "$bookCount",
                            "win": "$winCount",
                        },
                    },
                }
            },
           
            { "$limit": pages.limit },
            { "$skip": pages.skip }
        ]);

        if (array && array.length > 0) {


            newrows = [];

            for (var i in array) {
                let row = {};
                let wallet = {
                    bet : 0,
                    win : 0,
                    rollback : 0,
                    void : 0,
                    GGR : 0
                }
                
                for(var j in array[i].wallets){
                    
                    let item = array[i]["wallets"][j]["status"];
                    let betam = parseInt(array[i]["wallets"][j]["count"]);
                    let winam = parseInt(array[i]["wallets"][j]["win"]);
                    wallet[item] = item == SATACONFIG.StatusKey.win ? winam : betam;
                }

                wallet["GGR"] = wallet.bet - wallet.win - wallet.rollback;
                wallet['bazarname'] = SATACONFIG.KeyString[array[i]._id];
                row = Object.assign(row,wallet);
                newrows.push(row)
            }
        
        }
    }

    pages["skip2"] = (pages.skip) + array.length;
    
    res.json(
        {
            status:true, 
            data:newrows,
            pageset : pages
        })    
    return next();

}

exports.sattaByBazarTotal = async (req,res,next)=>{

    var gameoptions = [
        {"label" : "All",value : ""},
        {"label" : SATACONFIG.KeyString[1],value : SATACONFIG.StringKey.regular},
        {"label" : SATACONFIG.KeyString[2],value : SATACONFIG.StringKey['king-bazaar']},
        {"label" : SATACONFIG.KeyString[3],value : SATACONFIG.StringKey.starline},
    ];
    let filters = req.body.filters;
    let dates = filters.dates;
    let userslist = [];
    var array = [];
    var orquery = [];
    var andquery = [];
    let wallet = {
        bet : 0,
        win : 0,
        rollback : 0,
        void : 0,
        GGR : 0
    }

   
    var realplayerscount = 0
    var start = BASECONTROL.get_stand_date_first(dates.start);
    var end = BASECONTROL.get_stand_date_first(dates.end);
    var role = BASECONTROL.getUserItem(req)
    userslist = await UsersControl.get_players_items(role);
    for (var i in userslist) {
        orquery.push({userid :mongoose.Types.ObjectId(userslist[i]._id)})
    }

    andquery = [ { "DATE": { $gte: start, $lte: end } }];
    if (orquery.length > 0 ) {

        let players = await this.Sattagetrealplayerscount(start,end,orquery);
        if (players && players.length > 0) {
            realplayerscount = players.length;
        }

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
                }
            },
            
            { 
                "$group": 
                {
                    "_id": "$_id.type",
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

            for (var i in array) {
                
                for(var j in array[i].wallets){
                    
                    let item = array[i]["wallets"][j]["status"];
                    let betam = parseInt(array[i]["wallets"][j]["count"]);
                    let winam = parseInt(array[i]["wallets"][j]["win"]);
                    wallet[item] += item == SATACONFIG.StatusKey.win ? winam : betam;
                }
            }

            wallet["GGR"] = wallet.bet - wallet.win - wallet.rollback;
        }
    }

    wallet['realplayerscount'] = realplayerscount
    wallet['gameoptions'] = gameoptions
    res.json(
        {
            status:true, 
            data :   wallet
        })    
    return next();
}
