import React, { Component } from "react"
import {UncontrolledDropdown,  DropdownMenu,  DropdownToggle,  DropdownItem,Col,Row, FormGroup, Label  ,Modal,ModalBody ,Form,Button,ModalFooter,ModalHeader } from "reactstrap"
import DataTable from "react-data-table-component"
import ReactPaginate from "react-paginate"
import { history } from "../../../history"
import { ChevronDown,  ChevronLeft,  ChevronRight,Trash,} from "react-feather"
import { connect } from "react-redux"
import {  getData, menuupdate, menudelete } from "../../../redux/actions/CMS/topgames"
import {selectedStyle,pagenation_set} from "../../../configs/providerconfig"
import {Root} from "../../../authServices/rootconfig"
import Select from "react-select"

const ActionsComponent = props => {
  return (
    <div className="data-list-action">
        {/* <ArrowUp
         className="cursor-pointer mr-1"
         size={20}
         onClick={()=>props.rowArrowup(props.row)}
        />
        <ArrowDown
         className="cursor-pointer mr-1"
         size={20}
         onClick={()=>props.rowArrowDown(props.row)}
        /> */}

        {/* <Edit
         className="cursor-pointer mr-1"
         size={20}
         onClick={()=>props.rowEdit(props.row)}
        /> */}
        <Trash
         className="cursor-pointer mr-1"
         size={20}
         onClick={()=>props.rowDelete(props.row)}
        />

    </div>
  )
}


const CustomHeader = props => {
    let {totalRecords,sortIndex} = props.dataList;
     let typeoptions = props.dataList.typeoptions;
    let filters = props.filters
    return (
        <Row className="p-1">
            <Col xs="6" md="3">
            <UncontrolledDropdown className="data-list-rows-dropdown mt-1 d-block mb-1">
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
            <Col md='3' sm='6' xs='12'>
                <FormGroup>
                    <Label for="user">type</Label>
                    <Select className="React" classNamePrefix="select" name="typeid" 
                    options={typeoptions}
                    value={typeoptions.find(obj => obj.value === filters.typeid)}
                    onChange={e => props.handleFilter(e.value,"typeid")}
                    />
                </FormGroup>
            </Col>
        </Row>
    )
}

class Child extends Component {
    
    state = {
        data: [],
        columns: [
        //   {
        //     name: "order",
        //     selector: "order",
        //     sortable: false,
        //     minWidth: "100px",
        //   },
          {
            name: "PROVIDERID",
            selector: "PROVIDERID",
            sortable: false,
            minWidth: "100px",
          },
          {
            name: "TYPE",
            selector: "TYPE",
            sortable: false,
            minWidth: "100px",
          },
          {
            name: "NAME",
            selector: "NAME",
            sortable: false,
            minWidth: "100px",
          },
        
          {
            name: "image",
            selector: "image",
            sortable: true,
            minWidth: "170px",
            cell : params =>{ return (
              <img  src={ params.image ? params.image.length > 0 ? params.image.slice(0,5) === "https" ? params.image : Root.imageurl + params.image : "" : ""} height="100" width="150" alt={params.image} />
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
                rowArrowup ={this.rowArrowup}
                rowArrowDown ={this.rowArrowDown}
                rowDelete={this.rowDelete}
                rowEdit={this.rowEdit}

              />
            )
          },
        ],
        addNew: "",
        modal: false,
        rowid : "",
        type : "",
        isChecked : false,
        tooltipOpen : false,
        filters : {
            typeid : ""
        },
        typeoptions : []
    }

    componentDidMount(){
      this.props.getData(this.props.parsedFilter,this.state.filters)
    }

    handleFilter = (e,bool) => {
        let filters = this.state.filters;
        filters[bool] = e;
        this.setState({ filters: filters });
        this.props.getData(this.props.parsedFilter,this.state.filters);
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
            typeoptions : datalist.typeoptions
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
        if (!this.state.update) {

        } else {
            var row2 = {
                _id  :this.state.rowid,
                type : this.state.type
            }
            this.props.menuupdate([row2],this.props.parsedFilter,this.state.filters);
        }
    }

    rowDelete = (row) => {
        this.props.menudelete(row,this.props.parsedFilter,this.state.filters);
    }

    
    rowArrowup = (row) =>{
      var alldata = this.props.dataList.allData;
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
        this.props.menuupdate([first,last],this.props.parsedFilter,this.state.filters);
      }
    }

    rowArrowDown = (row) => {
      var alldata = this.props.dataList.allData;
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
        this.props.menuupdate([first,last],this.props.parsedFilter,this.state.filters);
      }
    }

    rowEdit = (row) =>{
      this.setState({modal : true,update : true, type : row.type, rowid : row._id});
    }


  render() {
    let { columns, data,totalPages ,typeoptions} = this.state
    return (
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
              filters = {this.state.filters}
              dataList={this.props.dataList}
            />
          }
          sortIcon={<ChevronDown />}
        />

        <Modal
          isOpen={this.state.modal}
          toggle={() => this.toggleModal()}
          className={"modal-dialog-centered"}
        >
            <Form onSubmit={this.handleSubmit} action="#" >
                <ModalHeader toggle={() => this.toggleModal()}>
                    Edit
                </ModalHeader>
                <ModalBody className="mt-1">
                    <Col md="12" >
                        <Label>type option</Label>
                        <FormGroup className="form-label-group">
                        <Select
                            value={ typeoptions ?  typeoptions.find(obj=>obj.value === this.state.type) : []}
                            options={typeoptions}
                            onChange={e =>this.setState({type : e.value})}
                            className="React"
                            classNamePrefix="select"
                        />
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
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    dataList: state.cms.topgames
  }
}

export default connect(mapStateToProps, {
    getData,
    menuupdate,
    menudelete
})(Child)