import React, { Component } from 'react'
import Breadcrumbs from "../../../components/@vuexy/breadCrumbs/BreadCrumb"
import { connect } from 'react-redux'
import {Row} from "reactstrap"

export class index extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
             
        }
    }
    
    render() {
        return (
            <React.Fragment>
                <Breadcrumbs
                breadCrumbTitle="Setting"
                breadCrumbParent="DomainConfiguration"
                />
                <Row>
                    
                </Row>
            </React.Fragment>
        )
    }
}

const mapStateToProps = (state) => ({
    
})

const mapDispatchToProps = {
    
}

export default connect(mapStateToProps, mapDispatchToProps)(index)
