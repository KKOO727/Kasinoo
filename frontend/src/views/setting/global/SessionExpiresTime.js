import React from "react"
import { Row, Col, FormGroup, Label, Input} from "reactstrap"
import { connect } from "react-redux"
import * as Globalaction from "../../../redux/actions/settting/global"
import { Card, CardBody, Button} from "reactstrap"
import {SessionExpiresSetting} from "../../../configs/providerconfig"

import * as GlobalType from "../../../redux/types"

class Casinopage extends React.Component {
    state = {
        UserSession : "",
        GameSession : "",
    }

    componentDidUpdate(prevProps, prevState) {  
        if (prevProps.SessionExpiresSetting !== this.props.SessionExpiresSetting) {
            let row = this.props.SessionExpiresSetting;
            this.setState({
                UserSession : row.UserSession,
                GameSession : row.GameSession,
            })
        }

    }

    save = () => {
        
        let row = {
            type : SessionExpiresSetting,
            content : {
                UserSession : this.state.UserSession,
                GameSession : this.state.GameSession,
            }
        }
        this.props.setGlobalConfig(row, GlobalType.GETSESSIONEXPIRESTIME)
    }

   

    render() {
        console.log(this.state.file)
        return (
            <Card>
                <CardBody>
                    <Row>
                        <Col md="12">
                            <h3>
                                Session Expires Time Config
                            </h3>
                        </Col>
                        <Col md="3" sm="6" xs="12">
                            <Label>UserSession</Label>
                            <FormGroup>
                            <Input
                                type="text"
                                placeholder="Please enter second"
                                value={this.state.UserSession}
                                onChange={e => this.setState({UserSession : e.target.value})}
                                required
                            />
                            </FormGroup>
                        </Col>
                        <Col md="3" sm="6" xs="12">
                            <Label>GameSession</Label>
                            <FormGroup>
                            <Input
                                type="text"
                                placeholder="Please enter second"
                                value={this.state.GameSession}
                                onChange={e => this.setState({GameSession : e.target.value})}
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
        SessionExpiresSetting : state.setting.global.SessionExpiresSetting
    }
}

export default connect(mapstop,Globalaction)(Casinopage)