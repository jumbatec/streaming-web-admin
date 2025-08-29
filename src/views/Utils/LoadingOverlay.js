import React from 'react'
import { CSpinner } from '@coreui/react'

const LoadingOverlay = ({ show, message, children, hideContentOnLoad = false, backgroundStyle = {}, messageStyle = {} }) => {
  if (!show) {
    return children
  }

  if (hideContentOnLoad) {
    return (
      <div style={{ position: 'relative', minHeight: '200px' }}>
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            ...backgroundStyle,
          }}
        >
          <div style={{ textAlign: 'center', ...messageStyle }}>
            <CSpinner size="lg" />
            {message && <div className="mt-2">{message}</div>}
          </div>
        </div>
        {children}
      </div>
    )
  }

  return (
    <div style={{ position: 'relative' }}>
      {children}
      {show && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            ...backgroundStyle,
          }}
        >
          <div style={{ textAlign: 'center', ...messageStyle }}>
            <CSpinner size="lg" />
            {message && <div className="mt-2">{message}</div>}
          </div>
        </div>
      )}
    </div>
  )
}

export default LoadingOverlay
