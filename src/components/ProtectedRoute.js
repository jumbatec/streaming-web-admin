import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { CSpinner, CContainer } from '@coreui/react'

const ProtectedRoute = ({ children, requiredResource, fallbackPath = '/login' }) => {
  const { user, loading, canAccess, isAuthenticated } = useAuth()

  if (loading) {
    return (
      <CContainer className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <CSpinner color="primary" />
      </CContainer>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to={fallbackPath} replace />
  }

  if (requiredResource && !canAccess(requiredResource)) {
    // Redirect based on user role
    if (user?.profile === 'sineasta') {
      return <Navigate to="/my-videos" replace />
    } else if (user?.profile === 'funcionario') {
      return <Navigate to="/stream/videos" replace />
    } else {
      return <Navigate to="/dashboard" replace />
    }
  }

  return children
}

export default ProtectedRoute
