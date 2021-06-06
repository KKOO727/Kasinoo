import {AXIOS_REQUEST,AXIOS_REQUEST_FILE} from "../auth/index"
import {toast} from "react-toastify"

export const Slider_upload = (formdata,type) =>{
    return async dispatch =>{
        var rdata = await AXIOS_REQUEST_FILE("cms/Slider_save",formdata,dispatch,true);
        if(rdata.status){
            dispatch({type : type,data : rdata.data});
        }else{

        }
    }
}

export const textchange = (data,type) => {
    return async dispatch =>{
        var rdata = await AXIOS_REQUEST("cms/Slider_textsave",{data},dispatch,true);
        if(rdata.status){
            dispatch({type : type,data : rdata.data});
        }else{

        }
    }
}

export const get_all_sliders = () =>{
    return async dispatch =>{
        var rdata = await AXIOS_REQUEST("cms/Slider_load",{},dispatch,true);
        if(rdata.status){
            dispatch({type : "ALLDATA_SLIDERIMAGES",data : rdata.data});
        }else{

        }
    }
}

export const Slider_update = (data,type) =>{
    return async dispatch =>{
        var rdata = await AXIOS_REQUEST("cms/Slider_update",{data : data},dispatch,true);
        if(rdata.status){
            dispatch({type : type,data : rdata.data});
        }else{

        }
    }
}


export const Slider_delete = (data,type) =>{
    return async dispatch =>{
        var rdata = await AXIOS_REQUEST("cms/Slider_delete",{data : data},dispatch,true);
        if(rdata.status){
            dispatch({type : type,data : rdata.data});
        }else{
            toast.error(rdata.error);
        }   
    }
}

