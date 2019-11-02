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
            newState: "ACTIVE", 
            rejectReason : null,
            oldState: "NOT VALIDATED",
            action : 1, //1: approve, 2: reject
            tokenObj: {},
            adminData: {},
            pubData : ""
        };
        this.toggleAppRej = this.toggleAppRej.bind(this);
        this.saveAppRej = this.saveAppRej.bind(this);
    }

    toggleAppRej(tokenObj, action, adminData, pubData) {
        console.log ("toggleAppRej " + pubData)
        this.setState({
            modal: !this.state.modal,
            tokenObj: tokenObj,
            adminData: adminData,
            action: action,
            pubData: pubData
        });
    }

    saveAppRej() {
        console.log("save - this.state: ");
        console.log(this.state);
        return;
        let {Mail, RejectedReason, OldState, NewState, Rut, AccessToken, IdPublication} = this.state;
        let objPub = {
            Mail: Mail,
            RejectedReason : this.state.rejectReason,
            OldState: this.state.oldState,
            NewState: this.state.newState,
            AccessToken: this.state.tokenObj.accesToken,
            IdPublication: 4
        }
    

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
                    modal: !this.state.modal,
                    userData: this.state.userData,
                    userDataChanged: this.state.userData
                });
                this.props.updateTable();
            } else
                 if (data.Message) {
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
        this.setState({
            RejectedReason: e.target.value
          })
    }
    render() {
        return (
            <span className="d-inline-block mb-2 mr-2">
                <Modal isOpen={this.state.modal} toggle={this.toggleAppRej} className={this.props.className}>
                    <ModalHeader toggle={this.toggleAppRej}>Cambiar publicacion</ModalHeader>
                    <ModalBody>
                    <Form>                        
                        <FormGroup row>
                            <Label for="RejectReason" sm={2}>Reject reason</Label>
                            <Col sm={10}>
                                <Input type="textarea" name="RejectReason" id="RejectReason"
                                        value={this.state.rejectReason || ""} onChange={this.onChange}/>
                            </Col>
                        </FormGroup>
                    </Form>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="link" onClick={this.toggleAppRej}>Cancel</Button>
                        <Button color="primary" onClick={this.saveAppRej}>Confirmar</Button>{' '}
                    </ModalFooter>
                </Modal>
            </span>
        );
    }
}

export default ApproveRejectPublicationModal;