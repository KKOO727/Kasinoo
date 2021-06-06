import React, { Component } from 'react'
import { connect } from 'react-redux'
import {getRevenueLoad} from "../../../redux/actions/dashboard/index"
import Flatpickr from "react-flatpickr"; 
import { Col,Row} from "reactstrap"
import StatisticsCard from "../../../components/@vuexy/statisticsCard/StatisticsCard"
import  * as FC from "react-icons/fc";
import { subscribersGained, subscribersGainedSeries } from "../../ui-elements/cards/statistics/StatisticsData"

export class index extends Component {

    constructor(props) {
        super(props)
    
        this.state = {
            date : [
                new Date(),
                new Date(new Date().valueOf() + 24 * 60 * 60 * 1000),
            ]
        }
    }
    

    componentDidMount(){
        // this.props.getRevenueLoad(this.state.date,this.props.user);
    }

    date_change = e =>{
        if(e.length ===2){
            this.setState({date :  e});
            this.props.getRevenueLoad(e,this.props.user)
        }
    }

    render() {

        let {BET,WIN,given,receive,MakingDeposits,MakingWithdrawals,playersLoggedIn,totallogincount,
            playersRegistered,playersBalance,Profit,playersMakingDeposit,playersMakingWithdrawals,playersBonusBalance,playersagentBalance,positiontaking} = this.props.data ? this.props.data : null;
        return (
            <Row className="h-100">
                <Col md="12">
                    <Flatpickr value={this.state.date} className="form-control" options={{  mode: "range"  }} onChange={date => this.date_change(date)} />
                </Col>
                <Col md="12" sm="12" className="h-100 pb-3">
                    <Row  style={{overflowY:"scroll"}} className="h-100">       
                        <Col lg="3" md="6" sm="12">
                            <StatisticsCard
                            hideChart
                            iconRight
                            iconBg="primary"
                            className="text-uppercase"
                            icon={<FC.FcProcess className="primary" size={22} />}
                            stat={MakingDeposits ? parseInt(MakingDeposits) :0}
                            statTitle="TOTAL OF DEPOSITS"
                            />
                        </Col>
                        <Col lg="3" md="6" sm="12">
                            <StatisticsCard
                            hideChart
                            iconRight
                            iconBg="success"
                            className="text-uppercase"
                            icon={<FC.FcRemoveImage className="success" size={22} />}
                            stat={MakingWithdrawals ?parseInt(MakingWithdrawals) :0}
                            statTitle="Total of Withdrawals"
                            />
                        </Col>
                        <Col lg="3" md="6" sm="12">
                            <StatisticsCard
                            hideChart
                            iconRight
                            iconBg="danger"
                            className="text-uppercase"
                            icon={<FC.FcCustomerSupport className="danger" size={22} />}
                            stat={playersLoggedIn ?playersLoggedIn :0}
                            statTitle="Players Logged In"
                            />
                        </Col>
                        <Col lg="3" md="6" sm="12">
                            <StatisticsCard
                            hideChart
                            iconRight
                            className="text-uppercase"
                            iconBg="warning"
                            icon={<FC.FcConferenceCall className="warning" size={22} />}
                            stat={totallogincount ? totallogincount  : 0}
                            statTitle="Total login count"
                            />
                        </Col>
                        <Col lg="3" md="6" sm="12">
                            <StatisticsCard
                            hideChart
                            iconRight
                            className="text-uppercase"
                            iconBg="success"
                            icon={<FC.FcContacts className="warning" size={22} />}
                            stat={playersRegistered ? playersRegistered : 0}
                            statTitle="Players Registered"
                            />
                        </Col>
                        <Col lg="3" md="6" sm="12">
                            <StatisticsCard
                            hideChart
                            iconRight
                            className="text-uppercase"
                            iconBg="danger"
                            icon={<FC.FcCurrencyExchange className="warning" size={22} />}
                            stat={playersBalance ? parseInt(playersBalance) : 0}
                            statTitle="Players Balance"
                            />
                        </Col>
                        <Col lg="3" md="6" sm="12">
                            <StatisticsCard
                            hideChart
                            iconRight
                            className="text-uppercase"
                            iconBg="warning"
                            icon={<FC.FcProcess className="warning" size={22} />}
                            stat={Profit ? parseInt(Profit) : 0}
                            statTitle="PROFIT"
                            />
                        </Col>
                        <Col lg="3" md="6" sm="12">
                            <StatisticsCard
                            hideChart
                            iconRight
                            iconBg="warning"
                            className="text-uppercase"
                            icon={<FC.FcDebt className="warning" size={22} />}
                            stat={playersMakingDeposit ? playersMakingDeposit : 0}
                            statTitle="Players Marking Deposits"
                            />
                        </Col>
                        <Col lg="3" md="6" sm="12">
                            <StatisticsCard
                            hideChart
                            iconRight
                            className="text-uppercase"
                            iconBg="warning"
                            icon={<FC.FcDataRecovery className="warning" size={22} />}
                            stat={playersMakingWithdrawals ? playersMakingWithdrawals : 0}
                            statTitle="Players Making Withdrawals"
                            />
                        </Col>
                        <Col lg="3" md="6" sm="12">
                            <StatisticsCard
                            hideChart
                            className="text-uppercase"
                            iconRight
                            iconBg="warning"
                            icon={<FC.FcPlus className="warning" size={22} />}
                            stat={playersBonusBalance ? parseInt(playersBonusBalance) : 0}
                            statTitle="Bonus Balance"
                            />
                        </Col>
                        <Col lg="3" md="6" sm="12">
                            <StatisticsCard
                            hideChart
                            className="text-uppercase"
                            iconRight
                            iconBg="warning"
                            icon={<FC.FcMoneyTransfer className="warning" size={22} />}
                            stat={playersagentBalance ? parseInt(playersagentBalance) : 0}
                            statTitle="Agent Balance"
                            />
                        </Col>
                        <Col lg="3" md="6" sm="12">
                                <StatisticsCard
                                    icon={<FC.FcMoneyTransfer className="success" size={22} />}
                                    stat={BET}
                                    hideChart
                                    iconRight
                                    statTitle="TOTAL BET"
                                    type="area"
                                    options={subscribersGained}
                                    series={subscribersGainedSeries}
                                />
                            </Col>
                        <Col lg="3" md="6" sm="12">
                            <StatisticsCard
                                icon={<FC.FcMoneyTransfer className="danger" size={22} />}
                                stat={WIN}
                                hideChart
                                iconRight
                                statTitle="TOTAL WIN"
                                type="area"
                                options={subscribersGained}
                                series={subscribersGainedSeries}
                            />
                        </Col>
                        <Col lg="3" md="6" sm="12">
                            <StatisticsCard
                                icon={<FC.FcMoneyTransfer className="warning" size={22} />}
                                stat={receive}
                                hideChart
                                iconRight
                                statTitle="TOTAL RECEIVE"
                                type="area"
                                options={subscribersGained}
                                series={subscribersGainedSeries}
                            />
                        </Col>
                        <Col lg="3" md="6" sm="12">
                            <StatisticsCard
                                icon={<FC.FcMoneyTransfer className="warning" size={22} />}
                                stat={given}
                                hideChart
                                iconRight
                                statTitle="TOTAL GIVEN"
                                type="area"
                                options={subscribersGained}
                                series={subscribersGainedSeries}
                            />
                        </Col> 
                        <Col lg="3" md="6" sm="12">
                            <StatisticsCard
                                icon={<FC.FcMoneyTransfer className="warning" size={22} />}
                                stat={positiontaking ? positiontaking : 0 + "%"}
                                hideChart
                                iconRight
                                statTitle="POSITION TAKING"
                                type="area"
                                options={subscribersGained}
                                series={subscribersGainedSeries}
                            />
                        </Col> 
                    </Row>
                </Col>
            </Row>
        )
    }
}

const mapStateToProps = (state) => ({
    data : state.dashboard.Revenue
})

const mapDispatchToProps = {
    getRevenueLoad
}

export default connect(mapStateToProps, mapDispatchToProps)(index)