import React, { Component } from 'react'
import { Pagination, PaginationLink, PaginationItem } from 'reactstrap'

import paginationrange from './paginationrange'

class Paination extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    return (
      <div>
        {this.props.pages > 1 ? (
          <Pagination>
            {this.props.curent > 1 && this.props.pages > 1 ? (
              <PaginationItem>
                <PaginationLink
                  previous
                  tag="button"
                  onClick={this.props.previousPageNumber}
                ></PaginationLink>
              </PaginationItem>
            ) : null}
            {paginationrange(this.props.curent, this.props.pages).map((page) => (
              <PaginationItem active={this.props.curent === page}>
                <PaginationLink
                  tag="button"
                  onClick={page != '...' ? (e) => this.props.upateCurentPage(page) : null}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}
            {this.props.pages > 1 && this.props.pages !== this.props.curent ? (
              <PaginationItem>
                <PaginationLink
                  next
                  tag="button"
                  onClick={this.props.nextPageNumber}
                ></PaginationLink>
              </PaginationItem>
            ) : null}
          </Pagination>
        ) : null}
      </div>
    )
  }
}

export default Paination
