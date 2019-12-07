import React from 'react';
import {Button, Modal, ModalHeader, ModalBody, ModalFooter,
    Form, FormGroup, Label, Input, Col } from 'reactstrap';
import Login from '../../account/login';
import { connect } from 'react-redux';


class ModalResCustPay extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: false,
            objPaymentDetails : {},
            reservationComment : "",
            isLoading : false,
            buttonIsDisabled: false
        };
        this.toggle = this.toggle.bind(this);
        this.save = this.save.bind(this);
        this.changeModalLoadingState = this.changeModalLoadingState.bind(this);
    }

    toggle(objPaymentDetails) {
        if(!this.state.isLoading){
            this.setState({
                modal: !this.state.modal,
                objPaymentDetails: objPaymentDetails || {}
            });
        }
    }
    changeModalLoadingState(closeModal){
        if(closeModal){
            this.setState({
                modal: !this.state.modal,
                isLoading: !this.state.isLoading,
                buttonIsDisabled: !this.state.buttonIsDisabled
            })
        }else{
            this.setState({
                isLoading: !this.state.isLoading,
                buttonIsDisabled: !this.state.buttonIsDisabled
            })
        }
    }
    save() {
        this.changeModalLoadingState(false);
        this.props.confirmPayment();
    }

    deny(){
        this.changeModalLoadingState(false);
        this.props.rejetPayment();
    }
    render() {
        return (
            <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
                <ModalHeader toggle={this.toggle}>Estado de pago de reserva por parte del cliente</ModalHeader>
                <ModalBody>
                <Form>
                    <FormGroup row>
                        <Label for="reservationPaymentStateText" sm={4}>Estado pago reserva</Label>
                        <Col sm={8}>
                            <Input type="text" name="reservationPaymentStateText" id="reservationPaymentStateText"
                                    value={this.state.objPaymentDetails.reservationPaymentStateText} readOnly/>
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label for="reservationPaymentAmmount" sm={4}>Monto</Label>
                        <Col sm={8}>
                            <Input type="text" name="reservationPaymentAmmount" id="reservationPaymentAmmount"
                                    value={this.state.objPaymentDetails.reservationPaymentAmmount} readOnly/>
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label for="reservationpaymentDate" sm={4}>Fecha de pago</Label>
                        <Col sm={8}>
                            <Input type="text" name="reservationpaymentDate" id="reservationpaymentDate"
                                    value={this.state.objPaymentDetails.reservationpaymentDate} readOnly/>
                        </Col>
                    </FormGroup>
                   
                    {this.state.objPaymentDetails.reservationPaymentState == "PENDING CONFIRMATION" || this.state.objPaymentDetails.reservationPaymentState == "PAID" ? (
                    <>
                        {this.state.objPaymentDetails.paymentDocument ? (
                            <FormGroup row>
                                <Label for="paymentDocument" sm={4}>Documento adjunto por el cliente</Label>
                                <Col sm={8}>
                                    <a href={this.state.objPaymentDetails.paymentDocument} target="_blank">Archivo subido</a>
                                </Col>
                            </FormGroup>
                        ) : (null)}

                        {this.state.objPaymentDetails.paymentComment ? (
                            <FormGroup row>
                                <Label for="paymentComment" sm={6}>Comentario del cliente</Label>
                                <Col sm={12}>
                                    <Input type="textarea" name="paymentComment" id="paymentComment"
                                        value={this.state.objPaymentDetails.paymentComment} readOnly/>
                                </Col>
                            </FormGroup>
                        ) : (null)}
                        {this.state.objPaymentDetails.reservationPaymentState == "PENDING CONFIRMATION" ? (
                            <FormGroup row>
                                <Col sm={12}>
                                El cliente ha confirmado que ha pagado, por favor valide que esto sea así, en caso contrario seleccione el botón rechazar y la confirmación de pago será rechazada.
                                </Col>
                            </FormGroup>
                        ) : (null)}
                        {this.state.objPaymentDetails.reservationPaymentState == "PAID" ? (
                            <FormGroup row>
                                <Col sm={12}>
                                El pago fue confirmado.
                                </Col>
                            </FormGroup>
                        ) : (null)}
                    </>
                    ) : (
                    <FormGroup row>
                        <Col sm={12}>
                            El cliente aún no realizó el pago.
                        </Col>
                    </FormGroup>
                    )}

                </Form>
                </ModalBody>
                <ModalFooter>
                    <Button color="link" onClick={this.toggle} disabled= {this.state.buttonIsDisabled}>Cerrar</Button>
                    {this.state.objPaymentDetails.reservationPaymentState == 'PENDING CONFIRMATION' ? (
                        <>
                        <Button color="red" onClick={this.deny} disabled= {this.state.buttonIsDisabled}>Rechazar
                            &nbsp;&nbsp;
                            {this.state.isLoading &&  
                                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                            }
                        </Button>
                        <Button color="green" onClick={this.save} disabled= {this.state.buttonIsDisabled}>Confirmar
                            &nbsp;&nbsp;
                            {this.state.isLoading &&  
                                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                            }
                        </Button>
                        </>
                    ) : (null)}
                </ModalFooter>
            </Modal>
        );
    }
}

export default ModalResCustPay;
