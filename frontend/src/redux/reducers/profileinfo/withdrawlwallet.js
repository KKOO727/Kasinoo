
const initialState = {
  data: [],    
}

export  const wallet_withdrawl = (state = initialState, action) => {
  switch (action.type) {
    case "PROFILEINFOR_WITHDRAWL_LOAD":
      return { ...state, data: action.data}
   
  
    default:
      return state
  }
}

