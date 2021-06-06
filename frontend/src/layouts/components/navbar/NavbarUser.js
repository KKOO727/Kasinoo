import React from "react"
import {  UncontrolledDropdown,DropdownToggle,} from "reactstrap"
import * as Icon from "react-feather"
import { connect } from "react-redux"
import UserDropdown from './Userdropdown'
import {  logoutWithJWT} from "../../../redux/actions/auth/loginActions"
import Clock from "./Clock"

class NavbarUser extends React.PureComponent {
  state = {
    navbarSearch: false,
    langDropdown: false,
    log_modal : false,
    isAuthenticated : false,
    email : ""
  }

  handleLangDropdown = () =>{
    this.setState({ langDropdown: !this.state.langDropdown })
  }



  render() {
    
    const guestLinks = (
      <UncontrolledDropdown tag="li" className="dropdown-user nav-item">
          <DropdownToggle tag="a" className="nav-link dropdown-user-link">
            <div className="user-nav d-sm-flex d-none">
              <span className="user-name text-bold-600">
                { this.state.email}
              </span>
            </div>
            <div className="icon-section">
              <div className="avatar avatar-stats p-50 m-0 bg-rgba-dark">
                <div className="avatar-content"><Icon.Users size={30} color={'white'}  />
                </div>
              </div>
            </div>
          </DropdownToggle>
          <UserDropdown  />
        </UncontrolledDropdown>
    )

    let {balance} = this.props.balance;    
    return (
      <ul className="nav navbar-nav navbar-nav-user float-right">
        <div className='d-flex flex-column justify-content-center align-items-center'>
          <div className="font-weight-bold d-block">
            Balance {
              balance.balance ? 
              balance.balance : 0
            }INR
          </div>
          <div className="font-weight-bold">
            BonusBalance {
              balance.bonusbalance ? 
              balance.bonusbalance : 0
            }INR
          </div>
        </div>
        
        <Clock />
        {
          (()=> {
            if( this.props.user){
              return guestLinks;
            }
          })()
        }
      </ul>
    )
  }
}

const get_auth = state => {
  return {
    user : state.auth.login.values,
    balance : state.balance
  }
}
export default connect(get_auth,{logoutWithJWT}) (NavbarUser)