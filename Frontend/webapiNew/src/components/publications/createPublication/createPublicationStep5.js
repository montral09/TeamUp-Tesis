import React from 'react';
import { toast } from 'react-toastify';
import {Form, FormGroup, Label, Input} from 'reactstrap';


class CreatePublicationStep5 extends React.Component {

    render() {
      if (this.props.parentState.currentStep !== 5) { // Prop: The current step
        return null
      }
      // Step 4 UI
      return(
        <Form className="border border-light p-6">
            <p className="h4 mb-4 text-center">Resumen</p>
            La publicacion será enviada al administrador para su aprobación.
            Además, si seleccionó alguna opcion de pago, quedará pendiente la publicacion hasta que el mismo sea realizado.
            Se enviará un correo con toda la información.
            DEBUG STATE:
            {JSON.stringify(this.props.parentState)}

        </Form>
      )
    }
  }

  export default CreatePublicationStep5;