import React from "react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClock } from '@fortawesome/free-solid-svg-icons'
import {connect } from "react-redux"

class Clock extends React.Component{
    _isMounted = false;

    constructor(props) {
		super(props)
		this.state = {
			time: new Date()
		}
	}
	
	componentDidMount() {
        this._isMounted = true;
	}
	
	
    componentWillUnmount() {
        this._isMounted = false;
    }

    render(){
        return(
            <div className="header-time-bar">
                <div className="header-clock-time">
                {
                    this.props.time && this.props.time.toLocaleTimeString ? 
                    <React.Fragment>
                        <FontAwesomeIcon color="#1a9a65" icon={faClock} />
                        <h2>
                            {
                                this.props.time ? 
                                this.props.time.toLocaleTimeString :
                                null
                            }
                        </h2>
                        <span>
                            {
                                this.props.time ? 
                                this.props.time.toDateString :
                                null
                            }
                        </span>
                    </React.Fragment>
                    : null
                }
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    time : state.time.value

})

const mapDispatchToProps = {
    
}

export default connect(mapStateToProps, mapDispatchToProps)(Clock)