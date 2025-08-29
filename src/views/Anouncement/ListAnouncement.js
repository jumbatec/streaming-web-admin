import React, { Component } from 'react'
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Row,
  Badge,
  CardFooter,
  CardGroup,
  Modal,
  ModalBody,
  ModalFooter,
  Button,
  ModalHeader,
} from 'reactstrap'

import api from './../../services/api'

import eventtypes from './eventTypes'

class ListBooks extends Component {
  constructor(props) {
    super(props)
    this.state = {
      open: false,
      event: {},
      events: [],
      processing: true,
    }
  }

  toggleFade = (e) => {
    this.setState({ open: !this.state.open, event: e })
  }

  inativate = async (e) => {
    await api.put('/api/event/inactive/' + e._id)
    let events = this.state.events.filter((ev) => ev._id !== e._id)
    this.setState({ events, open: false })
  }

  toggleOpenClose = () => {
    this.setState({
      open: !this.state.open,
    })
  }
  componentDidMount = (async) => {
    window.scrollTo(0, 0)
    api.get('/api/event').then((res) => {
      const events = res.data
      this.setState({ events: events, processing: false })
    })
  }

  render() {
    return (
      <div className="animated fadeIn">
        <Row>
          <Col xl={12}>
            <Card>
              <CardHeader>
                <i className="fa fa-align-justify"></i> Anúcios da Igreja
              </CardHeader>
              <CardBody>
                <CardGroup className="mb-4">
                  {this.state.events.map((event, i) => {
                    return (
                      <Col xs="12" sm="6" md="4">
                        <Card className="p-0-animated fadeIn">
                          <CardHeader>
                            <Badge
                              color={
                                event.type === 'EVT01'
                                  ? 'warning'
                                  : event.type === 'EVT02'
                                    ? 'info'
                                    : 'success'
                              }
                            >
                              {event.type
                                ? eventtypes.filter((evt) => evt.code === event.type)[0].desc
                                : ''}
                            </Badge>

                            <a className="card-header-action float-right mb-0' btn btn-close">
                              <i
                                onClick={this.toggleFade.bind(this, event)}
                                className="icon-close danger"
                              ></i>
                            </a>
                          </CardHeader>
                          <CardBody>
                            <div className="h5-mb-0  font-weight-bold">{event.title}</div>
                          </CardBody>
                          <CardFooter className="px-3 py-2">
                            <a href="#">
                              Ver Detalhes
                              <i className="fa fa-angle-right float-right font-lg"></i>
                            </a>
                          </CardFooter>
                        </Card>{' '}
                      </Col>
                    )
                  })}
                </CardGroup>
                <Modal
                  color="info"
                  isOpen={this.state.open}
                  toggle={this.toggleOpenClose.bind(this)}
                  className={'modal-info ' + this.props.className}
                >
                  <ModalHeader toggle={this.props.toggleOpenClose}>
                    {this.state.event.title}
                  </ModalHeader>
                  <ModalBody>
                    Esta Operação é ireversível. Tem a certeza que deseja remover este anúcio?
                  </ModalBody>
                  <ModalFooter>
                    <Button color="danger" onClick={this.inativate.bind(this, this.state.event)}>
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
