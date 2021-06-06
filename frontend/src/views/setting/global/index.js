import React, { Component } from 'react'
import { connect } from 'react-redux'
import {Row, Col,} from "reactstrap"
import Breadcrumbs from "../../../components/@vuexy/breadCrumbs/BreadCrumb"
import SignupButtonHandle from "./SignupButton"
import TimerShowHandle from "./TimerShowHandle"
import ForgotPasswordHandle from "./forgotpassword"
import AppversionManager from "./AppversionManager"
import TelegramReferrallink from "./TelegramReferrallink"
import FriendlySetting from "./FriendlySetting"
import Sendyconfig from "./Sendyconfig"
import SessionExpiresTime from "./SessionExpiresTime"
import LiveChatSetting from "./LiveChatSetting"
import FeedBackSetting from "./FeedBackSetting"
import LicenseSetting from "./LicenseSetting"
import WithdrawlComission from "./WithdrawlComission"
import {getGlobalSetting} from "../../../redux/actions/settting/global"

export class index extends Component {

    componentDidMount () {
        this.props.getGlobalSetting()
    }

    render() {
        return (
            <React.Fragment>
                <Breadcrumbs breadCrumbTitle="Setting" breadCrumbParent="Global Setting" /> 
                    <Row>
                        <Col md="12">
                            <SignupButtonHandle />
                        </Col>
                        <Col md="12">
                            <ForgotPasswordHandle />
                        </Col>
                        <Col md="12">
                            <TimerShowHandle />
                        </Col>
                        <Col md="12">
                            <AppversionManager />
                        </Col>
                        <Col md="12">
                            <TelegramReferrallink />
                        </Col>
                        <Col md="12">
                            <FriendlySetting />
                        </Col>
                        <Col md="12">
                            <Sendyconfig />
                        </Col>
                        <Col md="12">
                            <SessionExpiresTime />
                        </Col>
                        <Col md="12">
                            <LiveChatSetting />
                        </Col>
                        <Col md="12">
                            <FeedBackSetting />
                        </Col>
                        <Col md="12">
                            <LicenseSetting />
                        </Col>
                       
                        <Col md="12">
                            <WithdrawlComission />
                        </Col>
                    </Row>
            </React.Fragment>
        )
    }
}

const mapStateToProps = (state) => ({
    
})

const mapDispatchToProps = {
    getGlobalSetting
}

export default connect(mapStateToProps, mapDispatchToProps)(index)
