
const initialState = {
    data: [],
    params: null,
    allData: [],
    totalPages: 0,
    filteredData: [],
    totalRecords: 0,
    sortIndex: [],
    count : null
  }
  
 export const sessionusers = (state = initialState, action) => {
    switch (action.type) {
      case "GAMESESSIonREALTIME_GET_DATA":
        return {
          ...state,
          data: action.data,
          allData : action.alldata,
          totalPages: action.totalPages,
          totalRecords: action.alldata.length,
          params: action.params,
          sortIndex:  [action.params["skip"] + 1,action.params["skip2"]]
        }
        // count : action.count
    
        
      case "GAMESESSIonREALTIME_FILTER_DATA":
        let value = action.value
        let filteredData = []
        if (value.length) {
          filteredData = state.allData
            .filter(item => {
              let startsWithCondition =
                item.username.toLowerCase().startsWith(value.toLowerCase()) ||
                item.email.toLowerCase().startsWith(value.toLowerCase()) ||
                item.firstname.toLowerCase().startsWith(value.toLowerCase()) ||
                item.lastname.toLowerCase().startsWith(value.toLowerCase())
  
              let includesCondition =
              item.username.toLowerCase().includes(value.toLowerCase()) ||
              item.email.toLowerCase().includes(value.toLowerCase()) ||
              item.firstname.toLowerCase().includes(value.toLowerCase()) ||
              item.lastname.toLowerCase().includes(value.toLowerCase())
  
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
  
