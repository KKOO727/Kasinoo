import React, { Component } from "react"
 import {UncontrolledDropdown,  DropdownMenu,  DropdownToggle,  DropdownItem,Input,Col,Row,Button,Modal,Badge, ModalHeader, ModalBody,ModalFooter,FormGroup,Label,Form,} from "reactstrap"
import DataTable from "react-data-table-component"
import ReactPaginate from "react-paginate"
import { history } from "../../../history"
import { ChevronDown,  ChevronLeft,  ChevronRight,Edit,Edit2} from "react-feather"
import { connect } from "react-redux"
import {getData,filterData,menuupdate,pagenationchange} from "../../../redux/actions/Players/playerlimit/index"
import Select from "react-select"
import {selectedStyle,gender,pagenation_set} from "../../../configs/providerconfig"
import {Root} from "../../../authServices/rootconfig"
import DatePicker from "../../lib/datepicker"
const prefix = Root.prefix;

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

const FilterComponent = props => {
  let state = props.state.filters;
  return (
    <div className='p-1 pt-2 pb-2'>
      <Row>
        <Col  md='6' sm='6' xs='12'>
          <FormGroup>
            <Label for="Registration Date">Registration Date</Label>
            <DatePicker onChange={e => props.handleFilter(e,"date")} />
          </FormGroup>
        </Col>
        <Col  md='3' sm='6' xs='12'>
          <FormGroup>
            <Label for="basicInput">Username</Label>
            <Input  type="text"  placeholder="Enter UserName" value={state.username} onChange={e => props.handleFilter(e.target.value,"username")} />
          </FormGroup>
        </Col>
        <Col  md='3' sm='6' xs='12'>
          <FormGroup>
            <Label for="basicInput">Player ID</Label>
            <Input  type="number"  placeholder="Enter Player Id" value={state.id} onChange={e => props.handleFilter(e.target.value,"id")} />
          </FormGroup>
        </Col>
        
        <Col  md='3' sm='6' xs='12'>
          <FormGroup>
            <Label for="basicInput">First Name</Label>
            <Input  type="text"  placeholder="Enter First Name" value={state.firstname} onChange={e => props.handleFilter(e.target.value,"firstname")} />
          </FormGroup>
        </Col>
        <Col  md='3' sm='6' xs='12'>
          <FormGroup>
            <Label for="basicInput">Last Name</Label>
            <Input  type="text"  placeholder="Enter Last Name" value={state.lastname} onChange={e => props.handleFilter(e.target.value,"lastname")} />
          </FormGroup>
        </Col>
        <Col  md='3' sm='6' xs='12'>
          <FormGroup>
            <Label for="basicInput">Address</Label>
            <Input  type="text"  placeholder="Enter Address" value={state.address} onChange={e => props.handleFilter(e.target.value,"address")} />
          </FormGroup>
        </Col>
        <Col  md='3' sm='6' xs='12'>
          <FormGroup>
            <Label for="gender">Gender</Label>
            <Select className="React" classNamePrefix="select" value={ gender.find( obj=>obj.value === state.gender ) } name="gender" options={gender} onChange={e => props.handleFilter(e.value,"gender")}  />
          </FormGroup>
        </Col>
        <Col  md='3' sm='6' xs='12'>
          <FormGroup>
            <Label for="basicInput">Email</Label>
            <Input  type="text"  placeholder="Enter Email" value={state.email} onChange={e => props.handleFilter(e.target.value,"email")} />
          </FormGroup>
        </Col>
        <Col  md='3' sm='6' xs='12'>
          <FormGroup>
            <Label for="basicInput">Mobile</Label>
            <Input  type="text"  placeholder="Enter Mobile Number" value={state.mobilenumber} onChange={e => props.handleFilter(e.target.value,"mobilenumber")} />
          </FormGroup>
        </Col>
      </Row>
    </div>
  )
}



const CustomHeader = props => {
  let {totalRecords,sortIndex} = props.dataList;
  return (
    <div className='p-1 pt-2 pb-2'>
      <Row>
        <Col xs='12' className='justify-content-start align-items-center flex'>
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
                me={this}
              />
            )
          },
          {
            name: "id",
            selector: "pid",
            sortable: true,
            minWidth: "70px",
            cell: row => (
              <div >
              { prefix + row.userid.signup_device} {"-"}{row.userid.fakeid}
            </div>
            )
          },
          {
            name : "avatar",
            selector : "avatar",
            sortable: true,
            minWidth: "100px",
            cell : row =>(
              <>
                { row.userid && row.userid.avatar !== "" ? <img style={{width:"50px",height:"50px",backgroundSize:"100% 100%"}} src={Root.imageurl + row.userid.avatar} alt="" /> : ""}
              </>  
            )
          },
          {
              name: "firstname",
              selector: "firstname",
              sortable: true,
              minWidth: "10px",
              cell : row=>(
                  <div>
                    {row.userid && row.userid.firstname ? row.userid.firstname : "" }
                  </div>
              )
          },
          {
              name: "lastname",
              selector: "lastname",
              sortable: true,
              minWidth: "100px",
              cell : row=>(
                <div>
                  {row.userid && row.userid.lastname ? row.userid.lastname : ""}
                </div>
              )
          },
          {
            name: "email",
            selector: "email",
            sortable: true,
            minWidth: "220px",
            cell : row=>(
              <div>
                {row.userid && row.userid.email ? row.userid.email : ""}
              </div>
            )
          },
          {
            name: "username",
            selector: "username",
            sortable: true,
            minWidth: "100px",
            cell : row=>(
              <div>
                {row.userid && row.userid.username ? row.userid.username : ""}
              </div>
            )
          },
          {
            name: "daylimit",
            selector: "daylimit",
            sortable: true,
            minWidth: "100px",
          },
          {
            name: "weeklimit",
            selector: "weeklimit",
            sortable: true,
            minWidth: "10px",
          },
          {
            name: "monthlimit",
            selector: "monthlimit",
            sortable: true,
            minWidth: "10px",
          },
         
          {
            name: "mobile number",
            selector: "mobilenumber",
            sortable: true,
            minWidth: "100px",
            cell : row=>(
              <div>
                { row.userid && row.userid.mobilenumber ? row.userid.mobilenumber : ""}
              </div>
            )
          },
          {
            name: "permission",
            selector: "permission",
            sortable: true,
            minWidth: "100px",
            cell: row => (
              <Badge
                color="light-success" pill>
               {row.userid && row.userid.permissionid.title ? row.userid.permissionid.title : ""}
              </Badge>
            )
          },
          {
            name: "createdby",
            selector: "created",
            sortable: true,
            minWidth: "100px",
            cell : row=>(
              <div>
                { row.userid &&  row.userid.created ? row.userid.created  : ""}
              </div>
            )
          },
          {
            name: "gender",
            selector: "gender",
            sortable: true,
            minWidth: "100px",
            cell : row=>(
              <div>
                { row.userid && row.userid.gender ? row.userid.gender : ""}
              </div>
            )
          },
          {
            name: "account holder",
            selector: "accountholder",
            sortable: true,
            minWidth: "100px",
          },
          {
            name: "address",
            selector: "address",
            sortable: true,
            minWidth: "100px",
          },
          {
            name: "birthday",
            selector: "birthday",
            sortable: true,
            minWidth: "100px",
          },
          {
            name: "cashdesk",
            selector: "cashdesk",
            sortable: true,
            minWidth: "100px",
          },
          {
            name: "city name",
            selector: "city_name",
            sortable: true,
            minWidth: "100px",
          },
          {
            name: "currency",
            selector: "currency",
            sortable: true,
            minWidth: "100px",
          },
          {
            name: "date",
            selector: "date",
            sortable: true,
            minWidth: "100px",
          },
          {
            name: "zip code",
            selector: "zip_code",
            sortable: true,
            minWidth: "100px",
          },
          {
            name: "language",
            selector: "language",
            sortable: true,
            minWidth: "100px",
          },
          {
            name: "phone",
            selector: "phone",
            sortable: true,
            minWidth: "100px",
          },
          {
            name: "region name",
            selector: "region_name",
            sortable: true,
            minWidth: "100px",
          },
  
          {
            name: "idverify",
            selector: "idverify",
            sortable: true,
            minWidth: "100px",
            cell: row => (
              <Badge
                color={ !row.idverify ? "light-warning" : "light-success"}
                pill>
                {!row.idverify ?  "INACTIVE" : "ACTIVE"}
              </Badge>
            )
          },
          {
            name: "email verify",
            selector: "emailverify",
            sortable: true,
            minWidth: "100px",
            cell: row => (
              <Badge
                color={ !row.emailverify ? "light-warning" : "light-success"}
                pill>
                {!row.emailverify ?  "INACTIVE" : "ACTIVE"}
              </Badge>
            )
          },
          {
            name: "Status",
            selector: "status",
            sortable: true,
            minWidth: "100px",
            cell: row => (
              <Badge
                color={ row.status === "allow" ? "light-success" : row.status === "pending" ? "light-warning" : "light-danger"} pill>
                {row.status}
              </Badge>
            )
          },
          {
            name: "isdelete",
            selector: "isdelete",
            sortable: true,
            minWidth: "100px",
            cell: row => (
              <Badge
                color={ row.isdelete ? "light-warning" : "light-success"}
                pill>
                {row.isdelete ?  "INACTIVE" : "ACTIVE"}
              </Badge>
            )
          },
          {
            name: "resident",
            selector: "resident",
            sortable: true,
            minWidth: "100px",
            cell: row => (
              <Badge
                color={ !row.resident ? "light-warning" : "light-success"}
                pill>
                {!row.resident ?  "INACTIVE" : "ACTIVE"}
              </Badge>
            )
          },
          {
            name: "test",
            selector: "test",
            sortable: true,
            minWidth: "100px",
            cell: row => (
              <Badge
                color={ !row.test ? "light-warning" : "light-success"}
                pill>
                {!row.test ?  "INACTIVE" : "ACTIVE"}
              </Badge>
            )
          },
          {
            name: "subscribed to email",
            selector: "subscribedtoemail",
            sortable: true,
            minWidth: "100px",
            cell: row => (
              <Badge
                color={ !row.subscribedtoemail ? "light-warning" : "light-success"}
                pill>
                {!row.subscribedtoemail ?  "INACTIVE" : "ACTIVE"}
              </Badge>
            )
          },
          {
            name: "subscribed to sms",
            selector: "subscribedtosms",
            sortable: true,
            minWidth: "100px",
            cell: row => (
              <Badge
                color={ !row.subscribedtosms ? "light-warning" : "light-success"}
                pill>
                {!row.subscribedtosms ?  "INACTIVE" : "ACTIVE"}
              </Badge>
            )
          },
          {
            name: "usingloyalty program",
            selector: "usingloyaltyprogram",
            sortable: true,
            minWidth: "100px",
            cell: row => (
              <Badge
                color={ !row.usingloyaltyprogram ? "light-warning" : "light-success"}
                pill>
                {!row.usingloyaltyprogram ?  "INACTIVE" : "ACTIVE"}
              </Badge>
            )
          },
          {
            name : "affiliate id",
            selector : "affiliate_id",
            sortable: true,
            minWidth: "100px",
          },
          {
            name : "area code",
            selector : "area_code",
            sortable: true,
            minWidth: "100px",
          },
          
          {
            name : "balance",
            selector : "balance",
            sortable: true,
            minWidth: "100px",
          },
          {
            name : "bank name",
            selector : "bank_name",
            sortable: true,
            minWidth: "100px",
          },
          {
            name : "birth city",
            selector : "birth_city",
            sortable: true,
            minWidth: "100px",
          },
          {
            name : "birth department",
            selector : "birth_department",
            sortable: true,
            minWidth: "100px",
          },
          {
            name : "birth region code",
            selector : "birth_region_code",
            sortable: true,
            minWidth: "100px",
          },
          {
            name : "birth region id",
            selector : "birth_region_id",
            sortable: true,
            minWidth: "100px",
          },
          {
            name : "btag",
            selector : "btag",
            sortable: true,
            minWidth: "100px",
          },
          {
            name : "cashdesk id",
            selector : "cashdesk_id",
            sortable: true,
            minWidth: "100px",
          },
          {
            name : "client category",
            selector : "client_category",
            sortable: true,
            minWidth: "100px",
          },
          {
            name : "contact",
            selector : "contact",
            sortable: true,
            minWidth: "100px",
          },
          {
            name : "country code",
            selector : "country_code",
            sortable: true,
            minWidth: "100px",
          },
          {
            name : "country name",
            selector : "country_name",
            sortable: true,
            minWidth: "100px",
          },
          {
            name : "custome player category",
            selector : "custome_player_category",
            sortable: true,
            minWidth: "100px",
          },
          {
            name : "document issue code",
            selector : "document_issue_code",
            sortable: true,
            minWidth: "100px",
          },
          {
            name : "document issue date",
            selector : "document_issue_date",
            sortable: true,
            minWidth: "100px",
          },
          {
            name : "document issuedby",
            selector : "document_issuedby",
            sortable: true,
            minWidth: "100px",
          },
          {
            name : "document number",
            selector : "document_number",
            sortable: true,
            minWidth: "100px",
          },
          {
            name : "domain",
            selector : "domain",
            sortable: true,
            minWidth: "100px",
          },
          {
            name : "external id",
            selector : "external_id",
            sortable: true,
            minWidth: "100px",
          },
          {
            name : "first deposit date",
            selector : "first_deposit_date",
            sortable: true,
            minWidth: "100px",
          },
          {
            name : "gaming last bet",
            selector : "gaming_last_bet",
            sortable: true,
            minWidth: "100px",
          },
          {
            name : "iban",
            selector : "iban",
            sortable: true,
            minWidth: "100px",
          },
          {
            name : "ip",
            selector : "ip",
            sortable: true,
            minWidth: "100px",
          },
          {
            name : "is logged in",
            selector : "is_logged_in",
            sortable: true,
            minWidth: "100px",
          },
          {
            name : "is verified",
            selector : "is_verified",
            sortable: true,
            minWidth: "100px",
          },
          {
            name : "isp",
            selector : "isp",
            sortable: true,
            minWidth: "100px",
          },
          {
            name : "last login date",
            selector : "last_login_date",
            sortable: true,
            minWidth: "100px",
          },
          {
            name : "last login ip",
            selector : "last_login_ip",
            sortable: true,
            minWidth: "100px",
          },
          {
            name : "pep status",
            selector : "pep_status",
            sortable: true,
            minWidth: "100px",
          },
          {
            name : "personal id",
            selector : "personal_id",
            sortable: true,
            minWidth: "100px",
          },
          {
            name : "profile id",
            selector : "profile_id",
            sortable: true,
            minWidth: "100px",
          },
          {
            name : "promo code",
            selector : "promo_code",
            sortable: true,
            minWidth: "100px",
          },
          {
            name : "province",
            selector : "province",
            sortable: true,
            minWidth: "100px",
          },
          {
            name : "registration source",
            selector : "registration_source",
            sortable: true,
            minWidth: "100px",
          },
          {
            name : "sport last bet",
            selector : "sport_last_bet",
            sortable: true,
            minWidth: "100px",
          },
          {
            name : "state",
            selector : "state",
            sortable: true,
            minWidth: "100px",
          },
          {
            name : "subscribed to newsletter",
            selector : "subscribed_to_newsletter",
            sortable: true,
            minWidth: "100px",
          },
          {
            name : "subscribed to phone call",
            selector : "subscribed_to_phone_call",
            sortable: true,
            minWidth: "100px",
          },
          {
            name : "subscribed to push notifications",
            selector : "subscribed_to_push_notifications",
            sortable: true,
            minWidth: "100px",
          },
          {
            name : "subscripted internal message",
            selector : "subscripted_internal_message",
            sortable: true,
            minWidth: "100px",
          },
          {
            name : "swiftcode",
            selector : "swiftcode",
            sortable: true,
            minWidth: "100px",
          },
          {
            name : "time zone",
            selector : "time_zone",
            sortable: true,
            minWidth: "100px",
          },
          {
            name : "title",
            selector : "title",
            sortable: true,
            minWidth: "100px",
          },
          {
            name : "wrong login attemptswrong login block time",
            selector : "wrong_login_attemptswrong_login_block_time",
            sortable: true,
            minWidth: "120px",
          },
          {
            name : "wrong login block time",
            selector : "wrong_login_block_time",
            sortable: true,
            minWidth: "100px",
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
        username : "",
        daylimit : 0,
        weeklimit : 0,
        monthlimit : 0,
        update : false,
        rowid : "",
        isChecked : false,
        tooltipOpen : false,
        filters : {
          date : {
            start :"",
            end : ""
          },
          username : "",
          id : "",
          region_name : "",
          email : "",
          mobilenumber : "",
          firstname : "",
          lastname : "",
          address : "",
          gender : gender[0].value,
          birthday : [new Date().toISOString()],
          balance : "",
          permission : ""
        }
    }

    componentDidMount(){
      this.props.getData(this.props.parsedFilter)
    }


    handleFilter = (value,bool) => {
      var filters = this.state.filters;
      filters[bool] = value;
      this.setState({ filters: filters });
      this.props.filterData(value,bool, this.props.parsedFilter);
  }

    handleRowsPerPage = value => {
        let { parsedFilter, pagenationchange } = this.props
        let page = parsedFilter.page !== undefined ? parsedFilter.page : 1
        history.push(`${history.location.pathname}?page=${page}&perPage=${value}`)
        this.setState({ rowsPerPage: value })
        pagenationchange({ page: page, perPage: value })
    }

    handlePagination = page => {
        let { parsedFilter, pagenationchange } = this.props
        let perPage = parsedFilter.perPage !== undefined ? parsedFilter.perPage : 10
        let urlPrefix = history.location.pathname
        history.push(`${urlPrefix}?page=${page.selected + 1}&perPage=${perPage}`)
        pagenationchange({ page: page.selected + 1, perPage: perPage })
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
          username : this.state.username,
          daylimit : this.state.daylimit,
          weeklimit : this.state.weeklimit,
          monthlimit : this.state.monthlimit,
          email : this.state.email
        }
        this.props.menuupdate(row,this.props.parsedFilter);
      }

    }

    
    rowEdit(row){
      this.me.setState({modal : true,
        username : row.userid.username,
        email : row.userid.email,
        daylimit : row.daylimit,
        weeklimit : row.weeklimit,
        monthlimit : row.monthlimit,
        rowid : row._id,update : true});
    }

  render() {
    let { columns,data,allData,totalPages,value,rowsPerPage,totalRecords,sortIndex} = this.state
    return (
      <> 
        <FilterComponent
          handleFilter={this.handleFilter}
          {...this.props}
          responsive
          handleRowsPerPage={this.handleRowsPerPage}
          rowsPerPage={rowsPerPage}
          total={totalRecords}
          handleSidebar={this.handleSidebar}
          state={this.state}
          {...this}
          Filterapply={this.props.getData}
          parsedFilter={this.props.parsedFilter}
          index={sortIndex}
        />
      <div id="admindata_table" className={`data-list list-view`}>          
        <Modal isOpen={this.state.modal} toggle={this.toggleModal} className="modal-dialog-centered" >
          <Form onSubmit={this.handleSubmit}  action={history.location.pathname} >
            <ModalHeader toggle={this.toggleModal} className="bg-primary">
              Player Limit Set
            </ModalHeader>
            <ModalBody className="modal-dialog-centered  mt-1">
              <Row>
                {/* <Col md="12"> */}
                  {/* <FormGroup className="form-label-group position-relative has-icon-left">
                      <Input type="text" placeholder="title"
                        value={this.state.email} onChange={e => this.setState({ email: e.target.value })} required />
                      <div className="form-control-position" >
                        <Edit2 size={15} />
                      </div>
                      <Label>email</Label>
                    </FormGroup>
                </Col> */}
                <Col md="12">
                  <FormGroup className="form-label-group position-relative has-icon-left">
                      <Input type="text" placeholder="username : SPORTS" value={this.state.username}
                        onChange={e => this.setState({ username: e.target.value })} disabled={true}     />
                      <div className="form-control-position" >
                        <Edit2 size={15} />
                      </div>
                      <Label>username</Label>
                    </FormGroup>
                </Col>
                <Col md="12">
                  <FormGroup className="form-label-group position-relative has-icon-left">
                      <Input type="number" placeholder="title : SPORTS" value={this.state.daylimit} onChange={e => this.setState({ daylimit: e.target.value })}
                      required/>
                      <div className="form-control-position" >
                        <Edit2 size={15} />
                      </div>
                      <Label>daylimit</Label>
                    </FormGroup>
                </Col>
                <Col md="12">
                  <FormGroup className="form-label-group position-relative has-icon-left">
                      <Input
                        type="number"
                        placeholder="title : SPORTS"
                        value={this.state.weeklimit}
                        onChange={e => this.setState({ weeklimit: e.target.value })}
                        required
                      />
                      <div className="form-control-position" >
                        <Edit2 size={15} />
                      </div>
                      <Label>weeklimit</Label>
                    </FormGroup>
                </Col>
                <Col md="12">
                  <FormGroup className="form-label-group position-relative has-icon-left">
                      <Input
                        type="number"
                        placeholder="title : SPORTS"
                        value={this.state.monthlimit}
                        onChange={e => this.setState({ monthlimit: e.target.value })}
                        required
                      />
                      <div className="form-control-position" >
                        <Edit2 size={15} />
                      </div>
                      <Label>monthlimit</Label>
                    </FormGroup>
                </Col>
              </Row>
            </ModalBody>
            <ModalFooter>
              {
                this.state.update ? <Button color="primary" type="submit">update</Button> : <Button color="primary" type="submit">Accept</Button>
              }
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
              forcePage={ this.props.parsedFilter.page ? parseInt(this.props.parsedFilter.page - 1) : 0 }
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
              dataList={this.props.dataList}
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
      </>
    )
  }
}

const mapStateToProps = state => {
  return {
    dataList: state.Players.playerlimit
  }
}

export default connect(mapStateToProps, { getData,  filterData,  menuupdate,pagenationchange})(Child)