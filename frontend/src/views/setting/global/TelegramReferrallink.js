import React from "react"
import { Row, Col, Button} from "reactstrap"
import { connect } from "react-redux"
import * as Globalaction from "../../../redux/actions/settting/global"
import { Card, CardBody} from "reactstrap"
import {Referrallinkey} from "../../../configs/providerconfig"
import * as GlobalType from "../../../redux/types"
import {  FormGroup, Label, Input} from "reactstrap"

class Casinopage extends React.Component {
    state = {
        link : ""
    }

    componentDidUpdate(prevProps, prevState) {  

        if (this.props.link !== prevProps.link) {
            console.log(this.props.link)
            this.setState({link : this.props.link.Referrallink})
        }
    }

    handleSwitchChange = () => {

        let row = {
            type : Referrallinkey,
            content : this.state.link
        }
        this.props.setGlobalConfig(row, GlobalType.GETREFERALINK)
    }

    render() {
        let link = this.state.link;
        console.log(this.props.link)
        
        return (
            <Card>
                <CardBody>
                    <Row>
                        <Col md="12">
                            <h4>Telegram Referral Link</h4>
                        </Col>
                        <Col md="6" sm="6" xs="12">
                            <Label>Link</Label>
                            <FormGroup>
                            <Input
                                type="text"
                                placeholder="link"
                                value={link}
                                onChange={e => this.setState({link : e.target.value})}
                                required
                            />
                            </FormGroup>
                        </Col>
                      
                        <Col md="6" className="mt-1">
                            <Button color="primary" onClick={()=>this.handleSwitchChange()}>
                                Save
                            </Button>
                        </Col>                       
                    </Row>
                </CardBody>
            </Card>
        )
        }
    }

const mapstop = state=>{
    return {
        link : state.setting.global,
    }
}

export default connect(mapstop,Globalaction)(Casinopage)