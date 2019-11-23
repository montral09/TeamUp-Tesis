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
            dateFrom: null,
            hoursAvailable      : ["00", '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13'
                                    , '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'],
        };

        this.toggle = this.toggle.bind(this);
        this.save = this.save.bind(this);
    }

    toggle(resData, tokenObj, userData) {
        var dateConverted = this.splitDate (resData.DateFromString)
        var dateFormated = new Date(dateConverted[2], dateConverted[1], dateConverted[0])
        this.setState({
            modal: !this.state.modal,
            resData: resData,
            resDataChanged: resData,
            tokenObj: tokenObj,
            userData: userData,
            dateFrom : dateFormated
        }, () => {
            if((parseInt(resData.HourFrom)) <= 9){
                resData.HourFrom = "0"+(parseInt(resData.HourFrom));
            }
            if((parseInt(resData.HourTo)) <= 9){
                 resData.HourTo = "0"+(parseInt(resData.HourTo));
            }
            this.changeHour({target : {value : resData.HourFrom, id: "hourFromSelect" }})
            this.changeHour({target : {value : resData.HourTo, id: "hourToSelect" }})});
        
    }

    splitDate (date) {
      return  date.split('-')
    }

    handleChange = (e) => {
        this.setState({
                dateFrom: e
        });
    }

    changeHour = (e) => {
        var newHourFromSelect = this.state.resDataChanged.HourFrom;                
        var newHourToSelect = this.state.resDataChanged.HourTo;
        if(e.target.id == "hourFromSelect"){
            newHourFromSelect = e.target.value;
            if(parseInt(newHourFromSelect) >= parseInt(newHourToSelect)  ){
                if((parseInt(newHourFromSelect)+1) <= 9){
                    newHourToSelect = "0"+(parseInt(newHourFromSelect)+1);
                }else{
                    newHourToSelect = parseInt(newHourFromSelect)+1;
                    if(newHourToSelect == 24){
                        newHourToSelect = "00";
                    }
                }
            }
        }else{
            // hourToSelect
            newHourToSelect = e.target.value;
            if(parseInt(newHourToSelect) <= parseInt(newHourFromSelect)){
                if((parseInt(newHourFromSelect)-1) <= 9){
                    newHourFromSelect = "0"+(parseInt(newHourToSelect)-1);
                }else{
                    newHourFromSelect = parseInt(newHourFromSelect)-1;
                    if(newHourFromSelect == 0){
                        newHourFromSelect = "00";
                    }
                }
            }
        }
        if(newHourToSelect == "00" && newHourFromSelect == "00"){
            newHourToSelect = "01";
        };
        this.setState({
            resDataChanged : {
                ...this.state.resDataChanged,
                HourFrom: newHourFromSelect,
                HourTo: newHourToSelect
            }
        });
    }

    calculatePrice = () => {
        console.log('state')
        console.log(this.state)
    }

    increaseQuantityPeople() {
        this.setState({ 
            resDataChanged: {
                ...this.state.resDataChanged,
                People: parseInt(this.state.resDataChanged.People + 1 )}
    })}

    decreaseQuantityPeople() {
        this.setState({ 
            resDataChanged: {
                ...this.state.resDataChanged,
                People: parseInt(this.state.resDataChanged.People - 1 )}
    })}

    changeQuantityPeople(value) {
        if (parseInt(value) > 0) {
            this.setState({ 
                resDataChanged: {
                    ...this.state.resDataChanged,
                    People: parseInt(value)}
        })}
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
                        <Label for="DateFrom" sm={4}>Fecha</Label>
                        <DatePicker placeholderText="Fecha"
                            dateFormat="dd-MM-yyyy"
                            selected= {this.state.dateFrom}
                            minDate={new Date()}
                            onSelect={this.handleChange} //when day is clicked
                            onChange={this.handleChange} //only when value has changed
                        />
                        </FormGroup>
                        {this.state.resData.PlanSelected == 1 ? (
                            <FormGroup>
                            <div className="cart">
                                <div className="add-to-cart d-flex">
                                    <span><b>Hora</b></span>
                                    <div style={{ marginLeft: '8%' }} className="browser">
                                        <select style={{ marginLeft: '8%' }} className="browser" id="hourFromSelect" 
                                            value={this.state.resDataChanged.HourFrom} onChange={this.changeHour} >
                                            {this.state.hoursAvailable.map((hours) => {
                                                return (
                                                    <option key={'hourTo'+hours} value={hours}>{hours}</option>
                                                );
                                            })}
                                        </select>
                                    </div>
                                    <b style={{ marginLeft: '8%' }}>a</b>
                                    <div className="browser">
                                        <select className="browser" id="hourToSelect" 
                                        value={this.state.resDataChanged.HourTo} onChange={this.changeHour} >
                                        {this.state.hoursAvailable.map((hours) => {
                                                return (
                                                    <option key={'hourTo'+hours} value={hours}>{hours}</option>
                                                );
                                            })}
                                        </select>
                                    </div>
                                </div>
                            </div>
                            </FormGroup>
                        ) : (null)}                        
                        <FormGroup row>
                        <Label for="People" sm={8}>Personas</Label>
                        <Col sm={10}>
                        <Input type="text" name="People" id="People"
                                        value={this.state.resDataChanged.People} onChange={this.onChange}/>
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