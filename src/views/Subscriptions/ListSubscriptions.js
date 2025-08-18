import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardBody, CardHeader, Col, Row, Table } from 'reactstrap';
import { ClipLoader } from 'react-spinners';
import Loader from 'react-loader-advanced';
import api, { baseURL,defaultSucursal } from '../../services/api';
import months from './months'; // Assuming months is an array of {code, desc}

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
} from '@coreui/icons'

// import avatar1 from 'src/assets/images/avatars/1.jpg'
// import avatar2 from 'src/assets/images/avatars/2.jpg'
// import avatar3 from 'src/assets/images/avatars/3.jpg'
// import avatar4 from 'src/assets/images/avatars/4.jpg'
// import avatar5 from 'src/assets/images/avatars/5.jpg'
// import avatar6 from 'src/assets/images/avatars/6.jpg'


import Pagination from '../Utils/Pagination';
const elementsPerPage = 6;
const spinner = <div className='d-flex justify-content-center'><ClipLoader sizeUnit={"px"} size={50} color={'#123abc'} loading={true} /></div>;

function SubscriptionRow(props) {
  const subscription = props.subscription;
  const userLink = `/subscriptions/${subscription.id}`;

  return (
    <tr key={subscription.id}>
      <td><Link to={userLink}>{subscription.name}</Link></td>
      <td>{subscription.email} {subscription.userContact}</td>
      <td>{subscription.contact}</td>
      <td>{subscription.plan}</td>
      <td>{subscription.price}.00 MZN</td>
      <td>{subscription.startDate}</td>
      <td>{subscription.endDate}</td>
      <td>{subscription.status}</td>
      <CButton  type="button" color="danger" value="Cancelar" onClick={()=>{}} />
    </tr>
  );
}

class ListSubscriptions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      subscriptions: [],
      lastdata:[],
      total: '',
      curentpage: 1,
      ranges: [],
      processing: true
    };
  }

  previousPageNumber = () => {
    this.setState({ curentpage: this.state.curentpage - 1 });
    this.loadSubscriptions(this.state.curentpage - 1);
  }

  nextPageNumber = () => {
    this.setState({ curentpage: this.state.curentpage + 1 });
    this.loadSubscriptions(this.state.curentpage + 1);
  }

  loadSubscriptions(page) {
    this.setState({ processing: true });
    if(this.state.lastdata.length>0){
      let paginatedSubscriptions =  this.paginateSubscriptions(this.state.lastdata,page,elementsPerPage);
      this.setState({ subscriptions:paginatedSubscriptions});
    }

    else{
      api.get(`/subscriptions/${defaultSucursal}`)
        .then(res => {
          let paginatedSubscriptions = this.paginateSubscriptions(res.data,page,elementsPerPage);
          console.log(paginatedSubscriptions)
          this.setState({ lastdata: res.data,subscriptions:paginatedSubscriptions, processing: false,total:res.data.length });

        });

    }

  }

  updateCurentPage = (page) => {
    this.setState({ curentpage: page });
    this.loadSubscriptions(page);
  }

  componentDidMount() {
    this.loadSubscriptions(this.state.curentpage);
  }

   paginateSubscriptions(data, currentPage, numberOfElements) {
    // Ensure the currentPage is at least 1
    if (currentPage < 1) currentPage = 1;

    // Calculate the starting index and the ending index for the slice
    const startIndex = (currentPage - 1) * numberOfElements;
    const endIndex = startIndex + numberOfElements;
  console.log('data',data)
    // Return the slice of subscriptions for the current page
    return data.slice(startIndex, endIndex);
  }

  render() {
    return (
      <div className="animated fadeIn">
        <Row>
          <Col xl={12}>
            <Card>
              <CardHeader>
                <i className="fa fa-align-justify"></i> Subscrições
                <h5 style={{ float: 'right' }}>
                  [{(this.state.curentpage - 1) * elementsPerPage + 1} -{' '}
                  {this.state.curentpage * elementsPerPage <= this.state.total ? this.state.curentpage * elementsPerPage : this.state.total} de {this.state.total}]
                </h5>
              </CardHeader>
              <CardBody>
                <Loader show={this.state.processing} message={spinner} backgroundStyle={{ color: 'white' }} messageStyle={{ margin: 'auto', padding: '10px' }}>
                <CTable align="middle" className="mb-0 border" hover responsive striped>
                <CTableHead className="text-nowrap">
                  <CTableRow>
                    <CTableHeaderCell className="bg-body-tertiary text-center">
                      <CIcon icon={cilPeople} />
                    </CTableHeaderCell>
                    {/* <CTableHeaderCell className="bg-body-tertiary">Utilizador</CTableHeaderCell> */}
                    {/* <CTableHeaderCell className="bg-body-tertiary text-center">
                      Pais
                    </CTableHeaderCell> */}
                    <CTableHeaderCell className="bg-body-tertiary text-center">
                      Pagamento
                    </CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary">Data de Inicio</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary">Plano</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary">Valor</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary">Estado</CTableHeaderCell>
                    {/* <CTableHeaderCell className="bg-body-tertiary">Proxima Renovação</CTableHeaderCell> */}
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {this.state.subscriptions?this.state.subscriptions.map((item, index) => (
                    <CTableRow v-for="item in tableItems" key={index}>
                      {/* <CTableDataCell className="text-center">
                        <CAvatar size="md" src='src/assets/images/avatars/6.jpg' status={item.imageUrl} />
                      </CTableDataCell> */}
                      <CTableDataCell>
                        <div>{item.name}</div>
                        <div className="small text-body-secondary text-nowrap">
                          <span>{item.email}</span> | {' '}
                          {item.startDate}
                        </div>
                      </CTableDataCell>
                      {/* <CTableDataCell className="text-center">
                        <CIcon size="xl" icon={cifMz} title='Moçambique' />
                      </CTableDataCell> */}
                      <CTableDataCell className="text-center">
                      <div className="fw-semibold text-nowrap">{item.paymentMethod}</div>
                      </CTableDataCell>
                      <CTableDataCell>
                        <div className="small text-body-secondary text-nowrap">Subscrição Iniciada as:</div>
                        <div className="fw-semibold text-nowrap">{item.startDate}</div>
                      </CTableDataCell>

                      <CTableDataCell className="text-center">
                      <div className="fw-semibold text-nowrap">{item.plan == 'per-movie' ? 'Por Filme' : 'Ilimitado'}</div>
                      </CTableDataCell>

                      <CTableDataCell className="text-center">
                      <div className="fw-semibold text-nowrap">{item.price}.00 MZN</div>
                      </CTableDataCell>

                      <CTableDataCell className="text-center">
                      <div className="fw-semibold text-nowrap">{item.status == 'EXPIRED' ? 'Expirado' : 'Activo'}</div>
                      </CTableDataCell>

                      {/* <CTableDataCell>
                        <div className="small text-body-secondary text-nowrap">Proxima cobrança em:</div>
                        <div className="fw-semibold text-nowrap">{item.endDate}</div>
                      </CTableDataCell> */}
                    </CTableRow>
                  )):null}
                </CTableBody>
              </CTable>









                </Loader>
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
      </div>
    );
  }
}

export default ListSubscriptions;
