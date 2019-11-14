import React from 'react';
import {Button, Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';
import { Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import {
    Col
} from 'reactstrap';

import {toast} from 'react-toastify';


class ApproveRejectPublicationModal extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            modal: false,
            RejectReason : "",
            admTokenObj: {},
            adminData: {},
            pubData : {type : ""},
            isLoading : false,
            buttonIsDisabled: false
        };
        this.toggleAppRej = this.toggleAppRej.bind(this);
        this.saveAppRej = this.saveAppRej.bind(this);
    }

    toggleAppRej(admTokenObj, adminData, pubData) {
        if(pubData){
            console.log ("toggleAppRej " + pubData)
            this.setState({
                modal: !this.state.modal,
                admTokenObj: admTokenObj,
                adminData: adminData,
                pubData: pubData
            });
        }else{
            this.setState({
                modal: !this.state.modal
            });
        }
    }

    saveAppRej() {
        console.log("save - this.state: ");
        console.log(this.state);
        this.setState({
            isLoading: !this.state.isLoading, buttonIsDisabled: !this.state.buttonIsDisabled
        });
        var newState = "";
        if(this.state.pubData.type == "REJECT"){
            newState = 'REJECTED';
        }else if (this.state.pubData.type == "APPROVE"){
            newState = 'ACTIVE';
        }
        // Old state => NOT VALIDATED
        let {Mail} = this.state.adminData;
        let objPub = {
            Mail: Mail,
            RejectedReason : this.state.RejectReason,
            OldState: 'NOT VALIDATED',
            NewState: newState,
            AccessToken: this.state.admTokenObj.accesToken,
            IdPublication: this.state.pubData.id
        }
        console.log(objPub);
        fetch('https://localhost:44372/api/publication', {
            method: 'PUT',
            header: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify(objPub)
        }).then(response => response.json()).then(data => {
            console.log("data:" + JSON.stringify(data));
            if (data.responseCode == "SUCC_PUBLICATIONUPDATED") {
                toast.success('Publicacion actualizada correctamente ', {
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
    onChange = (e) => {
        this.setState({
            RejectReason: e.target.value
          })
    }
    render() {
        return (
            <span className="d-inline-block mb-2 mr-2">
                <Modal isOpen={this.state.modal} toggle={this.toggleAppRej} className={this.props.className}>
                    <ModalHeader toggle={this.toggleAppRej}>Cambiar publicacion</ModalHeader>
                    <ModalBody>
                    <Form>                        
                        <p> {this.state.pubData.type == 'APPROVE' ? "¿Esta seguro de aprobar esta publicación?" : "Por favor introduzca motivo de rechazo:"} </p>
                        {this.state.pubData.type == 'REJECT' ? 
                        (
                            <FormGroup row>
                                <Label for="RejectReason" sm={2}>Razon de rechazo</Label>
                                <Col sm={10}>
                                    <Input type="textarea" name="RejectReason" id="RejectReason"
                                            value={this.state.RejectReason || ""} onChange={this.onChange}/>
                                </Col>
                            </FormGroup>
                        ) : (null)}
                    </Form>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="link" onClick={this.toggleAppRej}>Cancelar</Button>
                        <Button color="primary" onClick={this.saveAppRej} disabled= {this.state.buttonIsDisabled}>{this.state.pubData.type == 'APPROVE' ? "Confirmar" : "Rechazar"}
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

export default ApproveRejectPublicationModal;