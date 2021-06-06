import React from "react"
import { Col, Button, Row} from "reactstrap"
import { toast } from "react-toastify"
import { Root } from "../../../authServices/rootconfig"
import * as FirstPageAction from "../../../redux/actions/CMS/firstpage"
import { connect } from "react-redux"
import Demo from "../../lib/crop"

class Casinopage extends React.Component {
    state = {
        items: [],
        fpImgUrl : "",
        fpImg : null,
        id : null,
        modal : false
    }

    filedupload = (fpImg) =>{
        if (fpImg === null) {
            toast.warning("Select the file.");
            return;
        }
        const fpdata = new FormData();
        fpdata.append('fpImgFile', fpImg);
        fpdata.append('type', "favicon");
        this.props.logo_upload(fpdata,"FirstpageSetting_Favicon");
    }

    componentDidUpdate(prevProps, prevState) {
        if(this.props.FirstpageLoge){
            if(prevProps.FirstpageLoge!==this.props.FirstpageLoge){
                this.setState({fpImgUrl : this.props.FirstpageLoge});
            }
        }
    }

    modalflag = (bool)=>{
        this.setState({modal : bool});
    }
    fpImgUpload = () =>{
        this.modalflag(true)
    }

  render() {

    return (
        <Row>
            <Col md="6">
                <h4>favicon</h4>
            </Col>
            <Col md="6">
                <Button outline color="primary" onClick={()=>this.fpImgUpload()}>
                    upload
                </Button>
            </Col>
            <Col md="12">
                <img className="img-fluid" src={ Root.imageurl+ this.props.FirstpageLoge} alt={""} />
            </Col>
            <Demo modal={this.state.modal} Logoload = {this.props.Faviconload} aspect={1/1}  props = {this.props}  cropSize={{width:50,height:50}}modalflg={this.modalflag}  filedupload ={this.filedupload} />
        </Row>
    )
  }
}

const mapstop = state=>{
    return {
        FirstpageLoge : state.cms.firstpagesetting.favicon
    }
}

export default connect(mapstop,FirstPageAction)(Casinopage)