import React from 'react';
import {Button, Modal, ModalHeader, ModalBody, ModalFooter,
    Form, FormGroup, Label, Input, Col } from 'reactstrap';

import {toast} from 'react-toastify';


class UpdateCommissionConfirmationModal extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            modal: false,
            admTokenObj: {},
            adminData: {},
            id: 0,
            price: 0,
            isLoading : false,
            buttonIsDisabled: false
        };
        this.toggleElementUpdate = this.toggleElementUpdate.bind(this);
        this.saveUpdate = this.saveUpdate.bind(this);
    }

    toggleElementUpdate(admTokenObj, adminData, id) {        
        this.setState({
            id: id,
            modal: !this.state.modal,
            admTokenObj: admTokenObj,
            adminData: adminData,
        });        
    }

    checkRequiredInputs() {
        let returnValue = false;
        let message = "";
        if (!this.state.price ) {
                message='Por favor ingrese la comisión';
                returnValue = true;
                toast.error(message, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
        }
        return returnValue;
    }
            
    saveUpdate() {
        if (!this.checkRequiredInputs()) {
            console.log("save - this.state: ");
            console.log(this.state);
            this.setState({
                isLoading: !this.state.isLoading, buttonIsDisabled: !this.state.buttonIsDisabled
            });        
            let {Mail} = this.state.adminData;
            let obj = {
                Mail: Mail,
                AccessToken: this.state.admTokenObj.accesToken,
                IdReservation: this.state.id,
                Price: this.state.price
            }
            console.log(obj);
            fetch('https://localhost:44372/api/reservationPaymentAdmin', {
                method: 'POST',
                header: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify(obj)
            }).then(response => response.json()).then(data => {
                console.log("data:" + JSON.stringify(data));
                if (data.responseCode == "SUCC_COMMISSIONUPDATED") {
                    toast.success('Pago actualizado correctamente ', {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                    });
                    this.setState({
                        modal: !this.state.modal,isLoading: !this.state.isLoading, buttonIsDisabled: !this.state.buttonIsDisabled
                    });
                    this.props.updateTable();
                } else{
                    toast.error('Hubo un error', {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                    });
                    this.setState({
                        isLoading: !this.state.isLoading, buttonIsDisabled: !this.state.buttonIsDisabled
                    });
                }
            }
            ).catch(error => {
                toast.error('Internal error:'+error, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
                this.setState({
                    isLoading: !this.state.isLoading, buttonIsDisabled: !this.state.buttonIsDisabled
                });
            }
            )
        }
    }

    onChange = (e) => {
        this.setState({
            price: e.target.value
          })
    }

    render() {
        return (
            <span className="d-inline-block mb-2 mr-2">
                <Modal isOpen={this.state.modal} toggle={this.toggleElementUpdate} className={this.props.className}>
                    <ModalHeader toggle={this.toggleElementUpdate}>Actualizar comisión</ModalHeader>
                    <ModalBody>
                    <Form>                        
                        <p> Ingrese la comisión </p>
                        <FormGroup row>
                            <Label for="price" sm={2}>Comisión</Label>
                            <Col sm={10}>
                                <Input type="text" name="price" id="price" required
                                        value={this.state.price || ""} onChange={this.onChange}/>
                            </Col>
                        </FormGroup>                        
                    </Form>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="link" onClick={this.toggleElementUpdate}>Cancelar</Button>
                        <Button color="primary" onClick={this.saveUpdate} disabled= {this.state.buttonIsDisabled}>Confirmar
                            &nbsp;&nbsp;
                            {this.state.isLoading &&  
                                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                            }
                        </Button>
                    </ModalFooter>
                </Modal>
            </span>
        );
    }
}

export default UpdateCommissionConfirmationModal;