const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const basecontroller = require("../controller/basecontroller")

const Configuration = () =>{
    var  UserSchema = new Schema({
        key : {
            type : String,
            default : ""
        },
        value : {
            type : Object,
            required : true
        },
    });
    return mongoose.model("setting_credential", UserSchema)
}

const GlobalConfig = () =>{
    var  UserSchema = new Schema({
        key : {
            type : String,
            default : ""
        },
        value : {
            type : Object,
            required : true
        },
    });
    return mongoose.model("setting_global", UserSchema)
}


const TypeModel = () =>{
    var  UserSchema = new Schema({
        text : {
            type : String,
            required : true
        },
        type : {
            type : String,
            required : true
        },
        order : {
            type : Number,
            required : true
        },
    });
    return mongoose.model("setting_type", UserSchema)
}


const LanguageModel = () =>{
    var  UserSchema = new Schema({
        text : {
            type : String,
            required : true
        },
        code : {
            type : String,
            required : true
        },
        order : {
            type : Number,
            required : true
        },
    });
    return mongoose.model("setting_language", UserSchema)
}

const NotificationModel = () =>{
    var  UserSchema = new Schema({
        createdAt: { type: Date,  },
        expiredAt: { type: Date,  },
        title : {
            type : String,
            default : ""
        },
        body : {
            type : String,
            default : ""
        },
        userid : {
            type : String,
            default : ""
        },
        // status : {
        //     type : Boolean,
        //     default : false
        // }
        
    });

    UserSchema.pre('save', function() {
        this.set({ expiredAt: basecontroller.Indiatime() });
        this.set({ createdAt: basecontroller.Indiatime() });
    });
    
    return mongoose.model("setting_notification", UserSchema)
}


module.exports ={
    Configuration : Configuration(),
    GlobalConfig : GlobalConfig(),
    NotificationModel : NotificationModel(),
    TypeModel : TypeModel(),
    LanguageModel : LanguageModel()
}