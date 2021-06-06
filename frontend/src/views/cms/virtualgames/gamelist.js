import React from "react"
import { Row, Col } from "reactstrap"
import Breadcrumbs from "../../../components/@vuexy/breadCrumbs/BreadCrumb"
import ListViewConfig from "../casinomanager/gamelistchild"
import queryString from "query-string"
import {providerconfig} from "../../../configs/providerconfig"

class Gamelist extends React.Component {
  render() {
    return (
      <React.Fragment>
        <Breadcrumbs
          breadCrumbTitle="CMS"
          breadCrumbParent="Caisno Game"
          // breadCrumbActive="List View"
        />
        <Row>
          <Col sm="12">
            <ListViewConfig parsedFilter={queryString.parse(this.props.location.search)} bool ={providerconfig.VIRTUALGAMES} />
          </Col>
        </Row>
      </React.Fragment>
    )
  }
}

export default Gamelist