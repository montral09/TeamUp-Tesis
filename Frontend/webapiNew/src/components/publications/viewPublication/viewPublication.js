import React from 'react';
import Header from "../../header/header";
import { Helmet } from 'react-helmet';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { connect } from 'react-redux';
import LoadingOverlay from 'react-loading-overlay';


import OwlCarousel from 'react-owl-carousel2';
import 'react-owl-carousel2/src/owl.carousel.css';
import InnerImageZoom from 'react-inner-image-zoom';
import DatePicker from  './datePicker';
import RelatedPublications from './relatedPublications';
import TabReview from './tabReview';
import Footer from "../../footer/footer";
import Map from '../map/Map';



class ViewPublication extends React.Component {

    constructor(props) {
        super(props);
        const pubID = props.match.params.publicationID;
        
        this.state = {
            pubID: pubID,
            pubObj: null,
            activeImage: null,
            date: null,
            quantity: 1,
            tabDisplayed: 1,
            relatedPublications: this.loadDummyRelatedPublications(pubID),
            facilities: [],
            pubIsLoading : true,
            infIsLoading : true,
        }
        this.loadPublication = this.loadPublication.bind(this);
        this.loadPublication(pubID);
    }

    componentDidMount() {
        this.loadInfraestructure();
        window.scrollTo(0, 0);
    }

    onChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value
        });
    }

    handleSelect = (e) => {
        this.setState({
            date: e
        });
    }

    handleChange = (e) => {
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

    loadInfraestructure() {
        try {
            fetch('https://localhost:44372/api/facilities').then(response => response.json()).then(data => {
                console.log("data:" + JSON.stringify(data));
                if (data.responseCode == "SUCC_FACILITIESOK") {
                    this.setState({ facilities: data.facilities, infIsLoading: false });
                } else {
                    this.setState({ infIsLoading: false});

                    toast.error('Internal error', {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                    });
                }
            }
            ).catch(error => {
                this.setState({ infIsLoading: false});
                toast.error('Internal error', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
                console.log(error);
            }
            )
        } catch (error) {
            this.setState({ infIsLoading: false});
            toast.error('Internal error', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        }
    }
    loadPublication(pubID){
        try{
            var email ="";
            if(this.props.userData){
                email = this.props.userData.Mail;
            }
            console.log("pubID:"+pubID);
            console.log("email:"+email);
            this.setState({ pubIsLoading: true});
            fetch('https://localhost:44372/api/publication?idPublication='+pubID+'&mail=').then(response => response.json()).then(data => {
                console.log("data:" + JSON.stringify(data));
                if (data.responseCode == "SUCC_PUBLICATIONSOK") {
                    var pubObj = data.Publication;
                    pubObj.Favorite = data.Favorite;
                    console.log("pubObj:");
                    console.log(pubObj);

                    this.setState({ pubIsLoading: false, pubObj: pubObj, activeImage: { index: 0, src: pubObj.ImagesURL[0]}});
                } else {
                    this.setState({ pubIsLoading: false});
                    if(data.responseCode == 'ERR_SPACENOTFOUND'){
                        console.log("espacio no encontrado");
                    }
                    if (data.Message) {
                        toast.error('Hubo un error: ' + data.Message, {
                            position: "top-right",
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                        });
                    } else {
                        toast.error('Internal error', {
                            position: "top-right",
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                        });
                    }
                }
            }
            ).catch(error => {
                this.setState({ pubIsLoading: false, buttonIsDisable: false });
                toast.error('Internal error', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
                console.log(error);
            }
            )
        }catch(error){
            toast.error('Internal error', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        }
    }

    loadDummyRelatedPublications(pubID) {
        // load api
        let related = [ 
                
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
        ] ;
        return related;
    }

	changeImage(image, index) {
		this.setState({ activeImage: { index: index, src: image } })
    }

    goToTab(tab){
        this.setState({ tabDisplayed: tab })
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
                <LoadingOverlay
                    active={ this.state.pubIsLoading || this.state.infIsLoading ? true : false}
                    spinner
                    text='Cargando...'
                    >
                    {this.state.pubObj != null ? (
                        <>
                            {/*SEO Support*/}
                            <Helmet>
                                <title>TeamUp | {this.state.pubObj.Title}</title>
                                <meta name="description" content={this.state.pubObj.Title} />
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
                                                                                                        {this.state.pubObj.ImagesURL.map((image, index) => {
                                                                                                            return (
                                                                                                                <div className="owl-item" key={index}><p><a href="#product_image" className={this.state.activeImage.index === index ? 'popup-image active' : 'popup-image'} onClick={() => this.changeImage(image, index)}><img src={image} title={this.state.pubObj.Title} alt={this.state.pubObj.Title} /></a></p></div>
                                                                                                            );
                                                                                                        })}
                                                                                                    </OwlCarousel>
                                                                                                </div>
                                                                                            </div>
                                                                                            <div className="col-md-5 product-center clearfix">
                                                                                                <h1 className="product-name">{this.state.pubObj.Title}</h1>      
                                                                                                {this.state.pubObj.Favorite === false ? (
                                                                                                    <a href="#add_to_wishlist" onClick={() => alert("Agregar a favoritos si esta logueado")}><span><i className="fas fa-heart"></i></span> Agregar a favoritos</a>
                                                                                                ) : (
                                                                                                    <a href="#remove_from_wishlist" onClick={() => alert("Quitar a favoritos si esta logueado")}><span><i className="fas fa-heart"></i></span> Quitar de favoritos</a>
                                                                                                )}                                                                              
                                                                                                <div className="description">{this.state.pubObj.QuantityRented} veces alquilado</div>
                                                                                                    
                                                                                                <div className="review">
                                                                                                    <div className="rating"><i className={this.state.pubObj.Ranking > 0 ? 'fa fa-star active' : 'fa fa-star'}></i><i className={this.state.pubObj.Ranking > 1 ? 'fa fa-star active' : 'fa fa-star'}></i><i className={this.state.pubObj.Ranking > 2 ? 'fa fa-star active' : 'fa fa-star'}></i><i className={this.state.pubObj.Ranking > 3 ? 'fa fa-star active' : 'fa fa-star'}></i><i className={this.state.pubObj.Ranking > 4 ? 'fa fa-star active' : 'fa fa-star'}></i>&nbsp;&nbsp;&nbsp;</div>
                                                                                                </div>
                                                                                                <div className="review">
                                                                                                    <span> <b>Capacidad: </b></span>{this.state.pubObj.Capacity} personas <br />
                                                                                                </div>
                                                                                                <div className="review">
                                                                                                    <span><b>Precios</b><br/></span>
                                                                                                </div>
                                                                                                <div className="price">
                                                                                                    <span className="col-md-9 center-column">
                                                                                                    {this.state.pubObj.HourPrice > 0 && "Por Hora : $"+ this.state.pubObj.HourPrice + " - " }
                                                                                                    {this.state.pubObj.DailyPrice > 0 && "Por Día : $"+ this.state.pubObj.DailyPrice + " - "}
                                                                                                    {this.state.pubObj.WeeklyPrice > 0 && "Por Semana : $"+ this.state.pubObj.WeeklyPrice + " - "}
                                                                                                    {this.state.pubObj.MonthlyPrice > 0 && "Por Mes : $"+ this.state.pubObj.MonthlyPrice}

                                                                                                    </span>
                                                                                                </div>
                                                                                                <div className="review">
                                                                                                    <div className="title-page" > 
                                                                                                        <span><b>Disponibilidad</b></span>
                                                                                                    </div>
                                                                                                    <div >
                                                                                                        <span>{this.state.pubObj.Availability}<br/></span>
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
                                                                                <a href="#tab-description" onClick={() => this.goToTab(1)} {...(this.state.tabDisplayed == 1 ? {className :"selected"} : {})} >Descripción</a>
                                                                                <a href="#tab-review" onClick={() => this.goToTab(2)} {...(this.state.tabDisplayed == 2 ? {className :"selected"} : {})} >Reviews ({this.state.pubObj.Reviews.length})</a>
                                                                            </div>
                                                                            { this.state.tabDisplayed === 1 ? (
                                                                                <>
                                                                                <div id="tab-description" className="tab-content" style={{ display: 'block' }}>
                                                                                    <div dangerouslySetInnerHTML={{ __html: this.state.pubObj.Description }} /><br/>
                                                                                    <h5>Servicios<br/></h5>
                                                                                
                                                                                    <div className="review">
                                                                                        <span>{this.state.pubObj.Facilities.map((inf, index) => {
                                                                                            let infText = this.state.facilities.filter( function(fac){
                                                                                                return parseInt(fac.Code) == parseInt(inf)
                                                                                            });
                                                                                            return (
                                                                                                <div className="owl-item" key={index}><p>{infText[0].Description}</p></div>
                                                                                            );
                                                                                            })}<br/></span>
                                                                                    </div>
                                                                                </div>
                                                                                </>
                                                                            ) : (null)}
                                                                            { this.state.tabDisplayed === 2 ? (
                                                                                <div id="tab-review" className="tab-content">
                                                                                    <TabReview reviews = {this.state.pubObj.Reviews}/>
                                                                                </div>
                                                                            ) : (null)}
                                                                            <span><h5>Ubicación</h5><br/></span>
                                                                            {
                                                                                this.state.pubObj &&
                                                                                <Map objGoogleMaps = {{zoom : 17, latitude: this.state.pubObj.Location.Latitude, longitude: this.state.pubObj.Location.Longitude}}/>
                                                                            }

                                                                        <RelatedPublications relatedPublications={this.state.relatedPublications} />

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
                    ) : (null)}



                </LoadingOverlay>


            </>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        login_status: state.loginData.login_status,
        userData: state.loginData.userData
    }
}

export default connect(mapStateToProps)(ViewPublication);