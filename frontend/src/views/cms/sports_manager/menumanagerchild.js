import React, { Component } from "react"
import {UncontrolledDropdown,  DropdownMenu,  DropdownToggle,  DropdownItem,Input,Col,Row,Button,Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,FormGroup,Label,Form,Badge} from "reactstrap"
import DataTable from "react-data-table-component"
import ReactPaginate from "react-paginate"
import { history } from "../../../history"
import { ChevronDown,  ChevronLeft,  ChevronRight,ArrowDown,ArrowUp,Edit,Award,Edit2} from "react-feather"
import { connect } from "react-redux"
import {getData,filterData,menuupdate,pagenationchange, sportsImageUpload} from "../../../redux/actions/CMS/sports/index"
import Toggle from "react-toggle"
import { SketchPicker } from 'react-color';
import {selectedStyle,pagenation_set} from "../../../configs/providerconfig"
import {Root} from "../../../authServices/rootconfig"
import Demo from "../casinomanager/imgcrop"
import { toast } from "react-toastify"

const ActionsComponent = props => {
  return (
    <div className="data-list-action">
          <ArrowUp
            className="cursor-pointer mr-1"
            size={20}
            onClick={()=>props.rowArrowup(props.row)}
          />

          <ArrowDown
            className="cursor-pointer mr-1"
            size={20}
            onClick={()=>props.rowArrowDown(props.row)}
          />

          <Edit 
            className="cursor-pointer mr-1"
            size={20}
            onClick={()=>props.rowEdit(props.row)}
          />
       

    </div>
  )
}


const CustomHeader = props => {
  return (
    <Row className="p-1">
    <Col xs="6" md="3">
      <UncontrolledDropdown className="data-list-rows-dropdown mt-1 d-block mb-1">
        <DropdownToggle color="" className="sort-dropdown">
          <span className="align-middle mx-50">
              {`${props.index[0] ? props.index[0] : 0} - ${props.index[1] ? props.index[1] : 0} of ${props.total}`}
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

    <Col xs="6" md="2">
      <div className="filter-section mt-1">
        <Input type="text" className="border-white" onChange={e => props.handleFilter(e)} />
      </div>
    </Col>
    
     
  </Row>
  )
}

class Child extends Component {
    static getDerivedStateFromProps(props, state) {
        if (
            props.dataList.data.length !== state.data.length ||
            state.currentPage !== props.parsedFilter.page
        ) {
        return {
            data: props.dataList.data,
            allData: props.dataList.filteredData,
            totalPages: props.dataList.totalPages,
            currentPage: parseInt(props.parsedFilter.page) - 1,
            rowsPerPage: parseInt(props.parsedFilter.perPage),
            totalRecords: props.dataList.totalRecords,
            sortIndex: props.dataList.sortIndex
        }
    }
    return null;
  }

    state = {
        data: [],
        totalPages: 0,
        currentPage: 0,
        columns: [
          {
            name: "order",
            selector: "order",
            sortable: false,
            minWidth: "50px",
          },
          {
            name: "sport_id",
            selector: "sport_id",
            sortable: false,
            minWidth: "100px",
          },
          {
            name: "name",
            selector: "sport_name",
            sortable: false,
            minWidth: "100px",
          },
          {
            name: "icon",
            selector: "icon",
            sortable: false,
            minWidth: "10px",
            cell : row =>(
              <svg style={{color:row.color, margin:'1.2rem'}} width="30" height="30" viewBox={row.viewBox}>
                <path d={row.icon} fill="currentColor"/>
              </svg>
            )
          },
          {
            name: "Image",
            selector: "sport_name",
            sortable: false,
            minWidth: "100px",
            cell : row => (
              <div >
                {
                  <img style={{width:"100px",height:"70px"}} onClick={()=>this.imgEdit(row)} alt={row._id} src={Root.imageurl + row.image} />
                }
              </div>
            ) 
          },
          {
            name: "Status",
            selector: "status",
            sortable: false,
            minWidth: "100px",
            cell: row => (
              <Badge
                color={ row.status ? "light-success" : "light-danger"}
                pill>
                {row.status ? "Enable" : "Disable"}
              </Badge>
            )
          },
          {
            name: "Actions",
            minWidth: "250",
            sortable: false,
            cell: row => (
              <ActionsComponent
                row={row}
                getData={this.props.getData}
                parsedFilter={this.props.parsedFilter}
                rowArrowup ={this.rowArrowup}
                rowArrowDown ={this.rowArrowDown}
                rowEdit = {this.rowEdit}
                rowDelete={this.props.menudelete}
                add = {this.add}
              />
            )
          },
        ],
        allData: [],
        value: "",
        rowsPerPage: 10,
        sidebar: false,
        currentData: null,
        selected: [],
        totalRecords: 0,
        sortIndex: [],
        addNew: "",
        modal: false,
        sport_name : "",
        ordernum : 0,
        icon : "M16.887 10l1.082-1.873c.142.602.225 1.227.225 1.873a8.16 8.16 0 01-.225 1.874L16.887 10zm-3.431 5.987h2.12a8.166 8.166 0 01-3.187 1.85l1.067-1.85zm-6.912 0l1.067 1.85a8.17 8.17 0 01-3.187-1.85h2.12zm0-11.974h-2.12a8.186 8.186 0 013.187-1.85l-1.067 1.85zm6.912 0l-1.068-1.85a8.178 8.178 0 013.187 1.85h-2.119zm2.734 5.584h-2.734l-1.379-2.389 1.379-2.389h2.734l1.379 2.39-1.38 2.388zm-7.57 3.599h2.734l1.392 2.41-1.366 2.368H8.62l-1.379-2.39 1.38-2.388zm-4.864-2.793h2.759l1.379 2.39-1.379 2.388H3.756l-1.378-2.388 1.378-2.39zm2.759-5.584l1.379 2.39-1.379 2.388H3.756L2.378 7.208 3.756 4.82h2.759zm4.839 1.986H8.62L7.241 4.416l1.38-2.389h2.759l1.366 2.367-1.392 2.411zM8.62 12.39L7.241 10l1.38-2.389h2.733L12.733 10l-1.379 2.39H8.62zm4.836 2.79l-1.379-2.387 1.379-2.39h2.734l1.379 2.39-1.38 2.388h-2.733zM1.806 10c0-.622.076-1.226.207-1.81L3.058 10l-1.044 1.81A8.167 8.167 0 011.806 10zM10 1c-4.963 0-9 4.037-9 9s4.037 9 9 9 9-4.037 9-9-4.037-9-9-9z",
        sport_id : "",
        update : false,
        rowid : "",
        isChecked : false,
        tooltipOpen : false,
        viewBox : "0 0 20 20",
        color : "#0F063C",
        imgsrc : "",
        imgmodal : false
    }

    componentDidMount(){
      this.props.getData(this.props.parsedFilter)
    }

    handleFilter = e => {
      this.setState({ value: e.target.value })
      this.props.filterData(e.target.value)
    }

    handleRowsPerPage = value => {
      let { parsedFilter, pagenationchange } = this.props
      let page = parsedFilter.page !== undefined ? parsedFilter.page : 1
      history.push(`${history.location.pathname}?page=${page}&perPage=${value}`)
      this.setState({ rowsPerPage: value })
      pagenationchange({ page: page, perPage: value })
    }

    handlePagination = page => {
      let { parsedFilter, pagenationchange } = this.props
      let perPage = parsedFilter.perPage !== undefined ? parsedFilter.perPage : 10
      let urlPrefix =history.location.pathname
      history.push(`${urlPrefix}?page=${page.selected + 1}&perPage=${perPage}`)
      pagenationchange({ page: page.selected + 1, perPage: perPage })
      this.setState({ currentPage: page.selected })
    }

    toggleModal = () => {
      this.setState(prevState => ({
        modal: !prevState.modal,
        update : false,
        title : "",
        icon : "",
        navLink : "",
        isChecked : false
      }))
    }

    handleSubmit = (e)=>{
      e.preventDefault();
      this.setState(prevState => ({
        modal: !prevState.modal
      }));
      if(!this.state.update){

      }else{
        var row2 = {
          icon : this.state.icon,
          order : this.state.ordernum,
          sport_id  :this.state.sport_id,
          viewBox : this.state.viewBox,
          color : this.state.color,
          status : this.state.isChecked
        }
        this.props.menuupdate([row2],this.props.parsedFilter);
      }

    }

    imgEdit = (row) => {
      console.log(row)
      this.setState({imgsrc : row.image, imgmodal : !this.state.imgmodal, rowid : row._id})
    } 
    
    rowArrowup = (row) => {
      console.log(row)
      console.log(this.props.dataList)
      var alldata = this.props.dataList.allData;
      var min =  alldata[0].order;
      if(row.order === min){
        return;
      }else{
        var num = row.order;
        var first = {};
        var last = {};
        for(var i = 0 ; i < alldata.length ; i++){
          if(alldata[i].order === num){
            last = alldata[i];
            first = alldata[i-1];
            break;
          }
        }
        var temp = 0;
        temp = first.order;
        first.order = last.order;
        last.order = temp;
        this.props.menuupdate([first,last],this.props.parsedFilter);
      }
    }

  rowArrowDown = (row) => {
    var alldata = this.props.dataList.allData;
    var max = alldata[alldata.length-1].order;
    if(row.order === max){
      return;
    }else{
      var num = row.order;
      var first = {};
      var last = {};
      for(var i = 0 ; i < alldata.length ; i++ ){
        if(alldata[i].order === num){
          last = alldata[i];
          first = alldata[i+1];
          break;
        }
      }
      var temp = 0;
      temp = first.order;
      first.order = last.order;
      last.order = temp;
      this.props.menuupdate([first,last],this.props.parsedFilter);
    }
  }

  rowEdit = (row) =>{
    this.setState({color : row.color,viewBox : row.viewBox,modal : true,sport_name : row.sport_name,icon : row.icon,sport_id : row.sport_id,rowid : row._id,update : true,ordernum : row.order,isChecked : row.status});
  }

  handleSwitchChange = () => {
    this.setState({
      isChecked: !this.state.isChecked
    })
  }

  toggleTooltip = () => {
    this.setState({
      tooltipOpen: !this.state.tooltipOpen
    })
  }
  ImgtoggleModal = () =>{
    this.setState(prevState => ({
      imgmodal: !prevState.imgmodal,
    }))
  }

  async imagefileupload(fpImg){
    if (fpImg === null) {
      toast.warning("Select the file.");
      return;
    }

    const fpdata = new FormData();
    fpdata.append('fpImgFile', fpImg);
    fpdata.append('_id', this.state.rowid);
    this.props.sportsImageUpload(this.props.parsedFilter,fpdata)
  }
  
  render() {
    let {
      columns,
      data,
      allData,
      totalPages,
      value,
      rowsPerPage,
      totalRecords,
      sortIndex
    } = this.state
    return ( 
      <div id="admindata_table" className={`data-list`}>
         <Modal
          isOpen={this.state.modal}
          toggle={this.toggleModal}
          className="modal-dialog-centered"
        >
        <Form onSubmit={this.handleSubmit}  action={history.location.pathname} >
          <ModalHeader toggle={this.toggleModal} className="bg-primary">
            Primary
          </ModalHeader>
          <ModalBody className="modal-dialog-centered  mt-1">
          <Row>
            <Col md="12">
                <FormGroup className="form-label-group position-relative has-icon-left">
                    <Input
                      type="text"
                      disabled={true}
                      placeholder="title : SPORTS"
                      value={this.state.sport_id}
                      onChange={e => this.setState({ sport_id: e.target.value })}
                      required
                    />
                    <div className="form-control-position" >
                      <Edit2 size={15} />
                    </div>
                    <Label>sport_id</Label>
                  </FormGroup>

              </Col>
           
            <Col md="12">
              <FormGroup className="form-label-group position-relative has-icon-left">
                  <Input
                    type="text"
                    disabled={true}
                    placeholder="title : SPORTS"
                    value={this.state.sport_name}
                    onChange={e => this.setState({ name: e.target.value })}
                    required
                  />
                  <div className="form-control-position" >
                    <Edit2 size={15} />
                  </div>
                  <Label>name</Label>
                </FormGroup>

            </Col>
           
              <Col md="12">
                <svg style={{color:this.state.color, margin:'1.2rem'}} width="22" height="22" viewBox={this.state.viewBox}>
                  <path d={this.state.icon} fill="currentColor"/>
                </svg>
              </Col>

              <Col md="12">
                <FormGroup className="form-label-group position-relative has-icon-left">
                    <Input
                      type="text"
                      value={this.state.viewBox}
                      onChange={e => this.setState({ viewBox: e.target.value })}
                      required
                    />
                    <div className="form-control-position" >
                      <Award size={15} />
                    </div>
                    <Label>viewBox</Label>
                  </FormGroup>
              </Col>

              <Col md="12">
                <FormGroup className="form-label-group position-relative has-icon-left">
                    <Input
                      type="textarea"
                      value={this.state.icon}
                      onChange={e => this.setState({ icon: e.target.value })}
                      required
                    />
                    <div className="form-control-position" >
                      <Award size={15} />
                    </div>
                    <Label>icon</Label>
                  </FormGroup>
              </Col>

              <Col md="12">
                <FormGroup className="form-label-group position-relative has-icon-left">
                  
                    <SketchPicker
                      color={ this.state.color }
                      onChangeComplete={(e)=>this.setState({color : e.hex}) }
                    />
                    <div className="form-control-position" >
                      <Award size={15} />
                    </div>
                    <Label>color</Label>
                  </FormGroup>
              </Col>

              <Col md="12">
                <label className="react-toggle-wrapper">
                <Toggle
                  checked={this.state.isChecked}
                  onChange={this.handleSwitchChange}
                  name="controlledSwitch"
                  value="yes"
                />
                <Button.Ripple
                  color="primary"
                  onClick={this.handleSwitchChange}
                  size="sm"
                >
                  {this.state.isChecked ? "Enable" : "Diable"}
                </Button.Ripple>
              </label>
              </Col>
            </Row>

          </ModalBody>
          <ModalFooter>
            {
              this.state.update ? <Button color="primary" type="submit">update</Button> : <Button color="primary" type="submit">Accept</Button>
            }
            
          </ModalFooter>
        </Form>
      </Modal>

      <Modal isOpen={this.state.imgmodal} toggle={this.ImgtoggleModal} className="modal-dialog-centered" >
        <ModalHeader toggle={this.ImgtoggleModal} className="bg-primary">
          IMG Change
        </ModalHeader>
        <ModalBody className="modal-dialog-centered  mt-1">
          <Row>
            <Demo modal={this.state.imgmodal} imageSrc={this.state.imgsrc} props={this.props} state ={this.state} cropSize={{width:300,height:200}} aspect={3/2} modalflg={this.ImgtoggleModal} filedupload ={this.imagefileupload} />
          </Row>
        </ModalBody>
      </Modal>

        <DataTable
          columns={columns}
          data={value.length ? allData : data}
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
              forcePage={
                this.props.parsedFilter.page
                  ? parseInt(this.props.parsedFilter.page - 1)
                  : 0
              }
              onPageChange={page => this.handlePagination(page)}
            />
          )}
          noHeader
          subHeader
          responsive
          pointerOnHover
          selectableRowsHighlight
          onSelectedRowsChange={data =>
            this.setState({ selected: data.selectedRows })
          }
          customStyles={selectedStyle}
          subHeaderComponent={
            <CustomHeader
              handleFilter={this.handleFilter}
              handleRowsPerPage={this.handleRowsPerPage}
              rowsPerPage={rowsPerPage}
              total={totalRecords}
              index={sortIndex}
              parsedFilter={this.props.parsedFilter}
              handleSidebar={this.toggleModal}
            />
          }
          sortIcon={<ChevronDown />}
        />
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    dataList: state.cms.sports
  }
}

export default connect(mapStateToProps, {
    getData,
    filterData,
    menuupdate,
    pagenationchange,
    sportsImageUpload
})(Child)