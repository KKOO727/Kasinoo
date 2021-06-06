const initialState = {
  paymentconfig : null,
  QpayCheckOutData : null,
  QpayResultsData : null,
  data: [],
  params: null,
  allData: [],
  totalPages: 0,
  filteredData: [],
  totalRecords: 0,
  sortIndex: [0,0],
  typeoptions : [],
  yaarpaybanks : [],
  paymoroBanks : [],
}

const PaymentGateWayReducer = (state = initialState, action) => {
  switch (action.type) {
    case "PAYMENTMENU_CONFIG_DATA":
      return {...state, paymentconfig: action.data}
    case "PAYMENTGATEWAY_QPAY_CHEKOUT_DATA":
      return {...state, QpayCheckOutData: action.data}
    case "PAYMENTGATEWAY_QPAY_RESULTS_DATA":
      return {...state, QpayResultsData: action.data}


    case "PAYMENTMENU_GET_DATA":
      return {
        ...state,
        data: action.data,
        allData : action.alldata,
        totalPages: action.totalPages,
        totalRecords: action.alldata.length,
        params: action.params,
        sortIndex:  [action.params["skip"] + 1,action.params["skip2"]]
      }
    case "PAYMENTMENU_GET_OPTIONS":
      return {
        ...state,
        typeoptions: action.typeoptions,
      }
    default:
      return state
  }
}
  
export default PaymentGateWayReducer