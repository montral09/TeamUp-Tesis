import React from 'react';
import {Form, Label, Input, CustomInput, Table} from 'reactstrap';
// Multilanguage
import { withTranslate } from 'react-redux-multilingual';

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
        },  () => {});
        this.props.onChange({target :{value:e.target.value ,id:"premiumOptionSelected"}});
    }

    render() {
      if (this.props.parentState.currentStep !== 4) { // Prop: The current step
        return null
      }
      const { translate } = this.props;

      // Step 4 UI
      return(
        <Form className="border border-light p-6">
            <p className="h4 mb-4 text-center">{translate('createPub_step4_header')}</p>
            <Table hover striped bordered size="lg" responsive className = "center">
              <thead>
                <tr>
                  <th>{translate('plan_w')}</th> 
                  <th>{translate('price_w')}</th> 
                  <th>{translate('days_w')}</th> 
                </tr>
              </thead>
              <tbody>
                {this.props.parentState.premiumOptions.map((premOpc, key) => {
                      return (
                        <tr key={premOpc.IdPlan}>
                          <td><CustomInput onChange={this.onChange} value={premOpc.IdPlan} type="radio" id={"premiumSelect_"+premOpc.IdPlan} 
                            name="premiumSelect" label={premOpc.Name} disabled={this.state.isDisabled} /></td>
                          <td>{premOpc.Price}</td>
                          <td>{premOpc.Days}</td>
                        </tr>
                      )
                  })}
              </tbody>
            </Table>
            <Label for="payTotal">{translate('total_w')} {translate('in_w')} {translate('currency_UY')}</Label>
            <Input type="text" name="payTotal" id="payTotal" placeholder={this.state.totalToPayText} readOnly/>
        </Form>
      )
    }
  }

  export default withTranslate(CreatePublicationStep3);