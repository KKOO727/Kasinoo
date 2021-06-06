import {ReposrtSattaMarketsLoad,ReposrtSattaMarketGetData} from "../../../types"

const initialState = {
    data: [],
    params: null,
    allData: [],
    totalPages: 0,
    filteredData: [],
    totalRecords: 0,
    sortIndex: [0,0],
  }
  
export  const SattaMarkets = (state = initialState, action) => {
    switch (action.type) {
      case ReposrtSattaMarketGetData:
        return {
          ...state,
          toptbl: action.data,
        }

      case ReposrtSattaMarketsLoad:

        return {
          ...state,
          data: action.data,
          totalPages: action.totalPages,
          params: action.params,
          totalRecords: action.totalRecords,
          sortIndex : [action.params["skip"] + 1,action.params["skip2"]],
        }
      default:
        return state
    }
  }
  
  