import React, { Component } from "react"
import {UncontrolledDropdown,  DropdownMenu,  DropdownToggle,  DropdownItem,Col,Row} from "reactstrap"
import DataTable from "react-data-table-component"
import ReactPaginate from "react-paginate"
import { history } from "../../../history"
import { ChevronDown,  ChevronLeft,  ChevronRight,Trash,ArrowDown,ArrowUp} from "react-feather"
import { connect } from "react-redux"
import {  getData, filterData, menuupdate, menudelete } from "../../../redux/actions/CMS/FirstPage_game_setting/index"
import {selectedStyle,pagenation_set} from "../../../configs/providerconfig"
import {Root} from "../../../authServices/rootconfig"

const ActionsComponent = props => {
  return (
    <div className="data-list-action">
        <ArrowUp
         className="cursor-pointer mr-1"
         size={20}
         onClick={()=>props.rowArrowup(props.row)}
        />
        <ArrowDown
         className="cursor-pointer mr-1"
         size={20}
         onClick={()=>props.rowArrowDown(props.row)}
        />
        <Trash
         className="cursor-pointer mr-1"
         size={20}
         onClick={()=>props.rowDelete(props.row,props.parsedFilter,props.me.props.bool)}
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
            name: "order",
            selector: "order",
            sortable: false,
            minWidth: "100px",
          },
          {
            name: "NAME",
            selector: "gameid.PROVIDERID",
            sortable: false,
            minWidth: "100px",
          },
          {
            name: "NAME",
            selector: "gameid.TYPE",
            sortable: false,
            minWidth: "100px",
          },
          {
            name: "NAME",
            selector: "gameid.NAME",
            sortable: false,
            minWidth: "100px",
          },
        
          {
            name: "image",
            selector: "image",
            sortable: true,
            minWidth: "170px",
            cell : params =>{ return (
              <img  src={ params.gameid.image ? params.gameid.image.length > 0 ? params.gameid.image.slice(0,5) === "https" ? params.gameid.image : Root.imageurl + params.gameid.image : "" : ""} height="100" width="150" alt={params.gameid.image} />
            )
            }
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
                rowArrowup ={this.rowArrowup}
                rowArrowDown ={this.rowArrowDown}
                rowDelete={this.props.menudelete}
                me={this}
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
      this.props.getData(this.props.parsedFilter,this.props.bool)
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
        getData({ page: page, perPage: value },this.props.bool)
    }

    handlePagination = page => {
        let { parsedFilter, getData } = this.props
        let perPage = parsedFilter.perPage !== undefined ? parsedFilter.perPage : 10
        let urlPrefix = history.location.pathname
        history.push(
            `${urlPrefix}?page=${page.selected + 1}&perPage=${perPage}`
        )
        getData({ page: page.selected + 1, perPage: perPage },this.props.bool)
        this.setState({ currentPage: page.selected })
    }

    toggleModal = () => {
      this.setState(prevState => ({
        modal: !prevState.modal,
        update : false,
        title : "",
        icon : "",
        text : "",
        isChecked : false
      }))
    }

    handleSubmit = (e)=>{
      e.preventDefault();
      this.setState(prevState => ({
        modal: !prevState.modal
      }));
      if(!this.state.update){
      }else{
        var row2 = {
          title : this.state.title,
          navLink : this.state.text,
          order : this.state.ordernum,
          _id  :this.state.rowid,
          status : this.state.isChecked
        }

        this.props.menuupdate([row2],this.props.parsedFilter,this.props.bool);
      }

    }

    
    rowArrowup(row){
      var alldata = this.me.props.dataList.allData;
      var min =  alldata[0].order;
      if(row.order === min){
        return;
      }else{
        var num = row.order;
        var first = {};
        var last = {};
        for(var i = 0 ; i < alldata.length ; i++){
          if(alldata[i].order === num){
            last = alldata[i];
            first = alldata[i-1];
            break;
          }
        }
        var temp = 0;
        temp = first.order;
        first.order = last.order;
        last.order = temp;
        this.me.props.menuupdate([first,last],this.me.props.parsedFilter,this.me.props.bool);
      }
    }

    rowArrowDown(row){
      var alldata = this.me.props.dataList.allData;
      var max = alldata[alldata.length-1].order;
      if(row.order === max){
        return;
      }else{
        var num = row.order;
        var first = {};
        var last = {};
        for(var i = 0 ; i < alldata.length ; i++ ){
          if(alldata[i].order === num){
            last = alldata[i];
            first = alldata[i+1];
            break;
          }
        }
        var temp = 0;
        temp = first.order;
        first.order = last.order;
        last.order = temp;
        this.me.props.menuupdate([first,last],this.me.props.parsedFilter,this.me.props.bool);
      }
    }

    rowEdit(row){
      this.me.setState({modal : true,title : row.title,text : row.navLink,rowid : row._id,update : true,ordernum : row.order,isChecked : row.status,icon : row.icon});
    }

    

    handleSwitchChange = () => {
      this.setState({
        isChecked: !this.state.isChecked
      })
    }

    toggleTooltip = () => {
      this.setState({
        tooltipOpen: !this.state.tooltipOpen
      })
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
    dataList: state.cms.FirstPageGameSetting
  }
}

export default connect(mapStateToProps, {
    getData,
    filterData,
    menuupdate,
    menudelete
})(Child)