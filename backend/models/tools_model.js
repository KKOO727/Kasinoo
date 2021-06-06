const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const basecontroller = require("../controller/basecontroller")

const toolgetoipblock_model = () =>{
    var  UserSchema = new Schema({
        ipaddress : {
            type : String,
            required : true
        },
        date: {
            type: Date,
        },
    });
        

    UserSchema.pre('save', function() {
        this.set({ date: basecontroller.Indiatime() });
    });

    return mongoose.model('ipblock_model', UserSchema)
}

module.exports ={
    toolgetoipblock_model : toolgetoipblock_model(),
}