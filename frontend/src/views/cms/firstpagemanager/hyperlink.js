import React from "react"
import { Row, Col, Button,Input} from "reactstrap"
import { connect } from "react-redux"
import * as FirstPageAction from "../../../redux/actions/CMS/firstpage"

class Casinopage extends React.Component {
    state = {
        bool : true,
        trackcode : this.props.code,
    }

    componentDidUpdate(prevProps, prevState) {  
        if(this.props.code){
            if(prevProps.code !== this.props.code){
                this.setState({trackcode : this.props.code})
            }
        }      
    }

    edit(){
        this.setState({bool : !this.state.bool});
        if(!this.state.bool){
            this.props.trackcodesave({type : "licenceehyperlink",data :this.state.trackcode},"FirstpageSetting_licenceehyperlink");
        }
    }


  render() {
    return (
        <Row>
            <Col md="6">
                <h4>Licencee HyperLink </h4>
            </Col>
            <Col md="6">
                <Button outline color="primary" onClick={()=>this.edit()} >
                    {this.state.bool ? "Edit" : "Save"}   
                </Button>
            </Col>
            <Col md="12" className="mt-1">
                <Input name="input" type="text" value={this.state.trackcode} onChange={(e)=>this.setState({trackcode : e.target.value})} disabled={this.state.bool} />
            </Col>
        </Row>
    )
  }
}

const mapstop = state=>{
    return {
        code : state.cms.firstpagesetting.hyperlinklicense
    }
}

export default connect(mapstop,FirstPageAction)(Casinopage)