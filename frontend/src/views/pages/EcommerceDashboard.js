import React from "react"
import StatisticsCard from "../../components/@vuexy/statisticsCard/StatisticsCard"
import { Row, Col ,Button ,Card} from "reactstrap"
import {
  Cpu,Activity,AlertOctagon,Server
} from "react-feather"
import Flatpickr from "react-flatpickr";
import  * as FC from "react-icons/fc";
import "flatpickr/dist/themes/light.css";
import "../../assets/scss/plugins/forms/flatpickr/flatpickr.scss"
class EcommerceDashboard extends React.Component {

  state={
    rangePicker : new Date(),
  }

  render() {
    return (
      <React.Fragment>
        <style dangerouslySetInnerHTML={{__html: `
         .btn-outline-info{
          width:100% !important;
          height:100% !important
         }
        `}}></style>
          <Row className="ecommerecedashboard">
            <Col md="2" sm="6">
              <Card><Button.Ripple color="info" outline>Today</Button.Ripple></Card>
            </Col>
            <Col md="2" sm="6">
              <Card><Button.Ripple color="info" outline>Yesterday</Button.Ripple></Card>
            </Col>
            <Col md="2" sm="6">
              <Card><Button.Ripple color="info" outline>This Week</Button.Ripple></Card>
            </Col>
            <Col md="2" sm="6">
              <Card><Button.Ripple color="info" outline>Last Week</Button.Ripple></Card>
            </Col>
            <Col md="2" sm="6">
              <Card><Button.Ripple color="info" outline>This Month</Button.Ripple></Card>
            </Col>
            <Col md="2" sm="6">
              <Card><Button.Ripple color="info" outline>Last Month</Button.Ripple></Card>
            </Col>
            <Col md="8" sm="12" >
            </Col>
            <Col md="4" sm="12" >
              <Card ><Flatpickr
                value={this.state.rangePicker}
                className="form-control"
                options={{  mode: "range"  }}
                />
              </Card>
            </Col>

          </Row>
        <Col md="12" sm="12">
        <Row >
          <Col md="6" sm="12">
            <StatisticsCard
              hideChart
              iconRight
              iconBg="primary"
              icon={<FC.FcProcess className="primary" size={22} />}
              stat="10000"
              statTitle="TOTAL OF DEPOSITS"
            />
          </Col>
          <Col md="6" sm="12">
            <StatisticsCard
              hideChart
              iconRight
              iconBg="success"
              icon={<FC.FcRemoveImage className="success" size={22} />}
              stat="1000"
              statTitle="Total of Withdrawals"
            />
          </Col>
          <Col md="6" sm="12">
            <StatisticsCard
              hideChart
              iconRight
              iconBg="danger"
              icon={<FC.FcCustomerSupport className="danger" size={22} />}
              stat="1000"
              statTitle="Players Logged In"
            />
          </Col>
          <Col md="6" sm="12">
            <StatisticsCard
              hideChart
              iconRight
              iconBg="warning"
              icon={<FC.FcConferenceCall className="warning" size={22} />}
              stat="10000"
              statTitle="Total login count"
            />
          </Col>
          <Col md="6" sm="12">
            <StatisticsCard
              hideChart
              iconRight
              iconBg="success"
              icon={<FC.FcContacts className="warning" size={22} />}
              stat="10000"
              statTitle="Players Registered"
            />
          </Col>
          <Col md="6" sm="12">
            <StatisticsCard
              hideChart
              iconRight
              iconBg="danger"
              icon={<FC.FcCurrencyExchange className="warning" size={22} />}
              stat="10000"
              statTitle="Players Balance"
            />
          </Col>
          <Col md="6" sm="12">
            <StatisticsCard
              hideChart
              iconRight
              iconBg="warning"
              icon={<FC.FcProcess className="warning" size={22} />}
              stat="10000"
              statTitle="PROFIT"
            />
          </Col>
          <Col md="6" sm="12">
            <StatisticsCard
              hideChart
              iconRight
              iconBg="warning"
              icon={<FC.FcDebt className="warning" size={22} />}
              stat="10000"
              statTitle="Players Making Deposit"
            />
          </Col>
          <Col md="6" sm="12">
            <StatisticsCard
              hideChart
              iconRight
              iconBg="warning"
              icon={<FC.FcDataRecovery className="warning" size={22} />}
              stat="10000"
              statTitle="Players Making Withdrawals"
            />
          </Col>
          <Col md="6" sm="12">
            <StatisticsCard
              hideChart
              iconRight
              iconBg="warning"
              icon={<FC.FcPlus className="warning" size={22} />}
              stat="10000"
              statTitle="Bonus Balance"
            />
          </Col>
          <Col md="6" sm="12">
            <StatisticsCard
              hideChart
              iconRight
              iconBg="warning"
              icon={<FC.FcRightUp2 className="warning" size={22} />}
              stat="10000"
              statTitle="Correction Up"
            />
          </Col>
          <Col md="6" sm="12">
            <StatisticsCard
              hideChart
              iconRight
              iconBg="warning"
              icon={<FC.FcRightDown2 className="warning" size={22} />}
              stat="10000"
              statTitle="Correction Down"
            />
          </Col>

        </Row>
      </Col>

      </React.Fragment>
    )
  }
}

export default EcommerceDashboard