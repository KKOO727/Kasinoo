import React from "react"
import {  Edit} from "react-feather"
import { toast } from "react-toastify"
import { connect } from "react-redux"
import Demo from "./children"
import EditText from "./editdata"
import confirm from "reactstrap-confirm"
import { Root } from "../../../authServices/rootconfig"
import {  Row, Col,CardHeader,Button,CardBody,  ListGroup,ListGroupItem,} from "reactstrap"
import * as FpMngAction from "../../../redux/actions/CMS/firstpageMngAction"
import {reorder,order_change} from "../../../redux/actions/auth/index"
import { Trash } from 'react-feather'

import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"


class DndHorizontal extends React.Component {

  state = {
    direction: "horizontal",
    deviceWidth: window.width,
    items: [],
    fpImgUrl : "",
    fpImg : null,
    lastitems : [],
    modal : false,
    selectrow : {},
    addnew : true,
    casinosliderimg : this.props.casinosliderimg,
    titlemodal : false
  }

  updateDnd = () => {
    this.setState({
      deviceWidth: window.innerWidth
    })
    if (this.state.deviceWidth <= 992) {
      this.setState({
        direction: "vertical"
      })
    } else {
      this.setState({
        direction: "horizontal"
      })
    }
  }
  
  componentDidMount() {
    this.updateDnd();
  }

  componentDidUpdate(prevProps, prevState) {
    if(prevProps.casinosliderimg!==this.props.casinosliderimg){
      this.props.casinosliderimg ? this.setState({items:this.props.casinosliderimg}) :  this.setState({items:[]});
    }
    window.addEventListener("resize", this.updateDnd)
  }

  changeFile = (fpImg) => {
    if (fpImg) {
      if (fpImg.type.split("/")[0] !== 'image') {
        toast.warning('Please select only image file.');
      }
      if (fpImg.size > 2097152) {
        toast.warning("This is too large file.The file must be smaller than 500kb");
        return;
      }
    }
    let fpdata = new FormData();
    fpdata.append('fpImgFile', fpImg);
    fpdata.append('bool', this.props.bool);
    fpdata.append("addnew",this.state.addnew);
    if (!this.state.addnew) {
      fpdata.append("_id", this.state.selectrow._id);
      fpdata.append("order", this.state.selectrow.order);
    }
    this.props.Slider_upload(fpdata,this.props.type);
  }

  handleItemsMove = async(row) => {
    var result =  await confirm();
    if(result){
      this.props.Slider_delete({data : row,bool : this.props.bool},this.props.type);
    }
  }

  onDragEnd = result => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const items = reorder( this.state.items, result.source.index, result.destination.index)
    var resdata = JSON.stringify(items);
    var lastdata = JSON.stringify(this.state.items);
    if (resdata !== lastdata) {
      var ch_data =  order_change(items);
      this.props.Slider_update({data : ch_data, bool : this.props.bool},this.props.type);
    }
    this.setState({ items });
  }

  rowArrowup = (row) => {
    var alldata = this.state.items;
    var min =  alldata[0].order;
    if (row.order === min) {
      return;
    } else {
      var num = row.order;
      var first = {};
      var last = {};
      for (var i = 0 ; i < alldata.length ; i++) {
        if (alldata[i].order === num) {
          last = alldata[i];
          first = alldata[i-1];
          break;
        }
      }
      var temp = 0;
      temp = first.order;
      first.order = last.order;
      last.order = temp;
      this.props.Slider_update({data : [first,last], bool : this.props.bool},this.props.type);
    }
  }

  rowArrowDown = (row) => {
    var alldata = this.state.items;
    var max = alldata[alldata.length-1].order;
    if (row.order === max) {
      return;
    } else {
      var num = row.order;
      var first = {};
      var last = {};
      for (var i = 0 ; i < alldata.length ; i++ ) {
        if (alldata[i].order === num) {
          last = alldata[i];
          first = alldata[i+1];
          break;
        }
      }
      var temp = 0;
      temp = first.order;
      first.order = last.order;
      last.order = temp;
      this.props.Slider_update({data : [first,last], bool : this.props.bool},this.props.type);
    }
  }

  modalflag = (bool,item = null)=>{
    this.setState({modal : !this.state.modal,selectrow : item,addnew : true});
  }

  modalflag1 = (bool,item = null)=>{
    this.setState({titlemodal : !this.state.titlemodal,selectrow : item,addnew : true});
  }
  

  EditChange = (bool,item = null) =>{
    var gameitem = {};
    gameitem = item;
    gameitem["game"] = item.gameid ? item.gameid._id  :"";
    this.setState({modal : !this.state.modal,selectrow : gameitem,addnew : false});  
  }

  EdittitleChange = (item) => {
    var gameitem = {};
    gameitem = item;
    gameitem["game"] = item.gameid ? item.gameid._id  :"";
    this.setState({titlemodal : !this.state.titlemodal,selectrow : gameitem,addnew : false});  
  }

  textchange = (editdata,gameid) => {
    let row = {
      data: editdata,
      gameid : gameid,
      selectrow : this.state.selectrow,
      bool : this.props.bool
    }
    this.props.textchange(row,this.props.type)
  }

  render() {

    return (
      <Col md="12" className="p-1">
          <CardHeader className="p-0 m-0">
            <Row>
              <Col md="6">
                <h4 className='text-uppercase'>{this.props.title}</h4>
              </Col>
              <Button color="primary" onClick={()=>this.modalflag(true)}>Add</Button>
            </Row>
          </CardHeader>
          <CardBody className="p-0 m-0">
            <Demo modal={this.state.modal} editdata = {this.state.selectrow} size = {"md"}aspect = {4/1} cropSize={{height:100}}modalflg={this.modalflag} filedupload ={this.changeFile} />
            <EditText modal={this.state.titlemodal} editdata = {this.state.selectrow} modalflg={this.modalflag1} textchange = {this.textchange} />

            {
              this.state.items.length > 0 ? 
            <ListGroup id="list-group-dnd">
                <DragDropContext onDragEnd={this.onDragEnd}>
                  <Droppable droppableId="droppable">
                      {(provided, snapshot) => (
                        <div ref={provided.innerRef}>
                          {
                            this.state.items.map((item,index)=>(
                              <Draggable key={item._id}draggableId={item._id} index={index} >
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className="drag-wrapper"
                                  >
                                  <ListGroupItem>
                                    <Row>
                                      <Col style={{width:"160px"}}>
                                        <img className="img-fluid" src={Root.imageurl+item.image} alt={item.image} style={{width:"160px",height:"40px"}} onClick={() => this.EditChange(true,item)} />
                                      </Col>
                                      <Col>
                                        {
                                          item.data ? item.data.text1 : ""
                                        }
                                      </Col>
                                        {
                                          item.gameid ? 
                                          <>
                                            <Col> 
                                              {
                                                item.gameid.NAME
                                              }
                                            </Col>
                                            <Col>
                                              {
                                                item.gameid.TYPE
                                              }
                                            </Col>
                                            <Col>
                                              <img className="img-fluid" src={item.gameid.image ? item.gameid.image.length > 0 ? item.gameid.image.slice(0,5) === "https" ? item.gameid.image : Root.imageurl + item.gameid.image : "" : ""} alt={item.gameid.image} style={{width:"50px",height:"40px"}} />
                                            </Col>
                                          </>
                                          : null
                                        }
                                      <Col style={{width:"100px"}}>
                                        <Row>
                                          <Col md="3">
                                            <div className="cursor-pointer"  onClick={() => this.EdittitleChange(item)}>
                                              <Edit size={15} />
                                            </div>
                                          </Col>                          
                                          <Col md="3">
                                            <div className="cursor-pointer"  onClick={() => this.handleItemsMove(item)}>
                                              <Trash size={15} /> 
                                            </div>
                                          </Col> 
                                        </Row>
                                      </Col>
                                    </Row>
                                  </ListGroupItem>
                              </div>
                              )}
                            </Draggable>
                            ))
                          }
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </DragDropContext>
                </ListGroup>
              :null
            }
          </CardBody>
      </Col>
    )
  }
}



export default  connect(null,FpMngAction)(DndHorizontal)