import React from "react"
import { Row, Col } from "reactstrap"
import Breadcrumbs from "../../../../components/@vuexy/breadCrumbs/BreadCrumb"
import ListViewConfig from "./child"
import queryString from "query-string"
import { Bazaartype_key} from "../../../../configs/providerconfig"

class index extends React.Component {
  
  render() {
    return (
      <React.Fragment>
        <Breadcrumbs breadCrumbTitle="Satta" breadCrumbParent="Matka" breadCrumbParent2 = "Result" />
        <Row>
          <Col sm="12">
            <ListViewConfig parsedFilter={queryString.parse(this.props.location.search)} bazaartype={Bazaartype_key.starline}/>
          </Col>
        </Row>
      </React.Fragment>
    )
  }
}

export default index