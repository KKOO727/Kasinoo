import React, { Component } from "react"
import {UncontrolledDropdown,  DropdownMenu,  DropdownToggle,  DropdownItem,Col,Row,FormGroup,Label,Table} from "reactstrap"
import DataTable from "react-data-table-component"
import ReactPaginate from "react-paginate"
import { history } from "../../../../history"
import { ChevronDown,  ChevronLeft,  ChevronRight} from "react-feather"
import { connect } from "react-redux"
import {  getData,getTotal} from "../../../../redux/actions/reports/sports/bet"
import {selectedStyle,pagenation_set} from "../../../../configs/providerconfig"
import Select from "react-select"
import Datepicker from "../../../lib/datepicker"
import {dateConvert} from "../../../../redux/actions/auth"

const FilterComponent = props =>{

  let useoptions = props.dataList.toptbl && props.dataList.toptbl.useoptions && props.dataList.toptbl.useoptions.length > 0 ? props.dataList.toptbl.useoptions : [];
  
  return (
    <Row>
      <Col  md='6' sm='12' xs='12'>
        <FormGroup>
          <Label for="Registration Date">Select Date</Label> 
          <Datepicker  onChange={date => { props.datechange(date,"dates") }} />
        </FormGroup>
      </Col>

      <Col md='3' sm='6' xs='12'>
        <FormGroup>
          <Label for="user">User Name</Label>
          <Select className="React" classNamePrefix="select" name="userid" 
            options={useoptions}
            value={useoptions.find(obj => obj.value === props.filters.userid)}
            onChange={e => props.handleFilter(e.value,"userid")}
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
          name : "username",
          selector : "userid.username",
          sortable: true,
          minWidth: "100px",
          cell : row =>(
            <div className="">  
            {

            }
            {row.USERID.username? row.USERID.username : ""}
            </div>
          )
        },
        {
          name : "SportsType",
          selector : "gameid.NAME",
          sortable: true,
          minWidth: "50px",
          cell : row =>(
            <div >
            {row.gameid.sport_name? row.gameid.sport_name : ""}
          </div>
          )
        },
        {
          name : "MatchName",
          selector : "gameid.NAME",
          sortable: true,
          minWidth: "50px",
          cell : row =>(
            <div >
            {row.betting.MatchName? row.betting.MatchName : ""}
          </div>
          )
        },
        {
          name : "MarketName",
          selector : "gameid.NAME",
          sortable: true,
          minWidth: "50px",
          cell : row =>(
            <div >
            {row.betting.MarketName? row.betting.MarketName : ""}
          </div>
          )
        },
        {
          name : "OutcomeName",
          selector : "gameid.NAME",
          sortable: true,
          minWidth: "50px",
          cell : row =>(
            <div >
            {row.betting.OutcomeName? row.betting.OutcomeName : ""}
          </div>
          )
        },
        {
          name : "Type",
          selector : "TYPE",
          sortable: true,
          minWidth: "100px",
        },
        {
          name : "AMOUNT",
          selector : "AMOUNT",
          sortable: true,
          minWidth: "100px",
        },
        {
          name : "Currency",
          selector : "Currency",
          sortable: true,
          minWidth: "50px",
          cell : row =>(
            <>
            {row.Currency? row.Currency : "INR"}
          </>
          )
        },
        {
          name : "DATE",
          selector : "DATE",
          sortable: true,
          minWidth: "100px",
          cell : row =>(
            <>
             {dateConvert(row.DATE)}
          </>
          )
        },
        
      ],
      filters : {
        dates:{
          start : new Date(),
          end : new Date(new Date().valueOf() + 60 * 60 * 1000 * 24)
        },
        userid : ""
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
      <React.Fragment>
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
    dataList: state.Reports.sportsbets
  }
}

export default connect(mapStateToProps, { getData,getTotal})(ListViewConfig)
