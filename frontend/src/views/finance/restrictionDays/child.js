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
import {  getData,save,update ,Delete } from "../../../redux/actions/finance/resstrictiondays"
import {selectedStyle,pagenation_set } from "../../../configs/providerconfig"
import confirm from "reactstrap-confirm"
import Flatpickr from "react-flatpickr"

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
          <Button color="primary" onClick={()=>props.add()}> Add date
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
          name : "Restriction Date",
          selector : "RestrictionDate",
          sortable: true,
          minWidth: "300px",
        },
        {
          name : "comment",
          selector : "comment",
          sortable: true,
          minWidth: "200px",
        },

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
      isChecked : false,
      comment : "",
      type : this.props.type,
      RestrictionDate : new Date(),
      id : "",
      filters : {
        type : this.props.type,
      }
    }

    componentDidMount(){
      this.props.getData(this.props.parsedFilter,this.props.type)
    }

    rowEdit = (item) =>{
      this.setState({
        update : true,
        modal : !this.state.modal,
        id : item._id,
        RestrictionDate : new Date(item.RestrictionDate),
        comment : item.comment,
      })
    }

    rowDelete = async (item) =>{
      let res = await confirm();
      if (res) {
        this.props.Delete(item,this.props.parsedFilter,this.props.type)
      } 
    }

    handlePagination = page => {
      let { parsedFilter, getData } = this.props;
      let perPage = parsedFilter.perPage !== undefined ? parsedFilter.perPage : pagenation_set[0];
      let urlPrefix =`${history.location.pathname}`;
      history.push( `${urlPrefix}?page=${page.selected + 1}&perPage=${perPage}`);
      var params = { page: page.selected + 1, perPage: perPage };
      getData(params,this.props.type);
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
      getData(params,this.props.type);
    }

    toggleModal = () =>{
      this.setState({modal : !this.state.modal})
    }


    accontsave = (e) =>{
      e.preventDefault();

      let row = {
        RestrictionDate : (this.state.RestrictionDate).toDateString(),
        comment : this.state.comment,
        type : this.state.type
      }

      this.toggleModal()
      if (!this.state.update) {
        this.props.save(row,this.props.parsedFilter,this.props.type)
      } else {
        row["_id"] = this.state.id;
        this.props.update(row,this.props.parsedFilter,this.props.type)
      }
    }

    render() {
    let { columns,data,totalPages } = this.state;
   

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
                add={()=>this.setState({modal : !this.state.modal , update : false , })}
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
                    Restrictino Date
                </ModalHeader>
                <ModalBody className="mt-1">
              
                <Col md="12">
                  <FormGroup className="form-label-group">
                    <Label>RestrictionDate</Label>
                    <Flatpickr value={this.state.RestrictionDate} className="form-control"  onChange={date =>this.setState({RestrictionDate : date[0]})} />
                  </FormGroup>
                </Col>
                <Col md="12">
                  <FormGroup className="form-label-group">
                    <Input
                        type="textarea"
                        placeholder="comment"
                        value={this.state.comment}
                        onChange={e => this.setState({ comment : e.target.value })}
                        required
                    />
                    <Label>comment</Label>
                  </FormGroup>
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
    dataList: state.finance.restrictiondays
  }
}

export default connect(mapStateToProps, { getData,save,update ,Delete})(ListViewConfig)
