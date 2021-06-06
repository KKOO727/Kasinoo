import React, { Component } from "react"
import {  UncontrolledDropdown, DropdownMenu, DropdownToggle, DropdownItem,CustomInput, Input, Col, Row, Button, Modal,Table, ModalHeader, ModalBody, ModalFooter, FormGroup, Label, Form, Badge } from "reactstrap"
import {  ChevronDown, ChevronLeft, ChevronRight, Trash, Edit, Plus, Edit2 ,Link } from "react-feather"
import {  getData, menusave, menuupdate, menudelete,gamelink_save } from "../../../redux/actions/matka/bazaars"
import DataTable from "react-data-table-component"
import ReactPaginate from "react-paginate"
import { history } from "../../../history"
import { connect } from "react-redux"
import Toggle from "react-toggle"
import {selectedStyle,pagenation_set,bazaartype,postCalled,postCalled1,postCalled2,ownerShip,postCalled3,weekoptions, keyweekLabel} from "../../../configs/providerconfig"
import Select from "react-select"
import Flatpickr from "react-flatpickr";
import {toast} from "react-toastify"
import {dateConvert, get_timestring,} from "../../../redux/actions/auth/index"
import makeAnimated from 'react-select/animated'
import Datepicker from "../../lib/datepicker"

const animatedComponents = makeAnimated()

const ActionsComponent = props => {
  return (
    <div className="data-list-action">
      <Edit  className="cursor-pointer mr-1" size={20} onClick={()=>props.rowEdit(props.row)} />
      <Trash className="cursor-pointer mr-1" size={20} onClick={()=>props.rowDelete(props.row,props.parsedFilter,props.filters)} />
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
       <Button
          className="add-new-btn"
          color="primary"
          onClick={() => props.handleSidebar(true)}
          outline>
          <Plus size={15} />
          <span className="align-middle">Add New</span>
        </Button>
    </Col>
  </Row>
  )
}


const FilterComponent = props =>{
    let state = props.filters;
    let statusoptions = [
        {
            label : "Active", value : true
        },
        {
            label : "Inactive", value : false
        }
    ]
    return (
      <Row className="mb-1">
        <Col  md='6' sm='12' xs='12'>
            <FormGroup>
                <Label for="Registration Date">created Date</Label> 
                <Datepicker  onChange={date => { props.handleFilter(date,"updated_at") }} />
            </FormGroup>
        </Col>
        <Col md="6">
            <FormGroup>
                <Label for="gender">bazaartype</Label>
                <Select
                    className="React" classNamePrefix="select" id="bazaartype" name="bazaartype"
                    options={bazaartype} value={bazaartype.find(obj => obj.value === state.bazaartype)}
                    defaultValue={bazaartype[0]} onChange={e => props.handleFilter(e.value,"bazaartype" )} />
            </FormGroup>
        </Col>
        <Col md="4">
            <FormGroup>
                <Label for="gender">Check for Ownership </Label>
                <Select
                    className="React" classNamePrefix="select" id="ownerShip" name="ownerShip"
                    options={ownerShip} value={ownerShip.find(obj => obj.value === state.ownerShip)}
                    defaultValue={ownerShip[0]} onChange={e => props.handleFilter(e.value, "ownerShip")} />
            </FormGroup>
        </Col>
        <Col md='4' sm='6' xs='12'>
            <FormGroup>
                <Label for="user">status</Label>
                <Select className="React" classNamePrefix="select" name="game" 
                    options={statusoptions}
                    value={statusoptions.find(obj => obj.value === state.status)}
                    onChange={e => props.handleFilter(e.value,"status")}
                />
            </FormGroup>
        </Col>
        <Col md='4' sm='6' xs='12'>
            <Label>blocktime(Please enter minutues)</Label>
            <FormGroup className="form-label-group">
                <Input type="number" placeholder="blocktime" value={state.blocktime}
                onChange={e => props.handleFilter( e.target.value, "blocktime")} required />
            </FormGroup>
        </Col>
    </Row>
    )
  }

class Child extends Component {
   
    state = {
        data: [],
        columns: [
          {
            name: "Bazaar Name",
            selector: "bazaarname",
            sortable: false,
            minWidth: "220px",
            cell : row =>(
                <div className="font-weight-bold">
                    {row.bazaarname}
                </div>
            )
          },
          {
            name: "Bazaar Type",
            selector: "bazaartype",
            sortable: false,
            minWidth: "100px",
            cell : row =>(
                <div>
                    {bazaartype.find(obj => obj.value === row.bazaartype) ? bazaartype.find(obj => obj.value === row.bazaartype).label : ""  }
                </div>
            )
          },
          {
            name: "Ownership",
            selector: "ownership",
            sortable: false,
            minWidth: "100px",
            cell : row => (
                <div >
                    {ownerShip.find(obj => obj.value === row.ownership) ? ownerShip.find(obj => obj.value === row.ownership).label : ""  }
                </div>
            )
          },
          {
            name: "postCalled",
            selector: "postCalled",
            sortable: false,
            minWidth: "100px",
            cell : row => (
                <div >
                    {postCalled3.find(obj => obj.value === row.postCalled) ? postCalled3.find(obj => obj.value === row.postCalled).label : ""  }
                </div>
            )
          },
          {
            name: "hightlight",
            selector: "hightlight",
            sortable: false,
            minWidth: "20px",
            cell: row => (
                <Badge color={ row.hightlight ? "light-success" : "light-danger"}pill>
                  {row.hightlight ? "Enable" : "Disable"}
                </Badge>
              )
          },

          
          {
            name: "Game Link",
            selector: "gamelink",
            sortable: false,
            minWidth: "20px",
            cell : row =>(
                <div>
                    <Link  className="cursor-pointer mr-1" onClick={()=>this.gamelink_edit(row)} size={20} />
                </div>
            )
          },
          {
            name: "blocktime",
            selector: "blocktime",
            sortable: false,
            minWidth: "20px",
          },
         
          {
            name: "Status",
            selector: "status",
            sortable: false,
            minWidth: "20px",
            cell: row => (
                <Badge color={ row.status ? "light-success" : "light-danger"}pill>
                  {row.status ? "Active" : "Inactive"}
                </Badge>
              )
          },
          {
            name: "created ",
            selector: "updated_at",
            sortable: false,
            minWidth: "100px",
            cell : row => (
                <div>
                    {
                        dateConvert(row.updated_at)
                    }
                </div>
            )
          },
          {
            name: "Action",
            minWidth: "50",
            sortable: false,
            cell: row => (
              <ActionsComponent
                row={row}
                getData={this.props.getData}
                parsedFilter={this.props.parsedFilter}
                rowEdit = {this.rowEdit}
                filters={this.state.filters}
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
        bazaarname : "",
        bazaartype : bazaartype[0].value,
        postCalled : postCalled[0].value,
        ownership  :ownerShip[0].value,
        update : false,
        rowid : "",
        isChecked : false,
        tooltipOpen : false,
        timers  : null,
        gamemodal : false,
        gamelinklist : [],
        selecteditem : {},
        resultmode : false,
        hightlight : false,
        notification : false,
        blocktime  : 0,
        week : [],
        filters : {
            bazaartype : "",
            blocktime  : "",
            status : true,
            ownership : "",
            updated_at : {
                start : (new Date()),
                end : new Date(new Date().valueOf() + 60 * 60 * 1000 * 24)
            },
        }
    }

    componentDidMount(){
      this.props.getData(this.props.parsedFilter,this.state.filters,true)
    }

    handleFilter = (value,bool) => {
        console.log(value)
        let filters = this.state.filters;
        filters[bool] = value;
        this.setState({filters : filters});
        this.props.getData(this.props.parsedFilter,filters);
    }

    handlePagination = page => {
        let { parsedFilter, getData } = this.props;
        let perPage = parsedFilter.perPage !== undefined ? parsedFilter.perPage : pagenation_set[0];
        let urlPrefix =`${history.location.pathname}`;
        history.push( `${urlPrefix}?page=${page.selected + 1}&perPage=${perPage}`);
        var params = { page: page.selected + 1, perPage: perPage };
        getData(params,this.state.filters,true);
    }
  
    componentDidUpdate(preveProps,prevState){
        if (preveProps.dataList !== this.props.dataList) {
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
        getData(params,this.state.filters,true);
    }
  

    toggleModal = () => {
      this.setState(prevState => ({
        modal: !prevState.modal,
        update : false,
        bazaarname : "",
        bazaartype : bazaartype[0].value,
        postCalled : postCalled[0].value,
        isChecked : false,
        ownership : ownerShip[0].value
      }))
    }

    handleSubmit = (e)=>{
        e.preventDefault();
        let {resultmode, week,timers,isChecked, postCalled, bazaartype, ownership,  blocktime, notification, hightlight, bazaarname} = this.state;

        this.setState(prevState => ({ modal: !prevState.modal }));

        let object = {};
        for (let i in week) {
            object[week[i].value] = true;
        }

        var row = {
            bazaarname : bazaarname,
            bazaartype : bazaartype,
            ownership : ownership,
            status : isChecked,
            postCalled : postCalled,
            timers : timers,
            resultmode : resultmode,
            week : object,
            blocktime : blocktime,
            notification : notification,
            hightlight : hightlight,
        }
        console.log(row)

        if (!Object.keys(timers).length){
            toast.warn("please add timers")
            return;              
        }

        if (!this.state.update) {
            this.props.menusave(row,this.props.parsedFilter,this.state.filters)
        } else {
            row['_id'] = this.state.rowid;
            this.props.menuupdate(row,this.props.parsedFilter,this.state.filters);
        }
    }

    rowEdit = (row) => {

        let array = [];
        for (let i in row.week) {
            array.push({label : keyweekLabel[i],value : i});
        }

        this.setState({modal : true,
            rowid : row._id,
            update : true, 
            isChecked : row.status,
            bazaarname : row.bazaarname,
            bazaartype : row.bazaartype,
            ownership : row.ownership, 
            postCalled : row.postCalled, 
            timers  : row.timers,
            resultmode  : row.resultmode,
            blocktime  : row.blocktime,
            notification  : row.notification,
            hightlight  : row.hightlight,
            week  : array
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

    opentimeadd = () =>{
        let opens = this.state.timers;
        switch(this.state.postCalled){
            case "1" :
                opens.push({ opentime : this.state.opentime});
                break;
            case "2" :
                opens.push({ closetime :this.state.closetime});
                break;
            case "3" :
                opens.push({ closetime :this.state.closetime,opentime : this.state.opentime});
                break;
            case "4" :
                opens.push({ closetime :this.state.closetime,opentime : this.state.opentime,interval : this.state.interval});
                break;    
            default : 
                break                            
        }
        this.setState({timers : opens});
    }

    delete = (item) =>{
        let arr = this.state.timers;
        let index = arr.indexOf(item);
        if (index > -1) {
            arr.splice(index, 1);
            this.setState({timers : arr});
        }
    }

    gamelink_edit = (item) =>{
        this.gametoggleModal();
        var gameslinkobj = item.gamelink;
        var games = [];
        var rows = [];
        let list  = this.props.dataList.gamelist;
        for (let i in list) {
            if (list[i].bazaartype[item.bazaartype]) {
                games.push(list[i])
            }
        }
    
        for(var i in games){
            var minbetprice = 0;
            var oddsprice = 0;
            var minwin = 0;
            var status = false;
            if (gameslinkobj){
                minbetprice = gameslinkobj[games[i]._id] && gameslinkobj[games[i]._id].minbetprice ? gameslinkobj[games[i]._id].minbetprice : 0 ;
                oddsprice = gameslinkobj[games[i]._id] &&  gameslinkobj[games[i]._id].oddsprice ? gameslinkobj[games[i]._id].oddsprice : 0 ;
                status = gameslinkobj[games[i]._id] &&  gameslinkobj[games[i]._id].status ? gameslinkobj[games[i]._id].status : false;
                minwin = minbetprice * oddsprice;
            }
            var row = Object.assign({},{status : status},{gamename : games[i].name},{oddsprice : oddsprice},{minwin : minwin},{minbetprice : minbetprice},{ id : games[i]._id});
            rows.push(row);
        }
        this.setState({gamelinklist : rows,selecteditem : item})
    }

    gametoggleModal = () =>{
        this.setState({gamemodal : !this.state.gamemodal})
    }

    gamelinkhandleSubmit = (e) =>{
        e.preventDefault();
        var row = {};
        for(var i in this.state.gamelinklist){
            row[this.state.gamelinklist[i].id] = {
                minbetprice : this.state.gamelinklist[i].minbetprice,
                oddsprice : this.state.gamelinklist[i].oddsprice,
                status :  this.state.gamelinklist[i].status
            }
        }
        var item = Object.assign({},{_id : this.state.selecteditem._id},{gamelink : row});
        this.gametoggleModal();
        this.props.gamelink_save(item,this.props.parsedFilter,this.state.filters);
    }

    gamesbetprice_change = (value,index,type) =>{
        var item =  this.state.gamelinklist;
        if(type === "status"){
            item[index][type] = !item[index][type];
        }else{
            item[index][type] = value;
        }
        this.setState({gamelinklist:item})
    }

    timerchange = (bool,value) =>{
        var timer = this.state.timers;
        console.log(value)
        if(!timer){
            timer = {};
            timer[bool] = value;
        }else{
            timer[bool] = value;
        }
        this.setState({timers : timer})
    }
    
    bazaartypechange = (e) =>{
        if(e === "1"){
            this.setState({postCalled : "1",bazaartype : e})
        }else if (e === "2"){
            this.setState({postCalled : "1",bazaartype : e})
        }else{
            this.setState({postCalled : "4",bazaartype : e})
        }
    }

    render() {
    let { columns, data,totalPages,  } = this.state
    return (
        <React.Fragment>
            <FilterComponent 
                filters={this.state.filters}
                handleFilter={this.handleFilter}
            />
            <div  id="admindata_table"  className={`data-list list-view`}>
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
                        dataList={this.props.dataList}
                        handleSidebar={this.toggleModal}
                        />
                    }
                    sortIcon={<ChevronDown />}
                />

                <Modal isOpen={this.state.modal} toggle={this.toggleModal} className="modal-dialog-centered modal-lg" >
                    <Form onSubmit={this.handleSubmit}  action="#" >
                        <ModalHeader toggle={this.toggleModal} className="bg-primary">
                            Add Bazaar
                        </ModalHeader>
                        <ModalBody className="modal-dialog-centered   mt-1">
                            <Row>
                                <Col md="12">
                                    <FormGroup className="form-label-group position-relative has-icon-left">
                                        <Input type="text" placeholder="bazaarname" value={this.state.bazaarname}
                                            onChange={e => this.setState({ bazaarname: e.target.value })} required />
                                        <div className="form-control-position" >
                                            <Edit2 size={15} />
                                        </div>
                                        <Label>bazaarname</Label>
                                    </FormGroup>
                                </Col>

                                <Col md="12">
                                    <FormGroup>
                                        <Label for="gender">bazaartype</Label>
                                        <Select
                                            className="React" classNamePrefix="select" id="bazaartype" name="bazaartype"
                                            options={bazaartype} value={bazaartype.find(obj => obj.value === this.state.bazaartype)}
                                            defaultValue={bazaartype[0]} onChange={e => this.bazaartypechange(e.value )} />
                                    </FormGroup>
                                </Col>

                                <Col md="12">
                                    <FormGroup>
                                        <Label for="gender">Check for Ownership </Label>
                                        <Select
                                            className="React" classNamePrefix="select" id="ownerShip" name="ownerShip"
                                            options={ownerShip} value={ownerShip.find(obj => obj.value === this.state.ownerShip)}
                                            defaultValue={ownerShip[0]} onChange={e => this.setState({ ownerShip: e.value })} />
                                    </FormGroup>
                                </Col>

                                
                            
                                <Col md="12">
                                    <FormGroup className="mt-1">
                                        <Label for="gender">postCalled</Label>
                                        {
                                            this.state.bazaartype === "1" ? 
                                                <Select
                                                    className="React" classNamePrefix="select" id="postCalled" name="postCalled"
                                                    options={postCalled} value={postCalled.find(obj => obj.value === this.state.postCalled)}
                                                defaultValue={postCalled[0]} onChange={e => this.setState({ postCalled: e.value  })} />
                                            : this.state.bazaartype === "2" ? 
                                                <Select
                                                    className="React" classNamePrefix="select" id="postCalled" name="postCalled"
                                                    options={postCalled1} value={postCalled1.find(obj => obj.value === this.state.postCalled)}
                                                defaultValue={postCalled1[0]} onChange={e => this.setState({ postCalled: e.value })} />
                                            : this.state.bazaartype === "3" ? 
                                                <Select
                                                    className="React" classNamePrefix="select" id="postCalled" name="postCalled"
                                                    options={postCalled2} value={postCalled2.find(obj => obj.value === this.state.postCalled)}
                                                defaultValue={postCalled2[0]} onChange={e => this.setState({ postCalled: e.value })} />
                                            : null
                                        }
                                    </FormGroup>
                                </Col>

                                <Col md="12">
                                    <Row>
                                        {   
                                            this.state.postCalled === "1" ?  
                                                <Col md="10" sm="12">
                                                    <FormGroup >
                                                        <Label for="opentime">opentime</Label>
                                                            <Flatpickr className="form-control" value={this.state.timers ?  this.state.timers.opentime : ""}
                                                                options={{ enableTime: true, noCalendar: true, dateFormat: "H:i",}}
                                                                onChange={date => { this.timerchange("opentime",  get_timestring(date[0])); }}
                                                            />
                                                    </FormGroup>
                                                </Col> : 
                                            this.state.postCalled === "2" ? 
                                                <Col md="10" sm="12">
                                                    <FormGroup >
                                                    <Label for="opentime">closetime</Label>
                                                    <Flatpickr className="form-control" value={ this.state.timers ? this.state.timers.closetime : ""}
                                                            options={{ enableTime: true, noCalendar: true, dateFormat: "H:i",}}
                                                            onChange={date => { this.timerchange("closetime",  get_timestring(date[0])); }}
                                                            />                                        </FormGroup>
                                                </Col> : 
                                            this.state.postCalled === "3" ? 
                                                <>
                                                    <Col md="5" sm="12">
                                                        <FormGroup >
                                                        <Label for="opentime">opentime</Label>
                                                        <Flatpickr className="form-control" value={ this.state.timers ? this.state.timers.opentime : ""}
                                                            options={{ enableTime: true, noCalendar: true, dateFormat: "H:i",}}
                                                            onChange={date => { this.timerchange("opentime",  get_timestring(date[0])); }}
                                                            />                                            </FormGroup>
                                                    </Col>
                                                    <Col md="5" sm="12">
                                                        <FormGroup >
                                                        <Label for="opentime">closetime</Label>
                                                        <Flatpickr className="form-control" value={this.state.timers ?this.state.timers.closetime : ""}
                                                            options={{ enableTime: true, noCalendar: true, dateFormat: "H:i",}}
                                                            onChange={date => { this.timerchange("closetime",  get_timestring(date[0])); }}
                                                        />                                            </FormGroup>
                                                    </Col>
                                                </> : 
                                            this.state.postCalled === "4" ?
                                                <>
                                                    <Col md="3" sm="12">
                                                        <FormGroup >
                                                        <Label for="opentime">opentime</Label>
                                                        <Flatpickr className="form-control" value={this.state.timers ?this.state.timers.opentime :""}
                                                            options={{ enableTime: true, noCalendar: true, dateFormat: "H:i",}}
                                                            onChange={date => { this.timerchange("opentime",  get_timestring(date[0])); }}
                                                            />                                            </FormGroup>
                                                    </Col>
                                                    <Col md="3" sm="12">
                                                        <FormGroup >
                                                        <Label for="opentime">closetime</Label>
                                                        <Flatpickr className="form-control" value={this.state.timers ?this.state.timers.closetime : ""}
                                                            options={{ enableTime: true, noCalendar: true, dateFormat: "H:i",}}
                                                            onChange={date => { this.timerchange("closetime",  get_timestring(date[0])); }}
                                                        />                                            </FormGroup>
                                                    </Col>
                                                    <Col md="3" sm="12">
                                                        <FormGroup >
                                                        <Label for="opentime">Interval</Label>
                                                            <Input type="text" required onChange={e => this.timerchange("interval", e.target.value)} value={ this.state.timers ? this.state.timers.interval :""} id="interval" name="interval" />
                                                        </FormGroup>
                                                    </Col>
                                                </>  : null
                                        }

                                        <Col md="12">
                                            <Label>blocktime(Please enter minutues)</Label>
                                            <FormGroup className="form-label-group">
                                                <Input type="text" placeholder="blocktime" value={this.state.blocktime}
                                                onChange={e => this.setState({ blocktime: e.target.value })} required />
                                            </FormGroup>
                                        </Col>

                                        <Col md="12">
                                            <FormGroup>
                                                <Label for="Week">Week</Label>
                                                <Select
                                                    isClearable={false} isMulti closeMenuOnSelect={false} 
                                                    components={animatedComponents} 
                                                    className="react-select" classNamePrefix="select" id="Week" name="Week"
                                                    options={weekoptions} value={this.state.week}
                                                    onChange={e => this.setState({week : e})} 
                                                />
                                            </FormGroup>
                                        </Col>

                                        <Col md="4">
                                            <Label for="Result">Result Mode</Label>
                                            <label className="react-toggle-wrapper">
                                                <Toggle checked={this.state.resultmode}  onChange={()=>this.setState({resultmode : !this.state.resultmode})} name="controlledSwitch" value="Automatic" />
                                                <Button.Ripple color="primary" onClick={()=>this.setState({resultmode : !this.state.resultmode})} size="sm" >
                                                {this.state.resultmode ? "Automatic " : "manual "}
                                                </Button.Ripple>
                                            </label>
                                        </Col>

                                        
                                        <Col md="4">
                                            <Label for="HightLight">HightLight</Label>
                                            <label className="react-toggle-wrapper">
                                                <Toggle checked={this.state.hightlight}  onChange={()=> this.setState({ hightlight: !this.state.hightlight })} name="controlledSwitch" value="yes" />
                                                <Button.Ripple color="primary"   onChange={()=> this.setState({ hightlight: !this.state.hightlight })} size="sm" >
                                                {this.state.hightlight ? "Enable" : "Diable"}
                                                </Button.Ripple>
                                            </label>
                                        </Col>

                                        <Col md="4">
                                            <Label for="notification">Main notification</Label>
                                            <label className="react-toggle-wrapper">
                                                <Toggle checked={this.state.notification}  onChange={()=> this.setState({ notification: !this.state.notification })} name="controlledSwitch" value="yes" />
                                                <Button.Ripple color="primary"   onChange={()=> this.setState({ notification: !this.state.notification })} size="sm" >
                                                {this.state.notification ? "Enable" : "Diable"}
                                                </Button.Ripple>
                                            </label>
                                        </Col>


                                        <Col md="12" className="mt-1">
                                            <Label for="Status">Status</Label>
                                            <label className="react-toggle-wrapper">
                                                <Toggle checked={this.state.isChecked}  onChange={()=> this.setState({ isChecked: !this.state.isChecked })} name="controlledSwitch" value="yes" />
                                                <Button.Ripple color="primary"   onChange={()=> this.setState({ isChecked: !this.state.isChecked })} size="sm" >
                                                {this.state.isChecked ? "Enable" : "Diable"}
                                                </Button.Ripple>
                                            </label>
                                        </Col>
                                        

                                    </Row>
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
                        
                <Modal isOpen={this.state.gamemodal} toggle={this.gametoggleModal} className="modal-dialog-centered modal-lg" >
                    <Form onSubmit={this.gamelinkhandleSubmit}  action="#" >
                        <ModalHeader toggle={this.gametoggleModal} className="bg-primary">
                            Game Link
                        </ModalHeader>
                        <ModalBody className="modal-dialog-centered   mt-1">
                            <Table responsive striped>
                                <thead>
                                    <tr>
                                        <th>S.No</th>
                                        <th>check</th>
                                        <th>Game Name</th>
                                        <th>Min Bet</th>
                                        <th>Odds</th>
                                        <th>Min Win</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        this.state.gamelinklist && this.state.gamelinklist.length > 0 ? this.state.gamelinklist.map((item,i)=>(
                                            <tr key={i}>
                                                <td>{i + 1}</td>
                                                <td>
                                                <CustomInput
                                                    inline
                                                    onChange={e => this.gamesbetprice_change(e.target.value,i,"status")}
                                                    checked={item.status } 
                                                    type="checkbox"
                                                    id={"Status" + i}
                                                    label="Status"
                                                />
                                                    {/* <Checkbox color="primary"   icon={<Check className="vx-icon" size={16} />}
                                                        label="Status"  /> */}
                                                </td>
                                                <td className="font-weight-bold">
                                                    {item.gamename}
                                                </td>
                                                <td>
                                                    <Input type="number"  onChange={e => this.gamesbetprice_change(e.target.value,i,"minbetprice")} 
                                                    value={item.minbetprice}  />
                                                </td>
                                                <td>
                                                    <Input type="number"  onChange={e => this.gamesbetprice_change(e.target.value,i,"oddsprice")} 
                                                    value={item.oddsprice} />
                                                </td>
                                                <td>
                                                    {item.minbetprice * item.oddsprice}
                                                </td>
                                            </tr> 
                                        )) : null
                                    }
                                </tbody>
                            </Table>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="primary" type="submit">Accept</Button>
                        </ModalFooter>
                    </Form>
                </Modal> 
            </div>
    </React.Fragment>
    )
}
}

const mapStateToProps = state => {
  return {
    dataList: state.matka.bazaars
  }
}

export default connect(mapStateToProps, {getData,menusave,menuupdate,menudelete,gamelink_save})(Child)