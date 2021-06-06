import React from "react"
import RegisterJWT from "./RegisterJWT"
import "../../assets/scss/pages/authentication.scss"

class Register extends React.Component {
  state = {
    activeTab: "1"
  }
  toggle = tab => {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      })
    }
  }
  render() {
    return (
      <React.Fragment>
        
          <RegisterJWT />
      </React.Fragment>
    )
  }
}
export default Register
