import {REQUESTPAYOUT_GET,REQUESTPAYOUT_PAGENATIONS,REQUESTPAYOUTTOTAL_GET} from "../../types"

const initialState = {
    data: [],
    params: null,
    allData: [],
    totalPages: 0,
    filteredData: [],
    totalRecords: 0,
    sortIndex: [0,0],
    total : {},
  }
  
  

export  const request_payout = (state = initialState, action) => {
    switch (action.type) {
      case REQUESTPAYOUT_GET:
        return {
          ...state,
            data: action.data,
            totalPages: action.totalPages,
            params: action.params,
            totalRecords: action.totalRecords,
            sortIndex : [action.params["skip"] + 1,action.params["skip2"]],
        } 
      
        case REQUESTPAYOUTTOTAL_GET :
        return{
          ...state,total : action.total
        }

        case REQUESTPAYOUT_PAGENATIONS:
          return {
            ...state,
            data: action.data,
            totalPages: action.totalPages,
            params: action.params,
            // sortIndex: getIndex( state.allData, action.data, state.sortIndex, action.params )
          }
        
      default:
        return state
    }
  }
  
  
