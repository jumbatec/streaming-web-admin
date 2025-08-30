import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Row,
  Table,
  Modal,
  ModalBody,
  ModalFooter,
  Button,
  ModalHeader,
} from 'reactstrap'
import { ClipLoader } from 'react-spinners'
import api, { baseURL, defaultSucursal } from '../../services/api'

import { CButton } from '@coreui/react'

import Pagination from '../Utils/Pagination'
import { useAuth } from '../../contexts/AuthContext'

const elementsPerPage = 4
const spinner = (
  <div className="d-flex justify-content-center">
    <ClipLoader sizeUnit={'px'} size={50} color={'#123abc'} loading={true} />
  </div>
)

// Wrapper component to use hooks in class component
const MyVideosWithAuth = (props) => {
  const { canPerformActions } = useAuth()
  return <MyVideos {...props} canPerformActions={canPerformActions} />
}

class MyVideos extends Component {
  constructor(props) {
    super(props)
    this.state = {
      videos: [],
      total: '',
      open: false,
      video: {},
      curentpage: 1,
      ranges: [],
      processing: false,
    }
  }

  componentDidMount() {
    this.loadvideos(this.state.curentpage)
  }

  toggleFade(v) {
    this.setState({ open: !this.state.open, video: v })
  }

  async inativate(v) {
    await api.delete('/movies/' + v.id + '/' + v.createdAt, { active: 0 })
    let videos = this.state.videos.filter((ev) => ev.id !== v.id)
    this.setState({ videos, open: false })
  }

  toggleOpenClose() {
    this.setState({
      open: !this.state.open,
    })
  }

  previousPageNumber() {
    this.setState({ curentpage: this.state.curentpage - 1 })
    this.loadvideos(this.state.curentpage - 1)
  }

  nextPageNumber() {
    this.setState({ curentpage: this.state.curentpage + 1 })
    this.loadvideos(this.state.curentpage + 1)
  }

  loadvideos(page) {
    this.setState({ processing: true })

    // Get current user from localStorage
    const userData = JSON.parse(localStorage.getItem('userData') || '{}')
    const userId = userData.id

    if (!userId) {
      this.setState({ processing: false })
      return
    }

    // Use the user-specific endpoint
    api.get(`/movies/user/${userId}?sucursalId=${defaultSucursal}`).then((res) => {
      const videos = res.data
      this.setState({
        videos: videos,
        total: videos.length,
        processing: false
      })
    }).catch((error) => {
      console.error('Error loading videos:', error)
      this.setState({ processing: false })
    })
  }

  upateCurentPage(page) {
    this.setState({ curentpage: page })
    this.loadvideos(page)
  }

  render() {
    return (
      <div className="animated fadeIn">
        <Row>
          <Col xl={12}>
            <Card>
              <CardHeader>
                <i className="fa fa-align-justify"></i> Meus Videos{' '}
                <a href="#">
                  <h5 style={{ float: 'right' }}>
                    [{(this.state.curentpage - 1) * elementsPerPage + 1} -{' '}
                    {this.state.curentpage * elementsPerPage <= this.state.total
                      ? this.state.curentpage * elementsPerPage
                      : this.state.total}{' '}
                    de {this.state.total}]
                  </h5>
                </a>
              </CardHeader>
              <CardBody>
                {this.state.processing ? (
                  <div className="text-center p-4">
                    {spinner}
                  </div>
                ) : (
                  <Table responsive hover size="sm">
                    <thead>
                      <tr>
                        <th scope="col"></th>
                        <th scope="col">Título</th>
                        <th scope="col">Categoria</th>
                        <th scope="col">Data de Publicação</th>
                        <th scope="col">Visualizações</th>
                        <th scope="col">Comentários</th>
                        <th scope="col"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.videos.map((video, index) => (
                        <tr key={index}>
                          <th scope="row">
                            <img
                              src={`${video.imageUrl}`}
                              style={{ height: '60px', width: '120px', 'background-size': 'cover' }}
                            />
                          </th>
                          <td>
                            <Link to={`/videos/${video._id ? video._id.toString() : ''}`}>
                              {video.title}
                            </Link>
                          </td>
                          <td>{video.category}</td>
                          <td>{video.createdAt}</td>
                          <td>{video.views}</td>
                          <td>{video.comments?.length}</td>
                          <td>
                            {this.props.canPerformActions && this.props.canPerformActions('my-videos') ? (
                              <CButton
                                as="input"
                                type="button"
                                color="danger"
                                value="Remover"
                                onClick={this.toggleFade.bind(this, video)}
                              />
                            ) : (
                              <span className="text-muted">Apenas Visualização</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                )}
                <Pagination
                  curent={this.state.curentpage}
                  pages={Math.ceil(this.state.total / elementsPerPage)}
                  upateCurentPage={this.upateCurentPage}
                  nextPageNumber={this.nextPageNumber}
                  previousPageNumber={this.previousPageNumber}
                />

                <Modal
                  color="info"
                  isOpen={this.state.open}
                  toggle={this.toggleOpenClose.bind(this)}
                  className={'modal-info ' + this.props.className}
                >
                  <ModalHeader toggle={this.props.toggleOpenClose}>
                    {this.state.video.title}
                  </ModalHeader>
                  <ModalBody>
                    Esta Operação é irreversível. Tem a certeza que deseja remover este Vídeo?
                  </ModalBody>
                  <ModalFooter>
                    <Button color="danger" onClick={this.inativate.bind(this, this.state.video)}>
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

export default MyVideosWithAuth
