



import { combineReducers } from "redux"
import {finance} from "./finance"
import {payoutchannel} from "./payoutchnnel"
import {bankdetail} from "./bankdetail"
import {restrictiondays} from "./restrictiondays"

const financepart = combineReducers({
  finance,
  payoutchannel,
  bankdetail,
  restrictiondays
});

export default financepart