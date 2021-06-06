import React from "react"
import Breadcrumbs from "../../../components/@vuexy/breadCrumbs/BreadCrumb"
import ListViewConfig from "./playerchild"
import queryString from "query-string"
class Gamelist extends React.Component {
  
  render() {
    return (
      <React.Fragment>
        <Breadcrumbs
          breadCrumbTitle="Players"
          breadCrumbParent="player List"
        />
          <ListViewConfig parsedFilter={queryString.parse(this.props.location.search)}/>
      </React.Fragment>
    )
  }
}

export default Gamelist