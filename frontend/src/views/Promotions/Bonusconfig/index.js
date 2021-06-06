

import React, { Component } from 'react'
import { connect } from 'react-redux'
import {BonusConfig,SetBonusConfig} from "../../../redux/actions/promotions/Bonus"
import Select from "react-select"
import { Col,Label, FormGroup, Row ,Button} from 'reactstrap'
import Breadcrumbs from "../../../components/@vuexy/breadCrumbs/BreadCrumb"
import Toggle from "react-toggle"

export class index extends Component {

    constructor(props) {
        super(props)
    
        this.state = {
            item : {
                bonusid : "",
                status : false
            }
        }
    }
    

    componentDidMount(){
        this.props.BonusConfig("get")
    }

    componentDidUpdate(prevProps,prevState){
        if (this.props.setconfig) {
            if (prevState.item !== this.props.setconfig) {
                this.setState({item : this.props.setconfig})
            }
        }
    }

    handleSwitchChange = () => {
        let item  = this.state.item
        item['status'] = !this.state.item.status;
        this.setState({item : item});
    }

    save = () => {
        this.props.SetBonusConfig("set",this.state.item);
    }

    render() {
        let { options, } = this.props
        let { bonusid,status } = this.state.item
        return (
            <React.Fragment>
                <Breadcrumbs breadCrumbTitle="Promotion"   breadCrumbParent="Bonus" breadCrumbParent2="config"  />
                <Row>
                    <Col md="12" className="text-center font-weight-bold mb-1 color-white">
                        First Deposit Bonus config
                    </Col>
                    <Col md="6" sm="12">
                        <FormGroup>
                            <Label for="bonus"> Bonus</Label>
                            <Select
                                className="React"
                                classNamePrefix="select"  
                                id="bonus"
                                name="bonus"
                                options={options}
                                value={options.find(obj => obj.value === bonusid)}
                                onChange={e => this.setState({ item : { bonusid: e.value }})}
                            />
                        </FormGroup>
                    </Col> 

                    <Col md="6" >
                        <Label for="bonus">status</Label>
                        <label className="react-toggle-wrapper">
                        <Toggle
                            checked={status}
                            onChange={this.handleSwitchChange}
                            name="controlledSwitch"
                            value="yes"
                        />
                            <Button.Ripple
                                color="primary"
                                onClick={this.handleSwitchChange}
                                size="sm"
                            >
                            {status ? "Enable" : "Disable" }
                            </Button.Ripple>
                        </label>
                    </Col>

                    <Col md="12">
                        <Button color="primary" onClick={()=>this.save()}>
                            Save
                        </Button>
                    </Col>
                </Row>
            </React.Fragment>
        )
    }
}

const mapStateToProps = (state) => ({
    setconfig : state.promotions.BonusMenu.setconfig,
    options : state.promotions.BonusMenu.options,
})

const mapDispatchToProps = {
    BonusConfig,SetBonusConfig
}

export default connect(mapStateToProps, mapDispatchToProps)(index)
