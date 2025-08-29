import React, { Component } from 'react'
import { Card, CardBody, CardHeader, Col, Row, Label } from 'reactstrap'
import api, { baseURL } from '../../services/api'

import months from './months'

class userDetails extends Component {
  constructor(props) {
    super(props)
    this.state = {
      user: {},
    }
  }
  componentWillMount() {
    console.log(this.props.match.params.userName)
    api.get(`/api/user/${this.props.match.params.userName}`).then((res) => {
      console.log(res.data)
      this.setState({ user: res.data, processing: false })
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
                  <i className="icon-info pr-1"></i>Detalhes do Utilizador
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
                              !this.state.user.picture
                                ? `${baseURL}/public/files/pictures/blank-user.jpg`
                                : `${baseURL}/public/files/pictures/${this.state.user.picture}`
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
                              <strong>Nome: </strong>
                              <Label htmlFor="nf-email">{this.state.user.name}</Label>
                            </div>
                          </div>
                          <div>
                            <div className="details">
                              <strong>Email: </strong>
                              <Label htmlFor="nf-email">{this.state.user.email}</Label>
                            </div>
                          </div>
                          <div>
                            <div className="details">
                              <strong>Contacto: </strong>
                              <Label htmlFor="nf-email">
                                {this.state.user.contactPrefix} {this.state.user.contact}
                              </Label>
                            </div>
                          </div>
                          <div>
                            <div className="details">
                              <strong>Endereço: </strong>
                              <Label htmlFor="nf-email">{this.state.user.address}</Label>
                            </div>
                          </div>

                          <div>
                            <div className="details">
                              <strong>País: </strong>
                              <Label htmlFor="nf-email">{this.state.user.countryName}</Label>
                            </div>
                          </div>
                          <div>
                            <div className="details">
                              <strong>Perfil: </strong>
                              <Label htmlFor="nf-email">{this.state.user.profile}</Label>
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

export default userDetails
