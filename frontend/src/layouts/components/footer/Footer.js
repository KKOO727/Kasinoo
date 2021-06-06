import React, { Component } from 'react'
import { connect } from 'react-redux'
import ScrollToTop from "react-scroll-up"
import { Button } from "reactstrap"
import {  ArrowUp } from "react-feather"
import classnames from "classnames"

export class Footer extends Component {

  render() {
    let footerTypeArr = ["sticky", "static", "hidden"]
    let props = this.props;
    let cms = this.props.cms;
    return (
      <footer
      className={classnames("footer footer-light", {
        "footer-static": props.footerType === "static" || !footerTypeArr.includes(props.footerType),
        "d-none": props.footerType === "hidden"
      })}
    >
      <p className="mb-0 clearfix">
        <span className="float-md-left d-block d-md-inline-block mt-25">
          {
            cms.cmsfootertext ? cms.cmsfootertext : ""
          }
        {/* COPYRIGHT © {new Date().getFullYear()}
          <a
            href="https://igamez.ai"
            target="_blank"
            rel="noopener noreferrer"
          >
            igamez.ai.com
          </a>
          All rights reserved */}
        </span>
        {/* <span className="float-md-right d-none d-md-block">
          <span className="align-middle">Hand-crafted & Made with</span>{" "}
          <Heart className="text-danger" size={15} />
        </span> */}
      </p>
      {props.hideScrollToTop === false ? (
        <ScrollToTop showUnder={160}>
          <Button color="primary" className="btn-icon scroll-top">
            <ArrowUp size={15} />
          </Button>
        </ScrollToTop>
      ) : null}
    </footer>
    )
  }
}

const mapStateToProps = (state) => ({
  cms : state.cms.firstpagesetting
})

const mapDispatchToProps = {
  
}

export default connect(mapStateToProps, mapDispatchToProps)(Footer)
