import React from 'react'
import { Modal,ModalHeader,ModalBody,ModalFooter,Button,Col,FormGroup,Input,Label} from "reactstrap"
import {connect} from "react-redux"
import Toggle from "react-toggle"


class App extends React.Component {

  state = {
    editdata : {
      text1 : "",
      text2 : "",
      text3 : "",
      link : "",
      status : false
    },
    gameid : ""
  }

  toggleModal = ()=>{
    this.props.modalflg(!this.props.modal)
  }

  cropfileupload= ()=>{
    this.props.modalflg(!this.props.modal)
    this.props.textchange(this.state.editdata,this.state.gameid);
  }

  componentDidUpdate(prevProps,prevState){
    if(this.props.editdata){
      if(this.props.editdata.data  && this.props.editdata.data !== prevState.editdata)
      {
        this.setState({editdata :this.props.editdata.data,gameid : this.props.editdata.game})
      }
    }
  }

  onChange =(data,bool)=>{
    var newdata = this.state.editdata;
    newdata[bool] =data;
    this.setState({editdata : newdata});
  }

  handleSwitchChange = () => {
    let item  = this.state.editdata;
    if (this.state.editdata.status) {
      item['status'] = !this.state.editdata.status;
    } else {
      item['status'] = true;
    }
    this.setState({editdata : item});
  }
  
  render() {
    return (
      <Modal isOpen={this.props.modal}  toggle={this.toggleModal} className={`modal-dialog-centered modal-${this.props.size}`} fade={true}>
        <ModalHeader toggle={this.toggleModal}>
          Slider Upload
        </ModalHeader>
        <ModalBody>
        
          <Col md="12" className="mt-2">
            <FormGroup >
              <Label>Slider Text1</Label>
              <Input type="text"  placeholder="Slider Text1" value={this.state.editdata.text1} onChange={e => this.onChange(e.target.value,"text1")}
                required />
            </FormGroup>
          </Col>
          <Col md="12" >
            <FormGroup>
              <Label>Slider Text2</Label>
              <Input type="text" placeholder="Slider Text2" value={this.state.editdata.text2} 
                onChange={e => this.onChange(e.target.value,"text2")} required />
            </FormGroup>
          </Col>
          <Col md="12" >
            <FormGroup>
              <Label>Slider Text3</Label>
              <Input type="text" placeholder="Slider Text3" value={this.state.editdata.text3}
                onChange={e => this.onChange(e.target.value,"text3" )} required />
            </FormGroup>
          </Col>

          <Col md="12" >
            <FormGroup>
              <Label>Game Item Link : Enter Game ID</Label>
              <Input type="text" placeholder="Game Item Link" value={this.state.gameid}
                onChange={e => this.setState({gameid : e.target.value})} required />
            </FormGroup>
          </Col>
          
          <Col md="12" >
            <FormGroup> 
              <Label>Link</Label>
              <Input type="text" placeholder="link" value={this.state.editdata.link}
                onChange={e => this.onChange(e.target.value,"link" )} required />
            </FormGroup>
          </Col>

          <Col md="12" >
            <Label for="bonus">link status</Label>
            <label className="react-toggle-wrapper">
            <Toggle
                checked={this.state.editdata.status}
                onChange={this.handleSwitchChange}
                name="controlledSwitch"
                value="yes"
            />
                <Button.Ripple
                    color="primary"
                    onClick={this.handleSwitchChange}
                    size="sm"
                >
                {this.state.editdata.status ? "Enable" : "Disable" }
                </Button.Ripple>
            </label>
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