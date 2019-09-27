import React from 'react';
import {Button, Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';
import { Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import {
    Col, Card, CardBody,
    CardTitle,
} from 'reactstrap';
class ModifyUserModal extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            modal: false,
            userData: {},
            userDataChanged: {}
        };

        this.toggle = this.toggle.bind(this);
    }

    toggle(userData) {
        console.log("userData: ");
        console.log(userData);
        this.setState({
            modal: !this.state.modal,
            userData: userData,
            userDataChanged: userData
        });
    }
    onChange = (e) => {
        console.log("name: "+e.target.name+",value:"+e.target.value);
        var valueToUpdate = e.target.value;
        if(e.target.value == 'on'){
            // adapt to checkbox behavior
            valueToUpdate = !this.state.userDataChanged[e.target.name];
            console.log("status changed: "+valueToUpdate);
        }
        this.setState({
            userDataChanged: {
              ...this.state.userDataChanged,
              [e.target.name] : valueToUpdate
            }
          })
    }
    render() {
        return (
            <span className="d-inline-block mb-2 mr-2">
                <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
                    <ModalHeader toggle={this.toggle}>Cambiar datos de usuario</ModalHeader>
                    <ModalBody>
                    <Form>
                        <FormGroup row>
                            <Label for="Mail" sm={2}>Email</Label>
                            <Col sm={10}>
                                <Input type="email" name="Mail" id="Mail"
                                        value={this.state.userDataChanged.Mail} onChange={this.onChange}/>
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label for="Name" sm={2}>Nombre</Label>
                            <Col sm={10}>
                                <Input type="text" name="Name" id="Name"
                                        value={this.state.userDataChanged.Name} onChange={this.onChange}/>
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label for="LastName" sm={2}>Apellido</Label>
                            <Col sm={10}>
                                <Input type="text" name="LastName" id="LastName"
                                        value={this.state.userDataChanged.LastName} onChange={this.onChange}/>
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label for="Phone" sm={2}>Teléfono</Label>
                            <Col sm={10}>
                                <Input type="text" name="Phone" id="Phone"
                                        value={this.state.userDataChanged.Phone} onChange={this.onChange}/>
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label for="Rut" sm={2}>Teléfono</Label>
                            <Col sm={10}>
                                <Input type="text" name="Rut" id="Rut"
                                        value={this.state.userDataChanged.Rut || ""} onChange={this.onChange}/>
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label for="RazonSocial" sm={2}>Teléfono</Label>
                            <Col sm={10}>
                                <Input type="text" name="RazonSocial" id="RazonSocial"
                                        value={this.state.userDataChanged.RazonSocial || ""} onChange={this.onChange}/>
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label for="Address" sm={2}>Teléfono</Label>
                            <Col sm={10}>
                                <Input type="text" name="Address" id="Address"
                                        value={this.state.userDataChanged.Address || ""} onChange={this.onChange}/>
                            </Col>
                        </FormGroup>


                        <FormGroup row>
                            <Label for="CheckPublisher" sm={2}>Es Gestor</Label>
                            <Col sm={{size: 10}}>
                                <FormGroup check>
                                    <Label check>
                                        <Input type="checkbox" name="CheckPublisher" id="CheckPublisher" checked={this.state.userDataChanged.CheckPublisher} onChange={this.onChange}/>{' '}
                                        Habilitar
                                    </Label>
                                </FormGroup>
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label for="MailValidated" sm={2}>Mail Validado</Label>
                            <Col sm={{size: 10}}>
                                <FormGroup check>
                                    <Label check>
                                        <Input type="checkbox" name="MailValidated" id="MailValidated" checked={this.state.userDataChanged.MailValidated} onChange={this.onChange}/>{' '}
                                        Habilitar
                                    </Label>
                                </FormGroup>
                            </Col>
                        </FormGroup>
                    </Form>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="link" onClick={this.toggle}>Cancel</Button>
                        <Button color="primary" onClick={this.toggle}>Guardar</Button>{' '}
                    </ModalFooter>
                </Modal>
            </span>
        );
    }
}

export default ModifyUserModal;
