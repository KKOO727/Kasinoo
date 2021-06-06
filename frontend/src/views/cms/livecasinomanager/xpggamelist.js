import React from "react"
import { Row, Col } from "reactstrap"
import Breadcrumbs from "../../../components/@vuexy/breadCrumbs/BreadCrumb"
import ListViewConfig from "../casinomanager/gamelistchild"
import {providerconfig} from "../../../configs/providerconfig"
import queryString from "query-string"
class Gamelist extends React.Component {
  
  render() {
    return (
      <React.Fragment>
        <Breadcrumbs
          breadCrumbTitle="CMS"
          breadCrumbParent="Live Casino"
        />
        <Row>
          <Col sm="12">
            <ListViewConfig parsedFilter={queryString.parse(this.props.location.search)}bool ={providerconfig.LIVECASINO}/>
          </Col>
        </Row>
      </React.Fragment>
    )
  }
}

export default Gamelist