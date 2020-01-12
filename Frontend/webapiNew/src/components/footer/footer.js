import React from "react";
import MobileApp from './mobileApp';
import ContactUs from "./contactUs";
import AboutUs from "../../components/footer/aboutUs";

class Footer extends React.Component {
 	render() {
		return (
			<>	
				<div className="custom-footer full-width">
				    <div className="background-custom-footer"></div>
				    <div className="background">
				        <div className="shadow"></div>
				        <div className="pattern">
				            <div className="container">
				                <div className="row">
									<div className="col-md-4">
										<AboutUs />
									</div>
				                    <div className="col-md-4">
				                        <MobileApp />
				                    </div>
									<div className="col-md-4">
				                        <ContactUs />
				                    </div>
				                </div>
				            </div>
				        </div>
				    </div>
				</div>				
			</>
		);
	}
}

export default Footer;