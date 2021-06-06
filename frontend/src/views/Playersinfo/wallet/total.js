import React, { Component } from 'react'
import { connect } from 'react-redux'
import {Table} from "reactstrap"
import {get_bets_profit} from "../../../redux/actions/profileinfo"
import DatePicker from "../../lib/datepicker"

export class total extends Component {

    constructor(props) {
        super(props)
        this.state = {
            date : {
                start: new Date(),
                end : new Date(new Date().valueOf() + 24 * 60 * 60 * 1000),
            }
        }
    }

    componentDidMount(){
        this.props.get_bets_profit(this.state.date,this.props.user);
    }

    setDate = async (e) =>{
        await this.setState({date :e});
        this.props.get_bets_profit(this.state.date,this.props.user);
    }
    
    render() {
        // var {deposit,withdrawl,netprofit,netbalance} = this.props.totaldata;
        let Total = this.props.Total;

        return (
            <div>
                <div className="mb-1">
                    <DatePicker  onChange={date => { this.setDate(date) }} />
                </div>
                
                <Table responsive bordered >
                    <thead >
                        <tr>
                            <th>Bet Types</th>
                            <th>(Win - Loose)</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            Total.length > 0 ? Total.map((item,i)=>(
                            <tr key={i}>
                                <th>{item.type}</th>
                                <th>{item['win-loose']}</th>
                                <th>{item.Total}</th>
                            </tr>
                            )) : null
                        }
                    </tbody>   
                </Table>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    totaldata : state.profileinfo.mywallet.total,
    Total : state.profileinfo.mybets.total

})

const mapDispatchToProps = {
    get_bets_profit
}

export default connect(mapStateToProps, mapDispatchToProps)(total)
