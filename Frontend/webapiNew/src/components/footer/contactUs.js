import React from 'react';
import { CONTACT_PHONENUMBER, CONTACT_EMAIL} from '../../services/common/constants';
import { withTranslate } from 'react-redux-multilingual'

class ContactUs extends React.Component {
    render() {
 	    return (
	    	<React.Fragment>
                <h4>{this.props.translate('contact_w')}</h4>
                <div className="strip-line"></div>
                <div className="clearfix">
                    <ul className="contact-us clearfix" >
                        <li>
                            <i className="fa fa-phone" style={{ marginBottom: '8px' }}></i>
                            <p>
                                {CONTACT_PHONENUMBER}<br />                                          										          									
                            </p>
                        </li>
                        <li>
                            <i className="fa fa-envelope"></i>
                            <p>
                                <span>{CONTACT_EMAIL}</span><br />
                            </p>
                        </li>                        
                    </ul>
                </div>
            </React.Fragment>
	    );
	}
}

export default withTranslate(ContactUs);