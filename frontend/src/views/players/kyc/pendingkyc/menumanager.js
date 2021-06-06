import React from "react"
import { Row, Col } from "reactstrap"
import Breadcrumbs from "../../../../components/@vuexy/breadCrumbs/BreadCrumb"
import ListViewConfig from "./../approvedkyc/menumanagerchild"
import queryString from "query-string"
class MenuManager extends React.Component {
  
  render() {
    return (
      <React.Fragment>
        <Breadcrumbs
          breadCrumbTitle="CMS"
          breadCrumbParent="MENU MANAGER"
        />
        <Row>
          <Col sm="12">
            <ListViewConfig parsedFilter={queryString.parse(this.props.location.search) } status ={"0"} />
          </Col>
        </Row>
      </React.Fragment>
    )
  }
}

export default MenuManager