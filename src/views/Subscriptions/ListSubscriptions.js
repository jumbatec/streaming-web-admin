import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardBody, CardHeader, Col, Row, Table } from 'reactstrap'
import { ClipLoader } from 'react-spinners'
// import Loader from 'react-loader-advanced'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import api, { baseURL, defaultSucursal } from '../../services/api'
import months from './months'

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
  CForm,
  CFormLabel,
  CFormSelect,
  CFormInput,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cibCcAmex,
  cibCcApplePay,
  cibCcMastercard,
  cibCcPaypal,
  cibCcStripe,
  cibCcVisa,
  cibGoogle,
  cibFacebook,
  cibLinkedin,
  cifBr,
  cifEs,
  cifFr,
  cifIn,
  cifPl,
  cifMz,
  cibTwitter,
  cilCloudDownload,
  cilPeople,
  cilUser,
  cilUserFemale,
  cilFilter,
  cilPrint,
} from '@coreui/icons'

// import avatar1 from 'src/assets/images/avatars/1.jpg'
// import avatar2 from 'src/assets/images/avatars/2.jpg'
// import avatar3 from 'src/assets/images/avatars/3.jpg'
// import avatar4 from 'src/assets/images/avatars/4.jpg'
// import avatar5 from 'src/assets/images/avatars/5.jpg'
// import avatar6 from 'src/assets/images/avatars/6.jpg'

import Pagination from '../Utils/Pagination'
import { useAuth } from '../../contexts/AuthContext'

// Custom styles for the subscription report
const reportStyles = `
  .subscription-report .card {
    border: none;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }

  .subscription-report .table {
    font-size: 0.9rem;
  }

  .subscription-report .table th {
    background-color: #f8f9fa;
    border-color: #dee2e6;
    font-weight: 600;
  }

  .subscription-report .badge {
    font-size: 0.75rem;
    padding: 0.35em 0.65em;
  }

  .subscription-report .bg-light {
    background-color: #f8f9fa !important;
  }

  .subscription-table {
    width: 100% !important;
    table-layout: fixed;
  }

  .subscription-table th,
  .subscription-table td {
    word-wrap: break-word;
    overflow-wrap: break-word;
    white-space: normal;
    padding: 8px 12px;
    vertical-align: middle;
  }

  .subscription-table th {
    font-weight: 600;
    background-color: #f8f9fa;
    border-bottom: 2px solid #dee2e6;
  }

  .subscription-table td {
    border-bottom: 1px solid #dee2e6;
  }

  .subscription-table .table-responsive {
    width: 100%;
    overflow-x: auto;
  }

  .table-container {
    width: 100%;
    overflow-x: auto;
  }

  .btn-disabled-no-filters {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .btn-disabled-no-filters:hover {
    opacity: 0.6;
  }
`

const elementsPerPage = 6
const spinner = (
  <div className="d-flex justify-content-center">
    <ClipLoader sizeUnit={'px'} size={50} color={'#123abc'} loading={true} />
  </div>
)

// Wrapper component to use hooks in class component
const ListSubscriptionsWithAuth = (props) => {
  const { canPerformActions } = useAuth()
  return <ListSubscriptions {...props} canPerformActions={canPerformActions} />
}

function SubscriptionRow(props) {
  const subscription = props.subscription
  const userLink = `/subscriptions/${subscription.id}`

  return (
    <tr key={subscription.id}>
      <td>
        <Link to={userLink}>{subscription.name}</Link>
      </td>
      <td>
        {subscription.email} {subscription.userContact}
      </td>
      <td>{subscription.contact}</td>
      <td>{subscription.plan}</td>
      <td>{subscription.price}.00 MZN</td>
      <td>{subscription.startDate}</td>
      <td>{subscription.endDate}</td>
      <td>{subscription.status}</td>
      <td>
        {props.canPerformActions && props.canPerformActions('subscriptions') ? (
          <CButton type="button" color="danger" value="Cancelar" onClick={() => {}} />
        ) : (
          <span className="text-muted"></span>
        )}
      </td>
    </tr>
  )
}

class ListSubscriptions extends Component {
  constructor(props) {
    super(props)
    this.state = {
      subscriptions: [],
      lastdata: [],
      filteredData: [],
      total: '',
      curentpage: 1,
      ranges: [],
      processing: true,
      // Filter states
      selectedYear: new Date().getFullYear(),
      selectedMonth: '',
      selectedStatus: '',
      startDate: null,
      endDate: null,
      years: this.generateYears(),
      // Status options
      statusOptions: [
        { value: '', label: 'Todos os Estados' },
        { value: 'Activa', label: 'Activo' },
        { value: 'EXPIRED', label: 'Expirado' },
        // { value: 'CANCELLED', label: 'Cancelado' },
        // { value: 'PENDING', label: 'Pendente' }
      ],
      // Report generation state
      generatingReport: false,
      // PDF modal state
      showPdfModal: false,
      pdfUrl: null,
    }

    // Bind methods
    this.handleYearChange = this.handleYearChange.bind(this)
    this.handleMonthChange = this.handleMonthChange.bind(this)
    this.handleStatusChange = this.handleStatusChange.bind(this)
    this.handleDateRangeChange = this.handleDateRangeChange.bind(this)
    this.clearFilters = this.clearFilters.bind(this)
    this.applyFilters = this.applyFilters.bind(this)
    this.generatePDF = this.generatePDF.bind(this)
    this.openPdfModal = this.openPdfModal.bind(this)
    this.closePdfModal = this.closePdfModal.bind(this)
  }

  generateYears() {
    const currentYear = new Date().getFullYear()
    const years = []
    for (let i = currentYear; i >= currentYear - 10; i--) {
      years.push(i)
    }
    return years
  }

  // Filter methods
  handleYearChange(e) {
    this.setState({ selectedYear: e.target.value, curentpage: 1 }, () => {
      this.applyFilters()
    })
  }

  handleMonthChange(e) {
    this.setState({ selectedMonth: e.target.value, curentpage: 1 }, () => {
      this.applyFilters()
    })
  }

  handleStatusChange(e) {
    this.setState({ selectedStatus: e.target.value, curentpage: 1 }, () => {
      this.applyFilters()
    })
  }

  handleDateRangeChange(dates) {
    const [start, end] = dates
    this.setState(
      {
        startDate: start,
        endDate: end,
        curentpage: 1,
      },
      () => {
        this.applyFilters()
      },
    )
  }

  clearFilters() {
    this.setState(
      {
        selectedYear: new Date().getFullYear(),
        selectedMonth: '',
        selectedStatus: '',
        startDate: null,
        endDate: null,
        curentpage: 1,
      },
      () => {
        this.applyFilters()
      },
    )
  }

  applyFilters() {
    const { lastdata, selectedYear, selectedMonth, selectedStatus, startDate, endDate } = this.state

    if (lastdata.length === 0) return

    let filtered = lastdata.filter((subscription) => {
      try {
        // Year filter
        if (selectedYear && selectedYear !== '') {
          const subscriptionYear = new Date(subscription.startDate).getFullYear()
          if (subscriptionYear !== parseInt(selectedYear)) return false
        }

        // Month filter
        if (selectedMonth && selectedMonth !== '') {
          const subscriptionMonth = new Date(subscription.startDate).getMonth() + 1
          if (subscriptionMonth !== parseInt(selectedMonth)) return false
        }

        // Status filter
        if (selectedStatus && selectedStatus !== '') {
          if (subscription.status !== selectedStatus) return false
        }

        // Date range filter
        if (startDate) {
          const start = new Date(startDate)
          const subscriptionStart = new Date(subscription.startDate)
          if (subscriptionStart < start) return false
        }

        if (endDate) {
          const end = new Date(endDate)
          const subscriptionStart = new Date(subscription.startDate)
          if (subscriptionStart > end) return false
        }

        return true
      } catch (error) {
        console.warn('Error filtering subscription:', subscription, error)
        return false
      }
    })

    console.log('Filtering results:', {
      originalCount: lastdata.length,
      filteredCount: filtered.length,
      selectedYear,
      selectedMonth,
      selectedStatus,
      startDate,
      endDate,
    })

    this.setState(
      {
        filteredData: filtered,
        total: filtered.length,
        curentpage: 1,
      },
      () => {
        // Update the subscriptions directly without calling loadSubscriptions to avoid infinite loop
        let paginatedSubscriptions = this.paginateSubscriptions(filtered, 1, elementsPerPage)
        this.setState({ subscriptions: paginatedSubscriptions })
      },
    )
  }

  // Print modal methods
  openPdfModal(pdfUrl) {
    this.setState({
      showPdfModal: true,
      pdfUrl: pdfUrl
    })
  }

  closePdfModal() {
    this.setState({
      showPdfModal: false,
      pdfUrl: null
    })
  }

  // Check if any filters are selected
  hasFiltersSelected() {
    const { startDate, endDate, selectedYear, selectedMonth, selectedStatus } = this.state;
    return startDate || endDate || (selectedYear && selectedYear !== '') || (selectedMonth && selectedMonth !== '') || (selectedStatus && selectedStatus !== '');
  }

    async generatePDF() {
    const { startDate, endDate, selectedYear, selectedMonth, selectedStatus } = this.state;

    // Check if at least one filter is selected
    if (!startDate && !endDate && (!selectedYear || selectedYear === '') && (!selectedMonth || selectedMonth === '') && (!selectedStatus || selectedStatus === '')) {
      alert('Por favor, selecione pelo menos um filtro para gerar o relatório.');
      return;
    }

    this.setState({ generatingReport: true });

    try {
      const params = {};

      if (startDate) params.startDate = startDate.toISOString().split('T')[0];
      if (endDate) params.endDate = endDate.toISOString().split('T')[0];
      if (selectedYear) params.selectedYear = selectedYear;
      if (selectedMonth) params.selectedMonth = selectedMonth;
      if (selectedStatus) params.selectedStatus = selectedStatus;

      const response = await api.get(`/subscriptions/report/${defaultSucursal}`, { params });

      // Open PDF modal
      if (response.data.pdf) {
        this.openPdfModal(response.data.pdf);
      }

      this.setState({ generatingReport: false });
    } catch (error) {
      console.error('Error generating report:', error);
      alert('Erro ao gerar relatório. Tente novamente.');
      this.setState({ generatingReport: false });
    }
  }

  previousPageNumber() {
    const newPage = this.state.curentpage - 1
    this.setState({ curentpage: newPage })
    this.loadSubscriptions(newPage)
  }

  nextPageNumber() {
    const newPage = this.state.curentpage + 1
    this.setState({ curentpage: newPage })
    this.loadSubscriptions(newPage)
  }

  loadSubscriptions(page) {
    this.setState({ processing: true })

    // If we already have data, just paginate the filtered data
    if (this.state.lastdata.length > 0) {
      const dataToPaginate =
        this.state.filteredData.length > 0 ? this.state.filteredData : this.state.lastdata
      let paginatedSubscriptions = this.paginateSubscriptions(dataToPaginate, page, elementsPerPage)
      this.setState({ subscriptions: paginatedSubscriptions, processing: false })
    } else {
      // First time loading data
      api.get(`/subscriptions/${defaultSucursal}`).then((res) => {
        let paginatedSubscriptions = this.paginateSubscriptions(res.data, page, elementsPerPage)
        console.log(paginatedSubscriptions)
        this.setState(
          {
            lastdata: res.data,
            filteredData: res.data,
            subscriptions: paginatedSubscriptions,
            processing: false,
            total: res.data.length,
          },
          () => {
            // Apply initial filters after data is loaded
            this.applyFilters()
          },
        )
      })
    }
  }

  updateCurentPage(page) {
    this.setState({ curentpage: page })
    this.loadSubscriptions(page)
  }

  componentDidMount() {
    this.loadSubscriptions(this.state.curentpage)
  }

  paginateSubscriptions(data, currentPage, numberOfElements) {
    // Ensure the currentPage is at least 1
    if (currentPage < 1) currentPage = 1

    // Calculate the starting index and the ending index for the slice
    const startIndex = (currentPage - 1) * numberOfElements
    const endIndex = startIndex + numberOfElements
    console.log('data', data)
    // Return the slice of subscriptions for the current page
    return data.slice(startIndex, endIndex)
  }

  render() {
    const {
      selectedYear,
      selectedMonth,
      selectedStatus,
      startDate,
      endDate,
      years,
      statusOptions,
      generatingReport,
      showPdfModal,
      pdfUrl,
    } = this.state

    return (
      <div className="animated fadeIn">
        <style>{reportStyles}</style>
        <Row>
          <Col xl={12}>
            <Card>
              <CardHeader>
                <i className="fa fa-align-justify"></i> Subscrições
                <h5 style={{ float: 'right' }}>
                  [{(this.state.curentpage - 1) * elementsPerPage + 1} -{' '}
                  {this.state.curentpage * elementsPerPage <= this.state.total
                    ? this.state.curentpage * elementsPerPage
                    : this.state.total}{' '}
                  de {this.state.total}]
                </h5>
              </CardHeader>
              <CardBody>
                {/* Filters Section */}
                <div className="mb-4">
                  <h6 className="mb-3">
                    <CIcon icon={cilFilter} className="me-2" />
                    Filtros
                  </h6>
                  <Row>
                    <Col md={2}>
                      <CFormLabel>Ano</CFormLabel>
                      <CFormSelect
                        value={selectedYear}
                        onChange={this.handleYearChange}
                        className="mb-2"
                      >
                        {years.map((year) => (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        ))}
                      </CFormSelect>
                    </Col>
                    <Col md={2}>
                      <CFormLabel>Mês</CFormLabel>
                      <CFormSelect
                        value={selectedMonth}
                        onChange={this.handleMonthChange}
                        className="mb-2"
                      >
                        <option value="">Todos os Meses</option>
                        {months.map((month) => (
                          <option key={month.code} value={month.code}>
                            {month.desc}
                          </option>
                        ))}
                      </CFormSelect>
                    </Col>
                    <Col md={2}>
                      <CFormLabel>Estado</CFormLabel>
                      <CFormSelect
                        value={selectedStatus}
                        onChange={this.handleStatusChange}
                        className="mb-2"
                      >
                        {statusOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </CFormSelect>
                    </Col>
                    <Col md={3}>
                      <CFormLabel>Data</CFormLabel>
                      <div className="d-flex align-items-center">
                        <DatePicker
                          selectsRange={true}
                          startDate={startDate}
                          endDate={endDate}
                          onChange={this.handleDateRangeChange}
                          className="form-control mb-2"
                          placeholderText="Selecione período"
                          dateFormat="dd/MM/yyyy"
                          isClearable={true}
                          style={{ height: '38px', width: '100%' }}
                          showTwoMonthPicker={true}
                          monthsShown={2}
                        />
                      </div>
                    </Col>
                    <Col md={3} className="d-flex align-items-end gap-2">
                      <CButton color="secondary" onClick={this.clearFilters} className="mb-2">
                        Limpar
                      </CButton>
                                            <CButton
                        color="primary"
                        onClick={this.generatePDF}
                        disabled={generatingReport || !this.hasFiltersSelected()}
                        className={`mb-2 ${!this.hasFiltersSelected() ? 'btn-disabled-no-filters' : ''}`}
                        title={!this.hasFiltersSelected() ? 'Selecione pelo menos um filtro para gerar o relatório' : ''}
                      >
                        {generatingReport ? (
                          <>
                            <ClipLoader size={16} color="white" className="me-2" />
                            Gerando...
                          </>
                        ) : (
                          <>
                            <CIcon icon={cilPrint} className="me-1" />
                            Imprimir
                          </>
                        )}
                      </CButton>
                    </Col>
                  </Row>
                </div>

                {this.state.processing ? (
                  <div className="text-center p-4">
                    {spinner}
                  </div>
                ) : (
                  <div className="table-container">
                    <CTable align="middle" className="mb-0 border w-100 subscription-table" hover responsive striped style={{ tableLayout: 'fixed', width: '100%' }}>
                    <CTableHead className="text-nowrap">
                      <CTableRow>
                        <CTableHeaderCell className="bg-body-tertiary" style={{ width: '20%' }}>Utilizador</CTableHeaderCell>
                        <CTableHeaderCell className="bg-body-tertiary text-center" style={{ width: '12%' }}>
                          Contacto
                        </CTableHeaderCell>
                        <CTableHeaderCell className="bg-body-tertiary text-center" style={{ width: '12%' }}>
                          Pagamento
                        </CTableHeaderCell>
                        <CTableHeaderCell className="bg-body-tertiary" style={{ width: '15%' }}>
                          Data de Inicio
                        </CTableHeaderCell>
                        <CTableHeaderCell className="bg-body-tertiary" style={{ width: '10%' }}>Plano</CTableHeaderCell>
                        <CTableHeaderCell className="bg-body-tertiary" style={{ width: '10%' }}>Valor</CTableHeaderCell>
                        <CTableHeaderCell className="bg-body-tertiary" style={{ width: '12%' }}>Estado</CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      {this.state.subscriptions
                        ? this.state.subscriptions.map((item, index) => (
                            <CTableRow v-for="item in tableItems" key={index}>
                              {/* <CTableDataCell className="text-center">
                        <CAvatar size="md" src='src/assets/images/avatars/6.jpg' status={item.imageUrl} />
                      </CTableDataCell> */}
                              <CTableDataCell>
                                <div>{item.name}</div>
                                <div className="small text-body-secondary text-nowrap">
                                  <span>{item.email}</span> | {item.startDate}
                                </div>
                              </CTableDataCell>
                              <CTableDataCell className="text-center">
                                <div className="fw-semibold text-nowrap">{item.contact}</div>
                              </CTableDataCell>
                              {/* <CTableDataCell className="text-center">
                        <CIcon size="xl" icon={cifMz} title='Moçambique' />
                      </CTableHeaderCell> */}
                              <CTableDataCell className="text-center">
                                <div className="fw-semibold text-nowrap">{item.paymentMethod}</div>
                              </CTableDataCell>
                              <CTableDataCell>
                                <div className="small text-body-secondary text-nowrap">
                                  Subscrição Iniciada as:
                                </div>
                                <div className="fw-semibold text-nowrap">{item.startDate}</div>
                              </CTableDataCell>

                              <CTableDataCell className="text-center">
                                <div className="fw-semibold text-nowrap">
                                  {item.plan == 'per-movie' ? 'Por Filme' : 'Ilimitado'}
                                </div>
                              </CTableDataCell>

                              <CTableDataCell className="text-center">
                                <div className="fw-semibold text-nowrap">{item.price}.00 MZN</div>
                              </CTableDataCell>

                              <CTableDataCell className="text-center">
                                <div className="fw-semibold text-nowrap">
                                  {item.status === 'EXPIRED'
                                    ? 'Expirado'
                                    : item.status === 'ACTIVE'
                                      ? 'Activo'
                                      : item.status === 'CANCELLED'
                                        ? 'Cancelado'
                                        : item.status === 'PENDING'
                                          ? 'Pendente'
                                          : item.status || 'Desconhecido'}
                                </div>
                              </CTableDataCell>

                              {/* <CTableDataCell>
                        <div className="small text-body-secondary text-nowrap">Proxima cobrança em:</div>
                        <div className="fw-semibold text-nowrap">{item.endDate}</div>
                      </CTableDataCell> */}
                            </CTableRow>
                          ))
                        : null}
                    </CTableBody>
                  </CTable>
                    </div>
                )}
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



                        {/* PDF Modal */}
        <CModal visible={showPdfModal} onClose={this.closePdfModal} size="xl" fullscreen>
          <CModalHeader onClose={this.closePdfModal}>
            <CModalTitle>
              <CIcon icon={cilPrint} className="me-2" />
              Relatório de Subscrições
            </CModalTitle>
          </CModalHeader>
          <CModalBody className="p-0">
            {pdfUrl && (
              <iframe
                src={pdfUrl}
                width="100%"
                height="100%"
                style={{ border: 'none', minHeight: '80vh' }}
                title="Relatório PDF"
              />
            )}
          </CModalBody>
          <CModalFooter>
            <CButton color="secondary" onClick={this.closePdfModal}>
              Fechar
            </CButton>
          </CModalFooter>
        </CModal>
      </div>
    )
  }
}

export default ListSubscriptionsWithAuth
