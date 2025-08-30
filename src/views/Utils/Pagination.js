import React from 'react'
import { Pagination, PaginationItem, PaginationLink } from 'reactstrap'

const CustomPagination = ({
  curent,
  pages,
  upateCurentPage,
  nextPageNumber,
  previousPageNumber,
}) => {
  const pageNumbers = []

  for (let i = 1; i <= pages; i++) {
    pageNumbers.push(i)
  }

  return (
    <Pagination aria-label="Navegação de páginas">
      <PaginationItem disabled={curent === 1}>
        <PaginationLink previous onClick={previousPageNumber} />
      </PaginationItem>
      {pageNumbers.map((number) => (
        <PaginationItem key={number} active={curent === number}>
          <PaginationLink onClick={() => upateCurentPage(number)}>{number}</PaginationLink>
        </PaginationItem>
      ))}
      <PaginationItem disabled={curent === pages}>
        <PaginationLink next onClick={nextPageNumber} />
      </PaginationItem>
    </Pagination>
  )
}

export default CustomPagination
