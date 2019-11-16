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
            textboxValue : "",
            isLoading : false,
            buttonIsDisabled: false
        };
        this.toggle = this.toggle.bind(this);
        this.save = this.save.bind(this);
        this.changeModalLoadingState = this.changeModalLoadingState.bind(this);
    }

    toggle(summaryObject) {
        this.setState({
            modal: !this.state.modal,
            summaryObject: summaryObject || {}
        });
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
        this.changeModalLoadingState();
        this.props.confirmReservation();
    }

    onChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value
        });
    }
    render() {
        return (
            <span className="d-inline-block mb-2 mr-2">
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
                                <Form>
                                    <FormGroup row>
                                        <Label for="IdPublication" sm={4}>Tipo de reserva</Label>
                                        <Col sm={8}>
                                            <Input type="text" name="IdPublication" id="IdPublication"
                                                    value={this.state.summaryObject.planChosenText} readOnly/>
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
                                                        value="3" readOnly/>
                                            </Col>
                                        </FormGroup>
                                    </>
                                    ) : (null)}
                                    <FormGroup row>
                                        <Label for="IdPublication" sm={4}>Precio final</Label>
                                        <Col sm={8}>
                                            <Input type="text" name="IdPublication" id="IdPublication"
                                                    value={"2500"} readOnly/>
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Label for="textboxValue" sm={2}>Comentario (opcional)</Label>
                                        <Col sm={10}>
                                            <Input type="textarea" name="textboxValue" id="textboxValue"
                                                    value={this.state.textboxValue || ""} onChange={this.onChange}/>
                                        </Col>
                                    </FormGroup>
                                </Form>
                            )}
                    </Form>
                    </ModalBody>
                    {this.props.login_status == 'LOGGED_IN' ? (
                        <ModalFooter>
                            <Button color="link" onClick={this.toggle}>Cancelar</Button>
                            <Button color="primary" onClick={this.save} disabled= {this.state.buttonIsDisabled}>Confirmar
                                &nbsp;&nbsp;
                                {this.state.isLoading &&  
                                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                }
                            </Button>
                        </ModalFooter>
                    ) : (null)}
                </Modal>
            </span>
        );
    }
}

export default ModalSummary;
