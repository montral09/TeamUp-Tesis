import React from "react";
import TopBarMenu from './topBarMenu';
import LanguageForm from './languageForm';

class Header extends React.Component {
 	render() {
		return (
			<>
				<header>
					<div className="background-header"></div>
					<div className="slider-header">
						<div id="top-bar" className="full-width">
							<div className="background-top-bar"></div>
							<div className="background">
								<div className="shadow"></div>
								<div className="pattern">
									<div className="container">
									    <div className="row">
									        <div className="col-md-4">
												<LanguageForm localLocale='es'/>
									        </div>
									        <div className="col-md-8" id="top-bar-right">
									        	<TopBarMenu />
									        </div>
									    </div>
									</div>
								</div>
							</div>  
						</div>
					</div>
				</header>
			</>
		);
	}
}

export default Header