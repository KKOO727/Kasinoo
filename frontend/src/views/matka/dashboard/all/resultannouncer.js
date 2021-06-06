import React from "react"
import { Row, Col } from "reactstrap"
import Breadcrumbs from "../../../../components/@vuexy/breadCrumbs/BreadCrumb"
import ListViewConfig from "./announcerchild"
import queryString from "query-string"
class MenuManager extends React.Component {
  
  render() {
    const {gamesdata, bazaritem, date} = this.props.location.state;
    return (
      <React.Fragment>
        <Breadcrumbs breadCrumbTitle="Satta"  breadCrumbParent="Matka6"  breadCrumbParent2="Dashboard"/>
        <Row>
          <Col sm="12">
            <ListViewConfig  bazaritem={bazaritem} date={date}  gamesdata = {gamesdata} parsedFilter={queryString.parse(this.props.location.search)}/>
          </Col>
        </Row>
      </React.Fragment>
    )
  }
}

export default MenuManager