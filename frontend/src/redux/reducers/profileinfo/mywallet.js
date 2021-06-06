var initdata = {
    load : {
        BET : 0,
        WIN :0,
        given : 0,
        receive : 0
    },
    total : {}

 }

export const mywallet = (state =initdata, action) => {
  switch (action.type) {
 
    case "PROFILEINFOR_MYWALLET_LOAD": {
      return { ...state, load: action.data }
    }

    case "PROFILEINFOR_MYWLLET_TOTAL" : {
      return {...state , total : action.data}
    }

    default: {
      return state
    }
  }
}
