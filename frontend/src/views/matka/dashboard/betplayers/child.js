import React, { Component } from "react"
import {UncontrolledDropdown,  DropdownMenu,  DropdownToggle,DropdownItem,Col,Row,Badge} from "reactstrap"
import DataTable from "react-data-table-component"
import ReactPaginate from "react-paginate"
import { history } from "../../../../history"
import { ChevronDown,  ChevronLeft,  ChevronRight} from "react-feather"
import { connect } from "react-redux"
import {  getData } from "../../../../redux/actions/matka/dashboard/betplayers"
import {selectedStyle,pagenation_set } from "../../../../configs/providerconfig"
import {dateConvert} from "../../../../redux/actions/auth"
import {Root} from "../../../../authServices/rootconfig"
import Bazar from "../all/bazaar"
const prefix = Root.prefix

const CustomHeader = props => {
  let {totalRecords,sortIndex} = props.dataList;
  return (
    <div className='p-1 pt-2 pb-2'>
    <Row>
        <Col md='6' className='justify-content-start align-items-center flex'>
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
          name: "Betid",
          selector: "transactionid",
          sortable: true,
      }, 
      {
        name: "id",
        selector: "id",
        sortable: true,
        minWidth: "50px",
        cell: row => (
          <div >
          { prefix + row.userid.signup_device} {"-"}{row.userid.fakeid}
        </div>
        )
      },
      {
        name: "username",
        selector: "BazzarName",
        sortable: true,
        cell: row => (
            <div>
                {row.userid.username}
            </div>
        )
      },
      {
        name: "mobilenumber",
        selector: "mobilenumber",
        sortable: true,
        cell: row => (
            <div>
                {row.userid.mobilenumber}
            </div>
        )
      },
      {
          name: "BazarName",
          selector: "BazzarName",
          sortable: true,
          cell: row => (
              <div>
                  {row.bazaarid.bazaarname}
              </div>
          )
      },
      {
          name: "Gamename",
          selector: "GameName",
          sortable: true,
          cell: row => (
              <div>
                  {row.gameid.name}
              </div>
          )
      },
      {
          name: "Timer",
          selector: "Timer",
          sortable: true,
          cell: row => (
              <div className="text-uppercase">
                  {row.time_flag === "1" ? "open" : row.time_flag === "2" ? "close" : row.time_flag === "3" ? "Open-Close" : row.time_flag }
              </div>
          )
      },
      {
          name: "betnumber",
          selector: "betnumber",
          sortable: true,
      },  
      {
          name: "amount",
          selector: "amount",
          sortable: true,
      },  
      {
          name: "currency",
          selector: "currency",
          sortable: true,
          cell: row => (
              <Badge pill color = "light-success">
                  INR
              </Badge>
          )
      },
      {
          name: "status",
          selector: "status",
          sortable: true,
          cell : row =>(
              <Badge pill color = { row.status === "pending" ? "light-warning" :  row.status === "win" ?  "light-success" : "light-danger"}>
                { row.status }
              </Badge >
          )
      }, 
      {
          name: "DATE",
          selector: "DATE",
          sortable: true,
          cell: row => (
          <span>
              {dateConvert (row.DATE)}
          </span>
          )
      },
      ],
    }

    componentDidMount(){
      let data = {
        bazaritem : this.props.bazaritem,
        gameitem : this.props.gameitem,
        date : this.props.date
      }
      this.props.getData(this.props.parsedFilter,data)
    }

    handlePagination = page => {
      let data = {
        bazaritem : this.props.bazaritem,
        gameitem : this.props.gameitem,
        date : this.props.date
      }
      let { parsedFilter, getData } = this.props;
      let perPage = parsedFilter.perPage !== undefined ? parsedFilter.perPage : pagenation_set[0];
      let urlPrefix =`${history.location.pathname}`;
      history.push( `${urlPrefix}?page=${page.selected + 1}&perPage=${perPage}`,data);
      var params = { page: page.selected + 1, perPage: perPage };
      getData(params,data);
    }

    componentDidUpdate(preveProps,prevState){
      if(preveProps.dataList !== this.props.dataList){
        let datalist = this.props.dataList;
        this.setState({
          data : datalist.data,
          totalPages: datalist.totalPages,
        })
      }

      if (preveProps.gameitem !== this.props.gameitem) {
        let data = {
          bazaritem : this.props.bazaritem,
          gameitem : this.props.gameitem,
          date : this.props.date
        }
        this.props.getData(this.props.parsedFilter,data)

      }
    }

    handleRowsPerPage = value => {
      let data = {
        bazaritem : this.props.bazaritem,
        gameitem : this.props.gameitem,
        date : this.props.date
      }
      let { parsedFilter, getData } = this.props
      let page = parsedFilter.page !== undefined ? parsedFilter.page : 1;
      history.push(`${history.location.pathname}?page=${page}&perPage=${value}`,data)
      var params = { page: page, perPage: value };
      getData(params,data);
    }

    getFromData = () => {
      let data = {
        bazaritem : this.props.bazaritem,
        gameitem : this.props.gameitem,
        date : this.props.date
      }
      this.props.getData(this.props.parsedFilter,data)
    }

    render() {
    let { columns,data,totalPages } = this.state;

    return (
      <React.Fragment>
        <Bazar getFromData={this.getFromData} bazaritem={this.props.bazaritem} flag={true} date={this.props.date} bazarListObject={this.props.bazarListObject} bazaars={this.props.bazaars} gameList={this.props.gameList}  />
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
    dataList: state.matka.betplayers
  }
}

export default connect(mapStateToProps, { getData})(ListViewConfig)
