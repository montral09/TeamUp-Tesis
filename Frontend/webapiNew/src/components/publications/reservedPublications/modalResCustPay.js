import React from 'react';
import {Button, Modal, ModalHeader, ModalBody, ModalFooter,
    Form, FormGroup, Label, Input, Col } from 'reactstrap';
import { displayErrorMessage, displaySuccessMessage } from '../../../services/common/genericFunctions';
// Multilanguage
import { withTranslate } from 'react-redux-multilingual'

class ModalResCustPay extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: false,
            objPaymentDetails : {},
            paymentComment : "",
            isLoading : false,
            buttonIsDisabled: false
        };
        this.toggle = this.toggle.bind(this);
        this.save = this.save.bind(this);
        this.deny = this.deny.bind(this);
        this.changeModalLoadingState = this.changeModalLoadingState.bind(this);
    }

    // This function will toggle on or off the modal and save the paymentdetails if any
    toggle(objPaymentDetails) {
        if(!this.state.isLoading){
            this.setState({
                modal: !this.state.modal,
                objPaymentDetails: objPaymentDetails || {}
            });
        }
    }
    
    // This function will toggle on or off the modal and also the loading states
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
        var objPaymentDetails = this.state.objPaymentDetails;
        objPaymentDetails.paymentComment = this.state.paymentComment;
        this.props.confirmPayment(this.state.objPaymentDetails);
    }

    deny(){
        this.changeModalLoadingState(false);
        this.props.rejetPayment(this.state.objPaymentDetails);
    }
    
    render() {
        const { translate } = this.props;

        return (
            <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
                <ModalHeader toggle={this.toggle}>{translate('modalResCusPay_header')}</ModalHeader>
                <ModalBody>
                <Form>
                    <FormGroup row>
                        <Label for="reservationPaymentStateText" sm={4}>{translate('myReservedSpacesList_custPay_paymentStatusTxt')}</Label>
                        <Col sm={8}>
                            <Input type="text" name="reservationPaymentStateText" id="reservationPaymentStateText"
                                    value={this.state.objPaymentDetails.reservationPaymentStateText || ""} readOnly/>
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label for="reservationPaymentAmmount" sm={4}>{translate('amount_w')}</Label>
                        <Col sm={8}>
                            <Input type="text" name="reservationPaymentAmmount" id="reservationPaymentAmmount"
                                    value={this.state.objPaymentDetails.reservationPaymentAmmount || ""} readOnly/>
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label for="reservationpaymentDate" sm={4}>{translate('myReservedSpacesList_custPay_paymentDateTxt')}</Label>
                        <Col sm={8}>
                            <Input type="text" name="reservationpaymentDate" id="reservationpaymentDate"
                                    value={this.state.objPaymentDetails.reservationpaymentDate == null ? translate('pending_w') : this.state.objPaymentDetails.reservationpaymentDate} readOnly/>
                        </Col>
                    </FormGroup>
                   
                    {this.state.objPaymentDetails.reservationPaymentState == "PENDING CONFIRMATION" || this.state.objPaymentDetails.reservationPaymentState == "PAID" ? (
                    <>
                        {this.state.objPaymentDetails.paymentDocument ? (
                            <FormGroup row>
                                <Label for="paymentDocument" sm={4}>{translate('modalResCusPay_documentUploadedByCust')}</Label>
                                <Col sm={8}>
                                    <a href={this.state.objPaymentDetails.paymentDocument} target="_blank">LINK</a>
                                </Col>
                            </FormGroup>
                        ) : (null)}

                        {this.state.objPaymentDetails.paymentComment ? (
                            <FormGroup row>
                                <Label for="paymentComment" sm={6}>{translate('modalResCusPay_commentByCust')}</Label>
                                <Col sm={12}>
                                    <Input type="textarea" name="paymentComment" id="paymentComment"
                                        value={this.state.objPaymentDetails.paymentComment || ""} readOnly/>
                                </Col>
                            </FormGroup>
                        ) : (null)}
                        {this.state.objPaymentDetails.reservationPaymentState == "PENDING CONFIRMATION" ? (
                            <FormGroup row>
                                <Col sm={12}>
                                    
                                </Col>
                            </FormGroup>
                        ) : (null)}
                        {this.state.objPaymentDetails.reservationPaymentState == "PAID" ? (
                            <FormGroup row>
                                <Col sm={12}>
                                    {translate('modalResCusPay_txt3')}
                                </Col>
                            </FormGroup>
                        ) : (null)}
                    </>
                    ) : (
                    <FormGroup row>
                        <Col sm={12}>
                            {translate('modalResCusPay_txt4')}
                        </Col>
                    </FormGroup>
                    )}

                </Form>
                </ModalBody>
                <ModalFooter>
                    <Button color="link" onClick={this.toggle} disabled= {this.state.buttonIsDisabled}>{translate('close_w')}</Button>
                    {this.state.objPaymentDetails.reservationPaymentState == 'PENDING CONFIRMATION' ? (
                        <>
                        <Button color="red" onClick={this.deny} disabled= {this.state.buttonIsDisabled}>{translate('reject_w')}
                            &nbsp;&nbsp;
                            {this.state.isLoading &&  
                                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                            }
                        </Button>
                        <Button color="green" onClick={this.save} disabled= {this.state.buttonIsDisabled}>{translate('confirm_w')}
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

export default withTranslate(ModalResCustPay);
