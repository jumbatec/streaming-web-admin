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
import categories from './categories'
import { ClipLoader } from 'react-spinners'
// import Loader from 'react-loader-advanced'
import api, { baseURL, defaultSucursal } from './../../services/api'

import { CButton } from '@coreui/react'

import Pagination from '.././Utils/Paination'
import { useAuth } from '../../contexts/AuthContext'
const elementsPerPage = 4
const spinner = (
  <div className="d-flex justify-content-center">
    <ClipLoader sizeUnit={'px'} size={50} color={'#123abc'} loading={true} />
  </div>
)

// Wrapper component to use hooks in class component
const ListVideosWithAuth = (props) => {
  const { canPerformActions } = useAuth()
  return <ListVideos {...props} canPerformActions={canPerformActions} />
}

class ListVideos extends Component {
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
      // Cover update modal - both orientations can be updated independently,
      // in the same modal, for the same movie.
      coverModalOpen: false,
      coverVideo: null,
      coverFileVertical: null,
      coverPreviewVertical: null,
      coverFileHorizontal: null,
      coverPreviewHorizontal: null,
      coverUploading: false,
      coverError: null,
    }
  }
  componentDidMount() {
    // api.get('/api/video/count/alll/videos')
    // .then(res => {
    //   this.setState({total:20});
    // })

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

  openCoverModal(video) {
    this.setState({
      coverModalOpen: true,
      coverVideo: video,
      coverFileVertical: null,
      coverPreviewVertical: null,
      coverFileHorizontal: null,
      coverPreviewHorizontal: null,
      coverError: null,
    })
  }

  closeCoverModal() {
    this.setState({
      coverModalOpen: false,
      coverVideo: null,
      coverFileVertical: null,
      coverPreviewVertical: null,
      coverFileHorizontal: null,
      coverPreviewHorizontal: null,
      coverError: null,
    })
  }

  handleCoverFileChange(orientation, e) {
    const file = e.target.files && e.target.files[0]
    if (!file) return
    if (orientation === 'vertical') {
      this.setState({ coverFileVertical: file, coverPreviewVertical: URL.createObjectURL(file) })
    } else {
      this.setState({ coverFileHorizontal: file, coverPreviewHorizontal: URL.createObjectURL(file) })
    }
  }

  async uploadCoverFile(file) {
    const data = new FormData()
    data.append('files', file)
    const uploadRes = await api.post('/file-upload/upload-image', data, {
      headers: { 'content-type': 'multipart/form-data' },
    })
    return uploadRes.data[0] // { url, preview }
  }

  async saveCover() {
    const { coverVideo, coverFileVertical, coverFileHorizontal } = this.state

    if (!coverFileVertical && !coverFileHorizontal) {
      this.setState({ coverError: 'Escolhe pelo menos uma imagem primeiro.' })
      return
    }

    this.setState({ coverUploading: true, coverError: null })
    try {
      const updateData = {}
      let previewVertical
      let previewHorizontal

      if (coverFileVertical) {
        const uploaded = await this.uploadCoverFile(coverFileVertical)
        updateData.imageUrl = uploaded.url
        previewVertical = uploaded.preview
      }
      if (coverFileHorizontal) {
        const uploaded = await this.uploadCoverFile(coverFileHorizontal)
        updateData.imageUrlHorizontal = uploaded.url
        previewHorizontal = uploaded.preview
      }

      await api.put(`/movies/${coverVideo.id}/${coverVideo.createdAt}`, updateData)

      const videos = this.state.videos.map((v) => {
        if (v.id !== coverVideo.id) return v
        return {
          ...v,
          imageUrl: previewVertical || v.imageUrl,
          imageUrlHorizontal: previewHorizontal || v.imageUrlHorizontal,
        }
      })

      this.setState({
        videos,
        coverUploading: false,
        coverModalOpen: false,
        coverVideo: null,
        coverFileVertical: null,
        coverPreviewVertical: null,
        coverFileHorizontal: null,
        coverPreviewHorizontal: null,
      })
    } catch (error) {
      console.error('Error updating cover:', error)
      this.setState({ coverUploading: false, coverError: 'Erro ao atualizar a capa. Tenta novamente.' })
    }
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
    api.get('/movies/' + defaultSucursal).then((res) => {
      const videos = res.data
      this.setState({ videos: videos, processing: false })
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
                <i className="fa fa-align-justify"></i> Lista de Videos{' '}
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
                        <th scope="col">Visualições</th>
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
                            {this.props.canPerformActions && this.props.canPerformActions('videos') ? (
                              <div className="d-flex gap-2">
                                <CButton
                                  as="input"
                                  type="button"
                                  color="info"
                                  value="Editar Capa"
                                  onClick={this.openCoverModal.bind(this, video)}
                                />
                                <CButton
                                  as="input"
                                  type="button"
                                  color="danger"
                                  value="Remover"
                                  onClick={this.toggleFade.bind(this, video)}
                                />
                              </div>
                            ) : (
                              <span className="text-muted"></span>
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
                    Esta Operação é ireversível. Tem a certeza que deseja remover este Vídeo?
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

                <Modal
                  isOpen={this.state.coverModalOpen}
                  toggle={this.closeCoverModal.bind(this)}
                >
                  <ModalHeader toggle={this.closeCoverModal.bind(this)}>
                    Atualizar Capas {this.state.coverVideo ? `- ${this.state.coverVideo.title}` : ''}
                  </ModalHeader>
                  <ModalBody>
                    <Row>
                      <Col md={6}>
                        <div className="small text-muted mb-1">
                          Capa Vertical (Próximos Filmes, Filmes Recentes, etc.)
                        </div>
                        <div className="mb-2 text-center">
                          <img
                            src={this.state.coverPreviewVertical || (this.state.coverVideo && this.state.coverVideo.imageUrl)}
                            style={{ maxHeight: '220px', maxWidth: '100%', objectFit: 'contain' }}
                          />
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          className="form-control"
                          onChange={this.handleCoverFileChange.bind(this, 'vertical')}
                        />
                      </Col>
                      <Col md={6}>
                        <div className="small text-muted mb-1">
                          Capa Horizontal (carrossel do início)
                        </div>
                        <div className="mb-2 text-center">
                          <img
                            src={this.state.coverPreviewHorizontal || (this.state.coverVideo && this.state.coverVideo.imageUrlHorizontal)}
                            style={{ maxHeight: '220px', maxWidth: '100%', objectFit: 'contain' }}
                          />
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          className="form-control"
                          onChange={this.handleCoverFileChange.bind(this, 'horizontal')}
                        />
                      </Col>
                    </Row>
                    {this.state.coverError && (
                      <div className="text-danger mt-2">{this.state.coverError}</div>
                    )}
                  </ModalBody>
                  <ModalFooter>
                    <Button
                      color="primary"
                      onClick={this.saveCover.bind(this)}
                      disabled={this.state.coverUploading || (!this.state.coverFileVertical && !this.state.coverFileHorizontal)}
                    >
                      {this.state.coverUploading ? 'A carregar...' : 'Guardar'}
                    </Button>{' '}
                    <Button color="secondary" onClick={this.closeCoverModal.bind(this)}>
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

export default ListVideosWithAuth
