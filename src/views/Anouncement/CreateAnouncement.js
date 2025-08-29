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
import ReactDropzone from 'react-dropzone'

import eventtypes from './eventTypes'
import { FadeLoader } from 'react-spinners'

import Loader from 'react-loader-advanced'
import { USER_KEY } from './../../services/auth'

import api, { baseURL } from './../../services/api'
const spinner = (
  <div className="d-flex justify-content-center">
    <FadeLoader sizeUnit={'px'} size={200} color={'#ffffff'} loading={true} />
  </div>
)
const initState = {
  title: '',
  description: '',
  place: '',
  address: '',
  churchAddres: '1',
  type: '',
  publishDate: '',
  files: [],
  activeTab: '1',
  issaving: false,
  loading: false,
  banner: '',
  placeError: false,
  addressError: false,
  descriptionError: false,
  typeError: false,
  titleerror: false,
  isEvent: false,
  publishDateerror: false,
  fileError: false,
}

class CreateAnouncement extends Component {
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

  createAnnouncement = async (e) => {
    e.preventDefault()
    this.setState({ issaving: true, loading: true })
    let user = JSON.parse(localStorage.getItem(USER_KEY))
    let createdBy = user._id
    const { title, description, place, address, type, publishDate, banner } = this.state

    const newevent = await api.post('/api/event', {
      title,
      description,
      place,
      address,
      type,
      publishDate,
      banner,
      createdBy,
    })
    this.setState({ loading: false })
    this.toggle('3')
    setTimeout(() => {
      this.setState({ visible: false, issaving: false })
    }, 4000)
    api.post('/api/notification', {
      title: newevent.title,
      _id: newevent._id,
      _class: 'event',
      notfiatiodescription: 'Anúcio do publicado ',
    })
  }

  handleDrop = async (files) => {
    let picture = ''
    //Preparando para mandar as imagens
    if (files.length !== 0) {
      this.setState({ uploading: true })
      const data = new FormData()
      data.append(
        'file',
        files[0],
        'EVT_' + new Date().getTime() + '.' + files[0].name.split('.').pop(),
      )
      data.append('filename', 'EVT_' + new Date().getTime() + '.' + files[0].name.split('.').pop())

      const config = {
        headers: {
          'content-type': 'multipart/form-data',
        },
      }

      let resp = await api.post('/api/upload/events', data, config)
      this.setState({
        banner: resp.data.file,
        uploading: false,
      })
    }
  }

  nextPage(evt) {
    evt.preventDefault()

    let { place, address } = this.state
    if (this.state.churchAddres === '1') {
      place = 'Igreja Ministerial Nações para Cristo (Sede)'
      address = 'Moçambique, Boane KM 16,Bairro Djonasse'
    }
    this.setState({
      titleerror: !this.state.title,
      place,
      address,
      typeError: !this.state.type,
      descriptionError: !this.state.description,
      publishDateerror: !this.state.publishDate,
    })

    if (this.state.type === 'EVT01' && !this.state.banner) {
      window.scrollTo(0, 0)
      this.setState({ fileError: true })
    } else {
      this.setState({ fileError: false })
      if (this.state.type === 'EVT01' && this.state.churchAddres === '2' && !this.state.place) {
        this.setState({ placeError: true })
      } else {
        this.setState({ placeError: false })
        if (this.state.type === 'EVT01' && this.state.churchAddres === '2' && !this.state.address) {
          this.setState({ addressError: true })
        } else {
          if (
            this.state.title &&
            this.state.description &&
            this.state.type &&
            this.state.publishDate
          ) {
            this.setState({ addressError: false })

            this.toggle('2')
          }
        }
      }
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
              <div class="col-2">
                <Card>
                  <Loader
                    show={this.state.uploading}
                    message={spinner}
                    hideContentOnLoad={true}
                    backgroundStyle={{ color: 'white' }}
                    messageStyle={{ margin: 'auto', padding: '10px' }}
                  >
                    <div id="banner">
                      <img
                        alt="Baner"
                        src={!this.state.banner ? '' : `${baseURL}/${this.state.banner}`}
                        style={{ height: '6em', width: '100%', 'background-size': 'cover' }}
                      />
                      <span>
                        {this.state.screenshoterror ? (
                          <div className="required">Por favor seleccione a capa</div>
                        ) : null}
                      </span>{' '}
                    </div>{' '}
                  </Loader>{' '}
                </Card>
                <Button color="primary" size="sm" style={{ width: '100%' }} block outline>
                  {' '}
                  <ReactDropzone
                    multiple={true}
                    onDrop={this.handleDrop.bind(this)}
                    accept="image/*"
                  >
                    {({ getRootProps, getInputProps }) => (
                      <div {...getRootProps()}>
                        <input {...getInputProps()} />
                        <i className="icon-cloud-upload"></i> Carregar Banner
                      </div>
                    )}
                  </ReactDropzone>
                </Button>

                <div id="upload">{this.state.url}</div>
              </div>

              <div class="col-10">
                <Card>
                  <CardBody>
                    <Form action="" method="post">
                      <FormGroup>
                        <Label htmlFor="nf-email">Tipo de Anúcio</Label>
                        <Input type="select" name="type" onChange={this.handleChange}>
                          <option value={this.state.type}>
                            {this.state.type
                              ? eventtypes.filter((evt) => evt.code === this.state.type)[0].desc
                              : ''}
                          </option>
                          {eventtypes.map((evt, index) => (
                            <option value={evt.code} key={index}>
                              {evt.desc}
                            </option>
                          ))}
                        </Input>
                        <span>
                          {this.state.typeError ? (
                            <div className="required">Por favor seleccione o tipo de anúcio</div>
                          ) : null}
                        </span>
                      </FormGroup>

                      <FormGroup className="pr-1">
                        <Label htmlFor="exampleInputEmail2" className="pr-1">
                          Titulo
                        </Label>
                        <Input
                          type="text"
                          onChange={this.handleChange}
                          name="title"
                          value={this.state.details}
                          placeholder="Informe o resumo"
                        />
                        <span>
                          {this.state.titleerror ? (
                            <div className="required">Por favor informe o título</div>
                          ) : null}
                        </span>
                      </FormGroup>

                      <FormGroup>
                        <Label htmlFor="nf-email">Data de Expiração</Label>
                        <Input
                          type="datetime-local"
                          onChange={this.handleChange}
                          name="publishDate"
                          value={this.state.publishDate}
                          placeholder="Introduza a data de publicação.."
                          required
                        />
                        <span>
                          {this.state.publishDateerror ? (
                            <div className="required">Por favor introduza a data de expiração</div>
                          ) : null}
                        </span>
                      </FormGroup>

                      {this.state.type === 'EVT01' ? (
                        <FormGroup row>
                          <Col md="2">
                            <Label>Local do Evento</Label>
                          </Col>
                          <Col md="10">
                            <FormGroup check inline>
                              <Input
                                className="form-check-input"
                                type="radio"
                                id="inline-radio1"
                                name="churchAddres"
                                value="1"
                                onChange={this.handleChange}
                              />
                              <Label className="form-check-label" check htmlFor="inline-radio1">
                                Sede da Igreja
                              </Label>
                            </FormGroup>
                            <FormGroup check inline>
                              <Input
                                className="form-check-input"
                                type="radio"
                                id="inline-radio2"
                                name="churchAddres"
                                value="2"
                                onChange={this.handleChange}
                              />
                              <Label className="form-check-label" check htmlFor="inline-radio2">
                                Outro Local
                              </Label>
                            </FormGroup>
                          </Col>
                        </FormGroup>
                      ) : null}
                      {this.state.churchAddres === '2' ? (
                        <div>
                          <FormGroup className="pr-1">
                            <Label htmlFor="exampleInputEmail2" className="pr-1">
                              Local
                            </Label>
                            <Input
                              type="text"
                              rows="3"
                              onChange={this.handleChange}
                              name="place"
                              value={this.state.place}
                              placeholder="indroduza o local do evento"
                            />
                            <span>
                              {this.state.placeError ? (
                                <div className="required">Por favor informe o local do evento</div>
                              ) : null}
                            </span>
                          </FormGroup>
                          <FormGroup className="pr-1">
                            <Label htmlFor="exampleInputEmail2" className="pr-1">
                              Endereço do Local
                            </Label>
                            <Input
                              type="textarea"
                              rows="3"
                              onChange={this.handleChange}
                              name="address"
                              value={this.state.address}
                              placeholder="indroduza o endereço do local"
                            />
                            <span>
                              {this.state.addressError ? (
                                <div className="required">
                                  Por favor informe o endereço do evento
                                </div>
                              ) : null}
                            </span>
                          </FormGroup>
                        </div>
                      ) : null}
                      <FormGroup className="pr-1">
                        <Label htmlFor="exampleInputEmail2" className="pr-1">
                          Descrição do anúcio
                        </Label>
                        <Input
                          type="textarea"
                          rows="3"
                          onChange={this.handleChange}
                          name="description"
                          value={this.state.description}
                          placeholder="indroduza a descrição do anúcio"
                        />
                        <span>
                          {this.state.descriptionError ? (
                            <div className="required">Por favor informe a descrição do anúcio</div>
                          ) : null}
                        </span>
                      </FormGroup>
                    </Form>
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
          <Loader
            show={this.state.loading}
            message={spinner}
            hideContentOnLoad={true}
            backgroundStyle={{ color: 'white' }}
            messageStyle={{ margin: 'auto', padding: '10px' }}
          >
            <div class="container">
              <div class="row">
                <div class="col-2">
                  <Card>
                    <di id="banner">
                      <img
                        alt="Baner"
                        src={!this.state.banner ? '' : `${baseURL}/${this.state.banner}`}
                        style={{ height: '6em', width: '100%', 'background-size': 'cover' }}
                      />
                    </di>
                  </Card>
                </div>
                <div class="col-10">
                  <Card>
                    <CardBody>
                      <div>
                        <div className="details">
                          <strong>Tipo do anúcio: </strong>
                          <Label htmlFor="nf-email">
                            {this.state.type
                              ? eventtypes.filter((evt) => evt.code === this.state.type)[0].desc
                              : ''}
                          </Label>
                        </div>
                      </div>

                      <div>
                        <div className="details">
                          <strong>Título do anúcio: </strong>
                          <Label htmlFor="nf-email">{this.state.title}</Label>
                        </div>
                      </div>
                      <div>
                        <div className="details">
                          <strong>Data de Expiração: </strong>
                          <Label htmlFor="nf-email">{this.state.publishDate}</Label>
                        </div>
                      </div>
                      {this.state.type === 'EVT01' ? (
                        <div>
                          <div>
                            <div className="details">
                              <strong>Local do Evento: </strong>
                              <Label htmlFor="nf-email">{this.state.place} </Label>
                            </div>
                          </div>

                          <div>
                            <div className="details">
                              <strong>Endereço do local: </strong>
                              <Label htmlFor="nf-email">{this.state.address} </Label>
                            </div>
                          </div>
                        </div>
                      ) : null}

                      <div>
                        <div className="details">
                          <strong>Descrição do evento: </strong>
                          <Label htmlFor="nf-email">{this.state.description}</Label>
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
                          onClick={this.createAnnouncement.bind(this)}
                          color="primary"
                        >
                          {' '}
                          Confirmar{' '}
                        </Button>
                      </span>{' '}
                      <span>
                        {' '}
                        <Button
                          onClick={this.reset.bind(this)}
                          type="reset"
                          size="sm"
                          color="danger"
                        >
                          <i className="fa fa-ban"></i> Cancelar
                        </Button>
                      </span>
                    </CardFooter>
                  </Card>
                </div>
              </div>
            </div>
          </Loader>
        </TabPane>

        <TabPane tabId="3">
          <Alert color="success" isOpen={this.state.visible} toggle={this.onDismiss.bind(this)}>
            Operação Realizada com sucesso!
          </Alert>
          <div class="container">
            <div class="row">
              <div class="col-2">
                <Card>
                  <di id="banner">
                    <img
                      alt="Baner"
                      src={!this.state.banner ? '' : `${baseURL}/${this.state.banner}`}
                      style={{ height: '6em', width: '100%', 'background-size': 'cover' }}
                    />
                  </di>
                </Card>
              </div>
              <div class="col-10">
                <Card>
                  <CardBody>
                    <div>
                      <div className="details">
                        <strong>Tipo do anúcio: </strong>
                        <Label htmlFor="nf-email">
                          {this.state.type
                            ? eventtypes.filter((evt) => evt.code === this.state.type)[0].desc
                            : ''}
                        </Label>
                      </div>
                    </div>

                    <div>
                      <div className="details">
                        <strong>Título do anúcio: </strong>
                        <Label htmlFor="nf-email">{this.state.title}</Label>
                      </div>
                    </div>
                    <div>
                      <div className="details">
                        <strong>Data de Expiração: </strong>
                        <Label htmlFor="nf-email">{this.state.publishDate}</Label>
                      </div>
                    </div>
                    {this.state.type === 'EVT01' ? (
                      <div>
                        <div>
                          <div className="details">
                            <strong>Local do Evento: </strong>
                            <Label htmlFor="nf-email">{this.state.place} </Label>
                          </div>
                        </div>

                        <div>
                          <div className="details">
                            <strong>Endereço do local: </strong>
                            <Label htmlFor="nf-email">{this.state.address} </Label>
                          </div>
                        </div>
                      </div>
                    ) : null}

                    <div>
                      <div className="details">
                        <strong>Descrição do evento: </strong>
                        <Label htmlFor="nf-email">{this.state.description}</Label>
                      </div>
                    </div>
                  </CardBody>
                  <CardFooter>
                    <Button type="submit" size="sm" onClick={this.reset.bind(this)} color="primary">
                      {' '}
                      Publicar novo anúcio{' '}
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
                <NavLink active={this.state.activeTab === '1'}>Dados do Anúcio</NavLink>
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

export default CreateAnouncement
