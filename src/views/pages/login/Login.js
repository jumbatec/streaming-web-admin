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

const Login = () => {
  const navigate = useNavigate()

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

    // Check for dummy admin login
    // if (formData.email === 'admin@gmail.com' && formData.password === 'admin') {
    //   try {
    //     // Create dummy admin user data
    //     const dummyAdminData = {
    //       id: 'admin-1',
    //       name: 'Administrator',
    //       email: 'admin@gmail.com',
    //       phone: '+258 000 000 000',
    //       isAdmin: true,
    //       role: 'admin',
    //     }

    //     // Store dummy auth data
    //     localStorage.setItem('authToken', 'dummy-admin-token-123')
    //     localStorage.setItem('userEmail', 'admin@gmail.com')
    //     localStorage.setItem('userData', JSON.stringify(dummyAdminData))

    //     // Navigate to dashboard
    //     navigate('/dashboard')
    //     return
    //   } catch (error) {
    //     setError('Erro interno do sistema')
    //     setShowAlert(true)
    //   } finally {
    //     setLoading(false)
    //   }
    //   return
    // }

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

          // Check if user has admin role/flag
          if (!userData.isAdmin && userData.role !== 'admin' && !userData.admin) {
            setError('Acesso negado. Apenas administradores podem acessar este painel.')
            setShowAlert(true)
            setLoading(false)
            return
          }

          // Store auth data for admin user
          localStorage.setItem('authToken', token)
          localStorage.setItem('userEmail', formData.email)

          // Store admin user data
          const adminDataToStore = {
            id: userData.id,
            name: userData.name,
            email: userData.email,
            phone: userData.phone,
            isAdmin: true,
            role: userData.role || 'admin',
          }

          localStorage.setItem('userData', JSON.stringify(adminDataToStore))

          navigate('/dashboard')
        } catch (userError) {
          console.error('Error fetching user details:', userError)
          if (userError.response?.status === 404) {
            setError('Usuário não encontrado ou não tem permissões de administrador.')
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
        setError('Acesso negado. Apenas administradores podem acessar este painel.')
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
                      Entre com as suas credenciais de administrador
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
                        placeholder="Email do administrador"
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

                    {/* Demo/Admin Login Hint */}
                    {/* <div className="text-center mb-3">
                      <small className="text-muted">
                        <CIcon icon={cilUser} className="me-1" />
                        Demo Admin:
                        <CButton
                          variant="ghost"
                          size="sm"
                          className="p-0 ms-1 text-decoration-underline"
                          style={{ fontSize: 'inherit', color: 'inherit' }}
                          onClick={handleDemoFill}
                        >
                          admin@gmail.com / admin
                        </CButton>
                      </small>
                    </div> */}

                    <CRow>
                      <CCol xs={6}>
                        <CButton type="submit" color="primary" className="px-4" disabled={loading}>
                          {loading ? 'Entrando...' : 'Entrar'}
                        </CButton>
                      </CCol>
                      {/* <CCol xs={6} className="text-end">
                        <CButton color="link" className="px-0">
                          Esqueceu a senha?
                        </CButton>
                      </CCol> */}
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
