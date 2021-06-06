import React from "react"
import {
  NavItem,
  NavLink,
  UncontrolledTooltip,
} from "reactstrap"
import * as Icon from "react-feather"
import { history } from "../../../history"
import { connect } from "react-redux"
import {
  loadSuggestions,
  updateStarred
} from "../../../redux/actions/navbar/Index"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"

// a little function to help us with reordering the bookmarks
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list)
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)
  return result
}

class NavbarBookmarks extends React.PureComponent {
  state = {
    showBookmarks: false,
    value: "",
    noSuggestions: false,
    isStarred: false,
    suggestions: [],
    starredItems: []
  }

  updateBookmarks = false

  handleBookmarksVisibility = () => {
    this.setState({
      showBookmarks: !this.state.showBookmarks,
      value: "",
      suggestions: [],
      noSuggestions: false,
      starred: null
    })
  }

  componentDidUpdate(prevProps) {
    if (prevProps.bookmarks.starred.length !== this.state.starredItems.length && this.updateBookmarks === true) {
      this.setState({ starredItems: this.props.bookmarks.starred })
      this.updateBookmarks = false
    }
  }

  onDragEnd = result => {
    // dropped outside the list
    if (!result.destination) {
      return
    }

    const starredItems = reorder(
      this.state.starredItems,
      result.source.index,
      result.destination.index
    )

    this.setState({
      starredItems
    })
  }

  renderBookmarks = () => {
    this.updateBookmarks = true
    return <DragDropContext onDragEnd={this.onDragEnd}>
      <Droppable droppableId="droppable" direction="horizontal">
        {(provided, ) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="d-flex flex-sm-wrap flex-lg-nowrap draggable-cards"
          >
            {this.state.starredItems.map((item, index) => {
              const IconTag = Icon[item.icon ? item.icon : "X"]
              return (
                <Draggable key={item.target} draggableId={item.target} index={index}>
                  {(provided, ) => {
                    return <div ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}>
                      <NavItem className="nav-item d-none d-lg-block">
                        <NavLink
                          tag="span"
                          id={item.target}
                          className="nav-link cursor-pointer"
                          onClick={() => history.push(item.link)} >
                          <IconTag size={21} />
                        </NavLink>
                        <UncontrolledTooltip placement="bottom" target={item.target}>
                          {item.title}
                        </UncontrolledTooltip>
                      </NavItem>
                    </div>
                  }}
                </Draggable>
              )
            })}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  }

  render() {
    let {
      sidebarVisibility,
    } = this.props

    return (
      <div className="mr-auto float-left bookmark-wrapper d-flex align-items-center">
        <ul className="navbar-nav d-xl-none">
          <NavItem className="mobile-menu mr-auto">
            <NavLink
              className="nav-menu-main menu-toggle hidden-xs is-active"
              onClick={sidebarVisibility}
            >
              <Icon.Menu className="ficon" />
            </NavLink>
          </NavItem>
        </ul>
     
      </div>
    )
  }
}
const mapStateToProps = state => {
  return {
    bookmarks: state.navbar
  }
}

export default connect(mapStateToProps, { loadSuggestions, updateStarred })( NavbarBookmarks)