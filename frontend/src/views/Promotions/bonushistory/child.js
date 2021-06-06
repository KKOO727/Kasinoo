import React, { Component } from "react"
import {UncontrolledDropdown,  DropdownMenu,  DropdownToggle,DropdownItem,Col,Row, Badge, FormGroup,Label,Button
} from "reactstrap"
import DataTable from "react-data-table-component"
import ReactPaginate from "react-paginate"
import { history } from "../../../history"
import { ChevronDown,  ChevronLeft,  ChevronRight,} from "react-feather"
import { connect } from "react-redux"
import {  getData,getTotal, bonusCredit } from "../../../redux/actions/promotions/bonushistory"
import {selectedStyle,pagenation_set,} from "../../../configs/providerconfig"
import {Root,} from "../../../authServices/rootconfig"
import DatePicker from "../../lib/datepicker"
import Select from "react-select"
import { dateConvert} from "../../../redux/actions/auth"
const prefix = Root.prefix


const CustomHeader = props => {
  let {totalRecords,sortIndex} = props.dataList;
  console.log(props)
  let useroptions = props.dataList.useroptions
  let bonusoptions = props.dataList.bonusoptions;
  let state =props.filters
  return (
    <div className='p-1 pt-2 pb-2'>
    <Row>
        <Col md='3' className='justify-content-start align-items-center flex'>
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

        <Col  md='3' sm='12' xs='12'>
          <FormGroup>
            <Label for="Registration Date"> Date</Label>
            <DatePicker onChange={date => { props.handleFilter(date,"dates") }}
            />
          </FormGroup>
        </Col>

        <Col md="3" className='justify-content-start align-items-center flex'>
          <Label>useroptions</Label>
          <Select
            value={ useroptions ?  useroptions.find(obj=>obj.value === state.userid) : []}
            options={useroptions}
            onChange={e =>props.handleFilter(e.value , "userid")}
            className="React"
            classNamePrefix="select"
          />
        </Col>
        <Col md="3" className='justify-content-start align-items-center flex'>
          <Label>bonusoptions</Label>
          <Select
            value={ bonusoptions ?  bonusoptions.find(obj=>obj.value === state.bonusid) : []}
            options={bonusoptions}
            onChange={e =>props.handleFilter(e.value, "userid")}
            className="React"
            classNamePrefix="select"
          />
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
          name : "status",
          selector : "status",
          sortable: true,
          minWidth: "200px",
          cell : row => (
            <div>
              {
                 row.accept ? 
                  <Button.Ripple className="round" color="flat-success"  onClick={()=>this.BonusCredit(row)}>
                    Credit
                  </Button.Ripple>
                  :
                <Badge
                  color={ row.status === "1" ? "light-success" : row.status === "0" ? "light-warning" : "light-danger"} pill>
                  {row.status === "1" ? "Received" : row.status === "0" ? "Pending" : "Reject"}
              </Badge>
              }
            </div>
          )
        },
        {
          name : "userid",
          selector : "email",
          sortable: true,
          minWidth: "150px",
          cell : row => (
            <div className="">
               {prefix}-{row.userid ? row.userid.fakeid : ""}
            </div>
          )
        },
        {
          name : "username",
          selector : "email",
          sortable: true,
          minWidth: "150px",
          cell : row => (
            <div className="">
              {row.userid ? row.userid.username : ""}
            </div>
          )
        },
        
        {
          name : "Bonusname",
          selector : "Bonusname",
          sortable: true,
          minWidth: "100px",
          cell : row => (
            <div className="textstyle">
              {row.bonusid ? row.bonusid.Bonusname : ""}
            </div>
          )
        },
        {
          name : "Deposit",
          selector : "walletbalance",
          sortable: true,
          minWidth: "100px",
        },
       
        {
          name : "Last Bonus Balance ",
          selector : "lastbalance",
          sortable: true,
          minWidth: "100px",
        },
        {
          name : "Updated Bonus Balance",
          selector : "updatedbalance",
          sortable: true,
          minWidth: "100px",
        },
        {
          name : "Target Amount ",
          selector : "amount",
          sortable: true,
          minWidth: "100px",
          cell : row => (
            <div className="textstyle">
              {row.bonusid ? row.bonusid.wager * row.amount : ""}
            </div>
          )
        },
        {
          name : "Achived Amount ",
          selector : "Achivedamount",
          sortable: true,
          minWidth: "100px",
        },
        {
          name : "wager",
          selector : "Bonusname",
          sortable: true,
          minWidth: "15px",
          cell : row => (
            <div className="textstyle">
              {row.bonusid ? row.bonusid.wager : ""}
            </div>
          )
        },
        {
          name : "createdAt",
          selector : "createdAt",
          sortable: true,
          minWidth: "100px",
          cell: row => (
            <span>
                {dateConvert(row.createdAt)} 
            </span>
        )
        },
        {
          name : "expiredAt",
          selector : "expiredAt",
          sortable: true,
          minWidth: "100px",
          cell: row => (
            <span>
                {dateConvert(row.expiredAt)} 
            </span>
        )
        },
       
      ],
      filters : {
        userid : "",
        bonusid : "",
        dates:{
          start :  new Date(),
          end :new Date( new Date().valueOf() + 60 * 60 * 24 * 1000)
         },
      }
    }

    componentDidMount(){
      this.props.getData(this.props.parsedFilter,this.state.filters)
      this.props.getTotal(this.state.filters)
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
          useroptions : datalist.useroptions,
          bonusoptions  : datalist.bonusoptions
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
      var filters = this.state.filters;
      filters[bool] = value;
      this.setState({ filters: filters });
      if (bool === "dates") {
        this.props.getTotal(this.state.filters)
      }
      this.props.getData(this.props.parsedFilter,filters)
    }

    BonusCredit = (row) => {
      this.props.bonusCredit(this.props.parsedFilter, this.state.filters,row)
    }

    render() {
    let { columns,data,totalPages } = this.state;
  

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
                filters={this.state.filters}
                handleFilter={this.handleFilter}
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
    dataList: state.promotions.Bonushistory
  }
}

export default connect(mapStateToProps, { getData,getTotal,bonusCredit})(ListViewConfig)
