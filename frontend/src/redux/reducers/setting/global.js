
import * as GlobalTypes from "../../types"

const initialState = {
}

export const global = (state = initialState, action) => {
  switch (action.type) {
    case  GlobalTypes.GETSIGNUPBUTTON :
        return{
            ...state, signupbuttons : action.data
        }
    case  GlobalTypes.GETAPPCONFIG :
            return{
                ...state, appversion : action.data
            }
    case  GlobalTypes.GETREFERALINK :
        return{
            ...state, Referrallink : action.data
        }
    case GlobalTypes.GETSESSIONEXPIRESTIME : 
    return{
        ...state, SessionExpiresSetting : action.data
    }
    case GlobalTypes.GETLIVECHATSETTING : 
    return{
        ...state, LiveChatSetting : action.data
    }

    case GlobalTypes.GETWinningComission : 
    return{
        ...state, WinningComission : action.data
    }

    case GlobalTypes.GETWithdrawalComission : 
    return{
        ...state, WinningComission : action.data
    }

    case GlobalTypes.GETTIMERSHOWBUTTONS : 
    return{
        ...state, TimerButton : action.data
    }

    case GlobalTypes.GETFeedBackSetting : 
    return{
        ...state, FeedBackSetting : action.data
    }

    case GlobalTypes.GETLicenSeSetting : 
    return{
        ...state, LicenSeSetting : action.data
    }

    case GlobalTypes.GETVIVOCreential : 
    return{
        ...state, VIVOCreential : action.data
    }
    case GlobalTypes.GETEZUGICreential : 
    return{
        ...state, EZUGICreential : action.data
    }

    case GlobalTypes.GETMrSlottYCreential : 
    return{
        ...state, MrSlottYCreential : action.data
    }
    
    
    
    

    case  GlobalTypes.GETFRIENDLY :
        return{
            ...state, Friendly : action.data
        }
    case  GlobalTypes.GETSENDYCONFIG :
        return{
            ...state, SendyConfig : action.data
        }
    case  GlobalTypes.GETFORGOTPASSWORD:
        return {
            ...state, forgotpassword : action.data
        }
    case  GlobalTypes.GETXpressCredential :
        return{
            ...state, XpressCredential : action.data
        }
    case  GlobalTypes.GETMojosCreential :
        return{
            ...state, MojosCreential : action.data
        }
     case   GlobalTypes.GETWACCreential :
        return{
            ...state, WACCreential : action.data
        }
        
    case GlobalTypes.GETALLGLOBALSETTING :
        return {
            ...state, ...action.data
        }

    
    default:
      return state
  }
}  

