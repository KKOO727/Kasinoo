import React, { Component } from "react"
import {  UncontrolledDropdown, DropdownMenu, DropdownToggle, DropdownItem, Input, Col, Row, Button, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Label, Form } from "reactstrap"
import {  ChevronDown, ChevronLeft, ChevronRight, Trash, ArrowDown, ArrowUp, Edit, } from "react-feather"
import {  getData, menusave, menuupdate, menudelete } from "../../../redux/actions/settting/type"
import DataTable from "react-data-table-component"
import ReactPaginate from "react-paginate"
import { history } from "../../../history"
import { connect } from "react-redux"
import {selectedStyle,pagenation_set,providerconfig, providerconfig_key} from "../../../configs/providerconfig"
import Select from "react-select"

const ActionsComponent = props => {
  return (
    <div className="data-list-action">
      <ArrowUp className="cursor-pointer mr-1" size={20} onClick={()=>props.rowArrowup(props.row)} />
      <ArrowDown className="cursor-pointer mr-1" size={20} onClick={()=>props.rowArrowDown(props.row)} />
      <Edit  className="cursor-pointer mr-1" size={20} onClick={()=>props.rowEdit(props.row)} />
      <Trash className="cursor-pointer mr-1" size={20} onClick={()=>props.rowDelete(props.row,props.parsedFilter,props.me.props.bool)} />
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
        <Col xs="6" md="2" className="mt-1 text-right">
            <Button
                className="add-new-btn"
                color="primary"
                onClick={() => props.handleSidebar(true)}
                outline>
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
            minWidth: "100px",
          },
          {
            name: "text",
            selector: "text",
            sortable: false,
            minWidth: "100px",
          },
          {
            name: "type",
            selector: "type",
            sortable: false,
            minWidth: "100px",
            cell : row => (
                <div>
                    {
                        providerconfig_key[row.type]
                    }
                </div>
            )
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
        rowsPerPage: 10,
        selected: [],
        totalRecords: 0,
        sortIndex: [],
        modal: false,
        type : "",
        update : false,
        rowid : "",
        text : ""
    }

    componentDidMount(){
        this.props.getData(this.props.parsedFilter)
    }

    handleFilter = e => {
      this.setState({ value: e.target.value })
      this.props.filterData(e.target.value)
    }

    handleRowsPerPage = value => {
        let { parsedFilter, getData } = this.props
        let page = parsedFilter.page !== undefined ? parsedFilter.page : 1
        history.push(`${history.location.pathname}?page=${page}&perPage=${value}`)
        this.setState({ rowsPerPage: value })
        getData({ page: page, perPage: value })
    }

    handlePagination = page => {
        let { parsedFilter, getData } = this.props
        let perPage = parsedFilter.perPage !== undefined ? parsedFilter.perPage : 10
        let urlPrefix = history.location.pathname;
        history.push( `${urlPrefix}?page=${page.selected + 1}&perPage=${perPage}` )
        getData({ page: page.selected + 1, perPage: perPage })
        this.setState({ currentPage: page.selected })
    }

    toggleModal = () => {
        this.setState(prevState => ({
            modal: !prevState.modal,
            update : false,
            type : "",
            isChecked : false,
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
          type : this.state.type,
          order : count,
          text : this.state.text
        }
        this.props.menusave(row,this.props.parsedFilter);
      }else{
        var row2 = {
          type : this.state.type,
          order : this.state.ordernum,
          _id  :this.state.rowid,
          text : this.state.text
        }
        this.props.menuupdate([row2],this.props.parsedFilter);
      }
    }

    rowArrowup = (row) => {
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

    rowEdit = (row) => {
      this.setState({modal : true,type : row.type,rowid : row._id,update : true,ordernum : row.order,  text : row.text});
    }

    getOptions = () => {
        let array = [];
        for (let i in providerconfig) {
            array.push({label : i, value : providerconfig[i]})
        }
        return array
    }

    render() {

        
        let { columns, data,totalPages, rowsPerPage, totalRecords, sortIndex } = this.state;
        let options = this.getOptions()
        return (
        <div  id="admindata_table"  className={`data-list list-view`}>
            <Modal
            isOpen={this.state.modal}
            toggle={this.toggleModal}
            className="modal-dialog-centered"
            >
                <Form onSubmit={this.handleSubmit}  action={history.location.pathname} >
                    <ModalHeader toggle={this.toggleModal} className="bg-primary">
                        Add
                    </ModalHeader>
                    <ModalBody className="modal-dialog-centered  mt-1 d-block">
                        <Row>
                            <Col md="12">
                                <Label>text</Label>
                                <FormGroup className="form-label-group">
                                <Input
                                    type="text"
                                    placeholder="Type"
                                    value={this.state.text}
                                    onChange={e => this.setState({ text: e.target.value })}
                                    required
                                />
                                </FormGroup>
                            </Col>
                            <Col md="12">
                                <Label>Types</Label>
                                <FormGroup className="form-label-group">
                                    <Select
                                        className="React"
                                        classNamePrefix="select"
                                        id="type"
                                        name="type"
                                        options={options}
                                        value={options.find(obj => obj.value === this.state.type)}
                                        onChange={e => this.setState({ type: e.value })}
                                    />
                                </FormGroup>
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
        dataList: state.setting.typemanager
    }
}

export default connect(mapStateToProps, {getData,menusave,menuupdate,menudelete})(Child)