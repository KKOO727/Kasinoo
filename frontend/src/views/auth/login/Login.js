import React from "react"
import "../../../assets/scss/pages/authentication.scss"
import Checkbox from "../../../components/@vuexy/checkbox/CheckboxesVuexy"
import { Check } from "react-feather"
import { loginWithJWT } from "../../../redux/actions/auth/loginActions"
import { connect } from "react-redux"
import {signupWithJWT} from "../../../redux/actions/auth/registerActions"
import { getDataAgain } from "../../../redux/actions/user/permission"
import { Input,FormGroup ,Col,Row} from "reactstrap"
import {toast} from "react-toastify"
import {Mail,Unlock} from "react-feather"

class Login extends React.Component {
  state = {
    firstname : "",
    lastname : "",
    username : "",
    permission : "",
    email: "",
    mobilenumber : "",
    password: "",
    repassword : "",
    digit_code : "",

    activeTab: "1",
    remember : false,

    captchapng : null,
    captchanumber : "",

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

  toggle = tab => {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab,
      })
    }
  }

  componentDidMount(){
    const signInButton = document.getElementById('signIn');
    const container = document.getElementById('container');

    signInButton.addEventListener('click', () => {
      container.classList.add("right-panel-active");
    });

  
  }

  UNSAFE_componentWillMount(){
    if(localStorage.getItem('remember')){
      var users = localStorage.getItem("remember");
      users = JSON.parse(users);
      this.setState({ email: users.email ,password :users.password })    
    }
  }

  handleRemember = e => {
    this.setState({
      remember: e.target.checked
    })
  }

  handleLogin = e => {
    e.preventDefault()
    if(this.state.remember){
      var remember = {
          password : this.state.password,
          email : this.state.email
      }
      localStorage.setItem("remember",JSON.stringify(remember))
    }
    this.props.loginWithJWT(this.state);
  }

  handleRemember = e => {
    this.setState({
      remember: e.target.checked
    })
  }
  handleregister = e =>{
    e.preventDefault();
    if(this.state.repassword !== this.state.password){
        toast.error("please input correct password");
        return;
    }else if(parseInt(this.state.digit_code) !== this.state.captchanumber){
        toast.error("please input correct digit code");
        return;
    }else{
      let register_data = {
        password : this.state.password,
        email : this.state.email,
        firstname : this.state.firstname,
        lastname : this.state.lastname,
        username : this.state.username,
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
        mobilenumber : this.state.mobilenumber,
        
        permission : this.state.permission,
      }
      this.props.signupWithJWT(register_data);
    }
  }


  
  componentDidUpdate(prevProps, prevState){
    if(prevProps.iplocation !== this.props.iplocation){
      this.setState({users : this.props.iplocation});
    }
  }

  render() {
    
    return (
      <React.Fragment>
      
        <div className="login-container" id="container">
          
          <div className="form-container sign-in-container">
            <form action="/" onSubmit={this.handleLogin}>
              <h1 className="mb-1" style={{color:"#757575"}}>Sign in</h1>
              <Row>
                <Col md="12">
                  <FormGroup className="position-relative has-icon-left">
                    <Input 
                      type="text"
                      placeholder="Email/Username"
                      value={this.state.email}
                      onChange={e => this.setState({ email: e.target.value })}
                      required
                    />
                    <div className="form-control-position">
                      <Mail size={15} />
                    </div>
                  </FormGroup>
                  <FormGroup className="position-relative has-icon-left">
                      <Input 
                        type="password"
                        placeholder="Password"
                        value={this.state.password}
                        onChange={e => this.setState({ password: e.target.value })}
                        required
                      />
                      <div className="form-control-position">
                        <Unlock size={15} />
                      </div>
                    </FormGroup>
                  <Checkbox
                    color="primary"
                    icon={<Check className="vx-icon" size={16} />}
                    label="Remember me"
                    defaultChecked={false}
                    onChange={this.handleRemember}
                    className="float-left w-100 mb-1"
                  />
                  <button type="submit">Sign In</button>
                </Col>

              </Row>
            </form>
          </div>
          <div className="overlay-container">
            <div className="overlay">
              <div className="overlay-panel overlay-left">
                <h1 className="mb-1" style={{color:"#000"}}>Welcome Back!</h1>
                <p style={{color:"#fff"}}>To keep connected with us please login with your personal info</p>
                <button className="ghost" id="signIn">Sign In</button>
              </div>
              
            </div>
          </div>
        </div>
      </React.Fragment>
    )
  }
}
const mapStateToProps = state => {
  return {
    values: state.auth.login,
    iplocation : state.auth.register.iplocation,
    permission : state.userslist.permission.allData
  }
}
export default connect(mapStateToProps, { loginWithJWT,signupWithJWT,getDataAgain })(Login)
