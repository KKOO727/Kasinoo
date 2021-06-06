const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const basecontroller = require("../controller/basecontroller")


const BazaarModel = ()=>{
    var bazaarSchema = new Schema({
        bazaarname : {type : String,required : true},
        bazaartype : {type : String,required : true},
        ownership : {type : String,required : true},
        status : {type : Boolean,default : false},
        postCalled : {type : String,required : true},
        timers : {type : Object,required : true},
        updated_at: { type: Date, },
        gamelink : {type : Object,default :{}},
        resultmode : { type : Boolean , default : false},
        week : { type : Object , default : {}},
        blocktime : { type : Number , default : 0},
        hightlight : { type : Boolean , default : false},
        notification : { type : Boolean , default : false},
        isdelete : { type : Boolean , default : false}
    });

    bazaarSchema.pre('save', function() {
        this.set({ updated_at: basecontroller.Indiatime() });
    });
    return  mongoose.model("matka_Bazaar", bazaarSchema)
}

const GamesModel = () =>{
    var gameSchema = new Schema({
        name: { type: String, max: 50, min: 2 },
        image: String,
        bool : {type : String,required : true},
        bazaartype : {type : Object, default : {}},
        status: Boolean,
        updated_at: { type: Date,},
        isdelete : { type : Boolean , default : false}
    });

    gameSchema.pre('save', function() {
        this.set({ updated_at: basecontroller.Indiatime() });
    });
    return  mongoose.model("matka_Game", gameSchema)
}

const NumbersModel = () =>{
    var gameSchema = new Schema({
        gamenumbers: { type: Object, default : {} },
        bool : {type : String,required: true},
        updated_at: { type: Date,},
    });

    gameSchema.pre('save', function() {
        this.set({ updated_at: basecontroller.Indiatime() });
    });
    return  mongoose.model("matka_numbers", gameSchema)
}

const matka_betmodels = () =>{
    var gameSchema = new Schema({
        DATE: { type: Date },
        amount: { type: Number, required : true },
        winamount: { type: Number, required : true },
        
        betnumber: { type: String, required : true },
        bazaarid: { 
            type: Schema.Types.ObjectId, ref: 'matka_Bazaar'
        },
        gameid: { 
            type: Schema.Types.ObjectId, ref: 'matka_Game'
        },
        roundid: { type: String, required : true },
        transactionid: { type: String, required : true },
        detail : { type: Object, default : {} },
        status: { type: String, required : true },
        time_flag : {type : String,required : true},
        userid: {
            type: Schema.Types.ObjectId, ref: 'user_users'
        },
        type : {type: String,},
        name : {type: String,},
        
    });

    gameSchema.pre('save', function() {
        this.set({ DATE: basecontroller.Indiatime() });
    });
    return  mongoose.model("matka_betmodels", gameSchema)
}

const Result_model = () =>{
    var gameSchema = new Schema({
        jodiresult: { type: String,  },
        closeresult: { type: String,  },
        openresult: { type: String,  },
        startLinetimer : {type : String },
        bazaarid: { 
            type: Schema.Types.ObjectId, ref: 'matka_Bazaar' 
        },
        bazaartype: { type: Date, required : true },
        resultdate: { type: Date, required : true },
        userid: {
            type: Schema.Types.ObjectId, ref: 'user_users'
        },
        DATE: { type: Date, },
        update :{type : Boolean,default : false}
    });

    gameSchema.pre('save', function() {
        this.set({ DATE: basecontroller.Indiatime() });
    });
    return  mongoose.model("matka_result", gameSchema)
}


const SattaresstrictionDays = () =>{
    var gameSchema = new Schema({
        comment           : { type : String,  require : true },
        RestrictionDate           : { type : String,  require : true },
        bazaarid: { 
            type: Schema.Types.ObjectId, ref: 'matka_Bazaar' 
        },
    });
    return  mongoose.model("martka_restricdays", gameSchema)
}


const BazarTypeModel = () =>{
    var gameSchema = new Schema({
        name: { type: String, required : true},
        image: String,
        icon: String,
        bool : {type : String},
        status: Boolean,
        updated_at: { type: Date,},
        isdelete : { type : Boolean , default : false}
    });

    gameSchema.pre('save', function() {
        this.set({ updated_at: basecontroller.Indiatime() });
    });
    return  mongoose.model("matka_bazartype", gameSchema)
}
module.exports = {
    BazaarModel : BazaarModel(),
    GamesModel : GamesModel(),
    NumbersModel : NumbersModel(),
    matka_betmodels : matka_betmodels(),
    result_model : Result_model(),
    SattaresstrictionDays : SattaresstrictionDays(),
    BazarTypeModel : BazarTypeModel()
}
