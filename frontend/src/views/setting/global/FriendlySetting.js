import React from "react"
import { Row, Col, FormGroup, Label, Input} from "reactstrap"
import { connect } from "react-redux"
import * as Globalaction from "../../../redux/actions/settting/global"
import { Card, CardBody, Button} from "reactstrap"
import {Friendly} from "../../../configs/providerconfig"

import * as GlobalType from "../../../redux/types"

class Casinopage extends React.Component {
    state = {
        min : "",
        max : "",
        percent : ""
    }

    componentDidUpdate(prevProps, prevState) {  
        if (prevProps.friendly !== this.props.friendly) {
            let row = this.props.friendly;
            this.setState({
                min : row.min,
                max : row.max,
                percent : row.percent
            })
        }

    }

    save = () => {
        
        let row = {
            type : Friendly,
            content : {
                min : this.state.min,
                max : this.state.max,
                percent : this.state.percent   
            }
        }
        this.props.setGlobalConfig(row, GlobalType.GETFRIENDLY)
    }

   

    render() {
        console.log(this.state.file)
        return (
            <Card>
                <CardBody>
                    <Row>
                        <Col md="12">
                            <h3>
                                Friendly Money Config
                            </h3>
                        </Col>
                        <Col md="3" sm="6" xs="12">
                            <Label>min</Label>
                            <FormGroup>
                            <Input
                                type="text"
                                placeholder="min"
                                value={this.state.min}
                                onChange={e => this.setState({min : e.target.value})}
                                required
                            />
                            </FormGroup>
                        </Col>
                        <Col md="3" sm="6" xs="12">
                            <Label>max</Label>
                            <FormGroup>
                            <Input
                                type="text"
                                placeholder="max"
                                value={this.state.max}
                                onChange={e => this.setState({max : e.target.value})}
                                required
                            />
                            </FormGroup>
                        </Col>
                        <Col md="3" sm="6" xs="12">
                            <Label>percent</Label>
                            <FormGroup>
                            <Input
                                type="text"
                                placeholder="percent"
                                value={this.state.percent}
                                onChange={e => this.setState({percent : e.target.value})}
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
        friendly : state.setting.global.Friendly
    }
}

export default connect(mapstop,Globalaction)(Casinopage)