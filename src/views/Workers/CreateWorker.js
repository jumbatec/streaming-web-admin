import React, { Component } from 'react'
import {
  Badge,
  Col,
  Nav,
  NavItem,
  NavLink,
  Table,
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
import maritulstatus from '../Utils/maritulstatus'
import profiles from '../Utils/profiles'
import api, { baseURL } from './../../services/api'
import { FadeLoader } from 'react-spinners'

import Loader from 'react-loader-advanced'
import { USER_KEY, defaultPassword } from './../../services/auth'

const spinner = (
  <div className="d-flex justify-content-center">
    <FadeLoader sizeUnit={'px'} size={200} color={'#ffffff'} loading={true} />
  </div>
)
const options = maritulstatus.map(({ name, desc }) => ({ text: name, value: desc }))
const categories = profiles.map(({ name, desc }) => ({ text: name, value: desc }))

const initState = {
  email: '',
  user: false,
  name: '',
  contact: '',
  maritulstatus: '',
  category: '',
  address: '',
  birthDate: '',
  formatedDate: '',
  alltransactions: [],
  visible: true,
  username: '',
  active: '',
  password: '',
  categories: [],
  activeTab: '1',
  password2: '',
  nameerror: false,
  emailerror: false,
  transactionerror: false,
  birtherror: false,
  maritulstatuserror: false,
  categoryerror: false,
  addresserror: false,
  transactions: [],
  hightlight: false,
  haspicture: false,
  file: {},
  files: [],
}

class CreateWorker extends Component {
  constructor(props) {
    super(props)
    this.state = initState
    this.toggle = this.toggle.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleChecked = this.handleChecked.bind(this)
    this.handleSelectbirthDate = this.handleSelectbirthDate.bind(this)
    this.onDrop = this.onDrop.bind(this)
  }

  onDrop(event) {
    event.preventDefault()

    const files = event.dataTransfer.files
    this.setState({
      files: this.state.files.concat(files),
    })
  }

  reset() {
    window.scrollTo(0, 0)
    this.setState(initState)
    this.toggle('1')
    api.get('/api/transaction').then((res) => {
      const alltransactions = res.data
      this.setState({ alltransactions: alltransactions, birthDate: '', transactions: [] })
    })
  }

  onDismiss() {
    this.setState({ visible: false })
  }
  handleSelectTransaction(transaction, evt) {
    if (this.state.transactions.includes(transaction)) {
      this.state.transactions.splice(this.state.transactions.indexOf(transaction), 1)
    } else if (!this.state.transactions.includes(transaction)) {
      this.state.transactions.push(transaction)
    }
  }

  componentWillMount() {
    window.scrollTo(0, 0)
    this.setState(initState)
  }

  componentDidMount() {
    window.scrollTo(0, 0)
    api.get('/api/transaction').then((res) => {
      const alltransactions = res.data
      this.setState({ alltransactions: alltransactions })
    })
  }

  previousPage(evt) {
    this.toggle('1')
  }

  handleCheckUser(evt) {
    this.setState({ user: evt.target.value })
  }
  handleChecked(evt) {
    this.setState({ user: !this.state.user })
  }

  handleChange(evt) {
    this.setState({ [evt.target.name]: evt.target.value })
    let worker = this.state
    this.setState({
      nameerror: !worker.name,
      categoryerror: !worker.category,
      addresserror: !worker.address,
      emailerror: !worker.email,
      transactionerror: worker.user && worker.transactions.length === 0,
      maritulstatuserror: !worker.maritulstatus,
    })
  }

  createMember = async (e) => {
    e.preventDefault()
    this.setState({ issaving: true })
    let loggedUser = JSON.parse(localStorage.getItem(USER_KEY))
    let createdBy = loggedUser._id
    let worker = this.state
    let {
      name,
      email,
      contact,
      category,
      address,
      birthDate,
      maritulstatus,
      user,
      file,
      transactions,
      haspicture,
    } = this.state
    let profile = category
    let userName = this.returnUserName(name)
    let active = user
    let password = defaultPassword
    let picture = !haspicture ? 'blank-user.png' : file
    await api.post('/api/worker', {
      birthDate,
      picture,
      name,
      email,
      contact,
      category,
      maritulstatus,
      address,
      user,
      createdBy,
    })

    if (worker.user) {
      try {
        await api.post('/api/user', {
          userName,
          password,
          name,
          email,
          contact,
          profile,
          createdBy,
          address,
          transactions,
          picture,
          active,
        })
      } catch (error) {}
    }

    this.toggle('4')
    setTimeout(() => {
      this.setState({ visible: false, issaving: false })
    }, 4000)
  }

  returnUserName(words) {
    let n = words.trim().split(' ')
    let lastname = n[n.length - 1]
    let firstlatter = words.substring(0, 1)
    return firstlatter.concat(lastname).toLowerCase()
  }

  handleDrop = async (files) => {
    //Preparando para mandar as imagens
    if (files.length !== 0) {
      this.setState({ uploading: true })
      const data = new FormData()
      data.append(
        'file',
        files[0],
        'PIC_' + new Date().getTime() + '.' + files[0].name.split('.').pop(),
      )
      data.append('filename', 'PIC_' + new Date().getTime() + '.' + files[0].name.split('.').pop())

      const config = {
        headers: {
          'content-type': 'multipart/form-data',
        },
      }

      let resp = await api.post('/api/upload/pictures', data, config)

      this.setState({
        file: resp.data.file,
        uploading: false,
        haspicture: true,
      })
    }
  }

  renderFiles() {
    const { files } = this.state
    return !files.length ? (
      <div color="orange">Fotografia</div>
    ) : (
      files.map((file) => <image key={file.name} src={file.preview} size="small" id="photo" />)
    )
  }

  handleSelectbirthDate(date) {
    this.setState({ birthDate: date, birtherror: !date })
  }

  nextPage(evt) {
    evt.preventDefault()
    if (this.state.name && this.state.category && this.state.email && this.state.address) {
      this.setState({
        nameerror: false,
        categoryerror: false,
        emailerror: false,
        addresserror: false,
        maritulstatuserror: false,
      })
      if (this.state.user) {
        this.toggle('2')
      } else {
        this.toggle('3')
      }
    } else {
      this.setState({
        nameerror: !this.state.name,
        categoryerror: !this.state.category,
        addresserror: !this.state.address,
        emailerror: !this.state.email,
        maritulstatuserror: !this.state.maritulstatus,
      })
    }
  }
  toggle(tab) {
    this.setState({
      activeTab: tab,
    })
  }

  nextPage2() {
    this.toggle('3')
  }

  tabPane() {
    return (
      <>
        <TabPane tabId="1">
          <div class="container">
            <div class="row">
              <div class="col-2">
                <Loader
                  show={this.state.uploading}
                  message={spinner}
                  hideContentOnLoad={true}
                  backgroundStyle={{ color: 'white' }}
                  messageStyle={{ margin: 'auto', padding: '10px' }}
                >
                  <Card>
                    <di id="photo">
                      <img
                        alt="Fotografia"
                        src={
                          !this.state.file
                            ? `${baseURL}/blank-user.png`
                            : `${baseURL}/${this.state.file}`
                        }
                        style={{ height: '12em', width: '100%', 'background-size': 'cover' }}
                      />
                    </di>
                  </Card>{' '}
                </Loader>
                <Button size="sm" style={{ width: '100%' }}>
                  {' '}
                  <ReactDropzone
                    multiple={true}
                    onDrop={this.handleDrop.bind(this)}
                    accept="image/*"
                  >
                    {({ getRootProps, getInputProps }) => (
                      <div {...getRootProps()}>
                        <input {...getInputProps()} />
                        Carregar Fotografia
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
                        <Label htmlFor="nf-email">Nome Completo</Label>
                        <Input
                          type="text"
                          onChange={this.handleChange}
                          name="name"
                          value={this.state.name}
                          placeholder="Introduza o nome.."
                          required
                        />
                        <span>
                          {this.state.nameerror ? (
                            <div className="required">Por favor introduza o nome</div>
                          ) : null}
                        </span>
                      </FormGroup>

                      <FormGroup>
                        <Label htmlFor="nf-email">Data de Nascimento</Label>
                        <Input
                          type="date"
                          name="birthDate"
                          onChange={this.handleChange}
                          placeholder="Seleccione a Data de Nascimento.."
                        />
                        <span>
                          {this.state.birtherror ? (
                            <div className="required">
                              Por favor seleccione a data de nascimento
                            </div>
                          ) : null}
                        </span>
                      </FormGroup>

                      <FormGroup>
                        <Label htmlFor="nf-email">Estado Civil</Label>
                        <Input type="select" name="maritulstatus" onChange={this.handleChange}>
                          <option value={this.state.maritulstatus}>
                            {this.state.maritulstatus}
                          </option>
                          {options.map((maritulstatus, index) => (
                            <option value={maritulstatus.value} key={index}>
                              {maritulstatus.text}
                            </option>
                          ))}
                        </Input>
                        <span>
                          {this.state.maritulstatuserror ? (
                            <div className="required">Por favor seleccione o Estado Civil</div>
                          ) : null}
                        </span>
                      </FormGroup>

                      <FormGroup className="pr-1">
                        <Label htmlFor="exampleInputEmail2" className="pr-1">
                          Email
                        </Label>
                        <Input
                          type="email"
                          onChange={this.handleChange}
                          name="email"
                          value={this.state.email}
                          placeholder="jane.doe@example.com"
                        />
                        <span>
                          {this.state.emailerror ? (
                            <div className="required">Por favor informe o email</div>
                          ) : null}
                        </span>
                      </FormGroup>
                      <FormGroup className="pr-1">
                        <Label htmlFor="exampleInputEmail2" className="pr-1">
                          Contacto
                        </Label>
                        <Input
                          type="text"
                          name="contact"
                          onChange={this.handleChange}
                          value={this.state.contact}
                          placeholder="(XXX) XXXXXXXX"
                        />
                      </FormGroup>
                      <FormGroup className="pr-1">
                        <Label htmlFor="exampleInputEmail2" className="pr-1">
                          Endereço
                        </Label>
                        <Input
                          type="textarea"
                          rows="2"
                          onChange={this.handleChange}
                          name="address"
                          value={this.state.address}
                          placeholder="Av. Exemplo1, Rua ex2, Casa nr. x"
                        />
                        <span>
                          {this.state.addresserror ? (
                            <div className="required">Por favor informe o Endereço</div>
                          ) : null}
                        </span>
                      </FormGroup>
                      <FormGroup>
                        <Label htmlFor="nf-email">Função</Label>
                        <Input
                          type="select"
                          name="category"
                          id="category"
                          onChange={this.handleChange}
                        >
                          <option value={this.state.category}>{this.state.category}</option>
                          {categories.map((category, index) => (
                            <option value={category.value} key={index}>
                              {category.text}
                            </option>
                          ))}
                        </Input>
                        <span>
                          {this.state.categoryerror ? (
                            <div className="required">Por favor seleccione a Função</div>
                          ) : null}
                        </span>
                      </FormGroup>
                      <FormGroup className="pr-1">
                        <Col xs="11" md="9">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            onClick={this.handleChecked}
                            name="user"
                            value={this.state.user}
                          />
                          É utilizador do Sistema?
                        </Col>
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
          <Card>
            <CardBody>
              <Form action="" method="post">
                <Row>
                  <Col xs="12">
                    <Table responsive hover size="sm" striped lg={4}>
                      <thead>
                        <tr>
                          <th></th>
                          <th>Transações a que tem acesso</th>
                        </tr>
                      </thead>
                      <tbody>
                        {this.state.alltransactions.map((transaction, index) => (
                          <tr key={index} color="green">
                            <td>
                              <Col xs="2" md="9">
                                <Input
                                  className="form-check-input"
                                  type="checkbox"
                                  name="transaction"
                                  value={transaction.code}
                                  onChange={this.handleSelectTransaction.bind(this, transaction)}
                                />
                              </Col>{' '}
                            </td>
                            <td>{transaction.description}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </Col>
                </Row>
              </Form>
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
                <Button type="submit" size="sm" onClick={this.nextPage2.bind(this)} color="primary">
                  {' '}
                  Próximo <i className="fa fa-chevron-circle-right"></i>
                </Button>
              </span>{' '}
              <span>
                {' '}
                <Button type="reset" onClick={this.reset.bind(this)} size="sm" color="danger">
                  <i className="fa fa-ban"></i> Cancelar
                </Button>
              </span>{' '}
            </CardFooter>
          </Card>
        </TabPane>
        <TabPane tabId="3">
          <div class="container">
            <div class="row">
              <div class="col-2">
                <Card>
                  <di id="photo">
                    <img
                      alt="Fotografia"
                      src={
                        !this.state.file
                          ? `${baseURL}/blank_user.png`
                          : `${baseURL}/${this.state.file}`
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
                        <Label htmlFor="nf-email">{this.state.name}</Label>
                      </div>
                    </div>
                    <div>
                      <div className="details">
                        <strong>Data de Nascimento: </strong>
                        <Label htmlFor="nf-email">{this.state.birthDate}</Label>
                      </div>
                    </div>
                    <div>
                      <div className="details">
                        <strong>Estado Civil: </strong>
                        <Label htmlFor="nf-email">{this.state.maritulstatus}</Label>
                      </div>
                    </div>

                    <div>
                      <div className="details">
                        <strong>Email: </strong>
                        <Label htmlFor="nf-email">{this.state.email}</Label>
                      </div>
                    </div>

                    <div>
                      <div className="details">
                        <strong>Contacto: </strong>
                        <Label htmlFor="nf-email">{this.state.contact}</Label>
                      </div>
                    </div>
                    <div>
                      <div className="details">
                        <strong>Endereço: </strong>
                        <Label htmlFor="nf-email">{this.state.address}</Label>
                      </div>
                    </div>

                    <div>
                      <div className="details">
                        <strong>Função: </strong>
                        <Label htmlFor="nf-email">{this.state.category}</Label>
                      </div>
                    </div>
                    <div className="grouping">
                      <Table responsive size="sm" lg={4}>
                        <thead>
                          <tr>
                            <th>Transações a que tem acesso</th>
                          </tr>
                        </thead>
                        <tbody>
                          {this.state.transactions.map((transaction, index) => (
                            <tr key={index} color="green">
                              <td>{transaction.description}</td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>{' '}
                    </div>
                  </CardBody>
                  <CardFooter>
                    <span>
                      <Button
                        type="submit"
                        size="sm"
                        onClick={
                          this.state.user
                            ? this.toggle.bind(this, '2')
                            : this.toggle.bind(this, '1')
                        }
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
                        onClick={this.createMember.bind(this)}
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

        <TabPane tabId="4">
          <Alert color="success" isOpen={this.state.visible} toggle={this.onDismiss.bind(this)}>
            Operação Realizada com sucesso!
          </Alert>
          <div class="container">
            <div class="row">
              <div class="col-2">
                <Card>
                  <di id="photo">
                    <img
                      alt="Fotografia"
                      src={
                        !this.state.file
                          ? `${baseURL}/blank_user.png`
                          : `${baseURL}/${this.state.file}`
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
                        <Label htmlFor="nf-email">{this.state.name}</Label>
                      </div>
                    </div>
                    <div>
                      <div className="details">
                        <strong>Data de Nascimento: </strong>
                        <Label htmlFor="nf-email">{this.state.birthDate}</Label>
                      </div>
                    </div>
                    <div>
                      <div className="details">
                        <strong>Estado Civil: </strong>
                        <Label htmlFor="nf-email">{this.state.maritulstatus}</Label>
                      </div>
                    </div>

                    <div>
                      <div className="details">
                        <strong>Email: </strong>
                        <Label htmlFor="nf-email">{this.state.email}</Label>
                      </div>
                    </div>

                    <div>
                      <div className="details">
                        <strong>Contacto: </strong>
                        <Label htmlFor="nf-email">{this.state.contact}</Label>
                      </div>
                    </div>
                    <div>
                      <div className="details">
                        <strong>Endereço: </strong>
                        <Label htmlFor="nf-email">{this.state.address}</Label>
                      </div>
                    </div>

                    <div>
                      <div className="details">
                        <strong>Função: </strong>
                        <Label htmlFor="nf-email">{this.state.category}</Label>
                      </div>
                    </div>
                    <div className="grouping">
                      <Table responsive size="sm" lg={4}>
                        <thead>
                          <tr>
                            <th>Transações a que tem acesso</th>
                          </tr>
                        </thead>
                        <tbody>
                          {this.state.transactions.map((transaction, index) => (
                            <tr key={index} color="green">
                              <td>{transaction.description}</td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>{' '}
                    </div>
                  </CardBody>
                  <CardFooter>
                    <Button type="submit" size="sm" onClick={this.reset.bind(this)} color="primary">
                      {' '}
                      Cadastrar outro membro{' '}
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
                <NavLink active={this.state.activeTab === '1'}>Dados Pessoais</NavLink>
              </NavItem>
              <NavItem>
                <NavLink active={this.state.activeTab === '2'}>Dados de Acesso</NavLink>
              </NavItem>
              <NavItem>
                <NavLink active={this.state.activeTab === '3'}>Confirmar</NavLink>
              </NavItem>

              <NavItem>
                <NavLink active={this.state.activeTab === '4'}>
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
