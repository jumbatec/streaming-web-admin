import React from 'react'
import { useAuth } from '../contexts/AuthContext'
import {
  cilBell,
  cilCalculator,
  cilChartPie,
  cilCursor,
  cilDescription,
  cilDrop,
  cilNotes,
  cilPencil,
  cilPuzzle,
  cilSpeedometer,
  cilStar,
  cilUser,
  cilVideo,
  cilList,
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'
import CIcon from '@coreui/icons-react'

const RoleBasedNav = () => {
  const { user, canAccess } = useAuth()

  if (!user) return []

  const { profile } = user

  // Base navigation items
  const allNavItems = [
    // Dashboard - only for admin and superadmin
    ...(canAccess('dashboard') ? [{
      component: CNavItem,
      name: 'Dashboard',
      to: '/dashboard',
      icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
      badge: {
        color: 'info',
        text: 'NEW',
      },
    }] : []),

    // Videos section
    {
      component: CNavTitle,
      name: 'Videos',
    },

    // List videos - for admin, superadmin, and funcionario
    ...(canAccess('videos') ? [{
      component: CNavItem,
      name: 'Lista de Videos',
      to: '/stream/videos',
      icon: <CIcon icon={cilList} customClassName="nav-icon" />,
    }] : []),

    // Upload videos - for admin, superadmin, and sineasta
    ...(canAccess('upload') ? [{
      component: CNavItem,
      name: 'Carregar Videos',
      to: '/upload/videos',
      icon: <CIcon icon={cilVideo} customClassName="nav-icon" />,
    }] : []),

    // My videos - only for sineasta
    ...(profile === 'sineasta' ? [{
      component: CNavItem,
      name: 'Meus Videos',
      to: '/my-videos',
      icon: <CIcon icon={cilVideo} customClassName="nav-icon" />,
    }] : []),

    // Subscriptions - only for admin and superadmin
    ...(canAccess('subscriptions') ? [{
      component: CNavTitle,
      name: 'Subscrições',
    }, {
      component: CNavItem,
      name: 'Lista de Subscrições',
      to: '/stream/subscriptions',
      icon: <CIcon icon={cilDrop} customClassName="nav-icon" />,
    }] : []),

    // Users - only for admin and superadmin
    ...(canAccess('users') ? [{
      component: CNavTitle,
      name: 'Utilizadores',
    }, {
      component: CNavItem,
      name: 'Gestão de Utilizadores',
      to: '/users',
      icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
    }] : []),
  ]

  return allNavItems
}

export default RoleBasedNav
