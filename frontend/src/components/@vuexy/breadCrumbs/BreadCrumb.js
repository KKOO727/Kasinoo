import React from "react"
import {   Breadcrumb,   BreadcrumbItem, } from "reactstrap"
import { Home, CornerRightUp } from "react-feather"
import { NavLink } from "react-router-dom"
import {history} from "../../../history"

class BreadCrumbs extends React.Component {
  event = () =>{
    history.goBack();
  }
  render() {
    return (
      <div className="content-header row">
        <div className="content-header-left col-md-11 col-12 mb-2">
          <div className="row breadcrumbs-top">
            <div className="col-12">
              {this.props.breadCrumbTitle ? (
                <h2 className="content-header-title float-left mb-0">
                  {this.props.breadCrumbTitle}
                </h2>
              ) : (
                ""
              )}
              <div className="breadcrumb-wrapper vx-breadcrumbs d-sm-block d-none col-12">
                <Breadcrumb tag="ol">
                  <BreadcrumbItem tag="li">
                    <NavLink to="/">
                      <Home className="align-top" size={15} />
                    </NavLink>
                  </BreadcrumbItem>
                  <BreadcrumbItem tag="li" className="text-primary">
                    {this.props.breadCrumbParent}
                  </BreadcrumbItem>
                  {this.props.breadCrumbParent2 ? (
                    <BreadcrumbItem tag="li" className="text-primary">
                      {this.props.breadCrumbParent2}
                    </BreadcrumbItem>
                  ) : (
                    ""
                  )}

                  {this.props.breadCrumbParent3 ? (
                    <BreadcrumbItem tag="li" className="text-primary">
                      {this.props.breadCrumbParent3}
                    </BreadcrumbItem>
                  ) : (
                    ""
                  )}
                  {this.props.breadCrumbParent4 ? (
                    <BreadcrumbItem tag="li" className="text-primary">
                      {this.props.breadCrumbParent4}
                    </BreadcrumbItem>
                  ) : (
                    ""
                  )}
                  <BreadcrumbItem tag="li" active>
                    {this.props.breadCrumbActive}
                  </BreadcrumbItem>
                </Breadcrumb>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-1 col-12 d-flex font-weight-bold text-center justify-content-center align-items-center historyback">
            <CornerRightUp size={30} color="white" className="cursor-pointer" onClick={()=>this.event()} />
        </div>
      </div>
    )
  }
}
export default BreadCrumbs
