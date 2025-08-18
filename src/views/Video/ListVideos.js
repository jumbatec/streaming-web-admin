import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardBody, CardHeader, Col, Row, Table,Modal, ModalBody, ModalFooter, Button,ModalHeader} from 'reactstrap';
import categories from './categories';
import {ClipLoader} from 'react-spinners';
import Loader from 'react-loader-advanced';
import api,{baseURL,defaultSucursal} from './../../services/api'

import { CButton } from '@coreui/react'

import Pagination from '.././Utils/Paination'
const elementsPerPage=4;
const spinner=<div className='d-flex justify-content-center'><ClipLoader sizeUnit={"px"} size={50} color={'#123abc'} loading={true}/></div>;
class ListBooks extends Component {

  constructor(props){

    super(props);
    this.state={
      videos:[],
      total:'',
      open:false,
      video:{},
      curentpage:1,
      ranges:[],
      processing:false
    }
      }
      componentDidMount() {
        // api.get('/api/video/count/alll/videos')
        // .then(res => {
        //   this.setState({total:20});
        // })

        this.loadvideos(this.state.curentpage)
      }


      toggleFade=(v) =>{
        this.setState( {open: !this.state.open,video:v})

      }

      inativate = async v => {

        await api.delete("/movies/"+v.id+"/"+v.createdAt,{active:0});
       let videos= this.state.videos.filter(ev=>ev.id!==v.id);
       this.setState({videos,open:false})

      }

      toggleOpenClose=()=> {
        this.setState({
          open: !this.state.open,
        });
      }

      previousPageNumber=()=>{
        this.setState({curentpage:this.state.curentpage-1});
        this.loadvideos(this.state.curentpage-1)
        }

      nextPageNumber=()=>{
          this.setState({curentpage:this.state.curentpage+1});
          this.loadvideos(this.state.curentpage+1)
        }

        loadvideos(page){
          this.setState({processing:true });
          api.get('/movies/'+defaultSucursal)
          .then(res => {
            const videos = res.data;
            this.setState({videos:videos,processing:false });
          })
        }

        upateCurentPage=(page)=>{
          this.setState({curentpage:page});
          this.loadvideos(page)

        }


  render() {
    return (
      <div className="animated fadeIn">
        <Row>
          <Col xl={12}>
            <Card>
              <CardHeader>
                <i className="fa fa-align-justify"></i> Lista de Videos <a href='#'><h5 style={{float:'right'}}>[{(this.state.curentpage-1)*elementsPerPage+1} - {this.state.curentpage*elementsPerPage<=this.state.total?this.state.curentpage*elementsPerPage:this.state.total} de {this.state.total}]</h5></a>
              </CardHeader>
              <CardBody>
              <Loader show={this.state.processing} message={spinner}  backgroundStyle={{color:'white'}} messageStyle={{margin:'auto',padding:'10px'}}>
                <Table responsive hover size="sm" >
                  <thead>
                    <tr>
                    <th scope="col"></th>
                      <th scope="col">Título</th>
                      <th scope="col">Categoria</th>
                      <th scope="col">Data de Publicação</th>
                      <th scope="col">Visualições</th>
                      <th scope="col">Comentários</th>
                      <th scope="col"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.videos.map((video, index) =>
                 <tr key={index}>
                 <th scope="row">
              <img src={`${video.imageUrl}`} style={{height:'60px',width:'120px', "background-size": 'cover'}}  /></th>
              <td><Link to={`/videos/${video._id?video._id.toString():''}`}>{video.title}</Link></td>
              <td>{video.category}</td>
              <td>{video.createdAt}</td>
              <td>{video.views}</td>
              <td>{video.comments?.length}</td>
              <td>
              <CButton as="input" type="button" color="danger" value="Remover" onClick={this.toggleFade.bind(this,video)} />
                </td>

            </tr>
                    )}
                  </tbody>
                </Table></Loader>
                <Pagination curent={this.state.curentpage}
pages={Math.ceil(this.state.total/elementsPerPage)}
upateCurentPage={this.upateCurentPage}
 nextPageNumber={this.nextPageNumber}
  previousPageNumber={this.previousPageNumber}/>

<Modal color='info' isOpen={this.state.open} toggle={this.toggleOpenClose.bind(this)}
  className={'modal-info ' + this.props.className}>
<ModalHeader toggle={this.props.toggleOpenClose}>{this.state.video.title}</ModalHeader>
<ModalBody>
Esta Operação é ireversível. Tem a certeza que deseja remover este Vídeo?
</ModalBody>
<ModalFooter>
<Button color="danger" onClick={this.inativate.bind(this,this.state.video)}>Confirmar</Button>{' '}
<Button color="secondary" onClick={this.toggleOpenClose.bind(this)}>Cancelar</Button>
</ModalFooter>
</Modal>

              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    )
  }
}

export default ListBooks;
