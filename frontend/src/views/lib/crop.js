import React, { PureComponent } from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import {CustomInput, Modal,ModalHeader,ModalBody,ModalFooter,Button,Col} from "reactstrap"
import { toast} from "react-toastify"

class App extends PureComponent {
  state = {
    src: null,
    crop: {
      unit: '%',
      width: 30,
      aspect: this.props.aspect,
    },
    blob : null,
    croppedImageUrl  :null
  };

  onSelectFile = e => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener('load', () =>
        this.setState({ src: reader.result })
      );
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  // If you setState the crop in here you should return false.
  onImageLoaded = image => {
    this.imageRef = image;
  };

  onCropComplete = crop => {
    this.makeClientCrop(crop);
  };

  onCropChange = (crop, percentCrop) => {
    // You could also use percentCrop:
    // this.setState({ crop: percentCrop });
    this.setState({ crop });
  };

  async makeClientCrop(crop) {
    if (this.imageRef && crop.width && crop.height) {
      const croppedImage = await this.getCroppedImg( this.imageRef,crop, 'newFile.png' );
      this.setState({croppedImageUrl : croppedImage.fileUrl,blob:croppedImage.blob});
    }
  }

  getCroppedImg(image, crop, fileName) {
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext('2d');

    ctx.drawImage( image, crop.x * scaleX, crop.y * scaleY, crop.width * scaleX, crop.height * scaleY, 0, 0, crop.width, crop.height );

    return new Promise((resolve, reject) => {
      canvas.toBlob(blob => {
        if (!blob) {
          //reject(new Error('Canvas is empty'));
          return;
        }
        blob.name = fileName;
        window.URL.revokeObjectURL(this.fileUrl);
        this.fileUrl = window.URL.createObjectURL(blob);
        resolve({fileUrl : this.fileUrl,blob : blob});
      }, 'image/png');
    });
  }

  toggleModal = () =>{
    this.props.modalflg(!this.props.modal)
  }

  componentDidUpdate(prevProps,prevState) {
    if (prevState.crop.aspect !== this.props.aspect) {
      let crop = this.state.crop;
      crop.aspect = this.props.aspect;
      this.setState({crop : crop})
    }
  }

  cropfileupload= ()=>{
    if(!this.state.croppedImageUrl){
      toast.error("please select img")
    }else{
      this.props.modalflg(!this.props.modal)
      this.props.filedupload(this.state.blob)
    }
  }

  render() {
    const { crop, croppedImageUrl, src } = this.state;
    console.log(crop)
    return (
        <Modal isOpen={this.props.modal}  toggle={this.toggleModal} className={`modal-dialog-centered modal-md`} fade={true}>
          <ModalHeader toggle={this.toggleModal}>
             Upload
          </ModalHeader>
          <ModalBody>
            <Col md="12"  className="text-center">
              <CustomInput type="file" label="choose" id="select_imgsupload" accept="image/*" onChange={this.onSelectFile} name="d" />
            </Col>
            <Col md="12"  className="text-center">
              {src && (
                <ReactCrop
                  src={src}
                  crop={crop}
                  ruleOfThirds
                  onImageLoaded={this.onImageLoaded}
                  onComplete={this.onCropComplete}
                  onChange={this.onCropChange}
                />
              )}
            <Col md="12" className="text-center mt-1">
              {croppedImageUrl && (
                <img alt="Crop"  src={croppedImageUrl} />
              )}
            </Col>
            </Col>
          </ModalBody>
          <ModalFooter className="text-center justify-content-center">
          <Button color="primary" onClick={()=>this.cropfileupload()}>{this.props.editdata ? "update" : "addnew"}</Button>
        </ModalFooter>
        </Modal>
    );
  }
}

export default App