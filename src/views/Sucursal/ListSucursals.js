import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardBody, CardHeader, Col, Row, Table, Input, Alert } from 'reactstrap'
import { ClipLoader } from 'react-spinners'
import Loader from 'react-loader-advanced'
import api from './../../services/api'

import Pagination from '.././Utils/Paination'
const elementsPerPage = 6
const spinner = (
  <div className="d-flex justify-content-center">
    <ClipLoader sizeUnit={'px'} size={50} color={'#123abc'} loading={true} />
  </div>
)
class ListSucursals extends Component {
  constructor(props) {
    super(props)
    this.state = {
      sucursals: [],
      missionaries: [],
      missionary: {},
      total: '',
      curentpage: 1,
      ranges: [],
      visible: false,
      selectedmissionary: {},
      processing: true,
    }

    this.handleChange = this.handleChange.bind(this)
  }

  onDismiss() {
    this.setState({ visible: false })
  }

  handleChange(e) {
    this.setState({ missionary: this.state.missionaries[e.target.value].value })
  }

  handleChangeMissionary = async (e, sucursal) => {
    this.setState({ visible: true })

    await api.put('/api/sucursal/missionary/' + e._id, { missionary: this.state.missionary })

    console.log(e._id, this.state.missionary)
    setTimeout(() => {
      this.setState({ visible: false, issaving: false, missionary: '' })
    }, 2000)
  }

  componentDidMount() {
    api.get('/api/sucursal/count/alll/sucursals').then((res) => {
      this.setState({ total: res.data.total })
    })

    this.loadSucursals(this.state.curentpage)

    api.get('/api/user/missionary').then((res) => {
      let missionaries = res.data.map((missionary) => ({
        text: missionary.name,
        value: missionary,
        image: { avatar: true, src: `${api}public/files/pictures/${missionary.picture}` },
      }))
      this.setState({ missionaries: missionaries })
    })
  }
  previousPageNumber = () => {
    this.setState({ curentpage: this.state.curentpage - 1 })
    this.loadSucursals(this.state.curentpage - 1)
  }

  nextPageNumber = () => {
    this.setState({ curentpage: this.state.curentpage + 1 })
    this.loadSucursals(this.state.curentpage + 1)
  }

  loadSucursals(page) {
    this.setState({ processing: true })
    api.get('/api/sucursal/all/' + page).then((res) => {
      const sucursals = res.data
      this.setState({ sucursals: sucursals, processing: false })
    })
  }

  upateCurentPage = (page) => {
    this.setState({ curentpage: page })
    this.loadSucursals(page)
  }

  render() {
    return (
      <div className="animated fadeIn">
        <Row>
          <Col xl={12}>
            <Card>
              <CardHeader>
                <i className="fa fa-align-justify"></i> Células{' '}
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
                <Alert
                  color="success"
                  isOpen={this.state.visible}
                  toggle={this.onDismiss.bind(this)}
                >
                  Missionário alocado com sucesso
                </Alert>
                <Loader
                  show={this.state.processing}
                  message={spinner}
                  backgroundStyle={{ color: 'white' }}
                  messageStyle={{ margin: 'auto', padding: '10px' }}
                >
                  <Table responsive hover size="sm">
                    <thead>
                      <tr>
                        <th scope="col">Nome da Célula</th>
                        <th scope="col">Data de Abertura</th>
                        <th scope="col">Total Crentes</th>
                        <th scope="col">Crentes Batizados</th>
                        <th scope="col">Não Batizados</th>
                        <th scope="col"> Missionário alocado</th>
                        <th scope="col"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.sucursals.map((sucursal, index) => (
                        <tr key={index}>
                          <td>
                            <Link to={`/sucursals/${sucursal._id.toString()}`}>
                              {sucursal.name}
                            </Link>
                          </td>

                          <td>{sucursal.foundationDate.substring(0, 10)}</td>
                          <td>{sucursal.numberOfBeleavers}</td>
                          <td>{sucursal.bornAgainNumber}</td>
                          <td>{sucursal.notBornAgainNumber}</td>
                          <td>
                            {' '}
                            <Input type="select" onChange={this.handleChange.bind(this)}>
                              <option value="0">
                                {sucursal.missionary ? sucursal.missionary.name : '...'}
                              </option>
                              {this.state.missionaries.map((missionary, index) => (
                                <option value={index} key={index}>
                                  {missionary.text}
                                </option>
                              ))}
                            </Input>
                          </td>
                          <td>
                            {' '}
                            <button
                              type="button"
                              class="btn btn-outline-success btn-sm"
                              onClick={this.handleChangeMissionary.bind(this, sucursal)}
                            >
                              <i className="fa fa-check"></i>
                            </button>
                          </td>
                        </tr>
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

export default ListSucursals
