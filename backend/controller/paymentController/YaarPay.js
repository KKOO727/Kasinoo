const CryptoJS = require('crypto-js');
const BASECONTROL = require("../basecontroller");
const { GamePlay } = require("../../models/users_model");
const { TransactionsHistory ,PaymentMenuModel, paymentuserdetail, PaymoroSubmitData} = require("../../models/paymentGateWayModel");
var mongoose = require('mongoose');
const request = require("request")
const home = require("../../servers/home.json")
const Paymorocontrol = require("./paymoro")
const PCONFIG = require("../../config/pconfig")


exports.YaarPayCheckOut = async(req,res,next)=>{


    var {paymentmenuid , depositBankCode} = req.body.params;
    var amount = parseInt(req.body.params.amount)
    var { email ,_id} =req.user;
    let pmenuitem = await PaymentMenuModel.findOne({_id : paymentmenuid}).populate("paymentconfigurationid");
    if (!pmenuitem) {
        return res.json({ status : false, data: 'We are sorry. Please contact to administrator.' });
    } else {
        await BASECONTROL.BfindOneAndUpdate(paymentuserdetail,{userid : mongoose.Types.ObjectId(_id),paymentconfigid : paymentmenuid},{paymentData : {depositBankCode : depositBankCode}});


        var { merchant_id, merchant_key, application_id, request_url, notify_url, return_url,currency ,version } = pmenuitem.paymentconfigurationid.configData;
        var type = pmenuitem.paymentconfigurationid.type;
        var bankType = pmenuitem.paymentType;
        var orderNO = type + ":" + new Date().valueOf();
        var transactiondata = {  type,  email,  order_no : orderNO, status : PCONFIG.Pending,
            amount, requestData : {},wallettype : "DEPOSIT",
            userid : mongoose.Types.ObjectId(req.user._id)
        }
        var yaar_amount =  (parseInt(amount)*100).toString();

        var notify_urls = notify_url;
        if (req.headers["user-device"] == "telegram") {
            var return_urls = return_url + "?order_no=" + orderNO + "&paymentmenuid=" + paymentmenuid + "&telegram=true";
        } else {
            var return_urls = return_url + "?order_no=" + orderNO + "&paymentmenuid=" + paymentmenuid + "&telegram=false";            
        }
        var hashstring= 'amount=' +yaar_amount +
            '&appId=' + application_id +
            "&channelId=" + bankType +
            "&currency=" + currency +
            "&depositBankCode=" + depositBankCode +
            "&mchId=" + merchant_id +
            "&mchOrderNo=" + orderNO +
            "&notifyUrl=" + notify_urls +
            "&returnUrl=" + return_urls +
            "&version=" + version +
            "&key=" + merchant_key;

        let sign = CryptoJS.MD5(hashstring).toString().toUpperCase();
        let successData={ mchOrderNo:orderNO, version,  channelId:bankType, amount: yaar_amount, currency:currency,
            mchId:merchant_id, appId:application_id, notifyUrl:notify_urls, returnUrl:return_urls,
            sign, depositBankCode, }

        let formdata =  {
            mchId : successData.mchId,
            depositBankCode : successData.depositBankCode,
            mchOrderNo : successData.mchOrderNo,
            appId : successData.appId,
            amount : successData.amount,
            channelId : successData.channelId,
            currency : successData.currency,
            notifyUrl : successData.notifyUrl,
            returnUrl : successData.returnUrl,
            version : successData.version,
            sign : successData.sign,
        }

        var options = {
            'method': 'POST',
            'url': request_url,
            'headers': {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            form: formdata
        };
        request(options, async function (error, response) {
            if (error) {
                return res.json({status : false, data : "failed"})
            } else {
                if (response.statusCode == 200) {


                    console.log(JSON.parse(response.body))
                    try {
                        let row = JSON.parse(response.body);
                        let error = getErrorString(row.errCode);
                        return res.json({status : false, data : error});
                    } catch(e) {
                        console.log(response.body)
                        return res.json({status : false, data : "failed"})
                        return;
                        let formstring =  response.body;
                        let paymoro = {
                            content : formstring,
                            order_no : orderNO,
                            date : new Date(new Date().valueOf() + 24 * 60 * 60 * 1000)
                        }
                        var tanshis = await BASECONTROL.data_save(transactiondata,TransactionsHistory)
                        var pxnsave = await BASECONTROL.data_save(paymoro,PaymoroSubmitData);
                        if (tanshis && pxnsave) {
                            var redirect = new URL(home.homedomain + "/PaymentGateway/yaarpaysubmit");
                            redirect.searchParams.append("orderno", orderNO);
                            return res.json({status : true, data : redirect['href']})
                        } else {
                            return res.json({status : false, data : "failed"})
                        }
                    }
                } else {
                    return res.json({status : false, data : "failed"})
                }
            }
        });
    }
}

exports.YaarReturn = async(req,res,next)=>{

    console.log(req.url);
    var indata = BASECONTROL.urlparse(req.url);
    var yaarconfig = await BASECONTROL.BfindOne(PaymentMenuModel,{_id : indata.paymentmenuid}).populate("paymentconfigurationid");
    var txnhis = await BASECONTROL.BfindOne(TransactionsHistory,{order_no : indata.order_no});
    if(yaarconfig && txnhis){
        var redirect_url = "";
        if (indata.telegram) {
            redirect_url = yaarconfig.paymentconfigurationid.configData.telegramreturnurl;
        } else {
            redirect_url = yaarconfig.paymentconfigurationid.configData.redirect_url;            
        }
        var redirect = new URL(redirect_url);
        redirect.searchParams.append("order_no", txnhis.order_no);
        redirect.searchParams.append("amount", txnhis.amount);
        redirect.searchParams.append("status", txnhis.status);
        res.writeHead(301,{ Location :redirect});
        return res.end();
    }
}

exports.YaarNotyfy = async(req,res,next)=>{

    var { mchOrderNo, status } = req.body;
    var updata = { resultData : req.body };
    status += "";
    var tnshi = await BASECONTROL.BfindOne(TransactionsHistory,{order_no : mchOrderNo});
    var userdata = await BASECONTROL.BfindOne(GamePlay,{email :tnshi.email });
    if(tnshi && userdata){
        if(status == "2"){

            if(tnshi.status != PCONFIG.Approve){
                updata["status"] = PCONFIG.Approve;
                updata["lastbalance"] = userdata.balance;
                // const { fee } = await PaymentMenuModel.findOne({type :"YaarPay"})
                // var amount = parseFloat(tnshi.amount) - parseFloat(tnshi.amount) * parseFloat(fee)/100
                
                var wallets = {
                    commission:0,
                    status :"DEPOSIT",
                    roundid :mchOrderNo,
                    transactionid : mchOrderNo,
                    userid : mongoose.Types.ObjectId(userdata.id),
                    credited : tnshi.amount,
                    debited : 0,
                    lastbalance : userdata.balance,
                    paymentid : mongoose.Types.ObjectId(tnshi._id)
                }

            
                
                var current = await BASECONTROL.email_balanceupdate(tnshi.email, tnshi.amount,wallets);
                updata["updatedbalance"] = current;
            }
            //  await BalanceUpdate(tnshi.email, tnshi.amount,mchOrderNo,wallets_);
        }else{
            updata["status"] = PCONFIG.Reject;
            updata["lastbalance"] = userdata.balance;
            updata["updatedbalance"] = userdata.balance;
        }

        updata["order_no"] = tnshi.order_no;
        updata["userid"] = tnshi.userid;
        updata["amount"] = tnshi.amount;
        // await BASECONTROL.BfindOneAndUpdate(TransactionsHistory,{ order_no : mchOrderNo}, updata);
        Paymorocontrol.transactionUpdate( updata);

    }
    return res.status(200).send()
}

exports.YaarPayPayout = async(amount,activepayoutchannel,itemuser,callback)=>{

    let accountname = itemuser.paymentData.accountName;
    var accountnumber = itemuser.paymentData.accountNumber
    var bankifsc = itemuser.paymentData.IfscCode;
    // var payoutBankCode = "YP_ICICI";
    var payoutBankCode = activepayoutchannel.bank;
    
    var reqTime = new Date().valueOf();
    var orderNO = activepayoutchannel.paymentconfigurationid.type + ":" + reqTime;
    const { merchant_id, merchant_key, payout_request_url, payout_notify_url } = activepayoutchannel.paymentconfigurationid.configData;
    console.log(activepayoutchannel.paymentconfigurationid.configData)
    var rawSign=
    'accountName=' + accountname+
    '&accountNo=' + accountnumber +
    "&amount=" + ((amount)*100)+
    "&ifscCode=" + bankifsc +
    "&mchId="+ merchant_id +
    "&mchOrderNo=" + orderNO +
    "&notifyUrl=" + payout_notify_url +
    "&payoutBankCode=" + payoutBankCode +
    "&reqTime=" + reqTime +
    "&key=" + merchant_key;

    var sign = CryptoJS.MD5(rawSign)
    sign = sign.toString().toUpperCase()  
    var successData={
        mchId : merchant_id,
        notifyUrl : payout_notify_url,
        mchOrderNo : orderNO,
        reqTime : reqTime,
        sign : sign,
        accountName : accountname,
        accountNo : accountnumber,
        amount : ((amount)*100).toString(),
        payoutBankCode : payoutBankCode,
        ifscCode : bankifsc,
    }

    console.log(successData)
        
    var options = {
        'method': 'POST',
        'url': payout_request_url,
        "accept-charset":"UTF-8",
        'headers': {
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        form:successData
    }
    request.post(options, async (error, response) => {
        if (error){
           callback({status : false , error : "Yaarpay channel error"});
        }else{
            var outdata = JSON.parse(response.body)
            console.log(outdata)
            if(outdata.retCode == "101"){
                let error = getErrorString(outdata.errCode);
                callback({status : false ,error : error});
            }else if(outdata.retCode=="100"){
                callback({status : true ,error : "success"});
            }else{
                callback({status : false ,error : "Yaarpay channel error"});
            }
        }  
    })
}


function getErrorString  (errorCode) {
    let keyError =  {
        "0016":"Invalid Order Amount Format","0017":"Invalid Request Amount",
        "0018":"Invalid Application Id",
        "0019":"Invalid Channel Id","0020":"Channel Not Available",
        "0021":"No Connector Available",
        "0022":"Invalid Currency","0023":"Merchant not found",
        "0024":"Notify URL not found","0025":"Invalid Notify URL",
        "0026":"Return URL not found","0027":"Invalid Return URL",
        "0028":"Invalid Signature","0029":"Invalid Version",
        "0030":"Invalid Merchant Order Number","0031":"Invalid Client IP",
        "0033":"Invalid Device","0034":"Invalid Deposit Name",
        "0035":"Invalid Deposit Account","0036":"Invalid Extra Details",
        "0037":"Execute Notify Not Found","0039":"Transaction Not Found",
        "0040":"Request Denied","0041":"Account Name Not Found",
        "0043":"Account Number Not Found","0044":"Invalid Payout Bank Code",
        "0045":"Invalid Request Time","0046":"Invalid Account Attribute",
        "0047":"Invalid Bank Branch","0048":"Invalid IFSC Code",
        "0049":"Invalid Bank Province","0050":"Invalid Remarks",
        "0051":"Insufficient Balance","0052":"Merchant Account Disabled",
        "0053":"Merchant Application Id is disabled","0054":"Duplicate Transaction",
        "0200":"Transaction Expired","0201":"Payment Not Completed",
        "0202":"Account Details Don’t Match","0010":"System Error",
        "0014":"Parameter Error","0999":"Unknown Error",
        "0058":"Bank Used Not Available","0059":"Invalid Time Stamp"
    }
    return keyError[errorCode];
}