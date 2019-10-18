import React from 'react';
import Header from "../../header/header";
import { Link, Redirect } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { connect } from 'react-redux';

import OwlCarousel from 'react-owl-carousel2';
import { InlineShareButtons } from 'sharethis-reactjs';
import InnerImageZoom from 'react-inner-image-zoom'


class ViewPublication extends React.Component {

    constructor(props) {
        super(props);
        const pubID = props.match.params.pubID;
        var pubObj = this.loadDummyPublication(pubID);
        this.state = {
            pubID: pubID,
            pubObj: pubObj,
            activeImage: { index: 0, src: pubObj.fotos[0] }
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
                infraestructura: [1, 2, 3, 4],
                fotos: ['https://picsum.photos/id/971/800/600', 'https://picsum.photos/id/741/800/600', 'https://picsum.photos/1024/768'],
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
                                                                                    <div className="price">
                                                                                        <span className="price-new">Por Hora : $300 <br/>Por Semana : $3500<br/> </span>
                                                                                    </div>
                                                                                    <div id="product">
                                                                                        <div className="cart">
                                                                                            <div className="add-to-cart d-flex">
                                                                                                <input type="button" value="Reservar" onClick={() => alert("Iniciar tramite reserva si esta logueado")} className="button" /> 
                                                                                                ____
                                                                                                <input type="button" value="Solicitar Información" onClick={() => alert("Mandar 'mensaje' si esta logueado?")} className="button" />
                                                                                            </div>
                                                                                            <div className="links clearfix">
                                                                                                <a href="#add_to_wishlist" onClick={() => alert("Agregar a favoritos si esta logueado")}><span><i className="fas fa-heart"></i></span>Agregar a favoritos</a>                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="share">
                                                                                        <InlineShareButtons
                                                                                            config={{
                                                                                                alignment: 'left',  // alignment of buttons (left, center, right)
                                                                                                color: 'social',      // set the color of buttons (social, white)
                                                                                                enabled: true,        // show/hide buttons (true, false)
                                                                                                font_size: 14,        // font size for the buttons
                                                                                                labels: 'null',        // button labels (cta, counts, null)
                                                                                                language: 'en',       // which language to use (see LANGUAGES)
                                                                                                networks: [           // which networks to include (see SHARING NETWORKS)
                                                                                                    'whatsapp',
                                                                                                    'linkedin',
                                                                                                    'messenger',
                                                                                                    'facebook',
                                                                                                    'twitter'
                                                                                                ],
                                                                                                padding: 10,          // padding within buttons (INTEGER)
                                                                                                radius: 0,            // the corner radius on each button (INTEGER)
                                                                                                show_total: false,
                                                                                                size: 34,             // the size of each button (INTEGER)
                                                                                            }}
                                                                                        />
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