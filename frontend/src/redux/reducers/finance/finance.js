import {FINANCE_TRANSACTIONS_GET,FINANCE_TRANSACTIONS_LOAD} from "../../types"

const initialState = {
    data: [],
    params: null,
    allData: [],
    totalPages: 0,
    filteredData: [],
    totalRecords: 0,
    sortIndex: [0,0],
    useroptions : [],
    statusoptions : []
  }
  
  

 export  const finance = (state = initialState, action) => {
    switch (action.type) {
      case FINANCE_TRANSACTIONS_GET:
        return {
          ...state,
          data: action.data,
          totalPages: action.totalPages,
          params: action.params["params"],
          sortIndex : [action.params["skip"] + 1,action.params["skip2"]],
          totalRecords: action.totalRecords,
      }
      case FINANCE_TRANSACTIONS_LOAD :
        return {
          ...state,
          useroptions : action.data.useroptions,
          statusoptions : action.data.statusoptions
      }
      default:
        return state
    }
  }
  
   
