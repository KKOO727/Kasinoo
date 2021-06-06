import React from "react"
import { Row, Col, FormGroup, Label, Input} from "reactstrap"
import { connect } from "react-redux"
import * as Globalaction from "../../../redux/actions/settting/global"
import { Card, CardBody, Button} from "reactstrap"
import {LiveChatSetting} from "../../../configs/providerconfig"
import Toggle from "react-toggle"
import * as GlobalType from "../../../redux/types"

class Casinopage extends React.Component {
    state = {
        status : false,
        src : "",
        directsrc : ""
    }

    componentDidUpdate(prevProps, prevState) {  
        if (prevProps.LiveChatSetting !== this.props.LiveChatSetting) {
            let row = this.props.LiveChatSetting;
            this.setState({
                status : row.status,
                src : row.src,
                directsrc : row.directsrc
            })
        }

    }

    save = () => {
        
        let row = {
            type : LiveChatSetting,
            content : {
                status : this.state.status,
                src : this.state.src,
                directsrc : this.state.directsrc
            }
        }
        this.props.setGlobalConfig(row, GlobalType.GETLIVECHATSETTING)
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
                                live Chat config 
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
                            <Label>directsrc</Label>
                            <FormGroup>
                            <Input
                                type="text"
                                placeholder="Please enter directsrc"
                                value={this.state.directsrc}
                                onChange={e => this.setState({directsrc : e.target.value})}
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
        LiveChatSetting : state.setting.global.LiveChatSetting
    }
}

export default connect(mapstop,Globalaction)(Casinopage)