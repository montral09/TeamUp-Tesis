import React from 'react';

import {Form, FormGroup, Label, Input} from 'reactstrap';


class CreatePublicationStep1 extends React.Component {
    render() {
      if (this.props.parentState.currentStep !== 1) { // Prop: The current step
        return null
      }
      // Step 1 UI
      return(
        <Form className="border border-light p-6">
            <p className="h4 mb-4 text-center">Datos de tu espacio - Paso 1</p>
            <FormGroup>
                <Label for="spaceTypeSelect">Elije el tipo de espacio que deseas publicar (*)</Label>
                <Input type="select" name="spaceTypeSelect" id="spaceTypeSelect" onChange={this.props.onChange}>
                    {this.props.parentState.spaceTypes.map((space, key) => {
                        return <option key={key} value={space.Code}>{space.Description}</option>;
                    })}
                </Input>
            </FormGroup>
            <FormGroup>
                <Label for="spaceName">Nombre del espacio (*)</Label>
                <Input type="text" name="spaceName" id="spaceName" placeholder="ej: Edificio ABC / ABC Coworking / Sala ABC" onChange={this.props.onChange} maxLength="50"/>
            </FormGroup>
            <FormGroup>
                <Label for="description">Descripción</Label>
                <Input type="textarea" name="description" id="description" onChange={this.props.onChange} maxLength="2000"/>
            </FormGroup>
            <FormGroup>
                <Label for="geoU">Ubicación (*)</Label>
                <Input type="text" name="geoU" placeholder="ej: Pocitos" id="geoU"/>
            </FormGroup>
            <FormGroup>
                <Label for="capacity">Capacidad (*)</Label>
                <Input type="text" name="capacity" placeholder="ej: 10 " id="capacity" onChange={this.props.onChange} maxLength="3"/>
            </FormGroup>
            <FormGroup>
                <Label for="availability">Disponibilidad (*)</Label>
                <Input type="textarea" name="availability" id="availability" placeholder="ej: Lunes a viernes de 09 a 18hrs" onChange={this.props.onChange} maxLength="200"/>
            </FormGroup>
            <FormGroup>
                <Label for="facilitiesSelect">Infraestructura</Label>
                <Input type="select" name="facilitiesSelect" id="facilitiesSelect" multiple>
                {this.props.parentState.facilities.map((facility, key) => {
                    return <option key={key} value={facility.Code}>{facility.Description}</option>;
                })}
                </Input>
            </FormGroup>
        </Form>
      )
    }
  }

  export default CreatePublicationStep1;