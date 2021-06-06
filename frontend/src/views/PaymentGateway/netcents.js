import React from 'react'
import { Button, Card, CardBody, CardHeader, Row, Col, FormGroup, Label, Input, CardFooter, CardTitle } from "reactstrap"
import Toggle from "react-toggle"
import { connect } from "react-redux"
import { toast } from "react-toastify"
import Breadcrumbs from "../../components/@vuexy/breadCrumbs/BreadCrumb"
import { PaymentconfigLoad, PaymentconfigSave } from "../../redux/actions/paymentGateWay"
class NetcentsPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            type : 'netcents',
            apikey : '',
            apisecret : '',
            pluginid : '',
            domain : '',
            paymentreceivedurl : '',
            webhookurl : '',
            cancelurl : '',
            request_url1 : '',
            request_url2 : '',
            state : false,
        }
    }

    componentDidMount(){
        this.props.PaymentconfigLoad(this.state.type);
    }
    
    componentDidUpdate(prevProps, prevState) {
        if (prevProps.paymentconfig !== this.props.paymentconfig) {
            this.load(this.props.paymentconfig);
        }
    }

    load(data){
        this.setState({
            apikey : data.configData.apikey,
            apisecret : data.configData.apisecret,
            pluginid : data.configData.pluginid,
            domain : data.configData.domain,
            paymentreceivedurl : data.configData.paymentreceivedurl,
            webhookurl : data.configData.webhookurl,
            cancelurl : data.configData.cancelurl,
            request_url1 : data.configData.request_url1,
            request_url2 : data.configData.request_url2,
            state : data.state,
        })
    }

    save () {
        if(!this.state.apikey){
            toast.error('API KEY.');
        }else if(!this.state.apisecret){
            toast.error('API SECRET.');
        }else if(!this.state.pluginid){
            toast.error('Plugin ID.');
        }else if(!this.state.domain){
            toast.error('Domain.');
        }else if(!this.state.paymentreceivedurl){
            toast.error('Payment received URL.');
        }else if(!this.state.webhookurl){
            toast.error('Payment Webhook URL.');
        }else if(!this.state.cancelurl){
            toast.error('Payment Cancel URL.');            
        }else if(!this.state.request_url1){
            toast.error('Payment Request URL 1.');            
        }else if(!this.state.request_url2){
            toast.error('Payment Request URL 2.');            
        }else{
            var data={
                type : this.state.type,
                configData : {
                    apikey : this.state.apikey,
                    apisecret : this.state.apisecret,
                    pluginid : this.state.pluginid,
                    domain : this.state.domain,
                    paymentreceivedurl : this.state.paymentreceivedurl,
                    webhookurl : this.state.webhookurl,
                    cancelurl : this.state.cancelurl,
                    request_url1 : this.state.request_url1,
                    request_url2 : this.state.request_url2,
                },
                state : this.state.state,                
            }
            this.props.PaymentconfigSave(data);
        }
    }
    
    render (){
        return (
            <React.Fragment>
                <Breadcrumbs breadCrumbTitle="PaymentGatway" breadCrumbParent="Netcents"/>
                <Row>
                    <Card className="vw-100 top-0 left-0">
                        <CardHeader >
                            <CardTitle className="text-center" style={{margin:"auto"}}>
                                <h1 >Netcents</h1>
                            </CardTitle>
                        </CardHeader>
                        <CardBody>
                            <Row >
                                <Col md="12" sm="12" className="p-1">
                                    <h6>LIVE KEYS</h6>
                                </Col>
                                <Col md="4" sm="12" className="p-1" >
                                    <FormGroup className="form-label-group">
                                        <Input type="text" name="API KEY" id="apikey" placeholder="API KEY"
                                            onChange={(e) => this.setState({ apikey:e.target.value })}
                                            value={this.state.apikey} />
                                        <Label for="API KEY">API KEY</Label>
                                    </FormGroup>
                                </Col>
                                <Col md="4"  sm="12" className="p-1" >
                                    <FormGroup className="form-label-group">
                                        <Input type="text" name="API SECRET" id="apisecret" placeholder="API SECRET"
                                            onChange={(e) => this.setState({ apisecret:e.target.value })}
                                            value={this.state.apisecret} />
                                        <Label for="API SECRET">API SECRET</Label>
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row >
                                <Col md="12" sm="12" className="p-1">
                                    <h6>PLUGINS</h6>
                                </Col>
                                <Col md="4"  sm="12" className="p-1" >
                                    <FormGroup className="form-label-group">
                                        <Input type="text" name="Plugin ID" id="pluginid" placeholder="Plugin ID"
                                            onChange={(e) => this.setState({ pluginid:e.target.value })}
                                            value={this.state.pluginid} />
                                        <Label for="Plugin ID">Plugin ID</Label>
                                    </FormGroup>
                                </Col>
                                <Col md="4"  sm="12" className="p-1" >
                                    <FormGroup className="form-label-group">
                                        <Input type="text" name="Domain" id="domain" placeholder="Domain"
                                            onChange={(e) => this.setState({ domain:e.target.value })}
                                            value={this.state.domain} />
                                        <Label for="Domain">Domain</Label>
                                    </FormGroup>
                                </Col>
                                <Col md="4"  sm="12" className="p-1" >
                                    <FormGroup className="form-label-group">
                                        <Input type="text" name="Payment received URL" id="paymentreceivedurl" placeholder="Payment received URL"
                                            onChange={(e) => this.setState({ paymentreceivedurl:e.target.value })}
                                            value={this.state.paymentreceivedurl} />
                                        <Label for="Payment received URL">Payment received URL</Label>
                                    </FormGroup>
                                </Col>
                                <Col md="4"  sm="12" className="p-1" >
                                    <FormGroup className="form-label-group">
                                        <Input type="text" name="Webhook URL" id="webhookurl" placeholder="Webhook URL"
                                            onChange={(e) => this.setState({ webhookurl:e.target.value })}
                                            value={this.state.webhookurl} />
                                        <Label for="Webhook URL">Webhook URL</Label>
                                    </FormGroup>
                                </Col>
                                <Col md="4"  sm="12" className="p-1" >
                                    <FormGroup className="form-label-group">
                                        <Input type="text" name="Cancel URL" id="cancelurl" placeholder="Cancel URL"
                                            onChange={(e) => this.setState({ cancelurl:e.target.value })}
                                            value={this.state.cancelurl} />
                                        <Label for="Cancel URL">Cancel URL</Label>
                                    </FormGroup>
                                </Col>
                                <Col md="4"  sm="12" className="p-1" >
                                    <FormGroup className="form-label-group">
                                        <Input type="text" name="Request Url 1" id="request_url1" placeholder="Request Url 1"
                                            onChange={(e) => this.setState({ request_url1:e.target.value })}
                                            value={this.state.request_url1} />
                                        <Label for="Request Url 1">Request Url 1</Label>
                                    </FormGroup>
                                </Col>
                                <Col md="4"  sm="12" className="p-1" >
                                    <FormGroup className="form-label-group">
                                        <Input type="text" name="Request Url 2" id="request_url2" placeholder="Request Url 2"
                                            onChange={(e) => this.setState({ request_url2:e.target.value })}
                                            value={this.state.request_url2} />
                                        <Label for="Request Url 2">Request Url 2</Label>
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row>
                                <Col md="4"  sm="12" className="p-1" >
                                    <label className="react-toggle-wrapper">
                                        <Label for="Disable Netcents">Disable Netcents</Label>
                                        <Toggle
                                            checked={this.state.state}
                                            onChange={()=>this.setState({state:!this.state.state})}
                                            name="controlledSwitch"
                                            value="yes"
                                            className="mr-1 ml-1"
                                            style={{height:'10px !important'}}
                                        />
                                        <Label for="Enable Netcents">Enable Netcents</Label>
                                    </label>
                                </Col>
                            </Row>
                        </CardBody>
                        <CardFooter>
                            <Button.Ripple style={{fontSize:"1rem"}} color="success" type="button" onClick={()=>this.save()} >Save</Button.Ripple>
                        </CardFooter>
                    </Card>
                </Row>
            </React.Fragment>
        )
    }
}

const paymentConfigData = (state) =>{
    return {
        paymentconfig : state.paymentGateWay.paymentconfig,
    }
}
export default connect(paymentConfigData,{PaymentconfigLoad, PaymentconfigSave})(NetcentsPage)