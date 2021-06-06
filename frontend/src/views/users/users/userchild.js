import React, { Component } from "react"
import DataTable from "react-data-table-component"
import ReactPaginate from "react-paginate"
import Select from "react-select"
import Sidebar from "./DataListSidebar"
import classnames from "classnames"
import {history } from "../../../history"
import {connect } from "react-redux"
import {getData,  filterData,pagenationchange,resetpass,multiblockaction,multideleteaction,withdrawaction,depositaction} from "../../../redux/actions/user/index"
import {pagenation_set,selectedStyle,gender,Amount_Types , DPWDComment} from "../../../configs/providerconfig"
import { ChevronDown,  ChevronLeft,  ChevronRight,Plus,Edit,Lock,Delete} from "react-feather"
import {UncontrolledDropdown,  DropdownMenu,  DropdownToggle,  DropdownItem,Input,Col,Row,Badge,Button,FormGroup,Label,Modal, ModalHeader, ModalBody, ModalFooter, Form} from "reactstrap"
import {toast} from "react-toastify"
import {Root} from "../../../authServices/rootconfig"
import { CopyToClipboard } from "react-copy-to-clipboard"
import DatePicker from "../../lib/datepicker"
const prefix = Root.prefix

const ActionsComponent = props => {
  return (
    <div className="data-list-action">
      <div className="badge badge-pill badge-light-success mr-1" onClick={()=>{props.Deposit()}} >DP</div>
      <div className="badge badge-pill badge-light-danger mr-1" onClick={()=>{props.withdraw()}} >WD</div>

      <Edit  className="cursor-pointer mr-1" size={15} onClick={() => {return props.currentData(props.row) }} />
      <Lock  className="cursor-pointer mr-1" size={15} onClick={() => {return props.resetpassword(props.row) }} />
    </div>
  )
}

const FilterComponent = props => {
  let state = props.state.filters
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
        <Col md='3' sm='6' xs='12'>
          <FormGroup>
            <Label for="test">Permission</Label>
            <Select  className="React" classNamePrefix="select" options={props.permission}
              value={props.permission ? props.permission.find(obj=> obj.value === state.permission) : null}
              defaultValue={props.permission && props.permission.length > 0 ? props.permission[0].value : []}
              onChange={e => props.handleFilter(e.value,"permission")}
            />
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
        <Col md="3" xs='12' className='justify-content-start align-items-center flex'>
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
        
        <Col md="3">
        </Col>
        <Col md="3">
        </Col>

        <Col md="3" xs='12' className='justify-content-end align-items-center' style={{display:'flex'}}>
          <Button className="add-new-btn mr-1" color="primary" onClick={() =>props.multiblock(props.parsedFilter,props.me.selectedRows)} outline>
            <Lock size={15} />
            <span className="align-middle">Block</span>
          </Button>          
          <Button className="add-new-btn  mr-1" color="primary" onClick={() =>props.multidelete(props.parsedFilter,props.me.selectedRows)} outline>
            <Delete size={15} />
            <span className="align-middle">Delete</span>
          </Button>          
          <Button className="add-new-btn  mr-1" color="primary" onClick={() => props.handleSidebar(true, true)} outline>
            <Plus size={15} />
            <span className="align-middle">Create</span>
          </Button>
        </Col>
      </Row>
    </div>
  )
}

class ListViewConfig extends Component {
    static getDerivedStateFromProps(props, state) {
      if ( props.dataList.data.length !== state.data.length ||state.currentPage !== props.parsedFilter.page ) {
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
          minWidth: "200px",
          sortable: true,
          cell: row => (
            <ActionsComponent
              row={row}
              me={this.state}
              state = {this}
              Deposit={this.handleDeposit}
              withdraw={this.handlewithdrawl}
              selected={row}
              currentData={this.handleCurrentData}
              resetpassword={this.resetpassword}
            />
          )
        },
        {
          name: "id",
          selector: "id",
          sortable: true,
          minWidth: "50px",
          cell: row => (
            <div >
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
          minWidth: "10px",
        },
        {
          name: "lastname",
          selector: "lastname",
          sortable: true,
          minWidth: "100px",
        },
        {
          name: "email",
          selector: "email",
          sortable: true,
          minWidth: "220px",
        },
        {
          name: "Referrallink",
          selector: "Referrallink",
          sortable: true,
          minWidth: "220px",
          cell : row =>(
            <CopyToClipboard text={this.props.setting.Referrallink + row.fakeid}
              onCopy={() => toast.success("copied")}>
              <Button outline color="primary">{this.props.setting.Referrallink+ row.fakeid} </Button>
            </CopyToClipboard>
          )
        },
        {
          name: "username",
          selector: "username",
          sortable: true,
          minWidth: "100px",
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
          selector: "balance",
          sortable: true,
          minWidth: "20px",
          cell : row =>(
            <div>
              {row.playerid ? row.playerid.balance : ""}
            </div>
          )
        },
        {
          name: "bonusbalance",
          selector: "bonusbalance",
          sortable: true,
          minWidth: "20px",
          cell : row =>(
            <div>
              {row.playerid ? row.playerid.bonusbalance : ""}
            </div>
          )
        },

        {
          name: "mobile number",
          selector: "mobilenumber",
          sortable: true,
          minWidth: "100px",
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
              {/* {  this.props.permission.find(obj=>obj.value === row.permission) ?  this.props.permission.find(obj=>obj.value === row.permission).label : ""} */}
            </Badge>
          )
        },
        {
          name: "createdby",
          selector: "created",
          sortable: true,
          minWidth: "100px",
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
      currentData: null,
      selected: {},
      totalRecords: 0,
      sortIndex: [],
      sidebar: false,
      addNew: false,
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
      modal: false,
      password1 : "",
      password2: "",
      selectedRows:[],
      type : '',
      amodal : false,
      amount : 0,
      comment : "",
      Amount_type : Amount_Types[0].value,
      reasoncomment : ""
    }
  componentDidMount() {
    this.props.getData(this.props.parsedFilter,this.state.filters)
  }

  handleFilter = (value,bool) => {
    var filters = this.state.filters;
    filters[bool] = value;
    this.setState({ filters: filters });
    this.props.filterData(value,bool, this.props.parsedFilter);
  }

  handleDeposit(){
    if(this.selected.email !== "superadmin@gmail.com"){
      this.state.setState(prevState => ({
        amodal: !prevState.amodal,type : "deposit",
        selected : this.selected
      }))
    }
  }

  handlewithdrawl(){
    if(this.selected.email !== "superadmin@gmail.com"){
      this.state.setState(prevState => ({
        amodal: !prevState.amodal,type : "withdraw",
        selected : this.selected
      }))
    }
    
  }

  handleRowsPerPage = value => {
    let { parsedFilter, pagenationchange } = this.props;
    let page = parsedFilter.page ? parsedFilter.page : 1
    history.push(`${history.location.pathname}?page=${page}&perPage=${value}`);
    this.setState({ rowsPerPage: value })
    pagenationchange({ page: page, perPage: value })
  }

  handleSidebar = (boolean, addNew = false) => {
    this.setState({ sidebar: boolean })
    if (addNew === true) this.setState({ currentData: null, addNew: true })
  }

  handleCurrentData = obj => {
    this.setState({ currentData: obj })
    this.handleSidebar(true)
  }

  handlePagination = page => {
    let { parsedFilter, pagenationchange } = this.props
    let perPage = parsedFilter.perPage !== undefined ? parsedFilter.perPage : 10
    let urlPrefix =history.location.pathname
    history.push(`${urlPrefix}?page=${page.selected + 1}&perPage=${perPage}`)
    pagenationchange({ page: page.selected + 1, perPage: perPage })
    this.setState({ currentPage: page.selected })
  }

  resetpassword = (row) =>{
    this.setState(prevState => ({
      modal: !prevState.modal,
      selected : row
    }))
  }

  resetpassword_action = (e) =>{
    e.preventDefault();
    if (this.state.password1 === this.state.password2){
      var row = Object.assign({},{password : this.state.password1,email : this.state.selected.email});
      this.setState({modal : !this.state.modal})
      this.props.resetpass(this.props.parsedFilter,row);
    }else{
      toast.warn("Please enter correct password.");
    }
  }

  toggleModal = () => {
    this.setState(prevState => ({
      modal: !prevState.modal
    }))
  }

  atoggleModal = () => {
    this.setState(prevState => ({
      amodal: !prevState.amodal
    }))
  }

  amountaction(){
    if( this.state.type === "withdraw" && parseInt(this.state.amount) > this.state.selected.balance ){
      toast.error("Please enter correct amount");
      return;
    }else{
      this.setState(prevState => ({
        amodal: !prevState.amodal
      }))
      switch(this.state.type){
        case "deposit":
          this.props.depositaction({comment : this.state.comment, amount : parseInt(this.state.amount),email : this.state.selected.email,username : this.state.selected.username,amounttype : this.state.Amount_type},this.props.parsedFilter,this.state.filters);
        break;
        case "withdraw":
          this.props.withdrawaction({comment : this.state.comment,amount : parseInt(this.state.amount),email : this.state.selected.email,username : this.state.selected.username,amounttype : this.state.Amount_type},this.props.parsedFilter,this.state.filters);
        break;
        default:
          break;
      }
    }
  }

  render() {
    let { columns,data,totalPages,rowsPerPage,currentData,sidebar,totalRecords,sortIndex} = this.state;
    return (
    <>
      <Modal isOpen={this.state.modal} toggle={this.toggleModal} className="modal-dialog-centered" >
        <Form className="" action="#" onSubmit={this.resetpassword_action}>
          <ModalHeader toggle={this.toggleModal} className="bg-primary">
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

        <Modal isOpen={this.state.amodal} toggle={this.atoggleModal}className="modal-dialog-centered modal-sm">
          <ModalHeader toggle={this.atoggleModal} className="bg-primary">
            {this.state.type}
          </ModalHeader>
          <ModalBody className="modal-dialog-centered d-block">
            <Col md="12">
              <Label >AMOUNT TYPE</Label>
              <Select className="React" classNamePrefix="select" options={Amount_Types} value={Amount_Types.find(obj => obj.value === this.state.Amount_type)}
              defaultValue={Amount_Types[0]} onChange={e => this.setState({ Amount_type: e.value })} />
            </Col>
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
        {...this.props}
        handleFilter={this.handleFilter}
        handleRowsPerPage={this.handleRowsPerPage}
        rowsPerPage={rowsPerPage}
        total={totalRecords}
        state={this.state}
        handleSidebar={this.handleSidebar}
        index={sortIndex}
        parsedFilter={this.props.parsedFilter}
        Filterapply = {this.props.getData}
      />
      <div id="admindata_table" className={`data-list list-view`}>
        <DataTable
          columns={columns}
          data={ data}
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
          selectableRows
          selectableRowsHighlight
          onSelectedRowsChange={data => this.setState({ selectedRows: data.selectedRows }) }
          customStyles={selectedStyle}
          subHeaderComponent={
            <CustomHeader
              handleFilter={this.handleFilter}
              handleRowsPerPage={this.handleRowsPerPage}
              dataList={this.props.dataList}
              rowsPerPage={rowsPerPage}
              total={totalRecords}
              handleSidebar={this.handleSidebar}
              me={this.state}
              index={sortIndex}
              multiblock={this.props.multiblockaction}
              multidelete={this.props.multideleteaction}
              parsedFilter={this.props.parsedFilter}
            />
          }
          sortIcon={<ChevronDown />}
        />

        <Sidebar
          show={sidebar}
          data={currentData}
          me={this.state}
          updateData={this.props.updateData}
          addData={this.props.addData}
          handleSidebar={this.handleSidebar}
          thumbView={this.props.thumbView}
          dataParams={this.props.parsedFilter}
          addNew={this.state.addNew}
        />
        <div className={classnames("data-list-overlay", {show: sidebar})}  onClick={() => this.handleSidebar(false, true)} />
      </div>
    </>
    )
  }
}

const mapStateToProps = state => {
  return {
    dataList: state.userslist.users,
    permission : state.userslist.permission.permissiondata,
    setting : state.setting.global

  }
}

export default connect(mapStateToProps, { getData, filterData,pagenationchange,resetpass,multiblockaction,multideleteaction,depositaction,withdrawaction})(ListViewConfig)