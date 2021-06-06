
const initialState = {
    value  : {toTimeString : new Date().toTimeString()}
  }

  const player = (state = initialState, action) => {
    switch (action.type) {
      case "SET_DATE":
        return { ...state,value : action.data}
      default:
        return state
    }
  }
  
export default player