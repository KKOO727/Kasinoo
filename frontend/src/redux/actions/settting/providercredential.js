import {AXIOS_REQUEST} from "../auth/index"


export const update = (data,item) =>{
    return async dispatch =>{
        console.log(data,item)
        await AXIOS_REQUEST("settings/setting_procredential_update",{data : data,item : item});
    }
}

export const getData = (params) =>{
    return async dispatch =>{
        var rdata = await AXIOS_REQUEST("settings/setting_procredential_load",{});
        if(rdata.status){
            dispatch({type:"SETTING_PROCREDENTIAL_EDIT",data : rdata.data})
        }else{
        }
    }
}
