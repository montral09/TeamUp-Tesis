import React from 'react';
import {Button, Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';
import { Form, FormGroup, Label, Input } from 'reactstrap';
import {
    Col
} from 'reactstrap';
import { callAPI } from '../../config/genericFunctions'
import Select from 'react-select';
import 'react-quill/dist/quill.snow.css'; 
import ReactQuill from 'react-quill';

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
            adminData: {},
            facilitiesAux: [],
            facilitiesSelectTemp: [],
            facilitiesSelect: []
        };
        this.toggle = this.toggle.bind(this);
        this.save = this.save.bind(this);
        this.handleSelectChange = this.handleSelectChange.bind(this)
        this.deleteImage = this.deleteImage.bind(this);
       
    }

    deleteImage(id){
        var tempImgArr = this.state.publDataChanged.ImagesURL.filter(function(value, index){
            return index != id;
        });
        this.onChange({target :{value:tempImgArr, name:"ImagesURL"}});
    }

    toggle(publData, admTokenObj, adminData, spaceTypes, facilities) {
        var facilitiesAux = []
        var facilitiesSelectTemp = []
        var facilitiesSelect = []
        if (facilities) {
            facilitiesAux = facilities.map(function(row) {         
                return { value : row.Code, label : row.Description }
             })
             publData.Facilities.forEach(element => {
                 let infText = facilities.filter( function(fac){
                     return parseInt(fac.Code) == parseInt(element)
                 });
                 facilitiesSelectTemp.push({label : infText[0].Description, value: element});
                 facilitiesSelect.push(infText[0].Code)
                 
             }); }        
        this.setState({
            modal: !this.state.modal,
            publData: publData,
            publDataChanged: publData,
            admTokenObj: admTokenObj,
            adminData: adminData,
            spaceTypes: spaceTypes,
            facilitiesAux : facilitiesAux,
            facilitiesSelectTemp : facilitiesSelectTemp,
            facilitiesSelect: facilitiesSelect
        });
    }

    handleSelectChange(facilitiesSelectTemp){
        var values = [];
        for (var i = 0, l = facilitiesSelectTemp.length; i < l; i++) {
            values.push(facilitiesSelectTemp[i].value);
        }        
        this.setState({
            facilitiesSelectTemp: facilitiesSelectTemp,
            facilitiesSelect : values
        })
    } 

    save() {        
        var objApi = {};
        objApi.objToSend = {
            "AccessToken": this.state.admTokenObj.accesToken,
            "Publication": {
                "IdPublication": this.state.publDataChanged.IdPublication,
                "Mail": this.state.adminData.Mail,
                "SpaceType": parseInt(this.state.publDataChanged.SpaceType),
                "Title": this.state.publDataChanged.Title,
                "Description": this.state.publDataChanged.Description,
                "Address": this.state.publDataChanged.Address,
                "City": this.state.publDataChanged.City,
                "Location": {
                    "Latitude": this.state.publDataChanged.Latitude,
                    "Longitude": this.state.publDataChanged.Longitude
                },
                "Capacity": parseInt(this.state.publDataChanged.Capacity),
                "VideoURL": this.state.publDataChanged.VideoURL,
                "HourPrice": parseFloat(this.state.publDataChanged.HourPrice),
                "DailyPrice": parseFloat(this.state.publDataChanged.DailyPrice),
                "WeeklyPrice": parseFloat(this.state.publDataChanged.WeeklyPrice),
                "MonthlyPrice": parseFloat(this.state.publDataChanged.MonthlyPrice),
                "Availability": this.state.publDataChanged.Availability,
                "Facilities": this.state.facilitiesSelect,
            },
            "ImagesURL" : this.state.publDataChanged.ImagesURL //The ones to keep
        }
        objApi.fetchUrl = "api/publications";
        objApi.method = "PUT";
        objApi.successMSG = {
            SUCC_PUBLICATIONUPDATED : 'Publicacion actualizada correctamente',
        };
        objApi.functionAfterSuccess = "editPublication";
        callAPI(objApi, this);
    }

    onChange = (e) => {
        var valueToUpdate = e.target.value;
        this.setState({
            publDataChanged: {
              ...this.state.publDataChanged,
              [e.target.name] : valueToUpdate
            }
          }, () => console.log ((this.state)))
    }

    handleRichTextChange = (value) =>{
        this.setState({             
            publDataChanged: {
            ...this.state.publDataChanged,
            'Description' : value
          } 
        });
    }

    render() {

        return (
            <span className="d-inline-block mb-2 mr-2">
                <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
                    <ModalHeader toggle={this.toggle}>Cambiar datos de publicacion</ModalHeader>
                    <ModalBody>
                    <Form>
                        <FormGroup row>
                            <Label for="IdPublication" sm={2}>Publicación Id</Label>
                            <Col sm={10}>
                                <Input type="text" name="IdPublication" id="IdPublication"
                                        value={this.state.publDataChanged.IdPublication || ""} readOnly/>
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label for="Mail" sm={2}>Mail</Label>
                            <Col sm={10}>
                                <Input type="text" name="Mail" id="Mail"
                                        value={this.state.publDataChanged.Mail || ""} readOnly/>
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label for="SpaceType" sm={2}>Tipo de espacio</Label>
                            <Col sm={10}>
                                <Input type="text" name="SpaceType" id="SpaceType" disabled= {this.props.disableFields}
                                        value={this.state.publDataChanged.SpaceType || ""} onChange={this.onChange}/>
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label for="Title" sm={2}>Título</Label>
                            <Col sm={10}>
                                <Input type="text" name="Title" id="Title" disabled= {this.props.disableFields}
                                        value={this.state.publDataChanged.Title || ""} onChange={this.onChange}/>
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label for="Description" sm={2}>Descripción</Label>
                            <Col sm={10}>
                                <ReactQuill  name="Description" id="Description" value={this.state.publDataChanged.Description || ""} 
                                onChange={() => this.handleRichTextChange} readOnly={this.props.disableFields}/>
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label for="City" sm={2}>Ciudad</Label>
                            <Col sm={10}>
                                <Input type="text" name="City" id="City" disabled= {this.props.disableFields}
                                        value={this.state.publDataChanged.City || ""} onChange={this.onChange}/>
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label for="Location" sm={2}>Coordenadas</Label>
                            <Col sm={5}>
                                <Input type="text" name="Latitude" id="Latitude" disabled= {this.props.disableFields}
                                    {...(this.state.publDataChanged.Location ? {value :this.state.publDataChanged.Location.Latitude || ""} : {value:''})}
                                    onChange={this.onChange}/>
                            </Col>
                            <Col sm={5}>
                                <Input type="text" name="Longitude" id="Longitude" disabled= {this.props.disableFields}
                                {...(this.state.publDataChanged.Location ? {value :this.state.publDataChanged.Location.Longitude || ""} : {value:''})}
                                 onChange={this.onChange}/>
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label for="Capacity" sm={2}>Capacidad</Label>
                            <Col sm={10}>
                                <Input type="text" name="Capacity" id="Capacity" disabled= {this.props.disableFields}
                                        value={this.state.publDataChanged.Capacity || ""} onChange={this.onChange}/>
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label for="VideoURL" sm={2}>URL Video</Label>
                            <Col sm={10}>
                                <Input type="text" name="VideoURL" id="VideoURL" disabled= {this.props.disableFields}
                                        value={this.state.publDataChanged.VideoURL || ""} onChange={this.onChange}/>
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label for="Price" sm={2}>Precios</Label>
                            <Label for="Price" sm={2}>Hora</Label>
                            <Col sm={3}>
                                <Input type="text" name="HourPrice" id="HourPrice" disabled= {this.props.disableFields}
                                        value={this.state.publDataChanged.HourPrice || 0} onChange={this.onChange}/>
                            </Col>
                            <Label for="Price" sm={2}>Día</Label>
                            <Col sm={3}>
                                <Input type="text" name="DailyPrice" id="DailyPrice" disabled= {this.props.disableFields}
                                        value={this.state.publDataChanged.DailyPrice || 0} onChange={this.onChange}/>
                            </Col>
                            <Label for="Price" sm={2}></Label>
                            <Label for="Price" sm={2}>Semana</Label>
                            <Col sm={3}>
                                <Input type="text" name="WeeklyPrice" id="WeeklyPrice" disabled= {this.props.disableFields}
                                        value={this.state.publDataChanged.WeeklyPrice || 0} onChange={this.onChange}/>
                            </Col>
                            <Label for="Price" sm={2}>Mes</Label>
                            <Col sm={3}>
                                <Input type="text" name="MonthlyPrice" id="MonthlyPrice" disabled= {this.props.disableFields}
                                        value={this.state.publDataChanged.MonthlyPrice || 0} onChange={this.onChange}/>
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label for="Availability" sm={2}>Disponibilidad</Label>
                            <Col sm={10}>
                                <Input type="textarea" name="Availability" id="Availability" disabled= {this.props.disableFields}
                                        value={this.state.publDataChanged.Availability || ""} onChange={this.onChange}/>
                            </Col>
                        </FormGroup>
                        {this.state.publDataChanged.ImagesURL && this.state.publDataChanged.ImagesURL.map((obj,index) => {
                            return (
                            <FormGroup row  key={index+"_imageurl"} >
                                <Label for="imageurl" sm={2}>Imagen {index}</Label>
                                <Col sm={10}>
                                    <a href={obj} target="_blank">ImageURL{index}</a>
                                    {!this.props.disableFields ? 
                                        <Button disabled={this.props.disableFields} color="link" onClick={() => this.deleteImage(index)}><i className="lnr lnr-cross-circle"></i>Eliminar</Button>
                                        : null }
                                </Col>
                            </FormGroup>)
                            })
                        }
                        <FormGroup>
                            <Label for="facilitiesSelect" >Infraestructura</Label>
                            <Select	
                                isMulti
                                options={this.state.facilitiesAux}
                                value={this.state.facilitiesSelectTemp}
                                onChange = {this.handleSelectChange}
                                removeSelected = {true}
                                isDisabled= {this.props.disableFields}
                            />
                        </FormGroup>
                    </Form>
                    </ModalBody>
                    <ModalFooter>
                        {!this.props.disableFields ? 
                        <div>
                            <Button color="link" onClick={this.toggle}>Cancelar</Button>
                            <Button color="primary" onClick={this.save}>Guardar</Button>
                        </div> : null
                        }
                    </ModalFooter>
                </Modal>
            </span>
        );
    }
}

export default ModifyPublicationModal;