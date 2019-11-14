import React from 'react';
import { Redirect } from 'react-router-dom';
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
            quantityPlan: 1,
            tabDisplayed: 1,
            relatedPublications: [],
            facilities: [],
            pubIsLoading : true,
            infIsLoading : true,
            planChosen : "Hours",
            quantityPeople: 1,
            generalError : false,
        }
        this.loadPublication = this.loadPublication.bind(this);
        this.redirectToPub = this.redirectToPub.bind(this);
        this.loadPublication(pubID);
        this.submitFavorite = this.submitFavorite.bind(this);
        this.handleErrors = this.handleErrors.bind(this);
    }

    componentDidMount() {
        this.loadInfraestructure();
        window.scrollTo(0, 0);
    }
    handleErrors(error){
        this.setState({ generalError: true });
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

    increaseQuantityPlan() {
		this.setState({ quantityPlan: parseInt(this.state.quantityPlan)+1});
    }
    
	decreaseQuantityPlan() {
		if(parseInt(this.state.quantityPlan) > 1) {
			this.setState({ quantityPlan: parseInt(this.state.quantityPlan)-1});
		}
    }
    
    changeQuantityPlan(value) {
		if(parseInt(value) > 0) {
			this.setState({ quantityPlan: parseInt(value)});
		}
    }

    increaseQuantityPeople() {
		this.setState({ quantityPeople: parseInt(this.state.quantityPeople)+1});
    }
    
	decreaseQuantityPeople() {
		if(parseInt(this.state.quantityPeople) > 1) {
			this.setState({ quantityPeople: parseInt(this.state.quantityPeople)-1});
		}
    }
    
    changeQuantityPeople(value) {
		if(parseInt(value) > 0) {
			this.setState({ quantityPeople: parseInt(value)});
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
                this.handleErrors(error);
            }
            )
        } catch (error) {
            this.handleErrors(error);
        }
    }
    
    loadPublication(pubID){
        try{
            var url = 'https://localhost:44372/api/publication?idPublication='+pubID+'&mail';
            if(this.props.userData.Mail != null){
                url = url + '=' + this.props.userData.Mail;
            }
            this.setState({ pubIsLoading: true});
            fetch(url).then(response => response.json()).then(data => {
                console.log("data:");
                console.log(data);
                if (data.responseCode == "SUCC_PUBLICATIONSOK") {
                    var pubObj = data.Publication;
                    pubObj.Favorite = data.Favorite;
                    var defaultPlanSelected = "";
                    if(pubObj.HourPrice > 0){ defaultPlanSelected = "Hours"; }else if(pubObj.DailyPrice > 0){defaultPlanSelected = "Days"} else if(pubObj.WeeklyPrice > 0){defaultPlanSelected = "Weeks";}else if(pubObj.MonthlyPrice > 0){defaultPlanSelected = "Months";}
                    this.setState({ pubIsLoading: false, pubObj: pubObj, activeImage: { index: 0, src: pubObj.ImagesURL[0]}, 
                        relatedPublications : data.RelatedPublications, planChosen:defaultPlanSelected });
                } else {
                    this.setState({ pubIsLoading: false});
                    if(data.responseCode == 'ERR_SPACENOTFOUND'){
                        this.handleErrors(data.responseCode);
                    }
                    if (data.Message) {
                        this.handleErrors(data.Message);

                    } else {
                        this.handleErrors("Generic error");
                    }
                }
            }
            ).catch(error => {
                this.handleErrors(error);
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

    submitFavorite() {
        var code = this.state.pubObj.Favorite === false ? 1 : 2;
        var fetchUrl = '';
        var method = "";

        var objToSend = {
            "AccessToken": this.props.tokenObj.accesToken,
            "Mail": this.props.userData.Mail,
            "IdPublication": this.state.pubObj.IdPublication,
            "Code" : code
        }    
        fetchUrl = "https://localhost:44372/api/favorite";
        method = "POST";
        fetch(fetchUrl, {
            method: method,
            header: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify(objToSend)
        }).then(response => response.json()).then(data => {
            console.log("data:" + JSON.stringify(data));
            if (data.responseCode == "SUCC_FAVORITEUPDATED" ) {
                this.setState({ pubObj: { ...this.state.pubObj, Favorite: code === 1 ? true: false}})                
                toast.success(code === 1 ? 'Agregado a favoritos' : 'Quitado de favoritos', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
            } else {
                this.handleErrors("Generic error");
            }
        }
        ).catch(error => {
            this.handleErrors(error);
        }
        )
    }

    redirectToPub(id){
        this.props.history.push('/publications/viewPublication/viewPublication/'+id);
        window.location.reload();
    }

	changeImage(image, index) {
		this.setState({ activeImage: { index: index, src: image } })
    }

    goToTab(tab){
        this.setState({ tabDisplayed: tab })
    }
    render() {
        const { login_status } = this.props;
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
        var loadStatus = !this.state.pubIsLoading && !this.state.infIsLoading ? false : true;
        if (this.state.generalError) return <Redirect to='/error' />
        return (
            <>
                <LoadingOverlay
                    active={loadStatus}
                    spinner
                    text='Cargando...'
                    >
                    {this.state.pubIsLoading == false && this.state.infIsLoading == false ? (
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
                                                                                                {this.state.pubObj.Favorite === false && login_status == 'LOGGED_IN' ? (
                                                                                                <div>
                                                                                                    <a href="#add_to_wishlist" onClick={this.submitFavorite}><span><i className="fas fa-heart"></i></span> Agregar a favoritos</a>
                                                                                                </div> 
                                                                                                ) : (
                                                                                                <div>
                                                                                                    {this.state.pubObj.Favorite === true ? (
                                                                                                    <div>
                                                                                                        <a href="#remove_from_wishlist" onClick={this.submitFavorite}><span><i className="fas fa-heart"></i></span> Quitar de favoritos</a>
                                                                                                    </div>
                                                                                                ) : (null) }
                                                                                                </div>)}
                                                                                                                                                                 
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
                                                                                                
                                                                                            </div>
                                                                                            <div className="review col-md-4" style= {{marginLeft: '60%'}}>
                                                                                                <div className = "title-page">
                                                                                                    <span><b>Haga su reserva ahora!</b></span>
                                                                                                </div>
                                                                                                
                                                                                                <div className="col-md-12" style= {{border: '1px solid dodgerBlue'}}>
                                                                                                    <div>
                                                                                                    <span><b>Plan</b></span>
                                                                                                    <select style= {{marginLeft: '10%'}} className="browser" id= "planChosen" onChange={this.onChange} defaultValue = " -- select an option --">                                                                                                        
                                                                                                        {this.state.pubObj.HourPrice > 0 && <option value="Hours"> {"Por Hora : $"+ this.state.pubObj.HourPrice}</option>}
                                                                                                        {this.state.pubObj.DailyPrice > 0 && <option value="Days"> {"Por Día : $"+ this.state.pubObj.DailyPrice}</option>}
                                                                                                        {this.state.pubObj.WeeklyPrice > 0 && <option value="Weeks"> {"Por Semana : $"+ this.state.pubObj.WeeklyPrice}</option>}
                                                                                                        {this.state.pubObj.MonthlyPrice > 0 && <option value="Months"> {"Por Mes : $"+ this.state.pubObj.MonthlyPrice}</option>}
                                                                                                    </select>                                                                                                    
                                                                                                    <div className="cart">
                                                                                                    <div className="add-to-cart d-flex">                                                                                                        
                                                                                                    <span><b>{this.state.planChosen}</b></span>
                                                                                                        <div className="quantity">
                                                                                                            <input type="text" name="quantity" id="quantity_wanted" size="2" value={this.state.quantityPlan} onChange={(event) => this.changeQuantityPlan(event.target.value)} />
                                                                                                            <a href="#quantity_up" id="q_up" onClick={() => this.increaseQuantityPlan()}><i className="fa fa-plus"></i></a>
                                                                                                            <a href="#quantity_down" id="q_down" onClick={() => this.decreaseQuantityPlan()}><i className="fa fa-minus"></i></a>
                                                                                                        </div>																				
                                                                                                    </div>
                                                                                                    </div>
                                                                                                    <span><b>Desde</b></span>
                                                                                                    <DatePicker placeholderText="Fecha"
                                                                                                        dateFormat="dd/MM/yyyy"
                                                                                                        selected={this.state.date}
                                                                                                        onSelect={this.handleSelect} //when day is clicked
                                                                                                        onChange={this.handleChange} //only when value has changed
                                                                                                    />
                                                                                                    <div className={ this.state.pubObj.state === 3 ? 'hidden' : 'shown'}>
                                                                                                        <div className="cart">
                                                                                                            <div className="add-to-cart d-flex">                                                                                                        
                                                                                                                <span><b>Personas</b></span>
                                                                                                                <div className="quantity">
                                                                                                                    <input type="text" name="quantity" id="quantity_wanted" size="2" value={this.state.quantityPeople} onChange={(event) => this.changeQuantityPeople(event.target.value)} />
                                                                                                                    <a href="#quantity_up" id="q_up" onClick={() => this.increaseQuantityPeople()}><i className="fa fa-plus"></i></a>
                                                                                                                    <a href="#quantity_down" id="q_down" onClick={() => this.decreaseQuantityPeople()}><i className="fa fa-minus"></i></a>
                                                                                                                </div>																				
                                                                                                            </div>
                                                                                                        </div>
                                                                                                    </div>                                                                                                    
                                                                                                    <div className="description add-to-cart d-flex">
                                                                                                            <input type="button" value="Reservar" onClick={() => alert("Ver resumen de la reserva, incluyendo el monto total para pagar y explicando el procedimiento")} className="button" /> 
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
                                                                                    
                                                                                    <h5>Dirección</h5>{this.state.pubObj.Address}<br/>
                                                                                    <h5>Servicios<br/></h5>
                                                                                
                                                                                    <div className="review">
                                                                                        <span>{this.state.pubObj.Facilities.map((inf, index) => {
                                                                                            let infText = this.state.facilities.filter( function(fac){
                                                                                                return parseInt(fac.Code) == parseInt(inf)
                                                                                            });
                                                                                            return (
                                                                                                <div key={index}>
                                                                                                    <p><i className="fa fa-circle"></i>{infText[0].Description}</p>
                                                                                                </div>
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

                                                                        <RelatedPublications relatedPublications={this.state.relatedPublications} redirectToPub={this.redirectToPub}/>

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
        tokenObj: state.loginData.tokenObj,
        userData: state.loginData.userData
    }
}

export default connect(mapStateToProps)(ViewPublication);