import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardBody, CardHeader, Col, Row, Badge, Table } from 'reactstrap'
import { USER_KEY } from './../../services/auth'
import api from './../../services/api'

import Pagination from '.././Utils/Paination'

const elementsPerPage = 6

function UserRow(props) {
  const worship = props.worship
  const userLink = `/worshipreports/${worship._id.toString()}`
  const getBadge = (status) => {
    return status === 'Aprovado' ? 'success' : 'warning'
  }
  return (
    <tr key={worship._id.toString()}>
      <td>
        <Link to={userLink}>{worship.sucursal}</Link>
      </td>
      <td>{worship.missionary}</td>
      <td>{worship.date.substring(0, 10)}</td>
      <td>{worship.startTime.substring(11, 16)}</td>
      <td>{worship.endTime.substring(11, 16)}</td>
      <td>
        <Badge color={getBadge(worship.status)}>{worship.status}</Badge>
      </td>
    </tr>
  )
}

class ListBooks extends Component {
  constructor(props) {
    super(props)
    this.state = {
      worships: [],
      open: false,
      worship: {},
      total: 0,
      curentpage: 1,
      ranges: [],
      processing: true,
    }
  }
  previousPageNumber = () => {
    this.setState({ curentpage: this.state.curentpage - 1 })
    this.loadworships(this.state.curentpage - 1)
  }

  nextPageNumber = () => {
    this.setState({ curentpage: this.state.curentpage + 1 })
    this.loadworships(this.state.curentpage + 1)
  }

  loadworships(page) {
    let loggedUser = JSON.parse(localStorage.getItem(USER_KEY))
    if (loggedUser.profile === 'Missionário') {
      api.get('/api/worship/missionary/' + loggedUser._id + '/' + page).then((res) => {
        const worships = res.data
        this.setState({ worships: worships, processing: false })
      })
    } else {
      api.get('/api/worship/all/' + page).then((res) => {
        const worships = res.data
        this.setState({ worships: worships, processing: false })
      })
    }
  }

  upateCurentPage = (page) => {
    this.setState({ curentpage: page })
    this.loadworships(page)
  }
  componentDidMount() {
    let loggedUser = JSON.parse(localStorage.getItem(USER_KEY))

    if (loggedUser.profile === 'Missionário') {
      api.get('/api/worship/count/missionary/' + loggedUser._id).then((res) => {
        this.setState({ total: res.data.total })
      })
    } else {
      api.get('/api/worship/count/all/worships').then((res) => {
        this.setState({ total: res.data.total })
      })
    }

    this.loadworships(this.state.curentpage)
  }

  render() {
    return (
      <div className="animated fadeIn">
        <Row>
          <Col xl={12}>
            <Card>
              <CardHeader>
                <i className="fa fa-align-justify"></i> Relatórios de Cultos{' '}
                <a href="#">
                  <h5 style={{ float: 'right' }}>
                    [{(this.state.curentpage - 1) * elementsPerPage + 1} -{' '}
                    {this.state.curentpage * elementsPerPage <= this.state.total
                      ? this.state.curentpage * elementsPerPage
                      : this.state.total}{' '}
                    de {this.state.total}]
                  </h5>
                </a>
              </CardHeader>
              <CardBody>
                <Table responsive hover size="sm">
                  <thead>
                    <tr>
                      <th scope="col">Célula</th>
                      <th scope="col">Missionário</th>
                      <th scope="col">Data</th>
                      <th scope="col">Hora de início</th>
                      <th scope="col">Hora de Fim</th>
                      <th scope="col">Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.worships.map((worship, index) => (
                      <UserRow key={index} worship={worship} />
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
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    )
  }
}

export default ListBooks
