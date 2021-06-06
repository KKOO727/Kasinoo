const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const basecontroller = require("../controller/basecontroller")


const BonusMenumodel = () =>{
    var  UserSchema = new Schema({
        bonusid : {
            type : String,
            required : true,
        },
        Bonusname : {
            type : String,
            required : true,
        },
      
        max : {
            type : Number,
            required : true,
        },
        min : {
            type : Number,
            required : true,
        },
        timeline : {
            type : Number,
            required : true,
        },
        percent : {
            type : Number,
            required : true,
        },
        wager : {
            type : Number,
            required : true,
        },
        status : {
            type : Boolean,
            default :false
        },
        date: {
            type: Date,
        },
        comment : {
            type : String,
            default : true
        },
        isdelete : {
            type : Boolean,
            default :false
        },
       
    });

    UserSchema.pre('save', function() {
        this.set({ date: basecontroller.Indiatime() });
    });
    return mongoose.model("promotion_bonusmodel", UserSchema)
}

const BonusHistory = () =>{
    var  UserSchema = new Schema({
        bonusid : { type: Schema.Types.ObjectId, ref: 'promotion_bonusmodel' },
        userid : { type: Schema.Types.ObjectId, ref: 'user_users' },
        status : {type : String , require : true},// 0 => pending 1 => approved 2 => declined 
        createdAt: { type: Date,  },
        expiredAt: { type: Date,  },
        amount : {
            type : Number,
            required : true,
        },
        lastbalance : {
            type : Number,
            required : true,
        },
        updatedbalance : {
            type : Number,
            required : true,
        },
        walletbalance : {
            type : Number,
            required : true,
        }
    });

    UserSchema.pre('save', function() {
        this.set({ expiredAt: basecontroller.Indiatime() });
        this.set({ createdAt: basecontroller.Indiatime() });
    });
    UserSchema.pre('find', function () {
        this.populate('bonusid');
       
    });

    return mongoose.model("promotion_bonushistory", UserSchema)
}


const BonusConfig = () =>{
    var  UserSchema = new Schema({
        type : {
            type : String,
            required : true,
        },
        bonusid : { type: Schema.Types.ObjectId, ref: 'promotion_bonusmodel' },
        status : {
            type : Boolean,
            default :false
        },
    });

    UserSchema.pre('save', function() {
        this.set({ date: basecontroller.Indiatime() });
    });
    return mongoose.model("promotion_config", UserSchema)
}

module.exports ={
    BonusMenumodel : BonusMenumodel(),
    BonusHistory : BonusHistory(),
    BonusConfig : BonusConfig()
}
