import React from "react"
import { Row, Col, FormGroup, Label, Input} from "reactstrap"
import { connect } from "react-redux"
import * as Globalaction from "../../../redux/actions/settting/global"
import { Card, CardBody, Button} from "reactstrap"
import {LicenSeSetting} from "../../../configs/providerconfig"
import Toggle from "react-toggle"
import * as GlobalType from "../../../redux/types"

class Casinopage extends React.Component {
    state = {
        status : false,
        src : "",
        htmlcode : "",
        tagId : "",
        functionName : "",
    }

    componentDidUpdate(prevProps, prevState) {  
        if (prevProps.LicenSeSetting !== this.props.LicenSeSetting) {
            let row = this.props.LicenSeSetting;
            this.setState({
                status : row.status,
                src : row.src,
                htmlcode : row.htmlcode,
                tagId : row.tagId,
                functionName : row.functionName,
            })
        }

    }

    save = () => {
        
        let row = {
            type : LicenSeSetting,
            content : {
                status : this.state.status,
                src : this.state.src,
                htmlcode : this.state.htmlcode,
                tagId : this.state.tagId,
                functionName : this.state.functionName,
            }
        }
        this.props.setGlobalConfig(row, GlobalType.GETLicenSeSetting)
    }

   
    handleSwitchChange = () => {

        this.setState({status : !this.state.status});
    }


    render() {
        console.log(this.state.file)
        return (
            <Card>
                <CardBody>
                    <Row>
                        <Col md="12">
                            <h3>
                                License config 
                            </h3>
                        </Col>
                        <Col md="6" >
                            <Label>status</Label>
                            <FormGroup>
                                <label className="react-toggle-wrapper">
                                    <Toggle
                                        checked={this.state.status}
                                        onChange={this.handleSwitchChange}
                                        name="controlledSwitch"
                                        value="yes"
                                    />
                                    <Button.Ripple
                                        color="primary"
                                        onClick={this.handleSwitchChange}
                                        size="sm"
                                    >
                                    {this.state.status ? "Enable" : "Disable" }
                                    </Button.Ripple>
                                </label>
                            </FormGroup>
                        </Col>
                        <Col md="6" >
                            <Label>src</Label>
                            <FormGroup>
                            <Input
                                type="text"
                                placeholder="Please enter src"
                                value={this.state.src}
                                onChange={e => this.setState({src : e.target.value})}
                                required
                            />
                            </FormGroup>
                        </Col>

                        <Col md="6" >
                            <Label>htmlcode</Label>
                            <FormGroup>
                            <Input
                                type="textarea"
                                placeholder="Please enter htmlcode"
                                value={this.state.htmlcode}
                                onChange={e => this.setState({htmlcode : e.target.value})}
                                required
                            />
                            </FormGroup>
                        </Col>

                        <Col md="6" >
                            <Label>tagId</Label>
                            <FormGroup>
                            <Input
                                type="text"
                                placeholder="Please enter tagId"
                                value={this.state.tagId}
                                onChange={e => this.setState({tagId : e.target.value})}
                                required
                            />
                            </FormGroup>
                        </Col>

                        <Col md="6" >
                            <Label>functionName</Label>
                            <FormGroup>
                            <Input
                                type="text"
                                placeholder="Please enter functionName"
                                value={this.state.functionName}
                                onChange={e => this.setState({functionName : e.target.value})}
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
        LicenSeSetting : state.setting.global.LicenSeSetting
    }
}

export default connect(mapstop,Globalaction)(Casinopage)