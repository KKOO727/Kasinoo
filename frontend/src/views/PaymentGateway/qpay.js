import React from 'react'
import { Button, Card, CardBody, CardHeader, Row, Col, FormGroup, Label, Input, CardFooter, CardTitle } from "reactstrap"
import Toggle from "react-toggle"
import { connect } from "react-redux"
import { toast } from "react-toastify"
import Breadcrumbs from "../../components/@vuexy/breadCrumbs/BreadCrumb"
import { PaymentconfigSave, PaymentconfigLoad } from "../../redux/actions/paymentGateWay"

class Qpay extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          type:'Qpay',
          aggregator_id : '',
          merchant_id : '',
          merchant_key : '',
          generate_key : '',
          success_url : '',
          failure_url : '',
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
            aggregator_id : data.configData.aggregator_id,
            merchant_id : data.configData.merchant_id, 
            merchant_key : data.configData.merchant_key, 
            generate_key : data.configData.generate_key, 
            success_url : data.configData.success_url, 
            failure_url : data.configData.failure_url, 
            request_url : data.configData.request_url, 
            redirect_url : data.configData.redirect_url, 
            state : data.state, 
        })
    }

    save(){
        if(!this.state.merchant_id){
            toast.error('Merchant ID');
        }else if(!this.state.aggregator_id){
            toast.error('Aggregator ID');
        }else if(!this.state.merchant_key){
            toast.error('Merchant Key');
        }else if(!this.state.generate_key){
            toast.error('Generate Key');
        }else if(!this.state.success_url){
            toast.error('Success URL');
        }else if(!this.state.failure_url){
            toast.error('Failure URL');
        }else if(!this.state.request_url){
            toast.error('Request URL');
        }else if(!this.state.redirect_url){
            toast.error('Redirect URL');
        }else{
            var data={
                type:this.state.type,
                configData:{
                    aggregator_id :this.state.aggregator_id,
                    merchant_id :this.state.merchant_id,
                    merchant_key :this.state.merchant_key,
                    generate_key :this.state.generate_key,
                    success_url :this.state.success_url,
                    failure_url :this.state.failure_url,
                    request_url :this.state.request_url,
                    redirect_url :this.state.redirect_url,
                },
                state :this.state.state,
            }
            this.props.PaymentconfigSave(data);
        }
    }

    render (){
        return (
            <React.Fragment>
                <Breadcrumbs breadCrumbTitle="PaymentGatway" breadCrumbParent="Qpay"/>
                <Row>
                    <Card className="vw-100 top-0 left-0">
                        <CardHeader >
                            <CardTitle className="text-center" style={{margin:"auto"}}>
                                <h1 >Qpay</h1>
                            </CardTitle>
                        </CardHeader>
                        <CardBody>
                            <Row>
                                <Col md="6"  sm="12" className="p-1" >
                                    <FormGroup className="form-label-group">
                                        <Input type="text" name="aggregator_id" id="aggregator_id" placeholder="Aggregator ID"
                                            onChange={(e) => this.setState({ aggregator_id:e.target.value })}
                                            value={this.state.aggregator_id} />
                                        <Label for="Aggregator ID">Aggregator ID</Label>
                                    </FormGroup>
                                </Col>
                                <Col md="6"  sm="12" className="p-1" >
                                    <FormGroup className="form-label-group">
                                        <Input type="text" name="merchant_id" id="merchant_id" placeholder="Merchant ID"
                                            onChange={(e) => this.setState({ merchant_id:e.target.value })}
                                            value={this.state.merchant_id} />
                                        <Label for="Merchant ID">Merchant ID</Label>
                                    </FormGroup>
                                </Col>
                                <Col md="6"  sm="12" className="p-1" >
                                    <FormGroup className="form-label-group">
                                        <Input type="text" name="merchant_key" id="merchant_key" placeholder="Merchant Key"
                                            onChange={(e) => this.setState({ merchant_key:e.target.value })}
                                            value={this.state.merchant_key} />
                                        <Label for="Merchant Key">Merchant Key</Label>
                                    </FormGroup>
                                </Col>
                                <Col md="6"  sm="12" className="p-1" >
                                    <FormGroup className="form-label-group">
                                        <Input type="text" name="generate_key" id="generate_key" placeholder="Generate Key"
                                            onChange={(e) => this.setState({ generate_key:e.target.value })}
                                            value={this.state.generate_key} />
                                        <Label for="Generate Key">Generate Key</Label>
                                    </FormGroup>
                                </Col>
                                <Col md="6"  sm="12" className="p-1" >
                                    <FormGroup className="form-label-group">
                                        <Input type="text" name="success_url" id="success_url" placeholder="Success URL"
                                            onChange={(e) => this.setState({ success_url:e.target.value })}
                                            value={this.state.success_url} />
                                        <Label for="Success URL">Success URL</Label>
                                    </FormGroup>
                                </Col>
                                <Col md="6"  sm="12" className="p-1" >
                                    <FormGroup className="form-label-group">
                                        <Input type="text" name="failure_url" id="failure_url" placeholder="Failure URL"
                                            onChange={(e) => this.setState({ failure_url:e.target.value })}
                                            value={this.state.failure_url} />
                                        <Label for="Failure URL">Failure URL</Label>
                                    </FormGroup>
                                </Col>
                                <Col md="6"  sm="12" className="p-1" >
                                    <FormGroup className="form-label-group">
                                        <Input type="text" name="request_url" id="request_url" placeholder="Request URL"
                                            onChange={(e) => this.setState({ request_url:e.target.value })}
                                            value={this.state.request_url} />
                                        <Label for="Request URL">Request URL</Label>
                                    </FormGroup>
                                </Col>
                                <Col md="6"  sm="12" className="p-1" >
                                    <FormGroup className="form-label-group">
                                        <Input type="text" name="redirect_url" id="redirect_url" placeholder="Redirect URL"
                                            onChange={(e) => this.setState({ redirect_url:e.target.value })}
                                            value={this.state.redirect_url} />
                                        <Label for="Redirect URL">Redirect URL</Label>
                                    </FormGroup>
                                </Col>
                                <Col md="6"  sm="12" className="p-1" >
                                    <label className="react-toggle-wrapper">
                                        <Label for="Disable Qpay">Disable Qpay</Label>
                                        <Toggle
                                            checked={this.state.state}
                                            onChange={()=>this.setState({state:!this.state.state})}
                                            name="controlledSwitch"
                                            value="yes"
                                            className="mr-1 ml-1"
                                            style={{height:'10px !important'}}
                                        />
                                        <Label for="Enable Qpay">Enable Qpay</Label>
                                    </label>
                                </Col>
                            </Row>
                        </CardBody>
                        <CardFooter>
                            <Button.Ripple style={{fontSize:"1rem"}} color="success" type="button" onClick={()=>this.save()}>save</Button.Ripple>
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
export default connect(paymentConfigData,{PaymentconfigSave, PaymentconfigLoad})(Qpay)