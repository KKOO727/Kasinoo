import React, { Component } from "react"
import { ListGroup, ListGroupItem, UncontrolledDropdown, DropdownMenu, DropdownToggle, DropdownItem, Input, Col, Row, Button, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Label, Form, Badge } from "reactstrap"
import { ChevronDown, ChevronLeft, ChevronRight, Trash, ArrowDown, ArrowUp, Edit, } from "react-feather"
import { getData, menusave, menuupdate, menudelete } from "../../../redux/actions/paymentGateWay"
import DataTable from "react-data-table-component"
import ReactPaginate from "react-paginate"
import { connect } from "react-redux"
import Select from "react-select"
import Toggle from "react-toggle"
import { history } from "../../../history"
import {selectedStyle,pagenation_set} from "../../../configs/providerconfig"
import { Root } from "../../../authServices/rootconfig"

const paymentOptions = [
    { value: "payout", label: "Payout" },
    { value: "deposit", label: "Deposit" },
]

const ActionsComponent = props => {
  return (
    <div className="data-list-action">
      <ArrowUp className="cursor-pointer mr-1" size={20} onClick={()=>props.rowArrowup(props.row)} />
      <ArrowDown className="cursor-pointer mr-1" size={20} onClick={()=>props.rowArrowDown(props.row)} />
      <Edit className="cursor-pointer mr-1" size={20} onClick={()=>props.rowEdit(props.row)} />
      <Trash className="cursor-pointer mr-1" size={20} onClick={()=>props.rowDelete(props.row,props.parsedFilter)}/>
    </div>
  )
}

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
          <Button  color="primary" onClick={() => props.handleSidebar(true)} >
            Add New
          </Button>
      </Col>
    </Row>
  )
}

class Child extends Component {
    state = {
        data: [],
        totalPages: 0,
        currentPage: 0,
        columns: [
          {
            name: "Id",
            selector: "order",
            sortable: false,
            minWidth: "50px",
            cell: row => (
                <span>{row.order+1}</span>
            )
          },
          {
            name: "ICON",
            selector: "image",
            sortable: false,
            minWidth: "170px",
            cell: row => (
                <img style={{margin:'auto', maxWidth:'150px'}} src={row.image?Root.imageurl +  row.image:''} alt=''/>
            )
          },
          {
            name: "name",
            selector: "name",
            sortable: false,
            minWidth: "150px",
          },
          {
            name: "type",
            selector: "type",
            sortable: false,
            minWidth: "150px",
            cell : row =>(
              <div>
                {
                  row.paymentconfigurationid ?  row.paymentconfigurationid.type : ""
                }
              </div>
            )
          },
          {
            name: "paymentType",
            selector: "paymentType",
            sortable: false,
            minWidth: "150px",
          },
          {
            name: "min",
            selector: "min",
            sortable: false,
            minWidth: "100px",
          },
          {
            name: "max",
            selector: "max",
            sortable: false,
            minWidth: "100px",
          },
          {
            name: "currency",
            selector: "currency",
            sortable: false,
            minWidth: "50px",
          },
          {
            name: "fee",
            selector: "fee",
            sortable: false,
            minWidth: "20px",
            cell: row => (
                <Badge color="light-primary" pill>
                  {row.fee+" %"}
                </Badge>
            )
          },
          {
            name: "Status",
            selector: "status",
            sortable: false,
            minWidth: "50px",
            cell: row => (
              <Badge
                color={ row.status ? "light-success" : "light-danger"}
                pill>
                {row.status ? "Enable" : "Disable"}
              </Badge>
            )
          },
          {
            name: "Types",
            selector: "paymentMethodType",
            sortable: false,
            minWidth: "100px",
            cell: row => {
                var payment = '';
                for (var i in row.paymentMethodType){
                    payment+=row.paymentMethodType[i].label+' ';
                }
                return(
                    <span>
                        {payment}
                    </span>
                )
            }
          },
          {
            name: "Actions",
            minWidth: "200px",
            sortable: false,
            cell: row => (
              <ActionsComponent
                row={row}
                getData={this.props.getData}
                parsedFilter={this.props.parsedFilter}
                rowArrowup ={this.rowArrowup}
                rowArrowDown ={this.rowArrowDown}
                rowEdit = {this.rowEdit}
                rowDelete={this.props.menudelete}
              />
            )
          },
        ],
        allData: [],
        value: "",
        rowsPerPage: 10,
        sidebar: false,
        currentData: null,
        selected: [],
        totalRecords: 0,
        sortIndex: [],
        addNew: "",
        modal: false,
        update : false,
        rowid : "",
        tooltipOpen : false,

        name:'',
        type:'',
        paymentType:'',
        currency:'',
        date:'',
        info:'',
        image:'',
        min:0,
        max:0,
        fee:0,
        depositBankCodelabel:'',
        depositBankCodevalue:'',
        depositBankCode:[],
        paymentMethodType:[],
        status:false,
        file : null,
        typeoptions : [],
        paymentconfigurationid  :""
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
      getData(params);
    }

    componentDidUpdate(preveProps,prevState){
      if(preveProps.dataList !== this.props.dataList){
        let datalist = this.props.dataList;
        this.setState({
          data : datalist.data,
          totalPages: datalist.totalPages,
          typeoptions : datalist.typeoptions,
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

    toggleModal = () => {
      this.setState(prevState => ({
        modal: !prevState.modal,
        update : false,
        name:'',
        type:'',
        paymentType:'',
        currency:'',
        date:'',
        info:'',
        image:'',
        min:0,
        max:0,
        fee:0,
        depositBankCode:[],
        paymentMethodType:[],
        status:false,
      }))
    }

    handleSubmit = (e)=>{

      e.preventDefault();
      this.setState(prevState => ({ modal: !prevState.modal}));
      const fpdata = new FormData();
      fpdata.append('fpImgFile', this.state.file);

      if(!this.state.update){
        var row = {
            name:this.state.name,
            type:this.state.type,
            paymentType:this.state.paymentType,
            currency:this.state.currency,
            info:this.state.info,
            min:this.state.min,
            max:this.state.max,
            fee:this.state.fee,
            depositBankCode:this.state.depositBankCode,
            paymentMethodType:this.state.paymentMethodType,
            status:this.state.status,
            parsedFilter : this.props.parsedFilter
        }
        fpdata.append('data', JSON.stringify(row));
        this.props.menusave(fpdata,this.props.parsedFilter);
      }else{
        var row2 = {
            _id  :this.state.rowid,
            order : this.state.ordernum,
            name:this.state.name,
            type:this.state.type,
            paymentType:this.state.paymentType,
            currency:this.state.currency,
            info:this.state.info,
            min:this.state.min,
            max:this.state.max,
            fee:this.state.fee,
            depositBankCode:this.state.depositBankCode,
            paymentMethodType:this.state.paymentMethodType,
            status:this.state.status,
            parsedFilter : this.props.parsedFilter
        }
        console.log(row2)
        fpdata.append('data', JSON.stringify(row2));
        this.props.menusave(fpdata,this.props.parsedFilter);
      }

    }

    rowArrowup = (row) => {
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
        this.props.menuupdate([first,last],this.props.parsedFilter);
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
        this.props.menuupdate([first,last],this.props.parsedFilter);
      }
    }

    rowEdit = (row) =>{
      this.setState({
          name:row.name,
          // type:row.type,
          paymentType:row.paymentType,
          currency:row.currency,
          date:row.date,
          info:row.info,
          // image:row.image,
          // file : 
          min:row.min,
          max:row.max,
          fee:row.fee,
          depositBankCode:row.depositBankCode,
          status:row.status,
          paymentMethodType:row.paymentMethodType,
          modal : true,
          rowid : row._id,
          update : true,
          ordernum : row.order,
          type : row.paymentconfigurationid ? row.paymentconfigurationid._id : "" 
        });
    }

    handleSwitchChange = () => {
      this.setState({
        status: !this.state.status
      })
    }

    toggleTooltip = () => {
      this.setState({
        tooltipOpen: !this.state.tooltipOpen
      })
    }
    depositBankCodeadd =()=>{
        var depositBankCode = this.state.depositBankCode;
        depositBankCode.push({value:this.state.depositBankCodevalue, label:this.state.depositBankCodelabel});
        this.setState({
            depositBankCode:depositBankCode,
            depositBankCodevalue:'',
            depositBankCodelabel:'',
        });
    }

    deleteDepositBankCode = (e) =>{
        var data = this.state.depositBankCode;
        data.splice(e,1);
        this.setState({depositBankCode:data});
    }

    fileLoad = (e)  => {
        e.preventDefault();
        let file = e.target.files[0];
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
          this.setState({
            image: reader.result,
            file : file
          });
        };
    }

    rowArrowupDepositBankCode =(e) =>{
        if(e===0){
            return;
        }else{
            var data = this.state.depositBankCode;
            var temp = data[e];
            data.splice(e, 1);
            data.splice((e-1), 0, temp);
            this.setState({depositBankCode:data})
        }
    }
    rowArrowDownDepositBankCode =(e)=>{
        if(e===(this.state.depositBankCode.length-1)){
            return;
        }else{
            var data = this.state.depositBankCode;
            var temp = data[e];
            data.splice(e, 1);
            data.splice((e+1), 0, temp);
            this.setState({depositBankCode:data})
        }
    }

  render() {
    let { columns, data, allData, totalPages, value ,typeoptions} = this.state;
    // let {typeoptions} = this.props.dataList;
    // console.log(typeoptions)
    return (
      <React.Fragment>
        <div id="admindata_table" className={`data-list list-view`}>
          <DataTable
            columns={columns}
            data={value.length ? allData : data}
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
            onSelectedRowsChange={data =>
              this.setState({ selected: data.selectedRows })
            }
            customStyles={selectedStyle}
            subHeaderComponent={
              <CustomHeader
                handleSidebar={this.toggleModal}
                handleRowsPerPage={this.handleRowsPerPage}
                dataList={this.props.dataList}
              />
            }
            sortIcon={<ChevronDown />}
          />
        </div>

        <Modal isOpen={this.state.modal} toggle={this.toggleModal} className="modal-dialog-centered modal-lg">
            <Form onSubmit={this.handleSubmit}  action={history.location.pathname} >
              <ModalHeader toggle={this.toggleModal} className="bg-primary">
                  Payment Menu Manager
              </ModalHeader>
            <ModalBody className="modal-dialog-centered  mt-1">
                <Row>
                    <Col md="6">
                        <FormGroup className="position-relative">
                            <Label>Name</Label>
                            <Input type="text" placeholder="Name..." required
                                value={this.state.name}
                                onChange={e => this.setState({ name: e.target.value })}
                            />
                        </FormGroup>
                    </Col>
                    {/* <Col md="6">
                        <FormGroup className="position-relative">
                            <Label>type</Label>
                            <Input type="text" placeholder="type..." required
                                value={this.state.type}
                                onChange={e => this.setState({ type: e.target.value })}
                            />
                        </FormGroup>
                    </Col> */}
                    <Col md="6">
                        <FormGroup className="position-relative">
                            <Label>paymentType</Label>
                            <Input type="text" placeholder="paymentType..." required
                                value={this.state.paymentType}
                                onChange={e => this.setState({ paymentType: e.target.value })}
                            />
                        </FormGroup>
                    </Col>
                    <Col md="6">
                        <FormGroup className="position-relative">
                            <Label>currency</Label>
                            <Input type="text" placeholder="currency..." required
                                value={this.state.currency}
                                onChange={e => this.setState({ currency: e.target.value })}
                            />
                        </FormGroup>
                    </Col>
                    <Col md="6">
                        <FormGroup className="position-relative">
                            <Label>min</Label>
                            <Input type="number" placeholder="min..." required
                                value={this.state.min}
                                onChange={e => this.setState({ min: e.target.value })}
                            />
                        </FormGroup>
                    </Col>
                    <Col md="6">
                        <FormGroup className="position-relative">
                            <Label>max</Label>
                            <Input type="number" placeholder="max..." required
                                value={this.state.max}
                                onChange={e => this.setState({ max: e.target.value })}
                            />
                        </FormGroup>
                    </Col>
                    <Col md="6">
                        <FormGroup className="position-relative">
                            <Label>fee</Label>
                            <Input type="number" placeholder="fee..." required
                                value={this.state.fee}
                                onChange={e => this.setState({ fee: e.target.value })}
                            />
                        </FormGroup>
                    </Col>
                 
                    <Col md="6">
                        <FormGroup className="position-relative">
                          <Label>Type</Label>

                            <Select
                                value={this.state.paymentMethodType}
                                isMulti
                                options={paymentOptions}
                                onChange={e => this.setState({paymentMethodType:e})}
                                className="React"
                                classNamePrefix="select"
                            />
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
                    <Col md="12">
                        <FormGroup className="form-label-group">
                            <Input type="textarea" name="text" id="exampleText" rows="5" required
                                value={this.state.info}
                                onChange={e => this.setState({ info: e.target.value })}
                                placeholder="info..."
                            />
                            <Label>info</Label>
                        </FormGroup>
                    </Col>
                    <Col md="12">
                        <Row>
                            <Col md="9" xs='12'>
                                <Row>
                                    <Col xs='6'>
                                        <FormGroup>
                                            <Input
                                                placeholder='depositBankCodevalue'
                                                type="text"
                                                onChange={e => this.setState({ depositBankCodevalue: e.target.value })}
                                                value={this.state.depositBankCodevalue}
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col xs='6'>
                                        <FormGroup>
                                            <Input
                                                type="text"
                                                placeholder='depositBankCodelabel'
                                                onChange={e => this.setState({ depositBankCodelabel: e.target.value })}
                                                value={this.state.depositBankCodelabel}
                                            />
                                        </FormGroup>
                                    </Col>
                                </Row>
                            </Col>
                            <Col md="3" xs='12' style={{textAlign:'center'}}>
                                <Button color="primary" onClick={()=>this.depositBankCodeadd()}>add</Button>
                            </Col>
                        </Row>
                    </Col>
                    <Col md='12'>
                        <ListGroup style={{width:"100%"}}>
                            {
                                this.state.depositBankCode ? this.state.depositBankCode.length > 0 ? this.state.depositBankCode.map((item,i)=>(
                                    <ListGroupItem key={i} className="d-flex justify-content-between align-items-center">
                                        <span style={{display:'flex', justifyContent:'between', width:'calc(100% - 125px)'}}>
                                            <span style={{justifyContent:'flex-start', width:'50%'}}>{item.value}</span>
                                            <span style={{justifyContent:'flex-end', width:'50%'}}>{item.label}</span>
                                        </span>
                                        <span style={{ width:'125px'}}>
                                            <ArrowUp className="cursor-pointer mr-1" size={20} onClick={()=>this.rowArrowupDepositBankCode(i)} />
                                            <ArrowDown className="cursor-pointer mr-1" size={20} onClick={()=>this.rowArrowDownDepositBankCode(i)} />
                                            <Badge style={{cursor:"pointer",}} color="danger" pill onClick={()=>this.deleteDepositBankCode(i)}>delete</Badge>
                                        </span>
                                    </ListGroupItem>
                                )) : "" :""
                            }
                        </ListGroup>
                    </Col>
                    <Col lg='6' md='12' className='mt-1' style={{textAlign:'center'}}>
                        {this.state.image?(
                            <img style={{margin:'auto', maxWidth:'250px'}} src={this.state.image} alt='' />
                        ):null}
                    </Col>
                    <Col lg='3' md='12' className='mt-1' style={{justifyContent:'center', alignItems: 'center',display: 'flex'}}>
                        <Input
                            onChange={(e)=>this.fileLoad(e)}
                            type="file"
                        />
                    </Col>
                    <Col lg="3" md='12' className='mt-1' style={{justifyContent:'center',alignItems: 'center',display: 'flex'}}>
                        <label className="react-toggle-wrapper">
                        <Toggle
                            checked={this.state.status}
                            onChange={this.handleSwitchChange}
                            name="controlledSwitch"
                            value="yes"
                        />
                        <Button.Ripple color="primary" onClick={this.handleSwitchChange} size="sm">
                            {this.state.status ? "Enable" : "Diable"}
                        </Button.Ripple>
                    </label>
                    </Col>
                </Row>
            </ModalBody>
            <ModalFooter>
                { this.state.update ? <Button color="primary" type="submit">update</Button> : <Button color="primary" type="submit">Accept</Button>}
            </ModalFooter>
          </Form>
        </Modal>
      </React.Fragment>
    )
  }
}

const mapStateToProps = state => {
  return { dataList: state.paymentGateWay}
}

export default connect(mapStateToProps, { getData,menusave,menuupdate,menudelete})(Child)