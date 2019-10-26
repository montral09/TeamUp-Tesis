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
    
    loadDummiesRelatedPublications() {
            return {
                "Related" :
                [ 
                
                    {
                        id: 123,
                        pubName: "Oficina en pocitos",
                        pubDesc: "Oficina en pocitos la mejor",
                        ubicacion: "Pocitos",
                        capacidad: "10",
                        disponibilidad: "De lunes a Viernes de 09 a 18hrs",
                        infraestructura: ["Wifi", "Proyector", "Cafetera", "Patio", "Aire Acondicionado"],
                        fotos: ['https://picsum.photos/id/741/800/600', 'https://picsum.photos/1024/768'],
                        youtubeUrl: 'https://www.youtube.com/watch?v=VPB-scqoNDE',
                        precios: [
                            { code: 1, value: 100 }, { code: 2, value: 150 }, { code: 3, value: 300 }
                        ],
                        puntuacion: 3,
                        cantidadReviews: 25 
                    },
                    {
                        id: 456,
                        pubName: "Oficina en pocitos",
                        pubDesc: "Oficina en pocitos la mejor",
                        ubicacion: "Pocitos",
                        capacidad: "10",
                        disponibilidad: "De lunes a Viernes de 09 a 18hrs",
                        infraestructura: ["Wifi", "Proyector", "Cafetera", "Patio", "Aire Acondicionado"],
                        fotos: ['https://picsum.photos/id/741/800/600', 'https://picsum.photos/1024/768'],
                        youtubeUrl: 'https://www.youtube.com/watch?v=VPB-scqoNDE',
                        precios: [
                            { code: 1, value: 100 }, { code: 2, value: 150 }, { code: 3, value: 300 }
                        ],
                        puntuacion: 3,
                        cantidadReviews: 25  
                    }
                ]                   
            } 
    }

 	render() {
 		let products = [];
 			products = this.loadDummiesRelatedPublications;
 		const { translate } = this.props;
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
				{products.length > 0 ?
					<div className="box clearfix box-with-products with-scroll box-no-advanced">
						<div className="box-heading">Publicaciones relacionadas</div>
						<p className="next" onClick={() => this.refs.carousel.next()}><span></span></p>
						<p className="prev" onClick={() => this.refs.carousel.prev()}><span></span></p>
						<div className="strip-line"></div>

						<div className="box-content">
				        	<div className="box-product">
			        			<OwlCarousel ref="carousel" options={options}>
									{products.map(product => {
										return (
					        				<div className="item" key={product.id}>
					        					<div className="product-grid">
													{/*<RelatedPublicationPreview
														key={product.id}
														{...product}
													/>*/}
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