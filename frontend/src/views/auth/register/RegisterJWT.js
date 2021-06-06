import React from "react"
import { Button, Card, CardBody, CardHeader, Form, Row, Col, FormGroup, Label, Input, CardFooter, CardTitle } from "reactstrap"
import Checkbox from "../../components/@vuexy/checkbox/CheckboxesVuexy"
import { Check } from "react-feather"
import { connect } from "react-redux"
import {signupWithJWT} from '../../redux/actions/auth/registerActions'
import Select from "react-select"

class Register extends React.Component{
    
    state = {
        register_card : false,
        remember : false,
        password : "",
        email : "",
        firstname : "",
        lastname : "",
        username : "",
        currency : "USD",
        gender : "Male",
        address : "",
        contact : "",
        repassword : "",
        users : {
            country_name : "",
            region_name : "",
            city_name : "",
            country_code : "",
            zip_code  : "",
            time_zone : "",
            area_code : "",
            isp : "",
            domain : "",
            net_speed : "",
            ip : "",
            currency : []
        },
        
    }


    handleRemember = e => {
      this.setState({
        remember: e.target.checked
      })
    }
    handleregister = e =>{
        e.preventDefault();
        var dd = (new Date()).valueOf();
        if(this.state.repassword != this.state.password){
            alert("please input correct");
            return;
        }

        if(this.state.remember){
          var remember = {
              password : this.state.password,
              email : this.state.email
          }
          localStorage.setItem("remember",JSON.stringify(remember))
        }
        
        this.props.signupWithJWT({
            password : this.state.password,
            email : this.state.email,
            firstname : this.state.firstname,
            lastname : this.state.lastname,
            username : this.state.username+dd,
            currency : this.state.currency,
            country_name : this.state.users.country_name,
            region_name : this.state.users.region_name,
            city_name : this.state.users.city_name,
            country_code : this.state.users.country_code,
            zip_code  : this.state.users.zip_code,
            time_zone : this.state.users.time_zone,
            area_code : this.state.users.area_code,
            isp : this.state.users.isp,
            domain : this.state.users.domain,
            ip : this.state.users.ip,
            gender : this.state.gender,
            address : this.state.address,
            contact : this.state.contact,           
        });
    }

    render(){
        
        if(this.props.iplocation){
            this.state.users = this.props.iplocation;
        }
        const gender = [
            { value: "Male", label: "Male" },
            { value: "FeMale", label: "FeMale" },
        ]
        const cu =  [
            { value: "USD", label: "USD" },
        ]
        return (
            <div>

                <style dangerouslySetInnerHTML={{__html: `
         
                .form-label-group > input:not(:placeholder-shown) ~ label, .form-label-group textarea:not(:placeholder-shown) ~ label {
                    font-size: 1rem !important;
                    color: rgba(34, 41, 47, 0.4) !important;
                }
                 .form-control {
                    font-size: 1.3rem !important;
                }

                 .form-label-group > input:not(:placeholder-shown) ~ label, .form-label-group textarea:not(:placeholder-shown) ~ label {
                    top: -24px;
                }
        `}}></style>  
                {
                    this.state.register_card == false ? 
                        <Card className="position-fixed vw-100 text-center vh-100 top-0 left-0" style={{display:"initial", top:"0px", left:"0px", opacity:"0.98", overflowY:"scroll"}}>
                            <Form className=" p-5" action="/" onSubmit={this.handleregister}>
                                <CardHeader className="d-block w-100 text-center">
                                    {/* <img src={logo} width="150" /> */}
                                    <CardTitle className="d-block w-100">CREAT FREE ACCOUNT</CardTitle>
                                </CardHeader>
                                <CardBody className="register-body pt-5">
                                  
                                    <Row className="pr-5 pl-5">
                                        <Col xs="12" sm="6" className="p-1" >
                                            <FormGroup className="form-label-group">
                                                <Input type="text" name="country" id="country_name" placeholder="Country"
                                                    required
                                                    value = {this.state.users.country_name}
                                                    disabled
                                                />
                                                <Label for="country_name">country_name</Label>
                                            </FormGroup>
                                        </Col>
                                        <Col xs="12" sm="6" className="p-1" >
                                            <FormGroup className="form-label-group">
                                                <Input type="text" name="region" id="region_name" placeholder="Region"
                                                    required
                                                    value = {this.state.users.region_name}
                                                    disabled
                                                
                                                />
                                                <Label for="region_name">region_name</Label>
                                            </FormGroup>
                                        </Col>
                                        <Col xs="12" sm="6" className="p-1" >
                                            <FormGroup className="form-label-group">
                                                <Input type="text" name="city" id="city_name" placeholder="City"
                                                    required
                                                    value = {this.state.users.city_name}
                                                    disabled
                                                />
                                                <Label for="city_name">city_name</Label>
                                            </FormGroup>
                                        </Col>
                                        <Col xs="12" sm="6"  className="p-1" >
                                            <FormGroup className="form-label-group">
                                                <Input type="text" name="zip_code" id="zip_code" placeholder="Zip Code"
                                                    required
                                                    value = {this.state.users.zip_code}
                                                    disabled
                                                />
                                                <Label for="zip_code">zip_code</Label>
                                            </FormGroup>
                                        </Col>
                                        <Col xs="12" sm="6"  className="p-1" >
                                            <FormGroup className="form-label-group">
                                            <Select
                                                    className="React"
                                                    classNamePrefix="select"
                                                    id="currency"
                                                    options={this.state.users.currency}
                                                    defaultValue={cu[0]}
                                                    required           
                                                    onChange={e => this.setState({ currency: e.value })}
                                                />
                                            <Label for="currency" style={{top:'-27px',color: '#ffffff',    zIndex: '1',opacity: '1',fontSize: '1.1rem',padding: '0.25rem 0',left: '3px'}}>currency</Label>
                                            </FormGroup>
                                        </Col>
                                        <Col xs="12" sm="6" className="p-1" >
                                            <FormGroup className="form-label-group">
                                                <Input type="text" name="firstname" id="firstname" placeholder="First Name"
                                                    required
                                                    value = {this.state.firstname}
                                                    onChange={e=>this.setState({firstname : e.target.value})}
                                                />
                                                <Label for="firstname">First Name</Label>
                                            </FormGroup>
                                        </Col>

                                        <Col xs="12" sm="6" className="p-1" >
                                            <FormGroup className="form-label-group">
                                                <Input type="text" name="last_name" id="last_name" placeholder="Last Name"
                                                    required
                                                    value = {this.state.lastname}
                                                    onChange={e=>this.setState({lastname : e.target.value})}
                                                />
                                                <Label for="last_name">Last Name</Label>
                                            </FormGroup>
                                        </Col>


                                        <Col xs="12" sm="6" className="p-1" >
                                            <FormGroup className="form-label-group">
                                                <Input type="text" name="user_name" id="username" placeholder="User Name"
                                                    required
                                                    value = {this.state.username}
                                                    onChange={e=>this.setState({username : e.target.value})}
                                                />
                                                <Label for="username">Nick Name</Label>
                                            </FormGroup>
                                        </Col>

                                        <Col xs="12" sm="6" className="p-1" >
                                            <FormGroup className="form-label-group">
                                                <Input type="text" name="user_name" id="address" placeholder="Address"
                                                    required
                                                    value = {this.state.address}
                                                    onChange={e=>this.setState({address : e.target.value})}
                                                />
                                                <Label for="Address">Address</Label>
                                            </FormGroup>
                                        </Col>
                                        
                                        <Col xs="12" sm="6" className="p-1" >
                                            <FormGroup className="form-label-group">
                                                <Input type="text" name="user_name" id="Contact" placeholder="Contact"
                                                    required
                                                    value = {this.state.contact}
                                                    onChange={e=>this.setState({contact : e.target.value})}
                                                />
                                                <Label for="Contact">Contact</Label>
                                            </FormGroup>
                                        </Col>
                                   
                                        

                                        <Col  xs="12" sm="6"  className="p-1" >
                                            <FormGroup className="form-label-group">
                                                <Select
                                                        className="React"
                                                        classNamePrefix="select"
                                                        id="gender"
                                                        options={gender}
                                                        defaultValue={gender[0]}
                                                        required           
                                                        onChange={e => this.setState({ gender: e.value })}
                                                    />
                                                <Label for="gender" style={{top:'-27px',color: '#ffffff',    zIndex: '1',opacity: '1',fontSize: '1.1rem',padding: '0.25rem 0',left: '3px'}}>Gender</Label>
                                            </FormGroup>
                                        </Col>
                                     
                                 
                                        <Col  xs="12" sm="6"  className="p-1" >
                                            <FormGroup className="form-label-group">
                                                <Input type="email" name="Email" id="email" placeholder="Email"
                                                    required
                                                    value={this.state.email}
                                                    onChange={e=>this.setState({email : e.target.value})}
                                                />
                                                <Label for="email">Email</Label>
                                            </FormGroup>
                                        </Col>

                                        <Col xs="12" sm="6" className="p-1" >
                                            <FormGroup className="form-label-group">
                                                <Input type="password" name="password" id="passwordVertical" placeholder="Password"
                                                    required
                                                    value={this.state.password}
                                                    onChange={e=>this.setState({password : e.target.value})}
                                                />
                                                <Label for="passwordVertical">Password</Label>
                                            </FormGroup>
                                        </Col>

                                        <Col xs="12" sm="6" className="p-1" >
                                            <FormGroup className="form-label-group">
                                                <Input type="password" name="repassword" id="repasswordVertical" placeholder="rePassword"
                                                    required
                                                    value={this.state.repassword}
                                                    onChange={e=>this.setState({repassword : e.target.value})}
                                                />
                                                <Label for="repasswordVertical">rePassword</Label>
                                            </FormGroup>
                                        </Col>

                                        <Checkbox
                                            color="primary"
                                            icon={<Check className="vx-icon" size={16} />}
                                            label="Remember me"
                                            defaultChecked={false}
                                            onChange={this.handleRemember}
                                        />
                                        
                                        {/* <span>I am at least 18 years of age and I have read, accept and agree to the 
                                            Terms and Conditions, Rules,Privacy Policy,Cookies Policy and policies relating to age verification and 
                                            KYC (Know Your Customer).
                                        </span> */}

                                    </Row>
                                </CardBody>
                                <CardFooter>
                                    <Button.Ripple style={{fontSize:"1rem"}} color="success" type="submit">Register</Button.Ripple>
                                    <Button.Ripple style={{fontSize:"1rem"}} color="danger" onClick={()=>this.cancle()}>CANCEL</Button.Ripple>
                                </CardFooter>
                            </Form>
                        </Card>
                    :
                        ""
                }
            </div>
        )
    }
}

const getloginpage = (state) => {
    return {
        loginpage : state.auth.login.setloginpage,
        iplocation : state.auth.register.iplocation
    }
}

export default connect(getloginpage, {signupWithJWT})(Register)