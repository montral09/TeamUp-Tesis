import React from 'react';
import {Button, Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';
import { Form, FormGroup, Label, Input} from 'reactstrap';
import {
    Col
} from 'reactstrap';

import {toast} from 'react-toastify';
import DatePicker from  '../../publications/viewPublication/datePicker';

class ModifyReservationModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: false,
            resData: {},
            resDataChanged: {},
            tokenObj: {},
            userData: {},
            dateFrom: new Date()
        };

        this.toggle = this.toggle.bind(this);
        this.save = this.save.bind(this);
    }

    toggle(resData, tokenObj, userData) {
        this.setState({
            modal: !this.state.modal,
            resData: resData,
            resDataChanged: resData,
            tokenObj: tokenObj,
            userData: userData,
            dateFrom: this.convertDate(resData.DateFrom)
        });
    }

    convertDate(date) {
        var today = new Date(date);
        var dd = today.getDate();
        var mm = today.getMonth() + 1; //January is 0!

        var yyyy = today.getFullYear();
        if (dd < 10) {
            dd = '0' + dd;
        }
        if (mm < 10) {
            mm = '0' + mm;
        }
        var dateConv = yyyy +"-" + mm + "-" + dd;
        return dateConv;
    }

    calculatePrice = () => {
        this.setState({
            resDataChanged: {
              ...this.state.resDataChanged,
              TotalPrice : 123
            }
          })
    }

    save() {
        console.log("save - this.state: ");
        console.log(this.state);
        let {IdReservation, HourFrom, HourTo, TotalPrice} = this.state.resDataChanged;
        let objRes = {
            AccessToken: this.state.tokenObj.accesToken,
            Mail: this.state.userData.Mail,
            IdReservation: IdReservation,
            DateFrom: this.state.dateFrom,
            HourFrom: HourFrom,
            HourTo: HourTo,
            TotalPrice: TotalPrice,            
        }
        console.log ('objres');
        console.log (objRes);
        fetch('https://localhost:44372/api/reservationCustomer', {
            method: 'PUT',
            header: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify(objRes)
        }).then(response => response.json()).then(data => {
            console.log("data:" + JSON.stringify(data));
            if (data.responseCode == "SUCC_RESERVATIONUPDATED") {
                toast.success('Reserva actualizada correctamente ', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
                this.setState({
                    modal: !this.state.modal,
                    resData: this.state.resData,
                    resDataChanged: this.state.resData
                });
                //this.props.updateTable();
            } else if (data.Message) {
                    toast.error('Hubo un error', {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                    });
                }
        }
        ).catch(error => {
            toast.error('Internal error', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            console.log(error);
        }
        )
    }

    onChange = (e) => {
        var valueToUpdate = e.target.value;
        this.setState({
            resDataChanged: {
              ...this.state.resDataChanged,
              [e.target.name] : valueToUpdate
            }
          })
    }

    render() {
        return (
            <span className="d-inline-block mb-2 mr-2">
                <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
                    <ModalHeader toggle={this.toggle}>Cambiar datos de reserva</ModalHeader>
                    <ModalBody>
                    <Form>
                        <FormGroup row>
                            <Label for="DateFrom" sm={4}>Fecha de reserva</Label>
                            <Col sm={8}>
                                <Input type="text" name="DateFrom" id="DateFrom"
                                        value={this.state.dateFrom} onChange={this.onChange}/>
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label for="HourFrom" sm={4}>Hora desde</Label>
                            <Col sm={10}>
                                <Input type="text" name="HourFrom" id="HourFrom"
                                        value={this.state.resDataChanged.HourFrom} onChange={this.onChange}/>
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label for="HourTo" sm={4}>Hora hasta</Label>
                            <Col sm={10}>
                                <Input type="text" name="HourTo" id="HourTo"
                                        value={this.state.resDataChanged.HourTo} onChange={this.onChange}/>
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label for="TotalPrice" sm={8}>Monto</Label>
                            <Col sm={10}>
                                <Input type="text" name="TotalPrice" id="TotalPrice"
                                        value={this.state.resDataChanged.TotalPrice} onChange={this.onChange}/>
                            </Col>
                        </FormGroup>
                        <Button color="link" onClick={this.calculatePrice}>Calcular monto</Button>
                    </Form>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="link" onClick={this.toggle}>Cancel</Button>
                        <Button color="primary" onClick={this.save}>Guardar</Button>
                    </ModalFooter>
                </Modal>
            </span>
        );
    }
}

export default ModifyReservationModal;