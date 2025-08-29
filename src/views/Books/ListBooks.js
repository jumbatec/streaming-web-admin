import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Row,
  Table,
  Modal,
  ModalBody,
  ModalFooter,
  Button,
  ModalHeader,
} from 'reactstrap'

import api from './../../services/api'
import Pagination from '.././Utils/Paination'
const elementsPerPage = 6

class ListBooks extends Component {
  constructor(props) {
    super(props)
    this.state = {
      books: [],
      total: '',
      book: {},
      curentpage: 1,
      ranges: [],
      processing: true,
    }
  }

  toggleFade = (b) => {
    this.setState({ open: !this.state.open, book: b })
  }

  inativate = async (b) => {
    await api.put('/api/book/inactive/' + b._id)
    let books = this.state.books.filter((ev) => ev._id !== b._id)
    this.setState({ books, open: false })
  }

  toggleOpenClose = () => {
    this.setState({
      open: !this.state.open,
    })
  }

  previousPageNumber() {
    this.setState({ curentpage: this.state.curentpage - 1 })
    this.loadbooks(this.state.curentpage - 1)
  }

  nextPageNumber() {
    this.setState({ curentpage: this.state.curentpage + 1 })
    this.loadbooks(this.state.curentpage + 1)
  }

  loadbooks(page) {
    api.get('/api/book/all/' + page).then((res) => {
      const books = res.data
      this.setState({ books: books, processing: false })
    })
  }

  upateCurentPage(page) {
    this.setState({ curentpage: page })
    this.loadbooks(page)
  }
  componentDidMount() {
    api.get('/api/book/count/all/books').then((res) => {
      this.setState({ total: res.data.total })
    })

    this.loadbooks(this.state.curentpage)
  }

  render() {
    return (
      <div className="animated fadeIn">
        <Row>
          <Col xl={12}>
            <Card>
              <CardHeader>
                <i className="fa fa-align-justify"></i> Livros do Apóstolo
              </CardHeader>
              <CardBody>
                <Table responsive hover size="sm">
                  <thead>
                    <tr>
                      <th scope="col">Título</th>
                      <th scope="col">Autor</th>
                      <th scope="col">Data de Publicação</th>
                      <th scope="col">Preço Unitario</th>
                      <th scope="col"></th>
                      <th scope="col"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.books.map((book, index) => (
                      <tr key={index}>
                        <td>
                          <Link to={`/books/${book._id.toString()}`}>{book.title}</Link>
                        </td>
                        <td>{book.author}</td>
                        <td>{book.publishDate.substring(0, 10)}</td>
                        <td>{book.price} USD</td>
                        <td>
                          {' '}
                          <button type="button" class="btn btn-outline-primary btn-sm">
                            <i className="fa fa-edit"></i>
                          </button>
                        </td>
                        <td>
                          {' '}
                          <button
                            type="button"
                            class="btn btn-outline-danger btn-sm"
                            onClick={this.toggleFade.bind(this, book)}
                          >
                            <i className="fa fa-close"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
                <Pagination
                  curent={this.state.curentpage}
                  pages={Math.ceil(this.state.total / elementsPerPage)}
                  upateCurentPage={this.upateCurentPage}
                  nextPageNumber={this.nextPageNumber}
                  previousPageNumber={this.previousPageNumber}
                />

                <Modal
                  color="info"
                  isOpen={this.state.open}
                  toggle={this.toggleOpenClose.bind(this)}
                  className={'modal-info ' + this.props.className}
                >
                  <ModalHeader toggle={this.props.toggleOpenClose}>
                    {this.state.book.title}
                  </ModalHeader>
                  <ModalBody>
                    Esta Operação é ireversível. Tem a certeza que deseja remover este Livro?
                  </ModalBody>
                  <ModalFooter>
                    <Button color="danger" onClick={this.inativate.bind(this, this.state.book)}>
                      Confirmar
                    </Button>{' '}
                    <Button color="secondary" onClick={this.toggleOpenClose.bind(this)}>
                      Cancelar
                    </Button>
                  </ModalFooter>
                </Modal>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    )
  }
}

export default ListBooks
