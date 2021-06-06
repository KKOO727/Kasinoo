import {AXIOS_REQUEST,alert} from "../auth/index"

function reduxload(rdata,dispatch){
    var data = rdata.data;
    var totalPages = rdata.pageset["totalPages"];
    var pages = rdata.pageset;
    var totalRecords = rdata.pageset["totalRecords"]
    dispatch({
        type: "GETDATATOPGAMELIST",
        data: data,
        totalPages:totalPages,
        params : pages,
        totalRecords : totalRecords,
        typeoptions : rdata.typeoptions
    });
}


export const getData = (params,filters) =>{
    return async dispatch =>{
        let rdata = await AXIOS_REQUEST("providermanager/topgamesload",{params,filters},dispatch,true);
        if (rdata.status) {
            console.log(rdata)
            reduxload(rdata,dispatch)
        } else {
            alert("error","error")
        }
    }
}


export const menuupdate = (row,params,filters) =>{
    return async dispatch =>{
        let rdata = await AXIOS_REQUEST("providermanager/topgamesupdate",{row,params,filters},dispatch,true);
        if (rdata.status) {
            reduxload(rdata,dispatch)
        } else {
            alert("error","error")
        }
    }
}

export const menudelete = (row,params,filters) =>{
    return async dispatch =>{
        let rdata = await AXIOS_REQUEST("providermanager/topgamesdelete",{row,params,filters},dispatch,true);
        if (rdata.status) {
            reduxload(rdata,dispatch)
            alert("success","success")
        } else {
            alert("error","error")
        }
    }
}