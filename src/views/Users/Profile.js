import React, { Component } from 'react'
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Row,
  Label,
  Button,
  FormGroup,
  Form,
  Alert,
  Input,
} from 'reactstrap'
import { USER_KEY } from '../../services/auth'
import ReactDropzone from 'react-dropzone'
import api, { baseURL } from '../../services/api'

class WorkerDetails extends Component {
  constructor(props) {
    super(props)
    this.state = {
      user: {},
      file: {},
      oldpassword: '',
      newpassword: '',
      confirmpassword: '',
      newmsg: '',
      oldmsg: '',
      visible: false,
      issaving: false,
      confirmerror: false,
      updatepassword: false,
      oldrror: false,
      newerror: false,
      confirmerror: false,
    }
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange(evt) {
    this.setState({ [evt.target.name]: evt.target.value })
  }
  handleDrop = async (files) => {
    //Preparando para mandar as imagens
    if (files.length !== 0) {
      const data = new FormData()
      data.append('file', files[0])
      data.append('filename', files[0].name)

      const config = {
        headers: {
          'content-type': 'multipart/form-data',
        },
      }

      let resp = await api.post('/api/upload/pictures', data, config)

      this.setState({
        file: resp.data.file,
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

  componentWillMount() {
    this.setState({ user: JSON.parse(localStorage.getItem(USER_KEY)) })
  }

  changePassword() {
    this.setState({ updatepassword: true })
  }

  confirm = async (e) => {
    e.preventDefault()
    if (!this.state.oldpassword) {
      this.setState({
        oldrror: true,
        oldmsg: 'Por favor informe a Password antiga',
      })
    } else if (!this.state.newpassword) {
      this.setState({
        newerror: true,
        oldrror: false,
        newmsg: 'Por favor informe a nova Password ',
      })
    } else if (!this.state.confirmpassword) {
      this.setState({
        confirmerror: true,
        newerror: false,
        newmsg: '',
        confirmmsg: 'Por favor confirme a nova Password ',
      })
    } else if (this.state.confirmpassword !== this.state.newpassword) {
      this.setState({
        confirmerror: true,
        confirmmsg: 'As passwords não coinscidem',
      })
    } else {
      try {
        let userName = this.state.user.userName
        let password = this.state.oldpassword
        const response = await api.post('/api/auth', { userName, password })

        try {
          let password = this.state.newpassword
          await api.put('/api/user/password/', { userName, password })
          this.setState({
            confirmerror: false,
            newerror: false,
            oldrror: false,
            updatepassword: false,
            visible: true,
            issaving: true,
          })

          setTimeout(() => {
            this.setState({ visible: false, issaving: false })
          }, 4000)
        } catch (error) {
          this.setState({
            oldmsg: 'Erro ao gravar password',
            oldrror: true,
            confirmerror: false,
          })
        }
      } catch (err) {
        this.setState({
          oldmsg: 'A password antiga não está corecta!',
          oldrror: true,
          confirmerror: false,
        })
      }
    }
  }

  onDismiss() {
    this.setState({ visible: false })
  }

  cancel() {
    this.setState({ updatepassword: false })
  }

  render() {
    return (
      <div classNam3e="animated fadeIn">
        <Row>
          <Col lg={12}>
            <Card>
              <CardHeader>
                <i className="icon-info pr-1"></i>Muita Paz, <strong>{this.state.user.name}</strong>
              </CardHeader>
              <CardBody>
                <Alert
                  color="success"
                  isOpen={this.state.visible}
                  toggle={this.onDismiss.bind(this)}
                >
                  Password alterada com sucesso!
                </Alert>

                <div class="container">
                  <div class="row">
                    <div class="col-2">
                      <Card>
                        <di id="photo">
                          <img
                            alt="Fotografia"
                            src={
                              !this.state.file.name
                                ? `${baseURL}/public/files/pictures/${this.state.user.picture}`
                                : `${baseURL}/public/files/pictures/${this.state.file}`
                            }
                            style={{ height: '12em', width: '100%', 'background-size': 'cover' }}
                          />
                        </di>
                      </Card>

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
                              Trocar Fotografia
                            </div>
                          )}
                        </ReactDropzone>
                      </Button>
                    </div>
                    <div class="col-10">
                      <Card>
                        <CardBody>
                          <div>
                            <div className="details">
                              <strong>Nome Completo: </strong>
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
                              <Label htmlFor="nf-email">{this.state.user.contact}</Label>
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
                              <strong>Perfil: </strong>
                              <Label htmlFor="nf-email">{this.state.user.profile}</Label>
                            </div>
                          </div>
                          <hr></hr>

                          {!this.state.updatepassword ? (
                            <Row>
                              <Col xs={2}>
                                <div>
                                  <div className="details">
                                    <strong>
                                      Password:
                                      <Label htmlFor="nf-email">********</Label>{' '}
                                    </strong>{' '}
                                  </div>
                                </div>
                              </Col>
                              <Col>
                                <Button onClick={this.changePassword.bind(this)}>
                                  Alterar Password
                                </Button>{' '}
                              </Col>
                            </Row>
                          ) : (
                            <Form className="form-horizontal">
                              <FormGroup row>
                                <Col md="3">
                                  <Label htmlFor="hf-email">Password Antiga</Label>
                                </Col>
                                <Col xs="12" md="9">
                                  <Input
                                    type="password"
                                    id="hf-email"
                                    onChange={this.handleChange}
                                    value={this.state.oldpassword}
                                    name="oldpassword"
                                    placeholder="Introduza Password antiga"
                                    autoComplete="email"
                                  />
                                  <span>
                                    {this.state.oldrror ? (
                                      <div className="required">{this.state.oldmsg}</div>
                                    ) : null}
                                  </span>
                                </Col>
                              </FormGroup>
                              <FormGroup row>
                                <Col md="3">
                                  <Label htmlFor="hf-password">Nova Password</Label>
                                </Col>
                                <Col xs="12" md="9">
                                  <Input
                                    type="password"
                                    id="hf-password"
                                    onChange={this.handleChange}
                                    value={this.state.newpassword}
                                    name="newpassword"
                                    placeholder="Introduza nova Password"
                                    autoComplete="current-password"
                                  />
                                  <span>
                                    {this.state.newerror ? (
                                      <div className="required">{this.state.newmsg}</div>
                                    ) : null}
                                  </span>
                                </Col>
                              </FormGroup>
                              <FormGroup row>
                                <Col md="3">
                                  <Label htmlFor="hf-password">Confirmar Password</Label>
                                </Col>
                                <Col xs="12" md="9">
                                  <Input
                                    type="password"
                                    id="hf-password"
                                    onChange={this.handleChange}
                                    value={this.state.confirmpassword}
                                    name="confirmpassword"
                                    placeholder="Confirme a password"
                                    autoComplete="current-password"
                                  />
                                  <span>
                                    {this.state.confirmerror ? (
                                      <div className="required">{this.state.confirmmsg}</div>
                                    ) : null}
                                  </span>
                                </Col>
                              </FormGroup>
                              <span>
                                {' '}
                                <Button
                                  type="submit"
                                  size="sm"
                                  onClick={this.confirm.bind(this)}
                                  color="primary"
                                >
                                  {' '}
                                  Confirmar <i className="fa fa-chevron-circle-right"></i>
                                </Button>
                              </span>{' '}
                              <span>
                                <Button
                                  onClick={this.cancel.bind(this)}
                                  type="reset"
                                  size="sm"
                                  color="danger"
                                >
                                  <i className="fa fa-ban"></i> Cancelar
                                </Button>
                              </span>
                            </Form>
                          )}
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
