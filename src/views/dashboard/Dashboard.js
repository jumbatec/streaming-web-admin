import React, { useState, useEffect } from 'react'
import classNames from 'classnames'

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
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilCloudDownload } from '@coreui/icons'

import WidgetsDropdown from '../widgets/WidgetsDropdown'
import MainChart from './MainChart'
import api, { defaultSucursal } from '../../services/api'

const Dashboard = () => {
  const [latestSubscriptions, setLatestSubscriptions] = useState([])
  const [uniqueUsers, setUniqueUsers] = useState([])
  const [trafficData, setTrafficData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)

        // Fetch subscriptions
        const subscriptionsResponse = await api.get(`/subscriptions/${defaultSucursal}`)
        const subscriptions = subscriptionsResponse.data || []

        // Sort by start date (newest first) and take latest 6
        const sortedSubscriptions = subscriptions
          .sort((a, b) => new Date(b.startDate) - new Date(a.startDate))
          .slice(0, 6)

        setLatestSubscriptions(sortedSubscriptions)

        // Get unique users (utilizadores) without repetition
        const uniqueUserNames = [
          ...new Set(subscriptions.map((sub) => sub.name).filter((name) => name)),
        ]
        setUniqueUsers(uniqueUserNames)

        // Fetch traffic data from June to current month
        const currentDate = new Date()
        const currentYear = currentDate.getFullYear()
        const currentMonth = currentDate.getMonth()

        // Start from June (month 5, since months are 0-indexed)
        const startDate = `${currentYear}-06-01`
        const endDate = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`

        try {
          const trafficResponse = await api.get(
            `/visits/${defaultSucursal}/${startDate}/${endDate}`,
          )
          setTrafficData(trafficResponse.data || [])
        } catch (trafficError) {
          console.error('Error fetching traffic data:', trafficError)
          setTrafficData([])
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const formatPlanName = (plan) => {
    if (!plan) return ''
    const planLower = plan.toLowerCase()
    if (
      planLower.includes('movie') ||
      planLower.includes('per-movie') ||
      planLower === 'per-movie'
    ) {
      return 'Por Filme'
    }
    return 'Ilimitado'
  }

  const getCurrentDateRange = () => {
    const currentDate = new Date()
    const currentYear = currentDate.getFullYear()
    const currentMonth = currentDate.toLocaleString('pt', { month: 'long' })
    return `Junho - ${currentMonth} ${currentYear}`
  }

  const progressExample = [
    {
      title: 'Utilizadores Únicos',
      value: `${uniqueUsers.length} Utilizadores`,
      percent: 40,
      color: 'success',
    },
    { title: 'Visitas', value: `${trafficData.length} Visitas`, percent: 20, color: 'info' },
    {
      title: 'Subscrições Ativas',
      value: `${latestSubscriptions.filter((sub) => sub.status === 'Activa').length} Ativas`,
      percent: 60,
      color: 'warning',
    },
    {
      title: 'Novos Utilizadores',
      value: `${uniqueUsers.length} Utilizadores`,
      percent: 80,
      color: 'danger',
    },
    { title: 'Taxa de Conversão', value: '100%', percent: 100, color: 'primary' },
  ]

  return (
    <>
      <WidgetsDropdown className="mb-4" uniqueUsers={uniqueUsers} />
      <CCard className="mb-4">
        <CCardBody>
          <CRow>
            <CCol sm={5}>
              <h4 id="traffic" className="card-title mb-0">
                Tráfego
              </h4>
              <div className="small text-body-secondary">{getCurrentDateRange()}</div>
            </CCol>
            <CCol sm={7} className="d-none d-md-block">
              <CButton color="primary" className="float-end">
                <CIcon icon={cilCloudDownload} />
              </CButton>
              <CButtonGroup className="float-end me-3">
                {['Dia', 'Mês', 'Ano'].map((value) => (
                  <CButton
                    color="outline-secondary"
                    key={value}
                    className="mx-0"
                    active={value === 'Mês'}
                  >
                    {value}
                  </CButton>
                ))}
              </CButtonGroup>
            </CCol>
          </CRow>
          <MainChart trafficData={trafficData} />
        </CCardBody>
        <CCardFooter>
          <CRow
            xs={{ cols: 1, gutter: 4 }}
            sm={{ cols: 2 }}
            lg={{ cols: 4 }}
            xl={{ cols: 5 }}
            className="mb-2 text-center"
          >
            {progressExample.map((item, index, items) => (
              <CCol
                className={classNames({
                  'd-none d-xl-block': index + 1 === items.length,
                })}
                key={index}
              >
                <div className="text-body-secondary">{item.title}</div>
                <div className="fw-semibold text-truncate">
                  {item.value} ({item.percent}%)
                </div>
                <CProgress thin className="mt-2" color={item.color} value={item.percent} />
              </CCol>
            ))}
          </CRow>
        </CCardFooter>
      </CCard>
      <CRow>
        <CCol xs>
          <CCard className="mb-4">
            <CCardHeader>Subscrições Mais Recentes</CCardHeader>
            <CCardBody>
              {loading ? (
                <div className="text-center">Carregando...</div>
              ) : (
                <CTable align="middle" className="mb-0 border" hover responsive>
                  <CTableHead className="text-nowrap">
                    <CTableRow>
                      <CTableHeaderCell className="bg-body-tertiary">Utilizador</CTableHeaderCell>
                      <CTableHeaderCell className="bg-body-tertiary text-center">
                        Plano
                      </CTableHeaderCell>
                      <CTableHeaderCell className="bg-body-tertiary text-center">
                        Valor
                      </CTableHeaderCell>
                      <CTableHeaderCell className="bg-body-tertiary text-center">
                        Método de Pagamento
                      </CTableHeaderCell>
                      <CTableHeaderCell className="bg-body-tertiary">Estado</CTableHeaderCell>
                      <CTableHeaderCell className="bg-body-tertiary">
                        Data de Início
                      </CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {latestSubscriptions.map((subscription, index) => (
                      <CTableRow key={subscription.id || index}>
                        <CTableDataCell>
                          <div>{subscription.name}</div>
                          <div className="small text-body-secondary text-nowrap">
                            <span>{subscription.email}</span>
                          </div>
                        </CTableDataCell>
                        <CTableDataCell className="text-center">
                          <div className="fw-semibold text-nowrap">
                            {formatPlanName(subscription.plan)}
                          </div>
                        </CTableDataCell>
                        <CTableDataCell className="text-center">
                          <div className="fw-semibold text-nowrap">{subscription.price}.00 MZN</div>
                        </CTableDataCell>
                        <CTableDataCell className="text-center">
                          <div className="fw-semibold text-nowrap">
                            {subscription.paymentMethod || 'N/A'}
                          </div>
                        </CTableDataCell>
                        <CTableDataCell className="text-center">
                          <div className="fw-semibold text-nowrap">{subscription.status}</div>
                        </CTableDataCell>
                        <CTableDataCell>
                          <div className="small text-body-secondary text-nowrap">
                            Subscrição Iniciada
                          </div>
                          <div className="fw-semibold text-nowrap">{subscription.startDate}</div>
                        </CTableDataCell>
                      </CTableRow>
                    ))}
                  </CTableBody>
                </CTable>
              )}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
      <CRow>
        {/* <CCol xs={12} md={6}>
          <CCard className="mb-4">
            <CCardHeader>Utilizadores Únicos Subscritos</CCardHeader>
            <CCardBody>
              {loading ? (
                <div className="text-center">Loading...</div>
              ) : uniqueUsers.length > 0 ? (
                <div className="d-flex flex-wrap gap-2">
                  {uniqueUsers.map((userName, index) => (
                    <span key={index} className="badge bg-primary">
                      {userName}
                    </span>
                  ))}
                </div>
              ) : (
                <div className="text-center text-muted">Nenhum utilizador encontrado</div>
              )}
            </CCardBody>
          </CCard>
        </CCol> */}
        {/* <CCol xs={12} md={6}>
          <CCard className="mb-4">
            <CCardHeader>Estatísticas de Tráfego</CCardHeader>
            <CCardBody>
              <div className="row">
                <div className="col-6">
                  <div className="border-start border-4 border-info ps-3 mb-3">
                    <div className="text-body-secondary">Total de Visitas</div>
                    <div className="fs-5 fw-semibold">{trafficData.length}</div>
                  </div>
                </div>
                <div className="col-6">
                  <div className="border-start border-4 border-success ps-3 mb-3">
                    <div className="text-body-secondary">Utilizadores Únicos</div>
                    <div className="fs-5 fw-semibold">{uniqueUsers.length}</div>
                  </div>
                </div>
              </div>
            </CCardBody>
          </CCard>
        </CCol> */}
      </CRow>
    </>
  )
}

export default Dashboard
