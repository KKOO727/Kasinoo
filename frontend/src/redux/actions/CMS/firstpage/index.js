import {AXIOS_REQUEST,AXIOS_REQUEST_FILE} from "../../auth/index"
import {toast} from "react-toastify"

export const logo_upload = (formdata,type) =>{
    return async (dispatch) =>{
        var rdata = await AXIOS_REQUEST_FILE("cms/logoimg_save",formdata,dispatch,true);
        if(rdata.status){
            dispatch({type : type,data : rdata.data.content})
        }else{
        
        }
    }
}


export const firstpage_load = () =>{
    return async (dispatch) =>{
        var rdata = await AXIOS_REQUEST("cms/firstpage_load",{},dispatch,true);
        if(rdata.status){
            dispatch({type : "FirstpageSetting_ALL",data : rdata.data})
        }else{
        
        }
    }
}



export const Logoload = () => {
    return async(dispatch)=>{
        var saveHandle = await AXIOS_REQUEST("cms/logoimg_load");
        if(saveHandle.status){
            dispatch({
                type : "FirstpageSetting_logo",data : saveHandle.data.content
            });
        }else{
        }
    }
}

export const trackcodesave = (data,type)=>{
    return async(dispatch)=>{
        var rdata = await AXIOS_REQUEST("cms/trackcode_save",{data: data});
        if(rdata.status){
            dispatch({type : type,data : rdata.data.content})
        }else{
        
        }
    }
}

export const upload_provider_paymentimgs = (formdata,type) =>{
    return async dispatch =>{
        var rdata = await AXIOS_REQUEST("cms/upload_provider_paymentimg",formdata,dispatch,true);
        if(rdata.status){
            dispatch({type : type,data : rdata.data})
        }else{

        }
    }
}

export const delete_providerimg = (data)=>{
    return async(dispatch)=>{
        var saveHandle = await AXIOS_REQUEST("cms/providerimg_delete",{data : data});
        if(saveHandle.status){
            toast.success("successfully");
            dispatch({ type : "FirstpageSetting_providerimg",data : saveHandle.data });
        }else{

        }
    }
}

export const delete_paymentimg = (data)=>{
    return async(dispatch)=>{
        var saveHandle = await AXIOS_REQUEST("cms/paymentimg_delete",{data : data});
        if(saveHandle.status){
            toast.success("successfully");
            dispatch({ type : "FirstpageSetting_paymentmethod",data : saveHandle.data });
        }else{

        }
    }
}
