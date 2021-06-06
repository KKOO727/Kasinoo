import {AXIOS_REQUEST,alert} from "../auth/index"

function reduxload(rdata,dispatch){
    var data = rdata.data;
    var totalPages = rdata.pageset["totalPages"];
    var pages = rdata.pageset;
    var totalRecords = rdata.pageset["totalRecords"]
    dispatch({
        type: "GETDATAPAYOUTCHANNEL",
        data: data,
        totalPages:totalPages,
        params : pages,
        totalRecords : totalRecords,
        typeoptions : rdata.typeoptions,
        paymoroBanks : rdata.paymoroBanks,
        yaarpaybanks : rdata.yaarpaybanks,
    });
}


export const getData = (params) =>{
    return async dispatch =>{
        let rdata = await AXIOS_REQUEST("paymentGateWay/getPayoutchannel",{params},dispatch,true);
        if (rdata.status) {
            console.log(rdata)
            reduxload(rdata,dispatch)
        } else {
            alert("error","error")
        }
    }
}

export const save = (row,params) =>{
    return async dispatch =>{
        let rdata = await AXIOS_REQUEST("paymentGateWay/savePayoutchannel",{row,params},dispatch,true);
        if (rdata.status) {
            reduxload(rdata,dispatch)

        } else {
            alert("error","error")
        }
    }
}

export const update = (row,params) =>{
    return async dispatch =>{
        let rdata = await AXIOS_REQUEST("paymentGateWay/updatePayoutchannel",{row,params},dispatch,true);
        if (rdata.status) {
            reduxload(rdata,dispatch)
        } else {
            alert("error","error")
        }
    }
}

export const activechange = (row,params) => {
    return async dispatch =>{
        let rdata = await AXIOS_REQUEST("paymentGateWay/activechangepayoutchnnel",{row,params},dispatch,true);
        if (rdata.status) {
            reduxload(rdata,dispatch)
        } else {
            alert("error","error")
        }
    }
}

export const Delete = (row,params) =>{
    return async dispatch =>{
        let rdata = await AXIOS_REQUEST("paymentGateWay/deletePayoutchannel",{row,params},dispatch,true);
        if (rdata.status) {
            reduxload(rdata,dispatch)
        } else {
            alert("error","error")
        }
    }
}