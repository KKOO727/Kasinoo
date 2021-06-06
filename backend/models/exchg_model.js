const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const exchgHeaderModel = () =>{
    const exchgSchema = new Schema({
        Id: { type : Number, required : true },
        Name: { type : String, required : true },
        icon : { type : String, default : "" },
        viewBox :{ type : String, default : "" },
        color :{ type : String, default : "" },
        status : {type : Boolean , default : false},
    });
    return mongoose.model('exchg_header', exchgSchema)
}

const exchgBetModel = () =>{
    const exchgSchema = new Schema({
        Price: { type: Number, required: true },
        Name: { type: String, required: true },
        matchName: { type: String, required: true },
        marketName: { type: String, required: true },
        SelectionId: { type: Number, required: true },
        ExpectedSelectionResetCount: { type: Number, required: true },
        WithdrawalSequenceNumber: { type: Number, required: true },
        Polarity: { type: Number, required: true },
        Stack: { type: Number, required: true },
        PunterReferenceNumber: { type: String, required: true }
    });
    return mongoose.model('exchg_bet', exchgSchema)
}

const exchg_opentingmarket = () =>{
    const exchgSchema = new Schema({
        socketuser: {
            type: Schema.Types.ObjectId, ref: 'user_socket',
        },
        marketdata :{ type : Object, default : {} },
        marketid :{ type : String, required : true },
        userid :{ type : String, required : true },
    });
    return mongoose.model('exchg_opentingmarket', exchgSchema)
}

module.exports ={
    exchg_opentingmarket : exchg_opentingmarket(),
    exchgHeaderModel : exchgHeaderModel(),
    exchgBetModel : exchgBetModel(),
}