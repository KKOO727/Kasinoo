import {AXIOS_REQUEST,alert} from "../auth/index"

function reduxload(rdata,dispatch){
    var data = rdata.data;
    var totalPages = rdata.pageset["totalPages"];
    var pages = rdata.pageset;
    var totalRecords = rdata.pageset["totalRecords"]
    dispatch({
        type: "GETDATANOTIFICATION",
        data: data,
        totalPages:totalPages,
        params : pages,
        totalRecords : totalRecords,
    });
}

export const getTotal = (filters) => {
    return async dispatch => {
        let rdata = await AXIOS_REQUEST("settings/getNotificationtotal",{filters},dispatch,true);
        if (rdata.status) {
            console.log(rdata)
            dispatch({type : "LOADDATANOTIFICATION" , data : rdata.data})
        } else {
            alert("error","error")
        }    
    }
}

export const resend = (row,params) => {
    return async dispatch => {
        let rdata = await AXIOS_REQUEST("settings/resendNotificationdetail",{params,row},dispatch,true);
        if (rdata.status) {
            console.log(rdata)
        } else {
            alert("error","error")
        }
    }
}

export const getData = (params,filters) =>{
    return async dispatch =>{
        let rdata = await AXIOS_REQUEST("settings/getNotificationdetail",{params,filters},dispatch,true);
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
        let rdata = await AXIOS_REQUEST("settings/savegetNotification",{row,params,filters},dispatch,true);
        if (rdata.status) {
            reduxload(rdata,dispatch)

        } else {
            alert("error","error")
        }
    }
}

export const update = (row,params,filters) =>{
    return async dispatch =>{
        let rdata = await AXIOS_REQUEST("settings/updategetNotification",{row,params,filters},dispatch,true);
        if (rdata.status) {
            reduxload(rdata,dispatch)
        } else {
            alert("error","error")
        }
    }
}

export const Delete = (row,params,filters) =>{
    return async dispatch =>{
        let rdata = await AXIOS_REQUEST("settings/deletegetNotification",{row,params,filters},dispatch,true);
        if (rdata.status) {
            reduxload(rdata,dispatch)
        } else {
            alert("error","error")
        }
    }
}