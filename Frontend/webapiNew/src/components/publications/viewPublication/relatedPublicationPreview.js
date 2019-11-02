import React from "react";
import { Link } from 'react-router-dom';
import $ from 'jquery';

class RelatedPublicationPreview extends React.Component {
	constructor(props) {
		super(props);
		this.state = { redirect: false }
		this.redirectToPub = this.redirectToPub.bind(this);
	}
	loadQuickview(id) {
		this.props.changeQuickview(id);
		setTimeout(function () {
			$('#modalProduct-' + id).modal('show')
		}, 100);
	}
	redirectToPub() {
		// do some check before setting redirect to true
		this.setState({ redirect: true });
	}
 	render() {
		 const { Capacity, Description, IdPublication, ImagesURL} = this.props;
		 console.log("rel pub prev: ");
		 console.log(this.props);
		 if (this.state.redirect) return <Link to={"/publications/viewPublication/viewPublication/"+IdPublication} />;
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
				        	<a className="button" onClick={() => this.redirectToPub()}>Ver</a>
				        </div>
				    </div>
				</div>
			</React.Fragment>
		);
	}
}

export default RelatedPublicationPreview