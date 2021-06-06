import React, { Component } from "react"
import {UncontrolledDropdown,  DropdownMenu,  DropdownToggle,  DropdownItem,Input,Col,Row,Button,Modal,
  ModalHeader, ModalBody, ModalFooter,FormGroup,Label,Form,Badge} from "reactstrap"
import DataTable from "react-data-table-component"
import ReactPaginate from "react-paginate"
import { history } from "../../../history"
import { ChevronDown,  ChevronLeft,  ChevronRight,Edit,Edit2,Trash,Check,X} from "react-feather"
import { connect } from "react-redux"
import {getData,menusave,menuupdate,menudelete} from "../../../redux/actions/gamesprovider/providers"
import Toggle from "react-toggle"
import Select from "react-select"
import {key_providers,money_option,value_options,moneys_option1,value_moneys1,providerconfig_key,selectedStyle,pagenation_set} from "../../../configs/providerconfig"
import {toast} from "react-toastify"
import MultiSelect from "react-multi-select-component";


const CustomHeader = props => {
  let {totalRecords,sortIndex} = props.dataList;
  return (
    <Row className="p-1">
    <Col xs="12" md="3">
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

    <Col xs="12" md="9" className="mt-1 text-right d-flex p-1">
      <Button className="add-new-btn" color="primary" onClick={() => props.handleSidebar()}>
        Add New
      </Button>
      <Button.Ripple className="round"   color="flat-success" onClick={() => { return props.rowsAllDone() }} >
        <Check size={14} />
          Done
      </Button.Ripple>
      <Button.Ripple className="round"   color="flat-danger" onClick={() => { return props.rowsAllReject() }} >
        <X size={14} /> reject
      </Button.Ripple>
    </Col>
  </Row>
  )
}

class Child extends Component {

  state = {
      data: [],
      columns: [
        {
          name: "order",
          selector: "order",
          sortable: false,
          minWidth: "50px",
        },
        {
          name: "providerText ",
          selector: "text",
          sortable: false,
          minWidth: "100px",
        },
        // {
        //   name: "LAUNCHURL ",
        //   selector: "LAUNCHURL",
        //   sortable: false,
        //   minWidth: "100px",
        // },
        {
          name: "Agregator",
          selector: "Agregator",
          sortable: false,
          minWidth: "100px",
        },
        {
          name: "Revenu",
          selector: "Type",
          sortable: false,
          minWidth: "50px",
          cell: row => (
            <>     
              {value_options[row.Type]}
            </>
          )
        },
        {
          name: "Money",
          selector: "Money",
          sortable: false,
          minWidth: "50px",
          cell: row => (
            <> 
              {row.Money} {`${value_moneys1[row.currency]}`} 
            </>
          )
        },
        {
          name: "Percent",
          selector: "Percentage",
          sortable: false,
          minWidth: "50px",
          cell: row => (
            < > 
            {`${row.Percentage + " %"}`}
            </>
          )
        },
       
        {
          name: "Route",
          selector: "Route",
          sortable: false,
          minWidth: "100px",
          cell: row => (
            <div className="textstyle">       
            {row.Route ? "Direct" : "Aggregators"}
            </div>
          )
        },
        {
          name: "Status",
          selector: "status",
          sortable: false,
          minWidth: "100px",
          cell: row => (
            <Badge color={ row.status ? "light-success" : "light-danger"} pill> 
            {row.status ? "Enable" : "Disable"}
            </Badge>
          )
        },
        {
          name: "Actions",
          minWidth: "200",
          sortable: false,
          cell: row => (
            <div className="data-list-action">
              <Edit   className="cursor-pointer mr-1"  size={20}  onClick={()=>this.rowEdit(row)} />
              <Trash   className="cursor-pointer mr-1"  size={20}  onClick={()=>this.props.menudelete(row,this.state.filters,this.props.parsedFilter)} />
              {/* <ArrowUp className="cursor-pointer mr-1" size={20} onClick={()=>this.rowArrowup(row)} />
              <ArrowDown className="cursor-pointer mr-1" size={20} onClick={()=>this.rowArrowDown(row)}/> */}
            </div>
          )
        },
      ],
      modal: false,
      provider : "",
      update : false,
      rowid : "",
      status : false,
      bool : [],
      tooltipOpen : false,
      Route : false,
      modal1 : false,
      typesArray  :[],
      selectedRow : {},
      selectRows : [],
      GameTypeId : "",
      GameTypeName : "",
      isValid : null,
      booloptions : key_providers,
      Money : "",
      Percentage : "",
      currency : "",
      ischecked : false,
      moneys_option : [],
      Type : "1",
      LAUNCHURL:"",
      text:"",
      Agregator : "",
      filters : {
        providerid : "",
        bool : this.props.bool
      }
    }

    componentDidMount(){
      console.log(this.state.filters)
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

  
    toggleModal = () => {
      this.setState(prevState => ({
        modal: !prevState.modal,
        Route : false,
        bool  :[],
        provider : "",
        rowid : "",
        status : false,
        Money : "",
        Percentage : "",
        update : false,
        currency : "",
        Type : "",
        text : "",
        LAUNCHURL:'',
        Agregator : ""
      }))
    }

    rowArrowup = (row) =>{
      var alldata = this.me.props.dataList.allData;
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
        this.props.menuupdate([first,last],this.state.filters,this.props.parsedFilter);
      }
    }

    rowArrowDown = (row) => {
      var alldata = this.me.props.dataList.allData;
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
        this.props.menuupdate([first,last],this.state.filters,this.props.parsedFilter);
      }
    }


    handleSubmit = (e)=>{
      e.preventDefault();
      this.setState(prevState => ({
        modal: !prevState.modal
      }));
      if(this.state.bool && this.state.bool.length > 0){
        var newbool = {};
        var bools = this.state.bool;
        for(var i = 0 ; i < bools.length ; i++ ){
          newbool[bools[i].value] = true;
        }
        if(!this.state.update){
          var num = this.props.dataList.allData.length;
          var count = 0;
          if(num > 0){
            count = this.props.dataList.allData[num-1].order + 1;
          }
          var row = {
            provider : this.state.provider,
            bool : newbool,
            order : count,
            status : this.state.status,
            Route : this.state.Route,
            Money : this.state.Money,
            Percentage : this.state.Percentage,
            currency : this.state.currency,
            Type : this.state.Type,
            LAUNCHURL : this.state.LAUNCHURL,
            text : this.state.text,
            Agregator :this.state.Agregator
          }
          this.props.menusave(row,this.state.filters,this.props.parsedFilter)
        }else{
          var row2 = {
            _id  :this.state.rowid,
            bool : newbool,
            status : this.state.status,
            Route : this.state.Route,
            Money : this.state.Money,
            Percentage : this.state.Percentage,
            currency : this.state.currency,
            Type : this.state.Type,
            text : this.state.text,
            LAUNCHURL : this.state.LAUNCHURL,
            Agregator :this.state.Agregator
          }
          this.setState({value : ""});
          this.props.menuupdate([row2],this.state.filters,this.props.parsedFilter);
        }
      }else{
        toast.error("Please select Revenue share Type");
      }
    }


    AllDone = () =>{
      var rows = this.state.selectRows;
      var news = [];
      for(var i in  rows){
        var row = Object.assign({},rows[i],{status : true});
        news.push(row);
      }
      this.props.menuupdate(news,this.state.filters,this.props.parsedFilter);
    }


    AllReject = () =>{
      var rows = this.state.selectRows;
      var news = [];
      for(var i in  rows){
        var row = Object.assign({},rows[i],{status : false});
        news.push(row);
      }
      this.props.menuupdate(news,this.state.filters,this.props.parsedFilter);
    }

    rowEdit = (row) =>{
      var types = row.bool;
      var rows = [];
      for(var i in types ){
        rows.push({label : providerconfig_key[i],value : i});
      }
      this.setState({Type : row.Type,currency : row.currency,
        Money :row.Money ,Percentage : row.Percentage,
        modal : true,rowid : row._id,update : true,
        bool : rows,provider : row.provider,
        status : row.status,Route : row.Route,LAUNCHURL:row.LAUNCHURL,text : row.text,
        Agregator : row.Agregator
      });
    }

    handleSwitchChange = () => {
      this.setState({
        bool: !this.state.bool
      })
    }

    handleSwitchChangestatus = ()=>{
      this.setState({
        status: !this.state.status
      })
    }

    handleSwitchChangeRoute = () =>{
      this.setState({
        Route: !this.state.Route
      })
    }

  
  render() {
    let { columns,data,totalPages} = this.state
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
              forcePage={ this.props.parsedFilter.page ? parseInt(this.props.parsedFilter.page - 1) : 0 }
              onPageChange={page => this.handlePagination(page)}
            />
          )}
          noHeader
          subHeader
          onSelectedRowsChange={data => this.setState({ selectRows: data.selectedRows }) }
          responsive
          selectableRows
          pointerOnHover
          selectableRowsHighlight
          customStyles={selectedStyle}
          subHeaderComponent={
            <CustomHeader
              handleRowsPerPage={this.handleRowsPerPage}
              dataList={this.props.dataList}
              handleSidebar={this.toggleModal}
              rowsAllDone={this.AllDone}
              rowsAllReject={this.AllReject}
            />
          }
          sortIcon={<ChevronDown />}
        />

        <Modal isOpen={this.state.modal} toggle={this.toggleModal} className="modal-dialog-centered" >
          <Form onSubmit={this.handleSubmit}  action={history.location.pathname} >
            <ModalHeader toggle={this.toggleModal} className="bg-primary">
              Edit
            </ModalHeader>
            <ModalBody className="modal-dialog-centered  mt-1">
            <Row>
              <Col md="6" sm="12">
                <FormGroup className="form-label-group position-relative has-icon-left">  
                  <Input type="text" placeholder="PROVIDERID" value={this.state.provider} onChange={e => this.setState({ provider: e.target.value })} required />
                  <div className="form-control-position" >
                    <Edit2 size={15} />
                  </div>
                  <Label>PROVIDERID</Label>
                </FormGroup>
              </Col>
             
              <Col md="6" sm="12">
                <FormGroup className="form-label-group position-relative has-icon-left">  
                  <Input type="text" placeholder="PROVIDERTEXT" value={this.state.text} onChange={e => this.setState({ text: e.target.value })} required />
                  <div className="form-control-position" >
                    <Edit2 size={15} />
                  </div>
                  <Label>PROVIDERTEXT</Label>
                </FormGroup>
              </Col>

              <Col md="12" sm="12">
                <FormGroup className="form-label-group position-relative has-icon-left">  
                  <Input type="text" placeholder="Agregator" value={this.state.Agregator} onChange={e => this.setState({ Agregator: e.target.value })} required />
                  <div className="form-control-position" >
                    <Edit2 size={15} />
                  </div>
                  <Label>Agregator</Label>
                </FormGroup>
              </Col>

              
              <Col md="12" sm="12">
                <FormGroup className="form-label-group position-relative has-icon-left">  
                  <Input type="text" placeholder="LAUNCHURL ID" value={this.state.LAUNCHURL} onChange={e => this.setState({ LAUNCHURL: e.target.value })} required />
                  <div className="form-control-position" >
                    <Edit2 size={15} />
                  </div>
                  <Label>LAUNCHURL ID</Label>
                </FormGroup>
              </Col>
              <Col md="6" sm="12" className="mt-0">
                  <Label>Route</Label>
                  <label className="react-toggle-wrapper">
                    <Button.Ripple color="primary" onClick={this.handleSwitchChangeRoute} size="sm" >
                      {this.state.Route ? "Direct" : "Aggregators"}
                    </Button.Ripple>
                  </label>
              </Col>
              <Col md="6" sm="12" className="mt-0">
                <Label>STATUS</Label>
                <label className="react-toggle-wrapper">
                  <Toggle checked={this.state.status} onChange={this.handleSwitchChangestatus} name="controlledSwitch" value="yes"  />
                  <Button.Ripple color="primary" onClick={this.handleSwitchChangestatus} size="sm" >
                    {this.state.status ? "Enable" : "Disable"}
                  </Button.Ripple>
                </label>
              </Col>
              <Col md="12" sm="12" className="mt-1">
                <Label>GAME Type</Label>
                <MultiSelect options={this.state.booloptions} className="multi-select" classNamePrefix="select" selectAllLabel="ALL PROVIDER" hasSelectAll="All" shouldToggleOnHover={true} value={this.state.bool} focusSearchOnOpen={true} onChange={(e)=>this.setState({bool : e})} labelledBy={"Select Provider"} />
              </Col>            
              <Col md="12" sm="12" className="mt-1">
                <Label>Revenue share Type</Label>
                  <Select className="mt-0" classNamePrefix="select" options={money_option} value={money_option.find(obj => obj.value === this.state.Type)} onChange={e =>this.setState({Type : e.value}) } />
              </Col>
              <Col md="6" sm="12" className="mt-2">
                <FormGroup className="form-label-group position-relative has-icon-left">  
                    <Input type="number" placeholder="Money" value={this.state.Money} onChange={e => this.setState({ Money: e.target.value })} required />
                    <div className="form-control-position" >
                      <Edit2 size={15} />
                    </div>
                    <Label>Money</Label>
                </FormGroup>
              </Col>
              <Col md="6" sm="12" className="mt-0">
                  <Label>currency</Label>
                  <Select className="mt-0" classNamePrefix="select" options={moneys_option1} value={moneys_option1.find(obj => obj.value === this.state.currency)} onChange={e =>this.setState({currency : e.value}) } />
              </Col>
              <Col md="6" sm="12" className="mt-0">
                  <FormGroup className="form-label-group position-relative has-icon-left">  
                    <Input type="number" min={1} max={99} placeholder="Percentage" value={this.state.Percentage} onChange={e => this.setState({ Percentage: e.target.value })} required/>
                    <div className="form-control-position" >
                      <Edit2 size={15} />
                    </div>
                    <Label>Percentage</Label>
                  </FormGroup>
                </Col>
                <Col md="6" sm="12" className="mt-0">
                  <Label style={{fontSize:"20px"}}>%</Label>
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

         

      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    dataList: state.gameproviders.providers
  }
}

export default connect(mapStateToProps, {getData,menusave,menuupdate,menudelete})(Child)