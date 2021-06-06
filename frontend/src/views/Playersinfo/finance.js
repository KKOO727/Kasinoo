import React from "react"
import {TabContent,TabPane,Nav,NavItem,NavLink,Badge,Col,Table} from "reactstrap"
import classnames from "classnames"
import Breadcrumbs from "../../components/@vuexy/breadCrumbs/BreadCrumb"
import Bets from "./bets"
import Profile from "./profile"
import Wallet from "./wallet"
import MyWallet from "./MyWallet"
import {playerid} from "../../configs/providerconfig"
import {Root} from "../../authServices/rootconfig"
import WalletHistory from "./WalletHistory"
import queryString from "query-string"
import * as profileAction from "../../redux/actions/profileinfo"
import {connect} from "react-redux"
const prefix = Root.prefix;

class TabsBasic extends React.Component {
  state = {
    activeTab: "4",
    active: "4",
    allData : this.props.location.state,
    date : {
      start : new Date(),
      end : new Date(new Date().valueOf() + 24 * 60 * 60 * 1000),
    },
  }

  toggleTab = tab => {
    if (this.state.activeTab !== tab) {
      this.setState({ activeTab: tab })
    }
  }

  toggle = tab => {
    if (this.state.active !== tab) {
      this.setState({ active: tab })
      
      if (this.state.allData.permission === playerid) {
        switch(tab){
          case "1" : 
          this.props.profile_load(this.state.allData.email);
          break;
          case "2" : 
          this.props.transactionHistoryLoad(this.state.date,this.state.allData,queryString.parse(this.props.location.search))
          break;
          case "3" : 
          this.props.reports_email_load( this.state.date,this.state.allData,queryString.parse(this.props.location.search))
          break;
          case "4" : 
          this.props.get_accountStatement(this.state.date,this.state.allData,queryString.parse(this.props.location.search))
          break;
          default:
          break;
        }
      } else {

      }

    }
  }

  render() {
    let row = this.state.allData;
    console.log(row)
    return (
      <React.Fragment>
        <Breadcrumbs breadCrumbTitle="Players" breadCrumbParent="Players" breadCrumbParent2={this.state.allData.username} />
          <Col md="12" className="">
            <Table responsive bordered >
              <thead >
                <tr>
                  <th>UserID </th>
                  <th>First Name </th>
                  <th>Last Name</th>
                  <th>Email</th>
                  <th>Username</th>
                  <th>Status</th>
                  <th>balance</th>
                  <th>bonusbalance</th>
                </tr>
              </thead>
              <tbody>
                  <tr >
                  <td> { prefix + row.signup_device} {"-"}{row.fakeid}</td>
                    <td>{row.firstname}</td>
                    <td>{row.lastname}</td>
                    <td>{row.email}</td>
                    <td>{row.username}</td>
                    <td><Badge
                      color={ row.status === "allow" ? "light-success" : row.status === "pending" ? "light-warning" : "light-danger"} pill>
                      {row.status}
                    </Badge>
                    </td>
                    <td>{ row.playerid.balance ? parseFloat(row.playerid.balance).toFixed(0) : "0" }</td>
                    <td>{ row.playerid.bonusbalance ? parseFloat(row.playerid.bonusbalance).toFixed(0) : "0" }</td>
                  </tr>
              
              </tbody>
              </Table> 
          
          </Col>
            <Nav tabs className="nav-justified">
              {
                this.state.allData.permission === playerid ?
                  <>
                 
                  <NavItem>
                    <NavLink className={classnames({active: this.state.active === "4"})} onClick={() => {this.toggle("4")}}>
                      Wallet History
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink className={classnames({active: this.state.active === "2"})} onClick={() => {this.toggle("2")}}>
                      Fund Request
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink className={classnames({active: this.state.active === "3"})} onClick={() => {this.toggle("3")}}>
                      Betting History
                    </NavLink>
                  </NavItem> 
                  </> :
                  <>
                  <NavItem>
                    <NavLink className={classnames({active: this.state.active === "1"})} onClick={() => {this.toggle("1")}}>
                      My wallet
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink className={classnames({active: this.state.active === "4"})} onClick={() => {this.toggle("4")}}>
                      Profile
                    </NavLink>
                  </NavItem>
                </>
              }
            </Nav>
            <div className="playerinfor-style">
              <TabContent  activeTab={this.state.active } className="h-100">
              {
                this.state.allData.permission === playerid ?
                  <>
                  
                    <TabPane tabId="2" className="h-100">
                      <Wallet user={this.props.location.state} parsedFilter={queryString.parse(this.props.location.search)} />
                    </TabPane>
                    <TabPane tabId="3" className="h-100">
                      <Bets  user={this.props.location.state} parsedFilter={queryString.parse(this.props.location.search)}/>
                    </TabPane>
                    <TabPane tabId="4" className="h-100">
                      <WalletHistory  user={this.props.location.state} parsedFilter={queryString.parse(this.props.location.search)}/>
                    </TabPane>
                  </> :
                  <>
                  <TabPane tabId="1" className="h-100">
                    <MyWallet  user={this.props.location.state} parsedFilter={queryString.parse(this.props.location.search)}/>
                  </TabPane>
                  <TabPane tabId="4">
                    <Profile user={this.props.location.state} />
                  </TabPane>
                  </>
              }
              </TabContent>

            </div>
      </React.Fragment>
    )
  }
}

const mapStateToProps = (state) => ({
  userdetail : state.profileinfo.profile.load,   

})



export default connect(mapStateToProps, profileAction)(TabsBasic)
