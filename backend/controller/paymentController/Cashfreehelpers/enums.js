module.exports = {
    paymentTypeEnum:{
        checkout: "CHECKOUT",
        merchantHosted:"MERCHANTHOSTED",
        seamlessbasic:"SEAMLESSBASIC",
    },

    transactionStatusEnum:{
        cancelled: "CANCELLED",
        failed: "FAILED",
        success: "SUCCESS"
    },
    
    paymentOptions: {
        card: "card",
        nb: "nb",
        wallets: "wallet",
        upi: "upi"
    }
}