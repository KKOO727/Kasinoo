const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const PROVIDERMODELS = ()=>{
    var  UserSchema = new Schema({
        type: {
            type: Object,
            default : {}
        },  
        provider: {
            type: String,
            required  :true,
        },
        text: {
            type: String,
            required  :true,
        },
        bool : {
            type : Object,
            required : true
        },
        order : {
            type : Number,
            default : 0
        },
        status : {
            type : Boolean,
            default : false
        },
        Route : {
            type : Boolean,
            default : false
        },
        Money : {
            type : String,
            required : true
        },
        Percentage : {
            type : String,
            required : true
        },
        currency : {
            type : String,
            required : true
        },
        Type : {
            type : String,
            required : true
        },
        LAUNCHURL : {
            type : String,
            required : true
        },
        Agregator : {
            type : String,
            required : true
        }

    });
  return  mongoose.model("game_gameprovider", UserSchema)
}

const GAMELISTMODEL = () =>{
    var  UserSchema = new Schema({
        TYPE: {
            type: String,
            default : ''
        },
        ID : {
            type : String,
            default : ''
        },
        NAME : {
            type : String,
            default : ''
        },    
        status : {
            type : Boolean,
            default : false
        },
        isdelete : {
            type : Boolean,
            default : false
        },
        
        // fpstatus : {
        //     type : Boolean,
        //     default : false
        // },
        providerid : {
            type: Schema.Types.ObjectId, ref: 'game_gameprovider',
        },
        PROVIDERID :{
            type : String,
            default : ""
        },
        WITHOUT : {
            type:Object,
            default :{
                maxbet : 0,
                minbet : 0
            }
        },
        LAUNCHURL : {
            type : String,
            required : true
        },
        image : {
            type : String,
            default : ""
        },
        order :{
            type : Number,
            required : true
        }
    });

    // UserSchema.pre('find', function () {
    //     // `this` is an instance of mongoose.Query
    //     this.select([ "TYPE","ID","TYPE","order","image","LAUNCHURL","WITHOUT","PROVIDERID","status","NAME"]);
    // });
   

    // UserSchema.pre('findOne', function () {
    //     // `this` is an instance of mongoose.Query
    //     this.select([ "TYPE","ID","TYPE","order","image","LAUNCHURL","WITHOUT","PROVIDERID","status","NAME"]);
    // });
    return mongoose.model("game_game_list", UserSchema);



}


const FIRSTPAGE_GAMELIST_MODEL = ()=>{
    var  UserSchema = new Schema({
        gameid : {
            type: Schema.Types.ObjectId, ref: 'game_game_list',
        },
        order : {
            type : Number,
            default : 0
        },
        status : {
            type : Boolean,
            default : false
        },
        type : {
            type : String,
            required : true
        }
    });
  return  mongoose.model("game_firstpage_list", UserSchema)
}


const TopGamelistmodel = ()=>{
    var  UserSchema = new Schema({
        gameid : {
            type: Schema.Types.ObjectId, ref: 'game_game_list',
        },
        order : {
            type : Number,
            default : 0
        },
        status : {
            type : Boolean,
            default : false
        },
        type : {
            type : String,
        }
    });
  return  mongoose.model("game_topgamelist", UserSchema)
}


const Mrslottygames = ()=>{
    var  UserSchema = new Schema({
      
        "brand name" : {
            type : String,
            required : true
        },
        "game id" : {
            type : String,
            required : true
        },
        "active" : {
            type : String,
            required : true
        }

    });
  return  mongoose.model("mrslottygames", UserSchema)
}



module.exports = {
    PROVIDERMODELS : PROVIDERMODELS(),
    GAMELISTMODEL : GAMELISTMODEL(),
    TopGamelistmodel : TopGamelistmodel(),
    FIRSTPAGE_GAMELIST_MODEL : FIRSTPAGE_GAMELIST_MODEL(),
    Mrslottygames  : Mrslottygames()
}
