import React, { Component } from 'react'
import {
  Badge,
  Col,
  Nav,
  NavItem,
  NavLink,
  Row,
  Input,
  Button,
  FormGroup,
  Label,
  Form,
  Alert,
  TabContent,
  TabPane,
  Card,
  CardBody,
  CardFooter,
} from 'reactstrap'

import { FadeLoader } from 'react-spinners'

import Loader from 'react-loader-advanced'
import { USER_KEY } from './../../services/auth'
import api from './../../services/api'

const spinner = (
  <div className="d-flex justify-content-center">
    <FadeLoader sizeUnit={'px'} size={200} color={'#ffffff'} loading={true} />
  </div>
)
const initState = {
  name: '',
  numberOfBeleavers: '',
  bornAgainNumber: '',
  notBornAgainNumber: '',
  address: '',
  foundationDate: '',
  formatedDate: '',
  bornAgainNumbererror: false,
  numberOfBeleaverserror: false,
  nameerror: false,
  addresserror: false,
  activeTab: '1',
}

class CreateSucursal extends Component {
  constructor(props) {
    super(props)
    this.state = initState
    this.toggle = this.toggle.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  reset() {
    window.scrollTo(0, 0)
    this.setState(initState)
    this.toggle('1')
  }

  onDismiss() {
    this.setState({ visible: false })
  }

  componentDidMount() {
    window.scrollTo(0, 0)
  }

  previousPage(evt) {
    this.toggle('1')
  }

  handleChange(evt) {
    this.setState({ [evt.target.name]: evt.target.value })
  }
  createSucursal = async (e) => {
    e.preventDefault()
    this.setState({ issaving: true })
    let user = JSON.parse(localStorage.getItem(USER_KEY))
    let createdBy = user._id

    let { name, numberOfBeleavers, bornAgainNumber, address, foundationDate } = this.state
    let notBornAgainNumber = numberOfBeleavers - bornAgainNumber

    await api.post('/api/sucursal', {
      name,
      numberOfBeleavers,
      bornAgainNumber,
      notBornAgainNumber,
      address,
      foundationDate,
      createdBy,
    })
    this.toggle('3')
    setTimeout(() => {
      this.setState({ visible: false, issaving: false })
    }, 4000)
  }

  nextPage(evt) {
    evt.preventDefault()
    let sucursal = this.state
    if (sucursal.name && sucursal.address && sucursal.foundationDate) {
      this.toggle('2')
    } else {
      this.setState({
        nameerror: !sucursal.name,
        addresserror: !sucursal.address,
        foundationdateerror: !sucursal.foundationDate,
      })
    }
  }

  toggle(tab) {
    this.setState({
      activeTab: tab,
    })
  }

  tabPane() {
    return (
      <>
        <TabPane tabId="1">
          <div class="container">
            <div class="row">
              <div class="col-12">
                <Card>
                  <CardBody>
                    <Loader
                      show={this.state.uploading}
                      message={spinner}
                      hideContentOnLoad={true}
                      backgroundStyle={{ color: 'white' }}
                      messageStyle={{ margin: 'auto', padding: '10px' }}
                    >
                      <Form action="" method="post">
                        <FormGroup>
                          <Label htmlFor="nf-email">Nome da Célula</Label>
                          <Input
                            type="text"
                            onChange={this.handleChange}
                            name="name"
                            value={this.state.title}
                            placeholder="Introduza o título.."
                            required
                          />
                          <span>
                            {this.state.nameerror ? (
                              <div className="required">Por favor informe o nome</div>
                            ) : null}
                          </span>
                        </FormGroup>
                        <FormGroup>
                          <Label htmlFor="nf-email">Data de Abertura</Label>
                          <Input
                            type="date"
                            onChange={this.handleChange}
                            name="foundationDate"
                            value={this.state.publishDate}
                            placeholder="Introduza a data de publicação.."
                            required
                          />
                          <span>
                            {this.state.foundationdateerror ? (
                              <div className="required">Por favor introduza a data de abertura</div>
                            ) : null}
                          </span>
                        </FormGroup>
                        <FormGroup className="pr-1">
                          <Label htmlFor="exampleInputEmail2" className="pr-1">
                            Total de Crentes
                          </Label>
                          <Input
                            type="text"
                            name="numberOfBeleavers"
                            onChange={this.handleChange}
                            value={this.state.numberOfBeleavers}
                            placeholder="Introduza o total de Crentes"
                          />
                        </FormGroup>

                        <FormGroup className="pr-1">
                          <Label htmlFor="exampleInputEmail2" className="pr-1">
                            Nr. de Crentes Batizados
                          </Label>
                          <Input
                            type="text"
                            name="bornAgainNumber"
                            onChange={this.handleChange}
                            value={this.state.bornAgainNumber}
                            placeholder="Nr. de Crentes Batizados"
                          />
                        </FormGroup>

                        <FormGroup className="pr-1">
                          <Label htmlFor="exampleInputEmail2" className="pr-1">
                            Localização
                          </Label>
                          <Input
                            type="textarea"
                            rows="3"
                            onChange={this.handleChange}
                            name="address"
                            value={this.state.address}
                            placeholder="Informe a localização"
                          />
                          <span>
                            {this.state.addresserror ? (
                              <div className="required">Por favor informe a localização</div>
                            ) : null}
                          </span>
                        </FormGroup>
                      </Form>
                    </Loader>
                  </CardBody>
                  <CardFooter>
                    <span>
                      {' '}
                      <Button
                        type="submit"
                        size="sm"
                        onClick={this.nextPage.bind(this)}
                        color="primary"
                      >
                        {' '}
                        Próximo <i className="fa fa-chevron-circle-right"></i>
                      </Button>
                    </span>{' '}
                    <span>
                      <Button onClick={this.reset.bind(this)} type="reset" size="sm" color="danger">
                        <i className="fa fa-ban"></i> Cancelar
                      </Button>
                    </span>{' '}
                  </CardFooter>
                </Card>
              </div>
            </div>
          </div>
        </TabPane>

        <TabPane tabId="2">
          <div class="container">
            <div class="row">
              <div class="col-12">
                <Card>
                  <CardBody>
                    <div>
                      <div className="details">
                        <strong>Nome da Célula: </strong>
                        <Label htmlFor="nf-email">{this.state.name}</Label>
                      </div>
                    </div>
                    <div>
                      <div className="details">
                        <strong>Data de Abertura: </strong>
                        <Label htmlFor="nf-email">{this.state.foundationDate}</Label>
                      </div>
                    </div>
                    <div>
                      <div className="details">
                        <strong>Total de Crentes: </strong>
                        <Label htmlFor="nf-email">{this.state.numberOfBeleavers}</Label>
                      </div>
                    </div>

                    <div>
                      <div className="details">
                        <strong>Nr. de Crentes Batizados: </strong>
                        <Label htmlFor="nf-email">{this.state.bornAgainNumber}</Label>
                      </div>
                    </div>
                    <div>
                      <div className="details">
                        <strong>Localização: </strong>
                        <Label htmlFor="nf-email">{this.state.address}</Label>
                      </div>
                    </div>
                  </CardBody>
                  <CardFooter>
                    <span>
                      <Button
                        type="submit"
                        size="sm"
                        onClick={this.toggle.bind(this, '1')}
                        color="primary"
                      >
                        {' '}
                        <i className="fa fa-chevron-circle-left"></i>Anterior
                      </Button>
                    </span>{' '}
                    <span>
                      {' '}
                      <Button
                        type="submit"
                        size="sm"
                        onClick={this.createSucursal.bind(this)}
                        color="primary"
                      >
                        {' '}
                        Confirmar{' '}
                      </Button>
                    </span>{' '}
                    <span>
                      {' '}
                      <Button onClick={this.reset.bind(this)} type="reset" size="sm" color="danger">
                        <i className="fa fa-ban"></i> Cancelar
                      </Button>
                    </span>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </div>
        </TabPane>

        <TabPane tabId="3">
          <Alert color="success" isOpen={this.state.visible} toggle={this.onDismiss.bind(this)}>
            Operação Realizada com sucesso!
          </Alert>
          <div class="container">
            <div class="row">
              <div class="col-12">
                <Card>
                  <CardBody>
                    <div>
                      <div className="details">
                        <strong>Nome da Célula: </strong>
                        <Label htmlFor="nf-email">{this.state.name}</Label>
                      </div>
                    </div>
                    <div>
                      <div className="details">
                        <strong>Data de Abertura: </strong>
                        <Label htmlFor="nf-email">{this.state.foundationDate}</Label>
                      </div>
                    </div>
                    <div>
                      <div className="details">
                        <strong>Total de Crentes: </strong>
                        <Label htmlFor="nf-email">{this.state.numberOfBeleavers}</Label>
                      </div>
                    </div>

                    <div>
                      <div className="details">
                        <strong>Nr. de Crentes Batizados: </strong>
                        <Label htmlFor="nf-email">{this.state.bornAgainNumber}</Label>
                      </div>
                    </div>
                    <div>
                      <div className="details">
                        <strong>Localização: </strong>
                        <Label htmlFor="nf-email">{this.state.address}</Label>
                      </div>
                    </div>
                  </CardBody>
                  <CardFooter>
                    <Button type="submit" size="sm" onClick={this.reset.bind(this)} color="primary">
                      {' '}
                      Cadastrar nova Célula{' '}
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </div>
        </TabPane>
      </>
    )
  }

  render() {
    return (
      <div className="animated fadeIn">
        <Row>
          <Col xs="12" md="12" className="mb-4">
            <Nav tabs>
              <NavItem>
                <NavLink active={this.state.activeTab === '1'}>Dados da Célula</NavLink>
              </NavItem>
              <NavItem>
                <NavLink active={this.state.activeTab === '2'}>Confirmar</NavLink>
              </NavItem>

              <NavItem>
                <NavLink active={this.state.activeTab === '3'}>
                  <i className="icon-check"></i>
                  <span className={this.state.activeTab === '4' ? '' : 'd-none'}>
                    <Badge pill color="success">
                      Sucesso
                    </Badge>{' '}
                  </span>
                </NavLink>
              </NavItem>
            </Nav>
            <TabContent activeTab={this.state.activeTab}>{this.tabPane()}</TabContent>
          </Col>
        </Row>
      </div>
    )
  }
}

export default CreateSucursal
