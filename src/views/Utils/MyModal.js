import React, { Component } from 'react'
import { Modal, ModalBody, ModalFooter, Button, ModalHeader } from 'reactstrap'

class MyModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      open: this.props.open,
    }
  }

  toggleOpenClose() {
    this.setState({
      open: !this.state.open,
    })
  }
  render() {
    return (
      <Modal
        isOpen={this.props.open}
        toggle={this.toggleOpenClose}
        className={'modal-lg ' + this.props.className}
      >
        <ModalHeader toggle={this.props.togleModal}>{this.props.title}</ModalHeader>
        <ModalBody>
          Esta Operação é ireversível. Tem a certeza que deseja continuar com a Operação?
        </ModalBody>
        <ModalFooter>
          <Button color="danger" onClick={(e) => this.props.inativate}>
            Confirmar
          </Button>{' '}
          <Button color="secondary" onClick={this.toggleOpenClose}>
            Cancelar
          </Button>
        </ModalFooter>
      </Modal>
    )
  }
}

export default MyModal
