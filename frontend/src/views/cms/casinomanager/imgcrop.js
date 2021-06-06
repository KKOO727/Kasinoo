import React from 'react'
import Cropper from 'react-easy-crop'
import {CustomInput, Button,Col} from "reactstrap"
import { getCroppedImg } from './../../lib/canvasUtils'
import { toast } from 'react-toastify'
import {connect} from "react-redux"
import {Root} from "../../../authServices/rootconfig"

class App extends React.Component {
  state = {
    imageSrc:Root.imageurl+this.props.imageSrc,
    crop: { x: 0, y: 0 },
    zoom: 1,
    aspect: 5 / 2,
    croppedImage : null,
    rotation : 0,
    blob : null,
    
  }

  onCropChange = crop => {
    this.setState({ crop })
  }

  onCropComplete =async (croppedArea, croppedAreaPixels) => {
    
    if(isNaN(croppedArea.x)){
      croppedArea.x = 0
    }
    if(isNaN(croppedArea.y)){
      croppedArea.y = 0
    }

    if(isNaN(croppedAreaPixels.x)){
      croppedAreaPixels.x = 0
    }
    if(isNaN(croppedAreaPixels.y)){
      croppedAreaPixels.y = 0
    }

    croppedAreaPixels.width = this.props.cropSize.width
    croppedAreaPixels.height = this.props.cropSize.height
    const croppedImage = await getCroppedImg(this.state.imageSrc,croppedAreaPixels,this.state.rotation,"newfile.png");
    this.setState({croppedImage : croppedImage.fileUrl,blob:croppedImage.blob});
  }

  onZoomChange = zoom => {
    this.setState({ zoom })
  }

  onFileChange = async( e )=> {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      let imageDataUrl = await this.readFile(file)
      this.setState({imageSrc :imageDataUrl })
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
    if(!this.state.croppedImage){
      toast.error("please select img")
    }else{
      this.props.modalflg(!this.props.modal)
      this.props.filedupload(this.state.blob,this.state.editdata)
    }
  }

  render() {
    return (
      // <Modal isOpen={this.props.modal}  toggle={this.toggleModal} className={`modal-dialog-centered modal-${this.props.size}`} fade={true}>
      //   <ModalHeader toggle={this.toggleModal}>
      //      IMG Upload
      //   </ModalHeader>
      //   <ModalBody>
      <React.Fragment>
        <Col md="12"  className="text-center">
          <CustomInput type="file" label="choose" id="fp_imgupload_logoimgssss" accept="image/*" onChange={this.onFileChange} name="fp_imgupload_logoimgssss" />
        </Col>
        <Col md="12"  className="text-center">
        <div className="crop-container"style={{width:this.props.cropSize.width,height:this.props.cropSize.height}} >
            {
              this.state.imageSrc !== "" ?  
              <Cropper
              image={this.state.imageSrc}
              crop={this.state.crop}
              cropSize={{width: this.props.cropSize.width,height:this.props.cropSize.height}}
              zoom={this.state.zoom}
              aspect={this.props.aspect}
              onCropChange={this.onCropChange}
              onCropComplete={this.onCropComplete}
              onZoomChange={this.onZoomChange}
              onRotationChange={this.setRotationchange}
              rotation={this.state.rotation}
              /> :""
            }
          </div>
        </Col>
        <Col md="12" className="text-center">
          {
            this.state.croppedImage ? <img src={this.state.croppedImage}  style={{width:this.props.cropSize.width,height:this.props.cropSize.height}} alt="Cropped" />: ""
          } 
         </Col>
        <Col md="12" className="text-center d-flex align-items-center justify-content-center">
          <Button color="primary" onClick={()=>this.cropfileupload()}>addnew</Button>
        </Col>
        

      </React.Fragment>
        // </ModalBody>
        // <ModalFooter className="text-center justify-content-center">
        // </ModalFooter>
        // </Modal>
    )
  }
}

const mapStopProps = (state)=>{
    return {allgames : state.gameproviders.providers.allgamedata}
}

export default connect(mapStopProps,{})(App)