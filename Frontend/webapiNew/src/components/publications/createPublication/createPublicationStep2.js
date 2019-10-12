import React from 'react';
import { toast } from 'react-toastify';
import {Form, FormGroup, Label, Input} from 'reactstrap';

import Upload from './upload/upload';

class CreatePublicationStep2 extends React.Component {
    matchYoutubeUrl(url) {
        var p = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
        var matches = String(url).match(p);
        if(matches){
            this.props.onChange({target :{value:matches[1],id:"youtubeURL"}});
        }else{
            toast.error("Error: No es una URL de YouTube válida", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        }
    }
    render() {
      if (this.props.parentState.currentStep !== 2) { // Prop: The current step
        return null
      }
      // Step 2 UI
      return(
        <Form className="border border-light p-6">
            <p className="h4 mb-4 text-center">Datos de tu espacio - Paso 2</p>
            <FormGroup>
                <Upload onChange={this.props.onChange}/>
            </FormGroup>
            <FormGroup>
                <Label for="youtubeURL">Video (Link de YouTube)</Label>
                <Input type="text" name="youtubeURL" id="youtubeURL" onChange={this.matchYoutubeUrl} maxLength="70"/>
            </FormGroup>

            <FormGroup>
            </FormGroup>

        </Form>
      )
    }
  }

  export default CreatePublicationStep2;