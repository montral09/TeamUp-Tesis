import React from 'react';
import {Button, Modal, ModalHeader, ModalBody, ModalFooter,
    Form, FormGroup, Label, Input, Col } from 'reactstrap';

import {toast} from 'react-toastify';
import { callAPI } from '../../../config/genericFunctions';

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
            this.setState({
                isLoading: !this.state.isLoading, buttonIsDisabled: !this.state.buttonIsDisabled
            });        
            let {Mail} = this.state.adminData;        
            var objApi = {};    
            objApi.objToSend = {
                Mail: Mail,
                AccessToken: this.state.admTokenObj.accesToken,
                IdReservation: this.state.id,
                Price: this.state.price
            }
            objApi.fetchUrl = "api/reservationPaymentAdmin";
            objApi.method = "POST";
            objApi.successMSG = {
                SUCC_COMMISSIONUPDATED : 'Pago actualizado correctamente',
            };
            objApi.functionAfterSuccess = "editCommission";
            objApi.functionAfterError = "editCommission"
            callAPI(objApi, this);
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