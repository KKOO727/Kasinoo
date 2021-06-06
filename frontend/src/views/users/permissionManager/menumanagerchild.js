import React, { Component } from "react"
import {UncontrolledDropdown,  DropdownMenu,  DropdownToggle,  DropdownItem,Input,Col,Row,Button,Modal,ModalHeader,ModalBody,ModalFooter,FormGroup,Label,Form} from "reactstrap"
import DataTable from "react-data-table-component"
import ReactPaginate from "react-paginate"
import { history } from "../../../history"
import { ChevronDown,  ChevronLeft,  ChevronRight,Trash,ArrowDown,ArrowUp,Edit,Plus,Edit2} from "react-feather"
import { connect } from "react-redux"
import {getData,filterData,menusave,menuupdate,menudelete,pagenationchange} from "../../../redux/actions/user/permission"
import {selectedStyle,pagenation_set} from "../../../configs/providerconfig"

const ActionsComponent = props => {
  return (
    <div className="data-list-action">
      <ArrowUp className="cursor-pointer mr-1" size={20} onClick={()=>props.rowArrowup(props.row)}/>
      <ArrowDown className="cursor-pointer mr-1" size={20}onClick={()=>props.rowArrowDown(props.row)}/>
      <Edit className="cursor-pointer mr-1"size={20}onClick={()=>props.rowEdit(props.row)}/>
      <Trash className="cursor-pointer mr-1"size={20}onClick={()=>props.rowDelete(props.row,props.parsedFilter)}/>
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
      <Col xs="6" md="9" className="mt-1 text-right">
        <Button className="add-new-btn" color="primary" onClick={() => props.handleSidebar(true)} outline>
          <Plus size={15} />
          <span className="align-middle">Add New</span>
        </Button>
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
            name: "id",
            selector: "id",
            sortable: false,
            minWidth: "100px",
          },
          {
            name: "pid",
            selector: "pid",
            sortable: false,
            minWidth: "100px",
          },
          {
            name: "title",
            selector: "title",
            sortable: false,
            minWidth: "100px",
          },
          
          {
            name: "Actions",
            minWidth: "50",
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
                me={this}
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
        title : "",
        update : false,
        rowid : "",
        tooltipOpen : false,
        pid : ''
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
      let urlPrefix = history.location.pathname
      history.push(`${urlPrefix}?page=${page.selected + 1}&perPage=${perPage}`)
      pagenationchange({ page: page.selected + 1, perPage: perPage })
      this.setState({ currentPage: page.selected })
    }

    toggleModal = () => {
      this.setState(prevState => ({
        modal: !prevState.modal,
        update : false,
        title : "",
      }))
    }

    handleSubmit = (e)=>{
      e.preventDefault();
      this.setState(prevState => ({
        modal: !prevState.modal
      }));
      if(!this.state.update){
        var num = this.props.dataList.allData.length;
        var count = 0;
        if(num > 0){
          count = this.props.dataList.allData[num-1].order + 1;
        }
        var row = {
          title : this.state.title,
          order : count,
          pid : this.state.pid
        }
        this.props.menusave(row,this.props.parsedFilter);
      }else{
        var row2 = {
          title : this.state.title,
          order : this.state.ordernum,
          _id  : this.state.rowid,
          pid : this.state.pid
        }

        this.props.menuupdate([row2],this.props.parsedFilter);
      }

    }

    rowArrowup(row){
      var alldata = this.me.props.dataList.allData;
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
        this.me.props.menuupdate([first,last],this.me.props.parsedFilter);
      }
    }

    rowArrowDown(row){
      var alldata = this.me.props.dataList.allData;
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
        this.me.props.menuupdate([first,last],this.me.props.parsedFilter);
      }
    }

    rowEdit(row){
      this.me.setState({modal : true,title : row.title,rowid : row._id,update : true,ordernum : row.order,pid : row.pid});
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

  render() {
    let { columns,data,allData,totalPages,value, rowsPerPage,totalRecords,sortIndex} = this.state
    return (
      <div id="admindata_table" className={`data-list list-view`}>          
        <Modal   isOpen={this.state.modal} toggle={this.toggleModal} className="modal-dialog-centered"   >
          <Form onSubmit={this.handleSubmit}  action={history.location.pathname} >
            <ModalHeader toggle={this.toggleModal} className="bg-primary">
              Role Edit
            </ModalHeader>
            <ModalBody className="modal-dialog-centered  mt-1 d-block">
              <Col md="12">
                <FormGroup className="form-label-group">
                  <Input
                    type="text"
                    placeholder="title"
                    value={this.state.title}
                    onChange={e => this.setState({ title: e.target.value })}
                    required
                  />
                  <div className="form-control-position" >
                    <Edit2 size={15} />
                  </div>
                  <Label>title</Label>
                </FormGroup>
              </Col>
              <Col md="12">
                <FormGroup className="form-label-group">
                  <Input
                    type="number"
                    placeholder="pid"
                    value={this.state.pid}
                    onChange={e => this.setState({ pid: e.target.value })}
                    required
                  />
                  <div className="form-control-position" >
                    <Edit2 size={15} />
                  </div>
                  <Label>Priority</Label>
                </FormGroup>
              </Col>
              
            </ModalBody>
            <ModalFooter>
              <Col md="12" className="text-right">
                <Button color="primary" type="submit">{ this.state.update ? "update" : "Accept" }</Button>
              </Col>
            </ModalFooter>
          </Form>
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
  return {   dataList: state.userslist.permission }
}

export default connect(mapStateToProps, {   getData,filterData,menusave,menuupdate,menudelete,pagenationchange})(Child)