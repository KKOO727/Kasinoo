import React, { Component } from "react"
import {UncontrolledDropdown,  DropdownMenu,  DropdownToggle,  DropdownItem,Input,Col,Row,Button,Modal,ModalHeader,ModalBody,ModalFooter,FormGroup,Label,Form,Badge} from "reactstrap"
import DataTable from "react-data-table-component"
import ReactPaginate from "react-paginate"
import { history } from "../../../../history"
import { ChevronDown,  ChevronLeft,  ChevronRight,Edit} from "react-feather"
import { connect } from "react-redux"
import {getData,filterData,menuupdate} from "../../../../redux/actions/Players/kycpending/index"
import {Root} from "../../../../authServices/rootconfig"
import Select from "react-select"
import {selectedStyle,pagenation_set,players_kyc_optinos} from "../../../../configs/providerconfig"

const ActionsComponent = props => {
  return (
    <div className="data-list-action">
        <Edit 
         className="cursor-pointer mr-1"
         size={20}
         onClick={()=>props.rowEdit(props.row)}
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
                <DropdownItem tag="a" onClick={() => props.handleRowsPerPage(pagenation_set[0])}>{pagenation_set[0]}</DropdownItem>
                <DropdownItem tag="a" onClick={() => props.handleRowsPerPage(pagenation_set[1])}>{pagenation_set[1]}</DropdownItem>
                <DropdownItem tag="a" onClick={() => props.handleRowsPerPage(pagenation_set[2])}>{pagenation_set[2]}</DropdownItem>
                <DropdownItem tag="a" onClick={() => props.handleRowsPerPage(pagenation_set[3])}>{pagenation_set[3]}</DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
        </Col>
        <Col xs="6" md="2">
          <div className="filter-section mb-1 mt-1">
            <Input type="text" className="border-white" onChange={e => props.handleFilter(e)} />
          </div>
        </Col>
    </Row>
  )
}

class Child extends Component {
    static getDerivedStateFromProps(props, state) {
      if ( props.dataList.data.length !== state.data.length ||state.currentPage !== props.parsedFilter.page) 
        {
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
            name: "email",
            selector: "email",
            sortable: false,
            minWidth: "220px",
          },
          {
            name: "Type",
            selector: "verifyId",
            sortable: false,
            minWidth: "100px",
            cell : row=>(
              <Badge color={"light-success"} pill>
                {
                  players_kyc_optinos[row.verifyId]
                }
              </Badge>
               
            )
          },
          {
            name: "Files",
            selector: "filename",
            sortable: false,
            minWidth: "100px",
            cell : row=>(
              <>
                {                  
                row.filename && row.filename !=="" ? row.filename.split("#|@|#").map((item, i) => (
                    <div key={i}>
                      {
                        item !== "" ?
                        <img src={Root.imageurl+item} onClick={()=>this.showimg(item)} alt="swiper 1" className="img-fluid" />
                        : ""
                      }
                    </div>
                  )) : ""
                }
              </>
            )
          },
          {
            name: "Status",
            selector: "status",
            sortable: false,
            minWidth: "100px",
            cell: row => (
              <Badge
                color={ row.status === "0" ? "light-warning" : row.status === "1" ?  "light-danger" : "light-success"}
                pill>
                {this.get_status(row.status)}
              </Badge>
            )
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
                rowEdit = {this.rowEdit}
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
        email : "",
        status : "",
        image : "",
        update : false,
        type : "",
        rowid : "",
        tooltipOpen : false
    }


    componentDidMount(){
      this.props.getData(this.props.parsedFilter,this.props.status)
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
        getData({ page: page, perPage: value },this.props.status)
    }

    handlePagination = page => {
        let { parsedFilter, getData } = this.props
        let perPage = parsedFilter.perPage !== undefined ? parsedFilter.perPage : 10
        let urlPrefix = history.location.pathname
        history.push(`${urlPrefix}?page=${page.selected + 1}&perPage=${perPage}`)
        getData({ page: page.selected + 1, perPage: perPage },this.props.status)
        this.setState({ currentPage: page.selected })
    }

    toggleModal = () => {
      this.setState(prevState => ({
        modal: !prevState.modal,
        update : false,
        
      }))
    }

    handleSubmit = (e)=>{
      e.preventDefault();
      this.setState(prevState => ({
        modal: !prevState.modal
      }));
      if(!this.state.update){
      }else{

        var row = {
          bool : this.state.status,
          status : this.props.status,
          email : this.state.email
        }
        this.props.menuupdate(row,this.props.parsedFilter);
      }

    }

    rowEdit(row){
      this.me.setState({modal : true,email : row.email,update : true,status : row.status,type : row.verifyId});
    }

    showimg(item){
      this.setState({image : item,tooltipOpen : true})
    }

    handleSwitchChange = () => {
      this.setState({
        isChecked: false
      })
    }

    toggleTooltip = () => {
      this.setState({
        tooltipOpen: !this.state.tooltipOpen
      })
    }

    get_status(string){
      switch(string){
        case "0":
          return "pending";
        case "1":
          return "reject";
        case "2":
          return "allow";
        default:
          return;
      }
    }
    

  render() {
      const status_op = [
        {label: "pending", value: "0"},
        {label: "reject", value: "1"},
        {label: "allow", value: "2"}
      ]
    let { columns, data,allData,totalPages,value,rowsPerPage,totalRecords,sortIndex} = this.state
    return (
      <div id="admindata_table"   className={`data-list list-view`}>
        <Modal isOpen={this.state.tooltipOpen} toggle={this.toggleTooltip} className="modal-dialog-centered modal-lg" >
          <ModalHeader toggle={this.toggleTooltip} className="bg-primary">SHOW</ModalHeader>
          <ModalBody>
            <img style={{width:"100%",height:"50rem"}} src={Root.imageurl + this.state.image} alt='' />
          </ModalBody>
        </Modal>
        <Modal isOpen={this.state.modal}toggle={this.toggleModal}className="modal-dialog-centered"  >
          <Form onSubmit={this.handleSubmit}  action={history.location.pathname} >
            <ModalHeader toggle={this.toggleModal} className="bg-primary">
              KYC Edit
            </ModalHeader>
            <ModalBody className="modal-dialog-centered  mt-1">
              <Row>
                <Col md="12">
                  <FormGroup className="form-label-group position-relative">
                      <Input
                        type="text"
                        placeholder="title : SPORTS"
                        value={this.state.email}
                        onChange={e => this.setState({ email: e.target.value })}
                        required
                        disabled={true}
                      />
                      <Label>email</Label>
                    </FormGroup>
                </Col>
                <Col md="12">
                <FormGroup className="form-label-group position-relative">
                      <Input
                        type="text"
                        value={players_kyc_optinos[this.state.type]}
                        onChange={e => this.setState({ type: e.target.value })}
                        required
                        disabled={true}
                      />
                      <Label>type</Label>
                    </FormGroup>
                </Col>
                <Col md="12">
                <FormGroup className="form-label-group position-relative">
                    <Select
                      className="React"
                      classNamePrefix="select"
                      options={status_op}
                      defaultValue={{label :this.get_status(this.state.status),value :this.state.status }}
                      required
                      onChange={e => this.setState({ status : e.value })}
                  />
                      <Label>Stutus</Label>
                    </FormGroup>
                </Col>
                </Row>
            </ModalBody>
            <ModalFooter>
              <Button color="primary" type="submit">update</Button>
            </ModalFooter>
          </Form>
        </Modal>

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
              forcePage={ this.props.parsedFilter.page? parseInt(this.props.parsedFilter.page - 1): 0}
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
    dataList: state.Players.kycdocu
  }
}

export default connect(mapStateToProps, {   getData,  filterData,  menuupdate,})(Child) 