import React from "react"
import { Row, Col } from "reactstrap"
import Breadcrumbs from "../../../components/@vuexy/breadCrumbs/BreadCrumb"
import ListViewConfig from "../Providers/menumanagerchild"
import queryString from "query-string"
import {providerconfig} from "../../../configs/providerconfig"

class Casinoprovider extends React.Component {
  
  render() {
    return (
      <React.Fragment>
        <Breadcrumbs breadCrumbTitle="Games" breadCrumbParent="Cock Fight" />
        <Row>
          <Col sm="12">
            <ListViewConfig parsedFilter={queryString.parse(this.props.location.search)} bool ={providerconfig["COCKFIGHT"]} />
          </Col>
        </Row>
      </React.Fragment>
    )
  }
}

export default Casinoprovider