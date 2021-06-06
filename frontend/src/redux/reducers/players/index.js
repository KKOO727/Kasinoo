import { combineReducers } from "redux"
import {balance_history} from "./balance_history"
import {kycdocu} from "./kyc"
import {playerlimit} from "./playerlimit"
import {playerslist} from "./players"
import {request_payout} from "./request_payout"

const Players = combineReducers({
    balance_history,
    playerlimit,
    kycdocu,
    request_payout,
    playerslist
})

export default Players
