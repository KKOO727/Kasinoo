
const initialState = {
    data: [],
    params: null,
    allData: [],
    totalPages: 0,
    filteredData: [],
    totalRecords: 0,
    sortIndex: [0,0],
    typeoptions : [],
    paymoroBanks : [],
    yaarpaybanks : []
  }
  
  export const payoutchannel = (state = initialState, action) => {
    switch (action.type) {
      case "GETDATAPAYOUTCHANNEL" :
        return {
            ...state,
            data: action.data,
            totalPages: action.totalPages,
            params: action.params["params"],
            sortIndex : [action.params["skip"] + 1,action.params["skip2"]],
            totalRecords: action.totalRecords,
            typeoptions : action.typeoptions,
            paymoroBanks : action.paymoroBanks,
            yaarpaybanks : action.yaarpaybanks
          }
      default:
        return state
    }
  }
  
  