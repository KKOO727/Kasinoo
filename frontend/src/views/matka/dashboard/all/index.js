import React, { Component } from 'react'
import { connect } from 'react-redux'
import {getData} from "../../../../redux/actions/matka/dashboard/regular"
import {Row,Col,} from "reactstrap"
import Bazar from "./bazaar"
import {BazaarStringType,Bazaartype_key} from "../../../../configs/providerconfig"
import Breadcrumbs from "../../../../components/@vuexy/breadCrumbs/BreadCrumb"
import Flatpickr from "react-flatpickr";

export class index extends Component {

    constructor(props) {
        super(props)
    
        this.state = {
            date : new Date()
        }
    }
    

    componentDidMount(){
        this.props.getData(this.props.date)
    }

     getGamelist = (type) => {
        let rows= this.props.gameList;
        let gameList = [];
        switch(type){
            case Bazaartype_key.regular :
            return rows.slice(0,7);
            case Bazaartype_key['king-bazaar'] :
                gameList.push(rows[1]);
                gameList.push(rows[7]);
                gameList.push(rows[8]);
            return gameList;
            default:
                gameList.push(rows[0]);
                gameList.push(rows[2]);
                gameList.push(rows[3]);
                gameList.push(rows[4]);
                return gameList;
        }
    }

    dateChange = (e) => {
        this.props.getData(e[0]);
    }

    render() {
        const {betsObject, totalwallet, date} = this.props;

        return (
            <React.Fragment>
                <Breadcrumbs breadCrumbTitle="Satta"  breadCrumbParent="Matka6"  breadCrumbParent2="Dashboard"/>
                <Row>
                    <Col md="3" sm="12">
                        <Flatpickr
                            className="form-control"
                            value={date}
                            onChange={date => { this.dateChange(date); }}
                        />
                    </Col>
                    {
                        totalwallet ? 
                        <Col md="9">
                            <h2>
                                 Total bets :&nbsp;
                                {
                                    totalwallet.amount
                                }
                                &nbsp;&nbsp;
                                Total count : &nbsp;
                                {
                                    totalwallet.count
                                }
                            </h2>
                        </Col>
                        : null
                    }
                </Row>
                <Row >
                    {
                        betsObject && Object.keys(betsObject).length ? Object.keys(betsObject).map((item,i)=>(
                            <Col md="12" key={i}>
                                <div  className="font-weight-bold w-100 p-1 text-center"  >
                                    <h2 className="text-uppercase">{BazaarStringType[item]}</h2> 
                                </div>
                            <Bazar date={this.props.date}  bazaars={betsObject[item]} gameList ={this.getGamelist(item)}  bazarListObject={this.props.bazarListObject} />
                            </Col>
                        )) :  ""
                    }
                  
                </Row>
            </React.Fragment>

        )
    }
}

const mapStateToProps = (state) => ({
    betsObject : state.matka.regular.betsObject,
    gameList : state.matka.regular.gameList,
    bazarListObject : state.matka.regular.bazarListObject,
    totalwallet : state.matka.regular.totalwallet,
    date : state.matka.regular.date
})

const mapDispatchToProps = {
    getData
}

export default connect(mapStateToProps, mapDispatchToProps)(index)
