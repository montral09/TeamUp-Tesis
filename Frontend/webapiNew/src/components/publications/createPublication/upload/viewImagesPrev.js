import React from "react";
import $ from 'jquery';

class ViewImagesPrev extends React.Component {
	constructor(props) {
		super(props);
	}
	loadQuickview(id) {
		this.props.changeQuickview(id);
		setTimeout(function () {
			$('#modalProduct-' + id).modal('show')
		}, 100);
	}
 	render() {
		 const { index, url} = this.props;
		return (
			<React.Fragment>
				<div className="product clearfix product-hover">
				    <div className="left">
				        <div className="image ">
								<img src={url} alt="pub1" className="" />
				        </div>
				    </div>
				    <div className="right">				        						
				        <div className="description">
							<div>Imagen {index+1}</div>
				        </div>
				        <div className="only-hover">
				        	<a className="button" onClick={() => this.props.deleteImage(index)}>Eliminar</a>
				        </div>
				    </div>
				</div>
			</React.Fragment>
		);
	}
}

export default ViewImagesPrev;