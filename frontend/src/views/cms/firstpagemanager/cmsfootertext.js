import React from "react"
import { Row, Col, Button,Input} from "reactstrap"
import { connect } from "react-redux"
import * as FirstPageAction from "../../../redux/actions/CMS/firstpage"
import * as AcionTypes from "../../../redux/types"

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

    edit = () =>{
        this.setState({bool : !this.state.bool});
        if(!this.state.bool){
            this.props.trackcodesave({type : "cmsfootertext",data :this.state.trackcode},AcionTypes.FirstpageSetting_cmsfootertext);
        }
    }


  render() {
    return (
        <Row>
            <Col md="6">
                <h4>CMS Footer text</h4>
            </Col>
            <Col md="6">
                <Button outline color="primary" onClick={()=>this.edit()} >
                    {this.state.bool ? "Edit" : "Save"}   
                </Button>
            </Col>
            <Col md="12" className="mt-1">
                <Input type="textarea" style={{height:"100px"}} value={this.state.trackcode} onChange={(e)=>this.setState({trackcode : e.target.value})} disabled={this.state.bool} />
            </Col>
        </Row>
    )
  }
}

const mapstop = state=>{
    return {
        code : state.cms.firstpagesetting.cmsfootertext
    }
}

export default connect(mapstop,FirstPageAction)(Casinopage)