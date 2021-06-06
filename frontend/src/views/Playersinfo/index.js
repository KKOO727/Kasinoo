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
import AccountStatement from "./WalletHistory"
import TotalS from "./wallet/total"
import {connect} from "react-redux"
import * as profileAction from "../../redux/actions/profileinfo"
import queryString from "query-string"
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

  toggle = tab => {
    
    if (this.state.active !== tab) {
      this.setState({ active: tab });
      
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

  componentDidUpdate(prevProps, prevState){
    if (prevProps.userdetail !== this.props.userdetail) {
      this.setState({allData : this.props.userdetail})
    }
}

  render() {
    let row = this.state.allData;
    return (
      <React.Fragment>

        {
          row && row.email ? 
          <React.Fragment>
            <Breadcrumbs breadCrumbTitle="Players" breadCrumbParent="Players" breadCrumbParent2={row.username} />
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
                        <td>{ row.playerid && row.playerid.balance ? (row.playerid.balance).toFixed(0) : "0" }</td>
                        <td>{ row.playerid && row.playerid.bonusbalance ? (row.playerid.bonusbalance).toFixed(0) : "0" }</td>
                      </tr>
                  
                  </tbody>
                  </Table> 
              </Col>
              <Col md="12">
                <TotalS user={row}/>
              </Col>
            </React.Fragment>
            : null
          }

            <Nav tabs className="nav-justified">
              {
                this.state.allData.permission === playerid ?
                  <>
                  
                  <NavItem>
                    <NavLink className={classnames({active: this.state.active === "4"})} onClick={() => {this.toggle("4")}}>
                    Account statement
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink className={classnames({active: this.state.active === "2"})} onClick={() => {this.toggle("2")}}>
                    Wallet Statement 

                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink className={classnames({active: this.state.active === "3"})} onClick={() => {this.toggle("3")}}>
                    Bet History
                    </NavLink>
                  </NavItem> 
                  <NavItem>
                    <NavLink className={classnames({active: this.state.active === "1"})} onClick={() => {this.toggle("1")}}>
                      Profile
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
                   <TabPane tabId="4" className="h-100">
                      <AccountStatement parsedFilter={queryString.parse(this.props.location.search)} user={this.props.location.state}/>
                    </TabPane>
                    <TabPane tabId="1">
                      <Profile user={this.props.location.state} />
                    </TabPane>
                    <TabPane tabId="2" className="h-100">
                      <Wallet user={this.props.location.state} parsedFilter={queryString.parse(this.props.location.search)}  />
                    </TabPane>
                    <TabPane tabId="3" className="h-100">
                      <Bets  user={this.props.location.state} parsedFilter={queryString.parse(this.props.location.search)}/>
                    </TabPane>
                   
                  </> :
                  <>
                  <TabPane tabId="1" className="h-100">
                    <MyWallet  user={this.props.location.state}/>
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
