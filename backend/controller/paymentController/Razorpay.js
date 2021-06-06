const BASECON = require("../basecontroller")
const { BalanceUpdate, PayoutOrder } = require("./init")
const { GamePlay } = require("../../models/users_model")
const { Paymentconfig, TransactionsHistory, WithdrawHistory, PaymentMethod } = require("../../models/paymentGateWayModel")
const { RazorPayContact, RazorPayFundAccount, RazorPayPayout, RazorPayPayoutLink } = require("./razorpayx-nodejs-sdk")

exports.RazorpayCheckOut = async(req,res,next)=>{
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
            var key_id = rdata.configData.key_id
            var key_secret = rdata.configData.key_secret
            var success_url = rdata.configData.success_url
            var instance = new Razorpay({
                key_id: key_id,
                key_secret: key_secret,
            })
            var options = {
                amount: data.amount*100,
                currency: "INR",
                receipt: "order_rcptid_11"
            }
            instance.orders.create(options, async function(err, order) {
                if(!err){
                    var signData = Object.assign({}, order)
                    var transactiondata = {
                        type : data.type,
                        email : data.email,
                        order_no : signData.id,
                        status : 'deposit',
                        requestData : signData,
                        amount : data.amount
                    }
                    var savehandle = await BASECON.data_save(transactiondata, TransactionsHistory)
                    if(!savehandle){
                        res.json({status : false,data : "fail"})
                        return next()
                    }else{
                        res.json({ status : true, data : signData, success_url: success_url, key_id})
                        return next()
                    }
                }else{
                    res.json({ status : false, data: 'fail' })
                    return next()
                }
            })
        }
    })
}

exports.RazorpayResponse = async(req,res,next)=>{
    var data = req.body
    await Paymentconfig.findOne({ type : 'Razorpay' }).then(async rdata =>{
        if(!data.status){
            await BASECON.BfindOneAndUpdate(TransactionsHistory,{ order_no : data.order_no },{ resultData : data })
            return next()
        }else{
            data = Object.assign({}, data, {status:'2'})
            var udata = await BASECON.BfindOneAndUpdate(TransactionsHistory,{ order_no : data.order_no },{ resultData : data })
            if(!udata){
                res.json({ status : false, data: 'fail' })
                return next()
            }else{
                await BalanceUpdate(udata.email, parseFloat(udata.amount))
                res.json({ status : true, data: 'Success' })
                return next()
            }
        }
    })
}

exports.RazorpayWithdraw = async(req,res,next)=>{
    // var data = req.body
    // await WithdrawHistory.findOne({ "email": data.email, $or: [ { "status": "processing" }, { $or: [ { "status": "pending" } ] } ] }).then(async rdata =>{
    //     if(!rdata){
    //         await GamePlay.findOne({email:data.email}).then(async balanceData=>{
    //             if(parseFloat(balanceData.balance)>parseFloat(data.amount)){
    //                 var paymentMethodData = {
    //                     email : data.email,
    //                     type : data.type+'-'+data.bankType,
    //                     paymentData : data
    //                 }
    //                 await PaymentMethod.findOne({type:paymentMethodData.type, email:paymentMethodData.email}).then(async paymentData =>{
    //                     if(!paymentData){
    //                         var savehandle = await BASECON.data_save(paymentMethodData, PaymentMethod)
    //                         if(!savehandle){
    //                             res.json({status : false,data : "fail"})
    //                             return next()
    //                         }else{
    //                             var savehandle = await BASECON.data_save(data, WithdrawHistory)
    //                             if(!savehandle){
    //                                 res.json({status : false, data : "Failed"})
    //                                 return next()
    //                             }else{
    //                                 res.json({status : true, data : "Success"})
    //                                 return next()
    //                             }
    //                         }
    //                     }else{
    //                         await PaymentMethod.updateOne({ type:paymentMethodData.type, email:paymentMethodData.email }, {paymentData : data} ).then( async datas => {
    //                             if(!datas){
    //                                 res.json({ status : false, data: 'fail' })
    //                                 return next()
    //                             }else{
    //                                 var savehandle = await BASECON.data_save(data, WithdrawHistory)
    //                                 if(!savehandle){
    //                                     res.json({status : false, data : "Failed"})
    //                                     return next()
    //                                 }else{
    //                                     res.json({status : true, data : "Success"})
    //                                     return next()
    //                                 }
    //                             }
    //                         })
    //                     }
    //                 })
    //             }else{
    //                 res.json({status : false, data : "You cannot withdraw many than the balance amount."})
    //                 return next()
    //             }
    //         })
    //     }else{
    //         res.json({status : false, data : "There has been a recent change to the withdrawal process, users are allowed to have only 1 pending withdrawal at a time. Please cancel and resubmit your withdrawal request."})
    //         return next()
    //     }
    // })
}

exports.RazorpayPayout = async(req,res,next)=>{
    var data = req.body
    if(data.status=="payout"){
        await GamePlay.findOne({email:data.email}).then(async balanceData=>{
            if(parseFloat(balanceData.balance)>parseFloat(data.amount)){
                await Paymentconfig.findOne({ type : data.type }).then(async rdata =>{
                    if(!rdata){
                        res.json({ status : false, data: 'fail' })
                        return next()
                    }else if(!rdata.state){
                        res.json({ status : false, data: 'YaarPay has been disabled.' })
                        return next()
                    }
                    else{
                        RazorPayContact.create({
                            "name":data.payoutData.name,
                            "email":data.payoutData.email,
                            "contact":data.payoutData.contact,
                            "type":"employee",
                            "reference_id":"Online Casino Games"+Date.now(),
                        }).then((contactData)=>{
                            if(contactData.isError){
                                res.json({ status : false, data:contactData.messages[0]})
                                return next()
                            }else{
                                RazorPayFundAccount.create({
                                    "contact_id":contactData.data.id,
                                    "account_type":data.payoutData.account_type,
                                    [data.payoutData.account_type]:{
                                        ifsc : data.payoutData.ifscCode,
                                        name : data.payoutData.accountName,
                                        account_number : data.payoutData.accountNo,
                                    }
                                }).then((fundData)=>{
                                    if(fundData.isError){
                                        res.json({ status : false, data:fundData.messages[0]})
                                        return next()
                                    }else{ 
                                        RazorPayPayout.create({
                                            "account_number": rdata.configData.account_number,
                                            "fund_account_id": fundData.data.id,
                                            "amount": data.amount,
                                            "currency": "INR",
                                            "mode": "IMPS",
                                            "purpose": "payout",
                                            "queue_if_low_balance": true,
                                            "reference_id":"Online Casino Games"+Date.now(),
                                        }).then(async (payoutData)=>{
                                            if(payoutData.isError){
                                                res.json({ status : false, data:payoutData.messages[0]})
                                                return next()
                                            }else{
                                                var transactiondata = {
                                                    type : data.type,
                                                    email : data.email,
                                                    order_no : payoutData.data.id,
                                                    status : 'payout',
                                                    amount : data.amount,
                                                    requestData : data
                                                }
                                                var savehandle = await BASECON.data_save(transactiondata, TransactionsHistory)
                                                    if(!savehandle){
                                                        res.json({status : false, data : "fail"})
                                                        return next()
                                                    }else{
                                                        await WithdrawHistory.updateOne({ _id : data._id}, {status: payoutData.data.status} ).then( async rdata => {
                                                            await BASECON.email_balanceupdate(data.email, -parseFloat(data.amount))
                                                            res.json({ status : true, data:payoutData.data.status})
                                                            return next()
                                                        })
                                                    }
                                            }
                                        })
                                    }
                                    
                                })
                            }
                        })
                    }
                })
            }else{
                res.json({status : false, data : "You cannot Payout many than the balance amount."})
                return next()
            }
        })
    }else{
        await PayoutOrder(req,res,next)
    }
}