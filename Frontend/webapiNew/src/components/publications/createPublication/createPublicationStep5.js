import React from 'react';
import {Form} from 'reactstrap';


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
            Además, si seleccionó alguna opcion de pago, los beneficios premiums no se aplicaran el pago sea realizado.
            Se enviará un correo con toda la información.
            <br/><br/><br/>
        </Form>
      )
    }
  }

  export default CreatePublicationStep5;