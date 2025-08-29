import React, { Component } from 'react'
import { Card, CardBody, CardHeader, Col, Row } from 'reactstrap'

class BookDetails extends Component {
  render() {
    return (
      <div className="animated ">
        <Row>
          <Col lg={12}>
            <Card>
              <CardHeader>
                <strong>
                  <i className="icon-info pr-1"></i>Detalhes do Video: {this.props.match.params.id}
                </strong>
              </CardHeader>
              <CardBody></CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    )
  }
}

export default BookDetails
