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
import TabYoutube from './tabYoutube';

import { callAPI } from '../../../services/common/genericFunctions';
// Multilanguage
import { withTranslate } from 'react-redux-multilingual'
import { compose } from 'redux';

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
            totalPrice          : 0,
            arrQA               : [],
            modalConfigObj      : null
        }
        this.modalReqInfo           = React.createRef(); // Connects the reference to the modal
        this.modalSummaryElement    = React.createRef(); // Connects the reference to the modal
        this.bindFunctions();
        this.loadPublicationVP(pubID);
    }

    bindFunctions(){
        this.redirectToPub          = this.redirectToPub.bind(this);
        this.reservationSuccess     = this.reservationSuccess.bind(this);
        this.triggerModal           = this.triggerModal.bind(this);
        this.triggerSaveModal       = this.triggerSaveModal.bind(this);
    }

    componentDidMount() {
        this.loadInfraestructureVP();
        this.setInitialHour();
        window.scrollTo(0, 0);
    }

    setInitialHour(){
        var today = new Date();
        var hourFromSelect = today.getHours();
        this.changeHour({target : {value : hourFromSelect, id: "hourFromSelect" }})

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

    increaseQuantityPeople() {
        this.setState({ quantityPeople: parseInt(this.state.quantityPeople) + 1 });
    }

    decreaseQuantityPeople() {
        if (parseInt(this.state.quantityPeople) > 1) {
            this.setState({ quantityPeople: parseInt(this.state.quantityPeople) - 1 });
        }
    }

    increaseQuantityPlan() {
        this.setState({ quantityPlan: parseInt(this.state.quantityPlan) + 1 });
    }

    decreaseQuantityPlan() {
        if (parseInt(this.state.quantityPlan) > 1) {
            this.setState({ quantityPlan: parseInt(this.state.quantityPlan) - 1 });
        }
    }

    changeQuantityPeople(value) {
        if (parseInt(value) > 0) {
            this.setState({ quantityPeople: parseInt(value) });
        }
    }

    changeQuantityPlan(value) {
        if (parseInt(value) > 0) {
            this.setState({ quantityPlan: parseInt(value) });
        }
    }
    loadInfraestructureVP = () => {
        var objApi = {};
        objApi.objToSend = {}
        objApi.fetchUrl = "api/facilities";
        objApi.method = "GET";
        objApi.successMSG = {
            SUCC_FACILITIESOK : "",
        };
        objApi.functionAfterSuccess = "loadInfraestructureVP";
        objApi.functionAfterError = "loadInfraestructureVP";
        objApi.errorMSG= {}
        callAPI(objApi, this);
    }
    loadPublicationVP = (pubID) => {
        var objApi = {};
        objApi.objToSend = {}
        var url = 'api/publication?idPublication=' + pubID + '&mail';
        if (this.props.userData.Mail != null) {
            url = url + '=' + this.props.userData.Mail;
        }
        objApi.fetchUrl = url;
        objApi.method = "GET";
        objApi.successMSG = {
            SUCC_PUBLICATIONSOK : "",
        };
        objApi.functionAfterSuccess = "loadPublicationVP";
        objApi.functionAfterError = "loadPublicationVP";
        objApi.errorMSG= {}
        if(this.state.pubIsLoading == false) this.setState({ pubIsLoading: true });

        callAPI(objApi, this);
    }

    submitFavoriteVP = () => {
        var objApi = {};
        var code = this.state.pubObj.Favorite === false ? 1 : 2;
        objApi.objToSend = {
            "AccessToken": this.props.tokenObj.accesToken,
            "Mail": this.props.userData.Mail,
            "IdPublication": this.state.pubObj.IdPublication,
            "Code": code
        }

        objApi.fetchUrl = 'api/favorite';
        objApi.method = "POST";
        objApi.successMSG = {
            SUCC_FAVORITEUPDATED : code === 1 ? this.props.translate('viewPub_addedToFav') : this.props.translate('viewPub_removedFromFav'),
        };
        objApi.functionAfterSuccess = "submitFavoriteVP";
        objApi.functionAfterError = "submitFavoriteVP";
        objApi.errorMSG= {}
        this.setState({ pubIsLoading: true });
        callAPI(objApi, this);
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

    reservationSuccess(textboxValue, modalRef) {
        this.modalReqInfo.current.changeModalLoadingState(true);
    }
    confirmReservationVP = (comment) => {
        var objApi = {};var PlanSelected="";
        switch(this.state.planChosen){
            case "HourPrice": PlanSelected ="Hour";break;
            case "DailyPrice": PlanSelected ="Day";break;
            case "WeeklyPrice" : PlanSelected ="Week";break;
            case "MonthlyPrice": PlanSelected ="Month";break;
        }
        objApi.objToSend = {
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
                "Comment": comment,
                "TotalPrice": this.state.totalPrice
            }
        }

        objApi.fetchUrl = 'api/reservation';
        objApi.method = "POST";
        objApi.successMSG = {
            SUCC_RESERVATIONCREATED : "",
        };
        objApi.functionAfterSuccess = "confirmReservationVP";
        objApi.functionAfterError = "confirmReservationVP";
        objApi.errorMSG= {}
        this.modalSummaryElement.current.changeModalLoadingState(false);
        callAPI(objApi, this);
    }


    triggerSummaryModal(){
        const { translate } = this.props;
        var validObj = this.validateReservation();
        if(validObj.valid){
            var planChosenText = "";
            var planChosenQuantityDescription = "";
            var tmpHfs = 0;
            var tmpHts = 1;
            switch(this.state.planChosen){
                case "HourPrice" : planChosenText = "por hora"; planChosenQuantityDescription = ""; tmpHfs = this.state.hourFromSelect; tmpHts = this.state.hourToSelect == 0 ? 24 : this.state.hourToSelect;  break;
                case "DailyPrice" : planChosenText = "por día"; planChosenQuantityDescription = translate('planChosenQuantityDescriptionDays_w'); break;
                case "WeeklyPrice" : planChosenText = "por semana"; planChosenQuantityDescription = translate('planChosenQuantityDescriptionWeeks_w'); break;
                case "MonthlyPrice" : planChosenText = "por mes"; planChosenQuantityDescription = translate('planChosenQuantityDescriptionMonths_w'); break;
            }
            var totalPrice = (parseInt(tmpHts-tmpHfs) * parseInt(this.state.pubObj[this.state.planChosen]) * parseInt(this.state.quantityPlan));
            if(this.state.pubObj.IndividualRent == true){
                totalPrice = totalPrice * parseInt(this.state.quantityPeople);
            }
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
                planChosenQuantityDescription: planChosenQuantityDescription,
                quantityPlan: this.state.quantityPlan
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
        var dateConv = dd + "-" + mm + '-' + yyyy;
        return dateConv;
    }

    triggerModal(objTrigger){
        var modalConfigObj = {};
        if(objTrigger.mode === "ANSWER"){
            modalConfigObj ={
                title: 'Responder', mainText: <><strong>Pregunta:</strong><em>{' "'+objTrigger.questionObj.Question+'"'}</em></>, mode : objTrigger.mode, saveFunction : "saveAnswerVP", textboxLabel: 'Respuesta',
                textboxDisplay:true, cancelAvailable:true, confirmAvailable:true, cancelText :'Cancelar', confirmText :'Responder' , login_status: this.props.login_status, IdQuestion : objTrigger.questionObj.IdQuestion
            };
        }else{
            modalConfigObj ={
                title: 'Reserva enviada', mainText: 'Su reserva ha sido enviada correctamente, revise su casilla de correo para más informacion. ',
                textboxDisplay: false, cancelAvailable: true, cancelText : 'Entendido', mode : objTrigger.mode, saveFunction : "reservationSuccess"
            };
        }
        this.setState({modalConfigObj : modalConfigObj},() => {this.modalReqInfo.current.toggle();})
    }

    triggerSaveModal(saveFunction, objData){
        switch(saveFunction){
            case "reservationSuccess": this.reservationSuccess();break;
            case "saveAnswerVP": this.saveAnswerVP(objData.textboxValue);break;
        }
    }

    saveAnswerVP = (answer) => {
        var objApi = {};
        objApi.objToSend = {
            "AccessToken": this.props.tokenObj.accesToken,
            "Mail": this.props.userData.Mail,
            "IdQuestion": this.state.modalConfigObj.IdQuestion,
            "Answer": answer
        }
        objApi.fetchUrl = 'api/publicationQuestions';
        objApi.method = "PUT";
        objApi.successMSG = {
            SUCC_ANSWERCREATED : this.props.translate('SUCC_ANSWERCREATED'),
        };
        objApi.functionAfterSuccess = "saveAnswerVP";
        objApi.functionAfterError = "saveAnswerVP";
        objApi.errorMSG= {}
        this.modalReqInfo.current.changeModalLoadingState(false);
        callAPI(objApi, this);
    }

    saveQuestionVP = (question, tabQuestionThis) => {
        var objApi = {};
        objApi.objToSend = {
            "AccessToken": this.props.tokenObj.accesToken,
            "Mail": this.props.userData.Mail,
            "IdPublication": this.state.pubID,
            "Question": question
        }
        objApi.fetchUrl = 'api/publicationQuestions';
        objApi.method = "POST";
        objApi.successMSG = {
            SUCC_QUESTIONCREATED : this.props.translate('SUCC_QUESTIONCREATED'),
        };
        objApi.functionAfterSuccess = "saveQuestionVP";
        objApi.functionAfterError = "saveQuestionVP";
        objApi.errorMSG= {};
        objApi.tabQuestionThis = tabQuestionThis;
        tabQuestionThis.setState({isLoading : true})
        callAPI(objApi, this);
    }

    render() {
        const { login_status } = this.props;
        const options = {
            slideSpeed: 500,
            margin: 10,
            nav: false,
            dots: false,
            video: true,
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
        const { translate } = this.props;
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
                                <ModalReqInfo ref={this.modalReqInfo} triggerSaveModal={this.triggerSaveModal}
                                    modalConfigObj={this.state.modalConfigObj} />

                                <ModalSummary ref={this.modalSummaryElement} login_status={this.props.login_status} 
                                    confirmReservation={this.confirmReservationVP} onChange ={this.onChange}/>

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
                                                                                                        <div className="sale">{translate('recommended_w')}</div>
                                                                                                    }
                                                                                                    {<InnerImageZoom src={this.state.activeImage.src} />}
                                                                                                </div>
                                                                                                <div className="overflow-thumbnails-carousel">
                                                                                                    <OwlCarousel options={options} className="thumbnails-carousel owl-carousel">
                                                                                                        {this.state.pubObj.ImagesURL.map((image, index) => {
                                                                                                            return (
                                                                                                                <div className="owl-item" key={index}><p><a href="#product_image" className={this.state.activeImage.index === index ? 'popup-image active' : 'popup-image'} onClick={() => this.changeImage(image, index)}><img src={image} onError={(e)=>{e.target.onerror = null; e.target.src="../../../images/no-image-available.png"}} title={this.state.pubObj.Title} alt={this.state.pubObj.Title} /></a></p></div>
                                                                                                            );
                                                                                                        })}
                                                                                                    </OwlCarousel>
                                                                                                </div>
                                                                                            </div>
                                                                                            <div className="col-md-5 product-center clearfix">
                                                                                                <h1 className="product-name">{this.state.pubObj.Title}</h1>
                                                                                                {this.state.pubObj.Favorite === false && login_status == 'LOGGED_IN' ? (
                                                                                                    <div>
                                                                                                        <a href="#" onClick={this.submitFavoriteVP}><span><i className="fas fa-heart"></i></span> {translate('viewPub_addToFav')}</a>
                                                                                                    </div>
                                                                                                ) : (
                                                                                                        <div>
                                                                                                            {this.state.pubObj.Favorite === true ? (
                                                                                                                <div>
                                                                                                                    <a href="#" onClick={this.submitFavoriteVP}><span><i className="fas fa-heart"></i></span>  {translate('viewPub_remToFav')}</a>
                                                                                                                </div>
                                                                                                            ) : (null)}
                                                                                                        </div>)}

                                                                                                <div className="description">{this.state.pubObj.QuantityRented} {translate('viewPub_timesRented')}</div>

                                                                                                <div className="review">
                                                                                                    <div className="rating"><i className={this.state.pubObj.Ranking > 0 ? 'fa fa-star active' : 'fa fa-star'}></i><i className={this.state.pubObj.Ranking > 1 ? 'fa fa-star active' : 'fa fa-star'}></i><i className={this.state.pubObj.Ranking > 2 ? 'fa fa-star active' : 'fa fa-star'}></i><i className={this.state.pubObj.Ranking > 3 ? 'fa fa-star active' : 'fa fa-star'}></i><i className={this.state.pubObj.Ranking > 4 ? 'fa fa-star active' : 'fa fa-star'}></i>&nbsp;&nbsp;&nbsp;</div>
                                                                                                </div>
                                                                                                <div className="review">
                                                                                                    <span> <b>{translate('capacity_w')}: </b></span>{this.state.pubObj.Capacity} {translate('people_w')} <br />
                                                                                                </div>
                                                                                                <div className="review">
                                                                                                    <span><b>{translate('prices_w')}</b></span>
                                                                                                </div>
                                                                                                <div className="price">
                                                                                                    <span className="col-md-4 center-column">
                                                                                                        <b>{translate('hour_w')}</b>{this.state.pubObj.HourPrice != 0 ? " $" + this.state.pubObj.HourPrice : " -"}&nbsp;&nbsp;
                                                                                                        <b>{translate('day_w')}</b>{this.state.pubObj.DailyPrice != 0 ? " $" + this.state.pubObj.DailyPrice : " -"}&nbsp;&nbsp;<br />
                                                                                                        <b>{translate('week_w')}</b>{this.state.pubObj.WeeklyPrice != 0 ? " $" + this.state.pubObj.WeeklyPrice : " -"}&nbsp;&nbsp;
                                                                                                        <b>{translate('month_w')}</b>{this.state.pubObj.MonthlyPrice != 0 ? " $" + this.state.pubObj.MonthlyPrice : " -"}&nbsp;&nbsp;
                                                                                                    </span>
                                                                                                </div>
                                                                                                <div className="review">
                                                                                                    <div className="title-page" >
                                                                                                        <span><b>{translate('availability_w')}</b></span>
                                                                                                    </div>
                                                                                                    <div >
                                                                                                        <span>{this.state.pubObj.Availability}<br /></span>
                                                                                                    </div>
                                                                                                </div>

                                                                                            </div>
                                                                                            <div className="review col-md-7">
                                                                                                <span><h5>{translate('location_w')}</h5><br /></span>
                                                                                                    {
                                                                                                        this.state.pubObj &&
                                                                                                        <Map objGoogleMaps={{ zoom: 17, latitude: this.state.pubObj.Location.Latitude, longitude: this.state.pubObj.Location.Longitude }} />
                                                                                                    }
                                                                                                </div>
                                                                                            <div className="review col-md-1"></div>
                                                                                            <div className="review col-md-4"><br />
                                                                                                <div className="title-page">
                                                                                                    <h5><span style={{ marginLeft: '20%' }}><b>{translate('viewPub_rentNow')}</b></span></h5>
                                                                                                </div>
                                                                                                <br />
                                                                                                <div className="col-md-12" style={{ border: '0.5px solid dodgerBlue' }}>
                                                                                                    <span style={{ marginLeft: '10%' }} ><b>Plan</b></span>
                                                                                                    <select style={{ marginLeft: '10%' }} className="browser" id="planChosen" onChange={this.onChange} >
                                                                                                        {this.state.pubObj.HourPrice > 0 && <option value="HourPrice"> {translate('hourlyPrice_w')+": $" + this.state.pubObj.HourPrice}</option>}
                                                                                                        {this.state.pubObj.DailyPrice > 0 && <option value="DailyPrice"> {translate('dailyPrice_w')+": $" +this.state.pubObj.DailyPrice}</option>}
                                                                                                        {this.state.pubObj.WeeklyPrice > 0 && <option value="WeeklyPrice"> {translate('weeklyPrice_w')+": $" + this.state.pubObj.WeeklyPrice}</option>}
                                                                                                        {this.state.pubObj.MonthlyPrice > 0 && <option value="MonthlyPrice"> {translate('monthlyPrice_w')+": $" + this.state.pubObj.MonthlyPrice}</option>}
                                                                                                    </select>
                                                                                                    {this.state.planChosen != "HourPrice" ? (
                                                                                                        <div className="cart">
                                                                                                            <div style={{ marginLeft: '10%' }} className="add-to-cart d-flex" >
                                                                                                                <span><b>
                                                                                                                    {this.state.planChosen == "DailyPrice" ? translate('planChosenQuantityDescriptionDays_w'): ''}
                                                                                                                    {this.state.planChosen == "WeeklyPrice" ? translate('planChosenQuantityDescriptionWeeks_w'): ''}
                                                                                                                    {this.state.planChosen == "MonthlyPrice" ? translate('planChosenQuantityDescriptionMonths_w'): ''}
                                                                                                                </b></span>
                                                                                                                <div style={{ marginLeft: '10%' }} className="quantity">
                                                                                                                    <input type="text" name="quantityPlan" id="quantityPlan" size="4" value={this.state.quantityPlan} onChange={(event) => this.changeQuantityPlan(event.target.value)} />
                                                                                                                    <a id="q_up" onClick={() => this.increaseQuantityPlan()}><i className="fa fa-plus"></i></a>
                                                                                                                    <a id="q_down" onClick={() => this.decreaseQuantityPlan()}><i className="fa fa-minus"></i></a>
                                                                                                                </div>
                                                                                                            </div>                                                                                                            
                                                                                                         </div>
                                                                                                        ) : (null) }
                                                                                                    {this.state.planChosen == "HourPrice" ? (
                                                                                                        <div style={{ marginLeft: '10%' }} className="cart">
                                                                                                            <div className="add-to-cart d-flex">
                                                                                                                <span style={{marginTop : '5%'}}><b>{translate('hour_w')}</b></span>
                                                                                                                
                                                                                                                <div style={{ marginLeft: '8%' }} className="browser">
                                                                                                                    <select style={{ marginLeft: '8%' }} className="browser" id="hourFromSelect" 
                                                                                                                        value={this.state.hourFromSelect} onChange={this.changeHour}>
                                                                                                                        {this.state.hoursAvailable.map((hours) => {
                                                                                                                            return (
                                                                                                                                <option key={'hourTo'+hours} value={hours}>{hours}</option>
                                                                                                                            );
                                                                                                                        })}
                                                                                                                    </select>
                                                                                                                </div>
                                                                                                                <b style={{ marginLeft: '8%' ,marginTop : '5%'}}>{translate('to_w')}</b>
                                                                                                                <div className="browser">
                                                                                                                    <select className="browser" id="hourToSelect" 
                                                                                                                    value={this.state.hourToSelect} onChange={this.changeHour}>
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
                                                                                                        <div style={{ marginLeft: '10%' }} className="add-to-cart d-flex">
                                                                                                            <span><b>{translate('date_w')}</b></span>
                                                                                                                <div style={{ marginLeft: '7%' }} className="browser">
                                                                                                                    <DatePicker placeholderText={translate('date_w')}
                                                                                                                        dateFormat="dd/MM/yyyy"
                                                                                                                        selected={this.state.date}
                                                                                                                        minDate={new Date()}
                                                                                                                        onSelect={this.handleChange} //when day is clicked
                                                                                                                        onChange={this.handleChange} //only when value has changed
                                                                                                                    />
                                                                                                                </div>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                    
                                                                                                    <div className={this.state.pubObj.state === 3 ? 'hidden' : 'shown'}>
                                                                                                        <div style={{ marginLeft: '10%' }} className="cart">
                                                                                                            <div className="add-to-cart d-flex">
                                                                                                                <span><b>{translate('people_w')}</b></span>
                                                                                                                <div style={{ marginLeft: '2%' }} className="quantity">
                                                                                                                    <input type="text" name="quantityPeople" id="quantityPeople" size="4" value={this.state.quantityPeople} onChange={(event) => this.changeQuantityPeople(event.target.value)} />
                                                                                                                    <a id="q_up" onClick={() => this.increaseQuantityPeople()}><i className="fa fa-plus"></i></a>
                                                                                                                    <a id="q_down" onClick={() => this.decreaseQuantityPeople()}><i className="fa fa-minus"></i></a>
                                                                                                                </div>
                                                                                                            </div>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                        {this.state.pubObj.IsMyPublication != true ? (
                                                                                                            <div style={{ marginLeft: '35%' }} className="description add-to-cart d-flex">
                                                                                                                <input type="button" value="Reservar" onClick={() => this.triggerSummaryModal()} className="button" />
                                                                                                            </div>
                                                                                                        ) : (
                                                                                                        <div style={{ marginLeft: '20%' }} className="description add-to-cart d-flex">
                                                                                                            <p>{translate('viewPub_resAvToCustomers')}</p>
                                                                                                        </div>
                                                                                                        )}
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>

                                                                            <div id="tabs" className="htabs">
                                                                                <a href="#tab-description" onClick={() => this.goToTab(1)} {...(this.state.tabDisplayed == 1 ? { className: "selected" } : {})} >{translate('desription_w')}</a>
                                                                                <a href="#tab-questions" onClick={() => this.goToTab(3)} {...(this.state.tabDisplayed == 3 ? { className: "selected" } : {})} >{translate('questions_w')} ({this.state.arrQA.length})</a>
                                                                                <a href="#tab-review" onClick={() => this.goToTab(2)} {...(this.state.tabDisplayed == 2 ? { className: "selected" } : {})} >{translate('reviews_w')} ({this.state.pubObj.Reviews.length})</a>
                                                                                <a href="#tab-youtube" onClick={() => this.goToTab(4)} {...(this.state.tabDisplayed == 4 ? { className: "selected" } : {})} >{translate('video_w')}</a>

                                                                            </div>
                                                                            {this.state.tabDisplayed === 1 ? (
                                                                                <>
                                                                                    <div id="tab-description" className="tab-content" style={{ display: 'block' }}>

                                                                                        <div dangerouslySetInnerHTML={{ __html: this.state.pubObj.Description }} /><br />

                                                                                        <h5>{translate('address_w')}</h5>{this.state.pubObj.Address}<br /><br />
                                                                                        <h5>{translate('services_w')}<br /><br /></h5>

                                                                                        <div className="review">
                                                                                            <span>{this.state.pubObj.Facilities.map((inf, index) => {
                                                                                                let infText = this.state.facilities.filter(function (fac) {
                                                                                                    return parseInt(fac.Code) == parseInt(inf)
                                                                                                });
                                                                                                return (
                                                                                                    <div key={index}>
                                                                                                        <p><i className={infText[0].Icon}></i> {infText[0].Description}</p>
                                                                                                    </div>
                                                                                                );
                                                                                            })}<br /><br /></span>
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
                                                                                    <TabQuestions arrQA={this.state.arrQA} login_status={this.props.login_status} saveQuestionVP={this.saveQuestionVP}
                                                                                    userData={this.props.userData} isMyPublication={this.state.pubObj.IsMyPublication} triggerModal={this.triggerModal} />
                                                                                </div>
                                                                            ) : (null)}
                                                                            {this.state.tabDisplayed === 4 ? (
                                                                                <div id="tab-youtube" className="tab-content">
                                                                                    <TabYoutube youtubeUrl={this.state.pubObj.VideoURL}/>
                                                                                </div>
                                                                            ) : (null)}
                                                                            <RelatedPublications relatedPublications={this.state.relatedPublications} redirectToPub={this.redirectToPub} title="Publicaciones relacionadas"/>
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
const enhance = compose(
    connect(mapStateToProps, null),
    withTranslate
)
export default enhance(ViewPublication);