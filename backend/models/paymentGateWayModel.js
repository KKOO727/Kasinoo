const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const basecontroller = require("../controller/basecontroller")


const Paymentconfig = ()=>{
    var  UserSchema = new Schema({
        type           : { type : String,  default : '' },
        configData     : { type : Object,  default : {} },
        state          : { type : Boolean, default : false },
        createDate     : { type : Date,     },
    });

    UserSchema.pre('save', function() {
        this.set({ createDate: basecontroller.Indiatime() });
    });
    return mongoose.model("paymentconfiguration", UserSchema)
}

const Payment_history = ()=>{
    var  UserSchema = new Schema({
        type           : { type : String,  default : '' },
        order_no       : { type : String,  required : true },
        amount         : { type : Number,  default : 0 },
        lastbalance         : { type : Number,  default : 0 },
        updatedbalance         : { type : Number,  default : 0 },
        comment         : { type : String,  default : "" },
        email          : { type : String,  default : '' },
        userid: {
            type: Schema.Types.ObjectId, ref: 'user_users'
        },
        status         : { type : String,  default : '' },
        wallettype         : { type : String,  required:true },
        requestData    : { type : Object,  default : {} },
        resultData     : { type : Object,  default : {} },
        createDate     : { type : Date,    },        
        commission : { type : Number, default : 0 },
        transactionDate    : { type : Date,    },
    });

    
    UserSchema.pre('save', function() {
        this.set({ createDate: basecontroller.Indiatime() });
        this.set({ transactionDate: basecontroller.Indiatime() });
    });
    return mongoose.model("Payment_history", UserSchema)
}

const paymentuserdetail = ()=>{
    var  UserSchema = new Schema({
        // email            : {type : String,  default:''},
        userid: {
            type: Schema.Types.ObjectId, ref: 'user_users'
        },
        paymentconfigid  : {type : Schema.Types.ObjectId},
        paymentData      : {type : Object,  default:''},
    });
    return mongoose.model("Payment_userdetail", UserSchema)
}

const Payment_ourinfor = () =>{
    var  UserSchema = new Schema({
        name             : {type : String,  default:''},
        paymentconfigurationid             : {
            type: Schema.Types.ObjectId, ref: 'paymentconfiguration',
        },
        paymentType      : {type : String,  default:''},
        paymentMethodType: {type : Object,  default:{}},
        currency         : {type : String,  default:''},
        info             : {type : String,  default:''},
        image            : {type : String,  default:''},
        min              : {type : Number,  default:0},
        max              : {type : Number,  default:0},
        fee              : {type : Number,  default:0},
        order            : {type : Number,  default:0},
        depositBankCode  : {type : Object,  default:[{ value:'', label:'Select...'}]},
        status           : {type : Boolean, default : false},
        createDate       : {type : Date,   },
    });

    UserSchema.pre('save', function() {
        this.set({ createDate: basecontroller.Indiatime() });
    });
    return mongoose.model("paymentmenus", UserSchema)
}

const Payment_withdrawl_infor = () =>{
    var  UserSchema = new Schema({
        email            : {type : String,  default:''},
        type             : {type : String,  default:''},
        paymentData      : {type : Object,  default:''},
        createDate       : {type : Date,   },
    });

    UserSchema.pre('save', function() {
        this.set({ createDate: basecontroller.Indiatime() });
    });
    return mongoose.model("Paymentwithdrawluserdetail", UserSchema)
}

const payoutchannel = ()=>{
    var  UserSchema = new Schema({
        accountName           : { type : String,  require : true },
        bank           : { type : String,  require : true },
        status           : { type : Boolean,  default : false },
        createAt     : { type : Date,    },
        paymentconfigurationid             : {
            type: Schema.Types.ObjectId, ref: 'paymentconfiguration',
        },
    });

    UserSchema.pre('save', function() {
        this.set({ createAt: basecontroller.Indiatime() });
    });
    return mongoose.model("payoutchannel", UserSchema)
}

const PaymoroSubmitData = ()=>{
    var  UserSchema = new Schema({
        order_no           : { type : String,  require : true },
        content           : { type : String,  require : true },
        email : { type : String},
        date : {
            type : Date
        }
    });
    return mongoose.model("paymorosubmitdata", UserSchema)
}

const resstrictionDays = ()=>{
    var  UserSchema = new Schema({
        comment           : { type : String,  require : true },
        RestrictionDate           : { type : String,  require : true },
        type           : { type : String,  require : true },
    });
    return mongoose.model("resstrictionDays", UserSchema)
}

 

module.exports  = {
    PaymentMethod : Payment_withdrawl_infor(),
    Paymentconfig : Paymentconfig(),
    PaymentMenuModel : Payment_ourinfor(),
    TransactionsHistory : Payment_history(),
    paymentuserdetail : paymentuserdetail(),
    payoutchannel : payoutchannel(),
    PaymoroSubmitData : PaymoroSubmitData(),
    resstrictionDays : resstrictionDays()
}