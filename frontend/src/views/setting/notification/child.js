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
import { ChevronDown,  ChevronLeft,  ChevronRight,Trash,Edit, MessageCircle} from "react-feather"
import { connect } from "react-redux"
import {  getData,save,update ,Delete,getTotal ,resend} from "../../../redux/actions/settting/notification"
import {selectedStyle,pagenation_set} from "../../../configs/providerconfig"
import confirm from "reactstrap-confirm"
import Select from "react-select"


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
      
        <Col md='3' className='justify-content-start align-items-center flex mt-1' >
          <Button color="primary" onClick={()=>props.add()}> Add Notification
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
          name : "userid",
          selector : "userid",
          sortable: true,
          minWidth: "150px",
        },
        {
          name : "title",
          selector : "title",
          sortable: true,
          minWidth: "150px",
        },
        {
          name : "body",
          selector : "body",
          sortable: true,
          minWidth: "150px",
        },
        {
          name: "Actions",
          minWidth: "100px",
          sortable: false,
          cell: row => (
            <div className="data-list-action d-block">
              <Button.Ripple color='flat-success' onClick={()=>this.rowEdit(row)}>
                <Edit size={14} />
                <span className='align-middle ml-25'  >Edit</span>
              </Button.Ripple>
              <Button.Ripple color='flat-success' onClick={()=>this.Resend(row)}>
                <MessageCircle size={14} />
                <span className='align-middle ml-25'>Resend</span>
              </Button.Ripple>
              <Button.Ripple color='flat-success'  onClick={()=>this.rowDelete(row)}>
                <Trash size={14} />
                <span className='align-middle ml-25'>Delete</span>
              </Button.Ripple>
            </div>
          )
        },
      ],
      modal : false,
      update : false,
      filters : {
        userid : "0"
      },
      userid : "All",
      title : "",
      body : "",
      expiredAt  :"",
      id : "",

    }

    componentDidMount(){
      this.props.getData(this.props.parsedFilter,this.state.filters)
      this.props.getTotal()
    }

    rowEdit = (item) =>{
      this.setState({
        update : true,
        modal : !this.state.modal,
        id : item._id,
        body : item.body,
        title : item.title,
        userid : item.userid,

      })
    }

    rowDelete = async (item) =>{
      let res = await confirm();
      if (res) {
        this.props.Delete(item,this.props.parsedFilter,this.state.filters)
      } 
    }

    Resend = (item) => {
      this.props.resend(item, this.props.parsedFilter);
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
      let { parsedFilter, getData } = this.props;
      let page = parsedFilter.page !== undefined ? parsedFilter.page : 1;
      history.push(`${history.location.pathname}?page=${page}&perPage=${value}`)
      var params = { page: page, perPage: value };
      getData(params,this.state.filters);
    }

    toggleModal = () => {
      this.setState({modal  :!this.state.modal})
    }

    handleSubmit = (e) => {
      e.preventDefault();
      this.toggleModal()
      let row ={
        title : this.state.title,
        body : this.state.body,
        userid  : this.state.userid
      }
      if (this.state.update) {
        row['_id'] = this.state.id;
        this.props.update(row,this.props.parsedFilter);
      } else {
        this.props.save(row,this.props.parsedFilter);
      }


    }

    render() {
    let { columns,data,totalPages ,useroptions} = this.state;

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
            <Form onSubmit={this.handleSubmit} action="#" >
                <ModalHeader toggle={() => this.toggleModal()}>
                   Notification
                </ModalHeader>
                <ModalBody className="mt-1">
                
                  <Col md="12" >
                    <Label>useroptions</Label>
                    <FormGroup className="form-label-group">
                      <Select
                        value={ useroptions ?  useroptions.find(obj=>obj.value === this.state.userid) : []}
                        options={useroptions}
                        onChange={e =>this.setState({userid : e.value})}
                        className="React"
                        classNamePrefix="select"
                      />
                    </FormGroup>
                  </Col>
                

                <Col md="12">
                  <FormGroup className="form-label-group">
                    <Input
                        type="text"
                        placeholder="title"
                        value={this.state.title}
                        onChange={e => this.setState({ title : e.target.value })}
                        required
                    />
                    <Label>title</Label>
                  </FormGroup>
                </Col>
                <Col md="12">
                  <FormGroup className="form-label-group">
                    <Input
                        type="text"
                        placeholder="body"
                        value={this.state.body}
                        onChange={e => this.setState({ body : e.target.value })}
                        required
                    />
                    <Label>body</Label>
                  </FormGroup>
                </Col>
{/* 
                <Col md="12">
                  <FormGroup className="form-label-group">
                    <Input
                        type="text"
                        placeholder="expiredAt"
                        value={this.state.expiredAt}
                        onChange={e => this.setState({ expiredAt : e.target.value })}
                        required
                    />
                    <Label>expiredAt</Label>
                  </FormGroup>
                </Col>
                */}
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
    dataList: state.setting.notification
  }
}

export default connect(mapStateToProps, { getData,save,update ,Delete,getTotal,resend})(ListViewConfig)
