import { combineReducers } from "redux"
import {regular} from "./result/regular"
import {king} from "./result/king"
import {startline} from "./result/startline"

const Result = combineReducers({
  regular ,
  king,
  startline
});

export default Result