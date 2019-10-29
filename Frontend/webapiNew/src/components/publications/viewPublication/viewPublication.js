import React from 'react';
import Header from "../../header/header";
import { Helmet } from 'react-helmet';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { connect } from 'react-redux';

import OwlCarousel from 'react-owl-carousel2';
import 'react-owl-carousel2/src/owl.carousel.css';
import InnerImageZoom from 'react-inner-image-zoom';
import DatePicker from  './datePicker';
import RelatedPublications from './relatedPublications';
import TabReview from './tabReview';
import Footer from "../../footer/footer";



class ViewPublication extends React.Component {

    constructor(props) {
        super(props);
        const pubID = props.match.params.pubID;
        var pubObj = this.loadDummyPublication(pubID);
        this.state = {
            pubID: pubID,
            pubObj: pubObj,
            activeImage: { index: 0, src: pubObj.Images[0]},
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
        console.log("handleSelect");
        console.log(e);
        this.setState({
            date: e
        });
    }

    handleChange = (e) => {
        console.log("handleChange");
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
                "VOPublication": {
                    "PubID" : 123, // FABI TIENE QUE AGREGAR ESTO
                    "Mail": "",
                    "SpaceType": 2,
                    "Title": "Oficina en pocitos",
                    "Description": "Oficina en pocitos la mejor",
                    "Location": {
                        "Latitude": -34.618801,
                        "Longitude": -55.817819, 
                    },
                    "Capacity": 10,
                    "VideoURL": 'https://www.youtube.com/watch?v=VPB-scqoNDE',
                    "HourPrice": 150,
                    "DailyPrice": 800,
                    "WeeklyPrice": 0,
                    "MonthlyPrice": 0,
                    "Availability": "De lunes a Viernes de 09 a 18hrs",
                    "Facilities": [1,4,5],
                    "Ranking" : 3, // FABI TIENE QUE AGREGAR ESTO
                    "QuantityReviews" : 4,// FABI TIENE QUE AGREGAR ESTO
                    "QuantityRented" : 3 // FABI TIENE QUE AGREGAR ESTO
                },
                "Images": ['https://picsum.photos/id/741/800/600', 'https://picsum.photos/1024/768'],
                "Reviews" : [
                    {
                        id: 1,
                        product: 1,
                        rating: 4,
                        author: 'Artur',
                        date: '12/12/2019',
                        review: 'Excelente todo, lo volvere a usar'
                    },
                    {
                        id: 2,
                        product: 2,
                        rating: 5,
                        author: 'Jose',
                        date: '12/12/2019',
                        review: 'Esta es una review super larga para probar que no se rompa si tengo muchos caracteres porque no queremos que eso pase nocierto? Seguimos escribiendo? si, seguimos escribiendo, al final no va a ser tan largo porque ya no se que mas poner',
                    },
                    {
                        id: 3,
                        product: 3,
                        rating: 5,
                        author: 'Artur',
                        date: '12/12/2019',
                        review: 'Esta es una review super larga para probar que no se rompa si tengo muchos caracteres porque no queremos que eso pase nocierto? Seguimos escribiendo? si, seguimos escribiendo, al final no va a ser tan largo porque ya no se que mas poner',
                    },
                    {
                        id: 4,
                        product: 4,
                        rating: 4,
                        author: 'Santiago',
                        date: '12/12/2019',
                        review: 'Bien',
                    },
                    {
                        id: 5,
                        product: 5,
                        rating: 5,
                        author: 'Maria Julia',
                        date: '12/12/2019',
                        review: ''
                    },
                    {
                        id: 6,
                        product: 6,
                        rating: 1,
                        author: 'Artur',
                        date: '12/12/2019',
                        review: 'Nunca mas'
                    },
                ] // FABI agregar esto
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
                    <title>TeamUp | {this.state.pubObj.VOPublication.Title}</title>
                    <meta name="description" content={this.state.pubObj.VOPublication.Title} />
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
                                                                                <div className="col-md-7 popup-gallery">
                                                                                    <div className="product-image cloud-zoom">
                                                                                        {true === true &&
                                                                                            <div className="sale">Recomendado!</div>
                                                                                        }                                                                                        
                                                                                        {<InnerImageZoom src={this.state.activeImage.src} />}
                                                                                    </div>
                                                                                    <div className="overflow-thumbnails-carousel">
                                                                                        <OwlCarousel options={options} className="thumbnails-carousel owl-carousel">
                                                                                            {this.state.pubObj.Images.map((image, index) => {
                                                                                                return (
                                                                                                    <div className="owl-item" key={index}><p><a href="#product_image" className={this.state.activeImage.index === index ? 'popup-image active' : 'popup-image'} onClick={() => this.changeImage(image, index)}><img src={image} title={this.state.pubObj.VOPublication.Title} alt={this.state.pubObj.VOPublication.Title} /></a></p></div>
                                                                                                );
                                                                                            })}
                                                                                        </OwlCarousel>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="col-md-5 product-center clearfix">
                                                                                    <h1 className="product-name">{this.state.pubObj.VOPublication.Title}</h1>                                                                                    
                                                                                                <a href="#add_to_wishlist" onClick={() => alert("Agregar a favoritos si esta logueado")}><span><i className="fas fa-heart"></i></span>Agregar a favoritos</a>                                                                            
                                                                                            <div className="description">{this.state.pubObj.VOPublication.QuantityRented} veces alquilado</div>
                                                                                        
                                                                                    <div className="review">
                                                                                        <div className="rating"><i className={this.state.pubObj.VOPublication.Ranking > 0 ? 'fa fa-star active' : 'fa fa-star'}></i><i className={this.state.pubObj.VOPublication.Ranking > 1 ? 'fa fa-star active' : 'fa fa-star'}></i><i className={this.state.pubObj.VOPublication.Ranking > 2 ? 'fa fa-star active' : 'fa fa-star'}></i><i className={this.state.pubObj.VOPublication.Ranking > 3 ? 'fa fa-star active' : 'fa fa-star'}></i><i className={this.state.pubObj.VOPublication.Ranking > 4 ? 'fa fa-star active' : 'fa fa-star'}></i>&nbsp;&nbsp;&nbsp;</div>
                                                                                    </div>
                                                                                    <div className="review">
                                                                                        <span> <b>Capacidad: </b></span>{this.state.pubObj.VOPublication.Capacity} personas <br />
                                                                                    </div>
                                                                                    <div className="review">
                                                                                        <span><b>Precios</b><br/></span>
                                                                                    </div>
                                                                                    <div className="price">
                                                                                        <span className="col-md-9 center-column">
                                                                                        {this.state.pubObj.VOPublication.HourPrice > 0 && "Por Hora : $"+ this.state.pubObj.VOPublication.HourPrice + " - " }
                                                                                        {this.state.pubObj.VOPublication.DailyPrice > 0 && "Por Día : $"+ this.state.pubObj.VOPublication.DailyPrice + " - "}
                                                                                        {this.state.pubObj.VOPublication.WeeklyPrice > 0 && "Por Semana : $"+ this.state.pubObj.VOPublication.WeeklyPrice + " - "}
                                                                                        {this.state.pubObj.VOPublication.MonthlyPrice > 0 && "Por Mes : $"+ this.state.pubObj.VOPublication.MonthlyPrice}

                                                                                        </span>
                                                                                    </div>
                                                                                    <div className="review">
                                                                                        <div className="title-page" > 
                                                                                            <span><b>Disponibilidad</b></span>
                                                                                        </div>
                                                                                        <div >
                                                                                            <span>{this.state.pubObj.VOPublication.Availability}<br/></span>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="review">
                                                                                    <div className = "title-page">
                                                                                        <span><b>Haga su reserva ahora!</b></span>
                                                                                    </div>
                                                                                    <div className="col-md-9 box box-with-categories">
                                                                                        <DatePicker placeholderText="Fecha"
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
                                                                                        </div>
                                                                                    <div id="product">
                                                                                        <div className="description">
                                                                                            <div className="add-to-cart d-flex">                                                                                                                                                                                            
                                                                                                <input type="button" value="Solicitar Información" onClick={() => alert("Mandar 'mensaje' si esta logueado?")} className="button" />
                                                                                            </div>                                                                                                                                                                                           
                                                                                        </div>
                                                                                    </div>
                         
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                <div id="tabs" className="htabs">
                                                                    <a href="#tab-description" className="selected">Descripción</a>
                                                                    <a href="#tab-review">Reviews ({this.state.pubObj.VOPublication.QuantityReviews})</a>
                                                                </div>

                                                                <div id="tab-description" className="tab-content" style={{ display: 'block' }}>
                                                                    <div dangerouslySetInnerHTML={{ __html: this.state.pubObj.VOPublication.Description }} />
                                                                </div>
                                                                <div className="title-page">
                                                                
                                                                    <span>Servicios<br/></span>
                                                                
                                                                <div className="review">
                                                                    <span>{this.state.pubObj.VOPublication.Facilities.map((inf, index) => {
                                                                        return (
                                                                            <div className="owl-item" key={index}><p>{inf}</p></div>
                                                                        );
                                                                        })}<br/></span>
                                                                </div>
                                                                </div>
                                                                <RelatedPublications product_id={this.state.pubObj.VOPublication.PubID} />
                                                                <div id="tab-review" className="tab-content">
                                                                    <TabReview reviews = {this.state.pubObj.Reviews}/>
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
                </div>
                <Footer />

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