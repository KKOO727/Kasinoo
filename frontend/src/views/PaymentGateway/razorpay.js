import React from 'react'
import { Button, Card, CardBody, CardHeader, Row, Col, FormGroup, Label, Input, CardFooter, CardTitle, Form } from "reactstrap"
import Toggle from "react-toggle"
import { connect } from "react-redux"
import Breadcrumbs from "../../components/@vuexy/breadCrumbs/BreadCrumb"
import { PaymentconfigSave, PaymentconfigLoad } from "../../redux/actions/paymentGateWay"

class Razorpay extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          type:'Razorpay',
          merchantId : '',
          account_number : '',
          key_id : '',
          key_secret : '',
          success_url : '',
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
            merchantId : data.configData.merchantId,
            account_number : data.configData.account_number,
            key_id : data.configData.key_id, 
            key_secret : data.configData.key_secret, 
            success_url : data.configData.success_url, 
            state : data.state, 
        })
    }

    save = e => {
        e.preventDefault();
        var data={
            type:this.state.type,
            configData:{
                merchantId :this.state.merchantId,
                account_number :this.state.account_number,
                key_id :this.state.key_id,
                key_secret :this.state.key_secret,
                success_url :this.state.success_url,
            },
            state :this.state.state,
        }
        this.props.PaymentconfigSave(data);
    }

    render (){
        return (
            <React.Fragment>
                <Breadcrumbs breadCrumbTitle="PaymentGatway" breadCrumbParent="Razorpay"/>
                    <Form action="/" onSubmit={this.save}>
                        <Card className="w-100">
                            <CardHeader >
                                <CardTitle className="text-center" style={{margin:"auto"}}>
                                    <h1 >Razorpay</h1>
                                </CardTitle>
                            </CardHeader>
                            <CardBody>
                                <Row>
                                    <Col md="6"  sm="12" className="p-1" >
                                        <FormGroup className="form-label-group">
                                            <Input required type="text" name="merchantId" id="merchantId" placeholder="Merchant Id"
                                                onChange={(e) => this.setState({ merchantId:e.target.value })}
                                                value={this.state.merchantId} />
                                            <Label for="Merchant Id">Merchant Id</Label>
                                        </FormGroup>
                                    </Col>
                                    <Col md="6"  sm="12" className="p-1" >
                                        <FormGroup className="form-label-group">
                                            <Input required type="text" name="account_number" id="account_number" placeholder="Account Number"
                                                onChange={(e) => this.setState({ account_number:e.target.value })}
                                                value={this.state.account_number} />
                                            <Label for="Account Number">Account Number</Label>
                                        </FormGroup>
                                    </Col>
                                    <Col md="6"  sm="12" className="p-1" >
                                        <FormGroup className="form-label-group">
                                            <Input required type="text" name="key_id" id="key_id" placeholder="Key Id"
                                                onChange={(e) => this.setState({ key_id:e.target.value })}
                                                value={this.state.key_id} />
                                            <Label for="Key Id">Key Id</Label>
                                        </FormGroup>
                                    </Col>
                                    <Col md="6"  sm="12" className="p-1" >
                                        <FormGroup className="form-label-group">
                                            <Input required type="text" name="key_secret" id="key_secret" placeholder="Key Secret"
                                                onChange={(e) => this.setState({ key_secret:e.target.value })}
                                                value={this.state.key_secret} />
                                            <Label for="Key Secret">Key Secret</Label>
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
                                        <label className="react-toggle-wrapper">
                                            <Label for="Disable Razorpay">Disable Razorpay</Label>
                                            <Toggle
                                                checked={this.state.state}
                                                onChange={()=>this.setState({state:!this.state.state})}
                                                name="controlledSwitch"
                                                value="yes"
                                                className="mr-1 ml-1"
                                                style={{height:'10px !important'}}
                                            />
                                            <Label for="Enable Razorpay">Enable Razorpay</Label>
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
export default connect(paymentConfigData,{PaymentconfigSave, PaymentconfigLoad})(Razorpay)