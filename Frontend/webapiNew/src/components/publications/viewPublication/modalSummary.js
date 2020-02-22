import React from 'react';
import {Button, Modal, ModalHeader, ModalBody, ModalFooter,
    Form, FormGroup, Label, Input, Col } from 'reactstrap';
import Login from '../../account/login';
// Multilanguage
import { withTranslate } from 'react-redux-multilingual'

class ModalSummary extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: false,
            summaryObject : {},
            reservationComment : "",
            isLoading : false,
            buttonIsDisabled: false
        };
    }

    // This function will toggle on or off the modal and save the paymentdetails if any
    toggle = (summaryObject) => {
        if(!this.state.isLoading){
            this.setState({
                modal: !this.state.modal,
                summaryObject: summaryObject || {}
            });
        }
    }

    // This function will toggle on or off the modal and also the loading states
    changeModalLoadingState = (closeModal) =>{
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
    save = () => {
        this.changeModalLoadingState(false);
        this.props.confirmReservation(this.state.reservationComment);
    }
    
    // This function will handle the onchange event from the fields
    onChange = (e) => {
        this.setState({
            'reservationComment': e.target.value
        });
    }

    render() {
        const {translate} = this.props;
        return (
            <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
                <ModalHeader toggle={this.toggle}>{this.props.login_status != 'LOGGED_IN' ? 'Login' : translate('modalReservation_header')}</ModalHeader>
                <ModalBody>
                <Form>
                    {this.props.login_status != 'LOGGED_IN' ? (
                        <div className="main-content  full-width  home">
                            <div className="pattern" >
                                <div>
                                    <div className="row">
                                        <div className="col-md-12 ">
                                            <div className="row">
                                            <Login redirectToMain={false}/>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        ) : (
                        <>
                            <FormGroup row>
                                <Label for="IdPublication" sm={4}>{translate('modalReservation_resType')}</Label>
                                <Col sm={8}>
                                    <Input type="text" name="IdPublication" id="IdPublication"
                                            value={this.state.summaryObject.planChosenText || ""} readOnly/>
                                </Col>
                            </FormGroup>
                            {this.state.summaryObject.planChosenQuantityDescription != "" ? (
                            <FormGroup row>
                                <Label for="IdPublication" sm={4}>{translate('modalReservation_qtyOf')} {this.state.summaryObject.planChosenQuantityDescription}</Label>
                                <Col sm={8}>
                                    <Input type="text" name="IdPublication" id="IdPublication"
                                            value={this.state.summaryObject.quantityPlan || ""} readOnly/>
                                </Col>
                            </FormGroup>
                            ) : (null)}
                            <FormGroup row>
                                <Label for="IdPublication" sm={4}>{translate('modalReservation_value')} {this.state.summaryObject.planChosenText}</Label>
                                <Col sm={8}>
                                    <Input type="text" name="IdPublication" id="IdPublication"
                                            value={this.state.summaryObject.planValue || ""} readOnly/>
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Label for="IdPublication" sm={4}>{translate('modalReservation_reservationDate')}</Label>
                                <Col sm={8}>
                                    <Input type="text" name="IdPublication" id="IdPublication"
                                            value={this.state.summaryObject.date || ""} readOnly/>
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Label for="IdPublication" sm={4}>{translate('modalReservation_qtyOfPeople')}</Label>
                                <Col sm={8}>
                                    <Input type="text" name="IdPublication" id="IdPublication"
                                            value={this.state.summaryObject.quantityPeople || ""} readOnly/>
                                </Col>
                            </FormGroup>
                            {this.state.summaryObject.planChosen == "HourPrice" ? (
                            <>
                                <FormGroup row>
                                    <Label for="IdPublication" sm={4}> {translate('modalReservation_hourRes')} </Label>
                                    <Col sm={8}>
                                        <Input type="text" name="IdPublication" id="IdPublication"
                                                value={translate('from_w')+' '+this.state.summaryObject.hourFromSelect+ ' '+translate('to_w')+' '+this.state.summaryObject.hourToSelect+' hrs'} readOnly/>
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Label for="IdPublication" sm={4}>{translate('modalReservation_hourTot')}</Label>
                                    <Col sm={8}>
                                        <Input type="text" name="IdPublication" id="IdPublication"
                                                value={parseInt(this.state.summaryObject.hourToSelect-this.state.summaryObject.hourFromSelect)} readOnly/>
                                    </Col>
                                </FormGroup>
                            </>
                            ) : (null)}
                            <FormGroup row>
                                <Label for="IdPublication" sm={4}>{translate('modalReservation_finalPrice')} {" U$"}</Label>
                                <Col sm={8}>
                                    <Input type="text" name="IdPublication" id="IdPublication"
                                            value={this.state.summaryObject.totalPrice || ""} readOnly/>
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Label for="textboxValue" sm={6}>{translate('modalReservation_comment')}</Label>
                                <Col sm={12}>
                                    <Input type="textarea" name="textboxValue" id="textboxValue"
                                            value={this.state.reservationComment || ""} onChange={this.onChange}/>
                                </Col>
                                <Col sm={12}>
                                    {translate('modalReservation_msg1')}<br/>
                                    {translate('modalReservation_msg2')}
                                </Col>
                            </FormGroup>
                        </>
                        )}
                </Form>
                </ModalBody>
                {this.props.login_status == 'LOGGED_IN' ? (
                    <ModalFooter>
                        <Button color="link" onClick={this.toggle} disabled= {this.state.buttonIsDisabled}>{translate('cancel_w')}</Button>
                        <Button color="primary" onClick={this.save} disabled= {this.state.buttonIsDisabled}>{translate('confirm_w')}
                            &nbsp;&nbsp;
                            {this.state.isLoading &&  
                                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                            }
                        </Button>
                    </ModalFooter>
                ) : (null)}
            </Modal>
        );
    }
}

export default withTranslate(ModalSummary);
