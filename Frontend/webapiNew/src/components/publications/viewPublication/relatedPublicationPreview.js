import React from "react";
import { withTranslate } from 'react-redux-multilingual'

class RelatedPublicationPreview extends React.Component {
	constructor(props) {
		super(props);
		this.state = { redirect: false }
	}
 	render() {
		 const { Capacity, Title, IdPublication, ImagesURL, City, translate} = this.props;
		return (
			<React.Fragment>
				<div className="product clearfix product-hover">
				    <div className="left">
				        <div className="image ">
								<img src={ImagesURL[0]} alt="pub1" className="" />
				        </div>
				    </div>
				    <div className="right">				        						
				        <div className="description">
							<div>{Title}</div>
							<i data-toggle="tooltip" title={translate('location_w')} className="fas fa-home" aria-hidden="true"></i>{" "+City}&ensp;&nbsp;&nbsp;&nbsp;
							<i data-toggle="tooltip" title={translate('capacity_w')} className="fas fa-users" aria-hidden="true"></i>{" "+Capacity}<br/>
				        </div>
				        <div className="only-hover">
				        	<a className="button" onClick={() => this.props.redirectToPub(IdPublication)}>{translate('view_w')}</a>
				        </div>
				    </div>
				</div>
			</React.Fragment>
		);
	}
}

export default withTranslate(RelatedPublicationPreview);