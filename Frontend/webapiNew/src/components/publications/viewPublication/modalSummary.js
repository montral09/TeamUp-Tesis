import React from 'react';
import {Button, Modal, ModalHeader, ModalBody, ModalFooter,
    Form, FormGroup, Label, Input, Col } from 'reactstrap';
import Login from '../../account/login';
import { connect } from 'react-redux';


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
        this.toggle = this.toggle.bind(this);
        this.save = this.save.bind(this);
        this.changeModalLoadingState = this.changeModalLoadingState.bind(this);
    }

    toggle(summaryObject) {
        if(!this.state.isLoading){
            this.setState({
                modal: !this.state.modal,
                summaryObject: summaryObject || {}
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
        this.props.confirmReservation(this.state.reservationComment);
    }

    onChange = (e) => {
        this.setState({
            'reservationComment': e.target.value
        });
    }

    render() {
        return (
            <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
                <ModalHeader toggle={this.toggle}>{this.props.login_status != 'LOGGED_IN' ? 'Login' : 'Resumen de reserva'}</ModalHeader>
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
                                <Label for="IdPublication" sm={4}>Tipo de reserva</Label>
                                <Col sm={8}>
                                    <Input type="text" name="IdPublication" id="IdPublication"
                                            value={this.state.summaryObject.planChosenText} readOnly/>
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Label for="IdPublication" sm={4}>Cantidad de {this.state.summaryObject.planChosenQuantityDescription}</Label>
                                <Col sm={8}>
                                    <Input type="text" name="IdPublication" id="IdPublication"
                                            value={this.state.summaryObject.quantityPlan} readOnly/>
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Label for="IdPublication" sm={4}>Valor {this.state.summaryObject.planChosenText}</Label>
                                <Col sm={8}>
                                    <Input type="text" name="IdPublication" id="IdPublication"
                                            value={this.state.summaryObject.planValue} readOnly/>
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Label for="IdPublication" sm={4}>Fecha de reserva</Label>
                                <Col sm={8}>
                                    <Input type="text" name="IdPublication" id="IdPublication"
                                            value={this.state.summaryObject.date} readOnly/>
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Label for="IdPublication" sm={4}>Cantidad de personas</Label>
                                <Col sm={8}>
                                    <Input type="text" name="IdPublication" id="IdPublication"
                                            value={this.state.summaryObject.quantityPeople} readOnly/>
                                </Col>
                            </FormGroup>
                            {this.state.summaryObject.planChosen == "HourPrice" ? (
                            <>
                                <FormGroup row>
                                    <Label for="IdPublication" sm={4}>Hora de reserva</Label>
                                    <Col sm={8}>
                                        <Input type="text" name="IdPublication" id="IdPublication"
                                                value={'Desde '+this.state.summaryObject.hourFromSelect+ ' hasta '+this.state.summaryObject.hourToSelect+' hrs'} readOnly/>
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Label for="IdPublication" sm={4}>Total horas</Label>
                                    <Col sm={8}>
                                        <Input type="text" name="IdPublication" id="IdPublication"
                                                value={parseInt(this.state.summaryObject.hourToSelect-this.state.summaryObject.hourFromSelect)} readOnly/>
                                    </Col>
                                </FormGroup>
                            </>
                            ) : (null)}
                            <FormGroup row>
                                <Label for="IdPublication" sm={4}>Precio final {" U$"}</Label>
                                <Col sm={8}>
                                    <Input type="text" name="IdPublication" id="IdPublication"
                                            value={this.state.summaryObject.totalPrice} readOnly/>
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Label for="textboxValue" sm={6}>Comentario (opcional)</Label>
                                <Col sm={12}>
                                    <Input type="textarea" name="textboxValue" id="textboxValue"
                                            value={this.state.reservationComment || ""} onChange={this.onChange}/>
                                </Col>
                                <Col sm={12}>
                                    Atencion! Este valor esta pendiente de confirmar. <br/>
                                    Va a recibir un correo con los detalles finales y la confirmacion dentro de las proximas 48hrs.
                                </Col>
                            </FormGroup>
                        </>
                        )}
                </Form>
                </ModalBody>
                {this.props.login_status == 'LOGGED_IN' ? (
                    <ModalFooter>
                        <Button color="link" onClick={this.toggle} disabled= {this.state.buttonIsDisabled}>Cancelar</Button>
                        <Button color="primary" onClick={this.save} disabled= {this.state.buttonIsDisabled}>OK
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

export default ModalSummary;
