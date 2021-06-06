import React, { Component } from 'react'
import { connect } from 'react-redux'
import {Row, Col,} from "reactstrap"
import Breadcrumbs from "../../../components/@vuexy/breadCrumbs/BreadCrumb"
import XpressCredential from "./XpressCredential"
import MojosCredential from "./MojosCredential"
import WacCredential from "./WacCredential"
import VivoCredential from "./VivoCredential"
import EzugiCredential from "./EzugiCredential"
import MrslottyCredential from "./MrslottyCredential"
import EvoplayCredential from "./EvoplayCredential"
import BetGamesCredential from "./BetGamesCredential"

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
                            <XpressCredential />
                        </Col>
                        <Col md="12">
                            <MojosCredential />
                        </Col>

                        <Col md="12">
                            <WacCredential />
                        </Col>

                        <Col md="12">
                            <VivoCredential />
                        </Col>

                        <Col md="12">
                            <EzugiCredential />
                        </Col>

                        <Col md="12">
                            <MrslottyCredential />
                        </Col>

                        <Col md="12">
                            <EvoplayCredential />
                        </Col>

                        <Col md="12">
                            <BetGamesCredential />
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
