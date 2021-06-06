import React, { Component } from "react"
import {UncontrolledDropdown,  DropdownMenu,  DropdownToggle,  Form,DropdownItem,Col,Row, Button, Modal, 
    ModalHeader, 
    ModalBody, 
    ModalFooter,
    FormGroup,
    Input,
    Label,
} from "reactstrap"
import DataTable from "react-data-table-component"
import ReactPaginate from "react-paginate"
import { history } from "../../../history"
import { ChevronDown,  ChevronLeft,  ChevronRight,Trash,Edit} from "react-feather"
import { connect } from "react-redux"
import {  getData,save,update ,Delete,getTotal } from "../../../redux/actions/finance/bankdetail"
import {selectedStyle,pagenation_set } from "../../../configs/providerconfig"
import confirm from "reactstrap-confirm"
import Select from "react-select"
import {alert} from "../../../redux/actions/auth"

const CustomHeader = props => {
  let {totalRecords,sortIndex,useroptions} = props.dataList;
  let state = props.filters;
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
        <Col md="3" className='justify-content-start align-items-center flex'>
          <Label>useroptions</Label>
          <Select
            value={ useroptions ?  useroptions.find(obj=>obj.value === state.userid) : []}
            options={useroptions}
            onChange={e =>this.userchange(e.value)}
            className="React"
            classNamePrefix="select"
          />
        </Col>
        <Col md='3' className='justify-content-start align-items-center flex mt-1' >
          <Button color="primary" onClick={()=>props.add()}> Add Account
          </Button>        
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
          name : "email",
          selector : "email",
          sortable: true,
          minWidth: "150px",
          cell : row => (
            <div className="textstyle">
              {row.userid ? row.userid.email : ""}
            </div>
          )
        },

        {
          name : "accountName",
          selector : "accountName",
          sortable: true,
          minWidth: "100px",
          cell : row => (
            <div className="textstyle">
              {row.paymentData ? row.paymentData.accountName : ""}
            </div>
          )
        },

        {
          name : "accountNumber",
          selector : "accountNumber",
          sortable: true,
          minWidth: "100px",
          cell : row => (
            <div className="textstyle">
              {row.paymentData ? row.paymentData.accountNumber : ""}              
            </div>
          )
        },
        {
          name : "IfscCode",
          selector : "IfscCode",
          sortable: true,
          minWidth: "100px",
          cell : row => (
            <div className="textstyle">
              {row.paymentData ? row.paymentData.IfscCode : ""}              
            </div>
          )
        },
        // {
        //   name : "Yaarpay Code",
        //   selector : "depositBankCode",
        //   sortable: true,
        //   minWidth: "100px",
        //   cell : row => (
        //     <div >
        //       {row.paymentData ? row.paymentData.depositBankCode : ""}              
        //     </div>
        //   )
        // },
        // {
        //   name : "Paymoro code",
        //   selector : "paymerodepositBankCode",
        //   sortable: true,
        //   minWidth: "100px",
        //   cell : row => (
        //     <div >
        //       {row.paymentData ? row.paymentData.paymerodepositBankCode : ""}              
        //     </div>
        //   )
        // },
        {
          name: "Actions",
          minWidth: "100px",
          sortable: false,
          cell: row => (
            <div className="data-list-action">
              <Edit  className="cursor-pointer mr-1" size={20} onClick={()=>this.rowEdit(row)} />
              <Trash className="cursor-pointer mr-1" size={20} onClick={()=>this.rowDelete(row)} />
            </div>
          )
        },
      ],
      modal : false,
      update : false,
      accountNumber : "",
      IfscCode : "",
      accountName : "",
      isChecked : false,
      id : "",
      useroptions : [],
      // depositBankCode : yaarpaybank[0].value,
      // paymerodepositBankCode : paymorobank[0].value,
      userid : "",
      filters : {
        userid : "",
      }
    }

    componentDidMount(){
      this.props.getData(this.props.parsedFilter,this.state.filters)
      this.props.getTotal(this.state.filters);
    }

    rowEdit = (item) =>{
      this.setState({
        accountNumber : item.paymentData ? item.paymentData.accountNumber : "",
        accountName : item.paymentData ? item.paymentData.accountName: "",
        IfscCode : item.paymentData ? item.paymentData.IfscCode: "",
        // depositBankCode : item.paymentData ? item.paymentData.depositBankCode: "",
        // paymerodepositBankCode : item.paymentData ? item.paymentData.paymerodepositBankCode: "",
        update : true,
        modal : !this.state.modal,
        id : item._id,
      })
    }

    rowDelete = async (item) =>{
      let res = await confirm();
      if (res) {
        this.props.Delete(item,this.props.parsedFilter,this.state.filters)
      } 
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
          useroptions : datalist.useroptions
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

    toggleModal = () =>{
      this.setState({modal : !this.state.modal})
    }

    handleSwitchChange = () =>{
      this.setState({isChecked : !this.state.isChecked})
    }

    accontsave = (e) =>{
      e.preventDefault();

      if ( !this.state.update && this.state.userid === "") {
        alert("select user","warn")
        return;        
      }

      if (this.state.depositBankCode === "") {
        alert("select bank","warn")
        return;     
      }

      let row = {
        accountName : this.state.accountName,
        accountNumber : this.state.accountNumber,
        IfscCode : this.state.IfscCode,
        // depositBankCode : this.state.depositBankCode,
        userid : this.state.userid,
        // paymerodepositBankCode : this.state.paymerodepositBankCode
      }

      this.toggleModal()
      if (!this.state.update) {
        this.props.save(row,this.props.parsedFilter,this.state.filters)
      } else {
        row["_id"] = this.state.id;
        this.props.update(row,this.props.parsedFilter,this.state.filters)
      }
    }

    render() {
    let { columns,data,totalPages ,useroptions} = this.state;
    var uoptions = [];
    if (useroptions.length > 0) {
      uoptions = useroptions;
      uoptions.slice(1);
    }

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
                add={()=>this.setState({modal : !this.state.modal , update : false , type : "" , accountName : "" , accountNumber : "", depositBankCode : "" , IfscCode : ""})}
              />
            }
            sortIcon={<ChevronDown />}
          />
        </div>

        <Modal
          isOpen={this.state.modal}
          toggle={() => this.toggleModal()}
          className={"modal-dialog-centered"}
        >
            <Form onSubmit={this.accontsave} action="#" >
                <ModalHeader toggle={() => this.toggleModal()}>
                    Payout Channel Edit
                </ModalHeader>
                <ModalBody className="mt-1">
                {
                  !this.state.update ?
                  <Col md="12" >
                    <FormGroup className="form-label-group">
                      <Label>useroptions</Label>
                      <Select
                        value={ uoptions ?  uoptions.find(obj=>obj.value === this.state.userid) : []}
                        options={uoptions}
                        onChange={e =>this.setState({userid : e.value})}
                        className="React"
                        classNamePrefix="select"
                      />
                    </FormGroup>
                  </Col>
                  : null
                }

                <Col md="12">
                  <FormGroup className="form-label-group">
                    <Input
                        type="text"
                        placeholder="accountName"
                        value={this.state.accountName}
                        onChange={e => this.setState({ accountName : e.target.value })}
                        required
                    />
                    <Label>accountName</Label>
                  </FormGroup>
                </Col>
                <Col md="12">
                  <FormGroup className="form-label-group">
                    <Input
                        type="text"
                        placeholder="accountNumber"
                        value={this.state.accountNumber}
                        onChange={e => this.setState({ accountNumber : e.target.value })}
                        required
                    />
                    <Label>accountNumber</Label>
                  </FormGroup>
                </Col>
                <Col md="12">
                  <FormGroup className="form-label-group">
                    <Input
                        type="text"
                        placeholder="IfscCode"
                        value={this.state.IfscCode}
                        onChange={e => this.setState({ IfscCode : e.target.value })}
                        required
                    />
                    <Label>IfscCode</Label>
                  </FormGroup>
                </Col>
                {/* <Col md="6">
                  <FormGroup className="position-relative">
                    <Label>yaarpaybank</Label>
                      <Select
                        value={ yaarpaybank ?  yaarpaybank.find(obj=>obj.value === this.state.depositBankCode) : []}
                        options={yaarpaybank}
                        onChange={e => this.setState({depositBankCode:e.value})}
                        className="React"
                        classNamePrefix="select"
                      />
                  </FormGroup>
                </Col>
                <Col md="6">
                  <FormGroup className="position-relative">
                    <Label>paymorobank</Label>
                      <Select
                        value={ paymorobank ?  paymorobank.find(obj=>obj.value === this.state.paymerodepositBankCode) : []}
                        options={paymorobank}
                        onChange={e => this.setState({paymerodepositBankCode:e.value})}
                        className="React"
                        classNamePrefix="select"
                      />
                  </FormGroup>
                </Col> */}

                
                </ModalBody>
                <ModalFooter>
                  <Button color='primary' type="submit" >
                    {
                      this.state.update ? 
                      "update" : "Accept"
                    }
                  </Button>
                </ModalFooter>
            </Form>
        </Modal>
      </React.Fragment>
    )
  }
}

const mapStateToProps = state => {
  return {
    dataList: state.finance.bankdetail
  }
}

export default connect(mapStateToProps, { getData,save,update ,Delete,getTotal})(ListViewConfig)
