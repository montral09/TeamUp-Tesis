import React from 'react';
import Select from 'react-select';
import {Form, FormGroup, Label, Input} from 'reactstrap';

class CreatePublicationStep1 extends React.Component {
    constructor(props) {
        super(props);
        var facilitiesSelectTemp = []
        this.props.parentState.facilitiesSelect.forEach(element => {
            let infText = this.props.parentState.facilities.filter( function(fac){
                return parseInt(fac.Code) == parseInt(element)
            });
            facilitiesSelectTemp.push({label : infText[0].Description, value: element});
            
        });
        this.state= {
            value: facilitiesSelectTemp
        }
        this.handleSelectChange = this.handleSelectChange.bind(this)

    }


    handleSelectChange(value){
        this.setState({ value });
        this.props.onChange({target :{value:value, id:"facilitiesSelect", options : this.props.parentState.facilities}})		
    }
    
    render() {
        const { value } = this.state;
        const facilitiesAux = this.props.parentState.facilities.map(function(row) {         
            return { value : row.Code, label : row.Description }
         })
      if (this.props.parentState.currentStep !== 1) { // Prop: The current step
        return null
      }
      // Step 1 UI
      return(
        <Form className="border border-light p-6">
            <p className="h4 mb-4 text-center">Datos de tu espacio - Paso 1</p>
            <FormGroup>
                <Label for="spaceTypeSelect">Elije el tipo de espacio que deseas publicar (*)</Label>
                <Input type="select" name="spaceTypeSelect" id="spaceTypeSelect" onChange={this.props.onChange} defaultValue = {this.props.parentState.spaceTypeSelect} >
                    {this.props.parentState.spaceTypes.map((space, key) => {
                        return <option key={key} value={space.Code}>{space.Description}</option>;
                    })}
                </Input>
            </FormGroup>
            <FormGroup>
                <Label for="spaceName">Nombre del espacio (*)</Label>
                <Input type="text" name="spaceName" id="spaceName" placeholder="ej: Edificio ABC / ABC Coworking / Sala ABC" onChange={this.props.onChange} maxLength="50"
                    value ={this.props.parentState.spaceName}/>
            </FormGroup>
            <FormGroup>
                <Label for="description">Descripción</Label>
                <Input type="textarea" name="description" id="description" onChange={this.props.onChange} maxLength="2000"
                    value ={this.props.parentState.description}/>
            </FormGroup>
            <FormGroup>
                <Label for="capacity">Capacidad (*)</Label>
                <Input type="text" name="capacity" placeholder="ej: 10 " id="capacity" onChange={this.props.onChange} maxLength="3"
                    value ={this.props.parentState.capacity}/>
            </FormGroup>
            <FormGroup>
                <Label for="facilitiesSelect" >Infraestructura</Label>
                <Select	
                    isMulti
					options={facilitiesAux}
                    value={value}
                    onChange = {this.handleSelectChange}
                    removeSelected = {true}
				/>
            </FormGroup>
        </Form>
      )
    }
  }

  export default CreatePublicationStep1;