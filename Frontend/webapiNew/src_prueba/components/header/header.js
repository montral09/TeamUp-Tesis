import React from "react";
import TopBarMenu from './topBarMenu';

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
									        </div>
									        <div className="col-md-8" id="top-bar-right">
									        	<TopBarMenu />
									        </div>
									    </div>
									</div>
								</div>
							</div>  
						</div>
						<div id="top" className="full-width">
							<div className="background-top"></div>
							<div className="background">
								<div className="shadow"></div>
								<div className="pattern">
									<div className="container">
									    <div className="row">
									        <div className="col-md-5" id="header-left">
									            
									        </div>
									        <div className="col-md-7" id="header-right">
									            
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

export default Header;