import React from 'react';
import { toast } from 'react-toastify';
import {Form, FormGroup, Label, Input, FormFeedback} from 'reactstrap';

import Upload from './upload/upload';

class CreatePublicationStep2 extends React.Component {
    constructor(props) {
        super(props);
        this.state= {
            matchYoutubeSuccess : false,
            matchYoutubeError : false,
        }
        this.matchYoutubeUrl = this.matchYoutubeUrl.bind(this);
    }
    matchYoutubeUrl(input) {
        let url = input.target.value;
        console.log(url)
        var p = /(?:https?:\/\/)?(?:youtu\.be\/|(?:www\.|m\.)?youtube\.com\/(?:watch|v|embed)(?:\.php)?(?:\?.*v=|\/))([a-zA-Z0-9\-_]+)/;
        var matches = String(url).match(p);
        console.log(matches)
        if (matches && matches[1].length == 11) {
            this.props.onChange({target :{value:matches[0], id:"youtubeURL"}});
            this.setState({ matchYoutubeSuccess: true, matchYoutubeError: false });

        }else{
            this.props.onChange({target :{value:"", id:"youtubeURL"}});
            this.setState({ matchYoutubeSuccess: false, matchYoutubeError: true });

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
                <Input {...(this.state.matchYoutubeSuccess ? {valid :true} : {})} {...(this.state.matchYoutubeError ? {invalid :true} : {})} type="text" name="youtubeURL" id="youtubeURL" onChange={this.matchYoutubeUrl} maxLength="70"/>
                <FormFeedback tooltip>Error: No es una URL de YouTube válida</FormFeedback>
            </FormGroup>

            <FormGroup>
            </FormGroup>

        </Form>
      )
    }
  }

  export default CreatePublicationStep2;