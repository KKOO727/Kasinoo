import React from 'react'
import { Button, Card, CardBody, CardHeader, Row, Col, FormGroup, Label, Input, CardFooter, CardTitle, Form } from "reactstrap"
import Toggle from "react-toggle"
import { connect } from "react-redux"
import Breadcrumbs from "../../components/@vuexy/breadCrumbs/BreadCrumb"
import { PaymentconfigSave, PaymentconfigLoad } from "../../redux/actions/paymentGateWay"

class Cashfree extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          type:'Cashfree',
          appId : '',
          secretKey : '',
          success_url : '',
          request_url : '',
          redirect_url : '',
          state : false
        };
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
            appId : data.configData.appId,
            secretKey : data.configData.secretKey, 
            success_url : data.configData.success_url, 
            request_url : data.configData.request_url, 
            redirect_url : data.configData.redirect_url, 
            state : data.state, 
        })
    }

    save = e => {
        e.preventDefault();
        var data={
            type:this.state.type,
            configData:{
                appId :this.state.appId,
                secretKey :this.state.secretKey,
                success_url :this.state.success_url,
                request_url :this.state.request_url,
                redirect_url :this.state.redirect_url,
            },
            state :this.state.state,
        }
        this.props.PaymentconfigSave(data);
    }

    render (){
        return (
            <React.Fragment>
                <Breadcrumbs breadCrumbTitle="PaymentGatway" breadCrumbParent="Cashfree"/>
                    <Form action="/" onSubmit={this.save}>
                        <Card className="w-100">
                            <CardHeader >
                                <CardTitle className="text-center" style={{margin:"auto"}}>
                                    <h1 >Cashfree</h1>
                                </CardTitle>
                            </CardHeader>
                            <CardBody>
                                <Row>
                                    <Col md="6"  sm="12" className="p-1" >
                                        <FormGroup className="form-label-group">
                                            <Input required type="text" name="appId" id="appId" placeholder="App ID"
                                                onChange={(e) => this.setState({ appId:e.target.value })}
                                                value={this.state.appId} />
                                            <Label for="App ID">App ID</Label>
                                        </FormGroup>
                                    </Col>
                                    <Col md="6"  sm="12" className="p-1" >
                                        <FormGroup className="form-label-group">
                                            <Input required type="text" name="secretKey" id="secretKey" placeholder="Secret Key"
                                                onChange={(e) => this.setState({ secretKey:e.target.value })}
                                                value={this.state.secretKey} />
                                            <Label for="Secret Key">Secret Key</Label>
                                        </FormGroup>
                                    </Col>
                                    <Col md="6"  sm="12" className="p-1" >
                                        <FormGroup className="form-label-group">
                                            <Input required type="text" name="success_url" id="success_url" placeholder="Success URL"
                                                onChange={(e) => this.setState({ success_url:e.target.value })}
                                                value={this.state.success_url} />
                                            <Label for="Success URL">Success URL</Label>
                                        </FormGroup>
                                    </Col>
                                    <Col md="6"  sm="12" className="p-1" >
                                        <FormGroup className="form-label-group">
                                            <Input required type="text" name="request_url" id="request_url" placeholder="Request URL"
                                                onChange={(e) => this.setState({ request_url:e.target.value })}
                                                value={this.state.request_url} />
                                            <Label for="Request URL">Request URL</Label>
                                        </FormGroup>
                                    </Col>
                                    <Col md="6"  sm="12" className="p-1" >
                                        <FormGroup className="form-label-group">
                                            <Input required type="text" name="redirect_url" id="redirect_url" placeholder="Redirect URL"
                                                onChange={(e) => this.setState({ redirect_url:e.target.value })}
                                                value={this.state.redirect_url} />
                                            <Label for="Redirect URL">Redirect URL</Label>
                                        </FormGroup>
                                    </Col>
                                    <Col md="6"  sm="12" className="p-1" >
                                        <label className="react-toggle-wrapper">
                                            <Label for="Disable Cashfree">Disable Cashfree</Label>
                                            <Toggle
                                                checked={this.state.state}
                                                onChange={()=>this.setState({state:!this.state.state})}
                                                name="controlledSwitch"
                                                value="yes"
                                                className="mr-1 ml-1"
                                                style={{height:'10px !important'}}
                                            />
                                            <Label for="Enable Cashfree">Enable Cashfree</Label>
                                        </label>
                                    </Col>
                                </Row>
                            </CardBody>
                            <CardFooter>
                                <Button.Ripple style={{fontSize:"1rem"}} color="success" type="submit">save</Button.Ripple>
                            </CardFooter>
                        </Card>  
                    </Form>
            </React.Fragment>
        )
    }
}
const paymentConfigData = (state) =>{
    return {
        paymentconfig : state.paymentGateWay.paymentconfig,
    }
}
export default connect(paymentConfigData,{PaymentconfigSave, PaymentconfigLoad})(Cashfree)