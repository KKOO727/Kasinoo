import React from "react"
import { Row, Col } from "reactstrap"
import Breadcrumbs from "../../../components/@vuexy/breadCrumbs/BreadCrumb"
import ListViewConfig from "./child"
import queryString from "query-string"
import {TOPGAMES} from "../../../configs/providerconfig"

class MenuManager extends React.Component {
  
  render() {
    
    return (
      <React.Fragment>
        <Breadcrumbs breadCrumbTitle="CMS" breadCrumbParent="Top games" />
        <Row>
          <Col sm="12">
            <ListViewConfig parsedFilter={queryString.parse(this.props.location.search)} bool={TOPGAMES}/>
          </Col>
        </Row>
      </React.Fragment>
    )
  }
}

export default MenuManager