import React from "react";
import { Link } from 'react-router-dom';
import $ from 'jquery';

class RelatedPublicationPreview extends React.Component {
	loadQuickview(id) {
		this.props.changeQuickview(id);
		setTimeout(function () {
			$('#modalProduct-' + id).modal('show')
		}, 100);
	}
 	render() {
 		const { symbol, addToCart, addToCompare, addToWishlist, lang, translate } = this.props;
		return (
			<React.Fragment>
				<div className="product clearfix product-hover">
				    <div className="left">
				        <div className="image ">
								<img src="https://picsum.photos/1024/768" alt="Producto1" className="" />
							<div className="quickview"><a href="#quickview" onClick={() => null}></a></div>
				        </div>
				    </div>
				    <div className="right">				        						
				        <div className="description">
							<div>Oficina con vista al mar</div>
							<div>10 personas</div>
				            
				        </div>
				        <div className="only-hover">
				        	<a href="#add_to_cart" className="button" onClick={() => null}>Ver</a>
				            <ul>
				                <li><a href="#add_to_wishlist" onClick={() => null}><i className="fa fa-heart"></i></a></li>
				            </ul>
				        </div>
				    </div>
				</div>
			</React.Fragment>
		);
	}
}

export default RelatedPublicationPreview