import React from 'react';
import {Form} from 'reactstrap';
// Multilanguage
import { withTranslate } from 'react-redux-multilingual';

class CreatePublicationStep5 extends React.Component {

    render() {
      if (this.props.parentState.currentStep !== 5) { // Prop: The current step
        return null
      }
      const { translate } = this.props;

      // Step 4 UI
      return(
        <Form className="border border-light p-6">
            <p className="h4 mb-4 text-center">{translate('summary_w')}</p>
            {translate('createPub_step5_main')}
            <br/><br/><br/>
        </Form>
      )
    }
  }

  export default withTranslate(CreatePublicationStep5);