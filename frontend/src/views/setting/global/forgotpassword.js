import React from "react"
import { Row, Col, Button} from "reactstrap"
import { connect } from "react-redux"
import * as Globalaction from "../../../redux/actions/settting/global"
import Toggle from "react-toggle"
import { Card, CardBody} from "reactstrap"
import {ForgotPasswordKey} from "../../../configs/providerconfig"
import * as GlobalType from "../../../redux/types"

class Casinopage extends React.Component {
    state = {
        isChecked : false
    }

    componentDidUpdate(prevProps, prevState) {  
        if (this.props.forgotpassword !== prevState.isChecked) {
            this.setState({isChecked : this.props.forgotpassword})
        }
    }

    handleSwitchChange = () => {

        this.setState({isChecked : !this.state.isChecked});
        let row = {
            type : ForgotPasswordKey,
            content : !this.state.isChecked
        }
        this.props.setGlobalConfig(row, GlobalType.GETFORGOTPASSWORD)
    }

    render() {
        return (
            <Card>
                <CardBody>
                    <Row>
                        <Col md="6">
                            <h4>ForgotPassword Enable/Disable</h4>
                        </Col>
                        <Col md="6" >
                            <label className="react-toggle-wrapper">
                            <Toggle
                                checked={this.state.isChecked}
                                onChange={this.handleSwitchChange}
                                name="controlledSwitch"
                                value="yes"
                            />
                            <Button.Ripple
                                color="primary"
                                onClick={this.handleSwitchChange}
                                size="sm"
                            >
                            {this.state.isChecked ? "Enable" : "Disable" }
                            </Button.Ripple>
                        </label>
                        </Col>
                    </Row>
                </CardBody>
            </Card>
        )
        }
    }

const mapstop = state=>{
    return {
        forgotpassword : state.setting.global.forgotpassword
    }
}

export default connect(mapstop,Globalaction)(Casinopage)