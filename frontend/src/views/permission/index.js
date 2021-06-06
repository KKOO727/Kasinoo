import  React from 'react';
import JqxTreeGrid, { jqx } from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxtreegrid';
import { Row, Col,Button , Modal,ModalHeader,ModalBody,ModalFooter,FormGroup,Input,Label,Form} from "reactstrap"
import Breadcrumbs from "../../components/@vuexy/breadCrumbs/BreadCrumb"
import {Plus,CornerDownRight,X,Edit2} from "react-feather"
import {toast} from "react-toastify"
import {history} from "../../history"
import Toggle from "react-toggle";
import confirm from "reactstrap-confirm"
import MultiSelect from "react-multi-select-component";
import { connect } from "react-redux";
import {roleList,rowadd_action,rowinadd_action,rowupdate_action,row_delete_action} from "../../redux/actions/permission/index"
import Select from "react-select"

const source = {
  dataFields: [
    { name: 'id', type: 'string' },
    { name: 'pid', type: 'string' },
    { name: 'icon', type: 'string' },
    { name: 'title', type: 'string' },
    { name: 'navLink', type: 'string' },
    { name: 'status', type: 'Boolean' },
    { name: 'type', type: 'string' },
    { name: 'roles', type: 'array' },
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
        { dataField: 'title', text: 'title', width: window.innerWidth/5 },
        { dataField: 'icon', text: 'icon', width:  window.innerWidth/5 },
        { dataField: 'navLink', text: 'navLink' ,  width: window.innerWidth/5},
        { dataField: 'type', text: 'type' , width:  window.innerWidth/5},
        { dataField: 'status', text: 'status' , width:  window.innerWidth/5},
        { dataField: 'roles', text: 'roles',hidden : true },
        { dataField: '_id', text: '_id',hidden : true },
      ],
      source: dataAdapter,
      modal: false,
      selectitem : null,
      title : "",
      icon : "",
      navLink : "",
      status : false,
      update : false,
      bool : "",
      roles : [],
      type : false
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
      update : false,
      type : false,
      bool : "add",
      status : false,
      roles  :[]
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
      bool : "inadd",
      roles  :[]
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
    var rows=[]
    var data = this.props.roleLists;
    var roles  = this.state.selectitem.roles;
    for(let key in roles){
      if(roles[key]){
        var select = data.find(obj=>obj.value === key);
        rows.push(select);
      }
    }

    this.setState(prevState => ({
      modal: !prevState.modal,
      title : this.state.selectitem.title,
      icon : this.state.selectitem.icon,
      navLink : this.state.selectitem.navLink,
      status : this.state.selectitem.status,
      type : this.state.selectitem.type,
      update : true,
      bool : "edit",
      roles  :rows
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
    var roles = {}
    for(var i = 0 ; i < this.state.roles.length ; i++){
      roles[this.state.roles[i].value] = true;
    }

    var row = {pid : pid,id :id,title: this.state.title,navLink : this.state.navLink,icon : this.state.icon,status : this.state.status,roles :  roles,type : this.state.type}
    console.log(row);
    this.props.rowadd_action(row);
    // if(res){
    // this.props.roleList();

      // this.myTreeGrid.current.addRow(row.id,row,"last",row.pid);
    // }else{

    // }
  }

  inadd_action = async ()=>{
    let id = new Date().valueOf();
    let pid = null;
    pid = this.state.selectitem.id;
    var roles = {}
    for(var i = 0 ; i < this.state.roles.length ; i++){
      roles[this.state.roles[i].value] = true;
    }
    var row ={pid : pid,id :id,title: this.state.title,navLink : this.state.navLink,icon : this.state.icon,status : this.state.status,roles :  roles,type : this.state.type}
    console.log(row);
    
     this.props.rowinadd_action(row);
    // if(res){
    // this.props.roleList();

      // this.myTreeGrid.current.addRow(id,row,"last",pid);
    // }else{

    // }
  }

  delete_action = () =>{
  }

  edit_action = async () =>{
    let id = this.state.selectitem.id;
    var roles = {}
    for(var i = 0 ; i < this.state.roles.length ; i++){
      roles[this.state.roles[i].value] = true;
    }
    var row = {id :id,title: this.state.title,navLink : this.state.navLink,icon : this.state.icon,status : this.state.status,roles :  roles,type : this.state.type}
    console.log(row);
    
     this.props.rowupdate_action(row);
    // if(res){
    // this.props.roleList();
    //   // this.myTreeGrid.current.updateRow(id,row);
    // }else{

    // }
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
      type: !this.state.type
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
                        <Input type="text" value={this.state.navLink} onChange={e => this.setState({ navLink: e.target.value })} required />
                        <Label>navLink</Label>
                      </FormGroup>
                  </Col>

                  <Col md="12" className="m-0">
                    <Label>type</Label>
                    {/* <label className="react-toggle-wrapper">
                      <Toggle checked={this.state.type} onChange={this.handleSwitchChange1} name="controlledSwitch"
                          value="yes" />
                      <Button.Ripple color="primary" onClick={this.handleSwitchChange1} size="sm" >
                      {this.state.type ? "collapse" : "item"}
                      </Button.Ripple>
                    </label> */}
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
                    <Label>roles view</Label>
                    <MultiSelect options={this.props.roleLists} className="multi-select" classNamePrefix="select" selectAllLabel="ALL Roles"
                        hasSelectAll="All" shouldToggleOnHover={true} value={this.state.roles} focusSearchOnOpen={true} onChange={(e)=>this.setState({roles : e})} labelledBy={"Select Roles"}/>
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
    roleLists :state.permission.data,
    list : state.permission.list
})

const mapDispatchToProps = {
  roleList,rowadd_action,rowinadd_action,rowupdate_action,row_delete_action
}

export default connect(mapStateToProps, mapDispatchToProps)(App)