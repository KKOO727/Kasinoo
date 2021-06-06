import {SPORTS_MENULIST_GETDATA,SPORTS_MENULIST_FILTERDATA} from "../../types"

const initialState = {
    data: [],
    params: null,
    allData: [],
    totalPages: 0,
    filteredData: [],
    totalRecords: 0,
    sortIndex: []
  }
  
  
 export const sports = (state = initialState, action) => {
    switch (action.type) {
      case SPORTS_MENULIST_GETDATA:
      
        return {
          ...state,
          data: action.data,
          allData : action.alldata,
          totalPages: action.totalPages,
          totalRecords: action.alldata.length,
          params: action.params,
          sortIndex:  [action.params["skip"] + 1,action.params["skip2"]]
        }
      
        case SPORTS_MENULIST_FILTERDATA:
          let value = action.value
          let filteredData = []
          if (value.length) {
            filteredData = state.allData
              .filter(item => {
                let startsWithCondition =
                item.sport_name.toLowerCase().startsWith(value.toLowerCase())
  
                let includesCondition =
                item.sport_name.toLowerCase().startsWith(value.toLowerCase())
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
  
  