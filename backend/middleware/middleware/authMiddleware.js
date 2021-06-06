const {adminUser,usersessionmodel,sessionmodel} = require("../../models/users_model");
const BASECONTROL = require("../../controller/basecontroller");
const Config = require("../../config/index.json");
const mongoose = require("mongoose")
const {firstpagesetting} = require("../../models/firstpage_model")

const auth = {
    
    // checks if the user is logged in, if not, redirect to the 
    // unauthorized route
    isLoggedIn: async (req, res, next)=> {
        // try{
            console.log(req.body)
            let userdevice = req.headers["user-device"];
            console.log(userdevice)
            if ( userdevice == "telegram") {
                let email = req.headers["user-id"];
                let user = await BASECONTROL.BfindOne(adminUser,{email : email});
                if (user) {

                    console.log(user.status)
                    if (user && user.status === "allow") {
                        req.user = user;
                        if (req.body.telegram ) {
                            let data = JSON.parse(req.body.telegram);
                            req.body = data;
                        }
    
                        next();

                    } else {
                        return res.json({session : true });

                    }

                } else {

                    return res.json({session : true });

                }
            } else {

                var hash = decodeURIComponent(req.headers.authorization);
                var decod = BASECONTROL.decrypt(hash);
                if(decod){

                    decod = JSON.parse(decod);
                    let user = await BASECONTROL.BfindOne(adminUser,{_id : decod._id});
                    
                    let times = 1000 * 900;
                    let Expires = await firstpagesetting.findOne({type : "SessionExpiresSetting"});
                    if (Expires) {
                        times =  parseInt(Expires.content.UserSession) * 1000;
                    }

                    if(user && user.status === "allow"){

                        req.user = user;
                        let email = user.email;
                        let last = await BASECONTROL.BfindOne(usersessionmodel,{email : email});
                        let socket = await sessionmodel.findOne({email : user.email});

                        if(last){

                            let nowtime = new Date().getTime();
                            let lasttime =  new Date(last.inittime).getTime();
                            console.log(nowtime)
                            console.log(lasttime)
                            // if ( nowtime > lasttime ) {
                                    // await BASECONTROL.BfindOneAndDelete(usersessionmodel,{email:email});
                                    // return res.json({session : true});
                                    // } else {
                            // }
                               

                            let inittime = new Date(new Date().valueOf() + times)
                            let row = {
                                inittime: inittime
                            }
                            if (socket) {
                                row['socketuser'] = mongoose.Types.ObjectId(socket._id)
                            }                                
                            let up =  await BASECONTROL.BfindOneAndUpdate(usersessionmodel,{email:email},row);
                        } else {

                            let ip = BASECONTROL.get_ipaddress(req);
                            let inittime = new Date(new Date().valueOf() + times);

                            let row = {
                                inittime: inittime,
                                email :email,
                                id : mongoose.Types.ObjectId(user._id),
                                ip : ip,
                            }
                            if (socket) {
                                row['socketuser'] = mongoose.Types.ObjectId(socket._id)
                            }
                            let upd =  await BASECONTROL.BfindOneAndUpdate(usersessionmodel,{email : email},row);
                        }
                        next();
                    } else {

                        return res.json({session : true});
                    }
                } else {
                    return res.json({session : true});
                }
            }
        // } catch(e) {
        //     return res.json({session : true});
        // }
    },
    isLoggedInMobile: async (req, res, next)=> {

        try{
            var hash = req.body.token;
            var decod = BASECONTROL.decrypt(hash);
            if (decod) {
                decod = JSON.parse(decod);
                let user = await BASECONTROL.BfindOne(adminUser,{_id : decod._id});
                if (user && user.status === "allow") {
                    console.log(decod)
                    let socket = await sessionmodel.findOne({email : user.email});
                    let times = 1000 * 900;
                    let Expires = await firstpagesetting.findOne({type : "SessionExpiresSetting"});
                    if (Expires) {
                        times =  parseInt(Expires.content.UserSession) * 1000;
                    }
                    req.user = user;
                    let email = user.email;
                    let ip = BASECONTROL.get_ipaddress(req);
                    let inittime = new Date(new Date().valueOf() + times);
                    let row = {
                        inittime : inittime,
                        email :email,
                        id : mongoose.Types.ObjectId(user._id),
                        ip : ip,
                    }
                    if (socket) {
                        row['socketuser'] = mongoose.Types.ObjectId(socket._id)
                    }

                    let upd =  await BASECONTROL.BfindOneAndUpdate(usersessionmodel,{email : email},row);
                    return res.json({status : true,data: user});
                    // return next();
                    // next();
                } else {
                    return res.json({session : true});
                }
            }else{
                return res.json({session : true});
            }
        }catch(e){
            return res.json({session : true});
        }
    },
    // middleware function to log out the user
    logoutUser: async (req, res, next)=> {
        console.log('logged out successfully');
        var hash = decodeURIComponent(req.headers.authorization);
        await BASECONTROL.BfindOneAndDelete(usersessionmodel,{hash : hash});

        var decod = BASECONTROL.decrypt(hash);
        if (decod) {
            decod = JSON.parse(decod);
            await BASECONTROL.BfindOneAndDelete(sessionmodel,{id : decod._id})
        }
        return res.json({status :  true,session : true});
        // next();
    },

}

module.exports = auth;
