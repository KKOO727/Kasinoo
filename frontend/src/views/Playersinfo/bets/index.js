import React, { Component } from 'react'
import { connect } from 'react-redux'
import {TabContent, TabPane, Nav, NavItem, NavLink} from "reactstrap"
import classnames from "classnames"
import Mybets from "./mybets"
import Satta from "./satta"
import {reports_email_load,satta_history_load} from "../../../redux/actions/profileinfo/index"

export class index extends Component {

    state = {
        active: "1",
        date : {
            start : new Date(),
            end : new Date(new Date().valueOf() + 24 * 60 * 60 * 1000),
        },
      }
    
      toggle = tab => {
        if (this.state.active !== tab) {
          this.setState({ active: tab });
            switch(tab){
                case "1" :
                    this.props.reports_email_load( this.state.date,this.props.user,this.props.parsedFilter)
                    break;
                case "2" :
                    this.props.satta_history_load( this.state.date,this.props.user,this.props.parsedFilter)
                break;
                default:
                break;
            }
        }
      }
    render() {
        return (
            <div>
                <Nav tabs className="nav-fill">
                    <NavItem>
                        <NavLink className={classnames({ active: this.state.active === "1" })} onClick={() => {this.toggle("1") }} >
                            MyBets
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink className={classnames({ active: this.state.active === "2" })} onClick={() => {this.toggle("2") }}>
                            Satta
                        </NavLink>
                    </NavItem>
                </Nav>
                <TabContent activeTab={this.state.active}>
                    <TabPane tabId="1">
                        <Mybets user= {this.props.user} parsedFilter={this.props.parsedFilter} />
                    </TabPane>
                    <TabPane tabId="2">
                        <Satta user= {this.props.user} parsedFilter={this.props.parsedFilter}   />
                    </TabPane>                
                </TabContent>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    
})

const mapDispatchToProps = {
    reports_email_load,satta_history_load
}

export default connect(mapStateToProps, mapDispatchToProps)(index)
