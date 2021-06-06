import  React from 'react';
import JqxTreeGrid, { jqx } from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxtreegrid';
import { Row, Col,Button , Modal,ModalHeader,ModalBody,ModalFooter,FormGroup,Input,Label,Form} from "reactstrap"
import Breadcrumbs from "../../../components/@vuexy/breadCrumbs/BreadCrumb"
import {Plus,CornerDownRight,X,Edit2} from "react-feather"
import {toast} from "react-toastify"
import {history} from "../../../history"
import Toggle from "react-toggle";
import confirm from "reactstrap-confirm"
import { connect } from "react-redux";
import {roleList,rowadd_action,rowinadd_action,rowupdate_action,row_delete_action} from "../../../redux/actions/CMS/profilemenu/index"
import Select from "react-select"

const source = {
  dataFields: [
    { name: 'id', type: 'string' },
    { name: 'pid', type: 'string' },
    { name: 'icon', type: 'string' },
    { name: 'title', type: 'string' },
    { name: 'navLink', type: 'string' },
    { name: 'mobileicon', type: 'string' },
    { name: 'status', type: 'Boolean' },
    { name: 'mobilestatus', type: 'Boolean' },
    { name: 'type', type: 'string' },
    { name: '_id', type: 'string' },
  ],
  dataType: 'json',
  hierarchy:
  {
    keyDataField: { name: 'id' },
    parentDataField: { name: 'pid' }
  },
  id: 'id',
  localData: []
};

class App extends React.PureComponent {
   constructor(props) {
    super(props);
    
    this.myTreeGrid = React.createRef();
    const dataAdapter = new jqx.dataAdapter(source);  
    this.state = {
      width: window.innerWidth,
      columnGroups: [
      ],
      columns: [
        { dataField: 'title', text: 'title', width: window.innerWidth/7 },
        { dataField: 'icon', text: 'icon', width:  window.innerWidth/7},
        { dataField: 'mobileicon', text: 'mobileicon', width:  window.innerWidth/7 },
        { dataField: 'navLink', text: 'navLink' ,  width: window.innerWidth/7},
        { dataField: 'type', text: 'type' , width:  window.innerWidth/7},
        { dataField: 'status', text: 'status' , width:  window.innerWidth/7},
        { dataField: 'mobilestatus', text: 'mobilestatus' , width:  window.innerWidth/7},
        
        { dataField: '_id', text: '_id',hidden : true },
      ],
      source: dataAdapter,
      modal: false,
      selectitem : null,
      title : "",
      icon : "",
      mobileicon : "",
      navLink : "",
      status : false,
      update : false,
      bool : "",
      type : false,
      mobilestatus : false
    }
  }

  componentDidMount() {
    this.props.roleList();
  }

  onRowClick(e){
    let selectitem = e.args.row;
    this.setState({selectitem :selectitem });
  }

  add(){
    this.setState(prevState => ({
      modal: !prevState.modal,
      title : "",
      icon : "",
      navLink : "",
      mobileicon : "",
      update : false,
      type : false,
      bool : "add",
      status : false,
      mobilestatus : false
    }))
  }

  inadd(){
    if(!this.state.selectitem){
      toast.warn("Please select item");
      return;
    }
    this.setState(prevState => ({
      modal: !prevState.modal,
      title : "",
      icon : "",
      navLink : "",
      update : false,
      mobileicon : "",
      bool : "inadd",
      mobilestatus : false
    }))
  }

  delete =async () =>{
    if(!this.state.selectitem){
      toast.warn("Please select item");
      return;
    }
    var result = await confirm();
    if(result){
      let id = this.state.selectitem.id;
      var row = {id : id}
      var res = await this.props.row_delete_action(row);
      if(res){
        this.myTreeGrid.current.deleteRow(id);
        this.setState({selectitem : null})
      }else{
        
      }
    }else{
      
    }
  }
  
  edit(){
    if(!this.state.selectitem){
      toast.warn("Please select item");
      return;
    }
  
    this.setState(prevState => ({
      modal: !prevState.modal,
      title : this.state.selectitem.title,
      icon : this.state.selectitem.icon,
      navLink : this.state.selectitem.navLink,
      status : this.state.selectitem.status,
      type : this.state.selectitem.type,
      mobileicon : this.state.selectitem.mobileicon,
      mobilestatus : this.state.selectitem.mobilestatus,
      update : true,
      bool : "edit",
    }))
  }
   
  toggleModal = () => {
    this.setState(prevState => ({
      modal: !prevState.modal
    }))
  }

  add_action = async ()=>{
    let id = new Date().valueOf();
    let pid = 0;
    if(this.state.selectitem){
      if(this.state.selectitem.parent){
        pid = this.state.selectitem.parent.id;
      }
    }
    

    var row = { 
      mobileicon : this.state.mobileicon, 
      pid : pid,
      id :id,
      title: this.state.title,
      navLink : this.state.navLink,
      icon : this.state.icon,
      status : this.state.status,
      type : this.state.type,
      mobilestatus :  this.state.mobilestatus
    }
    console.log(row);
    this.props.rowadd_action(row);
 
  }

  inadd_action = async ()=>{
    let id = new Date().valueOf();
    let pid = null;
    pid = this.state.selectitem.id;
   
    var row ={
      mobileicon : this.state.mobileicon,
      pid : pid,
      id :id,
      title: this.state.title,
      navLink : this.state.navLink,
      icon : this.state.icon,
      status : this.state.status,
      type : this.state.type,
      mobilestatus : this.state.mobilestatus,
    }    
     this.props.rowinadd_action(row);
  
  }

  delete_action = () =>{
  }

  edit_action = async () =>{
    let id = this.state.selectitem.id;
    var row = {
      mobileicon : this.state.mobileicon,
      mobilestatus : this.state.mobilestatus,
      id :id,
      title: this.state.title,
      navLink : this.state.navLink,
      icon : this.state.icon,
      status : this.state.status,
      type : this.state.type
    }    
     this.props.rowupdate_action(row);
  }

  handleSubmit = (e) =>{
    e.preventDefault();
    this.setState(prevState => ({
      modal: !prevState.modal
    }));
    switch(this.state.bool){
      case "add":
        this.add_action();
        break;
      case "inadd":
        this.inadd_action();
        break;
      case "delete":
        this.delete_action();
        break;
      case "edit":
        this.edit_action();
        break;
      default : 
        toast.error("error action")  
      break;
    }
  }

  handleSwitchChange = () => {
    this.setState({
      status: !this.state.status
    })
  }

  handleSwitchChange1 = () => {
    this.setState({
      mobilestatus: !this.state.mobilestatus
    })
  }

  

  componentDidUpdate(prevProps){
    if(prevProps.list !== this.props.list){
      source.localData = this.props.list;
      const dataAdapter = new jqx.dataAdapter(source);
      this.setState({source : dataAdapter});
    }
  }


   render() {
     let type_option = [
      {label : "collapse",value : "collapse"},
      {label : "item",value : "item"}
    ]
    return (
        <React.Fragment>
          <Breadcrumbs breadCrumbTitle="CMS" breadCrumbParent="Permission Manager"  />
          <Row>
            <Col sm="12" className="p-1">
              <Button.Ripple className="mr-1 mb-1" color="primary" onClick={()=>this.add()}>
                <Plus size={14} />Add
              </Button.Ripple>
              <Button.Ripple className="mr-1 mb-1" color="primary" onClick={()=>this.inadd()}>
                <CornerDownRight size={14} />Inadd
              </Button.Ripple>
              <Button.Ripple className="mr-1 mb-1" color="primary" onClick={()=>this.delete()}>
                <X size={14} />Delete
              </Button.Ripple> 
              <Button.Ripple className="mr-1 mb-1" color="primary" onClick={()=>this.edit()}>
                <Edit2 size={14} />Edit
              </Button.Ripple> 
            </Col>
            <Col sm="12">
              <JqxTreeGrid ref={this.myTreeGrid}  style={{width:"100%"}} source={this.state.source} columns={this.state.columns} onRowClick={(e)=>this.onRowClick(e)} />
            </Col>
          </Row>
        
          <Modal isOpen={this.state.modal} toggle={this.toggleModal} className="modal-dialog-centered modal-md">
            <Form onSubmit={this.handleSubmit}  action={history.location.pathname} >
              <ModalHeader toggle={this.toggleModal} className="bg-primary">
                Edit
              </ModalHeader>
              <ModalBody className="modal-dialog-centered mt-2">
                <Row style={{width:"100%"}}>
                <Col md="12"  className="mt-1">
                    <FormGroup className="form-label-group">
                        <Input type="text" value={this.state.title} onChange={e => this.setState({ title: e.target.value })} required />
                        <Label>title</Label>
                      </FormGroup>
                  </Col>
                  <Col md="12"  className="mt-1">
                    <FormGroup className="form-label-group">
                        <Input type="text" value={this.state.icon} onChange={e => this.setState({ icon: e.target.value })} required />
                        <Label>icon</Label>
                      </FormGroup>
                  </Col>
                  <Col md="12"  className="mt-1">
                    <FormGroup className="form-label-group">
                        <Input type="text" value={this.state.mobileicon} onChange={e => this.setState({ mobileicon: e.target.value })} required />
                        <Label>MobileIcon</Label>
                      </FormGroup>
                  </Col>
                  <Col md="12"  className="mt-1">
                    <FormGroup className="form-label-group">
                        <Input type="text" value={this.state.navLink} onChange={e => this.setState({ navLink: e.target.value })} required />
                        <Label>navLink</Label>
                      </FormGroup>
                  </Col>

                  <Col md="12" className="m-0">
                    <Label>type</Label>
                    <Select
                      className="React"
                      classNamePrefix="select"
                      options={type_option}
                      value={type_option.find(obj => obj.value === this.state.type)}
                      defaultValue={type_option[0]}
                      onChange={e => this.setState({ type: e.value })}
                    />
                  </Col>

                  <Col md="12" className="mt-1">
                    <Label>mobilestatus</Label>
                    <label className="react-toggle-wrapper">
                      <Toggle checked={this.state.mobilestatus} onChange={this.handleSwitchChange1} name="controlledSwitch"
                          value="yes" />
                      <Button.Ripple color="primary" onClick={this.handleSwitchChange1} size="sm" >
                      {this.state.mobilestatus ? "Enable" : "Diable"}
                      </Button.Ripple>
                    </label>
                </Col>

                <Col md="12" className="mt-1">
                    <Label>status</Label>
                    <label className="react-toggle-wrapper">
                      <Toggle checked={this.state.status} onChange={this.handleSwitchChange} name="controlledSwitch"
                          value="yes" />
                      <Button.Ripple color="primary" onClick={this.handleSwitchChange} size="sm" >
                      {this.state.status ? "Enable" : "Diable"}
                      </Button.Ripple>
                    </label>
                </Col>
                </Row>
              </ModalBody>
              <ModalFooter>
                <Button color="primary" type="submit" >
                  {!this.state.update ?  "Accept" : "Update"}
                </Button>
              </ModalFooter>
            </Form>
          </Modal>
        </React.Fragment>
    );
  }
}
 

const mapStateToProps = (state) => (
  {
    list : state.cms.profilemenu.list
})

const mapDispatchToProps = {
  roleList,rowadd_action,rowinadd_action,rowupdate_action,row_delete_action
}

export default connect(mapStateToProps, mapDispatchToProps)(App)