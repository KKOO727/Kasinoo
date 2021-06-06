
const BASECONTROL=require("./basecontroller");
const request  = require("request");
const parse = require('xml-parser');
const axios = require("axios")
// const PROVIDERTYPECONFIG = require("../config/typemange.json");
const BASECONFIG = require("../servers/provider.json");
const config_dr = require('../db');
const fs = require("fs");
var mongoose = require('mongoose');

// var WebSocketClient = require('websocket').client;
const GAMELISTMODEL = require("../models/games_model").GAMELISTMODEL;
const PROVIDERMODELS = require("../models/games_model").PROVIDERMODELS;
const FIRSTPAGE_GEMLIST_Model = require("../models/games_model").FIRSTPAGE_GAMELIST_MODEL;
const TopGamelistmodel = require("../models/games_model").TopGamelistmodel;
const Reportscontrol = require("./reportcontroller")
const WebSocket = require('ws');
var wsUri = "wss://engine.livetables.io:443/GameServer/gameNotifications";
const {toolgetoipblock_model} =  require("../models/tools_model")


exports.Livecasinoprovidertotal = async (req,res,next) =>{

    var bool = req.body.bool;
    if (bool ) {
        let condition = {};
        condition["bool."+bool] = true;
        condition['status'] = true;
        let provideroptions = [{label : "All",value : ""}];
        let typeoptions = [{label : "All",value : ""}];
        let idoptions = [{label : "All",value : ""}]
        let andquery = [condition];
        let pitems = await PROVIDERMODELS.aggregate([
            {
                $match:    
                { 
                    $and: andquery
                }
            },
            {
                $sort : {
                    order : 1
                }
            },
            {
                "$project":{
                    label:'$text',
                    value: "$_id", 
               }
            },
        ]);

        

        provideroptions = [...provideroptions,...pitems];
        let tconfig = req.tconfig["keylaunchurl_type"][bool];
        for (var i in tconfig) {
            typeoptions.push({label : tconfig[i],value : tconfig[i]})
        }

        res.send(
            {
                status : true,
                data : {
                    provideroptions,typeoptions,
                    idoptions : idoptions
                }
            }
        )
        return next();
    } else {
        res.json({
            status : false,data : "fail"
        })
        return next();
    }

}

exports.LivecasinoproviderLoad =async (req,res,next)=>{
    


    var bool = req.body.bool;
    let params = req.body.params;
    let filters = req.body.filters;
    if (bool && params) {
        let condition = {};
        condition["bool."+bool] = true;
        condition['status'] = true;
        let andquery = [condition];
        let gamelist = [];
        let pages = {};
        let providerid = filters.providerid;
        let typeid = filters.typeid;
        let NAME = filters.NAME;
        let ID = (filters.ID).toString();

        if (providerid && providerid.length > 0) {
            let dd = await PROVIDERMODELS.findOne({_id : providerid});
            if (!dd) {
                res.send({status : false});
                return next();
            } 


            let totalcount = await GAMELISTMODEL.countDocuments(
                {isdelete : false,providerid : mongoose.Types.ObjectId(providerid),"TYPE" : { $regex : typeid},"NAME" : { $regex : NAME},"ID" : { $regex : ID}}
            );
                
            pages = Reportscontrol.setpage(params,totalcount);
    
            if (totalcount > 0) {
    
                gamelist = await GAMELISTMODEL.aggregate([
                    {
                        $match : {
                            $and : [{isdelete : false,providerid : mongoose.Types.ObjectId(providerid),"TYPE" : { $regex : typeid},"NAME" : { $regex : NAME},"ID" : { $regex : ID}}]
                        }
                    },
                    {
                        $sort : {
                            order : 1,
                        }
                    },
                                  
                    { "$limit": pages.limit },
                    { "$skip": pages.skip }
                ])
            }
    
            pages["skip2"] = (pages.skip) + gamelist.length;

        } else {
            let pitems = await PROVIDERMODELS.aggregate([
                {
                    $match:    
                    { 
                        $and: andquery
                    }
                },
                {
                    $sort : {
                        order : 1
                    }
                },
            ]);
            let orquery = [];
            for (var i in pitems) {
                orquery.push({providerid : mongoose.Types.ObjectId(pitems[i]._id)})
            }

            if (orquery.length > 0) {
                let totalcount = await GAMELISTMODEL.countDocuments(
                    {isdelete : false,"TYPE" : { $regex : typeid},"NAME" : { $regex : NAME},"ID" : { $regex : ID}, $or : orquery}
                );

                pages = Reportscontrol.setpage(params,totalcount);
    
                if (totalcount > 0) {
        
                    gamelist = await GAMELISTMODEL.aggregate([
                        {
                            $match : {
                                $and : [{isdelete : false,"TYPE" : { $regex : typeid},"NAME" : { $regex : NAME},"ID" : { $regex : ID}}],
                                $or : orquery
                            }
                        },
                        {
                            $sort : {
                                order : 1,
                            }
                        },
                                      
                        { "$limit": pages.limit },
                        { "$skip": pages.skip }
                    ])
                }
        
                pages["skip2"] = (pages.skip) + gamelist.length;
            }
        }


        let senddata = {
            list : gamelist,
            pageset : pages,
            providerid : providerid
        }

        res.send(
            {
                status : true,
                data : senddata
            }
        )
        return next();
    } else {
        res.json({
            status : false,data : "fail"
        })
        return next();
    }

}

exports.LivecasinoproviderChange = async(req,res,next)=>{
    var pro = req.body.data;
    var gamelist = await BASECONTROL.BSortfind(GAMELISTMODEL,{isdelete : false,PROVIDERID : pro},{order  :1});
    if(gamelist){
        res.json({status : true,data : gamelist});
        return next();
    }else{
        res.json({status : false});
        return next();
    }
}

exports.LivecasinoProviderCheck =async (req,res,next)=>{

    var handle = req.body.handle;
    var filters = req.body.filters;
    if (filters) {
        if (filters.providerid && filters.providerid.length > 0) {
            var updatehandle  =await GAMELISTMODEL.updateMany({providerid : mongoose.Types.ObjectId(filters.providerid) },{status : handle});
            if(updatehandle){
                this.LivecasinoproviderLoad(req,res,next);
            }else{
                res.json({status : false});
                return next();
            }
        } else {
            res.json({status : false});
            return next();            
        }
    } else {
        res.json({status : false});
        return next();
    }

}

exports.Livecasinostatuspagecheck = async (req,res,next)=>{
    var row = req.body.row;
    var handle = req.body.handle;
    var updatehandle = await GAMELISTMODEL.findOneAndUpdate({_id : row._id},{status : handle});
    if(updatehandle){
        this.LivecasinoproviderLoad(req,res,next)
    }else{
        res.json({status : false});
        return next();
    }
}

exports.topgamesload = async (req,res,next) => {

    let params = req.body.params;
    let filters = req.body.filters;
    if (params && filters) {
        let pages = {};
        let array = [];
        let typeid = filters.typeid;
        let totalcount = await TopGamelistmodel.aggregate([
            {
                "$lookup": {
                    "from": "game_game_lists",
                    "localField": "gameid",
                    "foreignField": "_id",
                    "as": "game"
                }
            },
            { "$unwind": "$game" },
            {
                $match : {
                    $and : [ {"game.TYPE" : { $regex:typeid} }]
                }
            },
        ])

        pages = Reportscontrol.setpage(params,totalcount.length);
        if (totalcount.length) {

            // array = await TopGamelistmodel.find().skip(pages.skip).limit(pages.limit).populate("gameid");
            array = await TopGamelistmodel.aggregate([
                {
                    $sort: {
                        order : 1
                    }
                },
                {
                    $skip: pages.skip
                },
                {
                    $limit: pages.limit
                },
                {
                    "$lookup": {
                        "from": "game_game_lists",
                        "localField": "gameid",
                        "foreignField": "_id",
                        "as": "game"
                    }
                },
                { "$unwind": "$game" },
                {
                    $match : {
                        $and : [ {"game.TYPE" : { $regex:typeid} }]
                    }
                },
                {
                    $project : {
                        '_id' : "$game._id",
                        'TYPE' : "$game.TYPE",
                        'ID' : "$game.ID",
                        'NAME' : "$game.NAME",
                        'PROVIDERID' : "$game.PROVIDERID",
                        'image' : "$game.image",
                        'LAUNCHURL' : "$game.LAUNCHURL",
                        'WITHOUT' : "$game.WITHOUT",
                        'providerid' : "$game.providerid",
                    }
                },

            ]);

        }
        pages["skip2"] = (pages.skip) + array.length;

        let tconfig = req.tconfig["keylaunchurl_type"];
        let ts = tconfig['2'];
        let typeoptions = [{label : "All", value : ''}];
        for (var i in ts) {
            typeoptions.push({label : ts[i], value : ts[i]});
        }
        res.send({
            status : true ,data:array, 
            typeoptions : typeoptions,  
            pageset : pages,
        });
        return next();

    } else {

    }
}

exports.topgamesupdate = async (req,res,next) => {
    let row = req.body.row;
    for (var i in row) {
        await TopGamelistmodel.findOneAndUpdate({_id : row[i]._id},row[i]);
    }
    this.topgamesload(req,res,next);
}

exports.topgamesdelete = async (req,res,next) => {
    let row = req.body.row;
     await TopGamelistmodel.findOneAndDelete({gameid : row._id});
    this.topgamesload(req,res,next);

}

exports.topgamescheck = async (req,res,next)=>{
    var row = req.body.row;
    var bool = req.body.bool;
    var handle = req.body.handle;

    if (row && bool) {
        
        var data = await BASECONTROL.BfindOne(TopGamelistmodel,{gameid:mongoose.Types.ObjectId(row._id)});
        if (!data) {
            if(handle){
                var item = {};
                var alllist = await BASECONTROL.BSortfind(TopGamelistmodel,{},{order : -1});
                if(alllist.length > 0){
                    item['order'] = alllist[0].order + 1;
                }else{
                    item['order'] = 0;
                }
                item['type'] = "";
                item['gameid'] = mongoose.Types.ObjectId(row._id);
                var shandle = await BASECONTROL.data_save(item,TopGamelistmodel);
                if (shandle) {
                    res.json({status : true, data : "success"});
                return next();
                } else {
                    res.json({status : false, data : "server error"});
                    return next();
                }
            } else {
                res.json({status : true, data : "success"});
                return next();
            }
        } else {
            res.json({status : false,data : "It have already added"});
            return next();
        }
    } else {
        res.json({status : false, data : "server error"});
        return next();
    }
}

exports.LivecasinoFirstPageCheck = async (req,res,next)=>{

    var row = req.body.row;
    var bool = req.body.bool;
    var handle = req.body.handle;

    if (row && bool) {
        
        var data = await BASECONTROL.BfindOne(FIRSTPAGE_GEMLIST_Model,{gameid:mongoose.Types.ObjectId(row._id)});
        if (!data) {
            if(handle){
                var item = {};
                var alllist = await BASECONTROL.BSortfind(FIRSTPAGE_GEMLIST_Model,{type : bool},{order : -1});
                if(alllist.length > 0){
                    item['order'] = alllist[0].order + 1;
                }else{
                    item['order'] = 0;
                }
                item['type'] = bool;
                item['gameid'] = mongoose.Types.ObjectId(row._id);
                var shandle = await BASECONTROL.data_save(item,FIRSTPAGE_GEMLIST_Model);
                if (shandle) {
                    res.json({status : true, data : "success"});
                    return next();
                } else {
                    res.json({status : false, data : "server error"});
                    return next();
                }
            } else {
                res.json({status : true, data : "success"});
                return next();
            }
        } else {
            res.json({status : false,data : "It have already added"});
            return next();
        }
    } else {
        res.json({status : false, data : "server error"});
        return next();
    }
    
}

exports.get_firstpage_gamelist = async (req,res,next) =>{
    var type = req.body.type;
    var rows = await BASECONTROL.BSortfindPopulate(FIRSTPAGE_GEMLIST_Model,{type : type},{order : 1},"gameid");
    if(rows){
        res.json({status : true,data : rows});
        return next();
    }else{
        res.json({status : false});
        return next();
    }
}

exports.update_firstpage_gamelist = async (req,res,next) =>{
    var data = req.body.data;
    for(var i = 0 ; i < data.length ; i++){
        var uhandle = await BASECONTROL.BfindOneAndUpdate(FIRSTPAGE_GEMLIST_Model,{_id : data[i]._id},{order : data[i].order});
    }
    this.get_firstpage_gamelist(req,res,next);
}

exports.delete_firstpage_gamelist = async (req,res,next) =>{
    var data=req.body.data;
    if (data) {
        var udata = await BASECONTROL.BfindOneAndDelete(FIRSTPAGE_GEMLIST_Model,{_id :data._id});
        if (udata) {
            this.get_firstpage_gamelist(req,res,next);
        } else {
            res.json({status : false,data : "fail"});
            return next();
        }

    } else {
        res.json({status : false,data : "fail"});
        return next();
    }

}

exports.Livecasinoitemsadd = async (req,res,next)=>{

    let row = req.body.row;
    let ID = row.ID;
    let providerid = row.providerid;

    var fhandle = await BASECONTROL.BfindOne(GAMELISTMODEL,{providerid : mongoose.Types.ObjectId(providerid),ID : ID});
    if (fhandle) {
        res.json({status : false,data : "fail"});
        return next();
    } else {
        var pdata = await BASECONTROL.BfindOne(PROVIDERMODELS,{_id : providerid});
        if (pdata) {
            let order = 0 ;
            let topitem = await GAMELISTMODEL.find({isdelete : false,providerid : mongoose.Types.ObjectId(providerid)}).sort({order : -1}).skip(0).limit(1);
            if (topitem && topitem.length > 0) {
                order = topitem[0].order + 1;
            } 
            let newrow = {
                ID : ID,
                providerid : mongoose.Types.ObjectId(providerid),
                NAME : row.NAME,
                PROVIDERID : pdata.provider,
                TYPE : row.TYPE,
                LAUNCHURL : pdata.LAUNCHURL,
                order : order
            }
            var shandle = await BASECONTROL.data_save(newrow,GAMELISTMODEL);
            if(!shandle){
                res.json({status : false,data : "fail"});
                return next();
            }else{
                this.LivecasinoproviderLoad(req,res,next)
            }
        } else {
            res.json({status : false,data : "fail"});
            return next();
        }
    }
}

exports.Livecasinoitemsdelete = async (req,res,next) =>{
    let row = req.body.row;
    let ID = row.ID;
    let providerid = row.providerid;

    var fhandle = await BASECONTROL.BfindOneAndUpdate(GAMELISTMODEL,{providerid : mongoose.Types.ObjectId(providerid),ID : ID},{isdelete : true});
    if (fhandle) {
        this.LivecasinoproviderLoad(req,res,next)
    } else {
        res.json({status : false,data : "fail"});
        return next();
    }
}


exports.Livecasinoitemsupdate = async (req,res,next)=>{

    let row = req.body.row;
    let ID = row.ID;
    let providerid = row.providerid;

    var fhandle = await BASECONTROL.BfindOne(GAMELISTMODEL,{providerid : mongoose.Types.ObjectId(providerid)});
    if (fhandle) {
        // delete row._id;
        let up = await GAMELISTMODEL.findOneAndUpdate({_id : row._id},row);
        if (up) {
            this.LivecasinoproviderLoad(req,res,next)
        } else {
            res.json({status : false,data : "fail"});
            return next();
        }
    } else {
        var pdata = await BASECONTROL.BfindOne(PROVIDERMODELS,{_id : providerid});
        if (pdata) {
            let order = 0 ;
            let topitem = await GAMELISTMODEL.find({providerid : mongoose.Types.ObjectId(providerid),isdelete : false}).sort({order : -1}).skip(0).limit(1);
            if (topitem && topitem.length > 0) {
                order = topitem[0].order + 1;
            } 
            let newrow = {
                ID : ID,
                providerid : mongoose.Types.ObjectId(providerid),
                NAME : row.NAME,
                PROVIDERID : pdata.provider,
                TYPE : row.TYPE,
                LAUNCHURL : pdata.LAUNCHURL,
                order : order
            }
            var shandle = await BASECONTROL.data_save(newrow,GAMELISTMODEL);
            if(!shandle){
                res.json({status : false,data : "fail"});
                return next();
            }else{
                this.LivecasinoproviderLoad(req,res,next)
            }
        } else {
            res.json({status : false,data : "fail"});
            return next();
        }
    }
}



exports.Livecasinoitemsimg_upload = async (req,res,next) =>{


    let _id = req.body._id;
    let imagesrc = req.body.imagesrc;
    if (imagesrc) {
        let gameitem = await BASECONTROL.BfindOne(GAMELISTMODEL,{_id : _id});
        if (gameitem) {
            if (gameitem.image && gameitem.image.length > 0) {
                var del_path = config_dr.BASEURL  + gameitem.image;
                fs.unlink(del_path, (err)=>{
                })
            }
            let update = await BASECONTROL.BfindOneAndUpdate(GAMELISTMODEL , {_id : _id},{image : imagesrc});
            if (update) {
                res.json({ status: true });
                return next();                   
            } else {
                res.json({ status: false });
                return next();                                    
            }
        } else {
            res.json({ status: false });
            return next();                    
        }
    } else {
        res.json({ status: false });
        return next();        
    }
    // var filename = req.files[0].filename;
    // var filetype = req.files[0].mimetype.split("/")[1];
    // var now_path = config_dr.BASEURL + filename;
    // var new_path = config_dr.BASEURL + filename + "." + filetype;
    
    // fileupload(now_path,new_path,filename,filetype,req.body._id,async function(rdata){
    //   if(!rdata){
    //     res.json({
    //       status: false
    //     });
    //     return next();
    //   }else{
    //     var gamelist = await BASECONTROL.BSortfind(GAMELISTMODEL,{PROVIDERID :  req.body.PROVIDERID},{order :1});
    //     if(gamelist){
    //         res.json({status : true,data : gamelist});
    //         return next();
    //     }else{
    //         res.json({status : false});
    //         return next();
    //     }
    //   }
    // })
}

// function fileupload(now_path,new_path,filename,filetype,id,callback){
// fs.rename(now_path , new_path, function(err){
//   if(err) {
//     callback(false);
//   }else{
//     var res = null;
//     var Model = GAMELISTMODEL;
//     Model.findOne({_id: id}).then((result) => {
//       if(!result)
//       {
//         callback(false);
//       }else{
//         res = result;
//         if(res.image != ""){
//           var del_path = config_dr.BASEURL  + res.image;
//           fs.unlink(del_path, (err)=>{
//               Model.findOneAndUpdate({_id: id}, {image: filename + "." + filetype}).then(data => {
//                 if(!data) {
//                   callback(false);
//                 }else {
//                   callback(true);
//                 }
//               })            
//           })
//         }else{
//           Model.findOneAndUpdate({_id: id}, {image: filename + "." + filetype}).then(data => {
//             if (!data) {
//               callback(false)              
//             }else {
//               callback(true);
//             }
//           })
//         }            
//       } 
//     })      
//   }
// });
// }

exports.gameinforchange = async (req,res,next)=>{
    var row = req.body.row;
    for(var i =  0 ; i < row.length ; i++){
        var updatehandle = await GAMELISTMODEL.findOneAndUpdate({_id : row[i]._id},row[i]);
        if (updatehandle) {
        } else {
            res.json({status : false});
            return next();            
        }
    }

    this.LivecasinoproviderLoad(req,res,next);

}


var typesArray = {
        1 : "Blackjack",
        2 : "Baccarat",
        3 : "Roulette",
        4 : "Bet on Numbers",
        5 : "Hybrid Blackjack",
        6 : "Keno",
        7 : "Automatic Roulette",
        8 : "Wheel of Dice",
        9 : "Sede",
        10 : "American Blackjack",
        11 : "American Hybrid Blackjack",
        12 : "Unlimited Blackjack",
        13 : "Lucky 7",
        14 : "Sic BO",
        15 : "Casino Holdem",
        16 : 'Bet on Teen Patti and 20/20 Teen Patti',
        17 : "Three Card Poker and Teen Patti",
        20 : "Baccarat KO",
        21 : "Baccarat Super 6",
        24 : "Dragon Tiger",
        25 : "No Commision Baccarat",
        26 : "Baccarat Dragon Bonus",
        27 : "BaccaratQueenco",
        28 : "BaccaratPuntoBanco",
        29 : "RoulettePortomaso",
        31 : "American Roulette",
        32 : "Triple Roulette",
        38 : "Andar Bahar"
}   

function init()
{
  testWebSocket();
}

function testWebSocket()
{
  websocket = new WebSocket(wsUri);
  websocket.onopen = function(evt) { onOpen(evt) };
  websocket.onclose = function(evt) { onClose(evt) };
  websocket.onmessage = function(evt) { onMessage(evt) };
  websocket.onerror = function(evt) { onError(evt) };
}

function onOpen(evt)
{
    let param1 = {
        "MessageType": "InitializeSession",
        "OperatorID": BASECONFIG.ezugi.operatorId,
        "vipLevel": 0,
        "SessionCurrency": "INR"
    };
    param1 = JSON.stringify(param1);
    doSend(param1);
}

function onClose(evt)
{

}

async function onMessage(evt)
{
    var indata =JSON.parse(evt.data);
    var MessageType = indata.MessageType;
    switch(MessageType){
        case "InitializeSession":

            break;
        case "AuthenticateSession":
            
            break;
        case "SessionInitialized": 

        break;
        case "DealerChanged" :
            var TableId = indata.TableId;
            var DealerName = indata.NAME;
            var fdata = await BASECONTROL.BfindOne(GAMELISTMODEL,{LAUNCHURL :"3" ,ID : TableId});
            var uhandle = await BASECONTROL.BfindOneAndUpdate(GAMELISTMODEL,{LAUNCHURL : "3",ID  :TableId},{NAME : DealerName});
            
        break;

        case "ActiveTablesList" : 
            var TablesList = indata.TablesList;
            await  euzgi_update(TablesList)

        break;
        case "TableCancelled":
        break;
    }
//   websocket.close();
}

async function euzgi_update(TablesList){
    var provider = "EZUGI";
    var rows= [];
    for(var i = 0 ; i < TablesList.length ; i++)
    {
        var limits = [];
        for (var j in TablesList[i].LimitsList){
            let jj = TablesList[i].LimitsList[j];
            limits.push({limitMax : jj.Max_Bet,limitMin : jj.Min_Bet });
        }

        var row = {};
        row['TYPE'] =typesArray[TablesList[i].GameType];
        row['ID'] =TablesList[i].TableId;
        row['LAUNCHURL'] = '3';
        row['image']  ="https://recording.ezugicdn.com/Dealer-Images/Single/"+TablesList[i].TableId + ".jpg"
        row['PROVIDERID'] = provider;
        row['NAME'] =TablesList[i].DealerName;
        if(!TablesList[i].IsActive){
            continue;
        }
        row['status'] = true;
        row['WITHOUT'] = {
            MetaTableID:TablesList[i].MetaTableID,
            DealerId:TablesList[i].DealerId,
            limits : limits,
            PlayersNumber: TablesList[i].PlayersNumber,
            PictureLink : TablesList[i].PictureLink,
        };
        rows.push(row)
    }

    // await GAMELISTMODEL.updateMany({PROVIDERID :provider},{status : false}).then(rdata1 =>{

    // });
    
    // var rdata = rows;
    // for(var i = 0 ; i < rdata.length ; i++){        
    //     var findhandle = await BASECONTROL.BfindOne(GAMELISTMODEL,{ID : rdata[i].ID,PROVIDERID : rdata[i].PROVIDERID});
    //     if(!findhandle){
    //         var findlength = await BASECONTROL.BSortfind(GAMELISTMODEL,{PROVIDERID : provider},{order : 1});
    //         rdata[i]['order'] = findlength[findlength.length - 1].order + 1;
    //         var savehandle = await BASECONTROL.data_save(rdata[i],GAMELISTMODEL);
    //     }else{
    //         var updatehandle = await BASECONTROL.BfindOneAndUpdate(GAMELISTMODEL,{ID :rdata[i].ID,PROVIDERID : rdata[i].PROVIDERID },rdata[i]);
    //     }
    // }
    // return true;

}

function onError(evt)
{

}

function doSend(message)
{
  websocket.send(message);
}
//-------------------------"BETSOFT"
async function betsoftrefreshgames(provider,callback){
    var options = {
        'method': 'POST',
        'url': BASECONFIG.betsoft.gamelist+'bankId='+BASECONFIG.betsoft.bankId,
        'headers': {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Cookie': 'JSESSIONID=node01aro5bukviqrb1f7z0mdvy67mj5461130.node0'
        },
        form: {
          'bankId': BASECONFIG.betsoft.bankId,
          'version': '2'
        }
    };
    request(options,async function (error, response) {
        if (error){
            callback(false)        
        }else{
            var xml = parse(response.body);
            var row = gamelist(xml.root.children[0].children,provider);
            callback(row);
        }
    });

    function gamelist(inputdata,provider){
        var rows = [];
        for(var i = 0 ; i < inputdata.length;i++){
              var data = inputdata[i].children[0].children;
            for(var j = 0 ; j < data.length; j++ ){
                var row = {};
                row={
                    TYPE : inputdata[i].attributes.NAME,
                    ID : data[j].attributes.ID,
                    NAME : data[j].attributes.NAME,
                    PROVIDERID : provider,
                    LAUNCHURL : "1"
                }
                rows.push(row);
            }
      
        }
        return rows;
      }
      
}

exports.allrefreshGames= (req,res,next)=>{
    res.json({
        status : true,data : "success"
    })
    betsoftrefreshgames("BETSOFT",async(rdata)=>{
        for(var i = 0 ; i < rdata.length ; i++){
            
            var findhandle = await BASECONTROL.BfindOne(GAMELISTMODEL,{ID : rdata[i].ID,PROVIDERID : rdata[i].PROVIDERID});
            if(!findhandle){
                var savehandle = await BASECONTROL.data_save(rdata[i],GAMELISTMODEL);
            }else{
                var updatehandle = await BASECONTROL.BfindOneAndUpdate(GAMELISTMODEL,{ID :rdata[i].ID,PROVIDERID : rdata[i].PROVIDERID },rdata[i]);
            }
        }
    
    })
    
    
    wac_refreshgames((rdata)=>{
        // res.json({
        //     status : true,data : "success"
        // })
    }); 
    
    xpgrefreshgames("XPG",async(rdata)=>{
            for(var i = 0 ; i < rdata.length ; i++){
            
                var findhandle = await BASECONTROL.BfindOne(GAMELISTMODEL,{ID : rdata[i].ID,PROVIDERID : rdata[i].PROVIDERID});
                if(!findhandle){
                    var savehandle = await BASECONTROL.data_save(rdata[i],GAMELISTMODEL);
                }else{
                    var updatehandle = await BASECONTROL.BfindOneAndUpdate(GAMELISTMODEL,{ID :rdata[i].ID,PROVIDERID : rdata[i].PROVIDERID },rdata[i]);
                }
            }
    
    })
    
}

exports.vivoupdate = (req,res,next) =>{
    
    vivo_refreshgames("VIVO",async(rdata)=>{
        for(var i = 0 ; i < rdata.length ; i++){
            // var findhandle = await BASECONTROL.BfindOne(GAMELISTMODEL,{ID : rdata[i].ID,PROVIDERID : rdata[i].PROVIDERID});
            // if(!findhandle){
            //     var findlength = await BASECONTROL.Bfind(GAMELISTMODEL,{PROVIDERID : rdata[i].PROVIDERID});
            //         rdata[i]['order'] = findlength.length + 1;
            //     var savehandle = await BASECONTROL.data_save(rdata[i],GAMELISTMODEL);
            // }else{
            //     var updatehandle = await BASECONTROL.BfindOneAndUpdate(GAMELISTMODEL,{ID :rdata[i].ID,PROVIDERID : rdata[i].PROVIDERID },rdata[i]);
            // }
        }
        res.json({status : true,data : rdata});
        return next();
    });
    
}

//------------------XPG
async function xpgrefreshgames(provider,callback){

    var types = {
        24 : "AndarBahar",
        2 : "Blackjack",
        4 : "Baccarat",
        8 : "Live Texas Hold’em Bonus",
        12 : "DragonTiger",
        16 : "SicBo",
        22 : "Wheel Of Fortune",
        1 : "Roulette"
    }        
    var accessPassword = "";
    var serverurl = BASECONFIG.xpg.serverurl + "getGamesListWithLimits";
    var parameter = "";
    var privatekey = BASECONFIG.xpg.passkey;
    var operatorId = BASECONFIG.xpg.operatorid;
    var headers = {'Content-Type': 'application/x-www-form-urlencoded'};// method: 'POST', 'cache-control': 'no-cache', 
    var ap_para  = '';
    ap_para = { operatorId : operatorId,username : "WangMin",gameType : "0",onlineOnly :"1"}
    accessPassword = BASECONTROL.get_accessPassword(privatekey,ap_para);
    parameter = { accessPassword : accessPassword,operatorId : operatorId,username : "WangMin",gameType : "0", onlineOnly : "1"}
    request.post(serverurl,{ form : parameter, headers: headers, },async (err, httpResponse, body)=>{
        if (err) {
            callback(false);
        }else{
            if(body){
                var xml =parse(body);
                var outdata = get_gamelist(xml.root.children[0].children,provider);
                   callback(outdata)
            }else{
                callback(false);                    
            }
        }
    });
    function get_gamelist(gamelist,provider){
        var newgame = [];
        for(var i = 0 ; i < gamelist.length ; i++){
            var gamenode = gamelist[i]['children'];
            var newlist = {};
            for(var j = 0 ; j < 11 ; j++){
                if(j == 0){
                    newlist['limitId'] = get_limitid(gamenode[j].children);
                }else{
                    newlist[gamenode[j]['name']] = gamenode[j].content;
                }
            }
            newlist['TYPE'] = types[newlist['gameType']];
            newlist['ID'] = newlist['gameID'];
            newlist['NAME'] = newlist['gameName'];
            newlist['PROVIDERID'] = provider;
            newlist['LAUNCHURL'] = '2';
            newlist['WITHOUT'] = {
                limitId : newlist['limitId']
            }
            newgame.push(newlist);
        }
        return newgame;
    }
    function get_limitid(outdata){
        var indata = outdata[0].children[0].content;
        return indata;
    }
    
}
//---------------------VIVO
async function vivo_refreshgames(provider,callback){

    var rows =  await get_vivogames(provider);
    callback(rows)
    async function get_vivogames(provider){
        var rows = []; 
        var gametypes = {
            1 : "Roulette",
            2 : "Baccarat",
            3 : "Blackjack",
            4 : "Poker"
        }
        for(var i in gametypes){
            var data =  await get_axois(gametypes[i],provider);
            for(var j = 0 ; j < data.length ; j++){
                rows.push(data[j]);
            }
        }
        return rows;
    }
    
    async function get_axois(gameName,PROVIDERID){
        var rows = [];
        await axios.get(BASECONFIG.vivo.gamelist+"mobile=true&operatorId="+BASECONFIG.vivo.operatorid+"&gameName="+gameName+"&playerCurrency=INR").then(rdata=>{
            var tbldata = rdata.data.gameData.tables;
            for(var i in tbldata){

                var row = tbldata[i];
                let limits = [];
                for(let j in tbldata[i].limits){
                    let jj = tbldata[i].limits[j];
                    limits.push({limitId : jj.limitid,limitMin :jj.limitMin ,limitMax : jj.limitMax });
                }
                var newrow = {}
                newrow['TYPE'] = gameName;
                newrow['NAME'] = row.dealerName;
                newrow['ID'] = row.tableId;
                newrow['LAUNCHURL'] = '4';
                newrow['PROVIDERID'] = PROVIDERID;
                newrow['WITHOUT'] = {
                    limits : limits
                }
                rows.push(newrow);
            }
        // }
        });
        return rows;
    }
}
//--------------------WAC
async function wac_refreshgames(callback){

    var options = {
        'method': 'GET',
        'url': 'https://pi.njoybingo.com/v1/publisher/games/splendorcasino',
        'headers': {}
      };
      request(options,async function (error, response) {
        if(error){
            res.json({status : false})
            return next()
        }else{
            var data = JSON.parse(response.body);
            var providers = data.providers;
            var providerslist=[];
            var allgamelist = [];
            for(var i = 0 ; i < providers.length ; i++){
                var games = providers[i].games;
                var providername = providers[i].name;
                var type={}
                for(var j = 0 ; j < games.length; j++){
                    var row = {};
                    row['NAME'] = games[j].description;
                    row['ID'] = games[j].name;
                    row['LAUNCHURL'] = '5';
                    row['TYPE'] = games[j].category;
                    row['PROVIDERID'] = games[j].provider;
                    row['image'] = games[j].image != null ? games[j].image.url : "";
                    row['WITHOUT'] = games[j].url;
                    type[games[j].category] = games[j].category;
                    allgamelist.push(row);
                }
                var types = [];
                for(var k in type){
                    types.push(type[k]);
                  }
                providerslist.push({provider : providername,type : types});
            }

            // for(var i = 0 ; i < allgamelist.length ; i ++){
            //     var findhandle = await BASECONTROL.BfindOne(GAMELISTMODEL,{ID : allgamelist[i].ID});
            //     if(!findhandle){
            //         var savehandle = await BASECONTROL.data_save(allgamelist[i],GAMELISTMODEL);
            //     }else{
            //         var updatehandle = await BASECONTROL.BfindOneAndUpdate(GAMELISTMODEL,{ID :allgamelist[i].ID },allgamelist[i]);
            //     }
            // }

            
            // for(var i = 0 ; i  < providerslist.length ; i++){
            //     // providerslist[i]['order'] = i;
            //     var findhandle = await BASECONTROL.BfindOne(PROVIDERMODELS,{provider : providerslist[i].provider});
            //     if(!findhandle){
            //         var savehandle = await BASECONTROL.data_save(providerslist[i],PROVIDERMODELS);
            //     }else{
            //         var updatehandle = await BASECONTROL.BfindOneAndUpdate(PROVIDERMODELS,{provider :providerslist[i].provider });
            //     }
            // }
            // callback(true)

            // await providers_model.insertMany(providerslist);
            // res.json({ status : true, data : allgamelist, list : providerslist });
        }    
    });
}

exports.newtokeninit = (req,res,next)=>{
    init()
    res.json({status : true})
}

exports.createnewtoken = (req,res,next)=>{
    let param = req.body;
    var row = {
        "MessageType": "AuthenticateSession",
        "OperatorID": BASECONFIG.ezugi.operatorId,
        "vipLevel": 0,
        "SessionCurrency": "INR",
        "Token": param.Token
    };
    var  newparam = JSON.stringify(row);
    doSend(newparam)    
}

// Goldenrace();

function Goldenrace(){
    var options = {
        'method': 'POST',
        'url': 'https://igamez-api.staging-hub.xpressgaming.net/api/v3/get-game-list',
        'headers': {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        form: {
            'siteId': '5878',
            'publicKey': 'iFCQGOKoNFgPvoJ'
        }
    };
    request(options,async function (error, response) {
        if (error) throw new Error(error);
        var data = JSON.parse(response.body).data;
        var types = {};
        var provider = {};
        var rows = [];
        var index = 100;
        for(var i = 0 ; i < data.length ; i++){
            
            types[data[i].type] = data[i].type;
            provider[data[i].provider] = data[i].provider;
            if (data[i].gameId == "10105"){
            }
            // if (data[i].provider != "HollywoodTV"){
            //     continue;
            // }
            var row={};
            row['TYPE'] = data[i].type;
            row['ID'] = data[i].gameId;
            row['NAME'] = data[i].gameFriendlyName;
            row['PROVIDERID'] = data[i].provider;
            row["LAUNCHURL"] = "6";
            row["order"] = index;
            index ++;

            if(!data[i].thumbnail){
    
            }else{
                row['image'] = data[i].thumbnail;
            }
            // var savehandle = await BASECONTROL.data_save(row,GAMELISTMODEL);
            rows.push(row);
        }
        // for(var i = 0 ;i < rows.length ; i++){
        //     var findhandle = await BASECONTROL.BfindOne(GAMELISTMODEL,{ID : rows[i].ID,PROVIDERID : rows[i].PROVIDERID});
        //     if(!findhandle){
                //         var findlength = await BASECONTROL.Bfind(GAMELISTMODEL,{PROVIDERID : rows[i].PROVIDERID});
        //             rows[i]['order'] = findlength.length + 1;
        //         var savehandle = await BASECONTROL.data_save(rows[i],GAMELISTMODEL);
            // }else{
        //         var updatehandle = await BASECONTROL.BfindOneAndUpdate(GAMELISTMODEL,{ID :rows[i].ID,PROVIDERID : rows[i].PROVIDERID },rows[i]);
            // }
        // }


    });

}
function myslotty(){

    var providers = {};
    var options = {
        'method': 'POST',
        'url': 'https://site-sgp1.mrslotty.com/integrations/igamez-fairbets/rpc?action=available_games&secret=85fec6c8-43e9-4966-9832-087469276daa',
        'headers': {
        }
      };
      request(options, async function (error, response) {
        if (error) throw new Error(error);
        var indata =JSON.parse(response.body).response;
        var allgamelist = [];
        var index = 0;

        for(var i in indata)
        {
            index ++;
            var row = {};
            providers[indata[i].provider] = true;
            // row['NAME'] = indata[i].name;
            // row['ID'] = indata[i].id;
            // row['order'] =index;
            // row['LAUNCHURL'] = '8';
            // row['TYPE'] = indata[i].categories ? indata[i].categories[0] : "";
            // row['PROVIDERID'] = indata[i].provider;
            // row['image'] = indata[i].media.icon;
            // row['WITHOUT'] =  indata[i]["demo_url"];
        //    var dd =  await BASECONTROL.BfindOne(GAMELISTMODEL,{ID : row.ID,PROVIDERID:row.PROVIDERID},row);
        //     if (!dd){
        //         var savehandle = await BASECONTROL.data_save(row,GAMELISTMODEL);
        //     }else{
                // await BASECONTROL.BfindOneAndUpdate(GAMELISTMODEL,{ID : row.ID,PROVIDERID:row.PROVIDERID},row);
            // }
            // allgamelist.push(row);
        }

        // var saveprodata = []

        for ( var i in providers){
            var fd = await BASECONTROL.BfindOneAndUpdate(PROVIDERMODELS,{provider : i,LAUNCHURL : "8"},{Agregator : "MySlotty"});
            if (!fd){
                var allpro = await BASECONTROL.Bfind(PROVIDERMODELS,{});
                var order = allpro[allpro.length -1].order + 1;
                var row1 = {
                    bool : {1 : true}
                }
                var row = Object.assign({},row1,{order : order},{provider : i},{text : i},{LAUNCHURL : "8"},{Type : "1"},{currency : "1"},
                    {Percentage : "20"},
                    {Money : "0"},
                    {Agregator : "MySlotty"}
                );
                var savehandle = await BASECONTROL.data_save(row,PROVIDERMODELS);
            }else{
            }

            // saveprodata.push(row);
        }
      });
      
      

}
// 
// evoplay()

exports.evoplay  = async (req,res,next) =>{
    var options = {
        'method': 'GET',
        'url': 'http://api.8provider.com/Game/getList?project=1234&version=1&signature=0fe9ebcbcf8f6a4bfe844b36ae3b80e5',
        'headers': {
        }
      };
      request(options, async function (error, response) {
        if (error) throw new Error(error);
        var indata = JSON.parse(response.body).data;
        var index = 0;
        for (var i in indata){
            var row={}
            row['NAME'] = indata[i].name;
            row['ID'] = i;
            row['order'] =index;
            row['LAUNCHURL'] = '9';
            row['TYPE'] = indata[i].game_sub_type;
            row['PROVIDERID'] = "EVOPLAY";
            row['image'] = "";
            row['WITHOUT'] =  indata[i];
            index ++;
        }
      });
}


 