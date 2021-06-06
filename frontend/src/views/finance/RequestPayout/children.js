import React, { Component } from "react"
import DataTable from "react-data-table-component"
import ReactPaginate from "react-paginate"
import Select from "react-select"
import {UncontrolledDropdown, Badge, DropdownMenu,Table, DropdownToggle, DropdownItem, Col, Row, FormGroup, Label, Button, Input, Modal, ModalBody, ModalHeader, ModalFooter } from "reactstrap"
import { ChevronDown,  ChevronLeft,  ChevronRight } from "react-feather"
import { connect } from "react-redux"
import { getData, filterData, Payout ,request_payout_show,getTotal} from "../../../redux/actions/Players/request_payout"
import { history } from "../../../history"
import {selectedStyle,pagenation_set,PaymentStatus_bool,status_color} from "../../../configs/providerconfig"
import Toggle from "react-toggle"
import {Root} from "../../../authServices/rootconfig";
import DatePicker from "../../lib/datepicker"
import {dateConvert} from "../../../redux/actions/auth"
const prefix = Root.prefix;

const CustomHeader = props => {
  let {totalRecords,sortIndex} = props.dataList;
  let total =props.dataList.total.total
  return (
    <div className='p-1 pt-2 pb-2'>
      <Row>
        <Col  md='12' sm='12' xs='12'>
          <Table responsive bordered >
            <tbody>
              {
                total && total.length > 0 ? 
                total.map((item,i)=>(
                  <tr className="table-info" key={i}>
                      <td>
                        {
                          item["type"]                          
                        }
                      </td>
                      {
                        item["value"] ? Object.keys(item["value"]).map((itemj,j)=>(
                          <td key={j}>
                            { itemj }
                            <br /> 
                            Amt( { item["value"][itemj] ?  item["value"][itemj].index : null}  )  {item["value"][itemj] ? item["value"][itemj].amount : null}
                          </td>
                        ))
                        : null
                      }
                  </tr>                
                ))
                  : null
                }
            </tbody>
          </Table> 
        </Col>

      </Row>
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
      </Row>
      
    </div>
  )
}


const FilterComponent = props =>{
  let useroptions = props.dataList.total && props.dataList.total.useroptions && props.dataList.total.useroptions.length > 0 ? props.dataList.total.useroptions : [];
  let statusoptions = props.dataList.total && props.dataList.total.statusoptions && props.dataList.total.statusoptions.length > 0 ? props.dataList.total.statusoptions : [];
  return (
      <Row>
        <Col  md='6' sm='12' xs='12'>
          <FormGroup>
            <Label for="Registration Date">Select Date</Label> 
            <DatePicker  onChange={date => { props.datechange([date.start,date.end],"dates") }} />
          </FormGroup>
        </Col>

        <Col md='3' sm='6' xs='12'>
          <FormGroup>
            <Label for="user">User Name</Label>
            <Select className="React" classNamePrefix="select" name="userid" 
              options={useroptions}
              value={useroptions.find(obj => obj.value === props.filters.userid)}
              onChange={e => props.handleFilter(e.value,"userid")}
            />
          </FormGroup>
        </Col>

        <Col md='3' sm='6' xs='12'>
          <FormGroup>
            <Label for="user">Status</Label>
            <Select className="React" classNamePrefix="select" name="status" 
              options={statusoptions}
              value={statusoptions.find(obj => obj.value === props.filters.status)}
              onChange={e => props.handleFilter(e.value,"status")}
            />
          </FormGroup>
        </Col>
      </Row>
  )
}

class ListViewConfig extends Component {
  
  state = {
    columns: [
      {
        name: "Actions",
        minWidth: "50",
        sortable: false,
        cell: row => (
          <Badge onClick={()=>this.rowEdit(row)} color="light-success" pill>
            Payout
          </Badge>
        )
      },
      {
        name: "id",
        selector: "id",
        sortable: true,
        minWidth: "50px",
        cell: row => (
          <div className="textstyle" style={{textDecoration:"underline"}} onClick={()=>this.props.request_payout_show(row)}> 
            { prefix + row.userid.signup_device} {"-"}{row.userid.fakeid}
          </div>
        )
      },
      {
        name: "username",
        selector: "username",
        sortable: true,
        minWidth: "50px",
        cell: row => (
          <>
            {row.userid.username}
          </>
        )
      },
      {
        name: "mobilenumber",
        selector: "mobilenumber",
        sortable: true,
        minWidth: "50px",
        cell: row => (
          <>
            {row.userid.mobilenumber}
          </>
        )
      },
      {
        name: "Verified By ",
        selector: "created",
        sortable: true,
        minWidth: "50px",
        cell: row => (
          <>
            {row.userid.created}
          </>
        )
      },
      
     
      {
        name : "email",
        selector : "email",
        sortable: true,
        minWidth: "200px"
      },
      {
        name : "amount",
        selector : "amount",
        sortable: true,
        minWidth: "100px",
      },
      {
        name : "type",
        selector : "type",
        sortable: true,
        minWidth: "100px",
      },
      {
        name : "status",
        selector : "status",
        sortable: true,
        minWidth: "100px",
        cell : row => (
          <Badge color={status_color[row.status]} pill>
            {
              row.status
            }
          </Badge>
        )
      },
      {
        name : "updated_mail",
        selector : "updated_mail",
        sortable: true,
        minWidth: "100px",
        cell : row => (
          <div>
            {
              row.resultData && row.resultData.createdby ? "verified " : "Not verified"
            }
          </div>
        )
      },
      {
        name: "comment",
        selector: "comment",
        sortable: false,
        minWidth: "100px",
        cell : row=>(
          <Input type="textarea" placeholder="comment" disabled={true} value={row.comment ? row.comment : "comment"} />
        )
      },
      {
        name : "lastbalance",
        selector : "lastbalance",
        sortable: true,
        minWidth: "100px",
      },
      {
        name : "updatedbalance",
        selector : "updatedbalance",
        sortable: true,
        minWidth: "100px",
      },
      {
        name : "Requested at",
        selector : "createDate",
        sortable: true,
        minWidth: "100px",
        cell : row => (
          <div>
            {
              row.resultData && row.resultData.verify ? "verified " : "Not verified"
            }
          </div>
        )
      },
      {
        name : "Requested at",
        selector : "createDate",
        sortable: true,
        minWidth: "100px",
        cell : row => (
          <div>
            {dateConvert(row.createDate)} 
          </div>
        )
      },
    ],
    filters : {
      dates:[new Date(),new Date(new Date().valueOf() + 60 * 60 * 24 * 1000)],
      userid : "",
      status : ""
    },
    data: [],
    modal : false,
    payoutData:{},
    verify : false,
    comment : ""
  }
  
  
  componentDidMount(){
    this.props.getTotal(this.state.filters)
    this.props.getData(this.props.parsedFilter,this.state.filters)
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

  handleFilter = (value,bool) => {
    let filters = this.state.filters;
    filters[bool] = value;
    this.setState({filters : filters});
    this.props.getData(this.props.parsedFilter,filters);
    this.props.getTotal(this.state.filters);
  }

  datechange = (value) =>{
    let filters = this.state.filters;
    filters["dates"] = value;
    this.setState({filters : filters});
    this.props.getTotal(filters);
    this.props.getData(this.props.parsedFilter,filters);
  }
  
  rowEdit(row){
    this.setState({modal : true,payoutData:row});
  }

  handleSwitchChange = () => {
    this.setState({
      verify: !this.state.verify
    })
  }

  async Payout(e){
    this.setState({modal : !this.state.modal});
    var row =  this.state.payoutData;
    row['verify'] = this.state.verify;
    row['comment'] = this.state.comment;
    await this.setState({payoutData : row});
    var request = Object.assign({}, this.state.payoutData, {status:e});
    this.props.Payout(request,this.state.filters,this.props.parsedFilter);
  }

  render() {
    let { columns, data, totalPages, } = this.state
    return (
      <>
        <FilterComponent 
          handleFilter={this.handleFilter}
          dataList={this.props.dataList}
          datechange={this.datechange}
          filters = {this.state.filters}
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
                />
              }
              sortIcon={<ChevronDown />}
            />
          </div>

        <Modal isOpen={this.state.modal} toggle={()=>this.setState({modal:!this.state.modal})} className="modal-dialog-centered modal-lg">
          <ModalHeader toggle={()=>this.setState({modal:!this.state.modal})} className="bg-primary">
            PayOut
          </ModalHeader>
          <ModalBody className="modal-dialog-centered  mt-1">
            <Col md="12">
              <Row>
                <Col md="6">
                  <FormGroup className="position-relative">
                    <Label>Payment Method</Label>
                    <Input type="text" defaultValue={this.state.payoutData.type} disabled/>
                  </FormGroup>
                </Col>
                <Col md="6">
                  <FormGroup className="position-relative">
                    <Label>status</Label>
                    <Input type="text" defaultValue={this.state.payoutData.status} disabled/>
                  </FormGroup>
                </Col>
                <Col md="6">
                  <FormGroup className="position-relative">
                    <Label>Email</Label>
                    <Input type="text" defaultValue={this.state.payoutData.email} disabled/>
                  </FormGroup>
                </Col>
                <Col md="6">
                  <FormGroup className="position-relative has-icon-left">
                      <Label>Amount</Label>
                      <Input  type="text"  defaultValue={this.state.payoutData.amount}  disabled
                          />
                    <div className="form-control-position mt-2">
                      {this.state.payoutData.currency}
                    </div>
                  </FormGroup>
                </Col> 
                <Col md="6">
                  <FormGroup className="position-relative">
                    <Label>Requested at</Label>
                    <Input type="text" defaultValue={this.state.payoutData.createDate} disabled/>
                  </FormGroup>
                </Col>

                <Col md="6">
                  <FormGroup className="position-relative">
                    <Label></Label>
                    <label className="react-toggle-wrapper">
                    <Toggle
                      checked={this.state.verify}
                      onChange={this.handleSwitchChange}
                      name="controlledSwitch"
                      value="yes"
                    />
                    <Button.Ripple
                      color="primary"
                      onClick={this.handleSwitchChange}
                      size="sm"
                    >
                      {this.state.verify ? "Verified" : "Not Verified"}
                    </Button.Ripple>
                  </label>
                  </FormGroup>
                </Col>
                <Col md="12">
                  <FormGroup className="position-relative">
                    <Label>Comment</Label>
                    <Input type="textarea" value={this.state.comment} onChange={(e)=>this.setState({comment : e.target.value})}/>
                  </FormGroup>
                </Col>
              </Row>
            </Col>
          </ModalBody>
          <ModalFooter>
            {
              this.state.payoutData.status === PaymentStatus_bool.pending ||  this.state.payoutData.status === PaymentStatus_bool.Onhold ?
            <>
              <div className="d-inline-block mr-1 mb-1">
                <Button.Ripple className="square" outline color="warning" onClick={()=>this.Payout(PaymentStatus_bool.Approve)}>
                  Approve
                </Button.Ripple>
              </div>
              <div className="d-inline-block mr-1 mb-1">
                <Button.Ripple className="square" outline color="danger" onClick={()=>this.Payout(PaymentStatus_bool.Reject)}>
                  Reject
                </Button.Ripple>
              </div>
              <div className="d-inline-block mr-1 mb-1">
                <Button.Ripple className="square" outline color="primary" onClick={()=>this.Payout(PaymentStatus_bool.Paid)}>
                  Paid
                </Button.Ripple>
              </div>
              {
                this.state.payoutData.status !== PaymentStatus_bool.Onhold ?
                <div className="d-inline-block mr-1 mb-1">
                  <Button.Ripple className="square" outline color="primary" onClick={()=>this.Payout(PaymentStatus_bool.Onhold)}>
                  On Hold
                  </Button.Ripple>
                </div>   : null
              }
              
            </> :null

            }
          </ModalFooter>
        </Modal>
      </>
    )
  }
}

const mapStateToProps = state => { return { dataList: state.Players.request_payout }}

export default connect(mapStateToProps, { getData, filterData, Payout,request_payout_show,getTotal})(ListViewConfig)
