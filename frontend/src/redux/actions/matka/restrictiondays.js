import {AXIOS_REQUEST,alert} from "../auth/index"

function reduxload(rdata,dispatch){
    var data = rdata.data;
    var totalPages = rdata.pageset["totalPages"];
    var pages = rdata.pageset;
    var totalRecords = rdata.pageset["totalRecords"]
    dispatch({
        type: "SattaGETPAYMENTRESTRICTIONDAYS",
        data: data,
        totalPages:totalPages,
        params : pages,
        totalRecords : totalRecords,
        options : rdata.options
    });
}

export const getData = (params,filters) =>{
    return async dispatch =>{
        let rdata = await AXIOS_REQUEST("satta/Loadresstrictiondays",{params,filters},dispatch,true);
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
        let rdata = await AXIOS_REQUEST("satta/Saveresstrictiondays",{row,params,filters},dispatch,true);
        if (rdata.status) {
            reduxload(rdata,dispatch)
        } else {
            alert("error","error")
        }
    }
}

export const update = (row,params,filters) =>{
    return async dispatch =>{
        let rdata = await AXIOS_REQUEST("satta/Updateresstrictiondays",{row,params,filters},dispatch,true);
        if (rdata.status) {
            reduxload(rdata,dispatch)
        } else {
            alert("error","error")
        }
    }
}

export const Delete = (row,params,filters) =>{
    return async dispatch =>{
        let rdata = await AXIOS_REQUEST("satta/deleteresstrictiondays",{row,params,filters},dispatch,true);
        if (rdata.status) {
            reduxload(rdata,dispatch)
        } else {
            alert("error","error")
        }
    }
}