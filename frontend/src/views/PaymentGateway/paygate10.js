import React from 'react'
import { Button, Card, CardBody, CardHeader, Row, Col, FormGroup, Label, Input, CardFooter, CardTitle, Form } from "reactstrap"
import Toggle from "react-toggle"
import { connect } from "react-redux"
import Breadcrumbs from "../../components/@vuexy/breadCrumbs/BreadCrumb"
import { PaymentconfigSave, PaymentconfigLoad } from "../../redux/actions/paymentGateWay"
import {PaymentListKey} from "../../configs/providerconfig"

class Paygate10 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          type:PaymentListKey['Paygate10'],
          midcode : '',
          midsecret : '',
          apikey : '',
          apisecret : '',
          callbackurl : '',
          callbackurl2 : '',
          callbackurl_c : '',
          callbackurl_c2 : '',
          return_url : '',
          request_url : '',
          telegramreturnurl : "",
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
            midcode : data.configData.midcode,
            midsecret : data.configData.midsecret, 
            apikey : data.configData.apikey,
            apisecret : data.configData.apisecret, 
            callbackurl : data.configData.callbackurl, 
            callbackurl2 : data.configData.callbackurl2, 
            callbackurl_c : data.configData.callbackurl_c, 
            callbackurl_c2 : data.configData.callbackurl_c2, 
            return_url : data.configData.return_url, 
            request_url : data.configData.request_url, 
            telegramreturnurl : data.configData.telegramreturnurl,
            state : data.state, 
        })
    }

    save = e => {
        e.preventDefault();
        var data={
            type:this.state.type,
            configData:{
                midcode :this.state.midcode,
                midsecret :this.state.midsecret,
                apikey :this.state.apikey,
                apisecret :this.state.apisecret,
                callbackurl :this.state.callbackurl,
                callbackurl2 :this.state.callbackurl2,
                callbackurl_c :this.state.callbackurl_c,
                callbackurl_c2 :this.state.callbackurl_c2,
                return_url :this.state.return_url,
                request_url :this.state.request_url,
                telegramreturnurl : this.state.telegramreturnurl
            },
            state :this.state.state,
        }
        this.props.PaymentconfigSave(data);
    }

    render (){
        return (
            <React.Fragment>
                <Breadcrumbs breadCrumbTitle="PaymentGatway" breadCrumbParent="Paymentconfiguration" breadCrumbParent2={this.state.type}/>
                    <Form action="#" onSubmit={this.save}>
                        <Card className="w-100">
                            <CardHeader >
                                <CardTitle className="text-center" style={{margin:"auto"}}>
                                    <h1 >{this.state.type}</h1>
                                </CardTitle>
                            </CardHeader>
                            <CardBody>
                                <Row>
                                    <Col md="12" sm="12" className="p-1">
                                        <h6>Netbanking Transfer</h6>
                                    </Col>
                                    <Col md="6"  sm="12" className="p-1" >
                                        <FormGroup className="form-label-group">
                                            <Input required type="text" name="midcode" id="midcode" placeholder="Mid code"
                                                onChange={(e) => this.setState({ midcode:e.target.value })}
                                                value={this.state.midcode} />
                                            <Label for="Mid code">Mid code</Label>
                                        </FormGroup>
                                    </Col>
                                    <Col md="6"  sm="12" className="p-1" >
                                        <FormGroup className="form-label-group">
                                            <Input required type="text" name="midsecret" id="midsecret" placeholder="Mid secret"
                                                onChange={(e) => this.setState({ midsecret:e.target.value })}
                                                value={this.state.midsecret} />
                                            <Label for="Mid secret">Mid secret</Label>
                                        </FormGroup>
                                    </Col>
                                    <Col md="6"  sm="12" className="p-1" >
                                        <FormGroup className="form-label-group">
                                            <Input required type="text" name="callbackurl" id="callbackurl" placeholder="Deposit Callback Url"
                                                onChange={(e) => this.setState({ callbackurl:e.target.value })}
                                                value={this.state.callbackurl} />
                                            <Label for="Deposit Callback Url">Deposit Callback Url</Label>
                                        </FormGroup>
                                    </Col>
                                    <Col md="6"  sm="12" className="p-1" >
                                        <FormGroup className="form-label-group">
                                            <Input required type="text" name="callbackurl2" id="callbackurl2" placeholder="Withdrawal Callback Url"
                                                onChange={(e) => this.setState({ callbackurl2:e.target.value })}
                                                value={this.state.callbackurl2} />
                                            <Label for="Withdrawal Callback Url">Withdrawal Callback Url</Label>
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md="12" sm="12" className="p-1">
                                        <h6>COD Transfer</h6>
                                    </Col>
                                    <Col md="6"  sm="12" className="p-1" >
                                        <FormGroup className="form-label-group">
                                            <Input required type="text" name="apikey" id="apikey" placeholder="Api key"
                                                onChange={(e) => this.setState({ apikey:e.target.value })}
                                                value={this.state.apikey} />
                                            <Label for="Api key">Api key</Label>
                                        </FormGroup>
                                    </Col>
                                    <Col md="6"  sm="12" className="p-1" >
                                        <FormGroup className="form-label-group">
                                            <Input required type="text" name="apisecret" id="apisecret" placeholder="Api secret"
                                                onChange={(e) => this.setState({ apisecret:e.target.value })}
                                                value={this.state.apisecret} />
                                            <Label for="Api secret">Api secret</Label>
                                        </FormGroup>
                                    </Col>
                                    <Col md="6"  sm="12" className="p-1" >
                                        <FormGroup className="form-label-group">
                                            <Input required type="text" name="callbackurl_c" id="callbackurl_c" placeholder="Deposit Callback Url"
                                                onChange={(e) => this.setState({ callbackurl_c:e.target.value })}
                                                value={this.state.callbackurl_c} />
                                            <Label for="Deposit Callback Url">Deposit Callback Url</Label>
                                        </FormGroup>
                                    </Col>
                                    <Col md="6"  sm="12" className="p-1" >
                                        <FormGroup className="form-label-group">
                                            <Input required type="text" name="callbackurl_c2" id="callbackurl_c2" placeholder="Withdrawal Callback Url"
                                                onChange={(e) => this.setState({ callbackurl_c2:e.target.value })}
                                                value={this.state.callbackurl_c2} />
                                            <Label for="Withdrawal Callback Url">Withdrawal Callback Url</Label>
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <Row className='mt-3'>
                                    <Col md="6"  sm="12" className="p-1" >
                                        <FormGroup className="form-label-group">
                                            <Input required type="text" name="return_url" id="return_url" placeholder="Return URL"
                                                onChange={(e) => this.setState({ return_url:e.target.value })}
                                                value={this.state.return_url} />
                                            <Label for="Return URL">Return URL</Label>
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
                                            <Input type="text" name="telegramreturnurl" id="telegramreturnurl" placeholder="telegramreturnurl"
                                                onChange={(e) => this.setState({ telegramreturnurl:e.target.value })}required
                                                value={this.state.telegramreturnurl} />
                                            <Label for="telegramreturnurl">telegram return url</Label>
                                        </FormGroup>
                                    </Col>

                                    <Col md="6"  sm="12" className="p-1" >
                                        <label className="react-toggle-wrapper">
                                            <Label for="Status">Status</Label>
                                            <Toggle
                                                checked={this.state.state}
                                                onChange={()=>this.setState({state:!this.state.state})}
                                                name="controlledSwitch"
                                                value="yes"
                                                className="mr-1 ml-1"
                                                style={{height:'10px !important'}}
                                            />
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
export default connect(paymentConfigData,{PaymentconfigSave, PaymentconfigLoad})(Paygate10)