import React from "react"
import { Row, Col, FormGroup, Label, Input} from "reactstrap"
import { connect } from "react-redux"
import * as Globalaction from "../../../redux/actions/settting/global"
import { Card, CardBody, Button} from "reactstrap"
import {WithdrawalComission} from "../../../configs/providerconfig"
import Toggle from "react-toggle"
import * as GlobalType from "../../../redux/types"

class Casinopage extends React.Component {
    state = {
        status : false,
        comission : "",
    }

    componentDidUpdate(prevProps, prevState) {  
        if (prevProps.WithdrawalComission !== this.props.WithdrawalComission) {
            let row = this.props.WithdrawalComission;
            this.setState({
                status : row.status,
                comission : row.comission,
            })
        }

    }

    save = () => {
        
        let row = {
            type : WithdrawalComission,
            content : {
                status : this.state.status,
                comission : this.state.comission,
            }
        }
        this.props.setGlobalConfig(row, GlobalType.GETWithdrawalComission)
    }

   
    handleSwitchChange = () => {
        this.setState({status : !this.state.status});
    }


    render() {
        console.log(this.state.file)
        return (
            <Card>
                <CardBody>
                    <Row>
                        <Col md="12">
                            <h3>
                                Withdrawal Comission config 
                            </h3>
                        </Col>
                        <Col md="6" >
                            <Label>status</Label>
                            <FormGroup>
                                <label className="react-toggle-wrapper">
                                    <Toggle
                                        checked={this.state.status}
                                        onChange={this.handleSwitchChange}
                                        name="controlledSwitch"
                                        value="yes"
                                    />
                                    <Button.Ripple
                                        color="primary"
                                        onClick={this.handleSwitchChange}
                                        size="sm"
                                    >
                                    {this.state.status ? "Enable" : "Disable" }
                                    </Button.Ripple>
                                </label>
                            </FormGroup>
                        </Col>
                        <Col md="6" >
                            <Label>comission</Label>
                            <FormGroup>
                            <Input
                                type="number"
                                placeholder="Please enter comission"
                                value={this.state.comission}
                                onChange={e => this.setState({comission : e.target.value})}
                                required
                            />
                            </FormGroup>
                        </Col>

                        <Col md="12">
                            <Button color="primary" onClick={()=>this.save()}>
                                Save
                            </Button>
                        </Col>
                    </Row>
                </CardBody>
            </Card>
        )
        }
    }

const mapstop = state=>{
    return {
        WithdrawalComission : state.setting.global.WithdrawalComission
    }
}

export default connect(mapstop,Globalaction)(Casinopage)