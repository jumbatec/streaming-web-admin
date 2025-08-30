import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Badge, Card, CardBody, CardHeader, Col, Row, Table } from 'reactstrap'
import { ClipLoader } from 'react-spinners'
import Loader from 'react-loader-advanced'
import api, { baseURL } from './../../services/api'

import Pagination from '.././Utils/Paination'
const spinner = (
  <div className="d-flex justify-content-center">
    <ClipLoader sizeUnit={'px'} size={50} color={'#123abc'} loading={true} />
  </div>
)
const elementsPerPage = 6
function UserRow(props) {
  const user = props.user
  const userLink = `/workers/${user._id.toString()}`
  const editLink = `/workers/editworkers/${user._id.toString()}`

  const getBadge = (status) => {
    return status === true ? 'success' : 'secondary'
  }

  return (
    <tr key={user._id.toString()}>
      <th scope="row">
        <img
          src={`${baseURL}/${user.picture}`}
          style={{ height: '30px' }}
          className="img-avatar"
          alt="Nenhuma"
        />
      </th>
      <td>
        <Link to={userLink}>{user.name}</Link>
      </td>
      <td>{user.birthDate ? user.birthDate.substring(0, 10) : ''}</td>
      <td>{user.maritulstatus}</td>
      <td>{user.category}</td>
      <td>{user.contact}</td>
      <td>{user.email}</td>
      <td>
        <Link to={userLink}>
          <Badge color={getBadge(user.active)}>
            {user.active === true ? 'Activo' : 'Inactivo'}
          </Badge>
        </Link>
      </td>
      <td>
        {' '}
        <Link to={editLink}>
          <button type="button" class="btn btn-outline-primary btn-sm">
            <i className="fa fa-edit"></i>
          </button>
        </Link>
      </td>
    </tr>
  )
}

class ListWorkers extends Component {
  constructor(props) {
    super(props)
    this.state = {
      workers: [],
      total: '',
      curentpage: 1,
      ranges: [],
      processing: false,
    }
  }

  componentDidMount() {
    api.get('/api/worker/count/alll/workers').then((res) => {
      this.setState({ total: res.data.total })
    })

    this.loadworkers(this.state.curentpage)
  }

  previousPageNumber = () => {
    this.setState({ curentpage: this.state.curentpage - 1 })
    this.loadworkers(this.state.curentpage - 1)
  }

  nextPageNumber = () => {
    this.setState({ curentpage: this.state.curentpage + 1 })
    this.loadworkers(this.state.curentpage + 1)
  }

  loadworkers(page) {
    this.setState({ processing: true })
    api.get('/api/worker/' + page).then((res) => {
      const workers = res.data
      this.setState({ workers: workers, processing: false })
    })
  }

  upateCurentPage = (page) => {
    this.setState({ curentpage: page })
    this.loadworkers(page)
  }

  render() {
    return (
      <div className="animated fadeIn">
        <Row>
          <Col xl={12}>
            <Card>
              <CardHeader>
                <i className="fa fa-align-justify"></i> Membros de Direção{' '}
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
                <Loader
                  show={this.state.processing}
                  message={spinner}
                  backgroundStyle={{ color: 'white' }}
                  messageStyle={{ margin: 'auto', padding: '10px' }}
                >
                  <Table responsive hover size="sm">
                    <thead>
                      <tr>
                        <th scope="col">Fotografia</th>
                        <th scope="col">Nome</th>
                        <th scope="col">Data de Nascimento</th>
                        <th scope="col">Estado Civil</th>
                        <th scope="col">Perfil</th>
                        <th scope="col">Contacto</th>
                        <th scope="col">Email</th>
                        <th scope="col">Estado</th>
                        <th scope="col"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.workers.map((user, index) => (
                        <UserRow key={index} user={user} />
                      ))}
                    </tbody>
                  </Table>
                </Loader>
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

export default ListWorkers
