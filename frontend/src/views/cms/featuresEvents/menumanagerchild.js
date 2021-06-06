import React, { Component } from "react"
import {UncontrolledDropdown,  DropdownMenu,  DropdownToggle,  DropdownItem,Col,Row} from "reactstrap"
import DataTable from "react-data-table-component"
import ReactPaginate from "react-paginate"
import { history } from "../../../history"
import { ChevronDown,  ChevronLeft,  ChevronRight,Trash} from "react-feather"
import { connect } from "react-redux"
import {  getData, menudelete } from "../../../redux/actions/CMS/featuresEvents/index"
import {selectedStyle,pagenation_set} from "../../../configs/providerconfig"

const ActionsComponent = props => {
  return (
    <div className="data-list-action">
      
        <Trash
         className="cursor-pointer mr-1"
         size={20}
         onClick={()=>props.rowDelete(props.row,props.parsedFilter)}
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
            name: "event_name",
            selector: "event_name",
            sortable: false,
            minWidth: "200px",
          },
          {
            name: "AwayCompetitor",
            selector: "AwayCompetitor",
            sortable: false,
            minWidth: "200px",
           
          },
          {
            name: "EventStatus",
            selector: "EventStatus",
            sortable: false,
            minWidth: "100px",
           
          },
          {
            name: "ScheduledTime",
            selector: "ScheduledTime",
            sortable: false,
            minWidth: "200px",
           
          },
          {
            name: "HomeCompetitor",
            selector: "HomeCompetitor",
            sortable: false,
            minWidth: "200px",
           
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
              
                rowDelete={this.props.menudelete}
                add ={this.add}
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
        icon : "",
        text : "",
        update : false,
        rowid : "",
        isChecked : false,
        tooltipOpen : false
    }

    componentDidMount(){
      this.props.getData(this.props.parsedFilter,)
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
        getData({ page: page, perPage: value },)
    }

    handlePagination = page => {
        let { parsedFilter, getData } = this.props
        let perPage = parsedFilter.perPage !== undefined ? parsedFilter.perPage : 10
        let urlPrefix = history.location.pathname
        history.push(`${urlPrefix}?page=${page.selected + 1}&perPage=${perPage}`)
        getData({ page: page.selected + 1, perPage: perPage },)
        this.setState({ currentPage: page.selected })
    }

    
    

  render() {
    let { columns, data,allData,totalPages,value,rowsPerPage,totalRecords,sortIndex} = this.state
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
    dataList: state.cms.featuresEvent
  }
}

export default connect(mapStateToProps, {
    getData,
    menudelete
})(Child)