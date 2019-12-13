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
                {
                  this.props.parentState.spaceTypeSelect == 2 &&
                    <small id="pricesHelper" className="form-text text-muted mb-2">El precio es por persona</small>
                }

            </FormGroup>
            <FormGroup>
              <Label for='HourPrice'>Precio por hora</Label>
              <Input type="text" name='HourPrice' id='HourPrice' maxLength="6" onChange={this.props.onChange} value={this.props.parentState.HourPrice}/>
              <Label for='DailyPrice'>Precio por día</Label>
              <Input type="text" name='DailyPrice' id='DailyPrice' maxLength="6" onChange={this.props.onChange} value={this.props.parentState.DailyPrice}/>
              <Label for='WeeklyPrice'>Precio por semana</Label>
              <Input type="text" name='WeeklyPrice' id='WeeklyPrice' maxLength="6" onChange={this.props.onChange} value={this.props.parentState.WeeklyPrice}/>
              <Label for='MonthlyPrice'>Precio por mes</Label>
              <Input type="text" name='MonthlyPrice' id='MonthlyPrice' maxLength="6" onChange={this.props.onChange} value={this.props.parentState.MonthlyPrice}/>
            </FormGroup>
            <FormGroup>
                <Label for="availability">Disponibilidad (*)</Label>
                <p>Tenga en cuenta de aclarar por ejemplo, cual es el horario por día, que días esta disponible, etc.</p>
                <Input type="textarea" name="availability" id="availability" placeholder="ej: Lunes a viernes de 09 a 18hrs" onChange={this.props.onChange} maxLength="200"
                    value ={this.props.parentState.availability}/>
            </FormGroup>
        </Form>
      )
    }
  }

  export default CreatePublicationStep3;