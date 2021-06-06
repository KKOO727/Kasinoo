const request = require('request');
const home = require("../../servers/home.json")
const BASECON = require("../basecontroller")
const { GamePlay,friendModel } = require("../../models/users_model")
const {  TransactionsHistory,paymentuserdetail,PaymentMenuModel, PaymoroSubmitData, Paymentconfig } = require("../../models/paymentGateWayModel")
const {firstpagesetting} = require("../../models/firstpage_model");
const mongoose = require('mongoose');
const Playercontrol = require("../playerscontroller")
const PCONFIG = require("../../config/pconfig")
const transactionControl = require("./Transaction")
const axios = require('axios');
const BonusConfig = require("../../models/promotion_model").BonusConfig;


exports.paymoroBanktransfer = (req, res, next) => {


    let banktransferRequestUrl = "https://service-api.paymero.io/v1/deposit/bank-transfer";
    let apikey = "Ql21OM5Lr9WUr2Cgz4Km8UmX9ftAXiB6Y0y8kMZ7";
    let amount = "1000.00";
    let orderId = "paymoro" + new Date().valueOf();
    let returnUrl = "https://cms.kasagames.com/admin/paymentGateWay/paymoroReturn";
    let notifyUrl =  "https://cms.kasagames.com/admin/paymentGateWay/paymoroNotify";
    let firstname = "igamez";
    let lastname = "zhen"
    var options = {
    'method': 'POST',
    'url': banktransferRequestUrl,
    'headers': {
        'Content-Type': 'application/json',
        'x-api-key': apikey
    },
    body: JSON.stringify({
        "deviceType": "WEB",
        "amount": amount,
        "orderId": orderId,
        "returnUrl": returnUrl,
        "notifyUrl": notifyUrl,
        "currency": "INR",
        "productName": "test",
        "customerFirstName": firstname,
        "customerLastName": lastname,
        "subIssuingBank": "INR"
    })

    };
    request(options, function (error, response) {
        if (error) {

        } else {
            let data = JSON.parse(response.body)
        }
    });

}

exports.paymoroGettingWalletBanks = async (config) => {
    var config = {
        method: 'get',
        url: 'https://service-api.paymero.io/v1/deposit/wallet/banks/INR',
        headers: { 
          'x-api-key': config.apikey
        },
        data : ""
      };
      
      let data = [];
      await axios(config)
      .then(function (response) {
          data = response.data.data.banks;
      })
      .catch(function (error) {
          data = [];
      });
      let rows = [];
      for (let i in data ) {
          rows.push({label : data[i].name , value : data[i].code});
      }
      return rows;
    
}

exports.paymoroGettingNetBankingBanks = async (config) => {
    
    var config = {
      method: 'get',
      url: 'https://service-api.paymero.io/v1/deposit/net-banking/banks/INR',
      headers: { 
        'x-api-key': config.apikey
      },
      data : ""
    };
    let data = [];
    await axios(config)
    .then(function (response) {
        data = response.data.data.banks;
    })
    .catch(function (error) {
        data = [];
    });
    let rows = [];
    for (let i in data ) {
        rows.push({label : data[i].name , value : data[i].code});
    }
    return rows;

}


exports.paymoroGettingPayoutBanks = async () => {
    let dd = await Paymentconfig.findOne({_id : "605560fb43770bfd4c901729"});
    var config = {
      method: 'get',
      url: 'https://service-api.paymero.io/v1/payout/bank-transfer/banks/INR',
      headers: { 
        'x-api-key': dd.configData.apikey
      },
      data : ""
    };
    let data = [];
    await axios(config)
    .then(function (response) {
        data = response.data.data.banks;
    })
    .catch(function (error) {
        data = [];
    });
    let rows = [];
    for (let i in data ) {
        rows.push({label : data[i].name , value : data[i].code});
    }
    return rows;

}

exports.paymoroNetBanking = async (req, res, next) => {

    const {paymentmenuid, amount , depositBankCode} = req.body.params;
    let _id = req.user._id;

    
    var paymoroconfig = await PaymentMenuModel.findOne({_id : paymentmenuid}).populate("paymentconfigurationid");
    if (paymoroconfig) {

        await BASECON.BfindOneAndUpdate(paymentuserdetail,{userid : mongoose.Types.ObjectId(_id),paymentconfigid : paymentmenuid},{paymentData : {depositBankCode  : depositBankCode}});

        let configData = paymoroconfig.paymentconfigurationid;
        let subIssuingBank = depositBankCode;
        let bankRequestUrl = configData.configData.NetBankingUrl;
        this.paymorodepositRequest(req,res,next,subIssuingBank,bankRequestUrl, amount, configData)
    } else {
        return res.json({ status : false, data: 'fail' });
    }
}

exports.paymorodepositRequest = (req,res,next, subIssuingBank, bankRequestUrl, mainamount , configs) => {
    
    let orderId = configs.type + new Date().valueOf();
    let useritem = req.user;
    let transactionData = { 
        type : configs.type, 
        email : useritem.email, 
        amount : mainamount, 
        status : PCONFIG.Pending, 
        requestData: {},
        order_no: orderId, 
        wallettype : "DEPOSIT",
        userid : mongoose.Types.ObjectId(useritem._id)
    }
    
    let  configdata = configs.configData;
    let apikey = configdata.apikey;
    let amount = mainamount.toFixed(2);
    let returnUrl = configdata.returnUrl;
    let notifyUrl =  configdata.notifyUrl;
    let DeviceType = configdata.DeviceType;
    let productName =  configdata.productName;
    let bodydata = JSON.stringify({
        "deviceType": DeviceType,
        "amount": amount,
        "orderId": orderId,
        "returnUrl": returnUrl,
        "notifyUrl": notifyUrl,
        "currency": "INR",
        "productName": productName,
        "customerFirstName": useritem.firstname,
        "customerLastName": useritem.lastname,
        "subIssuingBank": subIssuingBank,
        "customerEmail" : useritem.email,
        "customerPhone" : useritem.mobilenumber,
        "customerAddressZipcode" : "12345",
        "customerAddressLine1" : "test",
        "upi" : subIssuingBank
    })
 
    var options = {
        'method': 'POST',
        'url': bankRequestUrl,
        'headers': {
            'Content-Type': 'application/json',
            'x-api-key': apikey
        },
        body: bodydata
    };

    request(options, async function (error, response) {
        if (error) {
            return res.json({ status : false, data: 'fail' });
        } else {

            if (response.statusCode == 200) {
                let formstring =  response.body;
                let paymoro = {
                    content : formstring,
                    order_no : orderId,
                    date : new Date(new Date().valueOf() + 24 * 60 * 60 * 1000)

                }

                var pxnsave = await BASECON.data_save(paymoro,PaymoroSubmitData);
                var txnsave = await BASECON.data_save(transactionData,TransactionsHistory);
                if (txnsave && pxnsave) {
                    var redirect = new URL(home.homedomain+ "/PaymentGateway/paymorosubmit");
                    redirect.searchParams.append("orderno", orderId);
                    return res.json({status : true, data : redirect['href']})
                } else {
                    return res.json({ status : false, data: 'fail' });
                }
            }  else {
                let data = JSON.parse(response.body);
                return res.json({ status : false, data: data.data && data.data.message ? data.data.message : data.message });
            }
        }
    });
}

exports.getpaymoroSubmitdata = async (req, res, next) => {
    let orderno = req.body.orderno;
    let data = await PaymoroSubmitData.findOneAndDelete({order_no : orderno});
    if (data) {
        return res.json({ status : true, data: data.content });
    } else {
        return res.json({ status : false, data: 'fail' });
    }
}

exports.paymoroUpi = async (req, res, next) => {
    const {paymentmenuid, amount ,customerUpiId } = req.body.params;

    var paymoroconfig = await PaymentMenuModel.findOne({_id : paymentmenuid}).populate("paymentconfigurationid");
    if (paymoroconfig) {
        let _id = req.user._id;
        await BASECON.BfindOneAndUpdate(paymentuserdetail,{userid : mongoose.Types.ObjectId(_id),paymentconfigid : paymentmenuid},{paymentData : {customerUpiId  : customerUpiId}});

        let configData = paymoroconfig.paymentconfigurationid;
        let subIssuingBank = customerUpiId;
        let bankRequestUrl = configData.configData.UpiUrl;
        this.paymorodepositRequest(req,res,next,subIssuingBank,bankRequestUrl, amount, configData)
    } else {
        return res.json({ status : false, data: 'fail' });
    }
}

exports.paymoroWallet = async (req, res, next) => {

    const {paymentmenuid, amount, depositBankCode} = req.body.params;
    let _id = req.user._id;

    var paymoroconfig = await PaymentMenuModel.findOne({_id : paymentmenuid}).populate("paymentconfigurationid");
    if (paymoroconfig) {

        await BASECON.BfindOneAndUpdate(paymentuserdetail,{userid : mongoose.Types.ObjectId(_id),paymentconfigid : paymentmenuid},{paymentData : {depositBankCode  : depositBankCode}});

        let configData = paymoroconfig.paymentconfigurationid;
        let subIssuingBank = depositBankCode;
        let bankRequestUrl = configData.configData.WalletUrl;
        this.paymorodepositRequest(req,res,next,subIssuingBank,bankRequestUrl, amount, configData)
    } else {
        return res.json({ status : false, data: 'fail' });
    }
}

exports.payoutBankTransfer = (last_item,paymentconfig,data, itemuser,callback) => {


    let accountname = itemuser.paymentData.accountName;
    var accountnumber = itemuser.paymentData.accountNumber
    var bankifsc = itemuser.paymentData.IfscCode;
    var paymerodepositBankCode = paymentconfig.bank;
    var bankbranch = accountname;
    var bankaddress = accountname;
    const {  paymoropayoutNotify, apikey ,payoutBanktransfer} = paymentconfig.paymentconfigurationid.configData;
    let balance = (last_item.amount).toFixed(2);
    var orderId = last_item.order_no;

    var options = {
        'method': 'POST',
        'url': payoutBanktransfer,
        'headers': {
          'Content-Type': 'application/json',
          'x-api-key': apikey
        },
        body: JSON.stringify({
          "currency": "INR",
          "orderId": orderId,
          "amount": balance,
          "bankName": paymerodepositBankCode,
          "subBankName": "HCM",
          "accountNumber": accountnumber,
          "beneficiaryName": bankbranch,
          "bankProvince": bankaddress,
          "bankCity": bankaddress,
          "remark": "stuff",
          "notifyUrl": paymoropayoutNotify,
          "ifscCode" : bankifsc
        })
      
      };
      request(options, function (error, response) {
        if (error) {
            callback({status : false ,error :"Paymoro Payment error"})
        } else {
            let data = JSON.parse(response.body);
            if (data['status'] == "success") {
                callback({status : true ,data : data['message'], error : "successs"});
            } else {
                callback({status : false ,error : data['message']});
            }
        }

//        {"status":"success","data":{"amount":"1000.00","orderId":"000281231231235678","transactionStatus":"INITIATED"},"message":"Transaction created successfully"}
//{"status":"fail","data":null,"message":"Insufficient PMID Balance"}

    });
}

exports.paymoropayoutNotify = async (req, res, next) => {

    console.log("----------------------paymoro ----------------------")
    console.log(req.body)
    console.log("----------------------paymoro ----------------------")
    // {
    //     11|cmskasagames  |   amount: '980.00',
    //     11|cmskasagames  |   orderId: '1616590283651',
    //     11|cmskasagames  |   currency: 'INR',
    //     11|cmskasagames  |   transactionStatus: 'SUCCESS'
    //     11|cmskasagames  | }

    let {orderId, transactionStatus} = req.body;
    var txnhis = await BASECON.BfindOne(TransactionsHistory,{order_no : orderId});
    var userdata = await BASECON.BfindOne(GamePlay,{email :txnhis.email });
    if ( txnhis && userdata) {
        if (txnhis.status == PCONFIG.Paid) {
            if (transactionStatus == "SUCCESS") {
                
                await TransactionsHistory.findOneAndUpdate({_id : txnhis._id},{status :PCONFIG.Approve});
            } else if (transactionStatus == "FAIL") {

                await TransactionsHistory.findOneAndUpdate({_id : txnhis._id},{status :PCONFIG.Reject});
                await transactionControl.balancRefund(userdata,txnhis);
            }
        } else {

        }
    } 
    return res.status(200).send()
    
}

exports.paymoroNotify = async (req, res, next) => {
    console.log(req.body)
   
    var { orderId, transactionStatus} = req.body;
    var updata = {};
    var txnhis = await BASECON.BfindOne(TransactionsHistory,{order_no : orderId});
    var userdata = await BASECON.BfindOne(GamePlay,{email :txnhis.email });
    if ( txnhis && userdata){ 
        if (transactionStatus == "SUCCESS") {
            if( txnhis.status != PCONFIG.Approve){

                console.log("--------------approved")
                var wallets = {
                    commission:0,
                    status :"DEPOSIT",
                    roundid :txnhis.order_no,
                    transactionid : txnhis.order_no,
                    LAUNCHURL : "cash",
                    GAMEID : "Paymoro",
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

        this.transactionUpdate( updata);
    } else {

    }
    return res.status(200).send()

}


exports.transactionUpdate = async (data) => {

    if (data.status == PCONFIG.Approve) {
        let firsttrans = await  TransactionsHistory.findOne({email :data.email,type : {$ne : "admin"},status : PCONFIG.Approve})
        if (!firsttrans) {
            let signupbonusid = "6056439ec6bd5908845df1c1";
            this.friendInviteBonus(data)
            let data = await BonusConfig.findOne({type : "bonus"});
            if (data && data.status && data.bonusid) {
                Playercontrol.bonusoptions(data.amount , data.userid , data.bonusid );
            } else {
                
            }
        } 
    } 
    await BASECON.BfindOneAndUpdate(TransactionsHistory,{ order_no : data.order_no}, data);
    return true
}

exports.friendInviteBonus = async ( transhis) => {
    let isFriend = await friendModel.findOne({UserId : mongoose.Types.ObjectId(transhis.userid)}).populate("FriendUserId");
    console.log("-------------------is friend -------------------")
    if (isFriend) {
        var mainamount = transhis.amount;
        let config =  await firstpagesetting.findOne({ type : "Friendly"});
        if (config) {
            let cc = config.content;
            console.log(cc)
            var amount = 0;

            if (mainamount >= cc.min && mainamount <= cc.max ) {

                amount = mainamount * cc.percent / 100;
            } else if (mainamount > cc.max) {
                amount = mainamount * cc.percent / 100;
            } else {
                return;
            }

            let row ={};
            row["type"] = "friend";
            row["email"] = isFriend.FriendUserId.email;
            row["order_no"] = transhis.order_no;
            row["status"] = PCONFIG.Approve;
            row["amount"] = amount;
            row["wallettype"] = "DEPOSIT";
            row["comment"] = "";
            row["resultData"] = {}
            row["userid"] = mongoose.Types.ObjectId(isFriend.FriendUserId._id);
            row["lastbalance"] = isFriend.FriendUserId.playerid.balance;
    
            let adminrow = new TransactionsHistory(row);
    
            var wallets_2 = {
                commission:0,
                status :"DEPOSIT",
                roundid :transhis.order_no,
                transactionid : transhis.order_no,
                userid : mongoose.Types.ObjectId(transhis.userid),
                credited : amount,
                debited : 0,
                lastbalance : isFriend.FriendUserId.playerid.balance,
                paymentid : adminrow._id
            }
            var adcurrent =  await BASECON.email_balanceupdate( isFriend.FriendUserId.email, amount,wallets_2);  
            
            adminrow["updatedbalance"] = adcurrent;
            let sh2 = await BASECON.BSave(adminrow);
            if (sh2) {
                return true
            } else {
                return true
            }

        } else {

        }


    } else {
        return true
    }
}