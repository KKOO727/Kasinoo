import React from "react"
import { Row, Col } from "reactstrap"
import Breadcrumbs from "../../../../components/@vuexy/breadCrumbs/BreadCrumb"
import ListViewConfig from "./child"
import queryString from "query-string"
class PayoutChannel extends React.Component {
  
  render() {

    const {bazaritem,gameitem,date, bazarListObject, bazaars, gameList} = this.props.location.state;

    return (
      <React.Fragment>
        <Breadcrumbs breadCrumbTitle="Satta" breadCrumbParent="Matka" breadCrumbParent2 = "Dashboard" />
        <Row>
          <Col sm="12">
            <ListViewConfig bazarListObject={bazarListObject} bazaars={bazaars} gameList={gameList} parsedFilter={queryString.parse(this.props.location.search)} bazaritem={bazaritem}gameitem = {gameitem} date = {date} />
          </Col>
        </Row>
      </React.Fragment>
    )
  }
}

export default PayoutChannel