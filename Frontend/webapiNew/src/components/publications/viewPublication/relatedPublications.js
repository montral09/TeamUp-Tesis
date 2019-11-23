import React from "react";
import OwlCarousel from 'react-owl-carousel2';
import 'react-owl-carousel2/src/owl.carousel.css';
import $ from 'jquery';
import RelatedPublicationPreview from './relatedPublicationPreview'

class RelatedPublications extends React.Component {
	constructor(props) {
		super(props);
	}
	componentDidMount() {
	    $(".box-product .product").hover(function(){
	    	$(this).closest(".box-product").addClass("active");
	    }, function(){
	    	$(this).closest(".box-product").removeClass("active");
	    });
	}
	componentDidUpdate() {
	    $(".box-product .product").hover(function(){
	    	$(this).closest(".box-product").addClass("active");
	    }, function(){
	    	$(this).closest(".box-product").removeClass("active");
	    });
    }
    
 	render() {

		const {relatedPublications} = this.props;

		const options = {
	    	slideSpeed: 500,
	    	margin: 30,
	    	nav: false,
	    	dots: false,
		    responsive:{
		        0:{
		            items:2,
		        },
		        600:{
		            items:3,
		        },
		        1000:{
		            items:5,
		        }
		    }
		};
		return (
			<React.Fragment>
				{relatedPublications.length > 0 ?
					<div className="box clearfix box-with-products with-scroll box-no-advanced">
						<div className="box-heading">Publicaciones relacionadas</div>
						<p className="next" onClick={() => this.refs.carousel.next()}><span></span></p>
						<p className="prev" onClick={() => this.refs.carousel.prev()}><span></span></p>
						<div className="strip-line"></div>

						<div className="box-content">
				        	<div className="box-product">
			        			<OwlCarousel ref="carousel" options={options}>
									{relatedPublications.map(relPub => {
										return (
					        				<div className="item" key={relPub.IdPublication*2}>
					        					<div className="product-grid" key={relPub.IdPublication}>
													{<RelatedPublicationPreview redirectToPub={this.props.redirectToPub}
														key={relPub.IdPublication}
														{...relPub}
													/>}
												</div>
											</div>
										);
									})}
				        		</OwlCarousel>
				        	</div>
						</div>
					</div>
				: ''}
			</React.Fragment>
		);
	}
}


export default RelatedPublications