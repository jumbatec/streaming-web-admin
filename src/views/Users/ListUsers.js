import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardBody, CardHeader, Col, Row, Table } from 'reactstrap'
import { ClipLoader } from 'react-spinners'
import LoadingOverlay from '../Utils/LoadingOverlay'
import api, { baseURL, defaultSucursal } from '../../services/api'

import {
  CAvatar,
  CButton,
  CButtonGroup,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CProgress,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CForm,
  CFormLabel,
  CFormSelect,
  CFormInput,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CAlert,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cilFilter,
  cilPrint,
  cilUser,
  cilCalculator,
  cilPencil,
  cilNotes,
  cilLockLocked,
  cilPeople,
  cilSettings,
  cilDrop,
  cilSpeedometer,
  cilStar,
} from '@coreui/icons'

import Pagination from '../Utils/Pagination'
import { useAuth } from '../../contexts/AuthContext'

const elementsPerPage = 10
const spinner = (
  <div className="d-flex justify-content-center">
    <ClipLoader sizeUnit={'px'} size={50} color={'#123abc'} loading={true} />
  </div>
)

// Wrapper component to use hooks in class component
const ListUsersWithAuth = (props) => {
  const { canPerformActions } = useAuth()
  return <ListUsers {...props} canPerformActions={canPerformActions} />
}

class ListUsers extends Component {
  constructor(props) {
    super(props)
    this.state = {
      users: [],
      lastdata: [],
      filteredData: [],
      total: '',
      curentpage: 1,
      ranges: [],
      processing: false,
      // Filter states
      searchName: '',
      searchContact: '',
      searchStatus: '',
      // Status options
      statusOptions: [
        { value: '', label: 'Todos os Estados' },
        { value: '1', label: 'Ativo' },
        { value: '0', label: 'Inativo' },
      ],
      // Profile options
      profileOptions: [
        { value: '', label: 'Todos os Perfis' },
        { value: 'sineasta', label: 'Sineasta' },
        { value: 'superadmin', label: 'Super Admin' },
        { value: 'funcionario', label: 'Funcionário' },
      ],
      // Create/Edit user modal
      showUserModal: false,
      editingUser: null,
      userForm: {
        firstName: '',
        lastName: '',
        email: '',
        contact: '',
        password: '',
        confirmPassword: '',
        profile: 'sineasta',
      },
      formErrors: {},
      // Other modals
      showDeleteModal: false,
      showResetPasswordModal: false,
      selectedUser: null,
      newPassword: '',
      // Success message
      showSuccessMessage: false,
      successMessage: '',
    }

    // Bind methods
    this.handleSearchNameChange = this.handleSearchNameChange.bind(this)
    this.handleSearchContactChange = this.handleSearchContactChange.bind(this)
    this.handleSearchStatusChange = this.handleSearchStatusChange.bind(this)
    this.clearFilters = this.clearFilters.bind(this)
    this.applyFilters = this.applyFilters.bind(this)
    this.openCreateUserModal = this.openCreateUserModal.bind(this)
    this.closeUserModal = this.closeUserModal.bind(this)
    this.handleUserFormChange = this.handleUserFormChange.bind(this)
    this.handleUserSubmit = this.handleUserSubmit.bind(this)
    this.openEditUserModal = this.openEditUserModal.bind(this)
    this.openDeleteModal = this.openDeleteModal.bind(this)
    this.closeDeleteModal = this.closeDeleteModal.bind(this)
    this.deleteUser = this.deleteUser.bind(this)
    this.openResetPasswordModal = this.openResetPasswordModal.bind(this)
    this.closeResetPasswordModal = this.closeResetPasswordModal.bind(this)
    this.resetPassword = this.resetPassword.bind(this)
    this.toggleUserStatus = this.toggleUserStatus.bind(this)
  }

  // Filter methods
  handleSearchNameChange(e) {
    this.setState({ searchName: e.target.value, curentpage: 1 }, () => {
      this.applyFilters()
    })
  }

  handleSearchContactChange(e) {
    this.setState({ searchContact: e.target.value, curentpage: 1 }, () => {
      this.applyFilters()
    })
  }

  handleSearchStatusChange(e) {
    this.setState({ searchStatus: e.target.value, curentpage: 1 }, () => {
      this.applyFilters()
    })
  }

  clearFilters() {
    this.setState(
      {
        searchName: '',
        searchContact: '',
        searchStatus: '',
        curentpage: 1,
      },
      () => {
        this.applyFilters()
      },
    )
  }

  applyFilters() {
    const { lastdata, searchName, searchContact, searchStatus } = this.state

    if (lastdata.length === 0) return

    let filtered = lastdata.filter((user) => {
      // Name filter
      if (searchName && searchName !== '') {
        const fullName = `${user.name || ''} ${user.lastname || ''}`.toLowerCase()
        if (!fullName.includes(searchName.toLowerCase())) return false
      }

      // Contact filter
      if (searchContact && searchContact !== '') {
        const contact = `${user.contactprefix || ''} ${user.contact || ''}`.toLowerCase()
        if (!contact.includes(searchContact.toLowerCase())) return false
      }

      // Status filter
      if (searchStatus && searchStatus !== '') {
        if (user.active !== searchStatus) return false
      }

      return true
    })

    this.setState(
      {
        filteredData: filtered,
        total: filtered.length,
        curentpage: 1,
      },
      () => {
        this.loadUsers(1)
      },
    )
  }

  // User modal methods
  openCreateUserModal() {
    this.setState({
      showUserModal: true,
      editingUser: null,
      userForm: {
        firstName: '',
        lastName: '',
        email: '',
        contact: '',
        password: '',
        confirmPassword: '',
        profile: 'sineasta',
      },
      formErrors: {},
    })
  }

  openEditUserModal(user) {
    const [firstName, ...lastNameParts] = (user.name || '').split(' ')
    const lastName = lastNameParts.join(' ')

    this.setState({
      showUserModal: true,
      editingUser: user,
      userForm: {
        firstName: firstName || '',
        lastName: lastName || '',
        email: user.email || '',
        contact: user.contact || '',
        password: '',
        confirmPassword: '',
        profile: user.profile || 'sineasta',
      },
      formErrors: {},
    })
  }

  closeUserModal() {
    this.setState({ showUserModal: false })
  }

  handleUserFormChange(e) {
    const { name, value } = e.target
    this.setState((prevState) => ({
      userForm: {
        ...prevState.userForm,
        [name]: value,
      },
      formErrors: {
        ...prevState.formErrors,
        [name]: '',
      },
    }))
  }

  validateUserForm() {
    const { userForm } = this.state
    const errors = {}

    if (!userForm.firstName.trim()) errors.firstName = 'Nome é obrigatório'
    if (!userForm.lastName.trim()) errors.lastName = 'Sobrenome é obrigatório'
    if (!userForm.email.trim()) errors.email = 'Email é obrigatório'
    if (!userForm.contact.trim()) errors.contact = 'Telefone é obrigatório'
    if (!userForm.profile) errors.profile = 'Perfil é obrigatório'

    // Password validation only for new users
    if (!this.state.editingUser) {
      if (!userForm.password) errors.password = 'Senha é obrigatória'
      if (userForm.password !== userForm.confirmPassword)
        errors.confirmPassword = 'Senhas não coincidem'
    }

    this.setState({ formErrors: errors })
    return Object.keys(errors).length === 0
  }

  async handleUserSubmit(e) {
    e.preventDefault()

    if (!this.validateUserForm()) return

    const { userForm, editingUser } = this.state

    try {
      if (editingUser) {
        // Update existing user
        await api.put(`/users/${editingUser.id}?createdAt=${editingUser.createdAt}`, {
          name: `${userForm.firstName} ${userForm.lastName}`,
          email: userForm.email,
          contact: userForm.contact,
          profile: userForm.profile,
        })
      } else {
        // Create new user
        await api.post('/users', {
          name: `${userForm.firstName} ${userForm.lastName}`,
          email: userForm.email,
          contact: userForm.contact,
          password: userForm.password,
          profile: userForm.profile,
          sucursalId: defaultSucursal,
          active: '1',
        })
      }

      this.closeUserModal()
      // Show success message
      this.showSuccessMessage(editingUser ? 'Utilizador atualizado com sucesso!' : 'Utilizador criado com sucesso!')
      // Force refresh of all data to ensure table updates
      this.refreshUserData()
    } catch (error) {
      console.error('Error saving user:', error)
      // Handle specific errors
      if (error.response?.status === 400) {
        this.setState({
          formErrors: { email: 'Email já está em uso' },
        })
      }
    }
  }

  // Delete user methods
  openDeleteModal(user) {
    this.setState({
      showDeleteModal: true,
      selectedUser: user,
    })
  }

  closeDeleteModal() {
    this.setState({
      showDeleteModal: false,
      selectedUser: null,
    })
  }

  async deleteUser() {
    const { selectedUser } = this.state

    try {
      await api.delete(`/users/${selectedUser.id}?createdAt=${selectedUser.createdAt}`)
      this.closeDeleteModal()
      // Show success message
      this.showSuccessMessage('Utilizador eliminado com sucesso!')
      // Force refresh of all data to ensure table updates
      this.refreshUserData()
    } catch (error) {
      console.error('Error deleting user:', error)
    }
  }

  // Reset password methods
  openResetPasswordModal(user) {
    this.setState({
      showResetPasswordModal: true,
      selectedUser: user,
      newPassword: '',
    })
  }

  closeResetPasswordModal() {
    this.setState({
      showResetPasswordModal: false,
      selectedUser: null,
      newPassword: '',
    })
  }

  async resetPassword() {
    const { selectedUser, newPassword } = this.state

    if (!newPassword || newPassword.length < 6) {
      this.setState({
        formErrors: { password: 'Senha deve ter pelo menos 6 caracteres' },
      })
      return
    }

    try {
      await api.put(`/users/${selectedUser.id}/password?createdAt=${selectedUser.createdAt}`, {
        password: newPassword,
      })
      this.closeResetPasswordModal()
    } catch (error) {
      console.error('Error resetting password:', error)
    }
  }

  async toggleUserStatus(user) {
    try {
      const newStatus = user.active === '1' ? '0' : '1'
      await api.delete(`/users/${user.id}?createdAt=${user.createdAt}`, {
        active: newStatus,

      })
      // Show success message
      this.showSuccessMessage(`Utilizador ${newStatus === '1' ? 'ativado' : 'inativado'} com sucesso!`)
      // Force refresh of all data to ensure table updates
      this.refreshUserData()
    } catch (error) {
      console.error('Error updating user status:', error)
    }
  }

  // Show success message method
  showSuccessMessage(message) {
    this.setState({
      showSuccessMessage: true,
      successMessage: message,
    })

    // Auto-hide after 3 seconds
    setTimeout(() => {
      this.setState({
        showSuccessMessage: false,
        successMessage: '',
      })
    }, 3000)
  }

  // Refresh user data method
  refreshUserData() {
    // Reset to first page and clear all cached data
    this.setState({
      curentpage: 1,
      lastdata: [],
      filteredData: [],
      users: [],
      total: 0,
    }, () => {
      // Load fresh data from the server without applying filters
      this.loadUsers(1)
    })
  }

  // Pagination methods
  previousPageNumber() {
    const newPage = this.state.curentpage - 1
    this.setState({ curentpage: newPage })
    this.loadUsers(newPage)
  }

  nextPageNumber() {
    const newPage = this.state.curentpage + 1
    this.setState({ curentpage: newPage })
    this.loadUsers(newPage)
  }

  loadUsers(page) {
    this.setState({ processing: true })

    // Always fetch fresh data from the server to ensure table is up-to-date
    api
      .get(`/users/${defaultSucursal}`)
      .then((res) => {
        let paginatedUsers = this.paginateUsers(res.data, page, elementsPerPage)
        this.setState(
          {
            lastdata: res.data,
            filteredData: res.data,
            users: paginatedUsers,
            processing: false,
            total: res.data.length,
          }
        )
      })
      .catch((error) => {
        console.error('Error loading users:', error)
        this.setState({ processing: false })
      })
  }

  updateCurentPage(page) {
    this.setState({ curentpage: page })
    this.loadUsers(page)
  }

  componentDidMount() {
    this.loadUsers(this.state.curentpage)
  }

  paginateUsers(data, currentPage, numberOfElements) {
    if (currentPage < 1) currentPage = 1
    const startIndex = (currentPage - 1) * numberOfElements
    const endIndex = startIndex + numberOfElements
    return data.slice(startIndex, endIndex)
  }

  render() {
    const {
      searchName,
      searchContact,
      searchStatus,
      statusOptions,
      profileOptions,
      showUserModal,
      editingUser,
      userForm,
      formErrors,
      showDeleteModal,
      showResetPasswordModal,
      selectedUser,
      newPassword,
      showSuccessMessage,
      successMessage,
    } = this.state

    return (
      <div className="animated fadeIn">
        <Row>
          <Col xl={12}>
            <Card>
              <CardHeader>
                <i className="fa fa-align-justify"></i> Utilizadores
                <h5 style={{ float: 'right' }}>
                  [{(this.state.curentpage - 1) * elementsPerPage + 1} -{' '}
                  {this.state.curentpage * elementsPerPage <= this.state.total
                    ? this.state.curentpage * elementsPerPage
                    : this.state.total}{' '}
                  de {this.state.total}]
                </h5>
              </CardHeader>
              <CardBody>
                {/* Success Message */}
                {showSuccessMessage && (
                  <CAlert color="success" className="mb-3">
                    {successMessage}
                  </CAlert>
                )}

                {/* Filters Section */}
                <div className="mb-4">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h6 className="mb-0">
                      <CIcon icon={cilFilter} className="me-2" />
                      Filtros
                    </h6>
                    {this.props.canPerformActions && this.props.canPerformActions('users') ? (
                      <CButton color="primary" onClick={this.openCreateUserModal}>
                        Novo Utilizador
                      </CButton>
                    ) : null}
                  </div>
                  <Row>
                    <Col md={3}>
                      <CFormLabel>Nome</CFormLabel>
                      <CFormInput
                        type="text"
                        value={searchName}
                        onChange={this.handleSearchNameChange}
                        placeholder="Pesquisar por nome..."
                        className="mb-2"
                      />
                    </Col>
                    <Col md={3}>
                      <CFormLabel>Contacto</CFormLabel>
                      <CFormInput
                        type="text"
                        value={searchContact}
                        onChange={this.handleSearchContactChange}
                        placeholder="Pesquisar por contacto..."
                        className="mb-2"
                      />
                    </Col>
                    <Col md={3}>
                      <CFormLabel>Estado</CFormLabel>
                      <CFormSelect
                        value={searchStatus}
                        onChange={this.handleSearchStatusChange}
                        className="mb-2"
                      >
                        {statusOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </CFormSelect>
                    </Col>
                    <Col md={3} className="d-flex align-items-end">
                      <CButton color="secondary" onClick={this.clearFilters} className="mb-2 w-100">
                        Limpar Filtros
                      </CButton>
                    </Col>
                  </Row>
                </div>

                <LoadingOverlay
                  show={this.state.processing}
                  message={spinner}
                  backgroundStyle={{ color: 'white' }}
                  messageStyle={{ margin: 'auto', padding: '10px' }}
                >
                  <CTable align="middle" className="mb-0 border" hover responsive striped>
                    <CTableHead className="text-nowrap">
                      <CTableRow>
                        <CTableHeaderCell className="bg-body-tertiary">Utilizador</CTableHeaderCell>
                        <CTableHeaderCell className="bg-body-tertiary">Contacto</CTableHeaderCell>
                        <CTableHeaderCell className="bg-body-tertiary">Email</CTableHeaderCell>
                        <CTableHeaderCell className="bg-body-tertiary">Perfil</CTableHeaderCell>
                        <CTableHeaderCell className="bg-body-tertiary">Estado</CTableHeaderCell>
                        <CTableHeaderCell className="bg-body-tertiary text-center">
                          Ações
                        </CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      {this.state.users
                        ? this.state.users.map((user, index) => (
                            <CTableRow key={index}>
                              <CTableDataCell>
                                <div className="d-flex align-items-center">
                                  {/* <CAvatar size="md" src={`${baseURL}/${user.picture}`} className="me-3" /> */}
                                  <div>
                                    <div className="fw-semibold">
                                      {user.name} {user.lastname}
                                    </div>
                                    {/* <div className="small text-body-secondary">
                                  <span className={`badge bg-${user.active === '1' ? 'success' : 'danger'} me-1`}>
                                    {user.active === '1' ? 'Ativo' : 'Inativo'}
                                  </span>
                                </div> */}
                                  </div>
                                </div>
                              </CTableDataCell>
                              <CTableDataCell>
                                <div className="fw-semibold text-nowrap">
                                  <CIcon icon={cilDrop} className="me-1" />
                                  {user.contactprefix} {user.contact}
                                </div>
                              </CTableDataCell>
                              <CTableDataCell>
                                <div className="fw-semibold text-nowrap">
                                  <CIcon icon={cilStar} className="me-1" />
                                  {user.email}
                                </div>
                              </CTableDataCell>
                              <CTableDataCell>
                                <div className="fw-semibold text-nowrap">
                                  <CIcon icon={cilUser} className="me-1" />
                                  {user.profile === 'sineasta'
                                    ? 'Sineasta'
                                    : user.profile === 'superadmin'
                                      ? 'Super Admin'
                                      : user.profile === 'funcionario'
                                        ? 'Funcionário'
                                        : user.profile}
                                </div>
                              </CTableDataCell>
                              <CTableDataCell>
                                <div className="fw-semibold text-nowrap">
                                  <span
                                    className={`badge bg-${user.active === '1' ? 'success' : 'danger'} me-1`}
                                  >
                                    {user.active === '1' ? 'Ativo' : 'Inativo'}
                                  </span>
                                </div>
                              </CTableDataCell>

                              <CTableDataCell className="text-center">
                                <div className="d-flex gap-2 justify-content-center">
                                  {this.props.canPerformActions && this.props.canPerformActions('users') ? (
                                    <>
                                      <a
                                        href="#"
                                        className="btn btn-info btn-sm"
                                        onClick={(e) => {
                                          e.preventDefault()
                                          this.openEditUserModal(user)
                                        }}
                                      >
                                        Editar
                                      </a>
                                      <a
                                        href="#"
                                        className="btn btn-warning btn-sm"
                                        onClick={(e) => {
                                          e.preventDefault()
                                          this.openResetPasswordModal(user)
                                        }}
                                      >
                                        Alterar Senha
                                      </a>
                                      <a
                                        href="#"
                                        className={`btn btn-sm ${user.active === '1' ? 'btn-secondary' : 'btn-success'}`}
                                        onClick={(e) => {
                                          e.preventDefault()
                                          this.toggleUserStatus(user)
                                        }}
                                      >
                                        {user.active === '1' ? 'Inativar' : 'Ativar'}
                                      </a>
                                      <a
                                        href="#"
                                        className="btn btn-danger btn-sm"
                                        onClick={(e) => {
                                          e.preventDefault()
                                          this.openDeleteModal(user)
                                        }}
                                      >
                                        Eliminar
                                      </a>
                                    </>
                                  ) : (
                                    <span className="text-muted"></span>
                                  )}
                                </div>
                              </CTableDataCell>
                            </CTableRow>
                          ))
                        : null}
                    </CTableBody>
                  </CTable>
                                  </LoadingOverlay>

                <Pagination
                  curent={this.state.curentpage}
                  pages={Math.ceil(this.state.total / elementsPerPage)}
                  upateCurentPage={this.updateCurentPage}
                  nextPageNumber={this.nextPageNumber}
                  previousPageNumber={this.previousPageNumber}
                />
              </CardBody>
            </Card>
          </Col>
        </Row>

        {/* Create/Edit User Modal */}
        <CModal visible={showUserModal} onClose={this.closeUserModal} size="lg">
          <CModalHeader onClose={this.closeUserModal}>
            <CModalTitle>{editingUser ? 'Editar Utilizador' : 'Novo Utilizador'}</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <CForm onSubmit={this.handleUserSubmit}>
              <Row>
                <Col md={6}>
                  <CFormLabel>Nome *</CFormLabel>
                  <CFormInput
                    type="text"
                    name="firstName"
                    value={userForm.firstName}
                    onChange={this.handleUserFormChange}
                    className={formErrors.firstName ? 'is-invalid' : ''}
                    placeholder="Primeiro nome"
                  />
                  {formErrors.firstName && (
                    <div className="invalid-feedback">{formErrors.firstName}</div>
                  )}
                </Col>
                <Col md={6}>
                  <CFormLabel>Sobrenome *</CFormLabel>
                  <CFormInput
                    type="text"
                    name="lastName"
                    value={userForm.lastName}
                    onChange={this.handleUserFormChange}
                    className={formErrors.lastName ? 'is-invalid' : ''}
                    placeholder="Último nome"
                  />
                  {formErrors.lastName && (
                    <div className="invalid-feedback">{formErrors.lastName}</div>
                  )}
                </Col>
              </Row>
              <Row className="mt-3">
                <Col md={6}>
                  <CFormLabel>Email *</CFormLabel>
                  <CFormInput
                    type="email"
                    name="email"
                    value={userForm.email}
                    onChange={this.handleUserFormChange}
                    className={formErrors.email ? 'is-invalid' : ''}
                    placeholder="Email"
                  />
                  {formErrors.email && <div className="invalid-feedback">{formErrors.email}</div>}
                </Col>
                <Col md={6}>
                  <CFormLabel>Telefone *</CFormLabel>
                  <CFormInput
                    type="tel"
                    name="contact"
                    value={userForm.contact}
                    onChange={this.handleUserFormChange}
                    className={formErrors.contact ? 'is-invalid' : ''}
                    placeholder="Telefone (9 dígitos)"
                  />
                  {formErrors.contact && (
                    <div className="invalid-feedback">{formErrors.contact}</div>
                  )}
                </Col>
              </Row>
              {!editingUser && (
                <Row className="mt-3">
                  <Col md={6}>
                    <CFormLabel>Senha *</CFormLabel>
                    <CFormInput
                      type="password"
                      name="password"
                      value={userForm.password}
                      onChange={this.handleUserFormChange}
                      className={formErrors.password ? 'is-invalid' : ''}
                      placeholder="Senha"
                    />
                    {formErrors.password && (
                      <div className="invalid-feedback">{formErrors.password}</div>
                    )}
                  </Col>
                  <Col md={6}>
                    <CFormLabel>Confirmar Senha *</CFormLabel>
                    <CFormInput
                      type="password"
                      name="confirmPassword"
                      value={userForm.confirmPassword}
                      onChange={this.handleUserFormChange}
                      className={formErrors.confirmPassword ? 'is-invalid' : ''}
                      placeholder="Confirmar senha"
                    />
                    {formErrors.confirmPassword && (
                      <div className="invalid-feedback">{formErrors.confirmPassword}</div>
                    )}
                  </Col>
                </Row>
              )}
              <Row className="mt-3">
                <Col md={6}>
                  <CFormLabel>Perfil *</CFormLabel>
                  <CFormSelect
                    name="profile"
                    value={userForm.profile}
                    onChange={this.handleUserFormChange}
                    className={formErrors.profile ? 'is-invalid' : ''}
                  >
                    {profileOptions.slice(1).map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </CFormSelect>
                  {formErrors.profile && (
                    <div className="invalid-feedback">{formErrors.profile}</div>
                  )}
                </Col>
              </Row>
            </CForm>
          </CModalBody>
          <CModalFooter>
            <CButton color="secondary" onClick={this.closeUserModal}>
              Cancelar
            </CButton>
            <CButton color="primary" onClick={this.handleUserSubmit}>
              {editingUser ? 'Atualizar' : 'Criar'}
            </CButton>
          </CModalFooter>
        </CModal>

        {/* Delete Confirmation Modal */}
        <CModal visible={showDeleteModal} onClose={this.closeDeleteModal}>
          <CModalHeader onClose={this.closeDeleteModal}>
            <CModalTitle>Confirmar Eliminação</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <p>
              Tem certeza que deseja eliminar o utilizador{' '}
              <strong>
                {selectedUser?.name} {selectedUser?.lastname}
              </strong>
              ?
            </p>
            <p className="text-danger">Esta ação não pode ser desfeita.</p>
          </CModalBody>
          <CModalFooter>
            <CButton color="secondary" onClick={this.closeDeleteModal}>
              Cancelar
            </CButton>
            <CButton color="danger" onClick={this.deleteUser}>
              Eliminar
            </CButton>
          </CModalFooter>
        </CModal>

        {/* Reset Password Modal */}
        <CModal visible={showResetPasswordModal} onClose={this.closeResetPasswordModal}>
          <CModalHeader onClose={this.closeResetPasswordModal}>
            <CModalTitle>Reset Password</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <p>
              Reset password para{' '}
              <strong>
                {selectedUser?.name} {selectedUser?.lastname}
              </strong>
            </p>
            <CFormLabel>Nova Senha</CFormLabel>
            <CFormInput
              type="password"
              value={newPassword}
              onChange={(e) => this.setState({ newPassword: e.target.value })}
              placeholder="Nova senha (mínimo 6 caracteres)"
            />
            {formErrors.password && <div className="invalid-feedback">{formErrors.password}</div>}
          </CModalBody>
          <CModalFooter>
            <CButton color="secondary" onClick={this.closeResetPasswordModal}>
              Cancelar
            </CButton>
            <CButton color="primary" onClick={this.resetPassword}>
              Reset Password
            </CButton>
          </CModalFooter>
        </CModal>
      </div>
    )
  }
}

export default ListUsersWithAuth
