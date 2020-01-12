import React from 'react';
import { withTranslate } from 'react-redux-multilingual'

class AboutUs extends React.Component {
    render() {
    	const { translate } = this.props;
	    return (
	    	<React.Fragment>
	            <h4>{translate('about_us')}</h4>
	            <div className="strip-line"></div>
	            <div className="clearfix">
	                <div className="custom-footer-text">
	                    TeamUp!
	                    <p>{translate('footer_about_us')}</p>
	                </div>
	            </div>
            </React.Fragment>
	    );
	}
}

export default withTranslate(AboutUs);