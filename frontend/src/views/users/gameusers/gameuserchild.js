import React, { Component } from "react"
import DataTable from "react-data-table-component"
import ReactPaginate from "react-paginate"
import { history } from "../../../history"
import { connect } from "react-redux"
import {  ChevronDown,  ChevronLeft,  ChevronRight,Trash} from "react-feather"
import {  getData,  filterData,deleteRow,pagenationchange} from "../../../redux/actions/user/gamesession/index"
import {selectedStyle,pagenation_set} from "../../../configs/providerconfig"
import {UncontrolledDropdown,  DropdownMenu,  DropdownToggle, Button, DropdownItem,Col,Row} from "reactstrap"
import Flatpickr from "react-flatpickr";

const ActionsComponent = props => {
  return (
    <div className="data-list-action">
      <Trash className="cursor-pointer" size={20} onClick={() => { props.deleteRow(props.row,props.parsedFilter) }} />
    </div>
  )
}

const CustomHeader = props => {
  let {count} = props.dataList

  return (
    <Row className="p-1">
      <Col xs="6" md="2">
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
          <div className="mt-1">
            Web Logins : {count ? count.webindex : 0}
          </div>
      </Col>
      <Col xs="6" md="2">
          <div className="mt-1">
            App Logins : {count ? count.appindex : 0}
          </div>
      </Col>
      <Col  xs='6' md='3'>
            <Flatpickr 
              value={props.state.date}
              className="form-control mt-1"
              options={{  mode: "range"  }}
              onChange={date => {
                props.handleFilter(date)
              }}
            />
        </Col>
      {/* <Col xs="6" md="2">
        <div className="filter-section mb-1 mt-1">
          <Input type="text" className="border-white" onChange={e => props.handleFilter(e)} />
        </div>
      </Col> */}
      <Col xs="6" md="2" >
        <Button color="success" className="mt-1" onClick={()=>props.reloaddataall(props.parsedFilter)}>
          RefreshAllData
        </Button>
      </Col>     
    </Row>
  )
}

class ListViewConfig extends Component {
    static getDerivedStateFromProps(props, state) {
      if ( props.dataList.data.length !== state.data.length || state.currentPage !== props.parsedFilter.page ) {
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
              name: "email",
              selector: "email",
              sortable: true,
              minWidth: "220px",
          },
          {
              name: "firstname",
              selector: "firstname",
              sortable: true,
              minWidth: "10px",
          },
          {
              name: "lastname",
              selector: "lastname",
              sortable: true,
              minWidth: "100px",
          },
          {
            name: "username",
            selector: "username",
            sortable: true,
            minWidth: "100px",
          },
          {
              name: "token",
              selector: "token",
              sortable: true,
              minWidth: "100px",
            },
            {
              name: "Actions",
              minWidth: "50",
              sortable: true,
              cell: row => (
                <ActionsComponent
                  row={row}
                  getData={this.props.getData}
                  deleteRow={this.props.deleteRow}
              parsedFilter={this.props.parsedFilter}
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
        date : [new Date(),new Date(new Date().valueOf() + 60 * 60 * 24* 1000)]
    }

    componentDidMount() {
      this.props.getData(this.props.parsedFilter,this.state.date)
    }

    handleFilter = e => {
      this.setState({ date: e });
      this.props.getData(this.props.parsedFilter,this.state.date)
      // this.props.filterData(e.target.value)
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
      let urlPrefix =`${history.location.pathname}`
      history.push(`${urlPrefix}?page=${page.selected + 1}&perPage=${perPage}`)
      pagenationchange({ page: page.selected + 1, perPage: perPage })
      this.setState({ currentPage: page.selected })
    }

  render() {
    let { columns,data,allData,totalPages,value,rowsPerPage,totalRecords,sortIndex } = this.state
    return (
      <div id="admindata_table" className={`data-list list-view`}>
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
              forcePage={ this.props.parsedFilter.page ? parseInt(this.props.parsedFilter.page - 1) : 0 }
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
              {...this.props}
              {...this}
              reloaddataall={this.props.getData}
              parsedFilter={this.props.parsedFilter}
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
    dataList: state.userslist.sessionusers
  }
}

export default connect(mapStateToProps, {getData,filterData,deleteRow,pagenationchange})(ListViewConfig)