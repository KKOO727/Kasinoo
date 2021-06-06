import React from "react"
import { Row, Col, FormGroup, Label, Input} from "reactstrap"
import { connect } from "react-redux"
import * as Globalaction from "../../../redux/actions/settting/global"
import { Card, CardBody, Button} from "reactstrap"
import {EZUGICreential} from "../../../configs/providerconfig"

import * as GlobalType from "../../../redux/types"

class Casinopage extends React.Component {
    state = {
        operatorId : "",
        LaunchUrl : "",
        hashkey : "",
    }

    componentDidUpdate(prevProps, prevState) {  
        if (prevProps.EZUGICreential !== this.props.EZUGICreential) {
            let row = this.props.EZUGICreential;
            this.setState({
                operatorId : row.operatorId,
                LaunchUrl : row.LaunchUrl,
                hashkey : row.hashkey,
            })
        }

    }

    save = () => {
        
        let row = {
            type : EZUGICreential,
            content : {
                operatorId : this.state.operatorId,
                LaunchUrl : this.state.LaunchUrl,
                hashkey : this.state.hashkey,
               
            }
        }
        this.props.setGlobalConfig(row, GlobalType.GETEZUGICreential)
    }

   

    render() {
        return (
            <Card>
                <CardBody>
                    <Row>
                        <Col md="12">
                            <h3>
                                Ezugi Credential
                            </h3>
                        </Col>
                        <Col md="6" sm="6" xs="12">
                            <Label>operatorId</Label>
                            <FormGroup>
                            <Input
                                type="text"
                                placeholder="operatorId"
                                value={this.state.operatorId}
                                onChange={e => this.setState({operatorId : e.target.value})}
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
        EZUGICreential : state.setting.global.EZUGICreential
    }
}

export default connect(mapstop,Globalaction)(Casinopage)