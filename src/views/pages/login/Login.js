import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
  CAlert,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'

// Import API and constants
import api from '../../../services/api'
import { SUCURSAL_ID } from '../../Utils/constants'
import { useAuth } from '../../../contexts/AuthContext'

const Login = () => {
  const navigate = useNavigate()
  const { login } = useAuth()

  // Form state
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  // UI state
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showAlert, setShowAlert] = useState(false)

  // Handle quick fill for demo admin credentials
  const handleDemoFill = () => {
    setFormData({
      email: 'admin@gmail.com',
      password: 'admin',
    })
    // Clear any existing errors
    setError('')
    setShowAlert(false)
  }

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Clear error when user starts typing
    if (error) {
      setError('')
      setShowAlert(false)
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault()

    // Basic validation
    if (!formData.email.trim() || !formData.password.trim()) {
      setError('Por favor, preencha todos os campos')
      setShowAlert(true)
      return
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setError('Por favor, insira um email válido')
      setShowAlert(true)
      return
    }

    setLoading(true)

    // Regular API login for admin users
    try {
      const response = await api.post('/users/auth/login', {
        email: formData.email,
        password: formData.password,
      })

      if (response.data.token || response.data.toke) {
        // Backend might return 'toke' based on userController
        const token = response.data.token || response.data.toke

        // Try to get user details to check admin role
        try {
          const userResponse = await api.get(
            `/users/email/${encodeURIComponent(formData.email)}?sucursalId=${SUCURSAL_ID}`,
          )
          const userData = userResponse.data

          // Check if user has admin role/flag or is a valid user type
          const validProfiles = ['admin', 'superadmin', 'sineasta', 'funcionario']
          console.log(userData)
          if (!validProfiles.includes(userData.profile) && !validProfiles.includes(userData.role)) {
            setError('Acesso negado. Perfil de usuário não autorizado.')
            setShowAlert(true)
            setLoading(false)
            return
          }

          // Store auth data using the auth context
          const userDataToStore = {
            id: userData.id,
            name: userData.name,
            email: userData.email,
            phone: userData.phone || userData.contact,
            profile: userData.profile,
            isAdmin: userData.profile === 'admin' || userData.profile === 'superadmin',
          }

          login(userDataToStore, token)

          // Redirect based on user profile
          if (userData.profile === 'sineasta') {
            navigate('/my-videos')
          } else if (userData.profile === 'funcionario') {
            navigate('/stream/videos')
          } else {
            navigate('/dashboard')
          }
        } catch (userError) {
          console.error('Error fetching user details:', userError)
          if (userError.response?.status === 404) {
            setError('Usuário não encontrado ou não tem permissões válidas.')
          } else {
            setError('Erro ao verificar permissões de usuário.')
          }
          setShowAlert(true)
        }
      } else {
        setError('Credenciais inválidas. Verifique seu email e senha.')
        setShowAlert(true)
      }
    } catch (loginError) {
      console.error('Login error:', loginError)

      if (loginError.response?.status === 400) {
        setError('Credenciais inválidas. Verifique seu email e senha.')
      } else if (loginError.response?.status === 404) {
        setError('Usuário não encontrado.')
      } else if (loginError.response?.status === 403) {
        setError('Acesso negado. Perfil de usuário não autorizado.')
      } else {
        setError('Erro ao fazer login. Tente novamente.')
      }
      setShowAlert(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={4}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm onSubmit={handleLogin}>
                    <h1>Painel Administrativo</h1>
                    <p className="text-body-secondary">
                      Entre com as suas credenciais
                    </p>

                    {/* Error Alert */}
                    {showAlert && error && (
                      <CAlert
                        color="danger"
                        dismissible
                        onClose={() => setShowAlert(false)}
                        className="mb-3"
                      >
                        <div className="d-flex align-items-center">
                          <CIcon icon={cilLockLocked} className="me-2" />
                          <span>{error}</span>
                        </div>
                      </CAlert>
                    )}

                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        type="email"
                        name="email"
                        placeholder="Email"
                        autoComplete="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        name="password"
                        placeholder="Senha"
                        autoComplete="current-password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                      />
                    </CInputGroup>

                    <CRow>
                      <CCol xs={6}>
                        <CButton type="submit" color="primary" className="px-4" disabled={loading}>
                          {loading ? 'Entrando...' : 'Entrar'}
                        </CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login
