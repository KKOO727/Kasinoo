import React, { Component } from "react"
import {UncontrolledDropdown,  DropdownMenu,  DropdownToggle, DropdownItem,Col,Row,FormGroup,Label,Input} from "reactstrap"
import DataTable from "react-data-table-component"
import ReactPaginate from "react-paginate"
import { history } from "../../../history"
import {  ChevronDown,  ChevronLeft,  ChevronRight} from "react-feather"
import { connect } from "react-redux"
import {  getData,getTotal} from "../../../redux/actions/Players/balance_history/index"
import {selectedStyle,pagenation_set} from "../../../configs/providerconfig"
import {Root} from "../../../authServices/rootconfig"
import Datepicker from "../../lib/datepicker"
import Select from "react-select"
import {dateConvert} from "../../../redux/actions/auth"
const prefix = Root.prefix;

const FilterComponent = props =>{
  let useroptions = props.dataList.toptbl && props.dataList.toptbl.useroptions && props.dataList.toptbl.useroptions.length > 0 ? props.dataList.toptbl.useroptions : [];
  let statusoptions = props.dataList.toptbl && props.dataList.toptbl.statusoptions && props.dataList.toptbl.statusoptions.length > 0 ? props.dataList.toptbl.statusoptions : [];
  return (
    <Row className="mb-1">
      <Col  md='6' sm='12' xs='12'>
        <FormGroup>
          <Label for="Registration Date">Select Date</Label> 
          <Datepicker  onChange={date => { props.datechange([date.start,date.end],"dates") }} />
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

      <Col md='3' sm='6' xs='12'>
        <FormGroup>
          <Label for="user">status</Label>
          <Select className="React" classNamePrefix="select" name="players" 
            options={statusoptions}
            value={statusoptions.find(obj => obj.value === props.filters.status)}
            onChange={e => props.handleFilter(e.value,"status")}
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
            name: "id",
            selector: "id",
            sortable: true,
            minWidth: "50px",
            cell: row => (
              <div className="textstyle">
              { prefix + row.userid.signup_device} {"-"}{row.userid.fakeid}
            </div>
            )
          },
          {
            name: "username",
            selector: "username",
            sortable: true,
            minWidth: "100px",
            cell: row => (
              <>
                  {row.userid.username }
              </>
            )
          },
          {
              name: "email",
              selector: "email",
              sortable: true,
              minWidth: "220px",
              cell: row => (
                <>
                  {row.userid.email }
                </>
              )
          },
          {
            name: "MObileNumber",
            selector: "id",
            sortable: true,
            minWidth: "50px",
            cell: row => (
              <>
                {row.userid.mobilenumber ? row.userid.mobilenumber : ""}
              </>
            )
          },
           
            {
              name: "paymentType",
              selector: "type",
              sortable: true,
              minWidth: "100px",
            },
            {
              name: "status",
              selector: "status",
              sortable: true,
              minWidth: "100px",
            },
            {
              name: "comment",
              selector: "comment",
              sortable: false,
              minWidth: "100px",
              cell : row=>(
                <Input type="textarea" disabled={true} value={row.comment} />
              )
            },
            {             
              name: "TYPE",
              selector: "wallettype",
              sortable: true,
              minWidth: "50px",
              cell: row => (
                <div>
                  { row.wallettype}

                </div>
              )
            },
            {                
              name: "Createdby",
              selector: "cemail",
              sortable: true,
              minWidth: "100px",
              cell : row => (
                <div>
                    {row.resultData && row.resultData.createdby ? row.resultData.createdby : ""}
                </div>
              )
            },
            {
              name: "amount",
              selector: "amount",
              sortable: true,
              minWidth: "100px",
            },
            {
              name: "lastbalance",
              selector: "lastbalance",
              sortable: true,
              minWidth: "100px",
            },
            {
              name: "updatedbalance",
              selector: "updatedbalance",
              sortable: true,
              minWidth: "100px",
            },
            {
              name : "date",
              selector : "date",
              sortable: true,
              minWidth: "100px",
              cell : row => (
                <div>
                  {dateConvert(row.createDate)}
                </div>
              )
            }, 
            {
              name: "Transactionid",
              selector: "order_no",
              sortable: true,
              minWidth: "100px",
            },
        ],
        filters : {
          dates:[(new Date()),new Date().valueOf()+24 * 60 * 60 * 1000],
          "playerid" : "",
          bool : this.props.bool,
          status : ""
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
    }

    datechange = (value) =>{
      let filters = this.state.filters;
      filters["dates"] = value;
      this.setState({filters : filters});
      this.props.getTotal(filters);
      this.props.getData(this.props.parsedFilter,filters);
    }

  render() {
    let { columns,data,totalPages} = this.state;
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
  return { dataList: state.Players.balance_history }
}

export default connect(mapStateToProps, {getData,getTotal })(ListViewConfig)