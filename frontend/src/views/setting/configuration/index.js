import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getData,configSave ,configUpdate, configDelete} from "../../../redux/actions/settting/configuration"
import { Table ,Col ,Button,FormGroup,Label,Input,Form} from "reactstrap"
import { Modal, ModalHeader, ModalBody, ModalFooter, } from "reactstrap"
import JSONInput from 'react-json-editor-ajrm';
import locale    from 'react-json-editor-ajrm/locale/en';
import { Trash,Edit} from "react-feather"

export class menumanagerchild extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data : [],
            modal: false,
            value : {},
            item : "",
            key : "",
            update : false
        }
    }
  
    componentDidMount(){
        this.props.getData();
    }

    componentDidUpdate(prevProps,prevState){
        if (this.props.dataList.data !== prevState.data) {
            this.setState({data : this.props.dataList.data})
        }
    }

    change = (item,index,key) =>{
        if (item.jsObject) {
            let data = this.state.data;
            data[index] = { value : item.jsObject , key : key};
            this.setState({data : data});
        }
    }
  
    toggleModal = () => {
        this.setState(prevState => ({
        modal: !prevState.modal
        }))
    }

    addConfig = (e) => {
        e.preventDefault();
        let data = {
            key : this.state.key,
            value : this.state.value
        }   
        this.toggleModal();
        if (this.state.update) {
            this.props.configUpdate(data);
        } else {
            this.props.configSave(data);
        }
    }

    configEdit = (item) =>{
        console.log(item)
        this.setState({
            key : item.key,
            value : item.value,
            update : true,
            modal : !this.state.modal
        });
        // this.toggleModal();
    }
    
  render(){

    let configs = this.state.data;
    return (
      <div>
        <Button color="primary" onClick={this.toggleModal} > add  </Button>
        <Table responsive className="mt-1">
            <thead>
                <tr>
                    <th className="textstyle" style={{width:"150px"}}>Key</th>
                    <th>Value</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                {
                    configs && configs.length > 0 ? 
                        configs.map((item,i)=>(
                            <tr key={i}>
                            <th scope="row">{item.key}</th>
                            <td  className="font-weight-bold cursor-pointer">
                                <JSONInput
                                    id          = {i}
                                    placeholder = { item.value }
                                    locale      = { locale }
                                    height      = '100px'
                                    onChange = {(e)=>this.change(e,i,item.key)}
                                />
                            </td>
                            <td>
                                {/* <Save  className="cursor-pointer mr-1" size={20} onClick={() => {this.props.configUpdate(item)}} /> */}
                                <Edit  className="cursor-pointer mr-1" size={20} onClick={() => {this.configEdit(item)}} />
                                <Trash  className="cursor-pointer mr-1" size={20} onClick={() => {this.props.configDelete(item)}} />
                            </td>
                        </tr>
                        )) 
                    : null              
                }
            </tbody>
        </Table>
        <Modal isOpen={this.state.modal} toggle={this.toggleModal} className="modal-dialog-centered modal-lg" >
            <Form className="" action="#" onSubmit={this.addConfig}>
                <ModalHeader toggle={this.toggleModal} className="bg-primary">
                    Large Modal
                </ModalHeader>
                <ModalBody className="modal-dialog-centered d-block">
                    <Col md="12">
                        <FormGroup>
                            <Label for="key">key</Label>
                            <Input type="text" name="key" id="key" placeholder="key"
                                onChange={e=>this.setState({key : e.target.value})}
                                value = {this.state.key} required />
                        </FormGroup>
                    </Col>
                    <Col md="12">
                        <JSONInput
                            id          = {"123123"}
                            placeholder = { this.state.value }
                            locale      = { locale }
                            height      = '350px'
                            onChange = {(e)=>this.setState({value : e.jsObject})}
                        />
                    </Col>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary">
                        { this.state.update ? "update" : "Accept"}
                    </Button>
                </ModalFooter>
            </Form>
        </Modal>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  dataList: state.setting.configuration
})

const mapDispatchToProps = {
  getData,configSave,configUpdate,configDelete
}

export default connect(mapStateToProps, mapDispatchToProps)(menumanagerchild)
