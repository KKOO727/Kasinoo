import React from "react"
import { Row, Col, FormGroup, Label, Input} from "reactstrap"
import { connect } from "react-redux"
import * as Globalaction from "../../../redux/actions/settting/global"
import { Card, CardBody, Button} from "reactstrap"
import {MrSlottYCreential} from "../../../configs/providerconfig"

import * as GlobalType from "../../../redux/types"

class Casinopage extends React.Component {
    state = {
        RPCSecret : "",
        LaunchUrl : "",
        HMACsalt : "",
    }

    componentDidUpdate(prevProps, prevState) {  
        if (prevProps.MrSlottYCreential !== this.props.MrSlottYCreential) {
            let row = this.props.MrSlottYCreential;
            this.setState({
                RPCSecret : row.RPCSecret,
                LaunchUrl : row.LaunchUrl,
                HMACsalt : row.HMACsalt,
            })
        }

    }

    save = () => {
        
        let row = {
            type : MrSlottYCreential,
            content : {
                RPCSecret : this.state.RPCSecret,
                LaunchUrl : this.state.LaunchUrl,
                HMACsalt : this.state.HMACsalt,
               
            }
        }
        this.props.setGlobalConfig(row, GlobalType.GETMrSlottYCreential)
    }

   

    render() {
        return (
            <Card>
                <CardBody>
                    <Row>
                        <Col md="12">
                            <h3>
                                MrSlotty Credential
                            </h3>
                        </Col>
                        <Col md="6" sm="6" xs="12">
                            <Label>RPCSecret</Label>
                            <FormGroup>
                            <Input
                                type="text"
                                placeholder="RPCSecret"
                                value={this.state.RPCSecret}
                                onChange={e => this.setState({RPCSecret : e.target.value})}
                                required
                            />
                            </FormGroup>
                        </Col>

                        <Col md="6" sm="6" xs="12">
                            <Label>LaunchUrl</Label>
                            <FormGroup>
                            <Input
                                type="text"
                                placeholder="LaunchUrl"
                                value={this.state.LaunchUrl}
                                onChange={e => this.setState({LaunchUrl : e.target.value})}
                                required
                            />
                            </FormGroup>
                        </Col>

                        <Col md="6" sm="6" xs="12">
                            <Label>HMACsalt</Label>
                            <FormGroup>
                            <Input
                                type="text"
                                placeholder="HMACsalt"
                                value={this.state.HMACsalt}
                                onChange={e => this.setState({HMACsalt : e.target.value})}
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
        MrSlottYCreential : state.setting.global.MrSlottYCreential
    }
}

export default connect(mapstop,Globalaction)(Casinopage)