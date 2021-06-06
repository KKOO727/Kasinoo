import React, { Component } from 'react'
import { connect } from 'react-redux'
import {Row,Col} from "reactstrap"
import { Bazarheader,Bazaartype_key, GitemheaderRegular, Gitemheaderking, GitemheaderStart, games_id_key} from "../../../../configs/providerconfig"
import {Lock} from "react-feather"
import {goTopageResult,goToPageResultannounce ,goTopagebetplayers} from "../../../../redux/actions/matka/dashboard/regular"
import {get_date, get_options} from "../../../../redux/actions/auth/index"

export class bazaar extends Component {
    constructor(props) {
        super(props)
        this.state = {
            flag : true,
            select : null,
            timer : "",
        }
    }
    
    TimerShow = (item) => {
        let type = item.bazaartype;
        switch (type) {
            case Bazaartype_key['king-bazaar']:
            return <div>
                { item.timers.opentime  ? "( " + get_date(item.timers.opentime) +" )" : "" }
            </div>
            case Bazaartype_key.regular:
                return <div>
                { item.timers.opentime && item.timers.closetime  ? "( " + get_date(item.timers.opentime) + " " + get_date(item.timers.closetime)  +" )" : "" }
            </div>
            default:
                return <div>
                { item.timers.opentime  ? "( " + get_date(item.timers.opentime) +" )" : "" }
            </div>
        }
    }

    GitemHeaderRender = (item) => {
        let type = item.bazaartype;
        
        switch (type) {
            case Bazaartype_key.regular:
                return <Col md="12" className="pt-1">
                    <Row>
                        {
                            GitemheaderRegular.map((item,i)=>(
                                <div className="gameheader" style={{width : 100/GitemheaderRegular.length + "%"}} key={i} >
                                    {
                                        item
                                    }
                                </div>
                            ))
                        }
                    </Row>
                </Col>
            case Bazaartype_key['king-bazaar']:
                return <Col md="12" className="pt-1">
                    <Row>
                        {
                            Gitemheaderking.map((item,i)=>(
                                <div className="gameheader" style={{width : 100/Gitemheaderking.length + "%"}} key={i} >
                                    {
                                        item
                                    }
                                </div>
                            ))
                        }
                    </Row>
                </Col>
            default:
                return <Col md="12" className="pt-1">
                    <Row>
                        {
                            GitemheaderStart.map((item,i)=>(
                                <div className="gameheader" style={{width : 100/GitemheaderStart.length + "%"}} key={i} >
                                    {
                                        item
                                    }
                                </div>
                            ))
                        }
                    </Row>
                </Col>

        }
    }

    getCalcAmt  = (item) => {
        if (item) {
            return parseInt(item.amount)
        } else {
            return 0
        }
    }

    getCalcbets  = (item) => {
        if (item) {
            return parseInt(item.count)
        } else {
            return 0
        }
    }

    getCalcProfit = (item) => {
        if (item) {
            return parseInt(item.profit)
        } else {
            return 0
        }
        
    }

    getCalcLoss = (item) => {
        if (item) {
            return parseInt(item.loss)
        } else {
            return 0
        }

    }

    getbettingPlayer = (btiem,gitem,bets) => {
        if (bets) {
            const {bazarListObject, bazaars, gameList} = this.props;
            this.props.goTopagebetplayers(btiem,gitem,this.props.date,bazarListObject, bazaars, gameList)
        }
    }

    GitemBodyRender = (bitem, games) => {
        let type = bitem.bazaartype;
        let gamelist = this.props.gameList;
        switch (type) {
            case Bazaartype_key.regular:
                return <div md="12" className="d-flex w-100">
                    {
                        gamelist.map((item,i)=>(
                            <div key={i} className="gamebody d-flex" style={{width : 100/gamelist.length + "%"}}>
                                {
                                    games[item._id] ? 
                                        games_id_key.Jodi === item._id ?
                                            <div className="w-100" onClick={()=>this.getbettingPlayer(bitem,item,this.getCalcbets(games[item._id]))} >
                                                Open - Close
                                                <br />
                                                {
                                                    "Amt : " + this.getCalcAmt(games[item._id])
                                                }
                                                <br />
                                                {
                                                    "Count : " + this.getCalcbets(games[item._id])
                                                }
                                                <br />
                                                <span style={{color:"green"}}>
                                                {
                                                    "Profit : " + this.getCalcProfit(games[item._id])
                                                }
                                                </span>
                                                <br />
                                                <span style={{color:"red"}}>
                                                    {
                                                        "Loss : " + this.getCalcLoss(games[item._id])
                                                    }
                                                </span>
                                            </div>
                                        : games_id_key['full sangam'] === item._id?
                                            <div className="w-100"onClick={()=>this.getbettingPlayer(bitem,item,(this.getCalcbets(games[item._id]) + this.getCalcbets(games[item._id])))} >
                                                Open - Close
                                                <br />
                                                {
                                                    "Amt : " + (this.getCalcAmt(games[item._id]) + this.getCalcAmt(games[item._id]) )
                                                }
                                                <br />
                                                {
                                                    "Count : " + (this.getCalcbets(games[item._id]) + this.getCalcbets(games[item._id]))
                                                }
                                                <br />
                                                <span style={{color:"green"}}>
                                                {
                                                    "Profit : " + this.getCalcProfit(games[item._id])
                                                }
                                                </span>
                                                <br />
                                                <span style={{color:"red"}}>
                                                    {
                                                        "Loss : " + this.getCalcLoss(games[item._id])
                                                    }
                                                </span>
                                            </div>
                                        : games_id_key['half sangam'] === item._id?
                                            <div className="w-100" onClick={()=>this.getbettingPlayer(bitem,item,this.getCalcbets(games[item._id]))}>
                                                Open - Close
                                                <br />
                                                {
                                                    "Amt : " + this.getCalcAmt(games[item._id] )
                                                }
                                                <br />
                                                {
                                                    "Count : " +  this.getCalcbets(games[item._id]) 
                                                }
                                                <br />
                                                <span style={{color:"green"}}>
                                                {
                                                    "Profit : " + this.getCalcProfit(games[item._id])
                                                }
                                                </span>
                                                <br />
                                                <span style={{color:"red"}}>
                                                    {
                                                        "Loss : " + this.getCalcLoss(games[item._id])
                                                    }
                                                </span>
                                            </div>
                                        :
                                        <React.Fragment>
                                            <div className="w-50" onClick={()=>this.getbettingPlayer(bitem,item,this.getCalcbets(games[item._id]))}>
                                                Open 
                                                <br />
                                                {
                                                    "Amt : " + this.getCalcAmt(games[item._id] )
                                                }
                                                <br />
                                                {
                                                    "Count : " + this.getCalcbets(games[item._id] )
                                                }
                                                <br />
                                                <span style={{color:"green"}}>
                                                {
                                                    "Profit : " + this.getCalcProfit(games[item._id])
                                                }
                                                </span>
                                                <br />
                                                <span style={{color:"red"}}>
                                                    {
                                                        "Loss : " + this.getCalcLoss(games[item._id])
                                                    }
                                                </span>
                                            </div>
                                            <div  className="w-50" onClick={()=>this.getbettingPlayer(bitem,item,this.getCalcbets(games[item._id]))}>
                                                Close
                                                <br />
                                                {
                                                    "Amt : " + this.getCalcAmt(games[item._id] )
                                                }
                                                <br />
                                                {
                                                    "Count : " + this.getCalcbets(games[item._id] )
                                                }
                                                <br />
                                                <span style={{color:"green"}}>
                                                {
                                                    "Profit : " + this.getCalcProfit(games[item._id])
                                                }
                                                </span>
                                                <br />
                                                <span style={{color:"red"}}>
                                                    {
                                                        "Loss : " + this.getCalcLoss(games[item._id])
                                                    }
                                                </span>
                                            </div>
                                        </React.Fragment>
                                    :
                                    <div className="w-100 d-flex align-items-center justify-content-center text-center" >
                                        <Lock size={15} />
                                    </div>
                                }

                            </div>
                        ))
                    }
                </div>
            case Bazaartype_key['king-bazaar']:
                return <div md="12" className="d-flex w-100">
                    {
                        gamelist.map((item,i)=>(
                            <div key={i} className="gamebody d-flex" style={{width : 100/gamelist.length + "%"}} 
                            >
                                {
                                    games[item._id] ? 
                                    <React.Fragment>
                                            <div  className="w-100"  
                                                onClick={()=>this.getbettingPlayer(bitem,item,this.getCalcbets(games[item._id]))} 
                                            >
                                                Open
                                                <br />
                                                {
                                                    "Amt : " + this.getCalcAmt(games[item._id]) 
                                                }
                                                <br />
                                                {
                                                    "Count : " + this.getCalcbets(games[item._id])
                                                }
                                                <br />
                                                <span style={{color:"green"}}>
                                                {
                                                    "Profit : " + this.getCalcProfit(games[item._id])
                                                }
                                                </span>
                                                <br />
                                                <span style={{color:"red"}}>
                                                    {
                                                        "Loss : " + this.getCalcLoss(games[item._id])
                                                    }
                                                </span>
                                            </div>
                                        </React.Fragment>
                                    :
                                    <div className="w-100 d-flex align-items-center justify-content-center text-center" >
                                        <Lock size={15} />
                                    </div>
                                }

                            </div>
                        ))
                    }
                </div>
            default:
                return <div md="12" className="d-flex w-100">
                {
                    gamelist.map((item,i)=>(
                        <div key={i} className="gamebody d-flex" style={{width : 100/gamelist.length + "%"}}
                        >
                            {
                                games[item._id] && games[item._id][this.state.timer] ? 
                                <React.Fragment>
                                        <div  className="w-100"
                                    onClick={()=>this.getbettingPlayer(bitem,item,this.getCalcbets(games[item._id][this.state.timer]))} 
                                        >
                                            Open
                                            <br />
                                            {
                                                "Amt : " + this.getCalcAmt(games[item._id][this.state.timer])
                                            }
                                            <br />
                                            {
                                                "Count : " + this.getCalcbets(games[item._id][this.state.timer])
                                            }
                                            <br />
                                            <span style={{color:"green"}}>
                                            {
                                                "Profit : " + this.getCalcProfit(games[item._id][this.state.timer])
                                            }
                                            </span>
                                            <br />
                                            <span style={{color:"red"}}>
                                                {
                                                    "Loss : " + this.getCalcLoss(games[item._id][this.state.timer])
                                                }
                                            </span>
                                        </div>
                                    </React.Fragment>
                                :
                                <div className="w-100 d-flex align-items-center justify-content-center text-center" >
                                    <Lock size={15} />
                                </div>
                            }

                        </div>
                    ))
                }
               
            </div>
        }
    }


    bazarClick = (item) => {
        if (item === this.state.select) {
            if (this.state.flag) {
                this.setState({flag : false})
            } else {
                this.setState({flag : true})
            }
        } else {
            this.setState({select : item , flag : true})
        }
    }

    getTotal = (timer, gamelist) => {
        let row = {
            amount : 0,
            count : 0
        }
        for (var i in gamelist) {
            if (gamelist[i][timer]) {
                row.amount += gamelist[i][timer].amount;
                row.count += gamelist[i][timer].count;
            }
        }
        return row;
    }
    

    render() {
        const {bazarListObject, bazaars, gameList, flag} = this.props;
        return (
            <div className="satta">
                
                <Row>
                    {
                        !flag ? 
                        Bazarheader.map((item,i)=> (
                            <Col md="4" className="bazarheader" key={i}>
                                {
                                    item
                                }
                            </Col>  
                        ))
                        : null
                    }

                    {
                        !flag ? Object.keys(bazaars).map((item,i)=>(
                            <Col md="12" className="bazarbody pt-1" key={i}>
                                <Row>
                                    <Col md="4" className="pt-1 pl-2 pr-2 pb-0">
                                        <div className="bazaritem d-block" onClick={()=>this.bazarClick(item)}>
                                            <div>
                                                {
                                                    bazarListObject[item].bazaarname
                                                }
                                            </div>
                                            {
                                                this.TimerShow(bazarListObject[item])
                                            }
                                        </div>
                                    </Col>
                                    <Col md="4"className="pt-1 pl-2 pr-2 pb-0">
                                        <div className="bazaritem" onClick={()=>this.props.goTopageResult(bazarListObject[item], gameList, this.props.date, {result : bazaars[item].result, bets : bazaars[item].total.count, amt : bazaars[item].total.bet})}>
                                            <div className="d-block">
                                                <div className="result d-block">
                                                    {
                                                        bazarListObject[item].bazaartype !== Bazaartype_key.starline ? 
                                                        bazaars[item].result
                                                        : "---"
                                                    }
                                                    
                                                </div>
                                                <div className=" d-block">

                                                    {
                                                        "Bets : " +  bazaars[item].total.count
                                                    }&nbsp;&nbsp;
                                                    {
                                                        "Amt : " +  bazaars[item].total.bet
                                                    }
                                                    &nbsp;&nbsp;
                                                    {
                                                        "Profit/Loss : " +  bazaars[item].total.GGR + "/" + (bazaars[item].total.loss)
                                                    }
                                                </div>
                                            </div>

                                        </div>
                                    </Col>
                                    <Col md="4" className="pt-1 pl-2 pr-2 pb-0">
                                        <div className="bazaritem" onClick={()=>this.props.goToPageResultannounce(bazarListObject[item], gameList, this.props.date)}>
                                            Announcer
                                        </div>
                                    </Col>
                                    {
                                        (this.state.select === item  && this.state.flag)? 
                                        <React.Fragment>
                                            {
                                                bazarListObject[item].bazaartype === Bazaartype_key.starline ?
                                                    <React.Fragment>
                                                        
                                                        {
                                                            get_options(bazarListObject[item].timers).map((titem, i)=>(
                                                                <Col md="2" key={i} onClick={()=>this.setState({timer : titem})} className={"satta-events-items m-1 mb-0 " + (this.state.timer === titem ? " satta-events-items-active" : "")} >
                                                                    {titem}
                                                                    <br />
                                                                    {
                                                                        "Amt : " + (this.getTotal(titem, bazaars[item].games)).amount
                                                                    }
                                                                        <br />
                                                                    {
                                                                        "Bets : "  + (this.getTotal(titem, bazaars[item].games)).count
                                                                    }
                                                                    
                                                                </Col>
                                                            ))
                                                        }
                                                    </React.Fragment>                                        

                                                : null
                                            }

                                            {
                                                this.GitemHeaderRender(bazarListObject[item])
                                            }
                                            {
                                                this.GitemBodyRender(bazarListObject[item],bazaars[item].games)
                                            }
                                        </React.Fragment>                                        
                                        : null
                                    }
                                </Row>
                            </Col>
                        ))
                        : 
                        <Col md="12" className="bazarbody pt-1" >
                                <Row>
                                    <Col md="4" className="pt-1 pl-2 pr-2 pb-0">
                                        <div className="bazaritem d-block" onClick={()=>this.bazarClick(this.props.bazaritem._id)}>
                                            <div>
                                                {
                                                    this.props.bazaritem.bazaarname
                                                }
                                            </div>
                                            {
                                                this.TimerShow(this.props.bazaritem)
                                            }
                                        </div>
                                    </Col>
                                    <Col md="4"className="pt-1 pl-2 pr-2 pb-0">
                                        <div className="bazaritem" onClick={()=>this.props.goTopageResult(this.props.bazaritem, gameList, this.props.date, {result : bazaars[this.props.bazaritem._id].result, bets : bazaars[this.props.bazaritem._id].total.count, amt : bazaars[this.props.bazaritem._id].total.bet})}>
                                            <div className="d-block">
                                                <div className="result d-block">
                                                    {
                                                        bazaars[this.props.bazaritem._id].result
                                                    }
                                                </div>
                                                <div className=" d-block">

                                                    {
                                                        "Bets : " +  bazaars[this.props.bazaritem._id].total.count
                                                    }&nbsp;&nbsp;
                                                    {
                                                        "Amt : " +  bazaars[this.props.bazaritem._id].total.bet
                                                    }
                                                    &nbsp;&nbsp;
                                                    {
                                                        "Profit/Loss : " +  bazaars[this.props.bazaritem._id].total.GGR + "/" + (bazaars[this.props.bazaritem._id].total.loss)
                                                    }
                                                </div>
                                            </div>

                                        </div>
                                    </Col>
                                    <Col md="4" className="pt-1 pl-2 pr-2 pb-0">
                                        <div className="bazaritem" onClick={()=>this.props.goToPageResultannounce(this.props.bazaritem, gameList, this.props.date)}>
                                            Announcer
                                        </div>
                                    </Col>
                                    {
                                        (this.state.select === this.props.bazaritem._id  && this.state.flag) || flag? 
                                        <React.Fragment>
                                            {
                                                this.props.bazaritem.bazaartype === Bazaartype_key.starline ?
                                                    <React.Fragment>
                                                        
                                                        {
                                                            get_options(this.props.bazaritem.timers).map((titem, i)=>(
                                                                <Col md="2" key={i} onClick={()=>this.setState({timer : titem})} className={"satta-events-items m-1 mb-0 " + (this.state.timer === titem ? " satta-events-items-active" : "")} >
                                                                    {titem}
                                                                    <br />
                                                                    {
                                                                        "Amt : " + (this.getTotal(titem, bazaars[this.props.bazaritem._id].games)).amount
                                                                    }
                                                                        <br />
                                                                    {
                                                                        "Bets : "  + (this.getTotal(titem, bazaars[this.props.bazaritem._id].games)).count
                                                                    }
                                                                    
                                                                </Col>
                                                            ))
                                                        }
                                                    </React.Fragment>                                        

                                                : null
                                            }

                                            {
                                                this.GitemHeaderRender(this.props.bazaritem)
                                            }
                                            {
                                                this.GitemBodyRender(this.props.bazaritem,bazaars[this.props.bazaritem._id].games)
                                            }
                                        </React.Fragment>                                        
                                        : null
                                    }
                                </Row>
                            </Col>
                    }
                </Row>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
})

const mapDispatchToProps = {
    goTopageResult,goToPageResultannounce,goTopagebetplayers
}

export default connect(mapStateToProps, mapDispatchToProps)(bazaar)
