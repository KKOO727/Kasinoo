import React from "react"
import { Row, Col } from "reactstrap"
import Breadcrumbs from "../../../components/@vuexy/breadCrumbs/BreadCrumb"
import ListViewConfig from "../Providers/menumanagerchild"
import queryString from "query-string"
import {providerconfig} from "../../../configs/providerconfig"


class Livecasinoprovider extends React.Component {
  
  render() {
    return (
      <React.Fragment>
        <Breadcrumbs
          breadCrumbTitle="Games"
          breadCrumbParent="Live Casino"
        />
        <Row>
          <Col sm="12">
            <ListViewConfig parsedFilter={queryString.parse(this.props.location.search)} bool = {providerconfig.LIVECASINO} />
          </Col>
        </Row>
      </React.Fragment>
    )
  }
}

export default Livecasinoprovider