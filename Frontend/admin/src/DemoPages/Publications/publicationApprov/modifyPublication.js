import React from 'react';
import {Button, Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';
import { Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import {
    Col
} from 'reactstrap';

import {toast} from 'react-toastify';


class ModifyPublicationModal extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            modal: false,
            publData: {},
            publDataChanged: {
                Location: ''
            },
            admTokenObj: {},
            adminData: {}
        };
        this.toggle = this.toggle.bind(this);
        this.save = this.save.bind(this);
    }

    toggle(publData, admTokenObj, adminData, spaceTypes) {
        this.setState({
            modal: !this.state.modal,
            publData: publData,
            publDataChanged: publData,
            admTokenObj: admTokenObj,
            adminData: adminData,
            spaceTypes: spaceTypes
        });
    }

    save() {
        console.log("save - this.state: ");
        console.log(this.state);
        return;
        let {Mail, Name, LastName, Phone, Rut, RazonSocial, Address, CheckPublisher, PublisherValidated, MailValidated, Active  } = this.state.userDataChanged;
        let objUser = {
            Mail: Mail,
            OriginalMail : this.state.userData.Mail,
            Name: Name,
            LastName: LastName,
            Phone: Phone,
            Rut: Rut,
            RazonSocial: RazonSocial,
            Address: Address,
            CheckPublisher: CheckPublisher,
            PublisherValidated: PublisherValidated,
            MailValidated: MailValidated,
            AccessToken: this.state.admTokenObj.accesToken,
            AdminMail: this.state.adminData.Mail,
            Active: Active
        }

        fetch('https://localhost:44372/api/updateUserAdmin', {
            method: 'PUT',
            header: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify(objUser)
        }).then(response => response.json()).then(data => {
            console.log("data:" + JSON.stringify(data));
            if (data.responseCode == "SUCC_USRUPDATED") {
                toast.success('Usuario actualizado correctamente ', {
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
                if (data.responseCode == "ERR_MAILALREADYEXIST") {
                    toast.error('Ese correo ya esta en uso, por favor elija otro.', {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                    });
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
        if(e.target.value == 'on'){
            // adapt to checkbox behavior
            valueToUpdate = !this.state.userDataChanged[e.target.name];
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
                    <ModalHeader toggle={this.toggle}>Cambiar datos de publicacion</ModalHeader>
                    <ModalBody>
                    <Form>
                        <FormGroup row>
                            <Label for="IdPublication" sm={2}>IdPublication</Label>
                            <Col sm={10}>
                                <Input type="text" name="IdPublication" id="IdPublication"
                                        value={this.state.publDataChanged.IdPublication} readOnly/>
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label for="IdUser" sm={2}>IdUser</Label>
                            <Col sm={10}>
                                <Input type="text" name="IdUser" id="IdUser"
                                        value={this.state.publDataChanged.IdUser} readOnly/>
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label for="Mail" sm={2}>Mail</Label>
                            <Col sm={10}>
                                <Input type="text" name="Mail" id="Mail"
                                        value={this.state.publDataChanged.Mail} readOnly/>
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label for="SpaceType" sm={2}>SpaceType</Label>
                            <Col sm={10}>
                                <Input type="text" name="SpaceType" id="SpaceType"
                                        value={this.state.publDataChanged.SpaceType} onChange={this.onChange}/>
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label for="Title" sm={2}>Title</Label>
                            <Col sm={10}>
                                <Input type="text" name="Title" id="Title"
                                        value={this.state.publDataChanged.Title || ""} onChange={this.onChange}/>
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label for="Description" sm={2}>Description</Label>
                            <Col sm={10}>
                                <Input type="textarea" name="Description" id="Description"
                                        value={this.state.publDataChanged.Description || ""} onChange={this.onChange}/>
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label for="Location" sm={2}>Location</Label>
                            <Col sm={5}>
                                <Input type="text" name="Latitude" id="Latitude"
                                    {...(this.state.publDataChanged.Location ? {value :this.state.publDataChanged.Location.Latitude} : {})}
                                    onChange={this.onChange}/>
                            </Col>
                            <Col sm={5}>
                                <Input type="text" name="Longitude" id="Longitude"
                                {...(this.state.publDataChanged.Location ? {value :this.state.publDataChanged.Location.Longitude} : {})}
                                 onChange={this.onChange}/>
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label for="Capacity" sm={2}>Capacity</Label>
                            <Col sm={10}>
                                <Input type="text" name="Capacity" id="Capacity"
                                        value={this.state.publDataChanged.Capacity || ""} onChange={this.onChange}/>
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label for="VideoURL" sm={2}>VideoURL</Label>
                            <Col sm={10}>
                                <Input type="text" name="VideoURL" id="VideoURL"
                                        value={this.state.publDataChanged.VideoURL || ""} onChange={this.onChange}/>
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label for="Price" sm={2}>Precios</Label>
                            <Label for="Price" sm={2}>Hora</Label>
                            <Col sm={3}>
                                <Input type="text" name="HourPrice" id="HourPrice"
                                        value={this.state.publDataChanged.HourPrice || 0} onChange={this.onChange}/>
                            </Col>
                            <Label for="Price" sm={2}>Día</Label>
                            <Col sm={3}>
                                <Input type="text" name="DailyPrice" id="DailyPrice"
                                        value={this.state.publDataChanged.DailyPrice || 0} onChange={this.onChange}/>
                            </Col>
                            <Label for="Price" sm={2}></Label>
                            <Label for="Price" sm={2}>Semana</Label>
                            <Col sm={3}>
                                <Input type="text" name="WeeklyPrice" id="WeeklyPrice"
                                        value={this.state.publDataChanged.WeeklyPrice || 0} onChange={this.onChange}/>
                            </Col>
                            <Label for="Price" sm={2}>Mes</Label>
                            <Col sm={3}>
                                <Input type="text" name="MonthlyPrice" id="MonthlyPrice"
                                        value={this.state.publDataChanged.MonthlyPrice || 0} onChange={this.onChange}/>
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label for="Availability" sm={2}>Availability</Label>
                            <Col sm={10}>
                                <Input type="textarea" name="Availability" id="Availability"
                                        value={this.state.publDataChanged.Availability || ""} onChange={this.onChange}/>
                            </Col>
                        </FormGroup>
                        {this.state.publDataChanged.ImagesURL && this.state.publDataChanged.ImagesURL.map(function(obj,index) {
                            return(
                            <FormGroup row>
                                <Label key={index+"_imageurl"} for="imageurl" sm={2}>Image URL {index}</Label>
                                <Col sm={10}>
                                    <a href={obj} target="_blank">ImageURL{index}</a>
                                </Col>
                            </FormGroup>
                            )
                        })}

                    </Form>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="link" onClick={this.toggle}>Cancel</Button>
                        <Button color="primary" onClick={this.save}>Guardar</Button>{' '}
                    </ModalFooter>
                </Modal>
            </span>
        );
    }
}

export default ModifyPublicationModal;