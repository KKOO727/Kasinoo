import React from "react"
import Breacrumbs from "../../../components/@vuexy/breadCrumbs/BreadCrumb"
import { connect } from "react-redux"
import {Row} from "reactstrap"
import CasinoSlider from "./casinoSlider"
import {get_all_sliders} from "../../../redux/actions/CMS/firstpageMngAction"


class DndHorizontal extends React.Component {

  constructor(props) {
    super(props)
  
    this.state = {
       Sliders : [
         { bool : "5",type : "CMSFPMNGDATA1",value : "firstpagesliderimg1",title : "Firstpage slider "},
         { bool : "6",type : "CMSFPMNGDATA2",value : "firstpagesliderimg2",title : "Satta Slider"},
         { bool : "7",type : "CMSFPMNGDATA3",value : "firstpagesliderimg3",title : "Sports Slider"},
         { bool : "8",type : "CMSCOCKFIGHTMNGDATA",value : "cockfightslierimg",title : "Cockfight slider"},
         { bool : "9",type : "CMSANIMALMNGDATA",value : "animalslierimg",title : "Animal slider"},
         { bool : "4",type : "CMSLIVECASINOMNGDATA",value : "livecasinosliderimg",title : "LiveCasino slider"},
         { bool : "1",type : "CMSCASINOMNGDATA",value : "casinosliderimg",title : "Casino slider"},
         { bool : "2",type : "CMSVIRTUALMNGDATA",value : "virtualsliderimg",title : "Virtual slider"},
         { bool : "3",type : "CMSPORKERMNGDATA",value : "porkersliderimg",title : "Poker slider"},
       ]
    }
  }

  componentDidMount(){
    this.props.get_all_sliders();
  }

  render() {
    return (
      <React.Fragment>
        <Breacrumbs breadCrumbTitle="CMS" breadCrumbParent="Slider" />
          <Row>
            {
              this.state.Sliders.map((item,i)=>(
                <CasinoSlider key={i} title={item.title} bool={item.bool} type ={item.type} casinosliderimg = {this.props[item.value]}  />
              ))
            }
          </Row>
      </React.Fragment>
    )
  }
}

const mapstops = (state) =>{
  return {
    casinosliderimg : state.cms.fpMng.casinosliderimg,
    firstpagesliderimg1 : state.cms.fpMng.firstpagesliderimg1,
    firstpagesliderimg2 : state.cms.fpMng.firstpagesliderimg2,
    firstpagesliderimg3 : state.cms.fpMng.firstpagesliderimg3,
    livecasinosliderimg : state.cms.fpMng.livecasinosliderimg,
    virtualsliderimg : state.cms.fpMng.virtualsliderimg,
    porkersliderimg : state.cms.fpMng.porkersliderimg,
    cockfightslierimg : state.cms.fpMng.cockfightslierimg,
    animalslierimg : state.cms.fpMng.animalslierimg,
  }
}

export default  connect(mapstops,{get_all_sliders})(DndHorizontal)