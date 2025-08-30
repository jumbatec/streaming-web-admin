import React, { Component } from 'react'
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Label,
  Navbar,
  Row,
  FormGroup,
  Form,
  CardFooter,
  Button,
  Badge,
} from 'reactstrap'
import ReactToPrint from 'react-to-print'

import api from './../../services/api'
const getBadge = (status) => {
  return status === 'Aprovado' ? 'success' : 'warning'
}

class ComponentToPrint extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      processing: false,
      worship: {},
    }
  }

  componentWillMount() {
    console.log(this.props.id)
    api.get(`/api/worship/unique/${this.props.id}`).then((res) => {
      console.log(res.data)
      this.setState({ worship: res.data, processing: false })
    })
  }

  render() {
    return (
      <div style={{ padding: '50px 0px 0px 30px' }}>
        <strong>DADOS DO RELATÓRIO</strong>
        <hr></hr>
        <div class="container">
          <div class="row">
            <div class="col-5">
              <div>
                <div className="details">
                  <strong>Tema: </strong>
                  <Label htmlFor="nf-email">{this.state.worship.topic}</Label>
                </div>
              </div>
              <div>
                <div className="details">
                  <strong>Nome da Célula: </strong>
                  <Label htmlFor="nf-email">{this.state.worship.sucursal}</Label>
                </div>
              </div>
              <div>
                <div className="details">
                  <strong>Nome do Missionário: </strong>
                  <Label htmlFor="nf-email">{this.state.worship.missionary}</Label>
                </div>
              </div>
              <div>
                <div className="details">
                  <strong>Estado: </strong>
                  <Badge color={getBadge(this.state.worship.status)}>
                    {this.state.worship.status}
                  </Badge>
                </div>
              </div>
            </div>
            <div class="col-7">
              <div>
                <div className="details">
                  <strong>Nr. de Crentes Presentes: </strong>
                  <Label htmlFor="nf-email">{this.state.worship.oldbelievers}</Label>
                </div>
              </div>
              <div>
                <div className="details">
                  <strong>Novos Crentes: </strong>
                  <Label htmlFor="nf-email">{this.state.worship.newbelievers}</Label>
                </div>
              </div>
              <div>
                <div className="details">
                  <strong>Data: </strong>
                  <Label htmlFor="nf-email">{this.state.worship.date}</Label>
                </div>
              </div>
              <div>
                <div className="details">
                  <strong>Hora de Início/Fim: </strong>
                  <Label htmlFor="nf-email">
                    {' '}
                    {this.state.worship.startTime
                      ? this.state.worship.startTime.substring(11, 16)
                      : ''}
                    /{' '}
                    {this.state.worship.endTime ? this.state.worship.endTime.substring(11, 16) : ''}
                  </Label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ padding: '35px 0px 0px' }}>
          <strong>PROGRESSOS E DESAFIOS</strong>
          <hr></hr>
          <div class="container">
            <div class="row">
              <div class="col-5">
                <Form action="" method="post">
                  <FormGroup>
                    <strong>Progressos: </strong>
                    <Label htmlFor="nf-email">{this.state.worship.progress}</Label>
                  </FormGroup>
                  <FormGroup>
                    <strong>Desafios: </strong>
                    <Label htmlFor="nf-email">{this.state.worship.chalenge}</Label>
                  </FormGroup>
                </Form>
              </div>
            </div>
          </div>
        </div>
        <div style={{ padding: '35px 0px 0px' }}>
          <strong>OFERTÓRIO</strong>
          <hr></hr>
          <div class="container">
            <Form action="" method="post">
              {this.state.worship.moneycontributions ? (
                <div>
                  {this.state.worship.moneycontributions.map((moneycontribution, i) => {
                    return (
                      <FormGroup key={i}>
                        <strong>{moneycontribution.designation}: </strong>
                        <Label htmlFor="nf-email">{moneycontribution.amount} MZN</Label>
                      </FormGroup>
                    )
                  })}
                </div>
              ) : null}
            </Form>
          </div>
        </div>
        <div style={{ padding: '35px 0px 0px' }}>
          <strong>OFERTAS EM BENS DE VALOR</strong>
          <hr></hr>
          <div class="container">
            <Form action="" method="post">
              {this.state.worship.speciecontributions ? (
                <div>
                  {this.state.worship.speciecontributions.map((speciecontribution, i) => {
                    return (
                      <FormGroup key={i}>
                        <strong>{speciecontribution.designation}: </strong>
                        <Label htmlFor="nf-email">{speciecontribution.quantity} MZN</Label>
                      </FormGroup>
                    )
                  })}
                </div>
              ) : (
                'Nenhuma'
              )}
            </Form>
          </div>
        </div>

        {this.state.worship.testimonies ? (
          <div>
            {' '}
            <strong>Testemunhos</strong>
            <hr />
          </div>
        ) : null}
        <div class="container">
          {' '}
          <div>
            {this.state.worship.testimonies ? (
              <div>
                {this.state.worship.testimonies.map((testmony, i) => {
                  return (
                    <div className="aside-options">
                      <div className="clearfix mt-4">
                        <small>
                          <b>{testmony.owner}</b>
                        </small>
                        <div className={'float-right'}>
                          <small>
                            <Badge color="warning">{testmony.type}</Badge>
                          </small>
                        </div>
                      </div>
                      <div>
                        <small className="text-muted"> {testmony.description}</small>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div>
                <small className="text-muted"> Nenhum testemunho</small>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }
}

class WorshipReportDetails extends Component {
  constructor(props) {
    super(props)
    this.state = {
      worships: [],
      open: false,
      worship: {},
      processing: true,
    }
  }

  render() {
    return (
      <div className=" justify-content-center">
        <div className="animated ">
          <Row>
            <Col lg={10}>
              <Card>
                <CardHeader>
                  <strong>
                    <i className="icon-info pr-1"></i>Detalhes do Relatorio de Cultos
                  </strong>{' '}
                  <Badge color="warning">{this.state.worship.sucursal}</Badge>
                </CardHeader>
                <CardBody>
                  <ComponentToPrint
                    ref={(el) => (this.componentRef = el)}
                    id={this.props.match.params.id}
                  />
                </CardBody>
                <CardFooter>
                  <ReactToPrint
                    trigger={() => (
                      <a href="#">
                        {' '}
                        <button
                          type="submit"
                          style={{ float: 'right' }}
                          className="btn btn-outline-danger"
                        >
                          Imprimir PDF
                        </button>
                      </a>
                    )}
                    content={() => this.componentRef}
                  />
                </CardFooter>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    )
  }
}

export default WorshipReportDetails
