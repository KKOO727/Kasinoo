import React, { Component } from "react"
import {UncontrolledDropdown,  DropdownMenu,  DropdownToggle,  DropdownItem,Input,Col,Row,Button,Modal, ModalHeader,ModalBody,
  ModalFooter,Form} from "reactstrap"
import DataTable from "react-data-table-component"
import ReactPaginate from "react-paginate"
import { history } from "../../../history"
import { ChevronDown,  ChevronLeft,  ChevronRight,Trash,Plus} from "react-feather"
import { connect } from "react-redux"
import {getData,filterData,menusave,menudelete} from "../../../redux/actions/tools/geoipblock"
import {selectedStyle,pagenation_set} from "../../../configs/providerconfig"

const ActionsComponent = props => {
  return (
    <div className="data-list-action">
      <Trash className="cursor-pointer mr-1" size={20} onClick={()=>props.rowDelete(props.row,props.parsedFilter)} />
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
      <div className="filter-section mb-1 mt-1">
        <Input type="text" className="border-white" onChange={e => props.handleFilter(e)} />
      </div>
    </Col>
    <Col xs="6" md="2" className="mt-1 text-right">
       <Button
          className="add-new-btn"
          color="primary"
          onClick={() => props.handleSidebar(true)}
          outline>
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
            name: "IP address",
            selector: "ipaddress",
            sortable: false,
            minWidth: "300px",
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
        update : false,
        rowid : "",
        isChecked : false,
        tooltipOpen : false,
        ip1 : 0,
        ip2 : 0,
        ip3 : 0,
        ip4 : 0,
    }
    thumbView = this.props.thumbView;

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
        let urlPrefix =history.location.pathname
        history.push(   `${urlPrefix}?page=${page.selected + 1}&perPage=${perPage}` )
        getData({ page: page.selected + 1, perPage: perPage })
        this.setState({ currentPage: page.selected })
    }

    toggleModal = () => {
      this.setState(prevState => ({
        modal: !prevState.modal,
        update : false,
        ip1 : 0,
        ip2 : 0,
        ip3 : 0,
        ip4 : 0,
      }))
    }

    handleSubmit = (e)=>{
      e.preventDefault();
      this.setState(prevState => ({
        modal: !prevState.modal
      }));
      if(!this.state.update){
        
        var row = {
          ipaddress : this.state.ip1+ "."+this.state.ip2+ "."+this.state.ip3+ "."+this.state.ip4
        }
        this.props.menusave(row,this.props.parsedFilter);
      }else{
        // var row = {
        //   icon : this.state.icon,
        //   title : this.state.title,
        //   navLink : this.state.navLink,
        //   order : this.state.ordernum,
        //   _id  :this.state.rowid,
        //   status : this.state.isChecked
        // }

        // this.props.menuupdate([row],this.props.parsedFilter);
      }
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
      <div id="admindata_table" className={`data-list list-view`}>          
        <Modal isOpen={this.state.modal} toggle={this.toggleModal} className="modal-dialog-centered" >
          <Form onSubmit={this.handleSubmit}  action={history.location.pathname} >
            <ModalHeader toggle={this.toggleModal} className="bg-primary">
              Primary
            </ModalHeader>
            <ModalBody className="modal-dialog-centered  mt-1">
              <Col md="12" style={{width:"100%"}}>
                <Row>
                  <Col md="3" >
                    <Input type="number" name="ip" id="ip" placeholder=" "  min={0} max={255} 
                    onChange={e=>this.setState({ip1 : e.target.value > 255 ? 255 : parseInt(e.target.value)})} value = {this.state.ip1} required/>
                  </Col>
                  <Col md="3" >
                    <Input type="number" name="ip" id="ip1" placeholder=" " min={0} max={255}
                      onChange={e=>this.setState({ip2 : e.target.value > 255 ? 255 : parseInt(e.target.value)})}
                      value = {this.state.ip2}             required />
                  </Col>
                  <Col md="3" >
                    <Input type="number" name="ip" id="ip2" placeholder=" " min={0} max={255}
                      onChange={e=>this.setState({ip3 : e.target.value > 255 ? 255 : parseInt(e.target.value)})}
                      value = {this.state.ip3}   required />
                  </Col>
                  <Col md="3" >
                    <Input type="number" name="ip" id="ip3" placeholder=" "
                      onChange={e=>this.setState({ip4 : e.target.value > 255 ? 255 : parseInt(e.target.value)})}
                      value = {this.state.ip4} min={0} max={255} required />
                  </Col>
                </Row>
              </Col>
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
    dataList: state.tools.toolsgeoipblock
  }
}

export default connect(mapStateToProps, {   getData,filterData,menusave,  menudelete })(Child)