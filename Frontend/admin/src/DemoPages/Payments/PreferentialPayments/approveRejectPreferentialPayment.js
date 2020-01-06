import React from 'react';
import {Button, Modal, ModalHeader, ModalBody, ModalFooter,
    Form, FormGroup, Label, Input, Col } from 'reactstrap';

import { callAPI } from '../../../config/genericFunctions';

class approveRejectPreferentialPayment extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            modal: false,
            rejectedReason : "",
            admTokenObj: {},
            adminData: {},
            paymentData : {approved : true},
            isLoading : false,
            buttonIsDisabled: false
        };
        this.toggleAppRej = this.toggleAppRej.bind(this);
        this.saveAppRej = this.saveAppRej.bind(this);
    }

    toggleAppRej(admTokenObj, adminData, paymentData) {
        if(paymentData){
            console.log ("toggleAppRej ");
            console.log(paymentData);
            this.setState({
                modal: !this.state.modal,
                admTokenObj: admTokenObj,
                adminData: adminData,
                paymentData: paymentData
            });
        }else{
            this.setState({
                modal: !this.state.modal
            });
        }
    }

    saveAppRej() {
        this.setState({
            isLoading: !this.state.isLoading, buttonIsDisabled: !this.state.buttonIsDisabled
        });        
        let {Mail} = this.state.adminData;        
        var objApi = {};    
        objApi.objToSend = {
            Mail: Mail,
            RejectedReason : this.state.rejectedReason,
            Approved: this.state.paymentData.approved,
            AccessToken: this.state.admTokenObj.accesToken,
            IdPublication: this.state.paymentData.id
        }
        objApi.fetchUrl = "api/publicationPlanPaymentAdmin";
        objApi.method = "PUT";
        objApi.successMSG = {
            SUCC_PAYMENTUPDATED : 'Pago actualizado correctamente',
        };
        objApi.functionAfterSuccess = "appRejPreferentialPayment";
        objApi.functionAfterError = "appRejPreferentialPayment"
        callAPI(objApi, this);


       /* fetch('https://localhost:44372/api/publicationPlanPaymentAdmin', {
            method: 'PUT',
            header: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify(objPayment)
        }).then(response => response.json()).then(data => {
            console.log("data:" + JSON.stringify(data));
            if (data.responseCode == "SUCC_PAYMENTUPDATED") {
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
        )*/
    }

    onChange = (e) => {
        this.setState({
            rejectedReason: e.target.value
          })
    }
    render() {
        return (
            <span className="d-inline-block mb-2 mr-2">
                <Modal isOpen={this.state.modal} toggle={this.toggleAppRej} className={this.props.className}>
                    <ModalHeader toggle={this.toggleAppRej}>Gestionar pago</ModalHeader>
                    <ModalBody>
                    <Form>                        
                        <p> {this.state.paymentData.approved ? "¿Esta seguro de aprobar este pago?" : "Por favor introduzca motivo de rechazo:"} </p>
                        {!this.state.paymentData.approved ? 
                        (
                            <FormGroup row>
                                <Label for="rejectedReason" sm={2}>Razon de rechazo</Label>
                                <Col sm={10}>
                                    <Input type="textarea" name="rejectedReason" id="rejectedReason"
                                            value={this.state.rejectedReason || ""} onChange={this.onChange}/>
                                </Col>
                            </FormGroup>
                        ) : (null)}
                    </Form>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="link" onClick={this.toggleAppRej}>Cancelar</Button>
                        <Button color="primary" onClick={this.saveAppRej} disabled= {this.state.buttonIsDisabled}>{this.state.paymentData.approved ? "Confirmar" : "Rechazar"}
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

export default approveRejectPreferentialPayment;