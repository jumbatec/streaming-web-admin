import React, { Component } from 'react'
import { Card, CardBody, CardHeader, Col, Row, Label } from 'reactstrap'

import api, { baseURL } from './../../services/api'

class WorkerDetails extends Component {
  constructor(props) {
    super(props)
    this.state = {
      worker: {},
    }
  }
  componentWillMount() {
    console.log(this.props.match.params.id)
    api.get(`/api/worker/unique/${this.props.match.params.id}`).then((res) => {
      console.log(res.data)
      this.setState({ worker: res.data, processing: false })
    })
  }

  render() {
    return (
      <div className="animated fadeIn">
        <Row>
          <Col lg={12}>
            <Card>
              <CardHeader>
                <strong>
                  <i className="icon-info pr-1"></i>Detalhes do Membro
                </strong>
              </CardHeader>
              <CardBody>
                <div class="container">
                  <div class="row">
                    <div class="col-2">
                      <Card>
                        <di id="photo">
                          <img
                            alt="Fotografia"
                            src={
                              !this.state.worker.picture
                                ? `${baseURL}/public/files/pictures/blank-user.jpg`
                                : `${baseURL}/public/files/pictures/${this.state.worker.picture}`
                            }
                            style={{ height: '12em', width: '100%', 'background-size': 'cover' }}
                          />
                        </di>
                      </Card>
                    </div>
                    <div class="col-10">
                      <Card>
                        <CardBody>
                          <div>
                            <div className="details">
                              <strong>Nome Completo: </strong>
                              <Label htmlFor="nf-email">{this.state.worker.name}</Label>
                            </div>
                          </div>
                          <div>
                            <div className="details">
                              <strong>Data de Nascimento: </strong>
                              <Label htmlFor="nf-email">{this.state.worker.birthDate}</Label>
                            </div>
                          </div>
                          <div>
                            <div className="details">
                              <strong>Estado Civil: </strong>
                              <Label htmlFor="nf-email">{this.state.worker.maritulstatus}</Label>
                            </div>
                          </div>

                          <div>
                            <div className="details">
                              <strong>Email: </strong>
                              <Label htmlFor="nf-email">{this.state.worker.email}</Label>
                            </div>
                          </div>

                          <div>
                            <div className="details">
                              <strong>Contacto: </strong>
                              <Label htmlFor="nf-email">{this.state.worker.contact}</Label>
                            </div>
                          </div>
                          <div>
                            <div className="details">
                              <strong>Endereço: </strong>
                              <Label htmlFor="nf-email">{this.state.worker.address}</Label>
                            </div>
                          </div>

                          <div>
                            <div className="details">
                              <strong>Função: </strong>
                              <Label htmlFor="nf-email">{this.state.worker.category}</Label>
                            </div>
                          </div>
                        </CardBody>
                      </Card>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    )
  }
}

export default WorkerDetails
