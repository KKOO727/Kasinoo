import {MatkaResultREGULAR_GETDATA} from "../../../types"

const initialState = {
    data: [],
    params: null,
    allData: [],
    totalPages: 0,
    filteredData: [],
    totalRecords: 0,
    sortIndex: [0,0],
    bazaarlist : [],
    numberoptions : []

  }
  
  export const regular = (state = initialState, action) => {
    switch (action.type) {

      case MatkaResultREGULAR_GETDATA:
        return {
          ...state,
          data: action.data,
          totalPages: action.totalPages,
          params: action.params["params"],
          sortIndex : [action.params["skip"] + 1,action.params["skip2"]],
          totalRecords: action.totalRecords,
          bazaarlist : action.bazaarlist,
          numberoptions : action.numberoptions

      }
      
        
   
      default:
        return state
    }
  }
  
  