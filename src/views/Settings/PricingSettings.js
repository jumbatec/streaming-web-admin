import React, { useEffect, useState } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CForm,
  CFormLabel,
  CFormInput,
  CButton,
  CAlert,
  CSpinner,
} from '@coreui/react'
import api from '../../services/api'

const PLAN_LABELS = {
  monthly: 'Plano Ilimitado (mensal)',
  'per-movie': 'Plano Por Filme',
}

const PricingSettings = () => {
  const [pricing, setPricing] = useState({
    monthly: { amount: '', currency: 'MT' },
    'per-movie': { amount: '', currency: 'MT' },
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(null)
  const [message, setMessage] = useState(null)

  useEffect(() => {
    api
      .get('/pricing')
      .then((res) => {
        setPricing(res.data)
        setLoading(false)
      })
      .catch(() => {
        setMessage({ color: 'danger', text: 'Não foi possível carregar os preços.' })
        setLoading(false)
      })
  }, [])

  const handleAmountChange = (planId, value) => {
    setPricing((prev) => ({ ...prev, [planId]: { ...prev[planId], amount: value } }))
  }

  const handleSave = async (planId) => {
    setSaving(planId)
    setMessage(null)
    try {
      const token = localStorage.getItem('authToken')
      const res = await api.put(
        `/pricing/${planId}`,
        { amount: Number(pricing[planId].amount), currency: pricing[planId].currency },
        { headers: { Authorization: `Bearer ${token}` } },
      )
      setPricing((prev) => ({ ...prev, [planId]: { amount: res.data.amount, currency: res.data.currency } }))
      setMessage({ color: 'success', text: `Preço do ${PLAN_LABELS[planId]} atualizado com sucesso.` })
    } catch (error) {
      setMessage({
        color: 'danger',
        text: error.response?.data?.error || 'Erro ao guardar o preço.',
      })
    } finally {
      setSaving(null)
    }
  }

  if (loading) {
    return (
      <CRow>
        <CCol className="d-flex justify-content-center py-5">
          <CSpinner color="primary" />
        </CCol>
      </CRow>
    )
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard>
          <CCardHeader>
            <strong>Preços dos Planos</strong>
            <div className="small text-body-secondary mt-1">
              Estes valores são usados diretamente no checkout do site (mimplay.com) - alterar aqui
              atualiza o preço para todos os novos pagamentos imediatamente.
            </div>
          </CCardHeader>
          <CCardBody>
            {message && <CAlert color={message.color}>{message.text}</CAlert>}
            {Object.keys(PLAN_LABELS).map((planId) => (
              <CForm key={planId} className="row align-items-end mb-4">
                <CCol md={4}>
                  <CFormLabel>{PLAN_LABELS[planId]}</CFormLabel>
                  <CFormInput
                    type="number"
                    min="0"
                    step="1"
                    value={pricing[planId]?.amount ?? ''}
                    onChange={(e) => handleAmountChange(planId, e.target.value)}
                  />
                </CCol>
                <CCol md={2}>
                  <CFormLabel>Moeda</CFormLabel>
                  <CFormInput type="text" value={pricing[planId]?.currency || 'MT'} disabled />
                </CCol>
                <CCol md={2}>
                  <CButton color="primary" onClick={() => handleSave(planId)} disabled={saving === planId}>
                    {saving === planId ? 'A guardar...' : 'Guardar'}
                  </CButton>
                </CCol>
              </CForm>
            ))}
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default PricingSettings
