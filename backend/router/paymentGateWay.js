const express = require('express')
const router = express.Router()
const PaymentInit = require("../controller/paymentController/init")
const authMiddleware = require("../middleware/middleware/authMiddleware");
const YaarPay = require("../controller/paymentController/YaarPay")
const Paygate10 = require("../controller/paymentController/Paygate10")
const Transaction = require("../controller/paymentController/Transaction")
const multer = require('multer');
const config = require('../db');
const BaseControll = require("../controller/basecontroller");
const configMiddleware = require("../middleware/middleware/configMiddleware")
const Paymorocontrol = require("../controller/paymentController/paymoro")

// const QpayPay = require("../controller/paymentController/QpayPay")
// const netcents = require("../controller/paymentController/netcents")
// const Razorpay = require("../controller/paymentController/Razorpay")
// const Cashfree = require("../controller/paymentController/Cashfree")
// const ApcoPayCon = require("../controller/paymentController/ApcoPay");

router.post("/Loadresstrictiondays",authMiddleware.isLoggedIn,PaymentInit.Loadresstrictiondays)
router.post("/Saveresstrictiondays",authMiddleware.isLoggedIn,PaymentInit.Saveresstrictiondays)
router.post("/Updateresstrictiondays",authMiddleware.isLoggedIn,PaymentInit.Updateresstrictiondays)
router.post("/deleteresstrictiondays",authMiddleware.isLoggedIn,PaymentInit.deleteresstrictiondays)


router.post("/getbanktotal",authMiddleware.isLoggedIn,PaymentInit.getbanktotal)
router.post("/getbankdetail",authMiddleware.isLoggedIn,PaymentInit.getbankdetail)
router.post("/savebankdetail",authMiddleware.isLoggedIn,PaymentInit.savebankdetail)
router.post("/updatebankdetail",authMiddleware.isLoggedIn,PaymentInit.updatebankdetail)
router.post("/deletebankdetail",authMiddleware.isLoggedIn,PaymentInit.deletebankdetail)

router.post("/getPayoutchannel",authMiddleware.isLoggedIn,PaymentInit.getPayoutchannel)
router.post("/savePayoutchannel",authMiddleware.isLoggedIn,PaymentInit.savePayoutchannel)
router.post("/updatePayoutchannel",authMiddleware.isLoggedIn,PaymentInit.updatePayoutchannel)
router.post("/deletePayoutchannel",authMiddleware.isLoggedIn,PaymentInit.deletePayoutchannel)
router.post("/activechangepayoutchnnel",authMiddleware.isLoggedIn,PaymentInit.activechangepayoutchnnel)

// payment menu manager
router.post("/adminmenuload",authMiddleware.isLoggedIn, PaymentInit.adminmenuload); //load
router.post("/menuupdate", authMiddleware.isLoggedIn, PaymentInit.menuupdate); // update
router.post("/menusave", authMiddleware.isLoggedIn,multer({dest:config.BASEURL}).any(),BaseControll.imageupload, PaymentInit.menusave); // save
router.post("/menudelete", authMiddleware.isLoggedIn, PaymentInit.menudelete) // delete

// player side deposit transaction history
router.post("/deposittransactionHistoryLoad",authMiddleware.isLoggedIn, Transaction.deposittransactionHistoryLoad)
router.post("/WithdrawHistoryLoad", authMiddleware.isLoggedIn,Transaction.WithdrawHistoryLoad)
router.post("/withdrawalCancel", authMiddleware.isLoggedIn,Transaction.withdrawalCancel)

// withdrawal cash

// player detail wallet state ment
router.post("/deposit_withdrawlhistoryload",authMiddleware.isLoggedIn,Transaction.deposit_withdrawl_historyload)


router.post("/adminWithdrawHistoryLoad", authMiddleware.isLoggedIn,Transaction.admin_WithdrawHistoryLoad)
router.post("/adminwithdrawal_total", authMiddleware.isLoggedIn,configMiddleware.paymentconfig,Transaction.adminwithdrawal_total)

// cms side 
router.post("/admindeposittransactionHistoryLoad",authMiddleware.isLoggedIn,Transaction.admindeposittransactionHistoryLoad)
router.post("/admindeposittransactionHistoryLoadTotal",authMiddleware.isLoggedIn,Transaction.admindeposittransactionHistoryLoadTotal)


router.post("/paymentConfigLoad", authMiddleware.isLoggedIn,PaymentInit.paymentConfigLoad)
router.post("/paymentConfigSave", authMiddleware.isLoggedIn,PaymentInit.paymentConfigSave)

// cms side
router.post("/Payout",authMiddleware.isLoggedIn,configMiddleware.paymentconfig, Transaction.Payout)
router.post("/cashpayout",authMiddleware.isLoggedIn,configMiddleware.paymentconfig, Transaction.cashpayout)
router.post("/menuloads",authMiddleware.isLoggedIn, configMiddleware.paymentconfig,PaymentInit.playermenuloads)

//yaarpay
router.post("/YaarPayCheckOut",authMiddleware.isLoggedIn,configMiddleware.paymentconfig, YaarPay.YaarPayCheckOut)
router.get("/YaarReturn",configMiddleware.paymentconfig, YaarPay.YaarReturn)
router.post("/YaarNotyfy", configMiddleware.paymentconfig,YaarPay.YaarNotyfy)
// router.post("/YaarResults", YaarPay.YaarResults)

// ruppypay
router.post("/Paygate10CheckOut",authMiddleware.isLoggedIn,configMiddleware.paymentconfig, Paygate10.Paygate10CheckOut)
router.post("/Paygate10Callback", Paygate10.Paygate10Callback)
router.post("/Paygate10CallbackW", Paygate10.Paygate10CallbackW)


router.post("/Paygate10CallbackC", Paygate10.Paygate10CallbackC)
router.post("/Paygate10CallbackCW", Paygate10.Paygate10CallbackCW)

router.post("/paymoroNotify",configMiddleware.paymentconfig,Paymorocontrol.paymoroNotify)
router.post("/paymoropayoutNotify",configMiddleware.paymentconfig,Paymorocontrol.paymoropayoutNotify)

router.post("/paymoroCheckout",Paymorocontrol.paymoroBanktransfer);
router.post("/paymoroNetBanking",authMiddleware.isLoggedIn,configMiddleware.paymentconfig,Paymorocontrol.paymoroNetBanking);
router.post("/paymoroWallet",authMiddleware.isLoggedIn,configMiddleware.paymentconfig,Paymorocontrol.paymoroWallet);
router.post("/paymoroUpi",authMiddleware.isLoggedIn,configMiddleware.paymentconfig,Paymorocontrol.paymoroUpi);
router.post("/payoutBankTransfer",Paymorocontrol.payoutBankTransfer);

router.post("/getpaymoroSubmitdata",Paymorocontrol.getpaymoroSubmitdata);

// router.post("/paymoroCheckout",Paymorocontrol.paymoroP2p);

// router.post("/QpayCheckOut", QpayPay.QpayCheckOut)
// router.post("/QpayResponse", QpayPay.QpayResponse)
// router.post("/QpayResults", QpayPay.QpayResults)

// router.post("/netcentCheckOut", netcents.netcentCheckOut)
// router.post("/netcents_cancel", netcents.netcents_cancel)
// router.post("/netcents_webhook", netcents.netcents_webhook)
// router.post("/netcentsResults", netcents.netcentsResults)

// router.post("/RazorpayCheckOut", Razorpay.RazorpayCheckOut)
// router.post("/RazorpayResponse", Razorpay.RazorpayResponse)
// router.post("/RazorpayWithdraw", Razorpay.RazorpayWithdraw)

// router.post("/CashfreeCheckOut", Cashfree.CashfreeCheckOut)
// router.post("/CashfreeSecretKey", Cashfree.CashfreeSecretKey)
// router.post("/CashfreeResponse", Cashfree.CashfreeResponse)
// router.post("/CashfreeResults", Cashfree.CashfreeResults)


// router.post("/Paygate10Withdraw", Paygate10.Paygate10Withdraw)

// router.post("/ApcoPayCheckOut" , ApcoPayCon.ApcoCheckout)
// router.post("/ApcoPayRedirection" , ApcoPayCon.ApcoPayRedirection)
// router.post("/ApcoPayStatus" , ApcoPayCon.ApcoPayStatus)
// router.get("/ApcoPayFailed" , ApcoPayCon.ApcoPayFailed)

module.exports = router;