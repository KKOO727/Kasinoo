import React, { Component } from "react"
import {UncontrolledDropdown,  DropdownMenu,  DropdownToggle,DropdownItem,Col,Row, Label
} from "reactstrap"
import DataTable from "react-data-table-component"
import ReactPaginate from "react-paginate"
import { history } from "../../../history"
import { ChevronDown,  ChevronLeft,  ChevronRight} from "react-feather"
import { connect } from "react-redux"
import {selectedStyle,pagenation_set} from "../../../configs/providerconfig"
import {get_accountStatement} from "../../../redux/actions/profileinfo"
import {Badge} from "reactstrap"
import Datepicker from "../../lib/datepicker"
import {dateConvert} from "../../../redux/actions/auth"


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
        <Col  md='6' sm='12' xs='12'>
                <Label for="Registration Date">Select Date</Label> 
                <Datepicker  onChange={date => { props.datechange(date) }} />
        </Col>
         
    </Row>
  </div>
  )
}

class AccountStatement extends Component {

    state = {
        data: [],
        columns: [
            {
                name: "PROVIDERID",
                selector: "PROVIDERID",
                sortable: true,
                minWidth:  "100px",
            },
            {
                name: "TYPE",
                selector: "TYPE",
                sortable: true,
                minWidth:  "100px",
                
            }, 
            {
                name: "NAME",
                selector: "NAME",
                sortable: true,
                minWidth:  "100px",
                
            },
            {
                name: "roundid",
                selector: "roundid",
                sortable: true,
                minWidth:  "100px",
            }, 
            {
                name: "status",
                selector: "status",
                sortable: true,
                minWidth:  "100px",
                cell : row =>(
                    <Badge pill color={row.status==='BET' || row.status === "WITHDRAWl"?'danger':'success'}>{row.status}</Badge>
                )
            }, 
            {
                name: "credited",
                selector: "credited",
                sortable: true,
                minWidth:  "50px",
                cell : row =>(
                    <div>
                        {parseInt(row.credited)}
                    </div>
                )
            }, 
            {
                name: "debited",
                selector: "debited",
                sortable: true,
                minWidth:  "50px",
                cell : row =>(
                    <div>
                        {parseInt(row.debited)}
                    </div>
                )
            }, 
            {
                name: "commission",
                selector: "commission",
                sortable: true,
                minWidth:  "50px",
            }, 
            {
                name: "lastbalance",
                selector: "lastbalance",
                sortable: true,
                minWidth:  "100px",
                cell : row =>(
                    <div>
                        {parseInt(row.lastbalance)}
                    </div>
                )
            }, 
            {
                name: "updatedbalance",
                selector: "updatedbalance",
                sortable: true,
                minWidth:  "100px",
                cell : row =>(
                    <div>
                        {parseInt(row.updatedbalance)}
                    </div>
                )
            }, 
            {
                name: "updated",
                selector: "updated",
                sortable: true,
                cell: row => (
                    <span>
                        {dateConvert(row.updated)}
                    </span>
                )
            },
            
        ],
        date : {
            start : new Date().toString(),
            end : new Date(new Date().valueOf() + 24 * 60 * 60 * 1000).toString(),
        }
    }

    componentDidMount(){
        this.props.get_accountStatement(this.state.date,this.props.user,this.props.parsedFilter)
    }

   

    handlePagination = page => {
      let { parsedFilter, get_accountStatement } = this.props;
      let perPage = parsedFilter.perPage !== undefined ? parsedFilter.perPage : pagenation_set[0];
      let urlPrefix =`${history.location.pathname}`;
      let row = this.props.user;
      history.push( `${urlPrefix}?page=${page.selected + 1}&perPage=${perPage}`,row);
      var params = { page: page.selected + 1, perPage: perPage };
      get_accountStatement(this.state.date,this.props.user,params);
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
      let { parsedFilter, get_accountStatement } = this.props
      let page = parsedFilter.page !== undefined ? parsedFilter.page : 1;
      let row = this.props.user;
      history.push(`${history.location.pathname}?page=${page}&perPage=${value}`,row)
      var params = { page: page, perPage: value };
      get_accountStatement(this.state.date,this.props.user,params);
    }

    change = (e) => {
        console.log(e,this)
        this.setState({date : e});
        this.props.get_accountStatement(e,this.props.user,this.props.parsedFilter)
    }


    render() {
    let { columns,data,totalPages} = this.state
    return (
      <React.Fragment>
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
                datechange={(e)=>this.change(e)}
                add={()=>this.setState({modal : !this.state.modal , update : false , type : "" , accountName : ""})}
              />
            }
            sortIcon={<ChevronDown />}
          />
        </div>

        
      </React.Fragment>
    )
  }
}

const mapStateToProps = (state) => ({
    dataList :  state.profileinfo.accountstatement
})

const mapDispatchToProps = {
    get_accountStatement
}

export default connect(mapStateToProps, mapDispatchToProps)(AccountStatement)

