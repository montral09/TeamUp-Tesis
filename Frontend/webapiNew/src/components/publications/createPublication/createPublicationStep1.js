import React from 'react';
import Select from 'react-select';
import {Form, FormGroup, Label, Input} from 'reactstrap';
import 'react-quill/dist/quill.snow.css'; 
import ReactQuill from 'react-quill';
// Multilanguage
import { withTranslate } from 'react-redux-multilingual'

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
    }

    // This function will handle the richtext change
    handleRichTextChange = (value) =>{
        this.props.onChange({target :{value:value, id:"description", options : value}})
    }

    // This function will handle the select change
    handleSelectChange =(value) =>{
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
      const { translate } = this.props;

      // Step 1 UI
      return(
        <Form className="border border-light p-6">
            <p className="h4 mb-4 text-center">{translate('createPub_DataFromYourSpace')} - {translate('createPub_stepHeader')} 1</p>
            <FormGroup>
                <Label for="spaceTypeSelect">{translate('createPub_step1_chooseSpaceText')}</Label>
                <Input type="select" name="spaceTypeSelect" id="spaceTypeSelect" onChange={this.props.onChange} defaultValue = {this.props.parentState.spaceTypeSelect} disabled = {this.props.parentState.cpMode == 'split'} >
                    {this.props.parentState.spaceTypes.map((space, key) => {
                        return <option key={key} value={space.Code}>{space.Description}</option>;
                    })}
                </Input>
            </FormGroup>
            <FormGroup>
                <Label for="spaceName">{translate('createPub_step1_spaceName')}</Label>
                <Input type="text" name="spaceName" id="spaceName" placeholder="ej: Edificio ABC / ABC Coworking / Sala ABC" onChange={this.props.onChange} maxLength="50"
                    value ={this.props.parentState.spaceName}/>
            </FormGroup>
            <FormGroup>
                <Label for="description">{translate('desription_w')}</Label>
                <ReactQuill  name="description" id="description" value={this.props.parentState.description}
                  onChange={this.handleRichTextChange} />
            </FormGroup>
            <FormGroup>
                <Label for="capacity">{translate('capacity_w')} (*)</Label>
                <Input type="text" name="capacity" placeholder="ej: 10 " id="capacity" onChange={this.props.onChange} maxLength="3"
                    value ={this.props.parentState.capacity}/>
            </FormGroup>
            <FormGroup>
                <Label for="facilitiesSelect" >{translate('services_w')}</Label>
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

  export default withTranslate(CreatePublicationStep1);