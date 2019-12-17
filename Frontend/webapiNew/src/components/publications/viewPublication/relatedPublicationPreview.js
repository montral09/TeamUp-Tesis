import React from "react";
import { Link } from 'react-router-dom';
import $ from 'jquery';

class RelatedPublicationPreview extends React.Component {
	constructor(props) {
		super(props);
		this.state = { redirect: false }
	}
	loadQuickview(id) {
		this.props.changeQuickview(id);
		setTimeout(function () {
			$('#modalProduct-' + id).modal('show')
		}, 100);
	}
 	render() {
		 const { Capacity, Title, IdPublication, ImagesURL, City} = this.props;
		return (
			<React.Fragment>
				<div className="product clearfix product-hover">
				    <div className="left">
				        <div className="image ">
								<img src={ImagesURL[0]} alt="pub1" className="" />
							<div className="quickview"><a href="#quickview" onClick={() => null}></a></div>
				        </div>
				    </div>
				    <div className="right">				        						
				        <div className="description">
							<div>{Title}</div>
							<i className="fa fa-home" aria-hidden="true"></i>{" "+City}<br/>
							<i className="fa fa-users" aria-hidden="true"></i>{" "+Capacity}<br/>
				        </div>
				        <div className="only-hover">
				        	<a className="button" onClick={() => this.props.redirectToPub(IdPublication)}>Ver</a>
				        </div>
				    </div>
				</div>
			</React.Fragment>
		);
	}
}

export default RelatedPublicationPreview