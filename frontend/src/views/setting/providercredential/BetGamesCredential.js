import React from "react"
import { Row, Col, FormGroup, Label, Input} from "reactstrap"
import { connect } from "react-redux"
import * as Globalaction from "../../../redux/actions/settting/global"
import { Card, CardBody, Button} from "reactstrap"
import {WACCreential} from "../../../configs/providerconfig"

import * as GlobalType from "../../../redux/types"

class Casinopage extends React.Component {
    state = {
        apicode : "",
        LaunchUrl : "",
    }

    componentDidUpdate(prevProps, prevState) {  
        if (prevProps.WACCreential !== this.props.WACCreential) {
            let row = this.props.WACCreential;
            this.setState({
                apicode : row.apicode,
                LaunchUrl : row.LaunchUrl,
            })
        }

    }

    save = () => {
        
        let row = {
            type : WACCreential,
            content : {
                apicode : this.state.apicode,
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
                                Bet games  Credential
                            </h3>
                        </Col>
                        <Col md="6" sm="6" xs="12">
                            <Label>apicode</Label>
                            <FormGroup>
                            <Input
                                type="text"
                                placeholder="apicode"
                                value={this.state.apicode}
                                onChange={e => this.setState({apicode : e.target.value})}
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