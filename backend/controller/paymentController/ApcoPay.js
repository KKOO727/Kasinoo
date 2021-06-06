const CryptoJS = require('crypto-js');
const BASECONTROL = require("../basecontroller");
const moment= require('moment');
const { BalanceUpdate, PayoutOrder } = require("./init")
const { GamePlay } = require("../../models/users_model");
const { Paymentconfig, TransactionsHistory, WithdrawHistory, PaymentMethod } = require("../../models/paymentGateWayModel");
const PAYMENTCONFIG = require("../../config/paymenterror.json");
const Request = require("request");

// const profileId = "8FDB433B67584652A4320BDD5056E63A";
const profileId = "8FDB433B67584652A4320BDD5056E63A";
// const SecretWord = "1b5595f6a5";
const SecretWord = "1b5595f6a5";
// const MerchantCode = "3855";
const MerchantCode = "3855";
// const MerchantPassword = "aL85GkICPV1Bx0";
const MerchantPassword = "aL85GkICPV1Bx0";
const CurrencyCode = "978";
const LanguageCode = 'en';
const BaseUrl = "https://www.apsp.biz/pay/fp5a/Checkout.aspx";
const tokenGetUrl = "https://apsp.biz/merchanttools/MerchantTools.svc/BuildXMLToken";

const RedirectionUrl = "https://cms.kasagames.com/admin/paymentGateWay/ApcoPayRedirection";
const StatusUrl = "https://cms.kasagames.com";
// const StatusUrl = "https://cms.kasagames.com/admin/paymentGateWay/ApcoPayStatus";
const FailedUrl = "https://kasagames.com/admin/paymentGateWay/ApcoPayFailed";

exports.ApcoCheckout = async (req , res , next) => {

  var data = {...req.body}
  delete data.paymentName;

  var xmlData = await getXMLData(req.body.paymentName, data);


  console.log(xmlData)

  var encodedXmlData = encodeURIComponent(xmlData);

  var xmlTokenFetchData = {
    'MerchID': MerchantCode,
    'MerchPass': MerchantPassword,
    'XMLParam': encodedXmlData
  }

  console.log("----------------------------------")
  let options = {
    'method': 'POST',
    'url': tokenGetUrl,
    'headers': {
        'Content-Type': 'application/json'
    },
  }

  console.log(xmlTokenFetchData)

  Request.post({...options, body : JSON.stringify(xmlTokenFetchData) }, async (error, response) => {
    if (error){
      return res.json({ status : false, data : "failed"})
    }else{
      if(response.statusCode == 400){
        return res.json({ status : false, data : "failed"})
      }else{
        var resultData = JSON.parse(response.body)
        var fastUrl = resultData.BaseURL + resultData.Token;
        res.json({status : true , data : fastUrl});
        return next();
      }
    }
  });
}

function getXMLData(paymentName, data={}) {
  var defaultXMLData =
    '<Transaction hash="'+SecretWord+'">' +
    '<RedirectionURL>'+RedirectionUrl+'</RedirectionURL>' +
    '<status_url urlEncode="true">'+StatusUrl+'</status_url>' +
    '<FailedRedirectionURL>'+FailedUrl+'</FailedRedirectionURL>' +
    '<ProfileID>'+profileId+'</ProfileID>' +
    // '<Curr>'+CurrencyCode+'</Curr>' +
    '<Lang>'+LanguageCode+'</Lang>' +
    '<UDF1 />' +
    '<UDF2 />' +
    '<UDF3 />';
    // '<TEST />';

    switch (paymentName) {
      case 'astroPayCards':
        return defaultXMLData + 
        '<Value>'+data.value+'</Value>' +
        '<Email>'+data.email+'</Email>' +
        '<ORef>'+data.oRef+'</ORef>' +
        '<Curr>'+data.currencyCode+'</Curr>' +
        '<ForceBank>ASTROPAY</ForceBank>' +
        '<ActionType>1</ActionType>' +
        '</Transaction>';
      case 'cashTocode':
        return defaultXMLData +
        '<Value>'+data.value+'</Value>' +
        '<Email>'+data.email+'</Email>' +
        '<ORef>'+data.oRef+'</ORef>' +
        '<Curr>'+data.currencyCode+'</Curr>' +
        '<ActionType>1</ActionType>' +
        '<ForcePayment>CASHTOCODE</ForcePayment>' +
        '<RegName>'+data.regName+'</RegName>' +
        '<RegCountry>'+data.regCountry+'</RegCountry>' +
        '<DOB>'+data.birthDay+'</DOB>' +
        '<ClientAcc>'+data.clientAcc+'</ClientAcc>' +
        '</Transaction>';
      case 'ecoPayz':
        return defaultXMLData +
        '<Value>'+data.value+'</Value>' +
        '<Email>'+data.email+'</Email>' +
        '<ORef>'+data.oRef+'</ORef>' +
        '<Curr>'+data.currencyCode+'</Curr>' +
        '<ActionType>1</ActionType>' +
        '<ForcePayment>ECOPAYZV2</ForcePayment>' +
        '<RegName>'+data.regName+'</RegName>' +
        '<DOB>'+data.birthDay+'</DOB>' +
        '<ClientAcc>'+data.clientAcc+'</ClientAcc>' +
        '</Transaction>';
      case 'flexepin':
        return defaultXMLData +
        '<Value>'+data.value+'</Value>' +
        '<Email>'+data.email+'</Email>' +
        '<ORef>'+data.oRef+'</ORef>' +
        '<Curr>'+data.currencyCode+'</Curr>' +
        '<ActionType>1</ActionType>' +
        '<ForcePayment>FLEXEPIN</ForcePayment>' +
        '</Transaction>';
      case 'muchbetter':
        return defaultXMLData +
        '<Value>'+data.value+'</Value>' +
        '<Email>'+data.email+'</Email>' +
        '<ORef>'+data.oRef+'</ORef>' +
        '<Curr>'+data.currencyCode+'</Curr>' +
        '<ActionType>1</ActionType>' +
        '<ForcePayment>MUCHBETTER</ForcePayment>' +
        '<MobileNo>'+data.mobileNumber+'</MobileNo>' +
        '</Transaction>';
      case 'octaPay':
        return defaultXMLData +
        '<Value>'+data.value+'</Value>' +
        '<Email>'+data.email+'</Email>' +
        '<ORef>'+data.oRef+'</ORef>' +
        '<Curr>'+data.currencyCode+'</Curr>' +
        '<ActionType>1</ActionType>' +
        '<ForceBank>OCTAPAYDIRECT</ForceBank>' +
        '<MobileNo>'+data.mobileNumber+'</MobileNo>' +
        '<Address>'+data.address+'</Address>' +
        '<RegCountry>'+data.regCountry+'</RegCountry>' +
        '<CIP>'+data.cIP+'</CIP>' +
        '<RegName>'+data.regName+'</RegName>' +
        '</Transaction>';
      case 'paypal':
        return defaultXMLData +
        '<Value>'+data.value+'</Value>' +
        '<Email>'+data.email+'</Email>' +
        '<ORef>'+data.oRef+'</ORef>' +
        '<Curr>'+data.currencyCode+'</Curr>' +
        '<ActionType>1</ActionType>' +
        '<ForcePayment>PAYPAL</ForcePayment>' +
        '<OrderDescription>'+data.orderDescription+'</OrderDescription>' +
        '<ProductName>'+data.productName+'</ProductName>' +
        '<Quantity>'+data.quantity+'</Quantity>' +
        '</Transaction>';
      case 'paySafe':
        return defaultXMLData +
        '<Value>'+data.value+'</Value>' +
        '<Email>'+data.email+'</Email>' +
        '<ORef>'+data.oRef+'</ORef>' +
        '<Curr>'+data.currencyCode+'</Curr>' +
        '<ActionType>1</ActionType>' +
        '<ForcePayment>PSC</ForcePayment>' +
        '<CIP>'+data.cIP+'</CIP>' +
        '</Transaction>';
      case 'paySafeV2':
        return defaultXMLData +
        '<Value>'+data.value+'</Value>' +
        '<Email>'+data.email+'</Email>' +
        '<ORef>'+data.oRef+'</ORef>' +
        '<Curr>'+data.currencyCode+'</Curr>' +
        '<ActionType>1</ActionType>' +
        '<ForcePayment>PSCV2</ForcePayment>' +
        '<RegName>'+data.regName+'</RegName>' +
        '<DOB>'+data.birthDay+'</DOB>' +
        '</Transaction>';
      case 'venusPoint':
        return defaultXMLData +
        '<Value>'+data.value+'</Value>' +
        '<Email>'+data.email+'</Email>' +
        '<ORef>'+data.oRef+'</ORef>' +
        '<Curr>'+data.currencyCode+'</Curr>' +
        '<ActionType>1</ActionType>' +
        '<ForcePayment>VENUSPOINT</ForcePayment>' +
        '<ClientAcc>'+data.clientAcc+'</ClientAcc>' +
        '</Transaction>';
      case 'zimpler':
        return defaultXMLData +
        '<Value>'+data.value+'</Value>' +
        '<Email>'+data.email+'</Email>' +
        '<ORef>'+data.oRef+'</ORef>' +
        '<Curr>'+data.currencyCode+'</Curr>' +
        '<ActionType>1</ActionType>' +
        '<ForcePayment>ZIMPLER</ForcePayment>' +
        '<RegName>'+data.regName+'</RegName>' +
        '<InvoiceDesc>'+data.inVoiceDesc+'</InvoiceDesc>' +
        '<MobileNo>'+data.mobileNumber+'</MobileNo>' +
        '<RegCountry>'+data.regCountry+'</RegCountry>' +
        '</Transaction>';
        case 'jnet':
        return defaultXMLData +
        '<Value>'+data.value+'</Value>' +
        '<Email>'+data.email+'</Email>' +
        '<ORef>'+data.oRef+'</ORef>' +
        '<Curr>'+data.currencyCode+'</Curr>' +
        '<ActionType>1</ActionType>' +
        '<ForcePayment>JNET</ForcePayment>' +
        '<RegName>'+data.regName+'</RegName>' +
        '<MobileNo>'+data.mobileNumber+'</MobileNo>' +
        '<Adress>'+data.Adress+'</Adress>' +
        '</Transaction>';
      default:
        break;
    }
}

exports.ApcoPayRedirection = async(req , res , next) => {
  console.log("here is ApcoPayRedirection");
  console.log(req.body);
  console.log("===============================================================");

  res.send(true);
  next();
}
exports.ApcoPayStatus = async(req , res , next) => {
  console.log("here is ApcoPayStatus");
  console.log(req.body);
  console.log("===============================================================");

  res.send(true);
  next();
}
exports.ApcoPayFailed = async(req , res , next) => {
  console.log("here is ApcoPayFailed");
  console.log(req.body);
  console.log("===============================================================");

  res.send(true);
  next();
}