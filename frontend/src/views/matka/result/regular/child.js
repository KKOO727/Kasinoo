import React, { Component } from "react"
import {  UncontrolledDropdown, DropdownMenu, DropdownToggle, DropdownItem, Table,Input, Col, Row, Button, Modal, ModalHeader, ModalBody, ModalFooter, Label, Form } from "reactstrap"
import {  ChevronDown, ChevronLeft, ChevronRight } from "react-feather"
import {  getData, menusave, menuupdate, menudelete,allresult,todayresult, revenuCalc } from "../../../../redux/actions/matka/result/regular"
import DataTable from "react-data-table-component"
import ReactPaginate from "react-paginate"
import { history } from "../../../../history"
import { connect } from "react-redux"
import {selectedStyle,pagenation_set} from "../../../../configs/providerconfig"
import Select from "react-select"
import Flatpickr from "react-flatpickr";
import {Onlydate} from "../../../../redux/actions/auth"
import {toast} from "react-toastify"

const CustomHeader = props => {
  let {totalRecords,sortIndex} = props.dataList;

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
      <Col xs="6" md="2" className="mt-1 text-right">
        <Button className="add-new-btn" color="primary" onClick={() => props.handleSidebar(true)} outline>
          Add New
        </Button>
      </Col>
      <Col xs="6" md="2" className="mt-1 text-right">
        <Button className="add-new-btn" color="primary" onClick={() => props.allresult()} outline>
          All Result
        </Button>
      </Col>
      <Col xs="6" md="2" className="mt-1 text-right">
        <Button className="add-new-btn" color="primary" onClick={() => props.todayresult()} outline>
          Today Result
        </Button>
      </Col>
    </Row>
  )
}

class Child extends Component {
  

    state = {
      data: [],
      columns: [
        {
          name: "resultdate",
          selector: "resultdate",
          sortable: false,
          minWidth: "150px",
          cell : row => (
            <div>
              {
                Onlydate(row.resultdate)
              }
            </div>
          )
        },
        {
            name: "bazaar",
            selector: "bazaarid.bazaarname",
            sortable: false,
            minWidth: "200px",
          },        
       
          {
            name: "openresult",
            selector: "openresult",
            sortable: false,
            minWidth: "100px",
          },
          {
            name: "jodiresult",
            selector: "jodiresult",
            sortable: false,
            minWidth: "50px",
          },
          {
            name: "closeresult",
            selector: "closeresult",
            sortable: false,
            minWidth: "100px",
          },
        {
          name: "Actions",
          minWidth: "50",
          sortable: false,
          cell: row => (
            <div className="data-list-action">
              {
                row.update ? 
                <Button disabled={true}  color="primary" outline>
                  Rollback
                </Button>
                : 
                  row.closeresult && row.closeresult.length ? 
                  <Button  color="primary" outline onClick={()=>this.rowEdit(row)}>
                    Rollback
                  </Button> 
                  :
                  <Button  color="primary" outline onClick={()=>this.rowEdit(row)}>
                    Edit
                  </Button> 
              }
            </div>
          )
        },
      ],
      sidebar: false,
      currentData: null,
      selected: [],
      totalRecords: 0,
      addNew: "",
      modal: false,
      update : false,
      rowid : "",
      bazaarid : "",
      openresult : "",
      closeresult : "",
      jodiresult : "",
      resultshow : null,
      lastupdate : false,
      filters  :{
        date : new Date(),
        bazaartype : this.props.bazaartype
      },
      numberoptions : [],
      revenus : []
    }

    componentDidMount(){
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
          numberoptions : datalist.numberoptions
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
      }))
    }

  

    handleSubmit = async (e)=>{
      e.preventDefault();
      let openresult = this.state.openresult.toString();
      if (openresult.length && this.state.bazaarid.length ) {
        this.setState(prevState => ({
          modal: !prevState.modal
        }));
        var row = Object.assign({},
          {bazaarid :this.state.bazaarid},
          {openresult : this.state.openresult},
          {jodiresult:this.state.jodiresult}
        );
        if (!this.state.update) {
          this.props.menusave(row,this.props.parsedFilter,this.state.filters);
        } else {
          row['_id'] = this.state.rowid;
          row['closeresult'] = this.state.closeresult;
          this.props.menuupdate(row,this.props.parsedFilter,this.state.filters)
        }
      }
    }

    rowEdit(row){
      console.log(row)
      let filters = this.state.filters;
      filters['date'] = row.resultdate;
      this.setState({
        bazaarid : row.bazaarid._id,
        modal : true,
        rowid : row._id,
        update : true,
        lastupdate : row.update,
        openresult : row.openresult,
        closeresult : row.closeresult,
        jodiresult : row.jodiresult,
        filters : filters
      });
    }

    handleSwitchChange = () => {
      this.setState({
        isChecked: !this.state.isChecked
      })
    }

    toggleTooltip = () => {
      this.setState({
        tooltipOpen: !this.state.tooltipOpen
      })
    }

    Change_result = async (number,bool) =>{

      const {bazaarid} = this.state;
      if (bazaarid && bazaarid.length) {
        
        number = number.toString();
        if (bool) {
          let mod =( parseInt(number[0]) + parseInt(number[1]) + parseInt(number[2]) )%10       
          let num = this.state.jodiresult;
          if(num && num.length > 1) {
              num =  mod + num[1];
          }else{
              num = mod + "";
          }
          this.setState({openresult : number,jodiresult : num})
          let row={
            bazaarid : this.state.bazaarid,
            jodiresult : num,
            openresult : number,
            filters : this.state.filters,
          }
          let rows = await this.props.revenuCalc(row);
          this.setState({revenus : rows})

        } else {
          let mod =( parseInt(number[0]) + parseInt(number[1]) + parseInt(number[2]) )%10       
          let num = this.state.jodiresult;
          if (num && num.length > 0){
              num =   num[0] + mod;
          }
          this.setState({closeresult : number,jodiresult : num})

          let row={
            bazaarid : this.state.bazaarid,
            jodiresult : num,
            openresult : this.state.openresult,
            filters : this.state.filters,
            closeresult : number
          }
          let rows = await this.props.revenuCalc(row);
          this.setState({revenus : rows})
        }
      } else {
        toast.warn("Please select bazar ")
      }

    }


    dateChange = async (date) => {
      let filters = this.state.filters;
      filters['date'] = date[0];
      this.setState({filters : filters});

      let row={
        bazaarid : this.state.bazaarid,
        jodiresult : this.state.jodiresult,
        openresult : this.state.openresult,
        filters : filters,
        closeresult : this.state.closeresult
      }
      let rows = await this.props.revenuCalc(row);
      this.setState({revenus : rows})
    }

    ChangeBazar = async (id) =>{
      this.setState({ bazaarid: id });
      let row={
        bazaarid : id,
        jodiresult : this.state.jodiresult,
        openresult : this.state.openresult,
        filters : this.state.filters,
        closeresult : this.state.closeresult
      }
      let rows = await this.props.revenuCalc(row);
      this.setState({revenus : rows})
    }

    revenusRender = () => {
      let {revenus } = this.state;
      console.log(revenus )
      return <React.Fragment>
        {
          revenus && revenus.length ? 
          <Col md="12" className=" mt-1">
              <Table  responsive bordered>
                <thead>
                  <tr>
                    <td> Game Type
                    </td>
                    <td>
                        Result
                    </td>
                    <td>
                      Profit :
                    </td>
                    <td>
                    No of unique winners :  
                    </td>
                  </tr>
                </thead>
                <tbody>
                  {
                    revenus.map((item,i)=>(
                      <tr key={i}>
                       
                        <td>
                          {
                            item.name
                          }
                        </td>
                        <td>
                        {
                            item.result
                          }
                        </td>
                        <td>
                          {
                            item.PROFIT
                          }
                        </td>
                        <td>
                        {
                            item.NoOfWinusers
                          }
                        </td>
                      </tr>
                    ))
                  }
                </tbody>
              </Table>
          </Col>
          : null
        }
      </React.Fragment>  
    }

    render() {
      let { columns, data,totalPages, update , numberoptions,lastupdate} = this.state;
      let {bazaarlist} = this.props.dataList;
      
      return (
        <div  id="admindata_table"  className={`data-list list-view`}>
            <Modal isOpen={this.state.modal} toggle={this.toggleModal} className="modal-dialog-centered" >
                <Form onSubmit={this.handleSubmit}  action={history.location.pathname} >
                    <ModalHeader toggle={this.toggleModal} className="bg-primary">
                        Create Result
                    </ModalHeader>
                    <ModalBody className="modal-dialog-centered mt-1 d-block">
                        <Row>
                          {
                            !update ? 
                            <Col md='12'>
                              <Label for="select Bazaar">Bazaar Date</Label>
                              <Flatpickr  className="form-control" value={this.state.filters.date}
                                  onChange={date => { this.dateChange(date); }} />
                            </Col>
                            : null
                          }
                          {
                            !update && bazaarlist ? 
                            <Col md='12' className="mt-1">
                              <Label for="select Bazaar">Bazaar</Label>
                              <Select className="React" classNamePrefix="select"  name="select Bazaar" options={bazaarlist}
                                  value={bazaarlist.find(obj => obj.value === this.state.bazaarid)} onChange={e => this.ChangeBazar(e.value)} />
                            </Col>
                            : null
                          }
                          {
                            update ? 
                            <Col  md="12">
                                <Label for="Bazaar">Bazaar</Label>
                                <Input type="text" name="Bazaar" id="Bazaar" placeholder="Bazaar"
                                    disabled={true}
                                    value = {bazaarlist.find(obj => obj.value === this.state.bazaarid) ? bazaarlist.find(obj => obj.value === this.state.bazaarid).label : ""}
                                />
                            </Col>
                            : null
                          }
                          <Col md="12" className="mt-1">
                            <Row>
                              <Col md="5">
                                <Label>open result</Label>
                                <Select className="React" classNamePrefix="select"  name="startLinetimer" 
                                  options={numberoptions}
                                  value={numberoptions.find(obj => (obj.value).toString() === this.state.openresult.toString())} 
                                  onChange={e => this.Change_result(e.value,true)} />
                              </Col>
                              <Col md="2">
                                <Label>jodi</Label>
                                <Input type="number" placeholder="Jodi" value={this.state.jodiresult}
                                disabled={true}
                                onChange={e => this.setState({ jodiresult: e.target.value })} required />
                              </Col>

                              {
                                update ? 
                                <Col md="5">
                                  <Label>close result</Label>
                                  <Select className="React" classNamePrefix="select"  name="startLinetimer" 
                                    options={numberoptions}
                                    value={numberoptions.find(obj => (obj.value).toString() === this.state.closeresult.toString())} 
                                    onChange={e => this.Change_result(e.value,false)} />
                                </Col>
                                : null
                              }
                                
                            </Row>
                          </Col>
                          {
                            this.revenusRender()
                          }
                        </Row>
                        
                        
                    </ModalBody>
                    <ModalFooter>
                      <Button color="primary" type="submit">
                        {
                          lastupdate ? 
                            "Rollback" :
                            update ? "Update" :  "Accept"
                        }
                      
                      </Button> 
                    </ModalFooter>
                </Form>
            </Modal>
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
                      handleFilter={this.handleFilter}
                      handleRowsPerPage={this.handleRowsPerPage}
                      parsedFilter={this.props.parsedFilter}
                      handleSidebar={()=>this.setState({modal : !this.state.modal , jodiresult : "", openresult :"", closeresult : ""})}
                      allresult={()=>this.props.allresult(this.props.parsedFilter,this.state.filters)}
                      todayresult={()=>this.props.todayresult(this.props.parsedFilter,this.state.filters)}
                      dataList={this.props.dataList}
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
    dataList: state.matka.Result.regular,
  }
}

export default connect(mapStateToProps, {getData,menusave,menuupdate,menudelete,allresult,todayresult, revenuCalc})(Child)