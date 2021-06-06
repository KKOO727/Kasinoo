import React from "react"
import { Row, Col } from "reactstrap"
import Breadcrumbs from "../../../components/@vuexy/breadCrumbs/BreadCrumb"
import ListViewConfig from "./userchild"
import queryString from "query-string"
class Gamelist extends React.Component {
  
  render() {
    return (
      <React.Fragment>
        <Breadcrumbs
          breadCrumbTitle="USERS"
          breadCrumbParent="user List"
        />
        <Row>
          <Col sm="12">
            <ListViewConfig parsedFilter={queryString.parse(this.props.location.search)}/>
          </Col>
        </Row>
      </React.Fragment>
    )
  }
}

export default Gamelist