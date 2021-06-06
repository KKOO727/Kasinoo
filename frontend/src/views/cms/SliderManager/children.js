import React from 'react'
import {CustomInput, Modal,ModalHeader,ModalBody,ModalFooter,Button,Col,} from "reactstrap"
import {connect} from "react-redux"
import { Root } from "../../../authServices/rootconfig"


class App extends React.Component {
  state = {
    imageSrc:"",
    crop: { x: 0, y: 0 },
    zoom: 1,
    aspect: 5 / 2,
    croppedImage : null,
    rotation : 0,
    blob : null,
  }

  onFileChange = async( e )=> {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      let imageDataUrl = await this.readFile(file)
      this.setState({imageSrc :imageDataUrl ,blob :file })
    }
  }

  getRadianAngle =(degreeValue)=> {
    return (degreeValue * Math.PI) / 180
  }

   readFile = (file)=> {
    return new Promise(resolve => {
      const reader = new FileReader()
      reader.addEventListener('load', () => resolve(reader.result), false)
      reader.readAsDataURL(file)
    })
  }

  setRotationchange =(rotation)=>{
    this.setState({ rotation })
  }

  toggleModal = ()=>{
    this.props.modalflg(!this.props.modal)
  }

  cropfileupload= ()=>{
    // if(!this.state.blob){
    //   toast.error("please select img")
    // }else{
      this.props.modalflg(!this.props.modal)
      this.props.filedupload(this.state.blob,);
    // }
  }


  componentDidUpdate(prevProps,prevState){
    if (this.props.editdata) {
      if ( (Root.imageurl + this.props.editdata.image) !== prevState.imageSrc) {
        this.setState({imageSrc : Root.imageurl+this.props.editdata.image})
      }
    }
  }

  render() {
    return (
      <Modal isOpen={this.props.modal}  toggle={this.toggleModal} className={`modal-dialog-centered modal-${this.props.size}`} fade={true}>
        <ModalHeader toggle={this.toggleModal}>
          Slider Upload
        </ModalHeader>
        <ModalBody>
          <Col md="12"  className="text-center">
            <CustomInput type="file" label="image select" id="fp_imgupload_logoimgssss" accept="image/*" onChange={this.onFileChange} name="fp_imgupload_logoimgssss" />
          </Col>
           <Col md="12" className="text-center mt-1">
            {
              this.state.imageSrc ? <img src={this.state.imageSrc}  style={{width:"100%",height:this.props.cropSize.height}} alt="Cropped" />: ""
            } 
           </Col>
        </ModalBody>
        <ModalFooter className="text-center justify-content-center">
          <Button color="primary" onClick={()=>this.cropfileupload()}>{this.props.editdata ? "update" : "add"}</Button>
        </ModalFooter>
      </Modal>
    )
  }
}

const mapStopProps = (state)=>{
    return {allgames : state.gameproviders.providers.allgamedata}
}

export default connect(mapStopProps,{})(App)