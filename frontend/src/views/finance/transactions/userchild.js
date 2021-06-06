import React, { Component } from "react"
import {UncontrolledDropdown,  DropdownMenu,  DropdownToggle,  DropdownItem,Col,Row,FormGroup,Label,Input} from "reactstrap"
import DataTable from "react-data-table-component"
import ReactPaginate from "react-paginate"
import { history } from "../../../history"
import { ChevronDown,  ChevronLeft,  ChevronRight} from "react-feather"
import { connect } from "react-redux"
import {  getData,getTotal} from "../../../redux/actions/finance/index"
import {Payment_options} from "../../../configs/providerconfig"
import Select from "react-select"
import {selectedStyle,pagenation_set} from "../../../configs/providerconfig"
import DatePicker from "../../lib/datepicker"
import {Root} from "../../../authServices/rootconfig"
import {dateConvert} from "../../../redux/actions/auth"

const prefix = Root.prefix;

const CustomHeader = props => {
  let {totalRecords,sortIndex} = props.dataList;
  let state = props.filters;
  let useroptions = props.dataList.useroptions;
  let statusoptions = props.dataList.statusoptions;
  return (
    <div className='p-1 pt-2 pb-2'>
      <Row>
        <Col  md='6' sm='12' xs='12'>
          <FormGroup>
            <Label for="Registration Date"> Date</Label>
            <DatePicker onChange={date => { props.handleFilter(date,"dates") }}
            />
          </FormGroup>
        </Col>
        <Col  md='3' sm='6' xs='12'>
          <FormGroup>
            <Label for="username">username</Label>
            <Select className="React"
              classNamePrefix="select"
              id="username"
              name="username"
              options={useroptions}
              value={useroptions.find(obj => obj.value === state.userid)}
              onChange={e => props.handleFilter(e.value,"userid")}
            />
          </FormGroup>
        </Col>
        <Col  md='3' sm='6' xs='12'>
          <FormGroup>
            <Label for="Payment Type">Payment Type</Label>   
            <Select
              className="React"
              classNamePrefix="select"
              id="Payment Type"
              name="Payment Type"
              options={Payment_options}
              value={Payment_options.find(obj => obj.value === state.wallettype)}
              onChange={e => props.handleFilter(e.value,"wallettype")}

            />
          </FormGroup>
        </Col>
        <Col  md='3' sm='6' xs='12'>
          <FormGroup>
            <Label for="Payment Type">status</Label>   
            <Select
              className="React"
              classNamePrefix="select"
              id="status"
              name="status"
              options={statusoptions}
              value={statusoptions.find(obj => obj.value === state.status)}
              onChange={e => props.handleFilter(e.value,"status")}

            />
          </FormGroup>
        </Col>
      </Row>
      <Row>
        <Col xs='6' className='justify-content-start align-items-center flex mt-1' md="3">
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
            minWidth: "100px",
            cell: row => (
              <div className="textstyle">
                {prefix} {row.userid.signup_device ? row.userid.signup_device : "" } - {row.userid.fakeid}
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
                {row.userid.username ? row.userid.username : ""}
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
                  {row.userid.email ? row.userid.email : ""}
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
            name: "amounttype",
            selector: "wallettype",
            minWidth:  "150px",
            sortable: true,
          },
          
          {
            name: "status",
            selector: "status",
            minWidth:  "100px",
            sortable: true
          },
          {
            name: "Comment",
            selector: "type",
            sortable: true,
            minWidth:  "100px",
            cell : row =>(
              <div>
                <Input type="textarea" value={row.comment ? row.comment : "comment"} disabled={true} />
              </div>
            )
          },
          {
            name: "paymentType",
            minWidth:  "100px",
            selector: "type",
            sortable: true,
          },
       
          {
            name: "amount",
            selector: "amount",
            minWidth:  "100px",
            sortable: true,
          },
          {
            minWidth:  "100px",
            name: "lastbalance",
            selector: "lastbalance",
            sortable: true,
            cell : row =>(
              <div>
                {parseInt(row.lastbalance)}
              </div>
            )
          },
          {
            name: "updatedbalance",
            minWidth:  "100px",
            selector: "updatedbalance",
            sortable: true,
            cell : row =>(
              <div>
                {parseInt(row.updatedbalance)}
              </div>
            )
          },
          {
            name: "createDate",
            minWidth:  "100px",
            selector: "createDate",
            sortable: true,
            cell: row => (
                <span>
                  {dateConvert(row.createDate)}
                </span>
            )
          },
        ],
        filters : {
          dates:{
           start :  new Date(),
           end :new Date( new Date().valueOf() + 60 * 60 * 24 * 1000)
          },
          userid : "",
          wallettype : "",
          status : ""
        }
    }

    componentDidMount(){
      this.props.getData(this.props.parsedFilter,this.state.filters);
      this.props.getTotal(this.state.filters)
    }


    handleFilter = (value,bool) => {
      var filters = this.state.filters;
      filters[bool] = value;
      this.setState({ filters: filters });
      if (bool === "dates") {
        this.props.getTotal(filters)
      }
      this.props.getData(this.props.parsedFilter,filters)
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

  render() {
    let { columns, data ,totalPages, } = this.state
    return (
      <>
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
          customStyles={selectedStyle}
          subHeaderComponent={
            <CustomHeader
              handleFilter={this.handleFilter}
              handleRowsPerPage={this.handleRowsPerPage}
              parsedFilter={this.props.parsedFilter}
              dataList={this.props.dataList}
              filters={this.state.filters}
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
    dataList: state.finance.finance
  }
}

export default connect(mapStateToProps, { getData,getTotal })(ListViewConfig)
