import React from 'react'
import { Button, Card, CardBody, CardHeader, Row, Col, FormGroup, Label, Input, CardFooter, CardTitle, Form } from "reactstrap"
import Toggle from "react-toggle"
import { connect } from "react-redux"
import Breadcrumbs from "../../components/@vuexy/breadCrumbs/BreadCrumb"
import { PaymentconfigSave, PaymentconfigLoad } from "../../redux/actions/paymentGateWay"
import {PaymentListKey} from "../../configs/providerconfig"

class Paymero extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          type:PaymentListKey['Paymero'],
          apikey : '',
          returnUrl : '',
          notifyUrl : '',
          telegramreturnurl : "",
          DeviceType : "",	
          UpiUrl : "",
          NetBankingUrl  :"",
          WalletUrl : "",
          payoutBanktransfer : "",
          productName : "",
          paymoropayoutNotify : "",
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
            apikey : data.configData.apikey,
            returnUrl : data.configData.returnUrl,
            notifyUrl : data.configData.notifyUrl,
            telegramreturnurl : data.configData.telegramreturnurl,
            DeviceType : data.configData.DeviceType,
            UpiUrl : data.configData.UpiUrl,
            NetBankingUrl : data.configData.NetBankingUrl,
            WalletUrl : data.configData.WalletUrl,
            payoutBanktransfer : data.configData.payoutBanktransfer,
            productName : data.configData.productName,
            paymoropayoutNotify : data.configData.paymoropayoutNotify,
            state : data.state, 
        })
    }

    save = e => {
        e.preventDefault();
        var data={
            type:this.state.type,
            configData:{
                apikey :this.state.apikey,
                returnUrl :this.state.returnUrl,
                notifyUrl :this.state.notifyUrl,
                telegramreturnurl : this.state.telegramreturnurl,
                DeviceType : this.state.DeviceType,
                UpiUrl : this.state.UpiUrl,
                NetBankingUrl : this.state.NetBankingUrl,
                WalletUrl : this.state.WalletUrl,
                payoutBanktransfer : this.state.payoutBanktransfer,
                productName : this.state.productName,
                paymoropayoutNotify : this.state.paymoropayoutNotify
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
                                    <Col md="6"  sm="12" className="p-1" >
                                        <FormGroup className="form-label-group">
                                            <Input required type="text" name="apikey" id="apikey" placeholder="apikey"
                                                onChange={(e) => this.setState({ apikey:e.target.value })}
                                                value={this.state.apikey} />
                                            <Label for="apikey">apikey</Label>
                                        </FormGroup>
                                    </Col>
                                    <Col md="6"  sm="12" className="p-1" >
                                        <FormGroup className="form-label-group">
                                            <Input required type="text" name="returnUrl" id="returnUrl" placeholder="returnUrl"
                                                onChange={(e) => this.setState({ returnUrl:e.target.value })}
                                                value={this.state.returnUrl} />
                                            <Label for="returnUrl">returnUrl</Label>
                                        </FormGroup>
                                    </Col>
                                    <Col md="6"  sm="12" className="p-1" >
                                        <FormGroup className="form-label-group">
                                            <Input required type="text" name="notifyUrl" id="notifyUrl" placeholder="notifyUrl"
                                                onChange={(e) => this.setState({ notifyUrl:e.target.value })}
                                                value={this.state.notifyUrl} />
                                            <Label for="notifyUrl">notifyUrl</Label>
                                        </FormGroup>
                                    </Col>
                                    <Col md="6"  sm="12" className="p-1" >
                                        <FormGroup className="form-label-group">
                                            <Input required type="text" name="paymoropayoutNotify" id="paymoropayoutNotify" placeholder="paymoropayoutNotify"
                                                onChange={(e) => this.setState({ paymoropayoutNotify:e.target.value })}
                                                value={this.state.paymoropayoutNotify} />
                                            <Label for="paymoropayoutNotify">paymoropayoutNotify</Label>
                                        </FormGroup>
                                    </Col>
                                    
                                    <Col md="6"  sm="12" className="p-1" >
                                        <FormGroup className="form-label-group">
                                            <Input required type="text" name="NetBankingUrl" id="NetBankingUrl" placeholder="NetBankingUrl"
                                                onChange={(e) => this.setState({ NetBankingUrl:e.target.value })}
                                                value={this.state.NetBankingUrl} />
                                            <Label for="NetBankingUrl">NetBankingUrl</Label>
                                        </FormGroup>
                                    </Col>
                                    <Col md="6"  sm="12" className="p-1" >
                                        <FormGroup className="form-label-group">
                                            <Input required type="text" name="UpiUrl" id="UpiUrl" placeholder="UpiUrl"
                                                onChange={(e) => this.setState({ UpiUrl:e.target.value })}
                                                value={this.state.UpiUrl} />
                                            <Label for="UpiUrl">UpiUrl</Label>
                                        </FormGroup>
                                    </Col>
                                    <Col md="6"  sm="12" className="p-1" >
                                        <FormGroup className="form-label-group">
                                            <Input required type="text" name="WalletUrl" id="WalletUrl" placeholder="WalletUrl"
                                                onChange={(e) => this.setState({ WalletUrl:e.target.value })}
                                                value={this.state.WalletUrl} />
                                            <Label for="WalletUrl">WalletUrl</Label>
                                        </FormGroup>
                                    </Col>
                                    <Col md="6"  sm="12" className="p-1" >
                                        <FormGroup className="form-label-group">
                                            <Input required type="text" name="payoutBanktransfer" id="payoutBanktransfer" placeholder="payoutBanktransfer"
                                                onChange={(e) => this.setState({ payoutBanktransfer:e.target.value })}
                                                value={this.state.payoutBanktransfer} />
                                            <Label for="payoutBanktransfer">payoutBanktransfer</Label>
                                        </FormGroup>
                                    </Col>

                                    <Col md="6"  sm="12" className="p-1" >
                                        <FormGroup className="form-label-group">
                                            <Input required type="text" name="telegramreturnurl" id="telegramreturnurl" placeholder="telegramreturnurl"
                                                onChange={(e) => this.setState({ telegramreturnurl:e.target.value })}
                                                value={this.state.telegramreturnurl} />
                                            <Label for="telegramreturnurl">telegramreturnurl</Label>
                                        </FormGroup>
                                    </Col>
                                    <Col md="6"  sm="12" className="p-1" >
                                        <FormGroup className="form-label-group">
                                            <Input required type="text" name="DeviceType" id="DeviceType" placeholder="DeviceType"
                                                onChange={(e) => this.setState({ DeviceType:e.target.value })}
                                                value={this.state.DeviceType} />
                                            <Label for="DeviceType">DeviceType</Label>
                                        </FormGroup>
                                    </Col>
                                    <Col md="6"  sm="12" className="p-1" >
                                        <FormGroup className="form-label-group">
                                            <Input required type="text" name="productName" id="productName" placeholder="productName"
                                                onChange={(e) => this.setState({ productName:e.target.value })}
                                                value={this.state.productName} />
                                            <Label for="productName">productName</Label>
                                        </FormGroup>
                                    </Col>
                                    
                                    
                                </Row>
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
export default connect(paymentConfigData,{PaymentconfigSave, PaymentconfigLoad})(Paymero)