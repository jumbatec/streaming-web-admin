import React, { Component } from 'react'
import { Card, CardBody, CardHeader, Col, Row, Label } from 'reactstrap'
import api, { baseURL } from '../../services/api'

import compromisseTypes from './compromisseTypes'
import compromisseFrequencies from './compromisseFrequencies'
import compromisseDestinations from './compromisseDestinations'
import months from './months'

class PatnerDetails extends Component {
  constructor(props) {
    super(props)
    this.state = {
      patner: {},
    }
  }
  componentWillMount() {
    console.log(this.props.match.params.id)
    api.get(`/api/patner/${this.props.match.params.id}`).then((res) => {
      console.log(res.data)
      this.setState({ patner: res.data, processing: false })
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
                  <i className="icon-info pr-1"></i>Detalhes do Parceiro
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
                              !this.state.patner.picture
                                ? `${baseURL}/public/files/pictures/blank-user.jpg`
                                : `${baseURL}/public/files/pictures/${this.state.patner.picture}`
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
                              <strong>Apelido: </strong>
                              <Label htmlFor="nf-email">{this.state.patner.lastname}</Label>
                            </div>
                          </div>
                          <div>
                            <div className="details">
                              <strong>Nome: </strong>
                              <Label htmlFor="nf-email">{this.state.patner.name}</Label>
                            </div>
                          </div>
                          <div>
                            <div className="details">
                              <strong>Email: </strong>
                              <Label htmlFor="nf-email">{this.state.patner.email}</Label>
                            </div>
                          </div>

                          <div>
                            <div className="details">
                              <strong>Contacto: </strong>
                              <Label htmlFor="nf-email">{this.state.patner.contact}</Label>
                            </div>
                          </div>
                          <div>
                            <div className="details">
                              <strong>Endereço: </strong>
                              <Label htmlFor="nf-email">{this.state.patner.address}</Label>
                            </div>
                          </div>

                          <div>
                            <div className="details">
                              <strong>Compromisso: </strong>
                              <Label htmlFor="nf-email">
                                {this.state.patner.compromisse
                                  ? compromisseTypes.filter(
                                      (comp) => comp.code === this.state.patner.compromisse.type,
                                    )[0].desc
                                  : ''}
                              </Label>
                            </div>
                          </div>
                          {this.state.patner.compromisse &&
                          this.state.patner.compromisse.type === 'C01' ? (
                            <div>
                              <div>
                                <div className="details">
                                  <strong>Quantia: </strong>
                                  <Label htmlFor="nf-email">
                                    {this.state.patner.compromisse
                                      ? this.state.patner.compromisse.amount
                                      : null}{' '}
                                    MZN
                                  </Label>
                                </div>
                              </div>
                              <div>
                                <div className="details">
                                  <strong>Finalidade: </strong>
                                  <Label htmlFor="nf-email">
                                    {this.state.patner.compromisse
                                      ? compromisseDestinations.filter(
                                          (d) =>
                                            d.code === this.state.patner.compromisse.destination,
                                        )[0].desc
                                      : ''}
                                  </Label>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div>
                              <div className="details">
                                <strong>Designação do compromisso: </strong>
                                <Label htmlFor="nf-email">
                                  {this.state.patner.compromisse
                                    ? this.state.patner.compromisse.designation
                                    : null}
                                </Label>
                              </div>
                            </div>
                          )}
                          <div>
                            <div className="details">
                              <strong>Frenquência: </strong>
                              <Label htmlFor="nf-email">
                                {this.state.patner.compromisse
                                  ? compromisseFrequencies.filter(
                                      (frq) => frq.code === this.state.patner.compromisse.frequency,
                                    )[0].desc
                                  : ''}
                              </Label>
                            </div>
                          </div>

                          <div>
                            <div className="details">
                              <strong>Ano e Mês de início: </strong>
                              <Label htmlFor="nf-email">
                                {this.state.patner.compromisse
                                  ? months.filter(
                                      (m) => m.code == this.state.patner.compromisse.month,
                                    )[0].desc
                                  : ''}
                                /
                                {this.state.patner.compromisse
                                  ? this.state.patner.compromisse.year
                                  : null}
                              </Label>
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

export default PatnerDetails
