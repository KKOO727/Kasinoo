const initialState = {
    data: [],
    params: null,
    allData: [],
    totalPages: 0,
    filteredData: [],
    totalRecords: 0,
    sortIndex: [0,0],
  }
  
  export  const balance_history = (state = initialState, action) => {
    switch (action.type) {
      case "PLAYERBALANCE_GET_DATA":
       
        return {
          ...state,
          data: action.data,
          totalPages: action.totalPages,
          params: action.params,
          totalRecords: action.totalRecords,
          sortIndex : [action.params["skip"] + 1,action.params["skip2"]],
        }
      case "PLAYERBALANCE_GET_ALL_DATA":
        return {
          ...state,
          toptbl: action.data,
        }

        // case "PLAYERBALANCE_FILTER_DATA":
        //     let value = action.value.username;
        //     let data = [];
        //     if (value.length) {
        //       data = state.allData.filter(item => {
        //             let startsWithCondition =
        //             item.username.toLowerCase().startsWith(value.toLowerCase())                  
        //             let includesCondition =
        //             item.username.toLowerCase().startsWith(value.toLowerCase())
        //           if (startsWithCondition) {
        //             return startsWithCondition
        //           } else if (!startsWithCondition && includesCondition) {
        //             return includesCondition
        //           } else return null
        //         })
        //         .slice(state.params.page - 1, state.params.perPage)
        //       return { ...state, data }
        //     } else {
        //       data = state.allData
        //       return { ...state, data }
        //     }
            
      default:
        return state
    }
  }
  
  
  