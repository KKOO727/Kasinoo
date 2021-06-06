import React from 'react'
import { Button, Card, CardBody, CardHeader, Row, Col, FormGroup, Label, Input, CardFooter, CardTitle ,Form} from "reactstrap"
import Toggle from "react-toggle"
import { connect } from "react-redux"
import Breadcrumbs from "../../components/@vuexy/breadCrumbs/BreadCrumb"
import { PaymentconfigSave, PaymentconfigLoad } from "../../redux/actions/paymentGateWay"
import {PaymentListKey} from "../../configs/providerconfig"

class YaarPay extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          type : PaymentListKey.YaarPay,
          merchant_id : '',
          merchant_key : '',
          application_id : '',
          notify_url : '',
          return_url : '',
          request_url : '',
          redirect_url : '',
          notify_url2 : '',
          return_url2 : '',
          payout_notify_url : '',
          payout_request_url : '',
          state : false,
          currency : "",
          version : "",
          telegramreturnurl : ""
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

    load = (data) =>{
        this.setState({
            merchant_id : data.configData.merchant_id,
            merchant_key : data.configData.merchant_key,
            application_id : data.configData.application_id,
            notify_url : data.configData.notify_url,
            return_url : data.configData.return_url,
            notify_url2 : data.configData.notify_url2,
            return_url2 : data.configData.return_url2,
            request_url : data.configData.request_url,
            redirect_url : data.configData.redirect_url,
            payout_request_url : data.configData.payout_request_url,
            payout_notify_url : data.configData.payout_notify_url,
            state : data.state,
            currency : data.configData.currency,
            version : data.configData.version,
            telegramreturnurl : data.configData.telegramreturnurl
        })
    }

    save = (e) => {
        e.preventDefault();
        let row = this.state;
        var data = {
            type : row.type,
            configData : {
                merchant_id : row.merchant_id,
                merchant_key : row.merchant_key,
                application_id : row.application_id,
                request_url : row.request_url,
                redirect_url : row.redirect_url,
                notify_url : row.notify_url,
                return_url : row.return_url,
                notify_url2 : row.notify_url2,
                return_url2 : row.return_url2,
                payout_notify_url : row.payout_notify_url,
                payout_request_url : row.payout_request_url,
                currency : row.currency,
                version : row.version,
                telegramreturnurl:  row.telegramreturnurl
            },
            state : row.state,                
        }
        this.props.PaymentconfigSave(data);
    }

    render (){
        return (
            <React.Fragment>
                <Breadcrumbs breadCrumbTitle="PaymentGatway" breadCrumbParent="Paymentconfiguration" breadCrumbParent2={this.state.type}/>
                <Form action="#" onSubmit={this.save}>
                    <Row>
                        <Card className="vw-100 top-0 left-0">
                            <CardHeader >
                                <CardTitle className="text-center" style={{margin:"auto"}}>
                                    <h1 >{this.state.type}</h1>
                                </CardTitle>
                            </CardHeader>
                            <CardBody>
                                <Row>
                                    <Col md="6"  sm="12" className="p-1" >
                                        <FormGroup className="form-label-group">
                                            <Input type="text" name="merchant_id" id="merchant_id" placeholder="Merchant ID"
                                                onChange={(e) => this.setState({ merchant_id:e.target.value })} required
                                                value={this.state.merchant_id} />
                                            <Label for="Merchant ID">Merchant ID</Label>
                                        </FormGroup>
                                    </Col>
                                    <Col md="6"  sm="12" className="p-1" >
                                        <FormGroup className="form-label-group">
                                            <Input type="text" name="merchant_key" id="merchant_key" placeholder="Merchant Key"
                                                onChange={(e) => this.setState({ merchant_key:e.target.value })}required
                                                value={this.state.merchant_key} />
                                            <Label for="Merchant Key">Merchant Key</Label>
                                        </FormGroup>
                                    </Col>
                                    <Col md="6"  sm="12" className="p-1" >
                                        <FormGroup className="form-label-group">
                                            <Input type="text" name="application_id" id="application_id" placeholder="Application ID"
                                                onChange={(e) => this.setState({ application_id:e.target.value })}required
                                                value={this.state.application_id} />
                                            <Label for="Application ID">Application ID</Label>
                                        </FormGroup>
                                    </Col>
                                    <Col md="6"  sm="12" className="p-1" >
                                        <FormGroup className="form-label-group">
                                            <Input type="text" name="request_url" id="request_url" placeholder="Request URL"
                                                onChange={(e) => this.setState({ request_url:e.target.value })}required
                                                value={this.state.request_url} />
                                            <Label for="Request URL">Request URL</Label>
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md="12" sm="12" className="p-1">
                                        <h6>Online Bank Transfer</h6>
                                    </Col>
                                    <Col md="6"  sm="12" className="p-1" >
                                        <FormGroup className="form-label-group">
                                            <Input type="text" name="notify_url" id="notify_url" placeholder="Notify URL"
                                                onChange={(e) => this.setState({ notify_url:e.target.value })}required
                                                value={this.state.notify_url} />
                                            <Label for="Notify URL">Notify URL</Label>
                                        </FormGroup>
                                    </Col>
                                    <Col md="6"  sm="12" className="p-1" >
                                        <FormGroup className="form-label-group">
                                            <Input type="text" name="return_url" id="return_url" placeholder="Return URL"
                                                onChange={(e) => this.setState({ return_url:e.target.value })}required
                                                value={this.state.return_url} />
                                            <Label for="Return URL">Return URL</Label>
                                        </FormGroup>
                                    </Col>
                                    <Col md="6"  sm="12" className="p-1" >
                                        <FormGroup className="form-label-group">
                                            <Input type="text" name="redirect_url" id="redirect_url" placeholder="Redirect URL"
                                                onChange={(e) => this.setState({ redirect_url:e.target.value })}required
                                                value={this.state.redirect_url} />
                                            <Label for="Redirect URL">Redirect URL</Label>
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

                                    
                                </Row>
                                <Row>
                                    <Col md="12" sm="12" className="p-1">
                                        <h6>P2A Transfer</h6>
                                    </Col>
                                    <Col md="6"  sm="12" className="p-1" >
                                        <FormGroup className="form-label-group">
                                            <Input type="text" name="notify_url2" id="notify_url2" placeholder="Notify URL"
                                                onChange={(e) => this.setState({ notify_url2:e.target.value })}required
                                                value={this.state.notify_url2} />
                                            <Label for="Notify URL">Notify URL</Label>
                                        </FormGroup>
                                    </Col>
                                    <Col md="6"  sm="12" className="p-1" >
                                        <FormGroup className="form-label-group">
                                            <Input type="text" name="return_url2" id="return_url2" placeholder="Return URL"
                                                onChange={(e) => this.setState({ return_url2:e.target.value })}required
                                                value={this.state.return_url2} />
                                            <Label for="Return URL">Return URL</Label>
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md="12" sm="12" className="p-1">
                                        <h6>Payout</h6>
                                    </Col>
                                    <Col md="6"  sm="12" className="p-1" >
                                        <FormGroup className="form-label-group">
                                            <Input type="text" name="payout_notify_url" id="payout_notify_url" placeholder="Payout Notify URL"
                                                onChange={(e) => this.setState({ payout_notify_url:e.target.value })}required
                                                value={this.state.payout_notify_url} />
                                            <Label for="Payout Notify URL">Payout Notify URL</Label>
                                        </FormGroup>
                                    </Col>
                                    
                                    <Col md="6"  sm="12" className="p-1" >
                                        <FormGroup className="form-label-group">
                                            <Input type="text" name="payout_request_url" id="payout_request_url" placeholder="Payout Request URL"
                                                onChange={(e) => this.setState({ payout_request_url:e.target.value })}required
                                                value={this.state.payout_request_url} />
                                            <Label for="Payout Request URL">Payout Request URL</Label>
                                        </FormGroup>
                                    </Col>
                                    <Col md="6"  sm="12" className="p-1" >
                                        <FormGroup className="form-label-group">
                                            <Input type="text" name="currency" id="currency" placeholder="currency"
                                                onChange={(e) => this.setState({ currency:e.target.value })}required
                                                value={this.state.currency} />
                                            <Label for="currency">currency</Label>
                                        </FormGroup>
                                    </Col>
                                    <Col md="6"  sm="12" className="p-1" >
                                        <FormGroup className="form-label-group">
                                            <Input type="text" name="version" id="version" placeholder="version"
                                                onChange={(e) => this.setState({ version:e.target.value })}required
                                                value={this.state.version} />
                                            <Label for="version">version</Label>
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
                                <Button className='justify-content-end' style={{fontSize:"1rem", display:'flex'}} color="success" type="submit" >save</Button>
                            </CardFooter>
                        </Card>  
                    </Row>
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
export default connect(paymentConfigData,{PaymentconfigSave, PaymentconfigLoad})(YaarPay)