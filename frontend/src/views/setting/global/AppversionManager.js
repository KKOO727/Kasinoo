import React from "react"
import { Row, Col, FormGroup, Label, Input} from "reactstrap"
import { connect } from "react-redux"
import * as Globalaction from "../../../redux/actions/settting/global"

import { Card, CardBody, Button} from "reactstrap"
import {AppversionKey} from "../../../configs/providerconfig"

import * as GlobalType from "../../../redux/types"

class Casinopage extends React.Component {
    state = {
        isChecked : false,
        versionCode : "",
        versionName : "",
        apkUrl : "",
        forceUpdate : false,
        file : null
    }

    componentDidUpdate(prevProps, prevState) {  
        // let data = {
        //     "versionName":"1.0.0",
        //     "versionCode": "1",
        //     "apkUrl":"https://cms.fairbets.co/apps/fairbets_v1.apk",
        //     "forceUpdate": false
        // }
        if (prevProps.appconfig !== this.props.appconfig) {
            let row = this.props.appconfig;
            this.setState({
                versionCode : row.versionCode,
                versionName : row.versionName,
                apkUrl : row.apkUrl
            })
        }

    }

    save = () => {
        console.log(this.state.file)
        const fpdata = new FormData();
        fpdata.append('fpImgFile', this.state.file && this.state.file.length ? this.state.file[0] : null);
        fpdata.append('versionName', this.state.versionName);
        fpdata.append('versionCode', this.state.versionCode);
        fpdata.append('apkUrl', this.state.apkUrl);
        fpdata.append('type', AppversionKey);
        this.props.appconfigSave(fpdata,GlobalType.GETAPPCONFIG);
    }

   

    render() {
        console.log(this.state.file)
        return (
            <Card>
                <CardBody>
                    <Row>
                        <Col md="12">
                            <h3>
                                Apk Version Manager
                            </h3>
                        </Col>
                        <Col md="3" sm="6" xs="12">
                            <Label>versionName</Label>
                            <FormGroup>
                            <Input
                                type="text"
                                placeholder="versionName"
                                value={this.state.versionName}
                                onChange={e => this.setState({versionName : e.target.value})}
                                required
                            />
                            </FormGroup>
                        </Col>
                        <Col md="3" sm="6" xs="12">
                            <Label>versionCode</Label>
                            <FormGroup>
                            <Input
                                type="text"
                                placeholder="versionCode"
                                value={this.state.versionCode}
                                onChange={e => this.setState({versionCode : e.target.value})}
                                required
                            />
                            </FormGroup>
                        </Col>
                        <Col md="3" sm="6" xs="12">
                            <Label>apkUrl</Label>
                            <FormGroup>
                            <Input
                                type="text"
                                placeholder="Apk Name"
                                value={this.state.apkUrl}
                                onChange={e => this.setState({apkUrl : e.target.value})}
                                required
                            />
                            </FormGroup>
                        </Col>

                        <Col md="3" sm="6" xs="12">
                            <Label>file</Label>
                            <FormGroup>
                                <Input
                                    type="file"
                                    id="apkfile"
                                    placeholder="Apk"
                                    accept="*"
                                    onChange={e => this.setState({file : e.target.files})}
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
        appconfig : state.setting.global.appversion
    }
}

export default connect(mapstop,Globalaction)(Casinopage)