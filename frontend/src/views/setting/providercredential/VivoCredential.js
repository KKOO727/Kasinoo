import React from "react"
import { Row, Col, FormGroup, Label, Input} from "reactstrap"
import { connect } from "react-redux"
import * as Globalaction from "../../../redux/actions/settting/global"
import { Card, CardBody, Button} from "reactstrap"
import {VIVOCreential} from "../../../configs/providerconfig"

import * as GlobalType from "../../../redux/types"

class Casinopage extends React.Component {
    state = {
        operatorid : "",
        LaunchUrl : "",
        serverid : "",
        BetsoftLaunchurl : "",
        passkey : ""
    }

    componentDidUpdate(prevProps, prevState) {  
        if (prevProps.VIVOCreential !== this.props.VIVOCreential) {
            let row = this.props.VIVOCreential;
            this.setState({
                operatorid : row.operatorid,
                LaunchUrl : row.LaunchUrl,
                serverid : row.serverid,
                BetsoftLaunchurl : row.BetsoftLaunchurl,
                passkey : row.passkey,
            })
        }

    }

    save = () => {
        
        let row = {
            type : VIVOCreential,
            content : {
                operatorid : this.state.operatorid,
                LaunchUrl : this.state.LaunchUrl,
                serverid : this.state.serverid,
                BetsoftLaunchurl : this.state.BetsoftLaunchurl,
                passkey : this.state.passkey
               
            }
        }
        this.props.setGlobalConfig(row, GlobalType.GETVIVOCreential)
    }

   

    render() {
        return (
            <Card>
                <CardBody>
                    <Row>
                        <Col md="12">
                            <h3>
                                Vivo Credential
                            </h3>
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
                            <Label>operatorid</Label>
                            <FormGroup>
                            <Input
                                type="text"
                                placeholder="operatorid"
                                value={this.state.operatorid}
                                onChange={e => this.setState({operatorid : e.target.value})}
                                required
                            />
                            </FormGroup>
                        </Col>


                        <Col md="6" sm="6" xs="12">
                            <Label>serverid</Label>
                            <FormGroup>
                            <Input
                                type="text"
                                placeholder="serverid"
                                value={this.state.serverid}
                                onChange={e => this.setState({serverid : e.target.value})}
                                required
                            />
                            </FormGroup>
                        </Col>
                        <Col md="6" sm="6" xs="12">
                            <Label>BetsoftLaunchurl</Label>
                            <FormGroup>
                            <Input
                                type="text"
                                placeholder="BetsoftLaunchurl"
                                value={this.state.BetsoftLaunchurl}
                                onChange={e => this.setState({BetsoftLaunchurl : e.target.value})}
                                required
                            />
                            </FormGroup>
                        </Col>

                        <Col md="6" sm="6" xs="12">
                            <Label>passkey</Label>
                            <FormGroup>
                            <Input
                                type="text"
                                placeholder="passkey"
                                value={this.state.passkey}
                                onChange={e => this.setState({passkey : e.target.value})}
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
        VIVOCreential : state.setting.global.VIVOCreential
    }
}

export default connect(mapstop,Globalaction)(Casinopage)