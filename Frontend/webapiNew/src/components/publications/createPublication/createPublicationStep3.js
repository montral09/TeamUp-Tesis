import React from 'react';
import { toast } from 'react-toastify';
import {Form, FormGroup, Label, Input} from 'reactstrap';


class CreatePublicationStep3 extends React.Component {

    render() {
      if (this.props.parentState.currentStep !== 3) { // Prop: The current step
        return null
      }
      // Step 3 UI
      return(
        <Form className="border border-light p-6">
            <p className="h4 mb-4 text-center">Datos de tu espacio - Paso 3</p>
            <FormGroup>
                <Label for="prices">Precios (Pesos Uruguayos)</Label>
            </FormGroup>
            <FormGroup>
                {this.props.parentState.reservationTypes.map((resType, key) => {
                    let tempID = "resType_"+resType.Code;
                    return (
                        <>
                        <Label key={"pubStep3Label_"+key} for={tempID}>{resType.Description}</Label>
                        <Input key={"pubStep3Input_"+key} type="text" name={tempID} id={tempID} maxLength="4"/>
                        </>
                    )
                })}
            </FormGroup>

        </Form>
      )
    }
  }

  export default CreatePublicationStep3;