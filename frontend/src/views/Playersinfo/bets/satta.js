
import React, { useEffect, useState } from 'react'
import { TabContent, Nav, NavItem, NavLink,UncontrolledDropdown,  DropdownMenu,  DropdownToggle,DropdownItem,Col,Row, Badge} from 'reactstrap'
import queryString from "query-string"
import {satta_history_load} from "../../../redux/actions/profileinfo"
import { useDispatch, useSelector } from 'react-redux'
import { history } from '../../../history'
import {selectedStyle,pagenation_set,Bazaartype_key} from "../../../configs/providerconfig"
import DataTable from "react-data-table-component"
import ReactPaginate from "react-paginate"
import { ChevronDown,  ChevronLeft,  ChevronRight} from "react-feather"
import DatePicker from "../../lib/datepicker"
import { dateConvert } from "../../../redux/actions/auth"

const TabsJustified = (props) => {
    const dispatch = useDispatch()
    
    const dataList = useSelector(state =>  state.profileinfo.Satta)

    const [active, setActive] = useState(Bazaartype_key.regular)
    const [data, setData] = useState([])
    const [totalPages, setTotalPages] = useState(0)
    // const [columns, setColumns] = useState( [
    const [columns] = useState( [
        {
            name: "Betid",
            selector: "transactionid",
            sortable: true,
        }, 
        {
            name: "BazarName",
            selector: "BazzarName",
            sortable: true,
            cell: row => (
                <div>
                    {row.bazaarid.bazaarname}
                </div>
            )
        },
        {
            name: "Gamename",
            selector: "GameName",
            sortable: true,
            cell: row => (
                <div>
                    {row.gameid.name}
                </div>
            )
        },
        {
            name: "Timer",
            selector: "Timer",
            sortable: true,
            cell: row => (
                <div className="text-uppercase">
                    {row.time_flag === "1" ? "open" : row.time_flag === "2" ? "close" : row.time_flag === "3" ? "Open-Close" : row.time_flag }
                </div>
            )
        },
        {
            name: "betnumber",
            selector: "betnumber",
            sortable: true,
        },  
        {
            name: "amount",
            selector: "amount",
            sortable: true,
        },  
        {
            name: "currency",
            selector: "currency",
            sortable: true,
            cell: row => (
                <Badge pill color = "light-success">
                    INR
                </Badge>
            )
        },
        {
            name: "status",
            selector: "status",
            sortable: true,
            cell : row =>(
                <Badge pill color = { row.status === "pending" ? "light-warning" :  row.status === "win" ?  "light-success" : "light-danger"}>
                  { row.status }
                </Badge >
            )
        }, 
        {
            name: "DATE",
            selector: "DATE",
            sortable: true,
            cell: row => (
            <span>
                {dateConvert (row.DATE)}
            </span>
            )
        },
     
      ],)
    
    const [parsedFilter, setParsedFilter] = useState({})

    const [date, setDate] = useState({
        start : new Date(),
        end : new Date(new Date().valueOf() + 24 * 60 * 60 * 1000),
    })

    
    useEffect(()=>{
        let params =  queryString.parse(props.parsedFilter)
        setParsedFilter(params)
        dispatch(satta_history_load(date,props.user,active,params))
    },[])

    useEffect(()=>{
        if (dataList) {
            setData(dataList.data)
            setTotalPages(dataList.totalPages)
        }
    },[dataList])

    const toggle = tab => {
        if (active !== tab) {
            setActive(tab)
            dispatch(satta_history_load(date,props.user,tab,parsedFilter))
        }
    }

    const handlePagination = page => {
        let perPage = parsedFilter.perPage !== undefined ? parsedFilter.perPage : pagenation_set[0];
        let urlPrefix =`${history.location.pathname}`;
        history.push( `${urlPrefix}?page=${page.selected + 1}&perPage=${perPage}`);
        let params = { page: page.selected + 1, perPage: perPage };
        setParsedFilter(params)
        dispatch(satta_history_load(date,props.user,active,params))
    }

    
    const handleRowsPerPage = value => {
        let page = parsedFilter.page !== undefined ? parsedFilter.page : 1;
        history.push(`${history.location.pathname}?page=${page}&perPage=${value}`)
        let params = { page: page, perPage: value };
        setParsedFilter(params)
        dispatch(satta_history_load(date,props.user,active,params))
    }
    
    const date_change =  (e) =>{
        setDate(e)
        dispatch(satta_history_load(e,props.user,active,parsedFilter))
    }

        
    const CustomHeader = props => {
        let {totalRecords,sortIndex } = props.dataList;
        return (
            <Row>
                <Col md='3' className='justify-content-start align-items-center flex'>
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
                <Col xs="12" sm='12'  md="6" className='mt-1'>
                    <DatePicker  onChange={date => { props.setDate(date) }} />
                </Col>
            </Row>
        )
    }
    
      
    return (
        <React.Fragment>
        <Nav tabs justified>
            <NavItem>
            <NavLink
                active={active === '1'}
                onClick={() => {
                toggle('1')
                }}
                className="text-uppercase"
            >
                Regular Bazar
            </NavLink>
            </NavItem>
            <NavItem>
            <NavLink
                active={active === '2'}
                onClick={() => {
                toggle('2')
                }}
                className="text-uppercase"
            >
                King Bazar
            </NavLink>
            </NavItem>
            <NavItem>
            <NavLink
                active={active === '3'}
                onClick={() => {
                toggle('3')
                }}
                className="text-uppercase"
            >
                StartLine Bazar
            </NavLink>
            </NavItem>
        
        </Nav>
        <TabContent className='py-50' activeTab={active}>

            {/* <Child parsedFilter={parsedFilter}/> */}

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
                    parsedFilter.page
                        ? parseInt(parsedFilter.page - 1)
                        : 0
                    }
                    onPageChange={page => handlePagination(page)}
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
                    date={date}
                    setDate={(e)=>date_change(e)}
                    handleRowsPerPage={handleRowsPerPage}
                    dataList = {dataList}
                />
                }
                sortIcon={<ChevronDown />}
            />
            </div>
        </TabContent>
    </React.Fragment>
  )
}

export default TabsJustified