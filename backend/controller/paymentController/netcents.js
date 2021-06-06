const request = require("request")
const BASECON = require("../basecontroller")
const { Paymentconfig, TransactionsHistory } = require("../../models/paymentGateWayModel")

exports.netcentsResults = async(req,res,next)=>{
    var order_no = req.body.order_no
    await TransactionsHistory.findOne({ order_no : order_no, type:'netcents' }).then(rdata =>{
        if(!rdata){
            res.json({ status : false, data: 'fail' })
            return next()
        }else{  
            res.json({ status : true, data : rdata })
            return next()
        }
    })
}

exports.netcentCheckOut = async(req,res,next)=>{
    var inputdata = req.body.data

    await Paymentconfig.findOne({ type : inputdata.type }).then(async rdata =>{
        if(!rdata){
            res.json({ status : false, data: 'fail' })
            return next()
        }else if(!rdata.state){
            res.json({ status : false, data: inputdata.type+' has been disabled.' })
            return next()
        }
        else{
            const hosted_payment_id = rdata.configData.pluginid
            const netcents_apikey = rdata.configData.apikey
            const netcents_apisecret = rdata.configData.apisecret
            var Authorization = BASECON.cv_ebase64(netcents_apikey+":"+netcents_apisecret)
            var external_id = (new Date()).valueOf() 
            var formdata = {
                external_id : external_id,
                hosted_payment_id : hosted_payment_id,
                amount : inputdata.amount,
                email : inputdata.email,
                first_name : inputdata.first_name,
                last_name : inputdata.last_name
            }
            var options = {
                'method': 'POST',
                'url': rdata.configData.request_url1,
                'headers': {
                    'Accept': 'application/json',
                    'Authorization': 'Basic '+ Authorization,
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Cookie': 'ahoy_visitor=1860d533-36e8-4765-8608-aeda30884572 ahoy_track=true'
                },
                form:formdata
            }
            request.post(options, async function (error, response) {
                if (error){
                    res.json({status : false})
                    return next()
                }else{
                    var transactiondata = {
                        type: inputdata.type,
                        email : inputdata.email,
                        order_no : external_id,
                        status : 'deposit',
                        requestData : inputdata,
                        amount : inputdata.amount
                    }
                    var savehandle = await BASECON.data_save(transactiondata, TransactionsHistory)
                    if(!savehandle){
                        res.json({status : false,data : "fail"})
                        return next()
                    }else{
                        var outdata = JSON.parse(response.body)
                        res.json({status : true,
                        data : rdata.configData.request_url2+outdata.token})
                        return next()
                    }
                }           
            })
            return
        }
    })
} 

exports.netcents_cancel = async(req,res,next)=>{
    var params = req.body
}

exports.netcents_webhook = async(req,res,next)=>{
    var params = req.body
    var jsonstring = BASECON.cv_dbase64(params['data'])
    var outdata = JSON.parse(jsonstring)
    await TransactionsHistory.updateOne({ order_no : outdata.external_id}, {resultData:outdata} ).then( data => {
        if(!data){
            res.status(500)
            return next()
        }else{
            res.status(200)
            return next()
        }
    })
    return next()  
}

exports.netcentsPayout = async(req,res,next)=>{
    var data = req.body
    res.json({status : true,data : data})
    return next()
}