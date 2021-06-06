import React, { Component } from "react"
import {Input,Col,Row,Button,Modal,ModalBody,ModalHeader,Form,Label,FormGroup,ModalFooter,Badge,UncontrolledDropdown,DropdownToggle,DropdownMenu,DropdownItem} from "reactstrap"
import DataTable from "react-data-table-component"
import ReactPaginate from "react-paginate"
import { history } from "../../../history"
import { X,  Check,  ChevronDown,  ChevronLeft,  ChevronRight, Edit,Edit2} from "react-feather"
import { connect } from "react-redux"
import * as Casinoactions from "../../../redux/actions/CMS/livecasinogamelist"
import {LivecasinoItemImg_upload} from "../../../redux/actions/CMS/livecasinogamelist"
import { toast } from "react-toastify"
import { Root } from "../../../authServices/rootconfig"
import { CopyToClipboard } from "react-copy-to-clipboard"
import {selectedStyle,pagenation_set,TOPGAMES} from "../../../configs/providerconfig"
import { JsonEditor as Editor } from 'jsoneditor-react';
import Select from "react-select"
import Demo from "./imgcrop"

const OrderChangeAction = props =>{
  return (
    <Row>
      <Button.Ripple className="round"   color="flat-warning" onClick={() => { return props.orderchange(props.row,) }} >
        <Edit size={14} /> order
      </Button.Ripple>
      <Button.Ripple className="round"   color="flat-danger" onClick={() => { return props.props.LivecasinoDelete(props.row,props.props.parsedFilter,props.state.filters,props.props.bool) }} >
        <Edit size={14} /> delete
      </Button.Ripple>
    </Row>
  )  
}

const ActionS = props => {
  let action = props.props;
  let state = props.state;
  return (
    <Row>
      <Button.Ripple className="round"   color="flat-success" onClick={() => { return action.statuspagecheck(props.row,true,action.parsedFilter,state.filters,action.bool,) }} >
        <Check size={14} />
        Done
      </Button.Ripple>
      <Button.Ripple className="round"   color="flat-danger" onClick={() => { return action.statuspagecheck(props.row,false,action.parsedFilter,state.filters,action.bool,) }} >
        <X size={14} /> reject
      </Button.Ripple>
      <Button.Ripple className="round"   color="flat-warning" onClick={() => { return props.Edit(props.row) }} >
        <Edit size={14} /> Edit
      </Button.Ripple>
    </Row>
  )
}

const FpActionsComponent = props => {
  let action = props.props;
  let topflag = TOPGAMES;
    return (
      <Row className="">
        <Button.Ripple className="round textstyle"   color="flat-success"onClick={() => {return action.firstpagecheck(props.row,true,action.parsedFilter,action.bool,props.state.filters)}}>
          First Page
        </Button.Ripple>
        <Button.Ripple className="round textstyle"   color="flat-success"onClick={() => {return action.topgamescheck(props.row,true,action.parsedFilter,action.bool,props.state.filters, topflag)}}>
          Top games
        </Button.Ripple>
      </Row>
    )
}

const Filtercomponent = props => {
  let typeoptions = props.dataList.typeoptions;
  let provideroptions = props.dataList.provideroptions;
  let filters = props.state.filters;
  return (
    <Row>
      <Col md='3' sm='6' xs='12'>
        <FormGroup>
          <Label for="user">Provider Name</Label>
          <Select className="React" classNamePrefix="select" name="providerid" 
            options={provideroptions}
            value={provideroptions.find(obj => obj.value === filters.providerid)}
            onChange={e => props.handleFilter(e.value,"providerid")}
          />
        </FormGroup>
      </Col>

      <Col md='3' sm='6' xs='12'>
        <FormGroup>
          <Label for="user">type</Label>
          <Select className="React" classNamePrefix="select" name="typeid" 
            options={typeoptions}
            value={typeoptions.find(obj => obj.value === filters.typeid)}
            onChange={e => props.handleFilter(e.value,"typeid")}
          />
        </FormGroup>
      </Col>
      <Col md="3" sm="6" xs="12">
        <Label>NAME</Label>
        <FormGroup>
          <Input
              type="text"
              placeholder="NAME"
              value={filters.NAME}
              onChange={e => props.handleFilter(e.target.value,"NAME")}
              required
          />
        </FormGroup>
      </Col>
      <Col md="3" sm="6" xs="12">
        <Label>ID</Label>
        <FormGroup>
          <Input
              type="text"
              placeholder="ID"
              value={filters.ID}
              onChange={e => props.handleFilter(e.target.value,"ID")}
              required
          />
        </FormGroup>
      </Col>
    </Row>
  )
}


const CustomHeader = props => {
  let {totalRecords,sortIndex} = props.dataList;
 
  return (
    <div className='p-1 pt-2 pb-2'>
      <Row>
        <Col xs='3' className='justify-content-start align-items-center flex' md="2">
          <UncontrolledDropdown className="data-list-rows-dropdown d-block ">
            <DropdownToggle color="" className="sort-dropdown">
              <span className="align-middle mx-50">
              {`${sortIndex[0]} - ${sortIndex[1]} of ${totalRecords}`}
              </span>
            <ChevronDown size={15} />
            </DropdownToggle>
            <DropdownMenu tag="div" right>
            {
              pagenation_set.map((item,i)=>(
                <DropdownItem tag="a" key={i} onClick={() => props.handleRowsPerPage(item)}>{item} </DropdownItem>
              ))
            }
          </DropdownMenu>
          </UncontrolledDropdown>
        </Col>
        <Col xs="3" md="10" className="text-right">
          <Button.Ripple className="round mt-1"   color="flat-success" onClick={()=>props.action.ProviderCheck(props.action.parsedFilter,true,props.action.bool,props.state.filters)} >
            <Check size={14} />
            Done
          </Button.Ripple>
          <Button.Ripple className="round mt-1"   color="flat-danger" onClick={()=>props.action.ProviderCheck(props.action.parsedFilter,false,props.action.bool,props.state.filters)} >
            <X size={14} />
            reject
          </Button.Ripple>
          <Button.Ripple className="round mt-1"   color="flat-success" onClick={()=>props.addaction()} >
            <Check size={14} />
            Add item
          </Button.Ripple>
        </Col>
        
      </Row>
    </div>
  )
}

class ListViewConfig extends Component {
 
    state = {
      data: [],
      columns: [ 
        {
          name: "_id",
          selector: "_id",
          sortable: true,
          minWidth: "50px",
          cell : row =>(
            <CopyToClipboard text={row._id} >
              <Badge color={"light-warning"} >
                click
              </Badge>
          </CopyToClipboard>
          )
        },
        {
          name: "ORDER",
          selector: "order",
          sortable: true,
          minWidth: "10px",
        },
        {
          name: "ID",
          selector: "ID",
          sortable: true,
          minWidth: "10px",
        },
        {
          name: "NAME",
          selector: "NAME",
          sortable: true,
          minWidth: "100px",
        },
        {
          name: "TYPE",
          selector: "TYPE",
          sortable: true,
          minWidth: "100px",
        },
        // {
        //   name: "detail",
        //   selector: "detail",
        //   sortable: false,
        //   minWidth: "200px",
        //   cell : row =>(
        //     <JSONInput
        //         id          = {row._id}
        //         placeholder = { row.WITHOUT }
        //         locale      = { locale }
        //         height      = '100px'
        //         disabled={true}
        //     />
        //   )
        // },
        {
          name: "image",
          selector: "image",
          sortable: true,
          minWidth: "170px",
          cell : params =>{ return (
            <img onClick={()=>this.ImgEdit(params)} src={ params.image ? params.image.length > 0 ? params.image.slice(0,5) === "https" ? params.image : Root.imageurl + params.image : "" : ""} height="100" width="150" alt={params.image} />
          )
          }
        },
        {
          name: "Status",
          selector: "status",
          sortable: true,
          maxWidth:  "100px",
          cell: params => {
            return params.status === true ? (
              <div className="badge badge-pill badge-light-success">
                Allow
              </div>
            ) : params.status === false ? (
              <div className="badge badge-pill badge-light-danger">
                Reject
              </div>
            ):null
          }
        },
        {
          name: "order",
          sortable: true,
          maxWidth:  "100px",
          cell: row => (
            <OrderChangeAction
              row={row}
              {...this}
            />
          )
        },
        {
          name: "Actions",
          sortable: true,
          maxWidth:  "150px",
          cell: row => (
            <ActionS
              row={row}
              {...this}
            />
          )
        },
        {
          name: "Actions",
          sortable: true,
          minWidth:  "210px",
          cell: row => (
            <FpActionsComponent
              row={row}
              {...this}
            />
          )
        }
      ],
        modal : false,
        cmodal : false,
        order : 0,
        selectrow :{
        },
        type : "",
        imgmodal : false,
        update : false,
        filters  : {
          providerid : "",
          typeid  :"",
          NAME : "",
          ID : ""
        }
      } 

    

  

    ImgEdit = (row) =>{
      this.setState({selectrow : row,imgmodal : !this.state.imgmodal});
    }

    toggleModal = () => {
      this.setState(prevState => ({
        modal: !prevState.modal,
        selectrow : {}
      }))
    }

    ImgtoggleModal = () =>{
      this.setState(prevState => ({
        imgmodal: !prevState.imgmodal,
      }))
    }

    additem = () =>{
      this.setState(prevState => ({
        modal: !prevState.modal,
        selectrow : {
          WITHOUT : {}
        },
        update : false
      }))
    }

    ctoggleModal = () => {
      this.setState(prevState => ({
        cmodal: !prevState.cmodal,
        selectrow : {}
      }))
    }

    handleSubmit =(e) =>{
      e.preventDefault();
      this.setState(prevState => ({
        modal: !prevState.modal
      }));

      if(this.state.update){
        this.props.Livecasinoitemsupdate(this.state.selectrow,this.props.parsedFilter,this.props.bool,this.state.filters)
      }else{
        let row = this.state.selectrow;
        row["providerid"] = this.state.filters.providerid;
        this.props.Livecasinoitemsadd(row,this.props.parsedFilter,this.state.filters,this.props.bool,);
      }
    }

    
    Edit = (row) =>{
      this.setState({selectrow : row,modal : !this.state.modal,update : true})
    }


    orderchange =(row) =>{
      this.setState({selectrow : row,cmodal : !this.state.cmodal,order : row.order});
    }

    ChangeEdit = (e,select) =>{
      var row = this.state.selectrow;
      row[select] = e;
      this.setState({selectrow : row})
    }

    chandleSubmit =(e) =>{
      e.preventDefault();
      this.setState(prevState => ({
        cmodal: !prevState.cmodal
      }));
      if(this.state.order === this.state.selectrow.order){  
        toast.error("Please enter correct")
      }else{
        var sorder = parseInt(this.state.order);
        var row = Object.assign({},this.state.selectrow,{order : sorder});
        this.props.GameinforChange([row],this.props.parsedFilter,this.props.bool,this.state.filters)
      }
    }
    
    async imagefileupload(fpImg){
      if (fpImg === null) {
        toast.warning("Select the file.");
        return;
      }

      const fpdata = new FormData();
      fpdata.append('fpImgFile', fpImg);
      fpdata.append('_id', this.state.selectrow._id);
      fpdata.append('PROVIDERID', this.state.selectrow.PROVIDERID);
      let dd = await LivecasinoItemImg_upload(fpdata);
      if (dd.status) {
        this.props.ProviderLoad(this.props.parsedFilter,this.props.bool,this.state.filters);
      } else {
        alert("error")
      }
    } 


    componentDidMount(){
      this.props.ProviderLoad(this.props.parsedFilter,this.props.bool,this.state.filters);
      this.props.ProviderTotal(this.props.bool);
    }

    handlePagination = page => {
      let { parsedFilter, ProviderLoad } = this.props;
      let perPage = parsedFilter.perPage !== undefined ? parsedFilter.perPage : pagenation_set[0];
      let urlPrefix =`${history.location.pathname}`;
      history.push( `${urlPrefix}?page=${page.selected + 1}&perPage=${perPage}`);
      var params = { page: page.selected + 1, perPage: perPage };
      ProviderLoad(params,this.props.bool,this.state.filters);
    }

    componentDidUpdate(preveProps,prevState){
      if(preveProps.dataList !== this.props.dataList){
        let datalist = this.props.dataList;
        let filters = this.state.filters;
        filters["providerid"] = datalist.setproviderid
        this.setState({
          data : datalist.data,
          totalPages: datalist.totalPages,
          filters : filters
        })
      }
    }

    handleRowsPerPage = value => {
      let { parsedFilter, ProviderLoad } = this.props
      let page = parsedFilter.page !== undefined ? parsedFilter.page : 1;
      history.push(`${history.location.pathname}?page=${page}&perPage=${value}`)
      var params = { page: page, perPage: value };
      ProviderLoad(params,this.props.bool,this.state.filters);
    }

    handleFilter = (value,bool) => {
      let filters = this.state.filters;
      filters[bool] = value;
      this.setState({filters : filters});
      console.log(filters)
      this.props.ProviderLoad(this.props.parsedFilter,this.props.bool,filters);
    }


  render() {
    let { columns, data,totalPages} = this.state;
    let {typeoptions} = this.props.dataList;
    return (
      <React.Fragment>
        <Filtercomponent 
          dataList={this.props.dataList}
          handleFilter = {this.handleFilter}
          state={this.state}
          action={this.props}
          filters = {this.state.filters}
        />
        <div id="admindata_table"   className={`data-list list-view`}>

          <Modal isOpen={this.state.modal} toggle={this.toggleModal} className="modal-dialog-centered modal-lg" >
            <Form onSubmit={this.handleSubmit}  action={history.location.pathname} >
              <ModalHeader toggle={this.toggleModal} className="bg-primary">
                GAME ITEM EDIT
              </ModalHeader>
              <ModalBody className="modal-dialog-centered  mt-1">
                <Row>
                  <Col md="12">
                    <FormGroup className="form-label-group position-relative has-icon-left">
                      <Input type="text" placeholder="title"  value={this.state.selectrow.NAME} onChange={e => this.ChangeEdit(e.target.value,"NAME") } required />
                      <div className="form-control-position" >
                        <Edit2 size={15} />
                      </div>
                      <Label>title</Label>
                    </FormGroup>
                  </Col>
                  <Col md="12">
                    <FormGroup className="form-label-group position-relative has-icon-left">
                      <Input type="text" placeholder="image"  value={this.state.selectrow.image} onChange={e => this.ChangeEdit(e.target.value,"image") } required />
                      <div className="form-control-position" >
                        <Edit2 size={15} />
                      </div>
                      <Label>image</Label>
                    </FormGroup>
                  </Col>
                  <Col md="12">
                    <FormGroup className="form-label-group position-relative has-icon-left">
                      <Input type="text" placeholder="ID"  value={this.state.selectrow.ID} onChange={e => this.ChangeEdit(e.target.value,"ID") } required />
                      <div className="form-control-position" >
                        <Edit2 size={15} />
                      </div>
                      <Label>ID</Label>
                    </FormGroup>
                  </Col>
                  <Col md="12">
                    <Editor value={this.state.selectrow.WITHOUT} onChange={(e)=>this.ChangeEdit(e,"WITHOUT")} />
                  </Col>
                  <Col md="12">
                    <FormGroup>
                      <Label for="TYPE">TYPE</Label>
                      <Select className="React" classNamePrefix="select" name="typeid" 
                        options={typeoptions}
                        value={typeoptions.find(obj => obj.value === this.state.selectrow.TYPE)}
                        onChange={(e)=>this.ChangeEdit(e.value,"TYPE")}                   
                      />                  
                    </FormGroup>
                  </Col>
                </Row>
              </ModalBody>
              <ModalFooter>
                <Button color="primary" type="submit">{this.state.update ? "update" : "accept"}</Button>
              </ModalFooter>
            </Form>
          </Modal>

          <Modal isOpen={this.state.cmodal} toggle={this.ctoggleModal} className="modal-dialog-centered" >
            <Form onSubmit={this.chandleSubmit}  action={history.location.pathname} >
              <ModalHeader toggle={this.ctoggleModal} className="bg-primary">
                Order Change
              </ModalHeader>
              <ModalBody className="modal-dialog-centered  mt-1">
                <Row>
                  <Col md="12">
                    <FormGroup className="form-label-group position-relative has-icon-left">
                        <Input
                          type="number"
                          placeholder="order"
                          minLength={1}
                          value={this.state.order}
                          onChange={e => this.setState({order : e.target.value}) }
                          required
                        />
                        <div className="form-control-position" >
                          <Edit2 size={15} />
                        </div>
                        <Label>order</Label>
                      </FormGroup>
                  </Col>
                </Row>
              </ModalBody>
              <ModalFooter>
                <Button color="primary" type="submit">update</Button>
              </ModalFooter>
            </Form>
          </Modal>


          <Modal isOpen={this.state.imgmodal} toggle={this.ImgtoggleModal} className="modal-dialog-centered" >
            <ModalHeader toggle={this.ImgtoggleModal} className="bg-primary">
              IMG Change
            </ModalHeader>
            <ModalBody className="modal-dialog-centered  mt-1">
              <Row>
                <Demo modal={this.state.imgmodal} imageSrc={this.state.selectrow.image} props={this.props} state ={this.state} cropSize={{width:300,height:200}} aspect={3/2} modalflg={this.ImgtoggleModal} filedupload ={this.imagefileupload} />
              </Row>
            </ModalBody>
          </Modal>
    

          <DataTable
              columns={columns}
              data={data}
              pagination
              paginationServer
              paginationComponent={() => (
                <ReactPaginate
                  previousLabel={<ChevronLeft size={15} />}
                  nextLabel={<ChevronRight size={15} />}
                  breakLabel="..."
                  breakClassName="break-me"
                  pageCount={totalPages}
                  containerClassName="vx-pagination separated-pagination pagination-end pagination-sm mb-0 mt-2"
                  activeClassName="active"
                  forcePage={ this.props.parsedFilter.page ? parseInt(this.props.parsedFilter.page - 1) : 0 }
                  onPageChange={page => this.handlePagination(page)}
                />
              )}
              noHeader
              subHeader
              responsive
              pointerOnHover
              selectableRowsHighlight
              customStyles={selectedStyle}
              subHeaderComponent={
                <CustomHeader
                  handleRowsPerPage={this.handleRowsPerPage}
                  dataList={this.props.dataList}
                  handleFilter = {this.handleFilter}
                  state={this.state}
                  action={this.props}
                  addaction={this.additem}
                  filters = {this.state.filters}
                />
              }
              sortIcon={<ChevronDown />}
            />
        </div>
      </React.Fragment>
    )
  }
}

const mapStateToProps = state => {
  return {
    dataList: state.cms.livecasinogamelist,
  }
}

export default connect(mapStateToProps,Casinoactions)(ListViewConfig)