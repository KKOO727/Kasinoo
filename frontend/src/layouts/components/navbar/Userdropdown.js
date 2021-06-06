import React from "react"
import {
  DropdownItem,
  DropdownMenu,  
} from "reactstrap"
import * as Icon from "react-feather"
import { history } from "../../../history"
import { connect } from "react-redux"
import {
  logoutWithJWT
  } from "../../../redux/actions/auth/loginActions"

// const handleNavigation = (e, path) => {
//     e.preventDefault()
//     history.push(path)
//   }

class UserDropdown extends React.Component {

    logout = () => {
        this.props.logoutWithJWT();
    }

    changepassword = () =>{
      history.push("/chagepassword")
    }

    render() {
        return (
            <DropdownMenu right>
                  <DropdownItem
                    tag="a"
                    href="#"
                    onClick={()=>this.changepassword()}
                  >
                    <Icon.Mail size={14} className="mr-50" />
                    <span className="align-middle">changepassword</span>
                  </DropdownItem>
                  <DropdownItem
                    tag="div"
                    onClick={()=>this.props.logoutWithJWT()}
                  >
                    <Icon.Power size={14} className="mr-50" />
                    <span className="align-middle" style={{ color : "#626262 !important"}}>Log Out</span>
                  </DropdownItem>
                </DropdownMenu>
        );
      }
}

const get_auth = state => {
    return {
        user : state.auth
    }
}
export default connect(get_auth,{logoutWithJWT}) (UserDropdown)

