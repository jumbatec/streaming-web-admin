import React, { Component } from 'react'
import {
  Badge,
  Col,
  Nav,
  NavItem,
  InputGroupAddon,
  InputGroup,
  InputGroupText,
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
import { USER_KEY } from './../../services/auth'
import { FadeLoader } from 'react-spinners'

import Loader from 'react-loader-advanced'
import api, { baseURL } from './../../services/api'
const spinner = (
  <div className="d-flex justify-content-center">
    <FadeLoader sizeUnit={'px'} size={200} color={'#ffffff'} loading={true} />
  </div>
)
const initState = {
  title: '',
  publishDate: '',
  author: '',
  details: '',
  authorerror: '',
  titleerror: false,
  detailserror: false,
  publishDateerror: false,
  priceerror: false,
  url: 'nenhum',
  activeTab: '1',
  price: '',
  screenshot: '',
  numPages: null,
  screenshoterror: false,
  pageNumber: 1,
  files: [],
}

class CreateWorker extends Component {
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

  createBook = async (e) => {
    e.preventDefault()
    this.setState({ issaving: true })
    let user = JSON.parse(localStorage.getItem(USER_KEY))
    let createdBy = user._id

    const { title, publishDate, details, price, url, screenshot } = this.state
    let image = screenshot
    let author = 'Apóstolo Onório Cutane'

    await api.post('/api/book', {
      title,
      publishDate,
      url,
      details,
      author,
      price,
      image,
      createdBy,
    })

    this.toggle('3')
    setTimeout(() => {
      this.setState({ visible: false, issaving: false })
    }, 4000)
  }

  handleDrop = async (files) => {
    //Preparando para mandar as imagens
    if (files.length !== 0) {
      this.setState({ uploading: true })
      const data = new FormData()
      data.append(
        'file',
        files[0],
        'BOOK_' + new Date().getTime() + '.' + files[0].name.split('.').pop(),
      )
      data.append('filename', 'BOOK_' + new Date().getTime() + '.' + files[0].name.split('.').pop())

      const config = {
        headers: {
          'content-type': 'multipart/form-data',
        },
      }

      let resp = await api.post('/api/upload/books', data, config)

      this.setState({
        screenshot: resp.data.file,
        uploading: false,
      })
    }
  }

  nextPage(evt) {
    evt.preventDefault()
    let book = this.state
    if (book.title && book.details && book.publishDate && book.price && book.screenshot) {
      this.toggle('2')
    } else {
      this.setState({
        titleerror: !book.title,
        detailserror: !book.details,
        publishDateerror: !book.publishDate,
        authorerror: !book.author,
        priceerror: !book.price,
        screenshoterror: !book.screenshot,
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
              <div class="col-2">
                <Card>
                  <Loader
                    show={this.state.uploading}
                    message={spinner}
                    hideContentOnLoad={true}
                    backgroundStyle={{ color: 'white' }}
                    messageStyle={{ margin: 'auto', padding: '10px' }}
                  >
                    <div id="book">
                      <img
                        alt="Seleccione a capa do livro"
                        src={!this.state.screenshot ? '' : `${baseURL}/${this.state.screenshot}`}
                        style={{ height: '14em', width: '100%', 'background-size': 'cover' }}
                      />
                      <span>
                        {this.state.screenshoterror ? (
                          <div className="required">Por favor seleccione a capa</div>
                        ) : null}
                      </span>{' '}
                    </div>
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
                        <i className="icon-cloud-upload"></i> Carregar Capa
                      </div>
                    )}
                  </ReactDropzone>
                </Button>
              </div>

              <div class="col-10">
                <Card>
                  <CardBody>
                    <Form action="" method="post">
                      <FormGroup>
                        <Label htmlFor="nf-email">Título do Livro</Label>
                        <Input
                          type="text"
                          onChange={this.handleChange}
                          name="title"
                          value={this.state.title}
                          placeholder="Introduza o título.."
                          required
                        />
                        <span>
                          {this.state.titleerror ? (
                            <div className="required">Por favor informe o título</div>
                          ) : null}
                        </span>
                      </FormGroup>
                      <FormGroup>
                        <Label htmlFor="nf-email">Data de Publicação</Label>
                        <Input
                          type="date"
                          onChange={this.handleChange}
                          name="publishDate"
                          value={this.state.publishDate}
                          placeholder="Introduza a data de publicação.."
                          required
                        />
                        <span>
                          {this.state.publishDateerror ? (
                            <div className="required">Por favor introduza a data de publicação</div>
                          ) : null}
                        </span>
                      </FormGroup>

                      <FormGroup className="pr-1">
                        <Label htmlFor="appendedPrependedInput">Preço Unitário</Label>
                        <div className="controls">
                          <InputGroup className="input-prepend">
                            <InputGroupAddon addonType="prepend">
                              <InputGroupText>USD</InputGroupText>
                            </InputGroupAddon>
                            <Input
                              id="price"
                              onChange={this.handleChange}
                              name="price"
                              size="16"
                              type="text"
                            />
                            <InputGroupAddon addonType="append">
                              <InputGroupText>.00</InputGroupText>
                            </InputGroupAddon>
                          </InputGroup>
                        </div>
                        <span>
                          {this.state.priceerror ? (
                            <div className="required">Por favor informe o preço unitário</div>
                          ) : null}
                        </span>
                      </FormGroup>

                      <FormGroup className="pr-1">
                        <Label htmlFor="exampleInputEmail2" className="pr-1">
                          Resumo
                        </Label>
                        <Input
                          type="textarea"
                          rows="7"
                          onChange={this.handleChange}
                          name="details"
                          value={this.state.details}
                          placeholder="Informe o resumo"
                        />
                        <span>
                          {this.state.detailserror ? (
                            <div className="required">Por favor informe o resumo</div>
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
          <div class="container">
            <div class="row">
              <div class="col-2">
                <Card>
                  <di id="book">
                    <img
                      alt="Capa do livro"
                      src={!this.state.screenshot ? '' : `${baseURL}/${this.state.screenshot}`}
                      style={{ height: '14em', width: '100%', 'background-size': 'cover' }}
                    />
                  </di>
                </Card>
              </div>
              <div class="col-10">
                <Card>
                  <CardBody>
                    <div>
                      <div className="details">
                        <strong>Título do Livro: </strong>
                        <Label htmlFor="nf-email">{this.state.title}</Label>
                      </div>
                    </div>
                    <div>
                      <div className="details">
                        <strong>Data de Publicação: </strong>
                        <Label htmlFor="nf-email">{this.state.publishDate}</Label>
                      </div>
                    </div>
                    <div>
                      <div className="details">
                        <strong>Preço Unitário: </strong>
                        <Label htmlFor="nf-email">{this.state.price} USD</Label>
                      </div>
                    </div>

                    <div>
                      <div className="details">
                        <strong>Resumo: </strong>
                        <Label htmlFor="nf-email">{this.state.details}</Label>
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
                        onClick={this.createBook.bind(this)}
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
              <div class="col-2">
                <Card>
                  <di id="book">
                    <img
                      alt="Capa do livro"
                      src={!this.state.screenshot ? '' : `${baseURL}/${this.state.screenshot}`}
                      style={{ height: '14em', width: '100%', 'background-size': 'cover' }}
                    />
                  </di>
                </Card>
              </div>
              <div class="col-10">
                <Card>
                  <CardBody>
                    <div>
                      <div className="details">
                        <strong>Título do Livro: </strong>
                        <Label htmlFor="nf-email">{this.state.title}</Label>
                      </div>
                    </div>
                    <div>
                      <div className="details">
                        <strong>Data de Publicação: </strong>
                        <Label htmlFor="nf-email">{this.state.publishDate}</Label>
                      </div>
                    </div>
                    <div>
                      <div className="details">
                        <strong>Preço Unitário: </strong>
                        <Label htmlFor="nf-email">{this.state.price} USD</Label>
                      </div>
                    </div>

                    <div>
                      <div className="details">
                        <strong>Resumo: </strong>
                        <Label htmlFor="nf-email">{this.state.details}</Label>
                      </div>
                    </div>
                  </CardBody>
                  <CardFooter>
                    <Button type="submit" size="sm" onClick={this.reset.bind(this)} color="primary">
                      {' '}
                      Cadastrar novo livro{' '}
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
                <NavLink active={this.state.activeTab === '1'}>Dados do Livro</NavLink>
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

export default CreateWorker
