import React from 'react';
import { toast } from 'react-toastify';
import {Form, FormGroup, Label, Input} from 'reactstrap';


class CreatePublicationStep3 extends React.Component {

    render() {
      if (this.props.parentState.currentStep !== 4) { // Prop: The current step
        return null
      }
      // Step 4 UI
      return(
        <Form className="border border-light p-6">
            <p className="h4 mb-4 text-center">¿Aumentar visibilidad? (Opcional)</p>
            <FormGroup>
                <Label for="prices">Valores en Pesos Uruguayos</Label>
            </FormGroup>

            <FormGroup>
                <Input type="checkbox" name="premium1" id="premium1"/>
                <Label for="premium1">Premium 1 - $50</Label>
            </FormGroup>

            <FormGroup>
                <Input type="checkbox" name="premium2" id="premium2"/>    
                <Label for="premium2">Premium 2 - $100</Label> 
            </FormGroup>

            <FormGroup>
                <Input type="checkbox" name="premium3" id="premium3"/>
                <Label for="premium3">Premium 3 - $150</Label>
            </FormGroup>

            <FormGroup>
                <Input type="checkbox" name="premium4" id="premium4"/>
                <Label for="premium4">Premium 4 - $200</Label>
            </FormGroup>

            <Input type="text" name="payTotal" id="payTotal" placeholder="Total a pagar $350" readonly/>
        </Form>
      )
    }
  }

  export default CreatePublicationStep3;