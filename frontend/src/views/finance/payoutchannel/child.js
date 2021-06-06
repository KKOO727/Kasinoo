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
import {  getData,save,update ,Delete,activechange } from "../../../redux/actions/finance/payoutchannel"
import {selectedStyle,pagenation_set} from "../../../configs/providerconfig"
import Toggle from "react-toggle"
import confirm from "reactstrap-confirm"
import Select from "react-select"

const CustomHeader = props => {
  let {totalRecords,sortIndex} = props.dataList;
  return (
    <div className='p-1 pt-2 pb-2'>
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
        <Col xs='6' className='justify-content-start align-items-center flex' md="3">
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
          name : "accountName",
          selector : "accountName",
          sortable: true,
          minWidth: "200px",
        },
        {
          name : "accountType",
          selector : "accountType",
          sortable: true,
          minWidth: "200px",
          cell : row =>(
            <div>
              {
                row.paymentconfigurationid ?  row.paymentconfigurationid.type : ""
              }
            </div>
          )
        },
        {
          name : "Status",
          selector : "status",
          sortable: true,
          minWidth: "100px",
          cell : row =>(
            <div>
                <label className="react-toggle-wrapper">
                  <Toggle
                      checked={row.status}
                      onChange={()=>this.activechange(row)}
                      name="controlledSwitch"
                      value="yes"
                  />
                  <Button.Ripple
                      color="primary"
                      onClick={()=>this.activechange(row)}
                      size="sm"
                  >
                    {row.status ? "Enable" : "Disable"}
                  </Button.Ripple>
                  </label>
            </div>
          )
        },
        {
          name: "Actions",
          minWidth: "200",
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
      accountName : "",
      accountType : "",
      isChecked : false,
      id : "",
      typeoptions : [],
      type : "",
      bank : "",
    }

    componentDidMount(){
      this.props.getData(this.props.parsedFilter)
    }

    rowEdit = (item) =>{
      this.setState({
        accountType : item.accountType,
        accountName : item.accountName,
        update : true,
        modal : !this.state.modal,
        isChecked : item.status,
        id : item._id,
        bank : item.bank,
        type : item.paymentconfigurationid ? item.paymentconfigurationid._id : "" 
      })
    }

    rowDelete = async (item) =>{
      let res = await confirm();
      if (res) {
        this.props.Delete(item,this.props.parsedFilter)
      } 
    }

    activechange = (row) =>{

      // if (!row.status) {
        let item = row;
        item["status"] = row.status ? false : true;
        this.props.activechange(item,this.props.parsedFilter)
      // }
    }

    handlePagination = page => {
      let { parsedFilter, getData } = this.props;
      let perPage = parsedFilter.perPage !== undefined ? parsedFilter.perPage : pagenation_set[0];
      let urlPrefix =`${history.location.pathname}`;
      history.push( `${urlPrefix}?page=${page.selected + 1}&perPage=${perPage}`);
      var params = { page: page.selected + 1, perPage: perPage };
      getData(params);
    }

    componentDidUpdate(preveProps,prevState){
      if(preveProps.dataList !== this.props.dataList){
        let datalist = this.props.dataList;
        this.setState({
          data : datalist.data,
          totalPages: datalist.totalPages,
          typeoptions : datalist.typeoptions
        })
      }
    }

    handleRowsPerPage = value => {
      let { parsedFilter, getData } = this.props
      let page = parsedFilter.page !== undefined ? parsedFilter.page : 1;
      history.push(`${history.location.pathname}?page=${page}&perPage=${value}`)
      var params = { page: page, perPage: value };
      getData(params);
    }

    toggleModal = () =>{
        this.setState({modal : !this.state.modal})
    }

    handleSwitchChange = () =>{
      this.setState({isChecked : !this.state.isChecked})
    }

    accontsave = (e) =>{
      e.preventDefault();
      let row = {
        accountName : this.state.accountName,
        accountType : this.state.accountType,
        status : this.state.isChecked,
        type : this.state.type,
        bank : this.state.bank
      }
      this.toggleModal()
      if (!this.state.update) {
        this.props.save(row,this.props.parsedFilter)
      } else {
        row["_id"] = this.state.id;
        this.props.update(row,this.props.parsedFilter)
      }
    }

    render() {
    let { columns,data,totalPages ,typeoptions} = this.state;
    let {paymoroBanks,     yaarpaybanks    } = this.props.dataList;

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
                add={()=>this.setState({modal : !this.state.modal , update : false , type : "" , accountName : ""})}
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
                    <Col md="6">
                        <FormGroup className="position-relative">
                          <Label>Type options</Label>

                            <Select
                                value={ typeoptions ?  typeoptions.find(obj=>obj.value === this.state.type) : []}
                                options={typeoptions}
                                onChange={e => this.setState({type:e.value})}
                                className="React"
                                classNamePrefix="select"
                            />
                        </FormGroup>
                    </Col>

                    {
                      this.state.type === "605560fb43770bfd4c901729" ?
                        <Col md="6">
                          <FormGroup className="position-relative">
                            <Label>Bank Options</Label>

                              <Select
                                  value={ paymoroBanks ?  paymoroBanks.find(obj=>obj.value === this.state.bank) : []}
                                  options={paymoroBanks}
                                  onChange={e => this.setState({bank:e.value})}
                                  className="React"
                                  classNamePrefix="select"
                              />
                          </FormGroup>
                      </Col>
                      : 
                      this.state.type === "5f5a5cc435738d220f573270" ?
                        <Col md="6">
                          <FormGroup className="position-relative">
                            <Label>Bank Options</Label>

                              <Select
                                  value={ yaarpaybanks ?  yaarpaybanks.find(obj=>obj.value === this.state.bank) : []}
                                  options={yaarpaybanks}
                                  onChange={e => this.setState({bank:e.value})}
                                  className="React"
                                  classNamePrefix="select"
                              />
                          </FormGroup>
                      </Col>
                      : null
                    }
                    
                    {/* <Col md="12">
                        <FormGroup className="form-label-group">
                            <Input
                                type="text"
                                placeholder="accountType"
                                value={this.state.accountType}
                                onChange={e => this.setState({ accountType : e.target.value })}
                                required
                            />
                            <Label>accountType</Label>
                        </FormGroup>
                    </Col> */}
                    <Col md="12">
                        <label className="react-toggle-wrapper">
                        <Toggle
                            checked={this.state.isChecked}
                            onChange={this.handleSwitchChange}
                            name="controlledSwitch"
                            value="yes"
                        />
                        <Button.Ripple
                            color="primary"
                            onClick={this.handleSwitchChange}
                            size="sm"
                        >
                            {this.state.isChecked ? "Enable" : "Disable"}
                        </Button.Ripple>
                        </label>
                    </Col>
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
    dataList: state.finance.payoutchannel
  }
}

export default connect(mapStateToProps, { getData,save,update ,Delete,activechange})(ListViewConfig)
