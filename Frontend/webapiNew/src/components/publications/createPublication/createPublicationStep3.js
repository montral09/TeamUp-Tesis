import React from 'react';
import {Form, FormGroup, Label, Input} from 'reactstrap';
// Multilanguage
import { withTranslate } from 'react-redux-multilingual';

class CreatePublicationStep3 extends React.Component {

    render() {
      if (this.props.parentState.currentStep !== 3) { // Prop: The current step
        return null
      }
      const { translate } = this.props;

      // Step 3 UI
      return(
        <Form className="border border-light p-6">
            <p className="h4 mb-4 text-center">{translate('createPub_DataFromYourSpace')} - {translate('createPub_stepHeader')} 3</p>
            <FormGroup>
                <Label for="prices">{translate('prices_w')} ({translate('currency_UY')})</Label>
                {
                  this.props.parentState.spaceTypeSelect == 2 &&
                    <small id="pricesHelper" className="form-text text-muted mb-2">{translate('createPub_step3_priceXpersonTxt')}</small>
                }

            </FormGroup>
            <FormGroup>
              <Label for='HourPrice'>{translate('price_w')} {translate('hourlyPrice_w')}</Label>
              <Input type="text" name='HourPrice' id='HourPrice' maxLength="6" onChange={this.props.onChange} value={this.props.parentState.HourPrice}/>
              <Label for='DailyPrice'>{translate('price_w')} {translate('dailyPrice_w')}</Label>
              <Input type="text" name='DailyPrice' id='DailyPrice' maxLength="6" onChange={this.props.onChange} value={this.props.parentState.DailyPrice}/>
              <Label for='WeeklyPrice'>{translate('price_w')} {translate('weeklyPrice_w')}</Label>
              <Input type="text" name='WeeklyPrice' id='WeeklyPrice' maxLength="6" onChange={this.props.onChange} value={this.props.parentState.WeeklyPrice}/>
              <Label for='MonthlyPrice'>{translate('price_w')} {translate('monthlyPrice_w')}</Label>
              <Input type="text" name='MonthlyPrice' id='MonthlyPrice' maxLength="6" onChange={this.props.onChange} value={this.props.parentState.MonthlyPrice}/>
            </FormGroup>
            <FormGroup>
                <Label for="availability">{translate('availability_w')} (*)</Label>
                <p>{translate('createPub_step3_availHelperTxt')}</p>
                <Input type="textarea" name="availability" id="availability" placeholder={translate('createPub_step3_availPlaceHolderTxt')} onChange={this.props.onChange} maxLength="200"
                    value ={this.props.parentState.availability}/>
            </FormGroup>
        </Form>
      )
    }
  }

  export default withTranslate(CreatePublicationStep3);