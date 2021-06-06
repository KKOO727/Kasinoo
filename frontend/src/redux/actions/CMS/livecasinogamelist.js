import {AXIOS_REQUEST} from "../auth/index"
import {toast} from"react-toastify"
import {cmslivecasinoget,cmslivecasinoload} from "../../types"
import confirm from "reactstrap-confirm"


function reduxload(rdata,dispatch) {
    let output = rdata.data;
    var data = output.list;
    var totalPages = output.pageset["totalPages"];
    var pages = output.pageset;
    var totalRecords = output.pageset["totalRecords"];

    dispatch({
        type: cmslivecasinoload,
        data: data,
        totalPages:totalPages,
        params : pages,
        totalRecords : totalRecords,
        setproviderid : output.providerid
    });
}

export const ProviderTotal = (bool) =>{
    return async dispatch =>{
        var rdata = await AXIOS_REQUEST("providermanager/Livecasinoprovidertotal",{bool : bool},dispatch,true)
        if (rdata.status) {
            let output = rdata.data;
            console.log(output)
            dispatch({
                type: cmslivecasinoget,
                provideroptions :output.provideroptions,
                typeoptions : output.typeoptions,
            });
        }else{
            toast.error("fail");
        }
    }
}

export const ProviderLoad = (params,bool,filters) =>{
    return async(dispatch)=>{
        var rdata = await AXIOS_REQUEST("providermanager/LivecasinoproviderLoad",{bool,filters,params},dispatch,true)
        if (rdata.status) {
            reduxload(rdata,dispatch)
        }else{
            toast.error("fail");
        }
    }
}

export const ProviderCheck = (params,handle,bool,filters) =>{
    return async( dispatch) =>{
        var rdata = await AXIOS_REQUEST("providermanager/LivecasinoProviderCheck",{params,handle,bool,filters},dispatch,true);
        if(rdata.status){
            toast.success("success")
            reduxload(rdata,dispatch)

        }else{
            toast.error("error");
        }
    }
}



export const topgamescheck = (row,handle,params,bool,filters, topflag) =>{
    return async (dispatch) =>{
        var rdata = await AXIOS_REQUEST("providermanager/topgamescheck",{bool, row,handle,params,filters,topflag},dispatch,true);
        if(rdata.status){
            toast.success("success")
            // reduxload(rdata,dispatch)
        }else{
            toast.error(rdata.data);
        }
    }
}

export const firstpagecheck = (row,handle,params,bool,filters) =>{
    return async (dispatch) =>{

        var rdata = await AXIOS_REQUEST("providermanager/LivecasinoFirstPageCheck",{bool, row,handle,params,filters},dispatch,true);
        if(rdata.status){
            toast.success("success")
        }else{
            toast.error(rdata.data);
        }
    }
}

export const statuspagecheck = (row,handle,params,filters,bool) =>{
    return async (dispatch) =>{
        if (handle === row.status) {
            return;
        }
        var rdata = await AXIOS_REQUEST("providermanager/Livecasinostatuspagecheck",{handle,row,params,filters,bool},dispatch,true);
        if(rdata.status){
            toast.success("success")
            reduxload(rdata,dispatch)
        }else{
            toast.error("error");
        }
    }
}

export const GameinforChange = (row,params,bool,filters) =>{
    return async(dispatch)=>{
        console.log(params,bool,filters)
        var rdata = await AXIOS_REQUEST("providermanager/gameinforchange",{row ,params, bool,filters},dispatch,true);
        if(rdata.status){
            toast.success("success")
            reduxload(rdata,dispatch)

        }else{
            toast.error("error");
        }
    }
}

export const Livecasinoitemsadd = (row,params,filters,bool) =>{
    return async (dispatch) =>{
        var rdata = await AXIOS_REQUEST("providermanager/Livecasinoitemsadd",{row,params,filters,bool},dispatch,true);
        if(rdata.status){
            toast.success("success")
            reduxload(rdata,dispatch)

        }else{
            toast.error("error");
        }
    }
}

export const LivecasinoDelete = (row,params,filters,bool) => {
    return async dispatch =>{
        let result = await confirm();
        if (result) {
            var rdata = await AXIOS_REQUEST("providermanager/Livecasinoitemsdelete",{row,params,filters,bool},dispatch,true);
            if(rdata.status){
                toast.success("success")
                reduxload(rdata,dispatch)

            }else{
                toast.error("error");
            }

        }
    }
}

export const Livecasinoitemsupdate = (row,params,bool,filters) =>{
    return async (dispatch) =>{
        var rdata = await AXIOS_REQUEST("providermanager/Livecasinoitemsupdate",{row,params,filters,bool},dispatch,true);
        if(rdata.status){
            toast.success("success")
            reduxload(rdata,dispatch)

        }else{
            toast.error("error");
        }
    }
}


export const LivecasinoItemImg_upload = async (formdata) =>{
    var rdata = await AXIOS_REQUEST("providermanager/Livecasinoitemsimg_upload",formdata);
    return rdata;    
}