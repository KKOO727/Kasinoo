import React from "react"
import { Row, Col, FormGroup, Label, Input} from "reactstrap"
import { connect } from "react-redux"
import * as Globalaction from "../../../redux/actions/settting/global"
import { Card, CardBody, Button} from "reactstrap"
import {MojosCreential} from "../../../configs/providerconfig"

import * as GlobalType from "../../../redux/types"

class Casinopage extends React.Component {
    state = {
        operatorToken : "",
        LaunchUrl : "",
        casinoHost : "",
        LiveCasinoHost : "",
        hashkey : "",
    }

    componentDidUpdate(prevProps, prevState) {  
        if (prevProps.MojosCreential !== this.props.MojosCreential) {
            let row = this.props.MojosCreential;
            this.setState({
                operatorToken : row.operatorToken,
                LaunchUrl : row.LaunchUrl,
                casinoHost : row.casinoHost,
                LiveCasinoHost : row.LiveCasinoHost,
                hashkey : row.hashkey,
            })
        }

    }

    save = () => {
        
        let row = {
            type : MojosCreential,
            content : {
                operatorToken : this.state.operatorToken,
                LaunchUrl : this.state.LaunchUrl,
                casinoHost : this.state.casinoHost,
                LiveCasinoHost : this.state.LiveCasinoHost,
                hashkey : this.state.hashkey,
               
            }
        }
        this.props.setGlobalConfig(row, GlobalType.GETMojosCreential)
    }

   

    render() {
        return (
            <Card>
                <CardBody>
                    <Row>
                        <Col md="12">
                            <h3>
                                7 Mojos Credential
                            </h3>
                        </Col>
                        <Col md="6" sm="6" xs="12">
                            <Label>operatorToken</Label>
                            <FormGroup>
                            <Input
                                type="text"
                                placeholder="operatorToken"
                                value={this.state.operatorToken}
                                onChange={e => this.setState({operatorToken : e.target.value})}
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
                            <Label>casinoHost</Label>
                            <FormGroup>
                            <Input
                                type="text"
                                placeholder="casinoHost"
                                value={this.state.casinoHost}
                                onChange={e => this.setState({casinoHost : e.target.value})}
                                required
                            />
                            </FormGroup>
                        </Col>
                        <Col md="6" sm="6" xs="12">
                            <Label>LiveCasinoHost</Label>
                            <FormGroup>
                            <Input
                                type="text"
                                placeholder="LiveCasinoHost"
                                value={this.state.LiveCasinoHost}
                                onChange={e => this.setState({LiveCasinoHost : e.target.value})}
                                required
                            />
                            </FormGroup>
                        </Col>

                        <Col md="6" sm="6" xs="12">
                            <Label>hashkey</Label>
                            <FormGroup>
                            <Input
                                type="text"
                                placeholder="hashkey"
                                value={this.state.hashkey}
                                onChange={e => this.setState({hashkey : e.target.value})}
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
        MojosCreential : state.setting.global.MojosCreential
    }
}

export default connect(mapstop,Globalaction)(Casinopage)