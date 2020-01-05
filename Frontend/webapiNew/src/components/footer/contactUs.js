import React from 'react';

class ContactUs extends React.Component {
    render() {
    	const { translate } = this.props;
 	    return (
	    	<React.Fragment>
                <h4>Contacto</h4>
                <div className="strip-line"></div>
                <div className="clearfix">
                    <ul className="contact-us clearfix" >
                        <li>
                            <i className="fa fa-phone" style={{ marginBottom: '8px' }}></i>
                            <p>
                                099999999999<br />                                          										          									
                            </p>
                        </li>
                        <li>
                            <i className="fa fa-envelope"></i>
                            <p>
                                <span>office@example</span><br />
                                <span>info@ask.com</span>
                            </p>
                        </li>                        
                    </ul>
                </div>
            </React.Fragment>
	    );
	}
}

export default ContactUs;