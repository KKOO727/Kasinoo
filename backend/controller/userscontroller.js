
const BASECON = require("./basecontroller");
const USERS = require("../models/users_model");
const CONFIG = require("../config/index.json");
const CryptoJS = require("crypto-js");
const PlayersController = require("./playerscontroller");
var mongoose = require('mongoose');
const adminUser = USERS.adminUser;
const themeModel = USERS.get_themeinfor;
const permission_model = USERS.permission_model;
const totalusermodel = USERS.totalusermodel;
const GamePlay = USERS.GamePlay;
const sidebarmodel = USERS.sidebarmodel;
const friendModel = USERS.friendModel;
const FIRSTPAGECON = require("../models/firstpage_model");
const firstpagesetting = FIRSTPAGECON.firstpagesetting;
const {PaymoroSubmitData} = require("../models/paymentGateWayModel")
const Sendy = require('sendy-api');
const DB = require("../servers/home.json");
const KEYS = require("../config/configkeys")



exports.list_to_tree = (list) =>{
    var map = {}, node, roots = [], i;    
    for (i = 0; i < list.length; i += 1) {
        map[list[i].id] = i; // initialize the map
        list[i].children = []; // initialize the children
    }

    for (i = 0; i < list.length; i += 1) {
        node = list[i];
        if (node.pid !== "0") {
            if (list[map[node.pid]]) { 
                list[map[node.pid]].children.push(node);
                // return;
            } else {
                // return;
            }
            // if you have dangling branches check that map[node.parentId] exists
        } else {
            roots.push(node);
        }
    }
    return roots;
}


async function register_action(user,callback){


    if( !user.email || !user.username || !user.password && !user.firstname && !user.lastname && !user.status && !user.created){
        callback({status : false,data : "please provide vallid data."});
        return;
    }

    let error =  await BASECON.BfindOne(adminUser,{email : user.email });
    if(error){
        callback({status : false,data : "User Exists"})
        return;
    }

    if (user.mobilenumber && user.mobilenumber.length) {
        let error2 =  await BASECON.BfindOne(adminUser,{mobilenumber : user.mobilenumber });
        if(error2){
            callback({status : false,data : "User Exists"})
            return;
        }
    }
    
    let error1 = await BASECON.BfindOne(adminUser,{username : user.username});
    if(error1){
        callback({status : false,data : "User Exists"})
        return;
    }

    var roles = await BASECON.BfindOne(permission_model,{id : user.permission});
    if(!roles){
        callback({status : false,data : "server error"})
        return;
    }

    // var data = await BASECON.BfindOne(adminUser,{email : user.created});
    // user['signup_device'] = device;
    // user['created'] = data.permission == CONFIG.USERS.superadmin && user.permission != CONFIG.USERS.supermaster  ? "superweb@gmail.com" : user.created;
    // var _id =  mongoose.Types.ObjectId(hex(BASECON.get_timestamp()+"").slice(0,24));

    let Newuser = new adminUser(user);
    let Newplayer = new GamePlay(user);
    Newplayer['id'] = Newuser._id;
    Newuser['playerid'] = mongoose.Types.ObjectId(Newplayer._id);
    Newuser['permissionid'] = mongoose.Types.ObjectId(roles._id);
    Newplayer['userid'] = mongoose.Types.ObjectId(Newuser._id);

    Newuser.password = Newuser.generateHash(Newuser.password);

    let U_save = await BASECON.data_save(Newuser,adminUser)
    let P_save = await BASECON.data_save(Newplayer,GamePlay)

    if(U_save && P_save){
        callback({status : true,data:U_save});
    }else{
        callback({status : false,data : "server error"});
    }
}


exports.telegramCreatePassword = async(req,res,next) => {
    let {password} = req.body;
    let user = req.user;
    if (password && password.length) {
        let item = await adminUser.findOne({email : user.email});
        if (item) {
            item.password = item.generateHash(password);
            let up = await adminUser.findOneAndUpdate({_id : item._id}, item);
            if (up) {
                return res.send({status : true,data : "success"});
            } else {
                return res.send({status : false,data : "server error"});
            }
        } else {
            return res.send({status : false,data : "server error"});
        }
    } else {
        return res.send({status : false,data : "server error"});
    }
}

exports.player_login = async(req,res,next)=>{

    var password = req.body.password;
    var username = req.body.username;
    var error = "";
    var user = await BASECON.BfindOne(adminUser,{$or : [{username : username},{email : username}]});
    if(!user){
        error = "we can't find with this email/username.";
        res.json({status : false,error : error});
        return next();
    }

    if(!user.validPassword(password, user.password)){
        error = "passwords do not match";
        res.json({status: false, error : error});
        return next();
    }

    var homeConfig = req.homeConfig;

    var device = req.headers["user-device"] === "app" ? true : false;
        
    if (user.permission != homeConfig.USERS.player ) {
        error = "You can't login with this email/username.";
        res.json({status : false,error : error});
        return next();
    } else if (user.isdelete) {
        error =  "This email/username was deleted.";
        res.json({status : false,error : error});
        return next();
    } else if (user.status == homeConfig.USERS.status.pending) {
        error = "This email/username is pending.";
        res.json({status : false,error : error});
        return next();
    } else if (user.status == homeConfig.USERS.status.block) {
        error = "This email/username was blocked.";
        res.json({status : false,error : error});
        return next();
    } else if ( homeConfig.mobileuserlogin && device != user.signup_device) {
        error = "You can't login with this email/username.";
        res.json({status : false,error : error});
        return next();
    } else{
        var compressed = this.accestoken(user);
        let ip = BASECON.get_ipaddress(req);
        await BASECON.data_save({email:user.email,ip : ip},totalusermodel);
        return res.json({status : true,data:compressed});
    }
}


exports.LoginbyId = async(req,res,next)=>{

    var token = req.body.token;
    var error = "";
    // try {
        let item = await PaymoroSubmitData.findOneAndDelete({order_no : (token)});
        if (item) {
            var user = await BASECON.BfindOne(adminUser,{email : item.content});
            if(!user){
                error = "we can't find with this email/username.";
                res.json({status : false,error : error});
                return next();
            } else {
                var compressed = this.accestoken(user);
                let ip = BASECON.get_ipaddress(req);
                await BASECON.data_save({email:user.email,ip : ip},totalusermodel);
                return res.json({status : true,data:compressed});
            }
        } else {
            res.json({status : false});
            return next();
        }
    // }catch(e) {
    //     res.json({status : false});
    //     return next();
    // }
}

exports.accestoken = (user) =>{
    let hashstr = { 
        _id : user._id,
        role : user.permission,
    }
    var authstr = BASECON.encrypt(JSON.stringify(hashstr));
    return authstr
}

exports.admin_login = async(req,res,next)=>{

    var password = req.body.password;
    var username = req.body.username;
    var error = "";
    var user = await BASECON.BfindOne(adminUser,{$or : [{username : username},{email : username}]});
    if(!user){
        error = "we can't find with this email/username.";
        res.json({status : false,data : error});
        return next();
    }

    if(!user.validPassword(password, user.password)){
        error = "passwords do not match";
        res.json({status: false, data : error});
        return next();
    }
    var device = req.headers["user-device"] === "app" ? true : false;
   
    var homeConfig = req.homeConfig;

    if (user.permission == homeConfig.USERS.player ) {
            error = "You can't login with this email/username.";
        res.json({status : false,data : error});
        return next();
    } else if (user.isdelete){
        error =  "This email/username was deleted.";
        res.json({status : false,data : error});
        return next();
    } else if (user.status == homeConfig.USERS.status.pending) {
        error = "This email/username is pending.";
        res.json({status : false,data : error});
        return next();
    } else if (user.status == homeConfig.USERS.status.block) {
        error = "This email/username was blocked.";
        res.json({status : false,data : error});
        return next();
    } else if ( homeConfig.mobileuserlogin && device != user.signup_device) {
        error = "You can't login with this email/username.";
        res.json({status : false,data : error});
        return next();
    } else {
        var compressed = this.accestoken(user);
        let ip = BASECON.get_ipaddress(req);
        await BASECON.data_save({email:user.email,ip : ip},totalusermodel);
        res.json({status : true,data:compressed});
        return next();
    }
}

exports.playerRegister = async (req,res,next) =>{
    
    try{
        var homeConfig = req.homeConfig;
        let device = req.headers["user-device"];

        if (device == homeConfig.website || device == homeConfig.mobile) {
    
            let user = req.body.user;
            user['signup_device'] = device;
            user['permission'] = homeConfig.USERS.player;
            user['status'] = homeConfig.USERS.status.allow;
            user['isdelete'] = false;
            user['created'] = homeConfig.website == device ? homeConfig.USERS.webmail : homeConfig.USERS.appmail;
            
            register_action(user,(rdata)=>{
                if(rdata.status){
                    signup_subscribe(rdata.data,(sdata)=>{
                        res.json({status : true ,data : rdata.data});
                        return next();
                    });
                }else{
                    res.json(rdata);
                    return next();
                }
            });

        } else {
            res.send({status : false, data : "error"});
            return next();
        }
    }catch(e){
        res.send({status : false , data : "error"});
        return next();
    }
}

exports.telegramregister = async (req,res,next) =>{

    try{

        var homeConfig = req.homeConfig;
        let agentId = req.body.agentId;
        var friendId = req.body.friendId;
        let created = "";
        var agent = ""
        if (agentId && agentId.length) {
            let f = await adminUser.findOne({fakeid : req.body.agentId});
            if (f && f.permission != homeConfig.USERS.superadmin) {
                created = f.email;
            } else {
                created = homeConfig.USERS.telegrammail;
            }
        } else {
            created = homeConfig.USERS.telegrammail;
        }
       
        let botdevice = req.headers['bot-name'];
        let indata =req.body;
        let row = {
            username :(indata.username ? indata.username : indata.id ),
            password : indata.id,
            email : indata.id,
            firstname : indata.firstName,
            lastname : indata.lastName ? indata.lastName : indata.id,
            status : homeConfig.USERS.status.allow,
            created : created,
            permission : homeConfig.USERS.player,
            signup_device : homeConfig.telegram,
            botdevice : botdevice
        }

        // return;

        register_action(row,async(rdata)=>{
            if(rdata.status){

                if (friendId && friendId.length) {
                    let friendUser = await adminUser.findOne({email:friendId});
                    if (friendUser) {
                        let frow = {
                            FriendUserId : friendUser._id,
                            UserEmail : rdata.data.email,
                            UserId : rdata.data._id
                        }
                        let is = await friendModel.findOne({FriendUserId : mongoose.Types.ObjectId(friendUser._id)});
                        if (!is) {
                            await BASECON.data_save(frow, friendModel)
                        }
                    }
                }
                res.json({status : true ,data : rdata.data});
                return next();
            }else{
                res.json(rdata);
                return next();
            }
        });

    }catch(e){
        res.send({status : false , data : "error"});
        return next();
    }
}

exports.get_adminthemestyle = async (req,res,next) =>{
    var email = req.user.email;
    var rdata = await BASECON.BfindOne(themeModel,{email : email})
    if(!rdata){
        res.json({status : false,data:"fail"});
        return next();
    }else{
        res.json({status : true,data : rdata});
        return next();
    }
}

exports.save_adminthmestyle = async (req,res,next) =>{ 

    var email = req.user.email;
    var row = req.body.data;
    row['email'] = email;
    var outdata = await BASECON.BfindOneAndUpdate(themeModel , {email : row.email} , row);
    if (outdata) {
        res.json({
            status : true,
            data : outdata
        })
        return next();
    } else {
        res.json({
            status : false,
            data : "Fail"
        })
        return next();
    }
}

exports.get_user_detail = async(req,res,next)=>{
    var user = req.user;

    if(user){
        res.json({status : true,data: user});
        return next();
    }else{
        return res.json({session : true});
    }
}

exports.playerThemeGet = async (req,res,next) => {
    var email = "admin";
    var rdata = await BASECON.BfindOne(themeModel,{email : email})
    if(!rdata){
        res.json({status : false,data:"fail"});
        return next();
    }else{
        res.json({status : true,data : rdata});
        return next();
    }
}


exports.playerThemeSave = async (req,res,next) => {
    var email = "admin";
    var row = req.body.data;
    row['email'] = email;
    var outdata = await BASECON.BfindOneAndUpdate(themeModel , {email : row.email} , row);
    if (outdata) {
        res.json({
            status : true,
            data : outdata
        })
        return next();
    } else {
        res.json({
            status : false,
            data : "Fail"
        })
        return next();
    }
}


exports.telegramGetUserinfor = async (req,res,next) =>{
    let telegramid = req.body.id;
    var user  = await BASECON.BfindOne(adminUser,{email : telegramid});
    if (user) {
        res.json({status : true,data: user});
        return next();
    } else {
        res.send({status : false, data : "error"});
        return next();
    }
}

exports.telegramUpdateLanguage = async (req,res,next) => {
    

    let telegramid = req.user.email;
    let code = (req.body.data);
    if (code && code.length > 0) {
        var user  = await adminUser.findOneAndUpdate({email : telegramid},{language : code});
        if (user) {
            res.json({status : true,data: user});
            return next();
        } else {
            res.send({status : false, data : "error"});
            return next();
        }
    } else {
        res.send({status : false, data : "error"});
        return next();
    }
}

exports.telegramUpdateAdress = async (req,res,next) => {

    let telegramid = req.body.id;
    let address = req.body.address;
    if (address && address.length > 0) {
        var user  = await adminUser.findOneAndUpdate({email : telegramid},{address : address});
        if (user) {
            res.json({status : true,data: user});
            return next();
        } else {
            res.send({status : false, data : "error"});
            return next();
        }
    } else {
        res.send({status : false, data : "error"});
        return next();
    }
}

exports.get_user_auth = async (req,res,next) =>{
    let token = req.body.token;

    var authstr = JSON.parse(BASECON.decrypt(token));
    var user  = await BASECON.BfindOne(adminUser,{_id : authstr._id});
    if(user){
        res.json({status : true,data: user});
        return next();
    }else{
        return res.json({session : true});
    }
}

exports.user_changepassword = async(req,res,next)=>{
    var user = req.body.data;
    user.password =await  BASECON.jwt_encode(user.password);
    var rdata = await BASECON.BfindOneAndUpdate(adminUser,{email : user.email},{password : user.password});
    if(!rdata){
        res.json({
            status : false,
            data : "Email not found"
        })
        return next();
    }else{
        rdata.password = user.password;
        res.json({
            status : true,
            data : await BASECON.jwt_encode(rdata)
        })
        return next();
    }
}

exports.admin_changepassword = async(req,res,next)=>{
    var user = req.body.user;

    var item = await BASECON.BfindOne(adminUser,{email : req.user.email});
    var currentpassword = user.currentpassword;
    var password = user.password;

    if(!item.validPassword(currentpassword, item.password)){
        error = "passwords do not match";
        res.json({status: false, error : error});
        return next();
    }

    password =  item.generateHash(password);    
    var up = await BASECON.BfindOneAndUpdate(adminUser,{email:item.email},{password:password});
    if(up){
        res.json({status : true});
        return next();
    }else{
        res.json({status : false,error: "server error"});
        return next();
    }
};





/////////--------------------------roles ----------------
exports.roles_load = async (req,res,next)=>{
    var findhandle = "";
    findhandle = await BASECON.BSortfind(permission_model,{},{order : 1});
    if(!findhandle){
        res.json({status : false,data : "fail"})
        return next();
    }else{
        var data = BASECON.array_sort(findhandle,"order")
        res.json({status : true,data : data})
        return next();
    }
}

exports.roles_menusave = async (req,res,next)=>{
    var indata = req.body.data;
    indata['id'] = new Date().valueOf();
    var lastdata = await BASECON.BSortfind(permission_model,{},{order : 1});
    if(!lastdata){
        res.json({status : false,data : "fail"});
        return next();
    }else{
        indata['order'] = lastdata[lastdata.length-1].order  + 1;
        var savehandle = await BASECON.data_save(indata,permission_model);
        if(!savehandle){
            res.json({status : false,data : "fail"});
            return next();
        }else{
            var  findhandle = await BASECON.BSortfind(permission_model,{},{order : 1});       
            if(!findhandle){
                res.json({status : false,data : "fail"})
                return next();
            }else{
                var data = BASECON.array_sort(findhandle,"order")
                res.json({status : true,data : data})
                return next();
            }
        }
    }
}

exports.roles_menuupdate = async (req,res,next)=>{
    var indata = req.body.data;
    for(var i = 0 ; i < indata.length ; i++)
    {
        var updatehandle =  await BASECON.BfindOneAndUpdate(permission_model,{_id : indata[i]._id},indata[i]);
        if(!updatehandle){
            res.json({status : false,data : "fail"});
            return next();
        }
    }
    var  findhandle = await BASECON.BSortfind(permission_model,{},{order : 1});     
    if(!findhandle){
        res.json({status : false,data : "fail"})
        return next();
    }else{
        var data = BASECON.array_sort(findhandle,"order")
        res.json({status : true,data : data})
        return next();
    }
}

exports.roles_menudelete = async(req,res,next)=>{
    var indata = req.body.data;
    var outdata = await BASECON.BfindOneAndDelete(permission_model,{_id : indata._id})
    if(!outdata){
        res.json({status : false,data : "fail"})
        return next();
    }else{
        var findhandle = "";
        findhandle = await  BASECON.BSortfind(permission_model,{},{order : 1});     
        if(!findhandle){
            res.json({status : false,data : "fail"})
            return next();
        }else{
            var data = BASECON.array_sort(findhandle,"order")
            res.json({status : true,data : data})
            return next();
        }
    }
}
///////---------------users cms
exports.get_users_items = async(role) =>{                 ///////////////-----------------get user items
    var data = [];
    async function recurse(email){
        var rows = await BASECON.Bfind(adminUser,{isdelete : false,created : email});
        // data = rows;
        // return;
        if(rows.length == 0) {
            return;
        } else {
            for(var i = 0 ; i < rows.length ; i++){
                data.push(rows[i]);
                await recurse(rows[i].email);
            }
        }
    }
    if(role.permission == CONFIG.USERS.superadmin){
       data = await BASECON.Bfind(adminUser,{isdelete : false});
    }else{
        await recurse(role.email);
    }

    var news = [];

    for(var i in data){
        let row=Object.assign({},data[i]._doc);
        row['playerid'] = BASECON.getPlayerBalanceCal(row['playerid'])
        news.push(row);
    }

    news.sort(function(news,b){
        return new Date(b.date) - new Date(news.date)
    })

    return news;
}

exports.get_players_items = async(role) =>{                 ///////////////-----------------get user items
    var data = [];
    async function recurse(email){
        var rows = await BASECON.Bfind(adminUser,{isdelete : false,created : email});

        if(rows.length == 0) {
            return;
        } else {
            for(var i = 0 ; i < rows.length ; i++){
                data.push(rows[i]);
                await recurse(rows[i].email);
            }
        }
    }
    if(role.permission == CONFIG.USERS.superadmin){
       data = await BASECON.Bfind(adminUser,{isdelete : false});
    }else{
        await recurse(role.email);
    }

    var news = [];

    for(var i in data){
        if(data[i].permission === CONFIG.USERS.player){
            let row=Object.assign({},data[i]._doc);
            row['playerid'] = BASECON.getPlayerBalanceCal(row['playerid'])
            news.push(row);
        }
    }

    news.sort(function(news,b){
        return new Date(b.date) - new Date(news.date)
    })
    return news;
}


exports.get_users_items_users = async(role) =>{                 ///////////////-----------------get user items
    var data = [];
    async function recurse(email){
        var rows = await BASECON.Bfind(adminUser,{isdelete : false,created : email, permission : {$ne : CONFIG.USERS.player }});
        // data = rows;
        // return;
        if(rows.length == 0) {
            return;
        } else {
            for(var i = 0 ; i < rows.length ; i++){
                data.push(rows[i]);
                await recurse(rows[i].email);
            }
        }
    }
    if(role.permission == CONFIG.USERS.superadmin){
       data = await BASECON.Bfind(adminUser,{isdelete : false, permission : {$ne : CONFIG.USERS.player }});
    }else{
        await recurse(role.email);
    }
    
    
    return data;
}

exports.get_users_items_block = async(role) =>{                 ///////////////-----------------get user items
    var data = [];
    async function recurse(email){
        var rows = await BASECON.Bfind(adminUser,{status : CONFIG.USERS.status.block });
        // data = rows;
        // return;
        if(rows.length == 0) {
            return;
        } else {
            for(var i = 0 ; i < rows.length ; i++){
                data.push(rows[i]);
                await recurse(rows[i].email);
            }
        }
    }
    if(role.permission == CONFIG.USERS.superadmin){
       data = await BASECON.Bfind(adminUser,{status : CONFIG.USERS.status.block});
    }else{
        await recurse(role.email);
    }
  
    return data;
}

exports.get_users_for_permission = async(role,start,end) =>{                 ///////////////-----------------get user items
    var data = [];
    async function recurse(email){
        var rows = await BASECON.Bfind(adminUser,{ $and: [ { "date": { $gte: start } }, { "date": { $lte: end } }, { "permission": CONFIG.USERS.player },{isdelete : false},{created : email} ] });
        // data = rows;
        // return;
        if(rows.length == 0) {
            return;
        } else {
            for(var i = 0 ; i < rows.length ; i++){
                data.push(rows[i]);
                await recurse(rows[i].email);
            }
        }
    }

    if(role.permission == CONFIG.USERS.superadmin){
       data = await BASECON.Bfind(adminUser,{ $and: [ { "date": { $gte: start } }, { "date": { $lte: end } },{isdelete : false}, { "permission": CONFIG.USERS.player }]});
    }else{
        await recurse(role.email);
    }
    
    return data;
}


exports.get_users_load = async (req,res,next) => {
    var role = BASECON.getUserItem(req)
    var userslist = await this.get_users_items_users(role);
    var data = await this.roles_get_fact(role);
    if(!userslist){
        res.json({
            status : false,
            data: 'failture'
        });
        return next();
    }else{
        res.json({
            status : true,
            data : userslist,roledata : data
        });
        return next();
    }
}


exports.get_users_load_block = async (req,res,next) => {
    var role = BASECON.getUserItem(req)
    var userslist = await this.get_users_items_block(role);
    var data = await this.roles_get_fact(role);
    if(!userslist){
        res.json({
            status : false,
            data: 'failture'
        });
        return next();
    }else{
        res.json({
            status : true,
            data : userslist,roledata : data
        });
        return next();
    }
}

exports.adminRegisterByuser = async (req,res,next) =>{

   
    try{
        let adminmail = req.user;
        delete req.body.user._id;
        let homeConfig = req.homeConfig
        let user = req.body.user;
        user['isdelete'] = false;

        if ( user.permission != homeConfig.USERS.supermaster && adminmail.permission == homeConfig.USERS.superadmin && user.permission != homeConfig.USERS.superadmin ) {
            if (user.signup_device == homeConfig.website) {
                user['created'] = homeConfig.USERS.webmail;
            } else {
                user['created'] = homeConfig.USERS.appmail;
            }
        } else {
            user['created'] = adminmail.email;
        }
        
        register_action(user,async(rdata)=>{
            if(rdata.status){
                this.get_users_load(req,res,next);
            }else{
                res.json(rdata);
                return next();
            }
        });

    }catch(e){
        res.send({status : false , data : "error"});
        return next();
    }
}

exports.get_rolesfrom_per = async (req,res,next) =>{
    var role = await BASECON.getUserItem(req)
    var data = await this.roles_get_fact(role);
    if(data){
        res.json({status : true,data : data});
        return next();
    }else{
        res.json({status : false,data : "false"});
        return next();
    }
}

exports.roles_get_fact = async(role) =>{
    var data = [];
    async function recurse(id){
        var rows = await BASECON.Bfind(permission_model,{pid : id});
        // data = rows;
        // return;
        if(rows.length == 0) {
            return;
        } else {
            for(var i = 0 ; i < rows.length ; i++){
                data.push(rows[i]);
                await recurse(rows[i].id);
            }
        }
    }
    if(role.permission == CONFIG.USERS.superadmin){
        data = await BASECON.Bfind(permission_model,);
    }else{
        await recurse(role.permission);
    }
    return data;
}
/////////////////-------------role manger- cms


exports.adminsidebar_load = async (req,res,next) =>{
    var role = req.user.permission;
    var condition = {};
    condition["roles."+role] = true;
    condition['status'] = true;
    var rdata = await BASECON.BSortfind(sidebarmodel,condition,{order : 1});
    if(rdata){
        var newrow =  this.list_to_tree(rdata)
        res.json({status : true,data : newrow,array : rdata});
        return next();
    }else{
        res.json({status : false,data : []});
        return next();
    }
}

exports.userdetail_save = async(req,res,next)=>{
    var user = req.body.user;

    let row = {
        firstname : user.firstname,
        lastname : user.lastname,
        mobilenumber : user.mobilenumber
    }
    var rdata = await BASECON.BfindOneAndUpdate(adminUser,{email : user.email},row);
    if(rdata){
        res.json({
            status : true,
            data : rdata
        })
    }else{
        res.json({
            status : false,
            data : "Email not found"
        })
        return next();
    }
}

exports.adminuserupdateByuser = async (req,res,next)=>{

    
    var indata = req.body.newinfor;
    if( !indata.email || !indata.username || !indata.password && !indata.firstname && !indata.lastname && !indata.status){
        res.send({status : false,data : "please provide vallid data."});
        return next();
    }

    var row = Object.assign({},{firstname : indata.firstname},{lastname : indata.lastname});
    delete indata.created;
    delete indata.email;
    delete indata.username;

    var rdata1 = await GamePlay.findOneAndUpdate({id : indata._id},row);
    var rdata = await adminUser.findOneAndUpdate({_id : indata._id},indata);
    if(rdata1 && rdata){
        this.get_users_load(req,res,next);
        return;
    }else{
        res.json({ status : false, data: 'failture' });
        return next();
    }
}

exports.adminresetpassword = async (req,res,next)=>{


    var user =  req.body.user;
    if(!user.password || !user.email){
        res.json({ status : false, data: 'failture' });
        return next();
    }        
    var item = await BASECON.BfindOne(adminUser,{email : user.email});
    var password =  item.generateHash(user.password);    
    var rdata = await BASECON.BfindOneAndUpdate(adminUser,{email : user.email},{password : password});
    if(!rdata){
        res.json({ status : false, data: 'failture' });
        return next();
    }else{
        res.json({ status : true });
        return next();   
    }
}

exports.adminmultiusersblock = async (req,res,next)=>{
    
    var users =  req.body.users;
    for (var i in users){
        await BASECON.BfindOneAndUpdate(adminUser,{_id : users[i]._id},{status : CONFIG.USERS.status.block })
    }
    this.get_users_load(req,res,next);
}

exports.adminmultiusersdelete = async (req,res,next)=>{
    
    var users =  req.body.users;
    for (var i in users){
        await BASECON.BfindOneAndUpdate(adminUser,{_id : users[i]._id},{isdelete : true })
    }
    this.get_users_load(req,res,next);
}

exports.PlayerRegisterByadmin = async(req,res,next)=>{

    try{
        let adminmail = req.user;
        delete req.body.user._id;
        let homeConfig = req.homeConfig
        let user = req.body.user;
        user['permission'] = homeConfig.USERS.player;
        user['status'] = homeConfig.USERS.status.allow;
        user['isdelete'] = false;
        if (adminmail.permission == homeConfig.USERS.superadmin) {
            if (user.signup_device == homeConfig.website) {
                user['created'] = homeConfig.USERS.webmail;
            } else {
                user['created'] = homeConfig.USERS.appmail;
            }
        } else {
            user['created'] = adminmail.email;
        }
        
        register_action(user,async(rdata)=>{
            if(rdata.status){
                PlayersController.players_load(req,res,next);
            }else{
                res.json(rdata);
                return next();
            }
        });

    }catch(e){
        res.send({status : false , data : "error"});
        return next();
    }
}


exports.users_depositaction = async(req,res,next) =>{
    let ressult =  await PlayersController.deposit_func(req);
    if(ressult.status){
         this.get_users_load(req,res,next);
        return
    }else{
        res.json({ status : false,data : ressult.data});
        return next();
    }
}

exports.users_withdrawlaction = async(req,res,next) =>{
    let ressult =  await PlayersController.withdrawlfunc(req);
    if(ressult.status){
         this.get_users_load(req,res,next);
        return
    }else{
        res.json({ status : false,data : ressult.data});
        return next();
    }
}

exports.decrypt_auth = (req,res,next) =>{
    try{
        let data = req.body.auth;
        let decypstr = JSON.parse(BASECON.decrypt(data));
        res.json({ status :true,data :  decypstr});
        return next();
    }catch(e){
        res.status(404,{msg : "BAD request"})
        return next();
    }
}

exports.getip = (req,res,next) =>{

    var forwarded = req.headers['x-forwarded-for'];
    var ips = forwarded ? forwarded.split(/, /)[0] : req.connection.remoteAddress;
    var ip = ips && ips.length > 0 && ips.indexOf(",") ? ips.split(",")[0] : null;    
    res.json({ip:ip});
}


// function xpg_register(username,callback){
//     var serverurl = PROCONFIG.xpg.serverurl + "createAccount";
//     var password = BASECON.md5convert(username);
//     var privatekey = PROCONFIG.xpg.passkey;
//     var operatorId = PROCONFIG.xpg.operatorid;
//     var headers = {'Content-Type': 'application/x-www-form-urlencoded'};// method: 'POST', 'cache-control': 'no-cache', 
//     var acpara = {operatorId : operatorId, username : username,userPassword : password,}
//     var accessPassword = BASECON.get_accessPassword(privatekey,acpara);
//     var  parameter = {accessPassword : accessPassword,operatorId : operatorId,username : username,userPassword : password}        
//     request.post(serverurl,{ form : parameter, headers: headers, },async (err, httpResponse, body)=>{
//         if (err) {
//             callback({status : false});
//         }else{
//             var xml =parse(body);
//             var xmld = xml.root;
//             var errorcode = xmld['children'][0]['content'];
//             switch(errorcode){
//                 case "0" :
//                     callback(true)
//                     break;
//                 default :
//                     callback({status : false});
//                 break;
//             }
//         }
//     });
// }



            // xpg_register(user.username,async(creathandle)=>{
            //     if(!creathandle){
            //         callback ({ status : false, data : "This nickname have already registered." })
            //     }else{
                    // signup_subscribe(userdata,async(sdata)=>{
                        // if(!sdata){
                        //     callback ({ status : false, data : "server error" });
                        // }else{
                            // var id =  ObjectId(hex(BASECON.get_timestamp()+"").slice(0,24));
                            // var iddata =await get_max_id();
                            // var userid = iddata.id;
                            // var pid  = iddata.pid;
                            // var register = userdata;
                            // register['password'] = password;
                            // register['_id'] = id;
                            // register['id'] = userid;
                            // register['signup_device'] = device;

                            // var playerregister = {
                            //     username : userdata.username,
                            //     id : id,
                            //     email : userdata.email,
                            //     firstname : userdata.firstname,
                            //     lastname : userdata.lastname,
                            //     pid : pid   
                            // }
                            // var user =await BASECON.data_save(register,adminUser);
                            // if(!user){
                            //     callback ({ status : false, data : "server error" })
                            // }else{
                            //     var playerhandle = await BASECON.data_save(playerregister,GamePlay);
                            //     if(playerhandle){
                            //         callback ({ status : true,data : "success"})
                            //     }else{
                            //         callback ({ status : false,data : "server error"})
                            //     }
                            // }
                        // }
                    // })
            //     }
            // })

            
// exports.get_location = (req,res,next)=>{

//     var forwarded = req.headers['x-forwarded-for']
//     var ips = forwarded ? forwarded.split(/, /)[0] : req.connection.remoteAddress;
//     var ip = ips && ips.length > 0 && ips.indexOf(",") ? ips.split(",")[0] : null;    
//     var key = CONFIG.iplocation.key;
//     var options = {
//         'method': 'GET',
//         'url': CONFIG.iplocation.url+'ip='+ip+'&key='+key+'&package='+CONFIG.iplocation.package,
//         'headers': {}
//     };
//     request(options, function (error, response) {
//         if (error)
//         {
//             res.json({
//                 status : false,
//             })
//         }else{
//             var location = JSON.parse(response.body);
//             location['ip'] = ip;
//             res.json({
//                 status : true,
//                 data : location
//             })
//             return next();
//         }
//     });
//     return;
// }



// async function jwt_regiser(userinfor,req,res,callback){


//     var forwarded = req.headers['x-forwarded-for'];
//     var ips = forwarded ? forwarded.split(/, /)[0] : req.connection.remoteAddress;
//     var ip = ips && ips.length > 0 && ips.indexOf(",") ? ips.split(",")[0] : null;    

//     var date = (new Date()).valueOf()+'';
//     var token = BASECON.md5convert(date);
//     const payload = {
//         username: userinfor.username,
//         firstname : userinfor.firstname,
//         lastname : userinfor.lastname,
//         fullname : userinfor.fullname,
//         email : userinfor.email,
//         password : userinfor.password,
//         _id : userinfor._id,
//         currency : userinfor.currency,
//         intimestamp :date,
//         token : token,
//         role : userinfor.permission
//     }

//     var auth = BASECON.encrypt(JSON.stringify(payload));
//     await BASECON.data_save({email:userinfor.email,ip : ip},totalusermodel);
//     callback({
//         status : true,
//         token : auth,
//         data : payload,
//         detail : userinfor
//     });
// }

//////////////---------------email verify ------------------------////////////////////////////
async function signup_subscribe(user,callback){

    var domain = DB.homedomain;
    var data = {
        email : user.email,
        init : new Date().valueOf(),
    }

    let sconfig = await firstpagesetting.findOne({type : KEYS.SendyConfig});
    if (sconfig) {
        const sendy = new Sendy(sconfig.content.apiurl, sconfig.content.apikey);
        var verifyCode = CryptoJS.AES.encrypt(JSON.stringify(data), CONFIG.USERS.secret_key).toString();
        let row = {
            order_no : data.init,
            content : verifyCode,
            date : new Date(new Date().valueOf() + 24 * 60 * 60 * 1000)

        }
        let sh = await BASECON.data_save(row,PaymoroSubmitData);
        if (sh) {
            var verifyString = '<a href="' + domain + "/emailverify?code=" + sh._id + '"  target="_blank"><span>Confirm</span> </a>';
            sendy.subscribe({email: user.email, list_id: sconfig.content.list_id,api_key : sconfig.content.apikey,name :user.username,verify : verifyString}, function(err, result){
                if(err){
                    callback(false,err);
                }else{
                    callback(true,result);
                }
            });
        } else {
            callback(false);
        }

    } else {
        callback(false);
    }

};

async function forgotPassword_sendmail(user,callback){

    var domain = DB.homedomain;
    var data = {
        email : user.email,
        init : new Date().valueOf(),
    }

    let sconfig = await firstpagesetting.findOne({type : KEYS.SendyConfig});
    if (sconfig) {
        const sendy = new Sendy(sconfig.content.apiurl, sconfig.content.apikey);
        var verifyCode = CryptoJS.AES.encrypt(JSON.stringify(data), CONFIG.USERS.secret_key).toString();
        let row = {
            order_no : data.init,
            content : verifyCode,
            email : data.email,
            date : new Date(new Date().valueOf() + 24 * 60 * 60 * 1000)
        }
        let sh = await BASECON.data_save(row,PaymoroSubmitData);
        if (sh) {
            var verifyString = '<a href="' + domain + "/forgotpasswordverify?code=" + sh._id + '"  target="_blank"><span>Confirm</span> </a>';
            sendy.subscribe({email: user.email, list_id: sconfig.content.list_id1,api_key : sconfig.content.apikey,name :user.username,forgotemailverify : verifyString,link :  domain + "/forgotpasswordverify?code=" + sh._id }, function(err, result){
                if(err){
                    callback(false,err);
                }else{
                    callback(true,result);
                }
            });
        } else {
            callback(false);
        }
    } else {
        callback(false);
    }
};

function unsubscribe(user,listid,callback){

  var params = {
    email: user.email,
    list_id: listid
  }
 
  sendy.unsubscribe(params, function(err, result) {

    if (err){
      callback(false,err)
    }else{
      callback(true,result)
    }
  })
}

exports.emailverify_receive_action =  async (req,res,next)=>{
    var data = req.body.data;
    var data = req.body.data;
    let item = await PaymoroSubmitData.findOneAndDelete({_id : mongoose.Types.ObjectId(data)});
    if (item) {
        try{
            var bytes  = CryptoJS.AES.decrypt( item.content ,  CONFIG.USERS.secret_key);
            var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
            var fuserdata = await BASECON.BfindOne(adminUser,{email : decryptedData.email});
            if(!fuserdata){
                res.json({status : false,data : "server error"});
            }else{
                var rdata = await adminUser.findOneAndUpdate({email : decryptedData.email},{emailverify : true});
                if(rdata){
                    res.json({status: true,data : "success"})               
                }else{
                    res.json({status: false,data : "server error"})
                    return next()            
                }
            }
        }catch(e){
            res.json({status: false,data : "server error"})
            return next()
        }
    } else {
        res.json({status: false,data : "server error"})
        return next()
    }

}

exports.getSessionsports = async (req,res,next) => {
    let id = req.body.id;
    // try{
        var user = await BASECON.BfindOne(adminUser,{_id : mongoose.Types.ObjectId(id)});
        if (user) {
            let row = {
                order_no :  BASECON.md5convert(new Date().valueOf().toString()),
                content : user.email,
                date : new Date(new Date().valueOf() + 24 * 60 * 60 * 1000)
            }
            
            let sh = await BASECON.data_save(row,PaymoroSubmitData);
            if (sh) {
                let url = DB.homedomain + "/sports?token=" + row.order_no;
                res.json({status : true,data : url});
                return next();
            } else {
                res.json({status : false,data : "fail"});
                return next();                
            }
        } else {
            res.json({status : false,data : "fail"});
            return next();
        }
    // }catch(e){
    //     res.json({status : false,data : "fail"});
    //     return next();
    // }
}

exports.getSessionSatta = async (req,res,next) => {
    let id = req.body.id;
    // try{
        var user = await BASECON.BfindOne(adminUser,{_id : mongoose.Types.ObjectId(id)});
        if (user) {
            let row = {
                order_no :  BASECON.md5convert(new Date().valueOf().toString()),
                content : user.email,
                date : new Date(new Date().valueOf() + 24 * 60 * 60 * 1000)
            }
            
            let sh = await BASECON.data_save(row,PaymoroSubmitData);
            if (sh) {
                let url = DB.homedomain + "/Satta/pages?token=" + row.order_no;
                res.json({status : true,data : url});
                return next();
            } else {
                res.json({status : false,data : "fail"});
                return next();                
            }
        } else {
            res.json({status : false,data : "fail"});
            return next();
        }
    // }catch(e){
    //     res.json({status : false,data : "fail"});
    //     return next();
    // }
}

exports.forgotpassword_receive_action = async (req,res,next)=>{

    var data = req.body.data;
    let item = await PaymoroSubmitData.findOne({_id : mongoose.Types.ObjectId(data)});
    if (item) {
        try{
            var bytes  = CryptoJS.AES.decrypt(item.content,  CONFIG.USERS.secret_key);
            var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
            var fuserdata = await BASECON.BfindOne(adminUser,{email : decryptedData.email});
            if(fuserdata){
                res.json({status : true,data :fuserdata.email });
                return next();
            }else{
                res.json({status : false,data : "fail"});
                return next();
            }
        }catch(e){
            res.json({status: false,data : "server error"})
            return next()
        }
    } else {
        res.json({status: false,data : "server error"})
        return next()
    }
}

exports.forgotpassword_send_action = async(req,res,next)=>{
    
    var data = req.body.email;
    var fdata = await BASECON.BfindOne(adminUser,{email : data});
    if (fdata) {

        let isexit = await PaymoroSubmitData.findOne({email : data});
        if (isexit) {
            res.json({status: false, data : "You have already sent"});
            return next();
        } else {
            forgotPassword_sendmail(fdata,(rdata)=>{
                if(rdata){
                    res.json({status: true});
                    return next();
                }else{
                    res.json({status: false, data : "We are sorry. it bounced email address."});
                    return next();
                }
            })
        }
    } else {
        res.json({status: false,data : "we are sorry. we can't find this email"});
        return next();
    }
}

exports.forgotpassword_set_action = async (req,res,next) =>{
    var data = req.body.data;
    var fdata = await BASECON.BfindOne(adminUser,{email : data.email});
    if(fdata){

        fdata.password = fdata.generateHash(data.password);
        let up = await adminUser.findOneAndUpdate({email : fdata.email}, fdata);
        if (up) {
            res.json({status : true,data : up});
            return next()             
        } else {
            res.json({status : false,data : "server error"})
            return next();
        }
    }else{
        res.json({status : false,data : "server error"})
        return next();
    }
}

exports.resend_email_action = async(req,res,next)=>{
    
    var email = req.body.email;
    var userdata = await BASECON.BfindOne(adminUser,{email : email});
    if(userdata){
        // const userdata = {
        //     email : "burkodegor@gmail.com",
        //     username : "igamez zhen"
        // }
        signup_subscribe(userdata,(rdata,error) => {
            if (rdata) {
                res.send({status: true});
            } else {
                res.send({status: false});
            }
        })

    } else {
        res.json({status : false,data : "server error"})
        return next();
    }

}

exports.telegramGetSupportChat = async (req,res,next) => {
    

    console.log(req.user)
    if (req.user && req.user.playerid && parseInt(req.user.playerid.balance) > 0) {

        let  d1 = await firstpagesetting.findOne({type : "LiveChatSetting"});
        console.log(d1)
        if (d1) {
            if (d1.content.status) {
                res.send({status : true , data : d1.content.directsrc});
                return next();                
            } else {
                res.send({status : false , data : ""});
                return next();                
            }
        } else {
            res.send({status : false , data : ""});
            return next();
        }
    } else {
        res.send({status : false , data : ""});
        return next();
    }
}