
const BASECONTROLL = require("./basecontroller")
const FIRSTCON = require("../models/firstpage_model");
const firstMenuModel = FIRSTCON.firstMenuModel;
const appversionmodel = FIRSTCON.appversionmodel;
const FirstpagePaymentMethodImg = FIRSTCON.FirstpagePaymentMethodImg;
const FirstpageProviderImg = FIRSTCON.FirstpageProviderImg;
const firstpagesetting = FIRSTCON.firstpagesetting;
const SliderIMGModel = FIRSTCON.SliderIMGModel;
const GAMELISTMODEL = require("../models/games_model").GAMELISTMODEL;
const FIRSTPAGE_GAMELIST_MODEL = require("../models/games_model").FIRSTPAGE_GAMELIST_MODEL;
const TopGamelistmodel = require("../models/games_model").TopGamelistmodel;

const PROVIDERMODELS = require("../models/games_model").PROVIDERMODELS;
const USERS = require("../models/users_model");
const sidebarmodel = USERS.profilemenu;
const Usercontroller = require("./userscontroller")
const home = require("../servers/home.json")
var mongoose = require('mongoose');
const config = {
    "/casino" : "1",
    "/live-casino" : "2",
    "/virtual-sports" : "3",
    "/poker" : "4",
    "/cock-fight" : "5",
    "/animal" : "6",
};

exports.gamesSearch = async (req,res,next) => {
    var searchQuery = req.body.searchQuery;
    var bool = config[req.body.type]
    var newbool={};
    newbool['bool.'+bool] = true;
    newbool['status'] = true;
    var orquery = [];
    var rows1 = await BASECONTROLL.BSortfind(PROVIDERMODELS,newbool,{order : 1});
    for (var i in rows1) {
        orquery.push({providerid : rows1[i]._id});
    }
    let data = await GAMELISTMODEL.aggregate([
        {
            $match : {
                $and : [{ isdelete : false,NAME : { $regex : searchQuery }}],
                $or : orquery
            }
        },
        { "$limit": 100 },
        { "$skip": 0 }
    ]);
    res.send({status : true ,data : data});
}


exports.firstpage_load = async (req,res,next) => {
    var totalData = {};
    let list = ["trackcode","title","signupbuttons","logoimg","footertext","favicon","appurl","TimerButton","forgotpassword"];
    let query = [];

    for (let i in list) {
        query.push({type : list[i]});
    }

    var first_setting = await BASECONTROLL.Bfind(firstpagesetting,{$or : query});
    for (var i in first_setting) {
        totalData[first_setting[i].type] = first_setting[i].content;
    }
  
    // if (req.headers['user-device'] == "web") {
        var firstmenu = await BASECONTROLL.BSortfind(firstMenuModel,{bool : "1",status : true},{order : 1});
    // } else {
        // var firstmenu = await BASECONTROLL.BSortfind(firstMenuModel,{bool : "9",status : true},{order : 1});
    // }
    var firstquick = await BASECONTROLL.BSortfind(firstMenuModel,{bool : "2",status : true},{order : 1});
    var privacypolicy = await BASECONTROLL.BSortfind(firstMenuModel,{bool : "5",status : true},{order : 1});
    var sociallink = await BASECONTROLL.BSortfind(firstMenuModel,{bool : "3",status : true},{order : 1});
    var newtext = await BASECONTROLL.BSortfind(firstMenuModel,{bool : "4",status : true},{order : 1});
    var faqpage = await BASECONTROLL.BSortfind(firstMenuModel,{bool : "6",status : true},{order : 1});
    var contactus = await BASECONTROLL.BSortfind(firstMenuModel,{bool : "7",status : true},{order : 1});
    var aboutus = await BASECONTROLL.BSortfind(firstMenuModel,{bool : "8",status : true},{order : 1});
    totalData['firstmenu'] = firstmenu;
    totalData['contactus'] = contactus;
    totalData['firstquick'] = firstquick;
    totalData['privacypolicy'] = privacypolicy;
    totalData['faqpage'] = faqpage;
    totalData['newtext'] = newtext;
    totalData['sociallink'] = sociallink;
    totalData['aboutus'] = aboutus;
    var paymentimgs = await BASECONTROLL.Bfind(FirstpagePaymentMethodImg)
    var providerimgs = await BASECONTROLL.Bfind(FirstpageProviderImg)
    totalData['paymentimgs'] = paymentimgs;
    totalData['providerimgs'] = providerimgs;

    res.json({status : true,data : totalData});
    return next();
}

exports.getsidebar = async(req,res,next) =>{

    var totalData = {};
    if (req.headers['user-device'] == "app") {
        var roles = await sidebarmodel.find({mobilestatus : true},"mobileicon children type pid title id navLink")
    } else {
        var roles = await sidebarmodel.find({status : true},"children type pid title id navLink icon")
    }
    
    var newrow =  Usercontroller.list_to_tree(roles)
    totalData['sidebar'] = newrow;

    res.json({status : true,data : totalData});
    return next();
}


exports.firstpage_gamelist = async (req,res,next) =>{
    var totalData = {};

    var livecasinoitems = await BASECONTROLL.BSortfindPopulate(FIRSTPAGE_GAMELIST_MODEL,{type : "2"},{order : 1},"gameid");
    totalData['livecasinoitems'] = livecasinoitems;
    var casinoitems = await BASECONTROLL.BSortfindPopulate(FIRSTPAGE_GAMELIST_MODEL,{type : "1"},{order : 1},"gameid");
    totalData['casinoitems'] = casinoitems;
    res.json({status : true,data : totalData});
    return next();
}

exports.topgamesList = async (req,res,next) => {

    let type = req.body.type;
    let array = await TopGamelistmodel.aggregate([
        {
            $sort: {
                order : -1
            }
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
                $and : [ {"game.TYPE" : { $regex:type} }]
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

    res.json({status : true,data : array});
    return next();
}


exports.firstpage_slider = async (req,res,next) =>{
    var totalData = {};
    var firstpages1 = await BASECONTROLL.BSortfindPopulate(SliderIMGModel,{bool : "5"},{order : 1},"gameid");

    var firstpages2 = await BASECONTROLL.BSortfind(SliderIMGModel,{bool : "6"},{order : 1},"gameid");
    
    var firstpages3 =  await BASECONTROLL.BSortfind(SliderIMGModel,{bool : "7"},{order : 1},"gameid");
    
    totalData['firstpages1'] = firstpages1;
    totalData['firstpages2'] = firstpages2;
    totalData['firstpages3'] = firstpages3;
    res.json({status : true,data : totalData});
    return next();
}

exports.FirstPage_menuload =async (req,res,next)=>{
    var findhandle = "";
    findhandle = await get_menuitems(firstMenuModel);
    if(!findhandle){
        res.json({status : false,data : "fail"})
        return next();
    }else{
        res.json({status : true,data : findhandle})
        return next();
    }
}

async function get_menuitems(model){
    var outdata = null;
    await model.find({status : true}).sort({order : 1}).then(rdata=>{
        if(!rdata){
            outdata = false;
        }else{
            outdata = rdata;
        }
    });
    return outdata;
}

exports.typelist = async (req,res, next) => {
    let tconfig = req.tconfig["keylaunchurl_type"];
    var tdata = tconfig["2"];
    res.send({status : true ,tdata});
}

exports.LivecasinoproviderLoad = async (req,res,next)=>{

    var bool = req.body.bool;
    var selectprovider = req.body.selectprovider;
    var newprovider = []
    for(var i in selectprovider){
        newprovider.push({provider : selectprovider[i].value})
    }
    var newbool={};
    var index = 0
    newbool['bool.'+bool] = true;
    newbool['status'] = true;
    var pdata = await BASECONTROLL.BSortfind(PROVIDERMODELS,newbool,{order : 1});
    if(!pdata){
        res.json({ status : false,data : "fail" })
        return next();
    }else{
        if(pdata.length > 0)
        {
            let tconfig = req.tconfig["keylaunchurl_type"];
            var tdata = tconfig[bool];
            var pro  = newprovider.length > 0 ?  newprovider : pdata;
            var gamelist = [];
            var rows= await BASECONTROLL.BSortfind(GAMELISTMODEL,{isdelete : false,PROVIDERID : pro[0].provider,status : true},{order : 1});
            if (rows.length < 24 && pro.length > 1){
                for(var i = 1 ; i < pro.length ; i++)
                {
                    index = i;
                    var rows1= await BASECONTROLL.BSortfind(GAMELISTMODEL,{isdelete : false,PROVIDERID : pro[i].provider,status : true},{order : 1});
                    for(var j in rows1){
                        rows.push(rows1[j]);
                    }
                    if(rows.length > 24){
                        break;
                    }
                }
            }
            gamelist = rows;
            // for(var i =  0 ; i < pro.length ; i++){
            //     var rows= await BASECONTROLL.BSortfind(GAMELISTMODEL,{PROVIDERID : pro[i].provider,status : true},{order : 1});
            //     for(var j = 0 ; j < rows.length ; j++ ){
            //         gamelist.push(rows[j]);
            //     }
            // }

            var firstpages3 =  await BASECONTROLL.BSortfindPopulate(SliderIMGModel,{bool : req.body.type},{order : 1},"gameid");
         
            res.json({status : true,data : {pdata : pdata,tdata : tdata,list : gamelist,imgs :firstpages3,index : index}});
            return next();
        }else{
            res.json({status: false,data : "No db"})
            return next();
        }
    }
}

exports.LivecasinoproviderChange = async(req,res,next)=>{

    var pro = req.body.data;
    var bool = req.body.bool;
    var gamelist = []
    for(var i =  0 ; i < pro.length ; i++){
        var rows= await BASECONTROLL.BSortfind(GAMELISTMODEL,{isdelete : false,PROVIDERID : pro[i].value,status : true},{order : 1});
        gamelist = [...gamelist,...rows];
        if (gamelist.length > 24) {
            break;
        }
    }
    if(gamelist){
        res.json({status : true,data : gamelist});
        return next();
    }else{
        res.json({status : false});
        return next();
    }
}

exports.Liveslider_load =async (req,res,next) => {
    var firstpages3 =  await BASECONTROLL.BSortfindPopulate(SliderIMGModel,{bool : req.body.bool},{order : 1},"gameid");
    // for(var i = 0 ; i < fp3.length ; i++){
    //     var item = await BASECONTROLL.BfindOne(GAMELISTMODEL,{_id : fp3[i].data.gamedata});
    //     var dd = Object.assign({},item._doc ? item._doc : item,fp3[i]._doc ? fp3[i]._doc :fp3[i] ,);
    //     firstpages3.push(dd);
    // }
    if(!firstpages3){
        res.json({
            status:false,
        })
        return next();
    }else{
        res.json({
            status:true,
            data: firstpages3
        })
        return next();
    }
}

exports.scroll_load = async(req,res,next) =>{
    var provider = req.body.data;
    var rows1= await BASECONTROLL.BSortfind(GAMELISTMODEL,{isdelete : false,PROVIDERID : provider,status : true},{order : 1});
    res.json({status : true,data : rows1});
    return next();
}

exports.getAppVersion = async(req,res,next) =>{
    // let dd = await appversionmodel.findOne().sort({createAt : 1});
    // if (dd) {
    //     res.send({status : true ,data : rows});
    //     return next();
    // } else {
    //     res.send({status : false});
    //     return next();
    // }
    res.send();

}

exports.setAppVersion = async (req,res,next) =>{
    let apkurl = home.homedomain +"/apps/" + req.body.apkname;
    let targetversion = req.body.targetversion;
    let row = {
        apkurl : apkurl,
        targetversion : targetversion
    }
    let dd = await BASECONTROLL.data_save(row,appversionmodel);
    if (dd) {
        res.send({status : true ,data : rows});
        return next();
    } else {
        res.send({status : false});
        return next();
    }
}


exports.telegramMenuload = async (req,res,next) =>{
    var firstmenu = await BASECONTROLL.BSortfind(firstMenuModel,{bool : "1",status : true},{order : 1});
    if (firstmenu){
        res.send({status : true ,data : firstmenu});
        return next();
    } else {
        res.send({status : false});
        return next();
    }
}

exports.telegramMenuproviderload = async (req,res,next) =>{
   
    var bool = config[req.body.navLink];
    var newbool={};
    newbool['bool.'+bool] = true;
    newbool['status'] = true;
    var rows1 = await BASECONTROLL.BSortfind(PROVIDERMODELS,newbool,{order : 1});
    if (rows1) {
        res.send({status : true ,data : rows1});
        return next()
    } else {
        res.send({status : false});
        return next(); 
    }
}


exports.telegramMenugamelistload = async (req,res,next) =>{
    let providerid = req.body.providerid;
    if (providerid) {
        var rows1= await BASECONTROLL.BSortfind(GAMELISTMODEL,{isdelete : false,providerid : mongoose.Types.ObjectId(providerid),status : true},{order : 1});
        if (rows1) {
            res.send({status : true ,data : rows1});
            return next()
        } else {
            res.send({status : false});
            return next(); 
        }
    } else {
        res.send({status : false});
        return next();
    }

}