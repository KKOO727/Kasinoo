const crypto = require('crypto');

function valueCleaner(keyword, data){
   return data[keyword]? data[keyword]:'';
}

//TODO: switch below methods to use value cleaner

module.exports = {
    signatureRequest1: function (data, secretKey){
        //for checkout
        var keys = Object.keys(data);
        keys.sort();
        signatureData = "";
        keys.forEach((key)=>{
            signatureData += key+data[key];
        });
        return crypto.createHmac('sha256',secretKey).update(signatureData).digest('base64');
    },

    signatureResponse1: function (data, secretKey){
        signatureData = data["orderId"] + data["orderAmount"] + data["referenceId"] + 
                        data["txStatus"] + data["paymentMode"] + data["txMsg"] + data["txTime"];
        return crypto.createHmac('sha256',secretKey).update(signatureData).digest('base64');
    },

    signatureRequest2: function(data, secretKey){
        //for merchant hosted
        signatureData = "appId=" + data["appId"] + "&orderId=" + data["orderId"] + "&orderAmount=" + data["orderAmount"]
               + "&returnUrl=" + data["returnUrl"] + "&paymentModes=" + valueCleaner("paymentModes",data);
        return crypto.createHmac('sha256',secretKey).update(signatureData).digest('base64');
    },

    signatureRequest3: function(data, secretKey){
        //for seamless basic
        signatureData ="appId=" + data["appId"] + "&orderId=" + data["orderId"] + "&orderAmount=" + data["orderAmount"] + "&customerEmail=" 
                    + data["customerEmail"] + "&customerPhone=" + data["customerPhone"] + "&orderCurrency=" + "INR";
        return crypto.createHmac('sha256',secretKey).update(signatureData).digest('base64');
    }
}