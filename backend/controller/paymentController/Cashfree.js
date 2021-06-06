const BASECON = require("../basecontroller")
const { BalanceUpdate } = require("./init")
const { Paymentconfig, TransactionsHistory } = require("../../models/paymentGateWayModel")
var enums = require('./Cashfreehelpers/enums')
const formatData = require('./Cashfreehelpers/formatData')
var signatureVerification = require('./Cashfreehelpers/signatureCreation')

exports.CashfreeSecretKey = async(req,res,next)=>{
    var data = req.body
    await Paymentconfig.findOne({ type : data.type }).then(async rdata =>{
        if(!rdata){
            res.json({ status : false, data: 'fail' })
            return next()
        }else if(!rdata.state){
            res.json({ status : false, data: data.type+' has been disabled.' })
            return next()
        }
        else{
            var secretKey = rdata.configData.secretKey
            var appId = rdata.configData.appId
            var request_url = rdata.configData.request_url
            var signData = Object.assign({}, data)
            delete signData["first_name"]
            delete signData["last_name"]
            delete signData["email"]
            delete signData["type"]
            signData.appId = appId
            signData.returnUrl = ""
            signData.notifyUrl = ""
            signData.orderId = 'CashfreeDeposit-'+(new Date()).getTime()
            signData.paymentToken = signatureVerification.signatureRequest2(signData, secretKey)
            var transactiondata = {
                type : req.body.type,
                email : req.body.email,
                order_no : signData.orderId,
                status : 'deposit',
                requestData : signData,
                amount : req.body.orderAmount
            }
            var savehandle = await BASECON.data_save(transactiondata, TransactionsHistory)
            if(!savehandle){
                res.json({status : false,data : "fail"})
                return next()
            }else{
                res.json({ status : true, data : signData, request_url: request_url})
                return next()
            }
        }
    })
}

exports.CashfreeCheckOut = async(req,res,next)=>{
    // try{
        var data = req.body
        await Paymentconfig.findOne({ type : data.type }).then(async rdata =>{
            if(!rdata){
                res.json({ status : false, data: 'fail' })
                return next()
            }else if(!rdata.state){
                res.json({ status : false, data: data.type+' has been disabled.' })
                return next()
            }
            else{
                var secretKey = rdata.configData.secretKey
                var request_url = rdata.configData.request_url

                data.orderId = 'CashfreeDeposit-'+(new Date()).getTime()
                data.appId = rdata.configData.appId
                data.returnUrl = rdata.configData.success_url
                data.notifyUrl = ''
                var signData = Object.assign({}, data)
                delete signData["first_name"]
                delete signData["last_name"]
                delete signData["email"]
                delete signData["type"]
                formatData.formatSeamlessPro(data.paymentOption, signData)
                signData.signature = signatureVerification.signatureRequest1(signData, secretKey)

                var transactiondata = {
                    type : req.body.type,
                    email : req.body.email,
                    order_no : data.orderId,
                    status : 'deposit',
                    requestData : signData,
                    amount : req.body.orderAmount
                }

                var savehandle = await BASECON.data_save(transactiondata, TransactionsHistory)
                if(!savehandle){
                    res.json({status : false,data : "fail"})
                    return next()
                }else{
                    res.json({ status : true, data : signData, request_url: request_url})
                    return next()
                }
            }
        })
    // }catch(err){
    //     return res.status(500).send({
    //         status:"error",
    //         error: err.name,
    //         message: err.message,
    //     })
    // }
}

exports.CashfreeResponse = async(req,res,next)=>{
    const txnTypes = enums.transactionStatusEnum
    // try{
    await Paymentconfig.findOne({ type : 'Cashfree' }).then(async rdata =>{
        switch(req.body.txStatus){
            case txnTypes.cancelled: {
                return res.status(200).render('result',{data:{
                    status: "failed",
                    message: "transaction was cancelled by user",
                }})
            }
            case txnTypes.failed: {
                const signature = req.body.signature
                const derivedSignature = signatureVerification.signatureResponse1(req.body, rdata.configData.secretKey)
                if(derivedSignature !== signature){
                    throw {name:"signature missmatch", message:"there was a missmatch in signatures genereated and received"}
                }
                await BASECON.BfindOneAndUpdate(TransactionsHistory,{ order_no : req.body.orderId },{ resultData : req.body })
                res.writeHead(301,{ Location : rdata.configData.redirect_url+'/:'+req.body.orderId})
                res.end()
                return next()
            }
            case txnTypes.success: {
                const signature = req.body.signature
                const derivedSignature = signatureVerification.signatureResponse1(req.body, rdata.configData.secretKey)
                if(derivedSignature !== signature){
                    throw {name:"signature missmatch", message:"there was a missmatch in signatures genereated and received"}
                }
                req.body = Object.assign({}, req.body, {status:'2'})
                var udata = await BASECON.BfindOneAndUpdate(TransactionsHistory,{ order_no : req.body.orderId },{ resultData : req.body })
                if(!udata){
                    res.json({ status : false, data: 'fail' })
                    return next()
                }else{
                    await BalanceUpdate(udata.email, parseFloat(udata.amount))
                    res.writeHead(301,{ Location : rdata.configData.redirect_url+'/:'+req.body.orderId})
                    res.end()
                    return next()
                }
            }
        }
    })
    // }
    // catch(err){
    //     return res.status(500).render('result',{data:{
    //         status:"error",
    //         err: err,
    //         name: err.name,
    //         message: err.message,
    //     }})
    // }
    // const signature = req.body.signature
    // const derivedSignature = signatureVerification.signatureResponse1(req.body, config.secretKey)
    // if(derivedSignature === signature){
    //     return res.status(200).send({
    //         status:req.body.txStatus,
    //     })
    // }
    // else{
    //     return res.status(200).send({
    //         status: "error",
    //         message: "signature mismatch",
    //     })
    // }
}

exports.CashfreeResults = async(req,res,next)=>{
    var order_no = req.body.order_no
    await TransactionsHistory.findOne({ order_no : order_no }).then(rdata =>{
        if(!rdata){
            res.json({ status : false, data: 'fail' })
            return next()
        }else{  
            res.json({ status : true, data : rdata })
            return next()
        }
    })
}