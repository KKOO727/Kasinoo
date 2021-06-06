import React from "react"
import { Row, Col, Button} from "reactstrap"
import { connect } from "react-redux"
import * as FirstPageAction from "../../../redux/actions/CMS/firstpage"
import Toggle from "react-toggle"

class Casinopage extends React.Component {
    state = {
        bool : true,
        trackcode : this.props.code,
        isChecked : false
    }

    componentDidUpdate(prevProps, prevState) {  
        if(this.props.code){
            if(prevProps.code !== this.props.code){
                let ischeck  = this.props.code === "Enable" ? true : false;
                this.setState({trackcode : this.props.code , isChecked : ischeck})
            }
        }      
    }

    handleSwitchChange = () => {
        let item = "Disable";
        if (this.state.trackcode) {
            if (this.state.trackcode !== "Enable") {
                item = "Enable";
            }
        } else {
            item = "Enable";            
        }
        this.setState({
            isChecked: !this.state.isChecked,
          trackcode : item
        });

        this.props.trackcodesave({type : "signupbuttonhandle",data :item},"FirstpageSetting_signupbuttonhandle");
    }
    // edit(){
    //     this.setState({bool : !this.state.bool});
    //     if(!this.state.bool){
    //     }
    // }


  render() {
    return (
        <Row>
            <Col md="6">
                <h4>Sign up Button Handle</h4>
            </Col>
            <Col md="6">
                <label className="react-toggle-wrapper">
                <Toggle
                    checked={this.state.isChecked}
                    onChange={this.handleSwitchChange}
                    name="controlledSwitch"
                    value="yes"
                />
                <Button.Ripple
                    color="primary"
                    onClick={this.handleSwitchChange}
                    size="sm"
                >
                {this.state.trackcode ? this.state.trackcode : "Disable" }
                </Button.Ripple>
            </label>
            </Col>
        </Row>
    )
  }
}

const mapstop = state=>{
    return {
        code : state.cms.firstpagesetting.signupbuttonhandle
    }
}

export default connect(mapstop,FirstPageAction)(Casinopage)