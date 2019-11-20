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
import DatePicker from './datePicker';
import RelatedPublications from './relatedPublications';
import TabReview from './tabReview';
import Footer from "../../footer/footer";
import Map from '../map/Map';
import ModalReqInfo from './modalReqInfo';
import ModalSummary from './modalSummary';
import TabQuestions from './tabQuestions';

class ViewPublication extends React.Component {

    constructor(props) {
        super(props);
        const pubID = props.match.params.publicationID;

        this.state = {
            pubID               : pubID,
            pubObj              : null,
            activeImage         : null,
            date                : new Date(),
            quantityPlan        : 1,
            tabDisplayed        : 1,
            relatedPublications : [],
            facilities          : [],
            pubIsLoading        : true,
            infIsLoading        : true,
            planChosen          : "HourPrice",
            quantityPeople      : 1,
            generalError        : false,
            hoursAvailable      : ["00", '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13'
                                    , '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'],
            hourFromSelect      : '00',
            hourToSelect        : '01',
            reservationComment  : "",
            totalPrice          : 0
        }
        this.modalElement           = React.createRef(); // Connects the reference to the modal
        this.modalSummaryElement    = React.createRef(); // Connects the reference to the modal
        this.loadPublication        = this.loadPublication.bind(this);
        this.redirectToPub          = this.redirectToPub.bind(this);
        this.submitFavorite         = this.submitFavorite.bind(this);
        this.handleErrors           = this.handleErrors.bind(this);
        this.modalSave              = this.modalSave.bind(this);
        this.confirmReservation     = this.confirmReservation.bind(this);
        this.loadPublication(pubID);
    }

    componentDidMount() {
        this.loadInfraestructure();
        this.setInitialHour();
        window.scrollTo(0, 0);
    }

    setInitialHour(){
        var today = new Date();
        var hourFromSelect = today.getHours();
        this.changeHour({target : {value : hourFromSelect, id: "hourFromSelect" }})

    }

    handleErrors(error) {
        this.setState({ generalError: true });
    }

    onChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value
        });
    }

    handleChange = (e) => {
        this.setState({
            date: e
        });
    }

    increaseQuantityPlan() {
        this.setState({ quantityPlan: parseInt(this.state.quantityPlan) + 1 });
    }

    decreaseQuantityPlan() {
        if (parseInt(this.state.quantityPlan) > 1) {
            this.setState({ quantityPlan: parseInt(this.state.quantityPlan) - 1 });
        }
    }

    changeQuantityPlan(value) {
        if (parseInt(value) > 0) {
            this.setState({ quantityPlan: parseInt(value) });
        }
    }

    increaseQuantityPeople() {
        this.setState({ quantityPeople: parseInt(this.state.quantityPeople) + 1 });
    }

    decreaseQuantityPeople() {
        if (parseInt(this.state.quantityPeople) > 1) {
            this.setState({ quantityPeople: parseInt(this.state.quantityPeople) - 1 });
        }
    }

    changeQuantityPeople(value) {
        if (parseInt(value) > 0) {
            this.setState({ quantityPeople: parseInt(value) });
        }
    }

    loadInfraestructure() {
        try {
            fetch('https://localhost:44372/api/facilities').then(response => response.json()).then(data => {
                console.log("data:" + JSON.stringify(data));
                if (data.responseCode == "SUCC_FACILITIESOK") {
                    this.setState({ facilities: data.facilities, infIsLoading: false });
                } else {
                    this.setState({ infIsLoading: false });

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

    loadPublication(pubID) {
        try {
            var url = 'https://localhost:44372/api/publication?idPublication=' + pubID + '&mail';
            if (this.props.userData.Mail != null) {
                url = url + '=' + this.props.userData.Mail;
            }
            this.setState({ pubIsLoading: true });
            fetch(url).then(response => response.json()).then(data => {
                console.log("data:");
                console.log(data);
                if (data.responseCode == "SUCC_PUBLICATIONSOK") {
                    var pubObj = data.Publication;
                    pubObj.Favorite = data.Favorite;
                    var defaultPlanSelected = "";
                    if (pubObj.HourPrice > 0) { defaultPlanSelected = "HourPrice"; } else if (pubObj.DailyPrice > 0) { defaultPlanSelected = "DailyPrice" } else if (pubObj.WeeklyPrice > 0) { defaultPlanSelected = "WeeklyPrice"; } else if (pubObj.MonthlyPrice > 0) { defaultPlanSelected = "MonthlyPrice"; }
                    this.setState({
                        pubIsLoading: false, pubObj: pubObj, activeImage: { index: 0, src: pubObj.ImagesURL[0] },
                        relatedPublications: data.RelatedPublications, planChosen: defaultPlanSelected
                    });
                } else {
                    this.setState({ pubIsLoading: false });
                    if (data.responseCode == 'ERR_SPACENOTFOUND') {
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
    }

    submitFavorite() {
        var code = this.state.pubObj.Favorite === false ? 1 : 2;
        var fetchUrl = '';
        var method = "";

        var objToSend = {
            "AccessToken": this.props.tokenObj.accesToken,
            "Mail": this.props.userData.Mail,
            "IdPublication": this.state.pubObj.IdPublication,
            "Code": code
        }
        fetchUrl = "https://localhost:44372/api/favorite";
        method = "POST";
        fetch(fetchUrl, {
            method: method,
            header: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify(objToSend)
        }).then(response => response.json()).then(data => {
            console.log("data:" + JSON.stringify(data));
            if (data.responseCode == "SUCC_FAVORITEUPDATED") {
                this.setState({ pubObj: { ...this.state.pubObj, Favorite: code === 1 ? true : false } })
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

    redirectToPub(id) {
        this.props.history.push('/publications/viewPublication/viewPublication/' + id);
        window.location.reload();
    }

    changeImage(image, index) {
        this.setState({ activeImage: { index: index, src: image } })
    }

    goToTab(tab) {
        this.setState({ tabDisplayed: tab })
    }

    modalSave(textboxValue, modalRef) {
        this.modalElement.current.changeModalLoadingState(true);
    }

    confirmReservation(){
        var objToSend = {}
        var fetchUrl = 'https://localhost:44372/api/reservation';
        var method = "POST";
        var PlanSelected = "";
        switch(this.state.planChosen){
            case "HourPrice": PlanSelected ="Hour";break;
            case "DailyPrice": PlanSelected ="Day";break;
            case "WeeklyPrice" : PlanSelected ="Week";break;
            case "MonthlyPrice": PlanSelected ="Month";break;
        }

        var objToSend = {
            "AccessToken": this.props.tokenObj.accesToken,
            "VOReservation": {
                "IdPublication": this.state.pubID,
                "MailCustomer": this.props.userData.Mail,
                "PlanSelected": PlanSelected,
                "ReservedQuantity": this.state.quantityPlan,
                "DateFrom": this.state.date,
                "HourFrom": this.state.hourFromSelect,
                "HourTo": this.state.hourToSelect,
                "People": this.state.quantityPeople,
                "Comment": this.state.reservationComment,
                "TotalPrice": this.state.totalPrice
            }
        }

        this.modalSummaryElement.current.changeModalLoadingState(false);
        fetch(fetchUrl, {
            method: method,
            header: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify(objToSend)
        }).then(response => response.json()).then(data => {
            this.setState({ isLoading: false, buttonIsDisable: false });
            console.log("data:" + JSON.stringify(data));
            if (data.responseCode == "SUCC_RESERVATIONCREATED") {
                toast.success('Su reserva ha sido enviada correctamente, revise su casilla de correo para más informacion. ', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
                this.modalSummaryElement.current.changeModalLoadingState(true);
            } else {
                this.modalSummaryElement.current.changeModalLoadingState(true);
                this.handleErrors(data.responseCode);
            }
        }
        ).catch(error => {
            this.handleErrors(error);
        }
        )
    }

    triggerSummaryModal(){
        var validObj = this.validateReservation();
        if(validObj.valid){
            var planChosenText = "";
            var tmpHfs = 0;
            var tmpHts = 1;
            switch(this.state.planChosen){
                case "HourPrice" : planChosenText = "por hora"; tmpHfs = this.state.hourFromSelect; tmpHts = this.state.hourToSelect == 0 ? 24 : this.state.hourToSelect;  break;
                case "DailyPrice" : planChosenText = "por día"; break;
                case "WeeklyPrice" : planChosenText = "por semana"; break;
                case "MonthlyPrice" : planChosenText = "por mes"; break;
            }
            var totalPrice = (parseInt(tmpHts-tmpHfs) * parseInt(this.state.pubObj[this.state.planChosen]))*parseInt(this.state.quantityPeople);

            this.setState({
                totalPrice : totalPrice
            });
            
            var summaryObject = {
                planChosen: this.state.planChosen,
                planChosenText: planChosenText,
                planValue : this.state.pubObj[this.state.planChosen],
                hourFromSelect : tmpHfs,
                hourToSelect : tmpHts,
                date: this.convertDate(this.state.date),
                quantityPeople : this.state.quantityPeople,
                totalPrice : totalPrice,
            };
            this.modalSummaryElement.current.toggle(summaryObject);
        }else{
            toast.error(validObj.message, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        }
    }

    validateReservation(){
        if(this.state.date){}
        var objResponse = {
            valid : true,
            message : ""
        }
        return objResponse;;
    }

    changeHour = (e) => {
        var newHourFromSelect = this.state.hourFromSelect;
        var newHourToSelect = this.state.hourToSelect;
        if(e.target.id == "hourFromSelect"){
            newHourFromSelect = e.target.value;
            if(parseInt(newHourFromSelect) >= parseInt(newHourToSelect)  ){
                if((parseInt(newHourFromSelect)+1) <= 9){
                    newHourToSelect = "0"+(parseInt(newHourFromSelect)+1);
                }else{
                    newHourToSelect = parseInt(newHourFromSelect)+1;
                    if(newHourToSelect == 24){
                        newHourToSelect = "00";
                    }
                }
            }
        }else{
            // hourToSelect
            newHourToSelect = e.target.value;
            if(parseInt(newHourToSelect) <= parseInt(newHourFromSelect)){
                if((parseInt(newHourFromSelect)-1) <= 9){
                    newHourFromSelect = "0"+(parseInt(newHourToSelect)-1);
                }else{
                    newHourFromSelect = parseInt(newHourFromSelect)-1;
                    if(newHourFromSelect == 0){
                        newHourFromSelect = "00";
                    }
                }
            }
        }
        if(newHourToSelect == "00" && newHourFromSelect == "00"){
            newHourToSelect = "01";
        };
        this.setState({
            hourFromSelect: newHourFromSelect,
            hourToSelect: newHourToSelect
        });
    }

    convertDate(date) {
        var today = new Date(date);
        var dd = today.getDate();
        var mm = today.getMonth() + 1; //January is 0!

        var yyyy = today.getFullYear();
        if (dd < 10) {
            dd = '0' + dd;
        }
        if (mm < 10) {
            mm = '0' + mm;
        }
        var dateConv = yyyy + "-" + mm + '-' + dd;
        return dateConv;
    }

    render() {
        const { login_status } = this.props;
        const options = {
            slideSpeed: 500,
            margin: 10,
            nav: false,
            dots: false,
            responsive: {
                0: {
                    items: 4,
                },
                600: {
                    items: 4,
                },
                1000: {
                    items: 5,
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
                                <ModalReqInfo ref={this.modalElement} modalSave={this.modalSave}
                                    modalConfigObj={{
                                        title: 'Realizar una consulta', mainText: 'Por favor ingrese su consulta aqui y el gestor se comunicara a la brevead',
                                        textboxDisplay: true, textboxLabel: 'Consulta:',
                                    }} />

                                <ModalSummary ref={this.modalSummaryElement} login_status={this.props.login_status} 
                                    confirmReservation={this.confirmReservation} onChange ={this.onChange}/>

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
                                                                                                            ) : (null)}
                                                                                                        </div>)}

                                                                                                <div className="description">{this.state.pubObj.QuantityRented} veces alquilado</div>

                                                                                                <div className="review">
                                                                                                    <div className="rating"><i className={this.state.pubObj.Ranking > 0 ? 'fa fa-star active' : 'fa fa-star'}></i><i className={this.state.pubObj.Ranking > 1 ? 'fa fa-star active' : 'fa fa-star'}></i><i className={this.state.pubObj.Ranking > 2 ? 'fa fa-star active' : 'fa fa-star'}></i><i className={this.state.pubObj.Ranking > 3 ? 'fa fa-star active' : 'fa fa-star'}></i><i className={this.state.pubObj.Ranking > 4 ? 'fa fa-star active' : 'fa fa-star'}></i>&nbsp;&nbsp;&nbsp;</div>
                                                                                                </div>
                                                                                                <div className="review">
                                                                                                    <span> <b>Capacidad: </b></span>{this.state.pubObj.Capacity} personas <br />
                                                                                                </div>
                                                                                                <div className="review">
                                                                                                    <span><b>Precios</b><br /></span>
                                                                                                </div>
                                                                                                <div className="price">
                                                                                                    <span className="col-md-9 center-column">
                                                                                                        {this.state.pubObj.HourPrice > 0 && "Por Hora : $" + this.state.pubObj.HourPrice + " - "}
                                                                                                        {this.state.pubObj.DailyPrice > 0 && "Por Día : $" + this.state.pubObj.DailyPrice + " - "}
                                                                                                        {this.state.pubObj.WeeklyPrice > 0 && "Por Semana : $" + this.state.pubObj.WeeklyPrice + " - "}
                                                                                                        {this.state.pubObj.MonthlyPrice > 0 && "Por Mes : $" + this.state.pubObj.MonthlyPrice}
                                                                                                    </span>
                                                                                                </div>
                                                                                                <div className="review">
                                                                                                    <div className="title-page" >
                                                                                                        <span><b>Disponibilidad</b></span>
                                                                                                    </div>
                                                                                                    <div >
                                                                                                        <span>{this.state.pubObj.Availability}<br /></span>
                                                                                                    </div>
                                                                                                </div>

                                                                                            </div>
                                                                                            <div className="review col-md-4" style={{ marginLeft: '60%' }}>
                                                                                                <div className="title-page">
                                                                                                    <span style={{ marginLeft: '20%' }}><b>Haga su reserva ahora!</b></span>
                                                                                                </div>

                                                                                                <div className="col-md-12" style={{ border: '1px solid dodgerBlue' }}>
                                                                                                    <span><b>Plan</b></span>
                                                                                                    <select style={{ marginLeft: '10%' }} className="browser" id="planChosen" onChange={this.onChange} defaultValue=" -- select an option --">
                                                                                                        {this.state.pubObj.HourPrice > 0 && <option value="HourPrice"> {"Por Hora : $" + this.state.pubObj.HourPrice}</option>}
                                                                                                        {this.state.pubObj.DailyPrice > 0 && <option value="DailyPrice"> {"Por Día : $" + this.state.pubObj.DailyPrice}</option>}
                                                                                                        {this.state.pubObj.WeeklyPrice > 0 && <option value="WeeklyPrice"> {"Por Semana : $" + this.state.pubObj.WeeklyPrice}</option>}
                                                                                                        {this.state.pubObj.MonthlyPrice > 0 && <option value="MonthlyPrice"> {"Por Mes : $" + this.state.pubObj.MonthlyPrice}</option>}
                                                                                                    </select>
                                                                                                    {this.state.planChosen == "HourPrice" ? (
                                                                                                        <div className="cart">
                                                                                                            <div className="add-to-cart d-flex">
                                                                                                                <span><b>Hora</b></span>
                                                                                                                <div style={{ marginLeft: '8%' }} className="browser">
                                                                                                                    <select style={{ marginLeft: '8%' }} className="browser" id="hourFromSelect" 
                                                                                                                        value={this.state.hourFromSelect} onChange={this.changeHour} defaultValue=" -- select an option --">
                                                                                                                        {this.state.hoursAvailable.map((hours) => {
                                                                                                                            return (
                                                                                                                                <option key={'hourTo'+hours} value={hours}>{hours}</option>
                                                                                                                            );
                                                                                                                        })}
                                                                                                                    </select>
                                                                                                                </div>
                                                                                                                <b style={{ marginLeft: '8%' }}>a</b>
                                                                                                                <div className="browser">
                                                                                                                    <select className="browser" id="hourToSelect" 
                                                                                                                    value={this.state.hourToSelect} onChange={this.changeHour} defaultValue=" -- select an option --">
                                                                                                                        {this.state.hoursAvailable.map((hours) => {
                                                                                                                            return (
                                                                                                                                <option key={'hourTo'+hours} value={hours}>{hours}</option>
                                                                                                                            );
                                                                                                                        })}
                                                                                                                    </select>
                                                                                                                </div>
                                                                                                            </div>
                                                                                                        </div>
                                                                                                    ) : (null)}
                                                                                                    <div className="cart">
                                                                                                        <div className="add-to-cart d-flex">
                                                                                                            <span><b>Fecha</b></span>
                                                                                                                <div style={{ marginLeft: '7%' }} className="browser">
                                                                                                                    <DatePicker placeholderText="Fecha"
                                                                                                                        dateFormat="dd/MM/yyyy"
                                                                                                                        selected={this.state.date}
                                                                                                                        minDate={new Date()}
                                                                                                                        selected={new Date()}
                                                                                                                        onSelect={this.handleChange} //when day is clicked
                                                                                                                        onChange={this.handleChange} //only when value has changed
                                                                                                                    />
                                                                                                                </div>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                    
                                                                                                    <div className={this.state.pubObj.state === 3 ? 'hidden' : 'shown'}>
                                                                                                        <div className="cart">
                                                                                                            <div className="add-to-cart d-flex">
                                                                                                                <span><b>Personas</b></span>
                                                                                                                <div style={{ marginLeft: '2%' }} className="quantity">
                                                                                                                    <input type="text" name="quantityPeople" id="quantityPeople" size="2" value={this.state.quantityPeople} onChange={(event) => this.changeQuantityPeople(event.target.value)} />
                                                                                                                    <a id="q_up" onClick={() => this.increaseQuantityPeople()}><i className="fa fa-plus"></i></a>
                                                                                                                    <a id="q_down" onClick={() => this.decreaseQuantityPeople()}><i className="fa fa-minus"></i></a>
                                                                                                                </div>
                                                                                                            </div>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                    <div style={{ marginLeft: '35%' }} className="description add-to-cart d-flex">
                                                                                                        <input type="button" value="Reservar" onClick={() => this.triggerSummaryModal()} className="button" />
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>

                                                                            <div id="tabs" className="htabs">
                                                                                <a href="#tab-description" onClick={() => this.goToTab(1)} {...(this.state.tabDisplayed == 1 ? { className: "selected" } : {})} >Descripción</a>
                                                                                <a href="#tab-questions" onClick={() => this.goToTab(3)} {...(this.state.tabDisplayed == 3 ? { className: "selected" } : {})} >Preguntas (2)</a>
                                                                                <a href="#tab-review" onClick={() => this.goToTab(2)} {...(this.state.tabDisplayed == 2 ? { className: "selected" } : {})} >Reviews ({this.state.pubObj.Reviews.length})</a>
                                                                            </div>
                                                                            {this.state.tabDisplayed === 1 ? (
                                                                                <>
                                                                                    <div id="tab-description" className="tab-content" style={{ display: 'block' }}>

                                                                                        <div dangerouslySetInnerHTML={{ __html: this.state.pubObj.Description }} /><br />

                                                                                        <h5>Dirección</h5>{this.state.pubObj.Address}<br />
                                                                                        <h5>Servicios<br /></h5>

                                                                                        <div className="review">
                                                                                            <span>{this.state.pubObj.Facilities.map((inf, index) => {
                                                                                                let infText = this.state.facilities.filter(function (fac) {
                                                                                                    return parseInt(fac.Code) == parseInt(inf)
                                                                                                });
                                                                                                return (
                                                                                                    <div key={index}>
                                                                                                        <p><i className="fa fa-circle"></i>{infText[0].Description}</p>
                                                                                                    </div>
                                                                                                );
                                                                                            })}<br /></span>
                                                                                        </div>
                                                                                    </div>
                                                                                </>
                                                                            ) : (null)}
                                                                            {this.state.tabDisplayed === 2 ? (
                                                                                <div id="tab-review" className="tab-content">
                                                                                    <TabReview reviews={this.state.pubObj.Reviews} />
                                                                                </div>
                                                                            ) : (null)}
                                                                            {this.state.tabDisplayed === 3 ? (
                                                                                <div id="tab-questions" className="tab-content">
                                                                                    <TabQuestions questions={[]} />
                                                                                </div>
                                                                            ) : (null)}
                                                                            <span><h5>Ubicación</h5><br /></span>
                                                                            {
                                                                                this.state.pubObj &&
                                                                                <Map objGoogleMaps={{ zoom: 17, latitude: this.state.pubObj.Location.Latitude, longitude: this.state.pubObj.Location.Longitude }} />
                                                                            }
                                                                            <RelatedPublications relatedPublications={this.state.relatedPublications} redirectToPub={this.redirectToPub} />
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