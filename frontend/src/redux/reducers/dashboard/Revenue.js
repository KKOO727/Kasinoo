import {REVENUE1,REVENUE2,REVENUE3,REVENUE4,REVENUE_USERS} from "../../types"

const initialState = {
    musers : []
}
  
export const Revenue = (state = initialState, action) => {
    switch (action.type) {
        case REVENUE1 :
           return {...state, 
                Profit : action.Profit,
                BET : action.BET,
                WIN : action.WIN,
                betindex : action.betindex,
            }
        case REVENUE2 :
            return {...state, 
                MakingDeposits : action.MakingDeposits,
                MakingWithdrawals : action.MakingWithdrawals,
                playersBalance : action.playersBalance,
                playersBonusBalance : action.playersBonusBalance,
                playersLoggedIn : action.playersLoggedIn,
                playersMakingDeposit : action.playersMakingDeposit,
                playersMakingWithdrawals : action.playersMakingWithdrawals,
                playersRegistered : action.playersRegistered,
                playersagentBalance : action.playersagentBalance,
                totallogincount : action.totallogincount            
            }
        case REVENUE3 :
            return {...state, 
                
                given : action.given,
                positiontaking : action.positiontaking,
                receive : action.receive,
                withdrawls : action.withdrawls,
            }
        case REVENUE4 :
            return {...state, matka : action.matka }
        case REVENUE_USERS :
            return {...state, musers : action.data }
        default:
            return state
    }
}