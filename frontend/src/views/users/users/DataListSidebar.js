import React, { Component } from "react"
import { Label, Input, FormGroup ,Form,Button,CustomInput,  Modal,ModalHeader,ModalBody,ModalFooter,Col,Row} from "reactstrap"
import Select from "react-select"
import Flatpickr from "react-flatpickr";
import {connect} from "react-redux"
import {toast} from "react-toastify"
import {currency, language} from "../../../redux/actions/auth/currency"
import {signup,updatesignup} from "../../../redux/actions/user/index"
import {status_options,gender, playerid,signup_device} from "../../../configs/providerconfig"
import {get_userinfor} from "../../../redux/actions/auth/loginActions"
import {validateUsername} from "../../../redux/actions/auth/index"

class DataListSidebar extends Component {

  state = {
    _id : "",
    username : "",
    firstname : "",
    accountholder : "",
    password  :"",
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
    birthday : new Date(),
    region_name : "",
    currency : currency[0].value,
    status : status_options[1].value,
    cashdesk : "",
    permission : "",
    resident : false,
    test : false,
    usingloyaltyprogram : false,
    subscribedtoemail : false,
    subscribedtosms : false,
    positiontaking : 0,
    signup_device : signup_device[0].value,
  }
  componentDidMount(){
    this.props.get_userinfor();
  }
  componentDidUpdate(prevProps, prevState) {
    if (this.props.data !== null && prevProps.data === null) {
      var data = this.props.data;
      this.setState({
        _id : data._id,
        username : data.username,
        firstname : data.firstname,
        accountholder : data.accountholder,
        lastname : data.lastname,
        middlename : data.middlename,
        gender : data.gender,
        address : data.address,
        zip_code : data.zip_code,
        city_name : data.city_name,
        email : data.email,
        language : data.language,
        phone : data.phone,
        mobilenumber : data.mobilenumber,
        birthday : data.birthday,
        region_name : data.region_name,
        currency : data.currency,
        status : data.status,
        cashdesk : data.cashdesk,
        permission : data.permission,
        // created : data.created,
        resident : data.resident,
        test : data.test,
        usingloyaltyprogram : data.usingloyaltyprogram,
        subscribedtoemail : data.subscribedtoemail,
        subscribedtosms : data.subscribedtosms,
        positiontaking : data.positiontaking,
        signup_device :data.signup_device,
      })
    }
    if (this.props.data === null && prevProps.data !== null) {
      this.setState({
        _id : "",
        username : "",
        password : "",
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
        birthday : new Date(),
        region_name : "",
        currency : currency[0].value,
        status : status_options[1].value,
        cashdesk : "",
        permission : "",
        // created : this.props.admin_info.email, 
        resident : false,
        test : false,
        usingloyaltyprogram : false,
        subscribedtoemail : false,
        subscribedtosms : false,
        positiontaking : this.props.userdetail ?  this.props.userdetail.positiontaking : 0,
        signup_device : signup_device[0].value,

      })
    }

  }

  handleregister = e =>{
    e.preventDefault();
    var row = this.state;
    if(this.state.permission === ""){
      toast.error("Please select Permission .")
      return;
    }else{
      var usernamecheck= validateUsername(this.state.username)
      if(!usernamecheck){
        return;
      }
      
      this.props.handleSidebar(false, true);
      if(this.props.data !== null){
        delete row.password;
        this.props.updatesignup(row,this.props.dataParams,this.props.me.value);
      }else{
        delete row._id;
        this.props.signup(row,this.props.dataParams,this.props.me.value);
      }
    }
  }

  toggleModal = () => {
    this.props.handleSidebar(false, true)
  }

  get_positiontaking_option = (e) =>{
    if (e){
      var index = parseInt(e.positiontaking);
      var rows = [];
      for(var i = index ; i >= 0 ; i--){
        rows.push({label : i , value : i});
      }
      return rows;
    }
  }

  get_positiontaking_value = (e) =>{
    if (e){
      return {label : e,value : e}
    }
  }

  render() {
    let { data, handleSidebar } = this.props;
    return (
      <Modal isOpen={this.props.show} toggle={this.toggleModal} className="modal-dialog-centered modal-lg">
        <Form className="" action="#" onSubmit={this.handleregister}>
          <ModalHeader toggle={this.toggleModal} className="bg-primary">
            {data !== null ? "UPDATE USER" : "ADD USER PLAYER"}
          </ModalHeader>
          <ModalBody className="mt-1">
            <Row>
              <Col md="4" sm="12">
                <FormGroup>
                  <Label for="username">User Name *</Label>
                  <Input type="text" name="username" id="username" placeholder="User Name"
                      onChange={e=>this.setState({username : e.target.value})}
                      value = {this.state.username}
                      disabled={this.props.data !== null ? true : false}
                      required
                  />
                </FormGroup>
              </Col>
              {
                this.props.data !== null ? null : 
                  <Col md="4" sm="12">
                    <FormGroup>
                      <Label for="password">Password *</Label>
                      <Input type="password" name="password" id="password" placeholder="Password"
                          value = {this.state.password}
                          required={true}
                          onChange={e=>this.setState({password : e.target.value})}
                      />
                    </FormGroup>
                  </Col>
              }
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
                      disabled={this.props.data !== null ? true : false}
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
                      this.setState({ birthday : date.toJSON() });
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
                  <Label for="account">Account</Label>
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
                <FormGroup>
                  <Label for="account"> Permission </Label>
                  {/* {
                    this.props.data !== null ?
                    <Input type="text"  placeholder="Cashdesk" name="permission"
                    value={this.props.permission.find(obj => obj.value === this.state.permission) ? this.props.permission.find(obj => obj.value === this.state.permission).label : ""}
                    onChange={e=>this.setState({permission : e.target.value})}
                    disabled={true}
                    /> :  */}
                  <Select
                    className="React"
                    classNamePrefix="select"
                    id="permission"
                    value={this.props.permission.find(obj => obj.value === this.state.permission)}
                    options={this.props.permission}
                    required           
                    onChange={e => this.setState({ permission: e.value })}
                  />
                  {/* } */}
                </FormGroup>
              </Col>
              {
                this.state.permission !== playerid ?
                <Col md="4" sm="12">
                  <FormGroup>
                    <Label for="account"> Position Taking (%)* </Label>
                    <Select
                      className="React"
                      classNamePrefix="select"
                      id="positionsTaking"
                      value={this.get_positiontaking_value(this.state.positiontaking)}
                      options={this.get_positiontaking_option(this.props.userdetail)}
                      required 
                      onChange={e => this.setState({ positiontaking: e.value })}
                    />
                  </FormGroup>
                </Col>  : ""
              }
         
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
            </Row>
          </ModalBody>
          <ModalFooter>
            <Row>
              <Col xs="12 justify-content-start">
                <Button color="primary" type="submit">{data !== null ? "Update" : "Submit"} </Button>
                <Button className="ml-1" color="danger" outline onClick={() => handleSidebar(false, true)}> Cancel </Button>
              </Col>
            </Row>
          </ModalFooter>
        </Form>
      </Modal>
    )
  }
}

const mapStateToProps = state => {
  return {
    permission : state.userslist.permission.permissiondata,
    userdetail : state.auth.login.userdetail
  }
}

export default connect(mapStateToProps,{signup,updatesignup,get_userinfor})(DataListSidebar)