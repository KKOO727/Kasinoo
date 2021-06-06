import {AXIOS_REQUEST} from "./index"
import { toast } from "react-toastify"
import { history } from "../../../history"

export const signupWithJWT = (users) => {
  return async(dispatch) =>{
    var rdata = await AXIOS_REQUEST("users/register",{users : users})
      if(rdata.status){
        toast.success("success");
        history.push("/login");
      }else{
        toast.error(rdata.data);
      }
  }
}

