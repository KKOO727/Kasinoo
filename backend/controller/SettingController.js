const ConfigModel = require("../models/settings_model").Configuration;
const NotificationModel = require("../models/settings_model").NotificationModel;
const {TypeModel,LanguageModel} = require("../models/settings_model");
const BASECONTROL =require("./basecontroller");
const fs =require("fs");
const config = require("../db");
const FIRSTPAGECON = require("../models/firstpage_model");
const firstpagesetting = FIRSTPAGECON.firstpagesetting;
const home = require("../servers/home.json")
const Usercontrol = require("./userscontroller")
const ReportControl = require("./reportcontroller")
const {adminUser,sessionmodel} = require("../models/users_model")
const languageconfig = require("../config/language")
// var redis = require('redis');
// const client = redis.createClient({ host: '51.79.167.211', port: 6379 ,auth_pass : "Kiranku123$"});
exports.Indiatime = () => {
	var time = moment.tz(new Date(), "Asia/Kolkata");
	time.utc("+530").format();
	return time;	
}

exports.getGlobalSetting = async (req,res,next) => {
    const KEYS = [
        "signupbuttons",
    ]
    let row = {};
  
    let d =  await firstpagesetting.find();
    for (var i in d) {
        row[d[i].type] =  d[i].content
    }

    res.send({status : true ,data: row});
    return next();        
}

exports.setGlobalConfig = async (req, res, next) => {
    let row = req.body.row;
    let type = row.type;
    let u = await firstpagesetting.findOneAndUpdate({type : type}, row, {upsert : true, new : true});
    if (u) {
        res.send({status : true ,data: u});
        return next();
    } else {
        res.send({status : false ,data: "error"});
        return next();
    }
}

exports.appConfigSave = async (req,res,next) => {
    let data =req.body;
    let type = req.body.type;
    let row = {
        content : {
            versionName  :data.versionName,
            versionCode : data.versionCode,
            forceUpdate : false,
            apkUrl : data.apkUrl
        },
        type : type
    }

    let u1 = await firstpagesetting.findOneAndUpdate({type : "appurl"}, {content : data.apkUrl}, {upsert : true, new : true});
    let u = await firstpagesetting.findOneAndUpdate({type : row.type}, row, {upsert : true, new : true});
    if (u) {
        res.send({status : true ,data: u});
        return next();
    } else {
        res.send({status : false ,data: "error"});
        return next();
    }
}

exports.getAppConfig = async (req,res,next) => {

    var row={}
    let appconfig = await firstpagesetting.findOne({type : "appversion"});
    if (appconfig) {
        row = {
            "versionName": appconfig.content.versionName,
            "versionCode": appconfig.content.versionCode,
            "apkUrl": home.admindomain +  "/apps/" + appconfig.content.apkUrl,
            "forceUpdate": false
        }
        res.send(row);
        return next();
    } else {
        let data = {
            "versionName": "1.0.0",
            "versionCode": "1",
            "apkUrl":"https://cms.fairbets.co/apps/fairbets_v1.apk",
            "forceUpdate": false
        }
        res.send(data);
        return next();
    }

}

exports.appConfigSetting  = async (req,res,next) => {
    
}

exports.get_config = async (req,res,next) =>{
    let data = await BASECONTROL.Bfind(ConfigModel);
    if (data) {
        return res.json({status : true ,data : data});
    } else {
        return res.json({status : false ,error : "error"});
    }
}

exports.saveConfig = async (req,res,next) =>{
    let data= req.body.data;
    if (data) {
        let key = data.key;
        let lastkey = await BASECONTROL.BfindOne(ConfigModel,{key : key});
        if (lastkey) {
            return res.json({status : false ,error : "error"});
        } else {
            let sh = await BASECONTROL.data_save(data,ConfigModel);
            if (sh) {
                this.get_config(req,res,next);
            } else {
                return res.json({status : false ,error : "error"});
            }
        }
    } else {
        return res.json({status : false ,error : "error"});
    }
}

exports.updateConfig = async (req,res,next) =>{
    let data= req.body.data;
    if (data) {
        let key = data.key;
        let lastkey = await BASECONTROL.BfindOneAndUpdate(ConfigModel,{key : key},data);
        if (lastkey) {
            this.get_config(req,res,next);
        } else {
            return res.json({status : false ,error : "error"});
        }
    } else {
        return res.json({status : false ,error : "error"});
    }
}


exports.deleteCOnfig = async (req,res,next) =>{
    let data= req.body.data;
    if (data) {
        let key = data.key;
        let lastkey = await BASECONTROL.BfindOneAndDelete(ConfigModel,{key : key});
        if (lastkey) {
            this.get_config(req,res,next);
        } else {
            return res.json({status : false ,error : "error"});
        }
    } else {
        return res.json({status : false ,error : "error"});
    }

}

exports.get_provider_credential = async (req,res,next) =>{
    // var row = Object.assign({},
    //     {dbconfig : DB},
    //     {pvconfig : PROVIDER},
    //     // {pmconfig:PAYMENTERROR},
    //     {hmconfig:HOME},
    //     {pvmconfig: PROVIDERMANAGE},
    //     // {tymconfig : TYPEMANAGER}
    // )
    // // var data = await BASECONTROLL.Bfind(ProviderCredential,{});
    // if(!row){
    //     res.json({status : false});
    //     return next();
    // }else{
    //     res.json({status : true,data : row});
    //     return next();
    // }
}

exports.update_provider_credential=async (req,res,next) =>{
    var udata = req.body.data;
    var item = req.body.item;
    let data = JSON.stringify(udata);
    switch(item){
        case  "dbconfig" :
            fs.writeFileSync(config.DIR+"/servers/db.json", data,(error)=>{
            });
        break;
        case  "pvconfig" :
            fs.writeFileSync(config.DIR+"/servers/provider.json", data,(error)=>{
            });
        break;
        // case  "pmconfig" :
        //     fs.writeFileSync(config.DIR+"/config/paymenterror.json", data,(error)=>{
        //     });
        // break;
        case  "hmconfig" :
            fs.writeFileSync(config.DIR+"/servers/home.json", data,(error)=>{
            });
        break;
        case  "pvmconfig" :
            fs.writeFileSync(config.DIR+"/config/providermanage.json", data,(error)=>{
            });
        break;
      
        case  "tymconfig" :
            fs.writeFileSync(config.DIR+"/config/typemange.json", data,(error)=>{
            });
        break;
    }
}

exports.getNotificationtotal = async (req ,res, next) => {
    let role = req.user;
    const Players = await Usercontrol.get_players_items(role);
    let useroptions = [
        {label : "All" , value : "All"},
        {label : "Telegram" , value : "telegram"},
        {label : "Mobile App" , value : "app"},
        {label : "Website" , value : "web"},
    ];
    for (let i in Players) {
        useroptions.push({label : Players[i].username, value : Players[i].email});
    }
    res.send({status : true , data : useroptions});
    return next();
}

exports.getNotificationdetail = async (req ,res, next) => {

    // NotificationModel
    let params = req.body.params;
    if (params) {
        let totalcount = await NotificationModel.countDocuments();
        var pages = ReportControl.setpage(params,totalcount);
        var rows = [];
        if (totalcount > 0) {
            rows=  await NotificationModel.find().skip(pages.skip).limit(pages.limit);
        }
        pages["skip2"] = (pages.skip) + rows.length;
    
        res.send({status : true, data :rows,pageset : pages,});
        return next();
    } else {
        res.send({status : false, data : "fail"})

    }
}

exports.resendNotificationdetail = async (req, res, next) => {

    this.sendNotification(req,req.body.row);
    res.send({status : true})
}

exports.sendNotification = async (req,row) => {
    const io = req.app.get("socketio");
    switch (row.userid) {
        case "All" :
            io.sockets.emit("AllNotification",{data : row});   
        break;
        case "telegram" :
            // io.sockets.emit("telegramNotification",{data : row});
            let sessions = await sessionmodel.find({ chatid : {$ne : "web"}});
            for (var i in sessions){
                row['chatid'] = sessions[i].chatid;
                io.to(sessions[i].socketid).emit("UserNotification",{data : row});                
            }

        break;
        case "app" :
            io.sockets.emit("appNotification",{data : row});
        break;
        case "web" :
            io.sockets.emit("webNotification",{data : row});
        break;
        default :
            let user = await adminUser.findOne({email : row.userid});
            let session = await sessionmodel.findOne({id : user._id});
            if (user && session) {
                row['chatid'] = session.chatid;
                io.to(session.socketid).emit("UserNotification",{data : row});
            } else {

                // if (user.signup_device != "telegram") {
                //     io.sockets.emit("UserNotification",{data : row});
                // }
            }
    }
}

exports.savegetNotification = async (req ,res, next) => {
    let row = req.body.row;
    let sh = await BASECONTROL.data_save(row, NotificationModel);
    if (sh) {
        this.sendNotification(req,row)
        this.getNotificationdetail(req,res,next);
    } else {
        res.send({status : false, data : "fail"})
    }
}

exports.updategetNotification = async (req ,res, next) => {
    let row = req.body.row;
    let up = await NotificationModel.findOneAndUpdate({_id : row._id},row);
    if (up) {
        this.getNotificationdetail(req,res,next);
    } else {
        res.send({status : false, data : "fail"})
    }
}

exports.deletegetNotification = async (req ,res, next) => {
    let row = req.body.row;
    let ud = await NotificationModel.findOneAndDelete({_id : row._id})
    if (ud) {
        this.getNotificationdetail(req,res,next);
    } else {
        res.send({status : false, data : "fail"})
    }
}

exports.getTypemanager = async (req,res,next) => {
    let data = await TypeModel.find().sort({order : 1});
    res.send({status : true, data : data});
    return;
}


async function data_update(data,model)
{
    var outdata = null;
    await model.findOneAndUpdate({_id : data._id},data).then(rdata=>{
        if (!rdata) {
            outdata =false;
        } else {
            outdata = true;
        }
    });
    return outdata;
}


exports.updateTypemanager = async (req,res,next) => {
    var indata = req.body.data;
    for (var i = 0 ; i < indata.length ; i++)
    {
        var updatehandle =  await data_update(indata[i],TypeModel);
        if (!updatehandle) {
            res.json({status : false,data : "fail"});
            return next();
        }
    }
    this.getTypemanager(req,res,next)
}

exports.saveTypemanager = async (req,res,next) => {
    var indata = req.body.data;
    var savehandle = await BASECONTROL.data_save(indata,TypeModel);
    if (!savehandle) {
        res.json({status : false,data : "fail"});
        return next();
    } else {
        this.getTypemanager(req,res,next)
    }
}

exports.deleteTypemanager = async (req,res,next) => {
    var indata = req.body.data;
    var outdata = null;
    await TypeModel.findOneAndDelete({_id : indata._id}).then(rdata=>{
        if (!rdata) {
            outdata =false;
        } else {
            outdata = true;
        }
    });
    if(!outdata){
        res.json({status : false,data : "fail"})
        return next();
    }else{
        this.getTypemanager(req,res,next)
    }
}


exports.getLanguage = async (req,res,next) => {
    
    let langs = languageconfig;
    let options = [];
    for (let i in langs) {
        options.push({label : langs[i], value : i})
    }
    let data = await LanguageModel.find().sort({order : 1});
    res.send({status : true, data : data, options : options});
    return;
}
exports.telegramGetLanuageMenu = async (req,res , next) => {
    
    let data = await LanguageModel.find().sort({order : 1});
    res.send({status : true, data : data});
    return;
}



exports.updateLanguage = async (req,res,next) => {
    var indata = req.body.data;
    for (var i = 0 ; i < indata.length ; i++)
    {
        var updatehandle =  await data_update(indata[i],LanguageModel);
        if (!updatehandle) {
            res.json({status : false,data : "fail"});
            return next();
        }
    }
    this.getLanguage(req,res,next)
}

exports.saveLanguage = async (req,res,next) => {
    var indata = req.body.data;
    var savehandle = await BASECONTROL.data_save(indata,LanguageModel);
    if (!savehandle) {
        res.json({status : false,data : "fail"});
        return next();
    } else {
        this.getLanguage(req,res,next)
    }
}

exports.deleteLanguage = async (req,res,next) => {
    var indata = req.body.data;
    var outdata = null;
    await LanguageModel.findOneAndDelete({_id : indata._id}).then(rdata=>{
        if (!rdata) {
            outdata =false;
        } else {
            outdata = true;
        }
    });
    if(!outdata){
        res.json({status : false,data : "fail"})
        return next();
    }else{
        this.getLanguage(req,res,next)
    }
}
