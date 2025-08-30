import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CAvatar,
  CBadge,
  CDropdown,
  CDropdownDivider,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react'
import {
  cilBell,
  cilCreditCard,
  cilCommentSquare,
  cilEnvelopeOpen,
  cilFile,
  cilLockLocked,
  cilSettings,
  cilTask,
  cilUser,
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'

import avatar8 from './../../assets/images/avatars/1.png'
import { useAuth } from '../../contexts/AuthContext'

const AppHeaderDropdown = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const getProfileLabel = (profile) => {
    switch (profile) {
      case 'admin':
        return 'Administrador'
      case 'superadmin':
        return 'Super Administrador'
      case 'sineasta':
        return 'Sineasta'
      case 'funcionario':
        return 'Funcionário'
      default:
        return profile
    }
  }

  if (!user) {
    return null
  }

  return (
    <CDropdown variant="nav-item">
      <CDropdownToggle placement="bottom-end" className="py-0 pe-0" caret={false}>
        <CAvatar src={avatar8} size="md" />
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end">
        <CDropdownHeader className="bg-body-secondary fw-semibold mb-2">
          {user.name || 'Usuário'}
        </CDropdownHeader>
        <CDropdownItem disabled>
          <CIcon icon={cilUser} className="me-2" />
          {user.email}
        </CDropdownItem>
        <CDropdownItem disabled>
          <CIcon icon={cilSettings} className="me-2" />
          {getProfileLabel(user.profile)}
        </CDropdownItem>
        <CDropdownDivider />
        <CDropdownItem onClick={handleLogout}>
          <CIcon icon={cilLockLocked} className="me-2" />
          Sair
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  )
}

export default AppHeaderDropdown
