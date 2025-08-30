import React, { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is already logged in
    const userData = localStorage.getItem('userData')
    const authToken = localStorage.getItem('authToken')

    if (userData && authToken) {
      try {
        const parsedUser = JSON.parse(userData)
        setUser(parsedUser)
      } catch (error) {
        console.error('Error parsing user data:', error)
        localStorage.removeItem('userData')
        localStorage.removeItem('authToken')
      }
    }
    setLoading(false)
  }, [])

  const login = (userData, token) => {
    localStorage.setItem('userData', JSON.stringify(userData))
    localStorage.setItem('authToken', token)
    setUser(userData)
  }

  const logout = () => {
    localStorage.removeItem('userData')
    localStorage.removeItem('authToken')
    setUser(null)
  }

  const hasRole = (requiredRole) => {
    if (!user) return false

    // Admin and superadmin have access to everything
    if (user.profile === 'admin' || user.profile === 'superadmin') {
      return true
    }

    // Check specific role
    return user.profile === requiredRole
  }

    const canAccess = (resource) => {
    if (!user) return false

    const { profile } = user

    // Admin and superadmin have access to everything
    if (profile === 'admin' || profile === 'superadmin') {
      return true
    }

    // Role-based access control
    switch (resource) {
      case 'dashboard':
        return profile === 'admin' || profile === 'superadmin'
      case 'subscriptions':
        return profile === 'admin' || profile === 'superadmin' || profile === 'funcionario' || profile === 'worker'
      case 'users':
        return profile === 'admin' || profile === 'superadmin' || profile === 'funcionario' || profile === 'worker'
      case 'videos':
        return profile === 'admin' || profile === 'superadmin' || profile === 'funcionario' || profile === 'worker'
      case 'upload':
        return profile === 'admin' || profile === 'superadmin' || profile === 'sineasta'
      case 'my-videos':
        return profile === 'sineasta'
      default:
        return false
    }
  }

  const canPerformActions = (resource) => {
    if (!user) return false

    const { profile } = user

    // Admin and superadmin can perform all actions
    if (profile === 'admin' || profile === 'superadmin') {
      return true
    }

    // Sineasta can perform actions on their own videos
    if (profile === 'sineasta' && resource === 'my-videos') {
      return true
    }

    // Funcionario is read-only on all resources
    if (profile === 'funcionario') {
      return false
    }

    return false
  }

  const value = {
    user,
    loading,
    login,
    logout,
    hasRole,
    canAccess,
    canPerformActions,
    isAuthenticated: !!user
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
