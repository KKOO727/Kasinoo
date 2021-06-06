import { combineReducers } from "redux"
import customizer from "./customizer"
import playercustomizer from "./playercustomizer"

const customizerReducer = combineReducers({
  customizer,
  playercustomizer,
})

export default customizerReducer
