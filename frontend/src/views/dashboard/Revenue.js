import React from "react"
import StatisticsCard from "../../components/@vuexy/statisticsCard/StatisticsCard"
import { Row, Col ,Button ,Card,Table } from "reactstrap"
import  * as FC from "react-icons/fc";
import {getRevenueLoad,getUserLoad} from "../../redux/actions/dashboard/index"
import {connect} from "react-redux"
import Select from "react-select"
import { subscribersGained, subscribersGainedSeries } from "../ui-elements/cards/statistics/StatisticsData"
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import Datepicker from "../lib/datepicker"

const day = 86400000;
const Dates= new Date();
const Dates1= new Date(Dates.getFullYear()+'-'+(Dates.getMonth()+1)+'-'+Dates.getDate());
const dataArray = [
  {title : "Today",index : 0}, 
  {title : "Yesterday",index : 1}, 
  {title : "This Week",index : 2}, 
  {title : "Last Week",index : 3}, 
  {title : "This Month",index : 4}, 
  {title : "Last Month",index : 5}, 
]


class Revenue extends React.Component {
  state={
    rangePicker : [ new Date(),new Date(new Date().valueOf() + day*1)],
    data : {},
    activeindex : 0,
    user : this.props.useritem
  }

  componentDidMount(){
    this.props.getRevenueLoad(this.state.rangePicker,this.state.user);
    this.props.getUserLoad()
  }

  getdate(data){
    var start = null;
    var end = null;
    switch(data){
      case 0:
        start = new Date(); 
        end = new Date(new Date().valueOf() + day*1);
        break;      
      case 1:
        start = new Date(new Date().valueOf()-day*1); 
        end = new Date();
        break;
      case 2:
        start = new Date(Dates.valueOf()-(day*Dates.getDay()));
        end = new Date(new Date().valueOf() + day*1);
        break;
      case 3:
        start = new Date(Dates.valueOf()-(day*(Dates.getDay()+7)));
        end = new Date(Dates-(day*Dates.getDay()));
        break;
      case 4: 
        start = new Date(Dates.getFullYear()+'-'+(Dates.getMonth()+1)+'-01 00:00:00');
        end = new Date(new Date().valueOf() + day*1);
        break;
      case 5:
        if(Dates.getMonth()===0){
          end = new Date(Dates.getFullYear()+'-'+(Dates.getMonth()+1)+'-01 00:00:00');
          start = new Date(end - 31*day);
        }else{
          start = new Date(Dates.getFullYear()+'-'+(Dates.getMonth())+'-01 00:00:00');
          end = new Date(Dates.getFullYear()+'-'+(Dates.getMonth()+1)+'-01 00:00:00');
        }
        break;
      default:
        start = new Date(Dates1-day); 
        end = Dates1;
        break;
    }
    this.setState({rangePicker : [start,end],activeindex: data});
    this.props.getRevenueLoad([start,end],this.state.user)
  }

  datepickerChange(e){
    let dates = [e.start,e.end];
    this.setState({rangePicker:dates});
    this.props.getRevenueLoad(dates,this.state.user)
  }

  muser_Change = (e) =>{
    this.setState({ user: { email : e.value} });
    this.props.getRevenueLoad(this.state.rangePicker,{email :  e.value});
  }

  render() {

    let {BET,WIN,given,receive,MakingDeposits,MakingWithdrawals,playersLoggedIn,totallogincount,betindex,
      playersRegistered,playersBalance,Profit,playersMakingDeposit,playersMakingWithdrawals,playersBonusBalance,playersagentBalance,positiontaking,matka} = this.props.data ? this.props.data : null;
    return (
      <React.Fragment>
        {
          this.props.useritem && BET !== null && MakingDeposits !== null && positiontaking !== null? 
          <React.Fragment>     
            <Row className="ecommerecedashboard">
              {
                dataArray.map((item,i)=>{
                  return (
                  <Col md="2" sm="6" key={i}>
                    <Card><Button color="info" className={this.state.activeindex === item.index ? "revenubuttonactive" : "" } outline onClick={()=>this.getdate(item.index)}>{item.title}</Button></Card>
                  </Col>
                  )
                })
              }
              <Col md="6" sm="12" >
                <Select className="React" classNamePrefix="select" options={this.props.musers}
                  value={this.props.musers.find(obj => obj.value === this.state.user)}
                  onChange={e => this.muser_Change(e)}
                  defaultValue={[ {label :this.props.useritem.email,value : this.props.useritem.email}]}
                />
              </Col>
              <Col md="6" sm="12" >
                <Datepicker onChange={date => {this.datepickerChange(date)}} />
              </Col>
            </Row>
            <Col md="12" sm="12" className="mt-1">
              <Row >
                <Col lg="3" md="6" sm="12">
                  <StatisticsCard
                    hideChart
                    iconRight
                    iconBg="primary"
                    icon={<FC.FcProcess className="primary" size={22} />}
                    stat={MakingDeposits ? parseInt(MakingDeposits) :0}
                    statTitle="Total of deposits"
                  />
                </Col>
                <Col lg="3" md="6" sm="12">
                    <StatisticsCard
                    hideChart
                    iconRight
                    iconBg="success"
                    icon={<FC.FcRemoveImage className="success" size={22} />}
                    stat={MakingWithdrawals ?parseInt(MakingWithdrawals) :0}
                    statTitle="Total of Withdrawals"
                    />
                </Col>
                <Col lg="3" md="6" sm="12">
                  <StatisticsCard
                      icon={<FC.FcMoneyTransfer className="success" size={22} />}
                      stat={BET}
                      hideChart
                      iconRight
                      statTitle="Total Bet Amount"
                      type="area"
                      options={subscribersGained}
                      series={subscribersGainedSeries}
                  />
                </Col>
                <Col lg="3" md="6" sm="12">
                  <StatisticsCard
                      icon={<FC.FcMoneyTransfer className="danger" size={22} />}
                      stat={WIN}
                      hideChart
                      iconRight
                      statTitle="Total win Amount"
                      type="area"
                      options={subscribersGained}
                      series={subscribersGainedSeries}
                  />
                </Col>
                <Col lg="3" md="6" sm="12">
                    <StatisticsCard
                    hideChart
                    iconRight
                    iconBg="warning"
                    icon={<FC.FcProcess className="warning" size={22} />}
                    stat={Profit ? Profit : 0}
                    statTitle="Net Profit of Platform "
                    />
                </Col>
                <Col lg="3" md="6" sm="12">
                  <StatisticsCard
                  hideChart
                  iconRight
                  iconBg="danger"
                  icon={<FC.FcCustomerSupport className="danger" size={22} />}
                  stat={betindex ?betindex :0}
                  statTitle="Total Number of bets"
                  />
                </Col>
                <Col lg="3" md="6" sm="12">
                    <StatisticsCard
                    hideChart
                    iconRight
                    iconBg="danger"
                    icon={<FC.FcCustomerSupport className="danger" size={22} />}
                    stat={playersLoggedIn ?playersLoggedIn :0}
                    statTitle="Players Logged In"
                    />
                </Col>
                <Col lg="3" md="6" sm="12">
                  <StatisticsCard
                  hideChart
                  iconRight
                  iconBg="warning"
                  icon={<FC.FcConferenceCall className="warning" size={22} />}
                  stat={totallogincount ? totallogincount  : 0}
                  statTitle="Total login count"
                  />
                </Col>
                <Col lg="3" md="6" sm="12">
                    <StatisticsCard
                    hideChart
                    iconRight
                    iconBg="success"
                    icon={<FC.FcContacts className="warning" size={22} />}
                    stat={playersRegistered ? playersRegistered : 0}
                    statTitle="Players Registered"
                    />
                </Col>
                <Col lg="3" md="6" sm="12">
                    <StatisticsCard
                    hideChart
                    iconRight
                    iconBg="danger"
                    icon={<FC.FcCurrencyExchange className="warning" size={22} />}
                    stat={playersBalance ? parseInt(playersBalance) : 0}
                    statTitle="Players Balance"
                    />
                </Col>
            
                <Col lg="3" md="6" sm="12">
                    <StatisticsCard
                    hideChart
                    iconRight
                    iconBg="warning"
                    icon={<FC.FcDebt className="warning" size={22} />}
                    stat={playersMakingDeposit ? playersMakingDeposit : 0}
                    statTitle="Players Marking Deposits"
                    />
                </Col>
                <Col lg="3" md="6" sm="12">
                    <StatisticsCard
                    hideChart
                    iconRight
                    iconBg="warning"
                    icon={<FC.FcDataRecovery className="warning" size={22} />}
                    stat={playersMakingWithdrawals ? playersMakingWithdrawals : 0}
                    statTitle="Players Making Withdrawals"
                    />
                </Col>
                <Col lg="3" md="6" sm="12">
                    <StatisticsCard
                    hideChart
                    iconRight
                    iconBg="warning"
                    icon={<FC.FcPlus className="warning" size={22} />}
                    stat={playersBonusBalance ? parseInt(playersBonusBalance) : 0}
                    statTitle="Bonus Balance"
                    />
                </Col>
                <Col lg="3" md="6" sm="12">
                    <StatisticsCard
                    hideChart
                    
                    iconRight
                    iconBg="warning"
                    icon={<FC.FcMoneyTransfer className="warning" size={22} />}
                    stat={playersagentBalance ? parseInt(playersagentBalance) : 0}
                    statTitle="Agent Balance"
                    />
                </Col>
              
                <Col lg="3" md="6" sm="12">
                    <StatisticsCard
                        icon={<FC.FcMoneyTransfer className="warning" size={22} />}
                        stat={receive}
                        hideChart
                        iconRight
                        statTitle="Total Receice"
                        type="area"
                        options={subscribersGained}
                        series={subscribersGainedSeries}
                    />
                </Col>
                <Col lg="3" md="6" sm="12">
                    <StatisticsCard
                        icon={<FC.FcMoneyTransfer className="warning" size={22} />}
                        stat={given}
                        hideChart
                        iconRight
                        statTitle="Total Given"
                        type="area"
                        options={subscribersGained}
                        series={subscribersGainedSeries}
                    />
                </Col> 
                <Col lg="3" md="6" sm="12">
                    <StatisticsCard
                        icon={<FC.FcMoneyTransfer className="warning" size={22} />}
                        stat={positiontaking ? positiontaking : 0 + "%"}
                        hideChart
                        iconRight
                        statTitle="Position Taking"
                        type="area"
                        options={subscribersGained}
                        series={subscribersGainedSeries}
                    />
                </Col> 
              {
                  matka && (matka).length > 0 ?
                  <Table responsive bordered >
                  <thead >
                    <tr>
                      <th>Bazar Name </th>
                      <th>Number of Bets </th>
                      <th>Total Bet amount</th>
                      <th>Total Win  amount</th>
                      <th>Total pending amount</th>
                      <th>Total Void</th>
                      <th>Net profit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      (matka).map((item,i)=>(
                      <tr key={i}>
                        <td>{item.bazarname}</td>
                        <td>{item.count}</td>
                        <td>{item.lost}</td>
                        <td>{item.win}</td>
                        <td>{item.pending}</td>
                        <td>{item.cancel}</td>
                        <td>{item.GGR}</td>
                      </tr>
                      ))
                    }
                  </tbody>
                  </Table> : null
                }
              </Row>
            </Col>
          </React.Fragment> 
        :
          <SkeletonTheme  color="#10163a" highlightColor="#444">
            <Skeleton count={20} />
          </SkeletonTheme>
        }
      </React.Fragment>
    )
  }
}

const mapstops = (state)=>{
  return {data : state.dashboard.Revenue,
    useritem : state.auth.login.values,
    musers : state.dashboard.Revenue.musers
  }
}

export default connect(mapstops,{getRevenueLoad,getUserLoad})(Revenue)