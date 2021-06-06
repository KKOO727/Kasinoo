import React from "react"
import { Row, Col, FormGroup, Label, Input} from "reactstrap"
import { connect } from "react-redux"
import * as Globalaction from "../../../redux/actions/settting/global"
import { Card, CardBody, Button} from "reactstrap"
import {WACCreential} from "../../../configs/providerconfig"

import * as GlobalType from "../../../redux/types"

class Casinopage extends React.Component {
    state = {
        operatorToken : "",
        LaunchUrl : "",
    }

    componentDidUpdate(prevProps, prevState) {  
        if (prevProps.WACCreential !== this.props.WACCreential) {
            let row = this.props.WACCreential;
            this.setState({
                operatorToken : row.operatorToken,
                LaunchUrl : row.LaunchUrl,
            })
        }

    }

    save = () => {
        
        let row = {
            type : WACCreential,
            content : {
                operatorToken : this.state.operatorToken,
                LaunchUrl : this.state.LaunchUrl,
               
            }
        }
        this.props.setGlobalConfig(row, GlobalType.GETWACCreential)
    }

   

    render() {
        return (
            <Card>
                <CardBody>
                    <Row>
                        <Col md="12">
                            <h3>
                                Wac Credential
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
        WACCreential : state.setting.global.WACCreential
    }
}

export default connect(mapstop,Globalaction)(Casinopage)