import React from "react"
import { Row, Col, FormGroup, Label, Input} from "reactstrap"
import { connect } from "react-redux"
import * as Globalaction from "../../../redux/actions/settting/global"
import { Card, CardBody, Button} from "reactstrap"
import {XpressCredential} from "../../../configs/providerconfig"

import * as GlobalType from "../../../redux/types"

class Casinopage extends React.Component {
    state = {
        privateKey : "",
        publicKey : "",
        launchUrl : "",
        apiUrl : "",

    }

    componentDidUpdate(prevProps, prevState) {  
        if (prevProps.XpressCredential !== this.props.XpressCredential) {
            let row = this.props.XpressCredential;
            this.setState({
                privateKey : row.privateKey,
                publicKey : row.publicKey,
                launchUrl : row.launchUrl,
                apiUrl : row.apiUrl
            })
        }

    }

    save = () => {
        
        let row = {
            type : XpressCredential,
            content : {
                privateKey : this.state.privateKey,
                publicKey : this.state.publicKey,
                launchUrl : this.state.launchUrl,
                apiUrl : this.state.apiUrl
            }
        }
        this.props.setGlobalConfig(row, GlobalType.GETXpressCredential)
    }

   

    render() {
        return (
            <Card>
                <CardBody>
                    <Row>
                        <Col md="12">
                            <h3>
                                Xpress Credential
                            </h3>
                        </Col>
                        <Col md="6" sm="6" xs="12">
                            <Label>privateKey</Label>
                            <FormGroup>
                            <Input
                                type="text"
                                placeholder="privateKey"
                                value={this.state.privateKey}
                                onChange={e => this.setState({privateKey : e.target.value})}
                                required
                            />
                            </FormGroup>
                        </Col>
                        <Col md="6" sm="6" xs="12">
                            <Label>publicKey</Label>
                            <FormGroup>
                            <Input
                                type="text"
                                placeholder="publicKey"
                                value={this.state.publicKey}
                                onChange={e => this.setState({publicKey : e.target.value})}
                                required
                            />
                            </FormGroup>
                        </Col>
                        <Col md="6" sm="6" xs="12">
                            <Label>launchUrl</Label>
                            <FormGroup>
                            <Input
                                type="text"
                                placeholder="launchUrl"
                                value={this.state.launchUrl}
                                onChange={e => this.setState({launchUrl : e.target.value})}
                                required
                            />
                            </FormGroup>
                        </Col>
                        <Col md="6" sm="6" xs="12">
                            <Label>apiUrl</Label>
                            <FormGroup>
                            <Input
                                type="text"
                                placeholder="apiUrl"
                                value={this.state.apiUrl}
                                onChange={e => this.setState({apiUrl : e.target.value})}
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
        XpressCredential : state.setting.global.XpressCredential
    }
}

export default connect(mapstop,Globalaction)(Casinopage)