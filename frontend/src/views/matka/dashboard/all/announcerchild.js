import React, { Component } from "react"
import {  UncontrolledDropdown, DropdownMenu, DropdownToggle, DropdownItem, Col, Row } from "reactstrap"
import {  ChevronDown, ChevronLeft, ChevronRight } from "react-feather"
import {  get_bets_fromresultannouncer ,pagenations,create_result} from "../../../../redux/actions/matka/dashboard/regular"
import DataTable from "react-data-table-component"
import ReactPaginate from "react-paginate"
import { history } from "../../../../history"
import { connect } from "react-redux"
import {selectedStyle,pagenation_set} from "../../../../configs/providerconfig"
import Radio from "../../../../components/@vuexy/radio/RadioVuexy"
import confirm from "reactstrap-confirm"

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
      <Col md="3" className="color-white text-center align-items-center">
          <div className="mt-1 font-weight-bold">
              {props.bazaritem.bazaarname}
          </div>
      </Col>
    </Row>
  )
}

class Child extends Component {
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
    columns: [],
    allData: [],
    value: "",
    rowsPerPage: 10,
    sidebar: false,
    currentData: null,
    selected: [],
    totalRecords: 0,
    sortIndex: [],
    addNew: "",
  }

  componentDidMount(){
    this.props.get_bets_fromresultannouncer(this.props.parsedFilter,this.props.bazaritem, this.props.date,this.props.gamesdata);
  }

  handleFilter = e => {
    this.setState({ value: e.target.value })
    this.props.filterData(e.target.value)
  }

  handleRowsPerPage = value => {
    let { parsedFilter, pagenations,gamesdata,bazaritem,date } = this.props
    let page = parsedFilter.page !== undefined ? parsedFilter.page : 1
    history.push(`${history.location.pathname}?page=${page}&perPage=${value}`,{gamesdata,bazaritem,date})
    this.setState({ rowsPerPage: value })
    pagenations({ page: page, perPage: value },this.props.bool)
  }

  handlePagination = page => {
    let { parsedFilter, pagenations,gamesdata,bazaritem,date } = this.props
    let perPage = parsedFilter.perPage !== undefined ? parsedFilter.perPage : 10
    let urlPrefix = history.location.pathname
    history.push( `${urlPrefix}?page=${page.selected + 1}&perPage=${perPage}`,{gamesdata,bazaritem,date} )
    pagenations({ page: page.selected + 1, perPage: perPage },this.props.bool)
    this.setState({ currentPage: page.selected })
  }

  Select_bazar = async row =>{
    
    let res =  await confirm();
    if(res){
      // let user = this.props.user;
      // let baza = this.props.bazaritem.bazaritem;
      // let result = (row.result).split("-");
      // row = Object.assign({},{createdby : user._id},{resultdate : this.props.date},{bazaarid :baza._id},{openresult : result[0]},{closeresult :result[2]},{jodiresult:result[1]});
      // this.props.create_result(row);
    }

  }

  getColumns = (games) => {
    let rows = [
      {
        name: "select",
        selector: "select",
        sortable: false,
        minWidth: "50px",
        cell : row =>(
            <div onClick={()=>this.Select_bazar(row)}>
                <Radio  label="" name="exampleRadio" />
            </div>
        ),
      },
      {
        name: "Result",
        selector: "result",
        sortable: false,
        minWidth: "150px",
      },

    ];
    for (var i in games) {
      rows.push({
          name: games[i].name,
          selector: games[i]._id,
          sortable: false,
          minWidth: "110px",
 
      })
    }

    rows.push({
      name: "totalprofit",
      selector: "totalprofit",
      sortable: false,
      minWidth: "110px",
    })

    return rows;
  }

  render() {
    let {  data, allData,totalPages, value, rowsPerPage, totalRecords, sortIndex } = this.state;
    let columns = this.getColumns(this.props.gamesdata);

    return (
      <div  id="admindata_table"  className={`data-list list-view`}>
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
              bazaritem = {this.props.bazaritem}
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
    dataList: state.matka.announcer,
  }
}

export default connect(mapStateToProps, {get_bets_fromresultannouncer,pagenations,create_result})(Child)