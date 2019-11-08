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
		 const { Capacity, Description, IdPublication, ImagesURL} = this.props;
		 console.log("rel pub prev: ");
		 console.log(this.props);
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
							<div>{Description}</div>
							<div>{Capacity} personas</div>
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