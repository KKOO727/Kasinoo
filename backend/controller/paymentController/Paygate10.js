const md5 = require('md5')
const Request = require("request")
const BASECON = require("../basecontroller")
const { GamePlay ,adminUser} = require("../../models/users_model")
const {  TransactionsHistory,paymentuserdetail,PaymentMenuModel } = require("../../models/paymentGateWayModel")
var mongoose = require('mongoose');
const Paymorocontrol = require("./paymoro")
const PCONFIG = require("../../config/pconfig")
const transactionControl = require("./Transaction")


exports.Paygate10Callback = async(req,res,next)=>{

    var updata = {  };

    var txnhis = await BASECON.BfindOne(TransactionsHistory,{order_no : req.body.txid});
    var userdata = await BASECON.BfindOne(GamePlay,{email :txnhis.email });
    if( txnhis && userdata){
        if( req.body.status == "APPROVED" ){

            console.log("--------------approved")
        // const { fee } = await PaymentMenuModel.findOne({type})
        // let balance = parseFloat(amount) - parseFloat(amount) * parseFloat(fee)/100

            if( txnhis.status != PCONFIG.Approve){
    
                console.log("--------------approved")
                var wallets = {
                    commission:0,
                    status :"DEPOSIT",
                    roundid :req.body.txid,
                    transactionid : req.body.txid,
                    LAUNCHURL : "cash",
                    GAMEID : "RuPeePay",
                    USERID : userdata.id,
                    credited : txnhis.amount,
                    debited : 0,
                    lastbalance : userdata.balance
                }
                updata["status"] = PCONFIG.Approve;
                updata["lastbalance"] = userdata.balance;
                var current = await BASECON.email_balanceupdate(txnhis.email, txnhis.amount,wallets);
                updata["updatedbalance"] = current;
            }

        } else {
            updata["status"] = PCONFIG.Reject;
            updata["lastbalance"] = userdata.balance;
            updata["updatedbalance"] = userdata.balance;
        }

        updata["order_no"] = txnhis.order_no;
        updata["userid"] = txnhis.userid;
        updata["amount"] = txnhis.amount;
        // await BASECONTROL.BfindOneAndUpdate(TransactionsHistory,{ order_no : mchOrderNo}, updata);
        Paymorocontrol.transactionUpdate( updata);

    }
    return res.status(200).send()
}

exports.Paygate10CallbackW = async(req,res,next)=>{
    console.log("----------------------payout callback return url");

    console.log(req.body)
    console.log("----------------------payout callback return url");
    let {status,payoutid} = req.body;

    var txnhis = await BASECON.BfindOne(TransactionsHistory,{order_no : payoutid});
    var userdata = await BASECON.BfindOne(GamePlay,{email :txnhis.email });
    if( txnhis && userdata){
        if (txnhis.status == PCONFIG.Paid) {
            if (status == "APPROVED") {
                
                await TransactionsHistory.findOneAndUpdate({_id : txnhis._id},{status :PCONFIG.Approve});
            } else if (status == "DECLINED") {

                await TransactionsHistory.findOneAndUpdate({_id : txnhis._id},{status :PCONFIG.Reject});
                await transactionControl.balancRefund(userdata,txnhis);
            }
        }
    }

    return res.status(200).send()
}
exports.Paygate10CallbackC = async(req,res,next)=>{
    return next()
}
exports.Paygate10CallbackCW = async(req,res,next)=>{
    return next()
}

exports.Paygate10CheckOut = async(req,res,next)=>{

    console.log(req.body,"------------paygate 10------")
    var  {firstname, lastname, email,_id} = req.user;
    var {    mobile, address, city, postcode ,paymentmenuid} = req.body;
    var amount = parseInt(req.body.amount);
    let row = { mobile,address,city,postcode };
    var ruppeconfig = await PaymentMenuModel.findOne({_id : paymentmenuid}).populate("paymentconfigurationid");
    if (!ruppeconfig) {
        return res.json({ status : false, data: 'fail' });
    } else {
        var bankType = ruppeconfig.paymentType;
        console.log(_id);
        console.log(paymentmenuid);
        console.log(row);
        let dddd= await BASECON.BfindOneAndUpdate(adminUser,{_id : _id},{address : address , mobilenumber : mobile});
        console.log(dddd)
        await BASECON.BfindOneAndUpdate(paymentuserdetail,{userid : mongoose.Types.ObjectId(_id),paymentconfigid : paymentmenuid},{paymentData : row});

        var type = ruppeconfig.paymentconfigurationid.type;

        var { midcode, midsecret, callbackurl, return_url, request_url ,telegramreturnurl} = ruppeconfig.paymentconfigurationid.configData;

        if (req.headers["user-device"] == "telegram") {
            return_url = telegramreturnurl
        } 

        let ipaddress = BASECON.get_ipaddress(req);
        let requesttype = "deposit";
        let order_no = Math.floor(new Date().valueOf()/1000);
        amount =  amount.toFixed(2);
        let form = {
            requesttype: requesttype,
            requestfor: bankType,
            mobile,
            address,
            city,
            postcode,
            email,
            amount: amount,
            timestamp: order_no,
            currency: "INR",
            reference1: "",
            reference2: "",
            reference3: "",
            reference4: "",
            reference5: "",
            firstname:firstname,
            lastname:lastname,
        }    
        let options = {'method': 'POST', 'url': request_url,
            'headers': { 'Content-Type': 'application/json' }, }

            console.log(form)
            var encrypthash = md5(midcode + order_no + amount + midsecret);
            form = Object.assign({}, form, 
            {
                midcode,
                state: "IN",
                countrycode: "IN",
                encrypthash,
                ipaddress,
                callbackurl,
                returnurl: return_url
            })

            console.log(form)

            Request.post({...options, body:JSON.stringify(form)}, async (error, response) => {
                if (error){
                    return res.json({ status : false, data : "failed"})
                } else {
                    if( response.statusCode == 400){
                        return res.json({ status : false, data : "failed"})
                    } else {

                        let resultData = JSON.parse(response.body);
                        
                        if (resultData.status == "DECLINED") {
                            return res.json({ status : false, data : message});
                        } else {
                            let transactionData = { 
                                type, email, amount, status : PCONFIG.Pending, 
                                order_no: resultData.transactionid, 
                                wallettype : "DEPOSIT",
                                userid : mongoose.Types.ObjectId(req.user._id)
                            }
                            var txnsave = await BASECON.data_save(transactionData,TransactionsHistory);
                            if( txnsave){
                                return res.json({ status : true, data:resultData})
                            } else {
                                return res.json({ status : false, data : "failed"})
                            }

                        }
                    }
                }
            })
        // }
        // else if( bankType=='cod'){
            
        // }
    }
}

exports.Paygate10Payout = async(last_item,paymentconfig,useritem,itemuser,callback)=>{

    let accountname = itemuser.paymentData.accountName;
    var accountnumber = itemuser.paymentData.accountNumber
    var username = useritem.userid.username;
    var bankname = itemuser.paymentData.accountName;
    var bankifsc = itemuser.paymentData.IfscCode;
    var bankbranch = accountname;
    var bankaddress = accountname;

    const timestamp = Math.floor(new Date().valueOf()/1000)
    const { midcode, midsecret, request_url, callbackurl2 } = paymentconfig.configData;
    let balance = parseFloat(last_item.amount).toFixed(2);
    let options = {
        'method': 'POST',
        'url': request_url,
        'headers': {
            'Content-Type': 'application/json'
        },
    }
            
    const encrypthash = md5(midsecret+timestamp+balance)
    const requestcode = md5(timestamp)
    let form = {
        requesttype : "withdrawal",
        requestfor : "netbanking",
        countrycode : "IN",
        amount : balance,
        timestamp,
        currency : "INR", reference1 : "", reference2 : "", reference3 : "", reference4 : "", reference5 : "",
        midcode,
        encrypthash,
        requestcode,
        username,
        accountname,
        accountnumber,
        bankname,
        bankifsc,
        bankbranch,
        bankaddress,
        callbackurl:callbackurl2
    }
                
    Request.post({...options, body:JSON.stringify(form)}, async (error, response) => {
        if (error){
            callback({status : false, error : "Ruppepayment server error"})
        } else {
            let resultData = JSON.parse(response.body);
            console.log(resultData)
            if ( response.statusCode == 400) {
                callback({status : false, error : "Ruppepayment server error"})
            }else if( resultData.status == 'APPROVED'){
                callback({status : true , data : resultData.payoutid , error : "success"})
            }else {
                callback({status : false , error : resultData.message});
            }
        }
    })
}


