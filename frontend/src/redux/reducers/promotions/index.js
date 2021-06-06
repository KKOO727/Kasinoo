import { combineReducers } from "redux"
import {BonusMenu } from "./Bonus/index"
import {Bonushistory } from "./bonushistory"

const Reports = combineReducers({
    BonusMenu,
    Bonushistory
})

export default Reports