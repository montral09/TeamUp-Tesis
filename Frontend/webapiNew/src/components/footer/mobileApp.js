import React from 'react';
import IOS from "./iOS.png";
import Android from "./android.png";
import {IOS_APP_URL, ANDROID_APP_URL, MAIN_WEBSITE_NAME} from '../../services/common/constants';
// Multilanguage
import { withTranslate } from 'react-redux-multilingual';
class MobileApp extends React.Component {
    render() {
    	const { translate } = this.props;
 	    return (
	    	<React.Fragment>
                {ANDROID_APP_URL ? (
                    <>
                    <h4>{translate('download_w')} {MAIN_WEBSITE_NAME}</h4>
                    <div className="strip-line"></div>
                    <div className="clearfix">
                            <div>
                                <a href={ANDROID_APP_URL}>
                                    <img src={Android} alt="Android" style={{ marginBottom: '8px' }} /> 
                                </a>
                            </div>
                            <div> 
                                <a href={IOS_APP_URL}>                    
                                    <img src={IOS} alt="iOS"/>  
                                </a>                                
                            </div>
                    </div>
                    </>
                ) : (
                    <>
                    <h4>{translate('comingSoon_w')} </h4>
                    <div className="strip-line"></div>
                    <div className="clearfix">
                            <div>
                                <img src={Android} alt="Android" style={{ marginBottom: '8px' }} /> 
                            </div>
                            <div> 
                                <img src={IOS} alt="iOS"/>  
                            </div>
                    </div>
                    </>
                )}
                
            </React.Fragment>
	    );
	}
}

export default withTranslate(MobileApp);