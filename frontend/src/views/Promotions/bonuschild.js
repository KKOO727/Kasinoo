import React, { Component } from "react"
import {  UncontrolledDropdown, DropdownMenu, DropdownToggle, DropdownItem, Input, Col, Row, Button, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Label, Form, Badge } from "reactstrap"
import {  ChevronDown, ChevronLeft, ChevronRight, Trash, Edit} from "react-feather"
import {  getData,  menusave, menuupdate, menudelete } from "../../redux/actions/promotions/Bonus/index"
import DataTable from "react-data-table-component"
import ReactPaginate from "react-paginate"
import { history } from "../../history"
import { connect } from "react-redux"
import Toggle from "react-toggle"
import {selectedStyle,pagenation_set} from "../../configs/providerconfig"
import Select from "react-select"

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
            <Button className="add-new-btn" color="primary" onClick={() => props.handleSidebar(true)} >
                Add New
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
                name: "Bonusname",
                selector: "Bonusname",
                sortable: false,
                minWidth: "150px",
                
            },
         
           
            {
                name: "percent",
                selector: "percent",
                sortable: false,
                minWidth: "50px",
            },
            {
                name: "min",
                selector: "min",
                sortable: false,
                minWidth: "50px",
            },
            {
                name: "max",
                selector: "max",
                sortable: false,
                minWidth: "50px",
            },
            {
                name: "wager",
                selector: "wager",
                sortable: false,
                minWidth: "50px",
            },
            {
                name: "timeline	",
                selector: "timeline",
                sortable: false,
                minWidth: "50px",
            },
           
            {
                name: "comment",
                selector: "comment",
                sortable: false,
                minWidth: "100px",
            },
            {
                name: "Status",
                selector: "status",
                sortable: false,
                minWidth: "100px",
                cell: row => (
                    <Badge
                        color={ row.status ? "light-success" : "light-danger"}
                        pill>
                        {row.status ? "Enable" : "Disable"}
                    </Badge>
                )
            },
            {
                name: "Actions",
                minWidth: "150",
                sortable: false,
                cell: row => (
                    <div className="data-list-action">
                        <Edit  className="cursor-pointer mr-1" size={20} onClick={()=>this.rowEdit(row)} />
                        <Trash className="cursor-pointer mr-1" size={20} onClick={()=>this.props.menudelete(row,this.props.parsedFilter)} />
                    </div>
                )
            },
        ],

        modal: false,
        update : false,
        rowid : "",
        isChecked : false,
        comment : '',
        Bonusname : "",
        max : 0,
        min : 0,
        percent : 0,
        timeline : 0,
        options : [],
        bonusid : ""
    }


    componentDidMount(){
      this.props.getData(this.props.parsedFilter)
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
            options : datalist.options
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
       
        isChecked : false
      }))
    }

    handleSubmit = (e)=>{
        e.preventDefault();

        let percent = this.state.percent;
        let timeline = this.state.timeline;
        if (  percent < 1) {
            alert("Please enter percent")
            return;
        }
       
        if (timeline < 1) {
            alert("Please enter percent")
            return;
        }
        var row = {
            comment : this.state.comment,
            status : this.state.isChecked,
            Bonusname :this.state.Bonusname,
            max : this.state.max,
            min : this.state.min,
            timeline : timeline,
            percent : percent,
            wager : this.state.wager,
            bonusid : this.state.bonusid
        }
        this.setState(prevState => ({ modal: !prevState.modal }));

        if(!this.state.update){
            console.log(row)
            this.props.menusave(row,this.props.parsedFilter);
        }else{
            row['_id'] = this.state.rowid;
            this.props.menuupdate([row],this.props.parsedFilter);
        }
    }

    rowEdit =(row) =>{
      this.setState({
          modal : true,
            isChecked : row.status,
            rowid : row._id ,
            update : true,
            comment : row.comment,
            timeline : row.timeline,
            min : row.min,
            max : row.max,
            percent : row.percent,
            wager : row.wager,
            Bonusname : row.Bonusname,
            bonusid : row.bonusid
        });
    }

    handleSwitchChange = () => {
      this.setState({
        isChecked: !this.state.isChecked
      })
    }

  render() {
    let {
      columns,
      data,
      totalPages,options
    } = this.state;
    console.log(this.state.options)
    return (
      <div id="admindata_table"
        className={`data-list list-view`}>          
        <Modal isOpen={this.state.modal} toggle={this.toggleModal} className="modal-dialog-centered" >
            <Form onSubmit={this.handleSubmit}  action={history.location.pathname} >
                <ModalHeader toggle={this.toggleModal} className="bg-primary">
                    ADD NEW BONUS
                </ModalHeader>
                <ModalBody className="modal-dialog-centered  mt-1">
                    <Row>
                        <Col md="12">
                            <Label>Bonus Options</Label>
                            <FormGroup className="form-label-group">
                                <Select
                                    className="React"
                                    classNamePrefix="select"
                                    options={options}
                                    value={options.find(obj => obj.value===this.state.bonusid)}
                                    defaultValue={options[0]}
                                    onChange={e => this.setState({bonusid : e.value})}
                                />
                            </FormGroup>
                        </Col>
                        <Col md="12">
                            <Label>Bonusname</Label>
                            <FormGroup className="form-label-group">
                                <Input
                                    type="text"
                                    placeholder="Bonusname"
                                    value={this.state.Bonusname}
                                    onChange={e => this.setState({ Bonusname: (e.target.value) })}
                                    required
                                />
                            </FormGroup>
                        </Col>

                        <Col md="12">
                            <Label>min</Label>
                            <FormGroup className="form-label-group">
                                <Input
                                    type="number"
                                    placeholder="min"
                                    value={this.state.min}
                                    min={1}
                                    onChange={e => this.setState({ min: parseInt(e.target.value) })}
                                    required
                                />
                            </FormGroup>
                        </Col>

                        <Col md="12">
                            <Label>max</Label>
                            <FormGroup className="form-label-group">
                                <Input
                                    type="number"
                                    placeholder="max"
                                    value={this.state.max}
                                    min={1}
                                    onChange={e => this.setState({ max: parseInt(e.target.value) })}
                                    required
                                />
                            </FormGroup>
                        </Col>

                        <Col md="12">
                            <Label>percent</Label>
                            <FormGroup className="form-label-group">
                                <Input
                                    type="number"
                                    placeholder="percent"
                                    min={1}
                                    value={this.state.percent}
                                    onChange={e => this.setState({ percent: parseInt(e.target.value) })}
                                    required
                                />
                            </FormGroup>
                        </Col>

                     
                        <Col md="12">
                            <Label>wager</Label>
                            <FormGroup className="form-label-group">
                                <Input
                                    type="number"
                                    placeholder="Wagering requirement"
                                    value={this.state.wager}
                                    onChange={e => this.setState({ wager: parseInt(e.target.value) })}
                                    required
                                    min={1}
                                />

                            </FormGroup>
                        </Col>
                        
                        <Col md="12">
                            <Label>Time line</Label>
                            <FormGroup className="form-label-group">
                                <Input
                                    type="number"
                                    placeholder="timeline"
                                    value={this.state.timeline}
                                    onChange={e => this.setState({ timeline:parseInt(e.target.value) })}
                                    required
                                    min={1}
                                />
                            </FormGroup>
                        </Col>

                        <Col md="12">
                            <Label>comment</Label>
                            <FormGroup className="form-label-group">
                                <Input 
                                    type="textarea" 
                                    value={this.state.comment}
                                    onChange={e => this.setState({ comment: e.target.value })}
                                    placeholder="comment"
                                    required
                                />
                                
                            </FormGroup>
                        </Col>

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
                                {this.state.isChecked ? "Enable" : "Diable"}
                            </Button.Ripple>
                            </label>
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
          customStyles={selectedStyle}
          subHeaderComponent={
            <CustomHeader
                handleRowsPerPage={this.handleRowsPerPage}
                handleSidebar={this.toggleModal}
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
    dataList: state.promotions.BonusMenu
  }
}

export default connect(mapStateToProps, { getData, menusave, menuupdate, menudelete})(Child)