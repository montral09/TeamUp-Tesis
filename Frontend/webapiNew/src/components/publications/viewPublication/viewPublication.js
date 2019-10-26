import React from 'react';
import Header from "../../header/header";
import { Helmet } from 'react-helmet';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { connect } from 'react-redux';

import OwlCarousel from 'react-owl-carousel2';
import InnerImageZoom from 'react-inner-image-zoom';
import DatePicker from  './datePicker';
import RelatedPublications from './relatedPublications'



class ViewPublication extends React.Component {

    constructor(props) {
        super(props);
        const pubID = props.match.params.pubID;
        var pubObj = this.loadDummyPublication(pubID);
        this.state = {
            pubID: pubID,
            pubObj: pubObj,
            activeImage: { index: 0, src: pubObj.fotos[0]},
            date: null,
            quantity: 1 
        }

    }


    componentDidMount() {
        window.scrollTo(0, 0);

    }

    onChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value
        });
    }

    handleSelect = (e) => {
        console.log("fabi");
        console.log(e);
        this.setState({
            date: e
        });
    }

    handleChange = (e) => {
        console.log("fabi");
        console.log(e);
        this.setState({
            date: e
        }); 
    }

    increaseQuantity() {
		this.setState({ quantity: parseInt(this.state.quantity)+1});
	}
	decreaseQuantity() {
		if(parseInt(this.state.quantity) > 1) {
			this.setState({ quantity: parseInt(this.state.quantity)-1});
		}
    }
    
    changeQuantity(value) {
		if(parseInt(value) > 0) {
			this.setState({ quantity: parseInt(value)});
		}
    }
    
    loadDummyPublication(pubID) {
        try {

            // call API
            return {
                pubID: 123,
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

        } catch (error) {
            toast.error('Internal error', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        }
        return null;
    }
	changeImage(image, index) {
		this.setState({ activeImage: { index: index, src: image } })
	}
    render() {
        const options = {
	    	slideSpeed: 500,
	    	margin: 10,
	    	nav: false,
	    	dots: false,
		    responsive:{
		        0:{
		            items:4,
		        },
		        600:{
		            items:4,
		        },
		        1000:{
		            items:5,
		        }
		    }
		};
        return (
            <>
                {/*SEO Support*/}
                <Helmet>
                    <title>TeamUp | {this.state.pubObj.pubName}</title>
                    <meta name="description" content={this.state.pubObj.pubName} />
                </Helmet>
                {/*SEO Support End */}
                <Header />
                <div className="main-content  full-width  home">
                    <div className="pattern" >
                        <div>
                            <div className="row">
                                <div className="col-md-12 ">
                                    <div className="row">
                                        <div className="main-content  full-width ">
                                            <div className="background-content"></div>
                                            <div className="background">
                                                <div className="shadow"></div>
                                                <div className="pattern">
                                                    <div className="container">
                                                        <div className="row">
                                                            <div className="col-md-12 center-column" id="content">
                                                                <div className="product-info">
                                                                    <div className="row">
                                                                        <div className="col-md-12">
                                                                            <div className="row" id="quickview_product">
                                                                                <div className="col-md-5 popup-gallery">
                                                                                    <div className="product-image cloud-zoom">
                                                                                        {true === true &&
                                                                                            <div className="sale">Recomendado!</div>
                                                                                        }
                                                                                        {<InnerImageZoom src={this.state.activeImage.src} />}
                                                                                    </div>
                                                                                    <div className="overflow-thumbnails-carousel">
                                                                                        <OwlCarousel options={options} className="thumbnails-carousel owl-carousel">
                                                                                            {this.state.pubObj.fotos.map((image, index) => {
                                                                                                return (
                                                                                                    <div className="owl-item" key={index}><p><a href="#product_image" className={this.state.activeImage.index === index ? 'popup-image active' : 'popup-image'} onClick={() => this.changeImage(image, index)}><img src={image} title={this.state.pubObj.pubName} alt={this.state.pubObj.pubName} /></a></p></div>
                                                                                                );
                                                                                            })}
                                                                                        </OwlCarousel>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="col-md-7 product-center clearfix">
                                                                                    <h1 className="product-name">{this.state.pubObj.pubName}</h1>
                                                                                    <div className="review">
                                                                                        <div className="rating"><i className={this.state.pubObj.puntuacion > 0 ? 'fa fa-star active' : 'fa fa-star'}></i><i className={this.state.pubObj.puntuacion > 1 ? 'fa fa-star active' : 'fa fa-star'}></i><i className={this.state.pubObj.puntuacion > 2 ? 'fa fa-star active' : 'fa fa-star'}></i><i className={this.state.pubObj.puntuacion > 3 ? 'fa fa-star active' : 'fa fa-star'}></i><i className={this.state.pubObj.puntuacion > 4 ? 'fa fa-star active' : 'fa fa-star'}></i>&nbsp;&nbsp;&nbsp;<a href="#reviews">{this.state.pubObj.cantidadReviews} reviews </a></div>
                                                                                    </div>
                                                                                    <div className="description">
                                                                                        <span>Capacidad: </span><b>{this.state.pubObj.capacidad} personas</b> <br />
                                                                                    </div>
                                                                                    <div>
                                                                                        <span>Precios<br/></span>
                                                                                    </div>
                                                                                    <div className="price">
                                                                                        <span className="col-md-9 center-column">Por Hora : $300 <br/>Por Semana : $3500<br/> </span>
                                                                                    </div>
                                                                                    <div>
                                                                                        <span>Disponibilidad<br/></span>
                                                                                    </div>
                                                                                    <div >
                                                                                        <span>{this.state.pubObj.disponibilidad}<br/></span>
                                                                                    </div>
                                                                                    <div className = "title-page">
                                                                                        <span>Haga su reserva ahora!<br/></span>
                                                                                    </div>
                                                                                    
                                                                                    <div className="box box-with-categories">
                                                                                        <DatePicker placeholderText="Desde..."
                                                                                            dateFormat="dd/MM/yyyy"
                                                                                            selected={this.state.date}
                                                                                            onSelect={this.handleSelect} //when day is clicked
                                                                                            onChange={this.handleChange} //only when value has changed
                                                                                        />
                                                                                        <div className="cart">
                                                                                        <div className="add-to-cart d-flex">
                                                                                            <div className="quantity">
                                                                                                <input type="text" name="quantity" id="quantity_wanted" size="2" value={this.state.quantity} onChange={(event) => this.changeQuantity(event.target.value)} />
                                                                                                <a href="#quantity_up" id="q_up" onClick={() => this.increaseQuantity()}><i className="fa fa-plus"></i></a>
                                                                                                <a href="#quantity_down" id="q_down" onClick={() => this.decreaseQuantity()}><i className="fa fa-minus"></i></a>
                                                                                            </div>																				
                                                                                        </div>
                                                                                        </div>
                                                                                        <div className="description add-to-cart d-flex">
                                                                                                <input type="button" value="Reservar" onClick={() => alert("Iniciar tramite reserva si esta logueado")} className="button" /> 
                                                                                            </div>																			
																		                </div>
                                                                                    <div id="product">
                                                                                        <div className="description">
                                                                                            <div className="add-to-cart d-flex">                                                                                                                                                                                            
                                                                                                <input type="button" value="Solicitar Información" onClick={() => alert("Mandar 'mensaje' si esta logueado?")} className="button" />
                                                                                            </div>
                                                                                            <div className="links clearfix">
                                                                                                <a href="#add_to_wishlist" onClick={() => alert("Agregar a favoritos si esta logueado")}><span><i className="fas fa-heart"></i></span>Agregar a favoritos</a>                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                         
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                <div id="tabs" className="htabs">
                                                                    <a href="#tab-description" className="selected">Descripción</a>
                                                                    <a href="#tab-review">Reviews ({this.state.pubObj.cantidadReviews})</a>
                                                                </div>

                                                                <div id="tab-description" className="tab-content" style={{ display: 'block' }}>
                                                                    <div dangerouslySetInnerHTML={{ __html: this.state.pubObj.pubDesc }} />
                                                                </div>
                                                                <div className="services">
                                                                    <span>Servicios<br/></span>
                                                                </div>
                                                                <div className="description">
                                                                    <span>{this.state.pubObj.infraestructura.map((inf, index) => {
                                                                        return (
                                                                            <div className="owl-item" key={index}><p>{inf}</p></div>
                                                                        );
                                                                        })}<br/></span>
                                                                </div>
                                                                <RelatedPublications />
                                                                <div id="tab-review" className="tab-content">
                                                                    {/*<TabReview product_id={item.id} />*/}
                                                                </div>

                                                                    {/*<RelatedProducts product_id={item.id} />*/}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        login_status: state.loginData.login_status
    }
}

export default connect(mapStateToProps)(ViewPublication);