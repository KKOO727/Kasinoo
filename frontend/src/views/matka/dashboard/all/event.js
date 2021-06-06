import React, { Component } from 'react'
import { connect } from 'react-redux'
import Breadcrumbs from "../../../../components/@vuexy/breadCrumbs/BreadCrumb"
import {Row,Col} from "reactstrap"
import {get_bets_from_bazarr} from "../../../../redux/actions/matka/dashboard/regular"
// import Datepicker from "../../../lib/datepicker"
import {
    Modal,
    ModalHeader,
    ModalBody,
  } from "reactstrap"
import { Bazaartype_key,games_id_key} from "../../../../configs/providerconfig"
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import {get_options} from "../../../../redux/actions/auth"

const StatusKey = {
    "pending" : "bet",
    "win" : "win",
    "rollback" : "rollback",
    "cancel" : "void"
}

export class event extends Component {

    state = {
        modal: false,
        count : 0,
        amt : 0,
        profit :0,
        selectnumber : "",
        selecttimer : "1",
        GGR : 0,
        win : 0
    }

    datechange =  (e) =>{

    }

    componentDidMount () {
        const {bazaritem ,date} = this.props.location.state;
        this.props.get_bets_from_bazarr(bazaritem ,date)
    }

    show = (itemk) =>{
        this.setState({modal : !this.state.modal,bets :itemk.bets , amt : itemk.amt,profit : 0,num :itemk.num })
    }

    toggleModal = () => {
        this.setState(prevState => ({
          modal: !prevState.modal
        }))
    }

    set_merge =  (array1,array2,array3) =>{
        var array = [];
        for(let i in array1){
           for(let j in array1[i]){
               array.push(array1[i][j]);
           } 
        }

        for(let i in array3){
            for(let j in array3[i]){
                array.push(array3[i][j]);
            } 
        }

        for(let i in array2){
            array.push(array2[i]);
        }

        return array
    }

    getRow = (bazaaritem,timerflag,active) => {
       
        let numbersdata = this.props.data.numbersData;

        var numbers = numbersdata.find(obj=>obj.bool === active.bool);
        
        if(numbers){    
            let name = (timerflag === "1" ? "Open " : timerflag === "2" ? "Close " : "Open - Close ") + active.name;
            let list =  [{ list : numbers.gamenumbers,timerflag : timerflag ,type : 0 , name : name}];
            return list
        }else{
            let gamenumbers ={};
            let num1 = numbersdata.find(obj =>obj.bool === "3").gamenumbers;
            let num2 = numbersdata.find(obj =>obj.bool === "4").gamenumbers;
            let num3 = numbersdata.find(obj =>obj.bool === "5").gamenumbers;
            let degitnumbers = numbersdata.find(obj =>obj.bool === "1").gamenumbers;

            if(active.bool === "6"){
                gamenumbers["Single Ank"] = numbersdata.find(obj =>obj.bool === "1").gamenumbers;
                gamenumbers["Open Pana"] = this.set_merge(num1,num2,num3);                
                let list =  [
                    { list : gamenumbers["Open Pana"],name : "Open Pana",timerflag : "1",type : 1 },
                    { list : gamenumbers["Single Ank"],name : "Close Single Ank",timerflag : "2" ,type : 2},
                    { list : gamenumbers["Open Pana"],name : "Close Pana", timerflag : "2" ,type : 3},
                    { list : gamenumbers["Single Ank"],name : "Open Single Ank",timerflag : "1",type : 4 },
                ];
                return list
            }else if(active.bool === "7"){

                gamenumbers["Open Pana"] = this.set_merge(num1,num2,num3);
                gamenumbers["Close Pana"] = this.set_merge(num1,num2,num3);
                let list =  [
                    { list : gamenumbers["Open Pana"],name : "Open Pana.",timerflag : "1" ,type : 5 },
                    { list : gamenumbers["Close Pana"],name : "Close Pana.",timerflag : "2",type : 6  }
                ];
                return list
            }else if (active.bool === "8") {
                let list =  [
                    { list : degitnumbers,name : "First Digit",timerflag : "1",type : 0 },
                ];
                return list
            } else if (active.bool === "9") {
                let list =  [
                    { list : degitnumbers,name : "second Digit",timerflag : "1",type : 0 },
                ];
                return list
            }
        }
    }

    gameTimerRender = (bazaritem) => {
        let timersoption = bazaritem.bazaartype === Bazaartype_key.starline ? get_options(bazaritem.timers) : [];
        return <React.Fragment>
            {
                bazaritem.bazaartype === Bazaartype_key.starline ?
                <React.Fragment>
                    {
                        timersoption.map((item,i)=>(
                            <div  onClick={()=>this.timerChange(item)} className={"timer" + (this.state.selecttimer === item ? " timeractive" : "" )} style={{width:"15%",display:"block"}} key={i}>
                                {item}
                                {
                                    this.getbettingFromtime(item,true)
                                }
                            </div>
                        ))
                    }
                </React.Fragment>
                :
                bazaritem.bazaartype === Bazaartype_key.regular ? 
                <React.Fragment>
                    <div className={"timer" + (this.state.selecttimer === "1" ? " timeractive" : "" )} onClick={()=>this.timerChange("1")} style={{width:"50%"}}>
                        Open 
                        {
                            this.getbettingFromtime("1")
                        }
                    </div>
                    <div className={"timer" + (this.state.selecttimer === "2" ? " timeractive" : "" )} onClick={()=>this.timerChange("2")} style={{width:"50%"}}>
                        Close
                        {
                            this.getbettingFromtime("2")
                        }
                    </div>
                </React.Fragment>
                :
                <React.Fragment>
                    <div className={"timer" + (this.state.selecttimer === "1" ? " timeractive" : "" )} onClick={()=>this.timerChange("1")} style={{width:"100%"}}>
                        Open 
                        {
                            this.getbettingFromtime("1")
                        }
                    </div>
                </React.Fragment>
            }

        </React.Fragment>
    }

    getbettingFromtime = (timer,flag) => {
        
        let wallet = {
            bet : 0,
            win : 0,
            rollback : 0,
            void : 0,
            GGR : 0,
            count : 0
        }

        let selecttimer = ["3"];
        selecttimer.push(timer);

        const {bettingObject,} = this.props.data;
        for (let i in bettingObject) {
            for (var j in bettingObject[i]) {
                for (let t in selecttimer) {
                    for (var k in bettingObject[i][j][selecttimer[t]]) {
                        for (let l in bettingObject[i][j][selecttimer[t]][k]) {

                            let obj = bettingObject[i][j][selecttimer[t]][k][l];
                            let status = l;
                            let betam = parseInt(obj['AMOUNT']);
                            let winam = parseInt(obj['winamount']);
                            let count = parseInt(obj['COUNT']);
                            wallet[status] += status === StatusKey.win ? winam : betam;
                            wallet.count += status === StatusKey.pending ? count : 0;

                        }
                    }
                }
            }
        }
        wallet["GGR"] = wallet.bet - wallet.win - wallet.rollback;

        if (flag) {
            return <div className="m-0">
                <p  className="m-0">
                    {"amt : " + wallet.bet}
                </p>
                <p  className="m-0">
                { "count : " + wallet.count}
                </p>
                {/* <p  className="m-0">
                { "profit/Loss : " + wallet.GGR + "/" + wallet.win}
                </p> */}
            </div>
        } else {
            return <span>
            {"amt : " + wallet.bet}&nbsp;&nbsp;
            { "count : " + wallet.count}&nbsp;&nbsp;
            {/* { "profit : " + wallet.GGR+ "/" + wallet.win} */}
            </span>
        }
    }

    getbettingFromGameid = (gameid) => {
        
        const {bettingObject} = this.props.data;
        let wallet = {
            bet : 0,
            win : 0,
            rollback : 0,
            void : 0,
            GGR : 0,
            count : 0
        }
        
        let selecttimer = [];

        if (games_id_key.Jodi === gameid) {
            selecttimer = ["3"];
        } else if (games_id_key['full sangam']  === gameid || games_id_key['half sangam'] === gameid) {
            selecttimer = ["1","2"];
        } else {
            selecttimer = [this.state.selecttimer];
        }

        if (bettingObject) {
            for (let i in bettingObject) {
                if (bettingObject[i][gameid]) {

                    for (var k in selecttimer) {
                        let timer = selecttimer[k];

                        if (bettingObject[i][gameid][timer]) {
                            for (let j in bettingObject[i][gameid][timer]) {
                                if (bettingObject[i][gameid][timer]) {
                                    for (let s in bettingObject[i][gameid][timer][j]) {
                                        
                                        let obj = bettingObject[i][gameid][timer][j][s];
                                        let status = s;
                                        let betam = parseInt(obj['AMOUNT']);
                                        let winam = parseInt(obj['winamount']);
                                        let count = parseInt(obj['COUNT']);
                                        wallet[status] += status === StatusKey.win ? winam : betam;
                                        wallet.count += status === StatusKey.pending ? count : 0;
                                    
                                    }
                                   
                                }
                            }
                        }
                    }
                }
            }
        }
        wallet["GGR"] = wallet.bet - wallet.win - wallet.rollback;

        return   <div className="gname">
            Total Bets : {wallet.count}
            &nbsp;&nbsp;
            Total Amt : {wallet.bet}
            &nbsp;&nbsp;
            {/* Total Profit/Loss : {wallet.GGR} /{wallet.win} */}

        </div>
    }

    timerChange = (timer) => {
        this.setState({selecttimer : timer});
    }

    gamesHeaderRender = (item) => {

        return <React.Fragment>
            <div className="gname">
                {
                    item.name
                }
            </div>
            
            {
                this.getbettingFromGameid(item._id)
            }
          

        </React.Fragment>
    }

    betshow = (betObject,gameitem,number,bazaritem) => {
        let obj = this.getBettingFromNumberObject(betObject,gameitem,number,bazaritem);
        this.setState({modal : true, selectnumber : number , amt : obj.bet , count : obj.count,GGR : obj.GGR, win : obj.win})
    }

    getBettingFromNumberObject = (betObject,gameitem,number,bazaritem) => {
        let selecttimer = [];

        if (games_id_key.Jodi === gameitem._id) {
            selecttimer = ["3"];
        } else if (games_id_key['full sangam'] === gameitem._id || games_id_key['half sangam'] === gameitem._id) {
            selecttimer = ["1","2"];
        } else {
            selecttimer = [this.state.selecttimer];
        }

        if (betObject) {
            if (betObject[bazaritem._id]) {
                if (betObject[bazaritem._id][gameitem._id]) {
                    let wallet = {
                        bet : 0,
                        win : 0,
                        rollback : 0,
                        void : 0,
                        GGR : 0,
                        count : 0
                    }

                    for (var i in selecttimer) {
                        let timer = selecttimer[i];
                        if (betObject[bazaritem._id][gameitem._id][timer]) {
                            if (betObject[bazaritem._id][gameitem._id][timer][number]) {
                                let obj = betObject[bazaritem._id][gameitem._id][timer][number];
                                for (let j in obj) {
                                    let item = obj[j];
                                    let status = j;
                                    let betam = parseInt(item['AMOUNT']);
                                    let winam = parseInt(item['winamount']);
                                    let count = parseInt(item['COUNT']);
                                    wallet[status] += status === StatusKey.win ? winam : betam;
                                    wallet.count += status === StatusKey.pending ? count : 0;
                                }
                            }
                        }
                    }
                    wallet["GGR"] = wallet.bet - wallet.win - wallet.rollback;

                    return {amt : wallet.bet , count : wallet.count,GGR : wallet.GGR, win : wallet.win}
                } else {
                    return {amt : 0 , count : 0 , GGR  : 0, win : 0}
                }
            } else {
            return {amt : 0 , count : 0, GGR  : 0, win : 0}
            }
        } else {
            return {amt : 0 , count : 0, GGR  : 0, win : 0}
        }

    }

    getBettingFromNumber = (betObject,gameitem,number,bazaritem) => {
        let selecttimer = [];
        if (games_id_key.Jodi === gameitem._id) {
            selecttimer = ["3","1"];
        } else if (games_id_key['full sangam'] === gameitem._id || games_id_key['half sangam'] === gameitem._id) {
            selecttimer = ["1","2"];
        } else {
            selecttimer = [this.state.selecttimer];
        }

        if (betObject) {
            if (betObject[bazaritem._id]) {
                if (betObject[bazaritem._id][gameitem._id]) {
                    let wallet = {
                        bet : 0,
                        win : 0,
                        rollback : 0,
                        void : 0,
                        GGR : 0,
                        count : 0
                    }
                    for (var i in selecttimer) {
                        let timer = selecttimer[i];
                        if (betObject[bazaritem._id][gameitem._id][timer]) {
                            if (betObject[bazaritem._id][gameitem._id][timer][number]) {

                                let obj = betObject[bazaritem._id][gameitem._id][timer][number];
                                for (let j in obj) {
                                    let item = obj[j];
                                    let status = j;
                                    let betam = parseInt(item['AMOUNT']);
                                    let winam = parseInt(item['winamount']);
                                    let count = parseInt(item['COUNT']);
                                    wallet[status] += status === StatusKey.win ? winam : betam;
                                    wallet.count += status === StatusKey.pending ? count : 0;
                                }
                            }
                        }
                    }
                    wallet["GGR"] = wallet.bet - wallet.win - wallet.rollback;

                    if (wallet.bet === 0 && wallet.count === 0) {

                    } else {
                        return <div>
                            <div>
                                {
                                    "Amt : " + wallet.bet
                                }
                            </div>
                            <div>
                                {
                                    "Bets : " + wallet.count
                                }
                            </div>
                            {/* <div>
                                {
                                    "Profit/Loss : " + wallet.GGR +"/" + wallet.win 
                                }
                            </div> */}
                        </div>
                    }
                }
            }
        }

    }

    gamesBodyRender = (item, bazaritem,betObject) => {
        let numbers = this.getRow(bazaritem, "1", item);
        
        return <React.Fragment>
            {
                numbers.map((b1,i)=>(
                    <React.Fragment key={i}>
                        {
                            b1['list'].length > 3 ?
                                b1['list'].map((b2,j)=>(
                                    <React.Fragment key={j}>
                                        <div className="betnode" onClick={()=>this.betshow(betObject,item,b2,bazaritem)}>
                                            {
                                                b2
                                            }
                                            {
                                                this.getBettingFromNumber(betObject,item,b2,bazaritem)
                                            }
                                        </div>
                                    </React.Fragment>
                                ))
                            :
                                Object.keys(b1['list']).map((b2,j)=>(
                                    <React.Fragment key={j}>
                                        {
                                            b1['list'][b2].map((b3, k)=>(
                                                <React.Fragment key={k}>
                                                    <div className="betnode" onClick={()=>this.betshow(betObject,item,b3,bazaritem)}>
                                                        {
                                                            b3
                                                        }
                                                        {
                                                            this.getBettingFromNumber(betObject,item,b3,bazaritem)
                                                        }
                                                    </div>
                                                </React.Fragment>
                                            ))
                                        }
                                    </React.Fragment>
                                ))
                        }
                    </React.Fragment>
                ))
            }

        </React.Fragment>
    }

    render() {
        const {gamelist,bazaritem, totalresult} = this.props.location.state;
        const {bettingObject, numbersData} = this.props.data;
        return (
            <React.Fragment>
                <Breadcrumbs breadCrumbTitle="Satta"  breadCrumbParent="Matka6"  breadCrumbParent2="Dashboard"/>
                {
                    bettingObject && numbersData ? 
                    <React.Fragment >
                        <Row className='height-100 result'>
                            {/* <Col md="3" sm="12">
                                <Datepicker onChange={(date)=>this.datechange(date)} />
                            </Col> */}
                            <Col md="4" sm="12" className="topic">
                                <span>{bazaritem.bazaarname}</span>
                            </Col>
                            <Col md="4" sm="12" className="topic">
                                RESULT : <span>{totalresult.result}</span>
                            </Col>
                            <Col md="4" sm="12" className="topic">
                                Total Bets : <span>{totalresult.bets}</span> &nbsp;&nbsp;&nbsp;
                                Total Amt :  <span>{totalresult.amt}</span>
                            </Col>

                            <div  className="w-100 gameheader text-uppercase">
                                {
                                    this.gameTimerRender(bazaritem)
                                }
                            </div>
                            {
                                gamelist.map((item,i)=>(
                                    <React.Fragment key={i}>
                                        <div  className="w-100 gameheader text-uppercase">
                                            {
                                                this.gamesHeaderRender(item,bazaritem)
                                            }
                                        </div>
                                        <div  className="w-100 gamebody" >
                                            {
                                                this.gamesBodyRender(item,bazaritem,bettingObject)
                                            }
                                        </div>
                                    </React.Fragment>
                                ))
                            }
                        </Row>
                    </React.Fragment>
                    : 
                    <SkeletonTheme  color="#10163a" highlightColor="#444">
                        <Skeleton count={20} />
                    </SkeletonTheme>
                }
                    <Modal isOpen={this.state.modal} toggle={this.toggleModal} className="modal-dialog-centered modal-sm" >
                        <ModalHeader toggle={this.toggleModal} className="bg-primary">
                            Show
                        </ModalHeader>
                        <ModalBody className="modal-dialog-centered d-block">
                            <p>Number : { this.state.selectnumber}</p>
                            <p>Bets : { this.state.count}</p>
                            <p>Amt : { this.state.amt}</p>
                            {/* <p>Profit/Loss : { this.state.GGR}/{ this.state.win}</p> */}
                        </ModalBody>
                    </Modal>
            </React.Fragment>
        )
    }
}

const mapStateToProps = (state) => ({
    data : state.matka.dashboard
})

const mapDispatchToProps = {
    get_bets_from_bazarr
}

export default connect(mapStateToProps, mapDispatchToProps)(event)
