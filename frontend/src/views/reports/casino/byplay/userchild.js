import React, { Component } from "react"
import {UncontrolledDropdown,  DropdownMenu,  DropdownToggle,  DropdownItem,Col,Row,FormGroup,Label,Table} from "reactstrap"
import DataTable from "react-data-table-component"
import ReactPaginate from "react-paginate"
import { history } from "../../../../history"
import { ChevronDown,  ChevronLeft,  ChevronRight} from "react-feather"
import { connect } from "react-redux"
import {getData,getTotal} from "../../../../redux/actions/reports/casino/casinoplayerId"
import {pagenation_set,selectedStyle} from "../../../../configs/providerconfig"
import Select from "react-select"
import Datepicker from "../../../lib/datepicker"
import {Root} from "../../../../authServices/rootconfig"
const prefix = Root.prefix;

const FilterComponent = props =>{
  let useroptions = props.dataList.toptbl && props.dataList.toptbl.useroptions && props.dataList.toptbl.useroptions.length > 0 ? props.dataList.toptbl.useroptions : [];

  return (
    <Row className="mb-1">
      <Col  md='6' sm='12' xs='12'>
        <FormGroup>
          <Label for="Registration Date">Select Date</Label> 
          <Datepicker  onChange={date => { props.datechange(date,"dates") }} />
        </FormGroup>
      </Col>
      
      <Col md='3' sm='6' xs='12'>
        <FormGroup>
          <Label for="user">players</Label>
          <Select className="React" classNamePrefix="select" name="players" 
            options={useroptions}
            value={useroptions.find(obj => obj.value === props.filters.playerid)}
            onChange={e => props.handleFilter(e.value,"playerid")}
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
      <Col md="12">
      <Table bordered responsive>
      <thead>
            <tr>
              <th>Currency</th>
              <th>Sign up</th>
              <th>Total BET Amount</th>
              <th>Total Payoff</th>
              <th>Net (win/loss)</th>
              <th>Real Players</th>
            </tr>
          </thead>
          <tbody> 
            <tr>
              <td>INR</td>
              <td>
              {props.dataList.toptbl ? props.dataList.toptbl.signupcount : 0}
              </td>
              <td>
              {props.dataList.toptbl ? props.dataList.toptbl.totalbet : 0}
              </td>
              <td>
              {props.dataList.toptbl ? props.dataList.toptbl.totalwin : 0}
              </td>
              <td>
              {props.dataList.toptbl ? props.dataList.toptbl.totalggr : 0}
              </td>
              <td>
              {props.dataList.toptbl ? props.dataList.toptbl.realplayerscount : 0}
              </td>
            </tr>
          </tbody>
      </Table>
      </Col>
      <Col xs='6' className='justify-content-start align-items-center flex' md="3">
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
    </Row>
  </div>
  )
}

class ListViewConfig extends Component {
    state = {
        data: [],
        columns: [
          {
            name : "PlayerID",
            selector : "fakeid",
            sortable: true,
            minWidth: "150px",
            cell: row => (
              <div className="">
              { prefix + row.signup_device} {"-"}{row.fakeid}
            </div>
            )
          },
          {
            name : "Currency",
            selector : "Currency",
            sortable: true,
            minWidth: "100px",
            cell : row =>(
              <>
              {row.Currency? row.Currency : "INR"}
            </>
            )
          },
          {
            name : "WIN",
            selector : "WIN",
            sortable: true,
            minWidth: "100px",
          },
          {
            name : "BET",
            selector : "BET",
            sortable: true,
            minWidth: "100px",
          },
          {
            name : "GGR",
            selector : "GGR",
            sortable: true,
            minWidth: "100px",
          },
          // {
          //   name : "WIN RAKE",
          //   selector : "",
          //   sortable: true,
          //   minWidth: "100px",
          // },
          // {
          //   name : "BET RAKE",
          //   selector : "",
          //   sortable: true,
          //   minWidth: "100px",
          // },
          {
            name : "userName",
            selector : "username",
            sortable: true,
            minWidth: "100px",
          },
          
        ],
        filters : {
          dates:{
            start : (new Date()),
            end : new Date(new Date().valueOf() + 60 * 60 * 1000 * 24)
          },
          playerid : "",
        },
    }

    componentDidMount(){
      this.props.getTotal(this.state.filters)
      this.props.getData(this.props.parsedFilter,this.state.filters)
    }

    handlePagination = page => {
      let { parsedFilter, getData } = this.props;
      let perPage = parsedFilter.perPage !== undefined ? parsedFilter.perPage : pagenation_set[0];
      let urlPrefix =`${history.location.pathname}`;
      history.push( `${urlPrefix}?page=${page.selected + 1}&perPage=${perPage}`);
      var params = { page: page.selected + 1, perPage: perPage };
      getData(params,this.state.filters);
    }

    componentDidUpdate(preveProps,prevState){
      if(preveProps.dataList !== this.props.dataList){
        let datalist = this.props.dataList;
        this.setState({
          data : datalist.data,
          totalPages: datalist.totalPages,
        })
      }
    }

    handleRowsPerPage = value => {
      let { parsedFilter, getData } = this.props
      let page = parsedFilter.page !== undefined ? parsedFilter.page : 1;
      history.push(`${history.location.pathname}?page=${page}&perPage=${value}`)
      var params = { page: page, perPage: value };
      getData(params,this.state.filters);
    }

    handleFilter = (value,bool) => {
      let filters = this.state.filters;
      filters[bool] = value;
      this.setState({filters : filters});
      this.props.getData(this.props.parsedFilter,filters);
      this.props.getTotal(this.state.filters);

    }

    datechange = (value) =>{
      let filters = this.state.filters;
      filters["dates"] = value;
      this.setState({filters : filters});
      this.props.getTotal(filters);
      this.props.getData(this.props.parsedFilter,filters);
    }
  render() {
    let { columns,data,totalPages} = this.state
    return (
      <>
      <FilterComponent 
          handleFilter={this.handleFilter}
          dataList={this.props.dataList}
          datechange={this.datechange}
          filters = {this.state.filters}
        />
      <div id="admindata_table" className={`data-list list-view`}>
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
                forcePage={   this.props.parsedFilter.page? parseInt(this.props.parsedFilter.page - 1): 0}
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
              />
          }
          sortIcon={<ChevronDown />}
        />
      </div>
      </>
    )
  }
}

const mapStateToProps = state => {
  return {
    dataList: state.Reports.reportscasinoplayerid
  }
}

export default connect(mapStateToProps, {getData,getTotal})(ListViewConfig)
