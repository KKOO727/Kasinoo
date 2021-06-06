import React from "react"
import { connect } from "react-redux"
import classnames from "classnames"
import PerfectScrollbar from "react-perfect-scrollbar"
const FullPageLayout = ({ children, ...rest }) => {
  return (
    <div 
      className={classnames(
        "full-layout wrapper bg-full-screen-image blank-page dark-layout",
        {
        }
      )}
    >
    <PerfectScrollbar>
      <div className="app-content" >
        <div className="content-wrapper">
          <div className="content-body">
            <div className="flexbox-container">
              <main className="main w-100">{children}</main>
            </div>
          </div>
        </div>
      </div>
    </PerfectScrollbar>
    </div>
  )
}

const mapStateToProps = state => {
  return {
    app: state.customizer
  }
}

export default connect(mapStateToProps,{})(FullPageLayout)