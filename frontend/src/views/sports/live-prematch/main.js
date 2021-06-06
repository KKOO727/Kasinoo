import React, { Component } from "react"
import DataTable from "react-data-table-component"
import ReactPaginate from "react-paginate"
import {connect } from "react-redux"
import {history} from "../../../history"
import { pagenation_set, selectedStyle } from "../../../configs/providerconfig"
import { UncontrolledDropdown,   DropdownMenu,   DropdownToggle,  DropdownItem,Col,Row,Badge,FormGroup,Label,Button} from "reactstrap";
import Select from "react-select";
import { ChevronDown,  ChevronLeft,  ChevronRight} from "react-feather";
import { getSportsList , getSportData , pagenationchange , changeStatus,featureadd} from "../../../redux/actions/sports"

const CustomHeader = props => {
  return (
    <div className='p-1 pt-2 pb-2'>
      <Row>
        <UncontrolledDropdown className="data-list-rows-dropdown d-block mt-1 ml-1">
          <DropdownToggle color="" className="sort-dropdown">
            <span className="align-middle mx-50">
              {`${props.rowsPerPage * props.currentPage} - ${props.allData.length < props.rowsPerPage * (props.currentPage+1) ? props.allData.length : props.rowsPerPage * (props.currentPage+1)} of ${props.allData.length}`}
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
        <Col xs="3" className = "ml-1">
          <FormGroup>
            <Label for="sports">Sports List</Label>
            <Select
              className="React"
              classNamePrefix="select"
              id="sports-list"
              name="sports-list"
              options={props.sportList}
              defaultValue={props.sportList[0]}
              value={props.sportList.find(obj => obj.value === props.me.currentSportList)}
              onChange={e => props.changeFilter({currentSportList : e.value , currentSportType : props.me.currentSportType , currentSportStatus : props.me.currentSportStatus})}
            />
          </FormGroup>
        </Col>
        <Col xs="3" className = "ml-1">
          <FormGroup>
            <Label for="sports">Sports Type</Label>
            <Select
              className="React"
              classNamePrefix="select"
              id="sports"
              name="sports"
              options={props.sportType}
              defaultValue={props.sportType[0]}
              value={props.sportType.find(obj => obj.value === props.me.currentSportType)}
              onChange={e => props.changeFilter({currentSportType : e.value , currentSportList : props.me.currentSportList , currentSportStatus : props.me.currentSportStatus})}
            />
          </FormGroup>
        </Col>
        <Col xs="3" className = "ml-1">
          <FormGroup>
            <Label for="sports">Current Status</Label>
            <Select
              className="React"
              classNamePrefix="select"
              id="sports"
              name="sports"
              options={props.Status}
              defaultValue={props.Status[0]}
              value={props.Status.find(obj => obj.value === props.me.currentSportStatus)}
              onChange={e => props.changeFilter({currentSportStatus : e.value , currentSportType : props.me.currentSportType , currentSportList : props.me.currentSportList})}
            />
          </FormGroup>
        </Col>
      </Row>
    </div>
  )
}

class ListViewConfig extends Component {
  static getDerivedStateFromProps(props, state) {
    if ( props.sports_data.data.length !== state.data.length || state.currentPage !== props.parsedFilter.page ) {
      return {
        data: props.sports_data.data,
        allData: props.sports_data.allData,
        totalPages: props.sports_data.totalPages,
        currentPage: props.parsedFilter.page !== undefined ? parseInt(props.parsedFilter.page) - 1 : 0,
        rowsPerPage: props.parsedFilter.perPage !== undefined ? parseInt(props.parsedFilter.perPage) : 10,
      }
    }
    return null;
  }

  state = {
    sportList : [],
    sportType : [],
    Status : [],
    data: [],
    allData: [],
    totalPages: 0,
    currentPage: 0,
    rowsPerPage: 10,

    currentSportList : "",
    currentSportType : "",
    currentSportStatus : "",

    columns: [
      {
        name: "Id",
        selector: "id",
        sortable: false,
        cell: (row, index) => (
          <>{index + 1}</>
        )
      },
      {
        name: "EventId",
        selector: "event_id",
        sortable: false,
      },
      {
        name: "EventName",
        selector: "event_name",
        sortable: false,
        minWidth: "200px",
      },
      {
        name: "ScheduledTime",
        selector: "ScheduledTime",
        sortable: false,
      },
      {
        name: "EventStatus",
        selector: "EventStatus",
        sortable: false,
      },
      {
        name: "Market",
        selector: "market_len",
        sortable: false,
      },
      {
        name: "Action",
        sortable: false,
        cell: row => (
          row.permission === true ? 
          <Button.Ripple onClick={()=>this.props.changeStatus(row , this.props.parsedFilter , false)} className="mb-1" size="sm">
           disable
         </Button.Ripple>
           :
          <Button.Ripple onClick={()=>this.props.changeStatus(row , this.props.parsedFilter , true)} className="mb-1" color="success" size="sm">
            enable
          </Button.Ripple>
        )
      },
      {
        name : "Status",
        sortable : false,
        cell : row => (
          row.permission === true ? 
            <Badge color={"light-success"} pill> SHOW </Badge>
          :
            <Badge color={"light-warning"} pill> HIDE </Badge>
        )
      },
      {
        name : "add",
        cell : row => (
          <div>
            <Button  className="mt-1" color="primary" onClick={()=>this.props.featureadd(row)}>
              Feature Add
            </Button>
          </div>
        )
      }
    ],

  }

  
  add = (e) => {
    this.props.featureadd(e)
  }

  async componentDidMount() {
    await this.props.getSportsList();
    var sportList = [];
    for(var i = 0 ; i < this.props.sports_list.data.length ; i ++){
      sportList.push({label : this.props.sports_list.data[i].sport_name , value : this.props.sports_list.data[i].sport_id});
    }
    var sportType = [
      {label : "All" , value : "All"},
      {label : "Prematch" , value : "NotStarted"},
      {label : "Live" , value : "Live"},
    ];
    var Status = [
      {label : "All" , value : "All"},
      {label : "Show" , value : true},
      {label : "Hide" , value : false},
    ];
    if (sportList.length) {
      var sendData = {
        sport_id : sportList[0].value,
        EventStatus : sportType[0].value,
        status : Status[0].value
      };
      this.props.getSportData(this.props.parsedFilter , sendData);
      this.setState({
        sportList , sportType , Status,
        currentSportList : sportList[0].value, 
        currentSportType : sportType[0].value, 
        currentSportStatus : Status[0].value
      });
    }
  }

  handleRowsPerPage = value => {
    let { parsedFilter, pagenationchange } = this.props
    let page = parsedFilter.page !== undefined ? parsedFilter.page : 1
    history.push(`${history.location.pathname}?page=${page}&perPage=${value}`)
    this.setState({ rowsPerPage: value });
    pagenationchange({ page: page, perPage: value })
  }

  handlePagination = page => {
    let { parsedFilter, pagenationchange } = this.props
    let perPage = parsedFilter.perPage !== undefined ? parsedFilter.perPage : 10
    let urlPrefix =history.location.pathname
    history.push(`${urlPrefix}?page=${page.selected + 1}&perPage=${perPage}`)
    pagenationchange({ page: page.selected + 1, perPage: perPage })
    this.setState({ currentPage: page.selected })
  }

  changeFilter = data => {
    this.setState(data);
    var sendData = {
      sport_id : data.currentSportList,
      EventStatus : data.currentSportType,
      status : data.currentSportStatus
    };
    this.props.getSportData(this.props.parsedFilter , sendData);
  }

  render() {
    let { columns,data,totalPages,rowsPerPage,allData,currentPage,sportList,sportType,Status} = this.state;
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
              forcePage={ this.props.parsedFilter.page ? parseInt(this.props.parsedFilter.page - 1) : 0 }
              onPageChange={page => this.handlePagination(page)}
            />
          )}
          noHeader
          subHeader
          responsive
          pointerOnHover
          onSelectedRowsChange={data => this.setState({ selectedRows: data.selectedRows }) }
          customStyles={selectedStyle}
          subHeaderComponent={
            <CustomHeader
              sportList = {sportList}
              sportType = {sportType}
              Status = {Status}
              rowsPerPage={rowsPerPage}
              allData = {allData}
              currentPage={currentPage}

              handleRowsPerPage={this.handleRowsPerPage}
              changeFilter={this.changeFilter}
              me={this.state}
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
    sports_list : state.sports.sports_list,
    sports_data: state.sports.sports_data,
  }
}

export default connect(mapStateToProps, { 
  getSportsList,
  getSportData,
  pagenationchange,
  changeStatus,featureadd
})(ListViewConfig)