import {AXIOS_REQUEST,alert} from "../../auth/index"
import confirm from "reactstrap-confirm"

function reduxload(rdata,dispatch){
    var data = rdata.data;
    var totalPages = rdata.pageset["totalPages"];
    var pages = rdata.pageset;
    var totalRecords = rdata.pageset["totalRecords"]
    dispatch({
        type: "GETDATABONUSHISTORY",
        data: data,
        totalPages:totalPages,
        params : pages,
        totalRecords : totalRecords,
    });
}

export const getTotal = (filters) => {
    return async dispatch => {
        let rdata = await AXIOS_REQUEST("promotions/getBonusTotal",{filters},dispatch,true);
        if (rdata.status) {
            let row = rdata.data;
            dispatch({type : "TOTLABONUSHISTORY" , useroptions : row.useroptions ,bonusoptions : row.bonusoptions })
        } else {
            alert("error","error")
        }    
    }
}

export const getData = (params,filters) =>{
    return async dispatch =>{
        let rdata = await AXIOS_REQUEST("promotions/getBonusHistory",{params,filters},dispatch,true);
        if (rdata.status) {
            reduxload(rdata,dispatch)
        } else {
            alert("error","error")
        }
    }
}

export const bonusCredit = (params, filters , row) => {
    return async dispatch => {
        let res = await confirm();
        if (res) {
            let rdata = await AXIOS_REQUEST("promotions/CreditBonus",{params,filters, row},dispatch,true);
            if (rdata.status) {
                reduxload(rdata,dispatch)
            } else {
                alert("error","error")
            }

        }
    }
}