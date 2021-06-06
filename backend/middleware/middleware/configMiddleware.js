const ConfigModel = require("../../models/settings_model").Configuration;
const hconfigkey = "homeconfig";
const typeconfig = "typeconfig";
const paymentconfig = "paymentconfig";
const sportsconfig = "sportsconfig";
const sattaconfig = "sattaconfig"
const BASECON = require("../../controller/basecontroller");
const {TypeModel} = require("../../models/settings_model");

const config = {
    
    homeconfig: async (req, res, next)=> {
        let homeConfig = await BASECON.BfindOne(ConfigModel,{key : hconfigkey});
        if (homeConfig) {
            req.homeConfig = homeConfig.value;
            next();
        } else {
            let error = "server error";
            res.json({status : false,data : error});
        }
    },
    typeconfig: async (req, res, next)=> {

        let dd = await TypeModel.aggregate([
            {
                $sort : {
                    order : 1
                }
            },
            {
                $group : {
                    "_id" : "$type",
                    "types" : {
                        "$push" : {
                            text : "$text"
                        }
                    }
                }
            },
        ]);
        let array = {
            keylaunchurl_type : {}
        };
        for (let i in dd) {
            let rows = [];
            for (let j in dd[i]['types']) {
                rows.push(dd[i]['types'][j]['text']);
            }
            array['keylaunchurl_type'][dd[i]['_id']] = rows;
        }
        req.tconfig = array;
        next();
    },
    paymentconfig: async (req, res, next)=> {
        let tconfig = await BASECON.BfindOne(ConfigModel,{key : paymentconfig});
        if (tconfig) {
            req.pconfig = tconfig.value;
            next();
        } else {
            let error = "server error";
            res.json({status : false,data : error});
        }
    },
    sportsconfig: async (req, res, next)=> {
        let tconfig = await BASECON.BfindOne(ConfigModel,{key : sportsconfig});
        if (tconfig) {
            req.sconfig = tconfig.value;
            next();
        } else {
            let error = "server error";
            res.json({status : false,data : error});
        }
    },
    sattaconfig: async (req, res, next)=> {
        let tconfig = await BASECON.BfindOne(ConfigModel,{key : sattaconfig});
        if (tconfig) {
            req.sattaconfig = tconfig.value;
            next();
        } else {
            let error = "server error";
            res.json({status : false,data : error});
        }
    },
}

module.exports = config;
