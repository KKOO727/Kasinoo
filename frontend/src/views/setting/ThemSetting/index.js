import React from "react"
import { Button} from "reactstrap"
import classnames from "classnames"
import Radio from "../../../components/@vuexy/radio/RadioVuexy"
import { connect } from 'react-redux'
import {playerSave,playerGet} from "../../../redux/actions/customizer"

class Customizer extends React.Component {

    constructor(props) {
        super(props)
    
        this.state = {
            activeNavbar: "warning",
            navbarType: "sticky",
            footerType: "static",
            menuTheme: "warning",
            theme : "real-dark",
        }
    }

    componentDidMount(){
        this.props.playerGet(this.state)
    }

    componentDidUpdate(prevProps,prevState) {
        if (prevState.theme !== this.props.customizer.theme) {
            this.setState({ theme : this.props.customizer.theme})
        }
        if (prevState.navbarType !== this.props.customizer.navbarType) {
            this.setState({ navbarType : this.props.customizer.navbarType})
        }
        if (prevState.menuTheme !== this.props.customizer.menuTheme) {
            this.setState({ menuTheme : this.props.customizer.menuTheme})
        }
        if (prevState.footerType !== this.props.customizer.footerType) {
            this.setState({ footerType : this.props.customizer.footerType})
        }
        if (prevState.activeNavbar !== this.props.customizer.activeNavbar) {
            this.setState({ activeNavbar : this.props.customizer.activeNavbar})
        }

    }
    
    render() {
    let { activeNavbar, navbarType, footerType, menuTheme, theme } = this.state;

    return (
        <div className="w-100 h-100 customizercomponent">
            <div className="header d-flex justify-content-between px-2 pt-2">
                <div className="title">
                    <h4 className="text-uppercase mb-0">Player Theme Customizer</h4>
                </div>
            </div>
            <hr />            
            <div className="theme-mode">
                <h5 className="mt-1">Theme Mode</h5>
                <div className="d-inline-block mr-1">
                    <Radio
                        label="green"
                        color="primary"
                        checked={theme === "green-dark" ? true : false}
                        name="playerthemeLayout"
                        onChange={() => this.setState({theme : "green-dark"})}
                    />
                </div>
                <div className="d-inline-block mr-1">
                    <Radio
                        label="pink"
                        color="primary"
                        checked={theme === "pink-dark" ? true : false}
                        name="playerthemeLayout"
                        onChange={() => this.setState({theme : "pink-dark"})}
                    />
                </div>
                <div className="d-inline-block mr-1">
                <Radio
                    label="dark"
                    color="primary"
                    checked={theme === "real-dark" ? true : false}
                    name="playerthemeLayout"
                    onChange={() => this.setState({theme : "real-dark"})}
                />
                </div>
                <div className="d-inline-block">
                <Radio
                    label="blue"
                    color="primary"
                    checked={theme === "blue-dark" ? true : false}
                    name="playerthemeLayout"
                    onChange={() => this.setState({theme : "blue-dark"})}
                />
                </div>


                <div className="d-inline-block">
                <Radio
                    label="golden"
                    color="warning"
                    checked={theme === "golden-dark" ? true : false}
                    name="playerthemeLayout"
                    onChange={() => this.setState({theme : "golden-dark"})}
                />
                </div>

                
            </div>
          
            <div className="navbar-colors">
                <h5>Navbar Colors</h5>
                <ul className="list-inline unstyled-list">
                
                <li
                    className={classnames("color-box bg-primary", {
                    selected:
                        activeNavbar === "primary"
                    })}
                    onClick={() => this.setState({activeNavbar : "primary"})}
                />
                <li
                    className={classnames("color-box bg-success", {
                    selected:
                        activeNavbar === "success"
                    
                    })}
                    onClick={() => this.setState({activeNavbar : "success"})}
                />
                <li
                    className={classnames("color-box bg-danger", {
                    selected:
                        activeNavbar === "danger"
                
                    })}
                    onClick={() => this.setState({activeNavbar : "danger"})}
                />
                <li
                    className={classnames("color-box bg-info", {
                    selected:
                        activeNavbar === "info"
                    
                    })}
                    onClick={() => this.setState({activeNavbar : "info"})}
                />
                <li
                    className={classnames("color-box bg-warning", {
                    selected:
                        activeNavbar === "warning"
                        
                    })}
                    onClick={() => this.setState({activeNavbar : "warning"})}
                />
                <li className={classnames("color-box bg-dark", {
                    selected: activeNavbar === "dark"  })}
                    onClick={() => this.setState({activeNavbar : "dark"})}
                />
                </ul>
            </div>
            <hr />
            <div className="navbar-type">
                <h5>Navbar Type</h5>
                <div className="d-inline-block mr-1">
                <Radio
                    label="Static"
                    color="primary"
                    checked={navbarType === "static" ? true : false}
                    name="playernavbarType"
                    onChange={() => this.setState({navbarType : "static"})}
                />
                </div>
                <div className="d-inline-block mr-1">
                <Radio
                    label="Sticky"
                    color="primary"
                    checked={navbarType === "sticky" ? true : false}
                    name="playernavbarType"
                    onChange={() => this.setState({navbarType : "sticky"})}
                />
                </div>
                
            </div>
            <hr />
            <div className="menu-theme-colors">
                <h5>Menu Colors</h5>
                <ul className="list-inline unstyled-list">
                <li 
                    className={classnames("color-box bg-primary", {
                    selected: menuTheme === "primary" ||  !["primary", "danger", "info", "warning", "dark", "success"].includes(menuTheme)
                    })}
                    onClick={() => this.setState({ menuTheme : "primary"})}
                />
                <li
                    className={classnames("color-box bg-success", {
                    selected: menuTheme === "success"
                    })}
                    onClick={() => this.setState({ menuTheme : "success"})}
                />
                <li
                    className={classnames("color-box bg-danger", {
                    selected: menuTheme === "danger"
                    })}
                    onClick={() => this.setState({ menuTheme : "danger"})}
                />
                <li
                    className={classnames("color-box bg-info", {
                    selected: menuTheme === "info"
                    })}
                    onClick={() => this.setState({ menuTheme : "info"})}
                />
                <li
                    className={classnames("color-box bg-warning", {
                    selected: menuTheme === "warning"
                    })}
                    onClick={() => this.setState({ menuTheme : "warning"})}
                />
                <li
                    className={classnames("color-box bg-dark", {
                    selected: menuTheme === "dark"
                    })}
                    onClick={() => this.setState({ menuTheme : "dark"})}
                />
                </ul>
            </div>
            <hr />
            <div className="footer-type">
                <h5>Footer Type</h5>
                <div className="d-inline-block mr-1">
                <Radio
                    label="Hidden"
                    color="primary"
                    checked={footerType === "hidden" ? true : false}
                    name="playerfooterType"
                    onChange={() => this.setState({ footerType :"hidden"})}
                />
                </div>
                <div className="d-inline-block mr-1">
                <Radio
                    label="Static"
                    color="primary"
                    checked={footerType === "static" ? true : false}
                    name="playerfooterType"
                    onChange={() => this.setState({ footerType :"static"})}
                />
                </div>
            </div>
            <hr />
            <Button.Ripple className="igamez-button" color="success" onClick={()=>{this.props.playerSave(this.state)}}>Save </Button.Ripple>
        </div>
    )
  }
}

const mapStateToProps = (state) => {

  return { 
      customizer : state.customizer.playercustomizer
   }
}

const mapDispatchToProps = {
    playerSave,playerGet
}

export default connect(mapStateToProps, mapDispatchToProps)(Customizer)