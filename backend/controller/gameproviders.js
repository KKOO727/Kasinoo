const BASECONTROL = require("./basecontroller");
const PROVIDERMODELS = require("../models/games_model").PROVIDERMODELS;
const ReportsControll =require("./reportcontroller")

exports.providerload =  async(req,res,next)=>{
    
    let params = req.body.params;
    let filters = req.body.filters;

    if (params && filters) {

        let array = [];
        var pages = {};
        let andquery = {};
        let bool = filters.bool;
        if (bool && bool.length > 0) {
            andquery["bool." + bool] = true;
        }
        let totalcount = await PROVIDERMODELS.countDocuments(andquery);
        if (totalcount > 0) {
            pages = ReportsControll.setpage(params,totalcount);
            array = await PROVIDERMODELS.find(andquery).sort({order : 1}).limit(pages.params.perPage).skip(pages.skip);
        }
        pages["skip2"] = (pages.skip) + array.length;
        res.send({
            status : true ,data:array, 
            pageset : pages,
        });
        return next();

    } else {
        res.json({ status : false,data : "fail" })
        return next();
    }
}

exports.providersave = async(req,res,next)=>{
    var sdata = req.body.row;
    if (sdata) {
        var savehandle = await BASECONTROL.data_save(sdata,PROVIDERMODELS);
        if(!savehandle){
            res.json({ status : false,data : "fail" })
            return next();
        }else{
            this.providerload(req,res,next);
        }
    } else {
        res.json({ status : false,data : "fail" })
        return next();
    }
}

exports.providerupdate  = async(req,res,next)=>{
    var indata = req.body.row;
    if (indata) {
        for(var i = 0 ; i < indata.length ; i++)
        {
            var updatehandle =  await BASECONTROL.BfindOneAndUpdate(PROVIDERMODELS,{_id : indata[i]._id},indata[i]);
            if(!updatehandle){
                res.json({status : false,data : "fail"});
                return next();
            }
        }
        this.providerload(req,res,next);
    } else {
        res.json({status : false,data : "fail"});
        return next();
    }
}

exports.providerdelete  = async(req,res,next)=>{
    if (row) {
        var indata = req.body.row;
        var outdata = await PROVIDERMODELS.findOneAndDelete({_id : indata._id});
        if (!outdata) {
            res.json({status : false,data : "fail"})
            return next();
        } else {
            this.providerload(req,res,next);
        }
    } else {
        res.json({status : false,data : "fail"});
        return next();
    }
}
