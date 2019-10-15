import React from 'react';
import { toast } from 'react-toastify';
import {Form, FormGroup, Label, Input} from 'reactstrap';


class CreatePublicationStep3 extends React.Component {

    constructor(props) {
      super(props);
      this.state = {
        totalToPay: 0,
        totalToPayText: "Total a pagar $0",
        premOptionsSelected: []
      }
    }

    totalToPay = (e) => {
      const premOpcion = this.state.premOptionsSelected.filter(premOpc => {
        return premOpc.Code === e.target.id
      });
      // if the option is in the array --> remove it
      if(premOpcion.length != 0){
        const premOptionsSelectedNew = this.state.premOptionsSelected.filter(premOpc => {
          return premOpc.Code != e.target.id
        });
        const totalToPayNew = this.state.totalToPay-parseInt(premOpcion[0].Price);
        const totalToPayTextNew = "Total a pagar $"+totalToPayNew;
        this.setState({
          premOptionsSelected: premOptionsSelectedNew,
          totalToPay: totalToPayNew,
          totalToPayText: totalToPayTextNew
        }, () => {      
          this.props.onChange({target :{value:this.state.premOptionsSelected,id:"premiumOptionsSelected"}});
        });
      }else{
        // if the option is not in the array -> add it
        const premOption = this.props.parentState.premiumOptions.filter(premOpc => {
          return premOpc.Code === e.target.id
        });
        const premOptionsSelectedNew = this.state.premOptionsSelected;
        premOptionsSelectedNew.push(premOption[0]);
        const totalToPayNew = this.state.totalToPay+parseInt(premOption[0].Price);
        const totalToPayTextNew = "Total a pagar $"+totalToPayNew;
        this.setState({
          premOptionsSelected: premOptionsSelectedNew,
          totalToPay: totalToPayNew,
          totalToPayText: totalToPayTextNew
        }, () => {      
          this.props.onChange({target :{value:this.state.premOptionsSelected,id:"premiumOptionsSelected"}});
        });
      }

    }

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

            {this.props.parentState.premiumOptions.map((premOpc, key) => {
                let premText = premOpc.Description + " - $"+premOpc.Price;
                return (
                  <FormGroup>
                    <Input type="checkbox" name={premOpc.Code} id={premOpc.Code} onChange={this.totalToPay}/>
                    <Label for={premOpc.Code}>{premText}</Label>
                  </FormGroup>
                )
            })}

            <Input type="text" name="payTotal" id="payTotal" placeholder={this.state.totalToPayText} readOnly/>
        </Form>
      )
    }
  }

  export default CreatePublicationStep3;