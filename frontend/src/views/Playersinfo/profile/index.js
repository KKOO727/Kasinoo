import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Label, Input, FormGroup ,Form,Button,CustomInput,Col,Row} from "reactstrap"
import Select from "react-select"
import Flatpickr from "react-flatpickr";
import {currency, language} from "../../../redux/actions/auth/currency"
import {status_options,gender,signup_device} from "../../../configs/providerconfig"
import {profile_update,profile_load,avatarUpload} from "../../../redux/actions/profileinfo"
import {toast} from "react-toastify"
import {Root} from "../../../authServices/rootconfig"

export class index extends Component {

    constructor(props) {
        super(props)
    
        this.state = {
            username : "",
            firstname : "",
            accountholder : "",
            lastname : "",
            middlename : "",
            gender : gender[0].value,
            address : "",
            zip_code : "",
            city_name : "",
            email : "",
            language : language[0].value,
            phone : "",
            mobilenumber : "",
            birthday : new Date().toDateString(),
            region_name : "",
            currency : currency[0].value,
            status : status_options[1].value,
            cashdesk : "",
            resident : false,
            test : false,
            usingloyaltyprogram : false,
            subscribedtoemail : false,
            subscribedtosms : false,
            _id : "",
            emailverify : false,
            signup_device : signup_device[0].value,
            imageDataUrl : "",
            file : null,
            avatar : "",
            imageSrc : "",
            date : ""
        }
    }
    
    componentDidMount(){
        // this.props.profile_load(this.props.user.email);
    }

    componentDidUpdate(prevProps, prevState){
        if (prevProps.userdetail !== this.props.userdetail) {
            this.setState({...this.props.userdetail})
        }
    }

  
    handleregister = e =>{
        e.preventDefault();
        this.props.profile_update(this.state);
    }

    async filechange(e){
        if (e.target.files && e.target.files.length) {
            let file = e.target.files[0];
            if(file.size < 512000){
                let imageDataUrl = await this.readFile(file)
                this.setState({imageSrc :imageDataUrl,file : file })
                const fpdata = new FormData();
                fpdata.append('_id',this.state._id)
                fpdata.append('fpImgFile', file);
                this.props.avatarUpload(fpdata)
            }else{
                toast.warn("The file size is too large.")
            }
        }
       
    }

    
    readFile = (file)=> {
        return new Promise(resolve => {
          const reader = new FileReader()
          reader.addEventListener('load', () => resolve(reader.result), false)
          reader.readAsDataURL(file)
        })
    }

    render() {
        const {imageSrc, avatar, date} = this.state

        return (
            <Form className="" action="#" onSubmit={this.handleregister}>
                <Row>
                    <Col md="4" sm="12"  className="p-1 d-flex align-items-center justify-content-center text-center" >
                        {
                            avatar && avatar.length && imageSrc && imageSrc.length ?
                            <img src={this.state.imageSrc} alt="" style={{ width:"150px",height:"80px", borderRadius:'50%'}} /> :
                            imageSrc && imageSrc.length ?
                            <img src={this.state.imageSrc} alt="" style={{ width:"150px",height:"80px", borderRadius:'50%'}} /> :
                            avatar && avatar.length ?
                            <img alt="" src={Root.imageurl + this.state.avatar} style={{ margin:'auto',width:"150px", borderRadius:'50%',height:"80px"}} /> 
                            : null
                        }
                    </Col>
                    <Col md="4" sm="12">
                        <FormGroup>
                            <Label for="username">registered date</Label>
                            <Input type="text" name="username" id="registered" placeholder="registered date"
                                value = {date}
                                disabled={true} required />
                        </FormGroup>
                    </Col>
                    <Col md="4" sm="12">
                        <FormGroup>
                            <Label for="username">User Name *</Label>
                            <Input type="text" name="username" id="username" placeholder="User Name"
                                onChange={e=>this.setState({username : e.target.value})}
                                value = {this.state.username}
                                required
                                disabled={this.props.data !== null ? true : false}
                            />
                        </FormGroup>
                    </Col>

                    <Col md="4" xs="12" sm="12" className="p-1" >
                        <Input bsSize="sm" label="File select"  onChange={(e)=>{this.filechange(e)}} accept="image/png, image/jpeg" id={"livecasinoimg"}  type="file" />
                    </Col>

                    <Col md="4" sm="12">
                    <FormGroup>
                        <Label for="firstname">First Name</Label>
                        <Input type="text" name="firstname" id="firstname" placeholder="First Name"
                            value = {this.state.firstname}
                        required = {true}

                            onChange={e=>this.setState({firstname : e.target.value})}
                        />
                    </FormGroup>
                    </Col>
                   
                    <Col md="4" sm="12">
                    <FormGroup>
                        <Label for="accountholder">Account Holder</Label>
                        <Input type="text" name="accountholder" id="accountholder" placeholder="Account Holder"
                            value = {this.state.accountholder}
                            onChange={e=>this.setState({accountholder : e.target.value})}
                        />
                    </FormGroup>
                    </Col>
                    <Col md="4" sm="12">
                    <FormGroup>
                        <Label for="lastname">Last Name</Label>
                        <Input type="text" name="lastname" id="lastname" placeholder="Last Name"
                        required = {true}
                            value = {this.state.lastname}
                            onChange={e=>this.setState({lastname : e.target.value})}
                        />
                    </FormGroup>
                    </Col>
                
                    <Col md="4" sm="12">
                    <FormGroup>
                        <Label for="gender">Gender</Label>
                        <Select
                        className="React"
                        classNamePrefix="select"
                        id="gender"
                        name="gender"
                        options={gender}
                        value={gender.find(obj => obj.value === this.state.gender)}
                        defaultValue={gender[0]}
                        onChange={e => this.setState({ gender: e.value })}
                        />
                    </FormGroup>
                    </Col>
                
                    
                    <Col md="4" sm="12">
                    <FormGroup>
                        <Label for="address">Address</Label>
                        <Input type="text" name="address" id="address" placeholder="Address"
                            value = {this.state.address}
                            onChange={e=>this.setState({address : e.target.value})}
                        />
                    </FormGroup>
                    </Col>
                    <Col md="4" sm="12">
                    <FormGroup>
                        <Label for="zip_code">Zip-Code</Label>
                        <Input type="text" name="zip_code" id="zip_code" placeholder="Zip-Code"
                            value = {this.state.zip_code}
                            onChange={e=>this.setState({zip_code : e.target.value})}
                        />
                    </FormGroup>
                    </Col>
                    <Col md="4" sm="12">
                    <FormGroup>
                        <Label for="city">City</Label>
                        <Input type="text" name="city" id="city" placeholder="City"
                            value = {this.state.city_name}
                            onChange={e=>this.setState({city_name : e.target.value})}
                        />
                    </FormGroup>
                    </Col>
                
                    <Col md="4" sm="12">
                    <FormGroup>
                        <Label for="email">Email *</Label>
                        <Input type="email" name="email" id="email" placeholder="Email"
                            onChange={e=>this.setState({email : e.target.value})}
                            value = {this.state.email}
                            required
                            disabled
                        />
                    </FormGroup>
                    </Col>
                    <Col md="4" sm="12">
                    <FormGroup>
                        <Label for="language">Language</Label>
                        <Select
                        className="React"
                        classNamePrefix="select"
                        id="language"
                        name="language"
                        options={language}
                        value={language.find(obj => obj.value === this.state.language)}
                        defaultValue={language[0]}
                        onChange={e => this.setState({ language: e.value })}
                        />
                    </FormGroup>
                    </Col>
                    <Col md="4" sm="12">
                    <FormGroup>
                        <Label for="mobile">Mobile</Label>
                        <Input type="number" name="mobile" id="mobile" placeholder="Mobile"
                            value = {this.state.mobilenumber}
                            onChange={e=>this.setState({mobilenumber : e.target.value})}
                        />
                    </FormGroup>
                    </Col>
                
                    <Col md="4" sm="12">
                    <FormGroup>
                        <Label for="birthday">Birthday</Label>
                        <Flatpickr
                        name="birthday" 
                        id="birthday"
                        className="form-control"
                        value={this.state.birthday}
                        onChange={date => {
                            this.setState({ birthday : date.toLocaleString() });
                        }}
                        />
                    </FormGroup>
                    </Col>
                    <Col md="4" sm="12">
                    <FormGroup>
                        <Label for="region">Region</Label>
                        <Input type="text" name="region" id="region" placeholder="Region"
                            value = {this.state.region_name}
                            onChange={e=>this.setState({region_name : e.target.value})}
                        />
                    </FormGroup>
                    </Col>
                    <Col md="4" sm="12">
                    <FormGroup>
                        <Label for="currency">Currency *</Label>
                        <Select
                        className="React"
                        classNamePrefix="select"
                        id="currency"
                        name="currency"
                        options={currency}
                        value={currency.find(obj => obj.value === this.state.currency)}
                        defaultValue={currency[0]}
                        onChange={e => this.setState({ currency: e.value })}
                        />
                    </FormGroup>
                    </Col>
                
                    <Col md="4" sm="12">
                    <FormGroup>
                        <Label for="account">Status</Label>
                        <Select
                        className="React"
                        classNamePrefix="select"
                        id="account"
                        name="account"
                        options={status_options}
                        value={status_options.find(obj => obj.value === this.state.status)}
                        defaultValue={status_options[0]}
                        onChange={e => this.setState({ status: e.value })}
                        />
                    </FormGroup>
                    </Col>
                    <Col md="4" sm="12">
                <FormGroup>
                  <Label for="signupDevice">signupDevice</Label>
                  <Select
                    className="React"
                    classNamePrefix="select"
                    id="signupDevice"
                    name="signupDevice"
                    options={signup_device}
                    value={signup_device.find(obj => obj.value === this.state.signup_device)}
                    defaultValue={signup_device[0]}
                    onChange={e => this.setState({ signup_device: e.value })}
                  />
                </FormGroup>
              </Col>
                    <Col md="4" sm="12">
                    <FormGroup>
                        <Label for="cashdesk">Cashdesk</Label>
                        <Input type="text" name="cashdesk" id="cashdesk" placeholder="Cashdesk"
                            value = {this.state.cashdesk}
                            onChange={e=>this.setState({cashdesk : e.target.value})}
                        />
                    </FormGroup>
                    </Col>
            
                    <Col md="4" sm="12">
                    <FormGroup className='mt-2'>
                        <CustomInput
                        inline
                        onChange={e=>this.setState({usingloyaltyprogram : !this.state.usingloyaltyprogram})}
                        checked={this.state.usingloyaltyprogram}
                        type="checkbox"
                        id="usingloyaltyprogram"
                        label="Is Using Loyalty Program"
                        />
                    </FormGroup>
                    </Col>
                    <Col md="4" sm="12">
                    <FormGroup className='mt-2'>
                        <CustomInput
                        inline
                        onChange={e=>this.setState({resident : !this.state.resident})}
                        checked={this.state.resident}
                        type="checkbox"
                        id="resident"
                        label="Is Resident"
                        />
                    </FormGroup>
                    </Col>
                    <Col md="4" sm="12">
                    <FormGroup className='mt-2'>
                        <CustomInput
                        inline
                        onChange={e=>this.setState({test : !this.state.test})}
                        checked={this.state.test}
                        type="checkbox"
                        id="test"
                        label="Is Test"
                        />
                    </FormGroup>
                    </Col>
            
                    <Col md="4" sm="12">
                    <FormGroup className='mt-2'>
                        <CustomInput
                        inline
                        onChange={e=>this.setState({subscribedtoemail : !this.state.subscribedtoemail})}
                        checked={this.state.subscribedtoemail}
                        type="checkbox"
                        id="subscribedtoemail"
                        label="Subscribed To Email"
                        />
                    </FormGroup>
                    </Col>
                    <Col md="4" sm="12">
                        <FormGroup className='mt-2'>
                            <CustomInput
                            inline
                            onChange={e=>this.setState({subscribedtosms : !this.state.subscribedtosms})}
                            checked={this.state.subscribedtosms}
                            type="checkbox"
                            id="subscribedtosms"
                            label="Subscribed To Sms"
                            />
                        </FormGroup>
                    </Col>
                    <Col md="4" sm="12">
                        <FormGroup className='mt-2'>
                        <CustomInput
                            inline
                            onChange={e=>this.setState({emailverify : !this.state.emailverify})}
                            checked={this.state.emailverify}
                            type="checkbox"
                            id="emailverify"
                            label="Email verify"
                        />
                        </FormGroup>
                    </Col>
                    <Col md="4" sm="12">
                        <Button color="primary" type="submit">
                            Update
                        </Button>
                    </Col>

              </Row>
            </Form>
        )
    }
}

const mapStateToProps = (state) => ({
    userdetail : state.profileinfo.profile.load,   
})

const mapDispatchToProps = {
    profile_update,profile_load, avatarUpload
}

export default connect(mapStateToProps, mapDispatchToProps)(index)
