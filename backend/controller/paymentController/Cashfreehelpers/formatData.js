const enums = require('./enums');
const renameCardField = (valueArr, obj) =>{
    valueArr.forEach(key => {
        obj['card_'+key] = obj[key];
        delete obj[key];
    });
}
module.exports = {
    formatSeamlessPro: function(paymentOption, obj){
        const {paymentOptions} = enums;
        
        try{
            switch(paymentOption){
                case paymentOptions.card:{
                    renameCardField(['number', 'holder', 'expiryMonth', 'expiryYear', 'cvv'], obj);
                    break;
                }
                case paymentOptions.nb:{
                    obj.paymentCode = obj.code;
                    delete obj.code;
                    break;
                }
                default: {
                    throw {name: "paymentOption not found", message: "provided payment option is not supported"};
                }
            }
        }
        catch(err){
            throw err;
        }

    }
}