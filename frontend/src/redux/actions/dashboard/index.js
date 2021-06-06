import {AXIOS_REQUEST} from "../auth/index"
import {REVENUE1,REVENUE2,REVENUE3,REVENUE4,REVENUE_USERS} from "../../types"


async function getRevenus1(dates,user,dispatch){
    var rdata = await AXIOS_REQUEST("players/getWalletMainuser1",{startDate : new Date(dates[0]).toDateString(),endDate :new Date(dates[1]).toDateString(),user : user},dispatch,true);
    if (rdata.status) {
        dispatch({
            type : REVENUE1,
            ...rdata.data
        })
    }
}

async function getRevenus2(dates,user,dispatch){
    var rdata = await AXIOS_REQUEST("players/getWalletMainuser2",{startDate : new Date(dates[0]).toDateString(),endDate :new Date(dates[1]).toDateString(),user : user},dispatch,true);
    if (rdata.status) {
        dispatch({
            type : REVENUE2,
           ...rdata.data
        })
    }
}

async function getRevenus3(dates,user,dispatch){
    var rdata = await AXIOS_REQUEST("players/getWalletMainuser3",{startDate : new Date(dates[0]).toDateString(),endDate :new Date(dates[1]).toDateString(),user : user},dispatch,true);
    if (rdata.status) {
        dispatch({
            type : REVENUE3,
           ...rdata.data
        }) 
    }
}

async function getRevenus4(dates,user,dispatch){
    var rdata = await AXIOS_REQUEST("players/getWalletMainuser4",{startDate : new Date(dates[0]).toDateString(),endDate :new Date(dates[1]).toDateString(),user : user},dispatch,true);
    if (rdata.status) {
        dispatch({
            type : REVENUE4,
            matka : rdata.data
        }) 
    }
}



export const getRevenueLoad = (dates,user)=>{
    return async(dispatch) =>{
        getRevenus1(dates,user,dispatch);
        getRevenus2(dates,user,dispatch);
        getRevenus3(dates,user,dispatch);
        getRevenus4(dates,user,dispatch);
    }
}

export const getUserLoad = () =>{
    return async(dispatch) =>{
        var rdata = await AXIOS_REQUEST("dashboard/getUserLoad",);
        if ( rdata.status) {
            dispatch({
                type : REVENUE_USERS,
                data : rdata.data
            })
        } else {

        }
    }
}