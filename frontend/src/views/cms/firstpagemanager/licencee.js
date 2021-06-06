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
        flag : false,
        modal : false
    }

    fpImgUpload = () =>{
        this.modalflag(true)
    }

    fileduploadaction(fpImg){
        if (fpImg === null) {
            toast.warn("Select the file.");
            return;
        }
        const fpdata = new FormData();
        fpdata.append('fpImgFile', fpImg);
        fpdata.append('type', "licenselogo");
        this.props.logo_upload(fpdata,"FirstpageSetting_license");
    }

    componentDidUpdate(prevProps, prevState) {
    
    }

    modalflag = (bool)=>{
        this.setState({modal : bool});
    }

    render() {
    var url =  Root.imageurl
    return (
        <Row>
            <Col md="6">
                <h4>Licencee</h4>
            </Col>
            <Col md="6">
                <Button outline color="primary" onClick={()=>this.fpImgUpload()}>
                    upload
                </Button>
            </Col>
            <Col md="12">
                <img className="img-fluid" src={ url+ this.props.FirstpageLoge} alt={this.state.fpImgUrl} />
            </Col>
            <Demo modal={this.state.modal} cropSize={{width:500,height:150}} aspect={5/2} modalflg={this.modalflag} props = {this.props} filedupload ={this.fileduploadaction} />
        </Row>
        )
    }
}

const mapstop = state=>{
    return {
        FirstpageLoge : state.cms.firstpagesetting.license
    }
}

export default connect(mapstop,FirstPageAction)(Casinopage)