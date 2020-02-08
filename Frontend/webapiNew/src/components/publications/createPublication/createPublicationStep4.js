import React from 'react';
import { PricingTable, PricingSlot, PricingDetail } from 'react-pricing-table';
// Multilanguage
import { withTranslate } from 'react-redux-multilingual';
import { displayErrorMessage } from '../../../services/common/genericFunctions';

class CreatePublicationStep3 extends React.Component {

  constructor(props) {
    super(props);
    var isDisabled = false, premOptionSelected = null;
    if (this.props.parentState.premiumOptionSelected) {
      isDisabled = true;
      premOptionSelected = this.props.parentState.premiumOptionSelected;
    }
    this.state = {
      totalToPay: 0,
      premOptionSelected: premOptionSelected,
      isDisabled: isDisabled
    }
  }

  // This function will handle the onchange event from the fields
  onChange = (idPlan) => {
    const optionSelected = this.props.parentState.premiumOptions.filter(premOpc => {
      return premOpc.IdPlan == idPlan
    });

    if(this.props.parentState.editObject && this.props.parentState.editObject.planPrice != 0 &&
      this.props.parentState.editObject.currentIDPlan == this.props.parentState.editObject.IdPlan &&
      optionSelected[0].Price < this.props.parentState.editObject.planPrice && this.props.parentState.editObject.stateDescription != 'PENDING PAYMENT'){
      displayErrorMessage(this.props.translate('createPub_step4_errorMsg1'));
    }else{
      this.setState({
        premOptionSelected: idPlan,
        totalToPay: optionSelected[0].Price,
      }, () => { });
      this.props.onChange({ target: { value: idPlan, id: "premiumOptionSelected" } });
    }
  }

  render() {
    if (this.props.parentState.currentStep !== 4) { // Prop: The current step
      return null
    }
    const { translate } = this.props;

    // Step 4 UI
    return (
      <>
        <p className="h4 mb-4 text-center">{translate('createPub_step4_header')}</p>
        {this.props.parentState.cpMode == 'split' ? (
          <div style={{ marginBottom: '4%' }}>{translate('createPub_step4_splitSpace')}</div> 
          ) : (
          <PricingTable highlightColor='#1976D2'>
            {this.props.parentState.premiumOptions.map((premOpc, key) => {
              return (
                <PricingSlot key={key} onClick={() => this.onChange(premOpc.IdPlan)} buttonText={translate('select_w')} title={translate('premOptions_' + premOpc.Name + '_text')}
                  priceText={"$" + premOpc.Price} highlighted={this.state.premOptionSelected == premOpc.IdPlan} >
                  <PricingDetail> <i className="fas fa-check"></i> {translate('premOptions_' + premOpc.Name + '_visibilitySearch')}</PricingDetail>
                  <PricingDetail {...(translate('premOptions_' + premOpc.Name + '_visibilityMainScreenStricked') == 'true' ? { strikethrough: true } : {})}> {translate('premOptions_' + premOpc.Name + '_visibilityMainScreenStricked') == 'false' ? (<i className="fas fa-check"></i>) : (<i className="fas fa-times"></i>)} {translate('premOptions_' + premOpc.Name + '_visibilityMainScreen')}</PricingDetail>
                  <PricingDetail {...(translate('premOptions_' + premOpc.Name + '_visibilityRecommStricked') == 'true' ? { strikethrough: true } : {})}> {translate('premOptions_' + premOpc.Name + '_visibilityRecommStricked') == 'false' ? (<i className="fas fa-check"></i>) : (<i className="fas fa-times"></i>)} {translate('premOptions_' + premOpc.Name + '_visibilityRecomm')}</PricingDetail>
                  <PricingDetail> <b>{premOpc.Days} {translate('days_w')}</b></PricingDetail>
                </PricingSlot>
              )
            })}
          </PricingTable>
        )}

      </>
    )

  }
}

export default withTranslate(CreatePublicationStep3);