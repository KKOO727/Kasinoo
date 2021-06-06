import React from "react"
import { Row, Col } from "reactstrap"
import ProductOrders from "../ui-elements/cards/analytics/ProductOrders"
import SalesStat from "../ui-elements/cards/analytics/Sales"
import ActivityTimeline from "./ActivityTimeline"
import DispatchedOrders from "./DispatchedOrders"
import "../../assets/scss/pages/dashboard-analytics.scss"
import AvgSession from "../ui-elements/cards/analytics/AvgSessions"
import SupportTracker from "../ui-elements/cards/analytics/SupportTracker"
import PlayersGained from "../ui-elements/cards/statistics/PlayersGained"
import DepositReceived from "../ui-elements/cards/statistics/DepositReceived"
import OrdersReceived from "../ui-elements/cards/statistics/OrdersReceived"

let $primary = "#7367F0",
  $danger = "#EA5455",
  $warning = "#FF9F43",
  $info = "#00cfe8",
  $primary_light = "#9c8cfc",
  $warning_light = "#FFC085",
  $danger_light = "#f29292",
  $info_light = "#1edec5",
  $stroke_color = "#e8e8e8",
  $label_color = "#e7eef7",
  $white = "#fff"

class Revenu extends React.Component {
  render() {
    return (
      <React.Fragment>
        <Row className="match-height">
        </Row>
        <Row className="match-height">
        <Col lg="3" md="6" sm="12">
            <PlayersGained />
          </Col>
          <Col lg="3" md="6" sm="12">
            <OrdersReceived />
          </Col>
          <Col lg="3" md="6" sm="12">
            <DepositReceived />
          </Col>
          <Col lg="3" md="6" sm="12">
            <OrdersReceived />
          </Col>
          <Col md="6" sm="12">
            <AvgSession labelColor={$label_color} primary={$primary} />
          </Col>
          <Col md="6" sm="12">
            <SupportTracker
              primary={$primary}
              danger={$danger}
              white={$white}
            />
          </Col>
          <Col lg="4">
            <ProductOrders
              primary={$primary}
              warning={$warning}
              danger={$danger}
              primaryLight={$primary_light}
              warningLight={$warning_light}
              dangerLight={$danger_light}
            />
          </Col>
          <Col lg="4">
            <SalesStat
              strokeColor={$stroke_color}
              infoLight={$info_light}
              primary={$primary}
              info={$info}
            />
          </Col>
          <Col lg="4">
            <ActivityTimeline />
          </Col>
        </Row>
        <Row>
          <Col sm="12">
            <DispatchedOrders />
          </Col>
        </Row>
      </React.Fragment>
    )
  }
}

export default Revenu
