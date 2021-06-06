import {AXIOS_REQUEST,alert} from "../auth/index"

function reduxload(rdata,dispatch){
    var data = rdata.data;
    var totalPages = rdata.pageset["totalPages"];
    var pages = rdata.pageset;
    var totalRecords = rdata.pageset["totalRecords"]
    dispatch({
        type: "GETDATABANKDETAIl",
        data: data,
        totalPages:totalPages,
        params : pages,
        totalRecords : totalRecords,
    });
}

export const getTotal = (filters) => {
    return async dispatch => {
        let rdata = await AXIOS_REQUEST("paymentGateWay/getbanktotal",{filters},dispatch,true);
        if (rdata.status) {
            console.log(rdata)
            dispatch({type : "LOADBANKDETAIL" , data : rdata.data})
        } else {
            alert("error","error")
        }    
    }
}

export const getData = (params,filters) =>{
    return async dispatch =>{
        let rdata = await AXIOS_REQUEST("paymentGateWay/getbankdetail",{params,filters},dispatch,true);
        if (rdata.status) {
            console.log(rdata)
            reduxload(rdata,dispatch)
        } else {
            alert("error","error")
        }
    }
}

export const save = (row,params,filters) =>{
    return async dispatch =>{
        let rdata = await AXIOS_REQUEST("paymentGateWay/savebankdetail",{row,params,filters},dispatch,true);
        if (rdata.status) {
            reduxload(rdata,dispatch)

        } else {
            alert("error","error")
        }
    }
}

export const update = (row,params,filters) =>{
    return async dispatch =>{
        let rdata = await AXIOS_REQUEST("paymentGateWay/updatebankdetail",{row,params,filters},dispatch,true);
        if (rdata.status) {
            reduxload(rdata,dispatch)
        } else {
            alert("error","error")
        }
    }
}

export const Delete = (row,params,filters) =>{
    return async dispatch =>{
        let rdata = await AXIOS_REQUEST("paymentGateWay/deletebankdetail",{row,params,filters},dispatch,true);
        if (rdata.status) {
            reduxload(rdata,dispatch)
        } else {
            alert("error","error")
        }
    }
}