import React from "react"
import { CardBody, FormGroup, Form, Input, Button, Label} from "reactstrap"
import Checkbox from "../../components/@vuexy/checkbox/CheckboxesVuexy"
import { Mail, Lock, Check } from "react-feather"
import { loginWithJWT } from "../../redux/actions/auth/loginActions"
import { connect } from "react-redux"
import { history } from "../../history"

class LoginJWT extends React.Component {
  state = {
    email: "",
    password: "",
    remember: false
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
  render() {
    return (
        <CardBody className="pt-5" style={{color:"white"}}>
        <style dangerouslySetInnerHTML={{__html: `
          .form-label-group > input:not(:focus):not(:placeholder-shown) ~ label, .form-label-group textarea:not(:focus):not(:placeholder-shown) ~ label {
            color: white !important;
        }
        `}}></style>
          <Form action="/" onSubmit={this.handleLogin}>
            <FormGroup className="form-label-group position-relative has-icon-left">
              <Input
                type="email"
                placeholder="Email"
                value={this.state.email}
                onChange={e => this.setState({ email: e.target.value })}
                required
              />
              <div className="form-control-position" >
                <Mail size={15} />
              </div>
              <Label>Email</Label>
            </FormGroup>
            <FormGroup className="form-label-group position-relative has-icon-left">
              <Input
                type="password"
                placeholder="Password"
                value={this.state.password}
                onChange={e => this.setState({ password: e.target.value })}
                required
              />
              <div className="form-control-position">
                <Lock size={15} />
              </div>
              <Label>Password</Label>
            </FormGroup>
            <FormGroup className="d-flex justify-content-between align-items-center">
              <Checkbox
                color="primary"
                icon={<Check className="vx-icon" size={16} />}
                label="Remember me"
                defaultChecked={false}
                onChange={this.handleRemember}
              />
              {/* <div className="float-right">
                <Link to="/pages/forgot-password">Forgot Password?</Link>
              </div> */}
            </FormGroup>
            <div className="d-flex justify-content-between">
                  <Button.Ripple
                  outline
                    color="danger"
                    onClick={() => {
                      history.push("/pages/register")
                    }}
                  >
                   Sign up
                  </Button.Ripple>
                  <Button.Ripple color="success" > Sign in
                  </Button.Ripple>
                  </div>
          </Form>
        </CardBody>
    )
  }
}
const mapStateToProps = state => {
  return {
    values: state.auth.login
  }
}
export default connect(mapStateToProps, { loginWithJWT })(LoginJWT)
