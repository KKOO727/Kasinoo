import React from "react"
import { Row, Col } from "reactstrap"
import Breadcrumbs from "../../../components/@vuexy/breadCrumbs/BreadCrumb"
import Logo from "./logo"
import Favico from "./Favicon"
import PaymentMethod from "./paymentmethod"
import Provider from "./provider"
import FooterText from "./footerText"
import CmsFooterText from "./cmsfootertext"
import Title from "./title"
import {firstpage_load} from "../../../redux/actions/CMS/firstpage"
import {connect} from "react-redux"
// import Tracking from "./tracking"
// import SignupButton from "./SignupButton"

class Gamelist extends React.Component {

  constructor(props) {
    super(props)
  
    this.state = {
       
    }
  }

  componentDidMount(){
    this.props.firstpage_load();
  }

  render() {
    return (
      <React.Fragment>
        <Breadcrumbs
          breadCrumbTitle="CMS"
          breadCrumbParent="FirstPage Config"
        />
        <Row>
            <Col md="4" sm="12">
              <Logo  />
            </Col>
            <Col md="2" sm="12">
              <Favico />
            </Col>
            {/* <Col md="6" sm="12">
              <Licencee  />
            </Col>
            <Col md="12" sm="12" className="mt-1">
              <Hyperlink  />
            </Col> */}
            {/* <Col md="12" sm="12" className="mt-2">
              <SignupButton />
            </Col> */}

            {/* <Col md="12" sm="12" className="mt-2">
              <Tracking />
            </Col> */}
            <Col md="12" sm="12" className="mt-2">
              <Title />
            </Col>
            <Col md="12" sm="12" className="mt-1">
              <FooterText />
            </Col>
            <Col md="12" sm="12"  className="mt-1">
              <CmsFooterText />
            </Col>
            <Col md="12" sm="12">
                <Provider />
            </Col>
            <Col md="12" sm="12">
                <PaymentMethod />
            </Col>
        </Row>
      </React.Fragment>
    )
  }
}

const mapstops = (state) =>{
  return {
    firstpagesetting : state.cms.firstpagesetting
  }
}

export default connect(mapstops,{firstpage_load})(Gamelist)