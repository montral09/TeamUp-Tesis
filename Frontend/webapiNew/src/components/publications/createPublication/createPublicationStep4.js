import React from 'react';
import { toast } from 'react-toastify';
import {Form, FormGroup, Label, Input, CustomInput, Table} from 'reactstrap';


class CreatePublicationStep3 extends React.Component {

    constructor(props) {
      super(props);
      var isDisabled = false, premOptionSelected = null;
      if(this.props.parentState.premiumOptionSelected){
        isDisabled = true;
        premOptionSelected = this.props.parentState.premiumOptionSelected;
      }
      this.state = {
        totalToPay: 0,
        totalToPayText: "Total a pagar $0",
        premOptionSelected: premOptionSelected,
        isDisabled: isDisabled
      }
    }

      onChange = (e) => {
        const optionSelected = this.props.parentState.premiumOptions.filter(premOpc => {
          return premOpc.IdPlan == e.target.value
        });
        this.setState({
            premOptionSelected: e.target.value,
            totalToPay : optionSelected[0].Price,
            totalToPayText : "Total a pagar $"+optionSelected[0].Price,
        });
        this.props.onChange({target :{value:this.state.premOptionSelected,id:"premiumOptionSelected"}});
    }

    render() {
      if (this.props.parentState.currentStep !== 4) { // Prop: The current step
        return null
      }
      // Step 4 UI
      return(
        <Form className="border border-light p-6">
            <p className="h4 mb-4 text-center">¿Aumentar visibilidad? (Opcional)</p>
            <Table hover striped bordered size="lg" responsive className = "center">
              <thead>
                <tr>
                  <th>Plan</th>
                  <th>Precio</th>
                  <th>Dias</th>
                </tr>
              </thead>
              <tbody>
                {this.props.parentState.premiumOptions.map((premOpc, key) => {
                      return (
                        <tr key={premOpc.IdPlan}>
                          <td><CustomInput onChange={this.onChange} value={premOpc.IdPlan} type="radio" id={"premiumSelect_"+premOpc.IdPlan} 
                            name="premiumSelect" label={premOpc.Name} disabled={this.state.isDisabled} defaultValue={this.props.parentState.premiumOptionSelected}/></td>
                          <td>{premOpc.Price}</td>
                          <td>{premOpc.Days}</td>
                        </tr>
                      )
                  })}
              </tbody>
            </Table>
            <Label for="payTotal">Total en Pesos Uruguayos</Label>
            <Input type="text" name="payTotal" id="payTotal" placeholder={this.state.totalToPayText} readOnly/>
        </Form>
      )
    }
  }

  export default CreatePublicationStep3;