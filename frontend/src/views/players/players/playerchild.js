import React, { Component } from "react"
import {UncontrolledDropdown,  DropdownMenu,  DropdownToggle,  DropdownItem,Input,Col,Row,Button,Badge,Form,
  Modal,ModalHeader,ModalBody,ModalFooter,FormGroup,Label,} from "reactstrap"
import DataTable from "react-data-table-component"
import ReactPaginate from "react-paginate"
import { history } from "../../../history"
import { ChevronDown,  ChevronLeft,  ChevronRight,Lock} from "react-feather"
import { connect } from "react-redux"
import {  getData,userDetailShow,  filterData,depositAction,withdrawalAction,pagenationChange,multiBlockAction,resetpass,getInactivePlayers, getTotal} from "../../../redux/actions/Players/player/index"
import Sidebar from "./DataListSidebar"
import classnames from "classnames"
import { toast } from "react-toastify"
import Select from "react-select"
import {Amount_Types} from "../../../configs/providerconfig"
import {gender,selectedStyle,pagenation_set, DPWDComment} from "../../../configs/providerconfig"
import {Root} from "../../../authServices/rootconfig"
import { DateRangePicker  } from 'react-date-range';
import DatePicker from "../../lib/datepicker"
import {dateConvert} from "../../../redux/actions/auth"

const prefix = Root.prefix;

const ActionsComponent = props => {
  return (
    <div className="data-list-action d-flex">
      <div className="badge badge-pill badge-light-success mr-1" onClick={()=>{props.Deposit()}} >DP</div>
      <div className="badge badge-pill badge-light-danger mr-1" onClick={()=>{props.withdraw()}} >WD</div>
      <Lock  className="cursor-pointer" size={20} onClick={() => {return props.resetpassword(props.row) }} />
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
        <Col md='6' sm='6' xs='12'>
            <Label for="test">Inactive Players </Label>
            <FormGroup>
              <DatePicker onChange={(e)=>props.DateChange_action(e)} />
            </FormGroup>
        </Col>
        {/* <Col lg='2' md='3' sm='6' xs='12'>
          <FormGroup>
            <Label for="basicInput">Region</Label>
            <Input  type="number"  placeholder="Enter Region" value={state.region_name} onChange={e => props.handleFilter(e.target.value,"region_name")} />
          </FormGroup>
        </Col> */}
        {/* <Col lg='2' md='3' sm='6' xs='12'>
          <FormGroup>
            <Label for="Verification Date">Verification Date</Label>
            <Flatpickr value={new Date()} className="form-control" options={{  mode: "range"  }} onChange={date => { }} />
          </FormGroup>
        </Col> */}
        {/* <Col lg='2' md='3' sm='6' xs='12'>
          <FormGroup>
            <Label for="birthday">Birthday</Label>
            <Flatpickr name="birthday" id="birthday" className="form-control"
              value={new Date(state.birthday).toISOString()} onChange={date => { props.handleFilter(date,"birthday") }} />
          </FormGroup>
        </Col> */}
        {/* <Col lg='2' md='3' sm='6' xs='12'>
          <FormGroup>
            <Label for="basicInput">Registration Source</Label>
            <Input  type="text"  placeholder="Enter Registration Source"/>
          </FormGroup>
        </Col> */}
        {/* <Col lg='2' md='3' sm='6' xs='12'>
          <FormGroup>
            <Label for="currency">Currency</Label>
            <Select  className="React" classNamePrefix="select" id="currency" name="currency" options={currency} defaultValue={currency[0]}/>
          </FormGroup>
        </Col> */}
        {/* <Col lg='2' md='3' sm='6' xs='12'>
          <FormGroup>
            <Label for="basicInput">Client Category</Label>
            <Input  type="text"  placeholder="Enter Client Category"/>
          </FormGroup>
        </Col> */}
        {/* <Col lg='2' md='3' sm='6' xs='12'>
          <FormGroup>
            <Label for="basicInput">External ID</Label>
            <Input  type="text"  placeholder="Enter External ID"/>
          </FormGroup>
        </Col>
        <Col lg='2' md='3' sm='6' xs='12'>
          <FormGroup>
            <Label for="First Deposit Date">First Deposit Date</Label>
            <Flatpickr value={new Date()} className="form-control" options={{  mode: "range"  }} onChange={date => { }} />
          </FormGroup>
        </Col> */}

        {/* <Col lg='2' md='3' sm='6' xs='12'>
          <FormGroup>
            <Label for="test">Is Test</Label>
            <Select className="React" classNamePrefix="select" options={test} defaultValue={test[0]} />
          </FormGroup>
        </Col> */}
      
       
      </Row>
    </div>
  )
}

const CustomHeader = props => {
  let {totalRecords,sortIndex} = props.dataList;
  return (
    <div className='p-1 pt-2 pb-2'>
      <Row>
        <Col md="8" xs='6' className='justify-content-start align-items-center flex'>
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
        <Col md="4" className="text-right">

          <Button className="add-new-btn mr-1" color="primary" onClick={() =>props.multiblock(props.parsedFilter,props.me.selectedRows)} >
            Block
          </Button>          

          <Button className="add-new-btn" color="primary" onClick={() => props.handleSidebar(true, true)} >
            Create
          </Button>
        </Col>
      </Row>
    </div>
  )
}

class ListViewConfig extends Component {
    static getDerivedStateFromProps(props, state) {
      if ( props.dataList.data.length !== state.data.length ||state.currentPage !== props.parsedFilter.page) {
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
        selectionRange : {
          startDate:new Date(new Date()),
          endDate: new Date(new Date().valueOf() + 24 * 60 * 60 * 1000),
          key: 'selection',
        },
        totalPages: 0,
        currentPage: 0,
        columns: [
          {
            name: "Action",
            minWidth: "150px",
            sortable: true,
            cell: row => (
              <ActionsComponent
                row={row}
                getData={this.props.getData}
                parsedFilter={this.props.parsedFilter}
                Deposit={this.handleDeposit}
                withdraw={this.handlewithdrawl}
                kick={this.handlekick}
                me={this}
                currentData={this.handleCurrentData}
                selected={row}
                resetpassword={this.resetpassword}
              />
            )
          },
          {
            name: "id",
            selector: "pid",
            sortable: true,
            minWidth: "70px",
            cell: row => (
              <div style={{textDecoration:"underline"}} onClick={()=>this.props.userDetailShow(row)}>
                { prefix + row.signup_device} {"-"}{row.fakeid}
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
                {row.avatar !== "" ? <img style={{width:"50px",height:"50px",backgroundSize:"100% 100%"}} src={Root.imageurl + row.avatar} alt="" /> : ""}
              </>  
            )
          },
          {
            name: "firstname",
            selector: "firstname",
            sortable: true,
            minWidth: "50px",
          },
          {
            name: "lastname",
            selector: "lastname",
            sortable: true,
            minWidth: "50px",
          },
          {
            name: "email",
            selector: "email",
            sortable: true,
            minWidth: "150px",
          },
          {
            name: "username",
            selector: "username",
            sortable: true,
            minWidth: "150px",
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
            name: "balance",
            selector: "playerid.balance",
            sortable: true,
            minWidth: "50px",
            // cell : row => (
            //   <div>
            //     {
            //       row.playerid.balance ? parseInt(row.playerid.balance).toFixed(0) : "0"
            //     }
            //   </div>
            // )
          },
          {
            name: "bonusbalance",
            selector: "playerid.bonusbalance",
            sortable: true,
            minWidth: "50px",
            // cell : row => (
            //   <div>
            //     {
            //       row.playerid.bonusbalance ? parseInt(row.playerid.bonusbalance).toFixed(0) : "0"
            //     }
            //   </div>
            // )
          },          
          {
            name: "permission",
            selector: "permission",
            sortable: true,
            minWidth: "100px",
            cell: row => (
              <Badge
                color="light-success" pill>
                {row.permissiontitle}
              </Badge>
            )
          },
          {
            name: "createdby",
            selector: "created",
            sortable: true,
            minWidth: "200px",
            cell : row => (
              <div>
                {row.created}
              </div>
            )
          },
          {
            name: "mobilenumber",
            selector: "mobilenumber",
            sortable: true,
            minWidth: "150px",
          },
          {
            name: "currency",
            selector: "currency",
            sortable: true,
            minWidth: "20px",
            cell : row => (
              <>
                {"INR"}
              </>
            )
          },
          {
            name: "gender",
            selector: "gender",
            sortable: true,
            minWidth: "100px",
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
            name: "date",
            selector: "date",
            sortable: true,
            minWidth: "200px",
            cell : row => (
              <div>
                {dateConvert(row.date)}
              </div>
            )
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
          },{
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
        selected: "",
        totalRecords: 0,
        sortIndex: [1,4],
        modal: false,
        passmodal : false,
        selectedRows : {},
        amount : 0,
        type : "",
        addNew: false,
        Amount_type : Amount_Types[0].value,
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
        },
        password2 : "",
        password1 : "",
        comment : "",
        datemodal : false,
        bonusid : "",
        reasoncomment : ""
    }

    componentDidMount(){
      this.props.getData(this.props.parsedFilter );
      this.props.getTotal()
    }

    handleFilter = (value,bool) => {
      var filters = this.state.filters;
      filters[bool] = value;
      this.setState({ filters: filters });
      this.props.filterData(value,bool,this.props.parsedFilter);
    }

    handleRowsPerPage = value => {
      let { parsedFilter, pagenationChange } = this.props
      let page = parsedFilter.page !== undefined ? parsedFilter.page : 1
      history.push(`${history.location.pathname}?page=${page}&perPage=${value}`)
      this.setState({ rowsPerPage: value })
      pagenationChange({ page: page, perPage: value })
    }

    handleCurrentData = obj => {
      this.setState({ currentData: obj })
      this.handleSidebar(true)
    }

    handleDeposit(){
      this.me.setState(prevState => ({
        modal: !prevState.modal,type : "deposit",
        selected : this.selected
      }));
    }

    handlewithdrawl(){
      this.me.setState(prevState => ({
        modal: !prevState.modal,type : "withdraw",
        selected : this.selected
      }))
    }

    handleSidebar = (boolean, addNew = false) => {
      this.setState({ sidebar: boolean })
      if (addNew === true) this.setState({ currentData: null, addNew: true })
    }
    
    handlekick(){

    }

    datetoggleModal = () =>{
      this.setState(prevState => ({
        datemodal: !prevState.datemodal
      }))
    }

    
  DateRange_change =(e) =>{
    this.setState({selectionRange : e.selection})
  }

    resetpassword = (row) =>{
      this.setState(prevState => ({
        passmodal: !prevState.passmodal,
        selected : row
      }))
    }
  
    resetpassword_action = (e) =>{
      e.preventDefault();
      if (this.state.password1 === this.state.password2){
        var row = Object.assign({},{password : this.state.password1,email : this.state.selected.email});
        this.setState({passmodal : !this.state.passmodal})
        this.props.resetpass(this.props.parsedFilter,row);
      }else{
        toast.warn("Please enter correct password.");
      }
    }


    handlePagination = page => {
      let { parsedFilter, pagenationChange } = this.props
      let perPage = parsedFilter.perPage !== undefined ? parsedFilter.perPage : pagenation_set[0]
      let urlPrefix = `${history.location.pathname}`
      history.push(`${urlPrefix}?page=${page.selected + 1}&perPage=${perPage}`)
      pagenationChange({ page: page.selected + 1, perPage: perPage })
      this.setState({ currentPage: page.selected })
    }

    
    passtoggleModal = () => {
      this.setState(prevState => ({
        passmodal: !prevState.passmodal
      }))
    } 
    toggleModal = () => {
      this.setState(prevState => ({
        modal: !prevState.modal
      }))
    } 

    amountaction(){
      if( this.state.type === "withdraw" && parseInt(this.state.amount) > this.state.selected.balance ){
        toast.error("Please enter correct amount");
        return;
      }else{
        // if (this.state.Amount_type === 1 && this.state.bonusid.length <= 0) {
        //   toast.error("Please enter Bonus");
        //   return;
        // }
        this.setState(prevState => ({
          modal: !prevState.modal
        }))
        switch(this.state.type){
          case "deposit":
            this.props.depositAction({reasoncomment : this.state.reasoncomment,comment : this.state.comment,amount : parseInt(this.state.amount),email : this.state.selected.email,username : this.state.selected.username,amounttype : this.state.Amount_type, bonusid : this.state.bonusid},this.props.parsedFilter,this.state.filters);
          break;
          case "withdraw":
            this.props.withdrawalAction({reasoncomment : this.state.reasoncomment,comment : this.state.commen,amount : parseInt(this.state.amount),email : this.state.selected.email,username : this.state.selected.username,amounttype : this.state.Amount_type},this.props.parsedFilter,this.state.filters);
          break;
          default:
            break;
        }
      }
    }

    DateChange_action = (date) =>{
      this.props.getInactivePlayers(this.props.parsedFilter,date)
    }

  render() {
    let {columns,data,totalPages,rowsPerPage,sidebar,currentData,totalRecords,sortIndex} = this.state
    return (
        <>
        <Modal isOpen={this.state.datemodal} toggle={this.datetoggleModal} className="modal-dialog-centered modal-lg" >
          <Form className="" action="#" onSubmit={this.DateChange_action}>
            <ModalHeader toggle={this.datetoggleModal} className="bg-primary">
              Date Range
            </ModalHeader>
            <ModalBody className="modal-dialog-centered justify-content-center d-flex">
              <DateRangePicker ranges={[this.state.selectionRange]}   onChange={(e)=>this.DateRange_change(e)}
              showSelectionPreview={true}       moveRangeOnFirstSelection={false} months={1} />
            </ModalBody>
            <ModalFooter>
              <Button color="primary" type="submit">
                Accept
              </Button>{" "}
            </ModalFooter>
          </Form>
        </Modal>

          <Modal isOpen={this.state.passmodal} toggle={this.passtoggleModal} className="modal-dialog-centered" >
            <Form className="" action="#" onSubmit={this.resetpassword_action}>
              <ModalHeader toggle={this.passtoggleModal} className="bg-primary">
                RESETPASSWORD
              </ModalHeader>
              <ModalBody className="modal-dialog-centered d-block">
                <Col lg="12" md="12">
                  <div className="font-medium-2 text-bold-600 mb-1">password</div>
                  <FormGroup className="position-relative has-icon-left">
                    <Input type="password" placeholder="password" required value={this.state.password1}
                      maxLength={15}
                      minLength={6}
                      onChange={(e)=>this.setState({password1 : e.target.value})}
                    />
                    <div className="form-control-position">
                      <Lock size={15} />
                    </div>
                  </FormGroup>
                </Col>
                <Col lg="12" md="12">
                  <div className="font-medium-2 text-bold-600 mb-1">repassword</div>
                  <FormGroup className="position-relative has-icon-left">
                    <Input type="password" placeholder="repassword" required value={this.state.password2}
                      maxLength={15}
                      minLength={6}
                      onChange={(e)=>this.setState({password2 : e.target.value})}
                    />
                    <div className="form-control-position">
                      <Lock size={15} />
                    </div>
                  </FormGroup>
                </Col>
              </ModalBody>
              <ModalFooter>
                <Button color="primary" type="submit">
                  Accept
                </Button>
              </ModalFooter>
            </Form>
          </Modal>

          <Modal isOpen={this.state.modal} toggle={this.toggleModal}className="modal-dialog-centered modal-sm">
            <ModalHeader toggle={this.toggleModal} className="bg-primary">
              {this.state.type}
            </ModalHeader>
            <ModalBody className="modal-dialog-centered d-block">
              
             

              <Col md="12">
                <Label >AMOUNT TYPE</Label>
                <Select className="React" classNamePrefix="select" options={Amount_Types} value={Amount_Types.find(obj => obj.value === this.state.Amount_type)}
                defaultValue={Amount_Types[0]} onChange={e => this.setState({ Amount_type: e.value })} />
              </Col>

              {
                this.state.Amount_type === 1 && this.state.type === "deposit" ?
                <Col md="12">
                  <Label >Bonus TYPE</Label>
                  <Select className="React" classNamePrefix="select" options={this.props.dataList.bonusoptions} value={this.props.dataList.bonusoptions.find(obj => obj.value === this.state.bonusid)}
                    onChange={e => this.setState({ bonusid: e.value })} />
                </Col>
                : null
              }

              <Col md="12">
                <Label >Amount</Label>
                <Input type="number" value={this.state.amount} onChange={(e)=>this.setState({amount :e.target.value })} />
              </Col>
              <Col md="12">
                <Label >Comment</Label>
                <Input type="textarea" value={this.state.comment} onChange={(e)=>this.setState({comment :e.target.value })} />
              </Col>

              <Col md="12">
                <Label >TYPE</Label>
                <Select className="React" classNamePrefix="select" options={DPWDComment} value={DPWDComment.find(obj => obj.value === this.state.reasoncomment)}
                  onChange={e => this.setState({ reasoncomment: e.value })} />
              </Col>

            </ModalBody>
            <ModalFooter>
              <Button color="primary" onClick={()=>this.amountaction()}>
                Accept
              </Button>
            </ModalFooter>
          </Modal>

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
                  responsive
                  forcePage={this.props.parsedFilter.page ? parseInt(this.props.parsedFilter.page - 1) : 0 }
                  onPageChange={page => this.handlePagination(page)}
                />
              )}
              noHeader
              subHeader
              sortable
              responsive
              pointerOnHover
              selectableRows
              selectableRowsHighlight
              onSelectedRowsChange={data => this.setState({ selectedRows: data.selectedRows }) }
              customStyles={selectedStyle}
              subHeaderComponent={
                <CustomHeader
                  handleFilter={this.handleFilter}
                  responsive
                  dataList={this.props.dataList}
                  multiblock={this.props.multiBlockAction}
                  handleRowsPerPage={this.handleRowsPerPage}
                  rowsPerPage={rowsPerPage}
                  total={totalRecords}
                  handleSidebar={this.handleSidebar}
                  me={this.state}
                  parsedFilter={this.props.parsedFilter}
                  index={sortIndex}
                />
              }
              sortIcon={<ChevronDown />}
            />
            <Sidebar
              show={sidebar}
              data={currentData}
              handleSidebar={this.handleSidebar}
              dataParams={this.props.parsedFilter}
            />
            <div className={classnames("data-list-overlay", {show: sidebar})} onClick={() => this.handleSidebar(false, true)} />
          </div>
        </>
    )
  }
}

const mapStateToProps = state => {
  return {
    dataList: state.Players.playerslist,
    permission : state.userslist.permission.permissiondata
  }
}

export default connect(mapStateToProps, {  getData, userDetailShow, filterData,depositAction,withdrawalAction,pagenationChange,multiBlockAction,resetpass,getInactivePlayers, getTotal})(ListViewConfig)