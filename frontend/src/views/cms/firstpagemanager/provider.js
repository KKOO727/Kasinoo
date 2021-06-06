import React from "react"
import { X } from "react-feather"
import { Row, Col, Card, Button, CardHeader } from "reactstrap"
import { toast } from "react-toastify"
import { Root } from "../../../authServices/rootconfig"
import { connect } from "react-redux"
import * as FirstPageAction from "../../../redux/actions/CMS/firstpage"
import Demo from "../../lib/crop"
import confirm from "reactstrap-confirm"

class Casinopage extends React.Component {
  state = {
    items: [],
    fpImgUrl : "",
    fpImg : "",
    data : []
  }

  handleItemsMove = async (i,row) => {
    var result = await confirm();
    if(result){
      this.props.delete_providerimg(row);   
    }
  }

  filedupload = (fpImg) =>{
    if (fpImg === null) {
        toast.warning("Select the file.");
        return;
    }
    const fpdata = new FormData();
    fpdata.append('fpImgFile', fpImg);
    fpdata.append('bool', "2");
    this.props.upload_provider_paymentimgs(fpdata,"FirstpageSetting_providerimg")
   }

  fpImgUpload = () =>{
    this.modalflag(true)
  }
  modalflag = (bool)=>{
    this.setState({modal : bool});
  }

  render() {

    let renderList =  this.props.providerimgs ? this.props.providerimgs.map((item, i) => {
      return (
        <Card
          className={`ecommerce-card ${
            this.state.items.includes(i) ? "d-none" : ""
          }`}
          key={i}
        >
          <div className="card-content">
            <div className="text-center">
                <img className="img-fluid" src={Root.imageurl+item.image} alt={item.image} />
            </div>

            <div className="item-options text-center">
              <div className="cart" onClick={() => this.handleItemsMove(i,item)}>
                <X size={15} />
                <span className="align-middle ml-50">Remove</span>
              </div>
            </div>
          </div>
        </Card>
      )
    }) : ""
    return (
        <div className="ecommerce-application">
          <CardHeader>
            <Row>
              <Col md="3">
                <h4>Provider Img</h4>
              </Col>
              <Col md="3">
                <Demo modal={this.state.modal}cropSize={{width:100,height:30}}  Logoload={this.props.providerImgLoad} modalflg={this.modalflag}aspect={3/1} filedupload ={this.filedupload} />
                <Button color="primary" outline className="mb-1" onClick={this.fpImgUpload}>Upload</Button>
              </Col>
            </Row>
          </CardHeader>
          <div className="grid-view wishlist-items">{renderList}</div>
        </div>
    )
  }
}

const mapstop = state=>{
    return {
      providerimgs : state.cms.firstpagesetting.providerimgs
    }
}

export default connect(mapstop,FirstPageAction)(Casinopage)