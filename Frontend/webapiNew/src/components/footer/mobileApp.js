import React from 'react';
import IOS from "./iOS.png";
import Android from "./android.png";

class MobileApp extends React.Component {
    render() {
    	const { translate } = this.props;
 	    return (
	    	<React.Fragment>
                <h4>Descargá TeamUp</h4>
                <div className="strip-line"></div>
                <div className="clearfix">
                        <div>
                            <a href="https://play.google.com/store/apps/details?id=com.ea.game.pvzfree_row&hl=es">
                                <img src={Android} alt="Android" style={{ marginBottom: '8px' }} /> 
                            </a>
                        </div>
                        <div> 
                            <a href="https://play.google.com/store/apps/details?id=com.ea.game.pvzfree_row&hl=es">                    
                                <img src={IOS} alt="Android"/>  
                            </a>                                
                        </div>
                </div>
            </React.Fragment>
	    );
	}
}

export default MobileApp;