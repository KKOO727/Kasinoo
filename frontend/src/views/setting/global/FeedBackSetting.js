import React from "react"
import { Row, Col, FormGroup, Label, Input} from "reactstrap"
import { connect } from "react-redux"
import * as Globalaction from "../../../redux/actions/settting/global"
import { Card, CardBody, Button} from "reactstrap"
import {FeedBackSetting} from "../../../configs/providerconfig"
import Toggle from "react-toggle"
import * as GlobalType from "../../../redux/types"

class Casinopage extends React.Component {
    state = {
        status : false,
        src : "",
        hjid : "",
        hjsv : ""
    }

    componentDidUpdate(prevProps, prevState) {  
        if (prevProps.FeedBackSetting !== this.props.FeedBackSetting) {
            let row = this.props.FeedBackSetting;
            this.setState({
                status : row.status,
                src : row.src,
                hjid : row.hjid,
                hjsv : row.hjsv,
            })
        }

    }

    save = () => {
        
        let row = {
            type : FeedBackSetting,
            content : {
                status : this.state.status,
                src : this.state.src,
                hjid : this.state.hjid,
                hjsv : this.state.hjsv,
            }
        }
        this.props.setGlobalConfig(row, GlobalType.GETFeedBackSetting)
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
                                FeedBack config 
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
                            <Label>hjid</Label>
                            <FormGroup>
                            <Input
                                type="text"
                                placeholder="Please enter hjid"
                                value={this.state.hjid}
                                onChange={e => this.setState({hjid : e.target.value})}
                                required
                            />
                            </FormGroup>
                        </Col>
                        <Col md="6" >
                            <Label>hjsv</Label>
                            <FormGroup>
                            <Input
                                type="text"
                                placeholder="Please enter hjsv"
                                value={this.state.hjsv}
                                onChange={e => this.setState({hjsv : e.target.value})}
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
        FeedBackSetting : state.setting.global.FeedBackSetting
    }
}

export default connect(mapstop,Globalaction)(Casinopage)