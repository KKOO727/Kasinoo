import React from "react"
import { Row, Col, FormGroup, Label, Input} from "reactstrap"
import { connect } from "react-redux"
import * as Globalaction from "../../../redux/actions/settting/global"
import { Card, CardBody, Button} from "reactstrap"
import {SendyConfig} from "../../../configs/providerconfig"

import * as GlobalType from "../../../redux/types"

class Casinopage extends React.Component {
    state = {
        apikey : "",
        apiurl : "",
        list_id : "",
        list_id1  :""
    }

    componentDidUpdate(prevProps, prevState) {  
        if (prevProps.sendyconfig !== this.props.sendyconfig) {
            let row = this.props.sendyconfig;
            this.setState({
                apikey : row.apikey,
                apiurl : row.apiurl,
                list_id : row.list_id,
                list_id1 : row.list_id1
            })
        }

    }

    save = () => {
        
        let row = {
            type : SendyConfig,
            content : {
                apikey : this.state.apikey,
                apiurl : this.state.apiurl,
                list_id : this.state.list_id,
                list_id1 : this.state.list_id1
            }
        }
        this.props.setGlobalConfig(row, GlobalType.GETSENDYCONFIG)
    }

   

    render() {
        return (
            <Card>
                <CardBody>
                    <Row>
                        <Col md="12">
                            <h3>
                                Sendy Config
                            </h3>
                        </Col>
                        <Col md="3" sm="6" xs="12">
                            <Label>apikey</Label>
                            <FormGroup>
                            <Input
                                type="text"
                                placeholder="apikey"
                                value={this.state.apikey}
                                onChange={e => this.setState({apikey : e.target.value})}
                                required
                            />
                            </FormGroup>
                        </Col>
                        <Col md="3" sm="6" xs="12">
                            <Label>apiurl</Label>
                            <FormGroup>
                            <Input
                                type="text"
                                placeholder="apiurl"
                                value={this.state.apiurl}
                                onChange={e => this.setState({apiurl : e.target.value})}
                                required
                            />
                            </FormGroup>
                        </Col>
                        <Col md="3" sm="6" xs="12">
                            <Label>Signup list_id</Label>
                            <FormGroup>
                            <Input
                                type="text"
                                placeholder="list_id"
                                value={this.state.list_id}
                                onChange={e => this.setState({list_id : e.target.value})}
                                required
                            />
                            </FormGroup>
                        </Col>
                        <Col md="3" sm="6" xs="12">
                            <Label>ForgotPassword list_id</Label>
                            <FormGroup>
                            <Input
                                type="text"
                                placeholder="list_id"
                                value={this.state.list_id1}
                                onChange={e => this.setState({list_id1 : e.target.value})}
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
        sendyconfig : state.setting.global.SendyConfig
    }
}

export default connect(mapstop,Globalaction)(Casinopage)