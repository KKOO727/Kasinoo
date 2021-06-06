var initdata = {
    load : null,

 }

export const profile = (state =initdata, action) => {
  switch (action.type) {
 
    case "PROFILEINFOR_PROFILE_LOAD": {
      return { ...state, load: action.data }
    }

    default: {
      return state
    }
  }
}
