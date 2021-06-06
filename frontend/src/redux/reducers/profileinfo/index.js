import { combineReducers } from "redux"
import {profile} from "./profile"
import {wallet_withdrawl} from "./withdrawlwallet"
import {wallet_deposit} from "./depositwallet"
import {mybets} from "./bets"
import {Satta} from "./satta"
import {mywallet} from "./mywallet"
import {accountstatement} from "./accountstatement"

const userdetail = combineReducers({
    profile,
    wallet_deposit,
    wallet_withdrawl,
    Satta,
    mybets,
    mywallet,
    accountstatement,
})

export default userdetail
