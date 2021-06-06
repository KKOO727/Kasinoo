
  
import {ToolGeoIpBlock_filter,ToolGeoIpBlock_load} from "../../types"

const initialState = {
    data: [],
    params: null,
    allData: [],
    totalPages: 0,
    filteredData: [],
    totalRecords: 0,
    sortIndex: []
  }
  
export  const toolsgeoipblock = (state = initialState, action) => {
    switch (action.type) {
      case ToolGeoIpBlock_load:
        return {
          ...state,
          data: action.data,
          allData : action.alldata,
          totalPages: action.totalPages,
          totalRecords: action.alldata.length,
          params: action.params,
          sortIndex:  [action.params["skip"] + 1,action.params["skip2"]]
        }
     
      case ToolGeoIpBlock_filter:
        let value = action.value;
        let bool = action.bool + ""
        let filteredData = [];
        if (value.length) {
          filteredData = state.allData.filter(item => {
            let startsWithCondition = false;
            let includesCondition = false;
            if(bool === "date"){
              var date = new Date(item.date);
              var date1 = new Date(value[0]);
              var date2 = new Date(value[1]);
              if(date >= date1 && date <= date2){
                startsWithCondition = true;
                includesCondition = true;
              }
            }else{
              var uitem = item[bool] + "";
              startsWithCondition = uitem.toLowerCase().startsWith(value.toLowerCase());
              includesCondition = uitem.toLowerCase().includes(value.toLowerCase());
            }

            if (startsWithCondition) {
              return startsWithCondition
            } else if (!startsWithCondition && includesCondition) {
              return includesCondition
            } else return null
          })
          .slice(state.params.page - 1, state.params.perPage)

          return { ...state, filteredData }
        } else {
          filteredData = state.data
          return { ...state, filteredData }
        }
    
      default:
        return state
    }
  }
  
  
