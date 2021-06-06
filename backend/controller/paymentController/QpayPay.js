const CryptoJS = require('crypto-js')
const BASECON = require("../basecontroller")
const { BalanceUpdate } = require("./init")
const { Paymentconfig, TransactionsHistory } = require("../../models/paymentGateWayModel")

exports.QpayCheckOut = async(req,res,next)=>{
    var data = req.body.params
    await Paymentconfig.findOne({ type : data.type }).then(async rdata =>{
        if(!rdata){
            res.json({ status : false, data: 'fail' })
            return next()
        }else if(!rdata.state){
            res.json({ status : false, data: data.type+' has been disabled.' })
            return next()
        }
        else{  
            var merchant_key = rdata.configData.merchant_key
            var merchant_id = rdata.configData.merchant_id
            var aggregator_id = rdata.configData.aggregator_id
            var hData = {
                order_no: (new Date()).getTime()+Math.floor((Math.random() * 100000) + 1),
                country: 'IND',
                countryCurrncy: 'INR',
                tranxnType: 'SALE',
                channel: 'WEB',
                payGateId: '',
                paymode: '',
                scheme: '',
                emiMonth: '',
                cardNo: '',
                expireMonth: '',
                expireYear: '',
                cvv2: '',
                cardName: '',
                customerName: '',
                emailId: '',
                mobileNo: '',
                uniqueId: '',
                ifUserLogged: 'Y',
                billaddress: '',
                billCity: '',
                billState: '',
                billCountry: '',
                billZip: '',
                shipaddress: '',
                shipCity: '',
                shipState: '',
                shipCountry: '',
                shipZip: '',
                shipDays: '',
                addressCount: '',
                itemCount: '',
                itemValue: '',
                itemCategory: '',
                udf1: '',
                udf2: '',
                udf3: '',
                udf4: '',
                udf5: '',
            }
            var return_elements = {}

            return_elements.me_id = merchant_id

            var txn_details = aggregator_id + '|' + merchant_id.toString() + '|' +  hData.order_no.toString() + '|' + data.amount.toString() + '|'+ hData.country + '|' + hData.countryCurrncy + '|' + hData.tranxnType + '|' + rdata.configData.success_url + '|'+ rdata.configData.failure_url + '|' + hData.channel


            return_elements.txn_details = Qpayencode(txn_details.toString().trim(), merchant_key.toString())


            return_elements.txn_details = Qpayencode(txn_details.toString().trim(), merchant_key.toString(), rdata.configData.generate_key)
            
            var pg_details = hData.payGateId + '|' + hData.paymode + '|' + hData.scheme + '|' + hData.emiMonth
            return_elements.pg_details = Qpayencode(pg_details, merchant_key, rdata.configData.generate_key)
            
            var card_details =  hData.cardNo +'|' + hData.expireMonth + '|' + hData.expireYear + '|' + hData.cvv2 +'|' + hData.cardName
            return_elements.card_details = Qpayencode(card_details, merchant_key, rdata.configData.generate_key)
            
            var cust_details = hData.customerName + '|' + hData.emailId + '|' + hData.mobileNo +'|' + hData.uniqueId + '|'+ hData.ifUserLogged
            return_elements.cust_details = Qpayencode(cust_details, merchant_key, rdata.configData.generate_key)
            
            var bill_details = hData.billaddress + '|' + hData.billCity + '|' + hData.billState + '|' + hData.billCountry + '|' + hData.billZip
            return_elements.bill_details = Qpayencode(bill_details, merchant_key, rdata.configData.generate_key)
            
            var ship_details = hData.shipaddress + '|' + hData.shipCity + '|' + hData.shipState + '|' + hData.shipCountry + '|' + hData.shipZip + '|' + hData.shipDays + '|' + hData.addressCount
            return_elements.ship_details = Qpayencode(ship_details, merchant_key, rdata.configData.generate_key)

            var item_details = hData.itemCount + '|' + hData.itemValue + '|' + hData.itemCategory
            return_elements.item_details = Qpayencode(item_details, merchant_key, rdata.configData.generate_key)
            
            var other_details = hData.udf1 + '|' + hData.udf2 + '|' + hData.udf3 + '|' + hData.udf4 +'|' + hData.udf5
            return_elements.other_details = Qpayencode(other_details, merchant_key, rdata.configData.generate_key)

            var transactiondata = {
                type: data.type,
                email : data.email,
                order_no : hData.order_no,
                status : 'deposit',
                requestData : data,
                amount : data.amount
            }
            var savehandle = await BASECON.data_save(transactiondata, TransactionsHistory)
            if(!savehandle){
                res.json({status : false,data : "fail"})
                return next()
            }else{
                res.json({ status : true, data : return_elements, request_url: rdata.configData.request_url})
                return next()
            }
        }
    })
}

exports.QpayResponse = async(req,res,next)=>{
    await Paymentconfig.findOne({ type : 'Qpay' }).then(async rdata =>{
        if(!rdata){
            res.json({ status : false, data: 'fail' })
            return next()
        }else{
            let return_elements = {}
            let merchant_key = rdata.configData.merchant_key
            let txn_response1 = req.body.txn_response ? req.body.txn_response : ''
            txn_response1 = Qpaydecrypt(txn_response1, merchant_key, rdata.configData.generate_key)
            let txn_response_arr = txn_response1.split('|')	
            let txn_response = {}
            txn_response.ag_id = txn_response_arr[0]?txn_response_arr[0]:''
            txn_response.me_id = txn_response_arr[1]?txn_response_arr[1]:''
            txn_response.order_no = txn_response_arr[2]?txn_response_arr[2]:''
            txn_response.amount = txn_response_arr[3]?txn_response_arr[3]:''
            txn_response.country = txn_response_arr[4]?txn_response_arr[4]:''
            txn_response.currency = txn_response_arr[5]?txn_response_arr[5]:''
            txn_response.txn_date = txn_response_arr[6]?txn_response_arr[6]:''
            txn_response.txn_time = txn_response_arr[7]?txn_response_arr[7]:''
            txn_response.ag_ref = txn_response_arr[8]?txn_response_arr[8]:''
            txn_response.pg_ref = txn_response_arr[9]?txn_response_arr[9]:''
            txn_response.status = txn_response_arr[10]?txn_response_arr[10]:''
            txn_response.res_code = txn_response_arr[11]?txn_response_arr[11]:''
            txn_response.res_message = txn_response_arr[12]?txn_response_arr[12]:''
        
            return_elements.txn_response = txn_response
            
            let pg_details1 = req.body.pg_details ? req.body.pg_details: ''
            pg_details1 = Qpaydecrypt(pg_details1, merchant_key, rdata.configData.generate_key)
            let pg_details_arr = pg_details1.split('|')
            let pg_details = {}
            pg_details.pg_id = pg_details_arr[0]?pg_details_arr[0]:''
            pg_details.pg_name = pg_details_arr[1]?pg_details_arr[1]:''
            pg_details.paymode = pg_details_arr[2]?pg_details_arr[2]:''
            pg_details.emi_months = pg_details_arr[3]?pg_details_arr[3]:''
        
            return_elements.pg_details = pg_details
            
            let fraud_details1 = req.body.fraud_details ? req.body.fraud_details : ''
            fraud_details1 = Qpaydecrypt(fraud_details1, merchant_key, rdata.configData.generate_key)
            let fraud_details_arr = fraud_details1.split('|')
            let fraud_details = {}
            fraud_details.fraud_action = fraud_details_arr[0]?fraud_details_arr[0]:''
            fraud_details.fraud_message = fraud_details_arr[1]?fraud_details_arr[1]:''
            fraud_details.score = fraud_details_arr[0]?fraud_details_arr[0]:''
        
            return_elements.fraud_details = fraud_details
            
            let other_details1 = req.body.other_details ? req.body.other_details : ''
            other_details1 = Qpaydecrypt(other_details1, merchant_key, rdata.configData.generate_key)
            let other_details_arr = other_details1.split('|')
            let other_details = {}
            other_details.udf_1 = other_details_arr[0]?other_details_arr[0]:''
            other_details.udf_2 = other_details_arr[1]?other_details_arr[1]:''
            other_details.udf_3 = other_details_arr[2]?other_details_arr[2]:''
            other_details.udf_4 = other_details_arr[3]?other_details_arr[3]:''
            other_details.udf_5 = other_details_arr[4]?other_details_arr[4]:''
        
            return_elements.other_details = other_details

            var transactiondata = { 
                type : rdata.type,
                order_no : return_elements.txn_response.order_no,
                resultData : {
                    txn_response : return_elements.txn_response,
                    pg_details : return_elements.pg_details,
                    fraud_details : return_elements.fraud_details,
                    other_details : return_elements.other_details,
                }
            }
            var condition = { order_no : return_elements.txn_response.order_no}
            var udata = await BASECON.BfindOneAndUpdate(TransactionsHistory,condition,transactiondata)
                if(!udata){
                    res.json({ status : false, data: 'fail' })
                    return next()
                }else{
                    await BalanceUpdate(udata.email, parseFloat(udata.amount))
                    res.writeHead(301,{ Location : rdata.configData.redirect_url+'/:'+return_elements.txn_response.order_no})
                    res.end()
                    return next()
                }
        }
    })
}

exports.QpayResults = async(req,res,next)=>{
    var order_no = req.body.order_no
    await TransactionsHistory.findOne({ order_no : order_no, type:'Qpay' }).then(rdata =>{
        if(!rdata){
            res.json({ status : false, data: 'fail' })
            return next()
        }else{  
            res.json({ status : true, data : rdata })
            return next()
        }
    })
}

exports.QpayPayout = async(req,res,next)=>{
    var data = req.body
    res.json({status : true,data : data})
    return next()
}

function Qpayencode(text, skey, generate_key) {
	var base64Iv = generate_key
	var key = CryptoJS.enc.Base64.parse(skey)
	var iv = CryptoJS.enc.Utf8.parse(base64Iv)
	var encrypted = CryptoJS.AES.encrypt(text, key, {iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7})    
    var decryptedData = encrypted.toString()
	return decryptedData
}

function Qpaydecrypt(text, skey, generate_key) {
    var base64Iv = generate_key
    var key = CryptoJS.enc.Base64.parse(skey)
    var iv = CryptoJS.enc.Utf8.parse(base64Iv)
    var decrypted = CryptoJS.AES.decrypt(text, key, {iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7})
    var decryptedData = decrypted.toString(CryptoJS.enc.Utf8)
    return decryptedData
}