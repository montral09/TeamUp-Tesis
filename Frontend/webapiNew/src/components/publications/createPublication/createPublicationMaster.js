import React from 'react';
import Header from "../../header/header";
import { Redirect } from 'react-router-dom';
import { withRouter } from "react-router";
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import Footer from "../../footer/footer";
import CreatePublicationStep1 from './createPublicationStep1';
import CreatePublicationStep2 from './createPublicationStep2';
import CreatePublicationStep3 from './createPublicationStep3';
import CreatePublicationStep4 from './createPublicationStep4';
import CreatePublicationStep5 from './createPublicationStep5';
import LoadingOverlay from 'react-loading-overlay';
import { callAPI, displayErrorMessage } from '../../../services/common/genericFunctions';
// Multilanguage
import { withTranslate } from 'react-redux-multilingual'
import { compose } from 'redux';

class CreatePublication extends React.Component {

    constructor(props) {
        super(props);
        var pubIsLoading = false;
        if(props.publicationID){
            pubIsLoading = true;
        }
        this.state = {
            publicationID: props.publicationID,
            pubIsLoading : pubIsLoading,
            imagesURL : [],
            currentStep: 1,
            spaceTypes: [],
            isLoading: false,
            buttonIsDisable: false,
            spaceTypeSelect: "1",
            spaceName: "",
            description: "",
            locationText: "",
            city: "",
            geoLat: 0,
            geoLng: 0,
            availability: "",
            capacity: "",
            youtubeURL: "",
            facilities: [],
            facilitiesSelect: [],
            spaceImages: [],
            reservationTypes: [],
            premiumOptions: [],
            premiumOptionSelected: null,
            HourPrice: 0,
            DailyPrice: 0,
            WeeklyPrice: 0,
            MonthlyPrice: 0,
            maxSteps: 5,
            generalError : false
        }
    }

    loadPublicationCP = (pubID) => {
        var objApi = {};
        objApi.objToSend = {}
        objApi.fetchUrl = 'api/publication?idPublication='+pubID+'&mail=';
        objApi.method = "GET";
        objApi.successMSG = {
            SUCC_PUBLICATIONSOK : '',
        };
        objApi.functionAfterSuccess = "loadPublicationCP";
        objApi.errorMSG= {}
        this.setState({ pubIsLoading: true});
        callAPI(objApi, this);
    }

    validateStep = () =>{
        var isValid = false;
        try{
            switch(this.state.currentStep){
                case 1:
                    if(this.state.spaceName && this.state.capacity){
                        isValid = true;
                    }
                break;
                case 2:
                    if((this.state.imagesURL.length != 0 || this.state.spaceImages.length != 0  )&& this.state.geoLat != 0){
                        isValid = true;
                    }
                break;
                case 3:
                    if((this.state.HourPrice != 0 || this.state.DailyPrice != 0 || 
                        this.state.WeeklyPrice != 0 || this.state.MonthlyPrice != 0)  && this.state.availability){
                        isValid = true;
                    }
                break;
                case 4:
                    if(this.state.premiumOptionSelected != null){
                        isValid = true;
                    }
                break;
                case 5:
                    isValid = true;
                break;              
            }
        }catch(error){
            console.log("error: "+error);
        }
        return isValid;
    }

    _nextStep = () => {
        if(this.validateStep() == true){
            let currentStep = this.state.currentStep;
            // If the current step is not the last one, then add one on "next" button click
            currentStep = currentStep >= (this.state.maxSteps - 1) ? this.state.maxSteps : currentStep + 1
            this.setState({
                currentStep: currentStep
            })
        }else{
            displayErrorMessage('Por favor complete los campos obligatorios ');
        }

    }

    _previousStep = () => {
        let currentStep = this.state.currentStep
        // If the current step is 2 or 3, then subtract one on "previous" button click
        currentStep = currentStep <= 1 ? 1 : currentStep - 1
        this.setState({
            currentStep: currentStep
        })
    }

    // The "next" and "previous" button functions
    get previousButton() {
        let currentStep = this.state.currentStep;
        // If the current step is not 1, then render the "previous" button
        if (currentStep !== 1) {
            return (
                <button
                    className="btn btn-secondary"
                    type="button" onClick={this._previousStep} disabled={this.state.buttonIsDisable}>
                    Atras
            </button>
            )
        }
        // ...else return nothing
        return null;
    }

    get nextButton() {
        let currentStep = this.state.currentStep;
        // If the current step is not the last step, then render the "next" button
        if (currentStep < this.state.maxSteps) {
            return (
                <button
                    className="btn btn-primary float-right"
                    type="button" onClick={this._nextStep}>
                    Siguiente
            </button>
            )
        }
        // ...else render nothing
        return null;
    }

    get endButton() {
        let currentStep = this.state.currentStep;
        // If the current step is the last step, then render the "end" button
        if (currentStep === this.state.maxSteps) {
            return (
                <button
                    className="btn btn-primary float-right"
                    type="button" onClick={this.submitPublicationCP} disabled={this.state.buttonIsDisable}>
                    Finalizar&nbsp;&nbsp;
                    { this.state.isLoading &&  
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    }
                </button>
            )
        }
        // ...else render nothing
        return null;
    }

    componentDidMount() {
        window.scrollTo(0, 0);
        this.loadSpaceTypesCP();
        this.loadInfraestructureCP();
        this.loadPremiumOptionsCP();
        if(this.state.publicationID){
            this.loadPublicationCP(this.state.publicationID);
        }
    }
    
    onChange = (e) => {
        var targetValue = e.target.value;
        switch(e.target.id){
            case "facilitiesSelect":
                var options = e.target.value;
                var values = [];
                for (var i = 0, l = options.length; i < l; i++) {
                    values.push(options[i].value);
                }
                targetValue = values;
                break;
        }
        this.setState({
            [e.target.id]: targetValue
        });
    }

    loadSpaceTypesCP() {
        var objApi = {};
        objApi.objToSend = {}
        objApi.fetchUrl = 'api/spaceTypes';
        objApi.method = "GET";
        objApi.successMSG = {
            SUCC_SPACETYPESOK : '',
        };
        objApi.functionAfterSuccess = "loadSpaceTypesCP";
        objApi.errorMSG= {}
        callAPI(objApi, this);
    }

    loadInfraestructureCP() {
        var objApi = {};
        objApi.objToSend = {}
        objApi.fetchUrl = 'api/facilities';
        objApi.method = "GET";
        objApi.successMSG = {
            SUCC_FACILITIESOK : '',
        };
        objApi.functionAfterSuccess = "loadInfraestructureCP";
        objApi.errorMSG= {}
        callAPI(objApi, this);
    }

    loadPremiumOptionsCP() {
        var objApi = {};
        objApi.objToSend = {}
        objApi.fetchUrl = 'api/publicationPlan';
        objApi.method = "GET";
        objApi.successMSG = {
            SUCC_PUBLICATIONPLANSOK : '',
        };
        objApi.functionAfterSuccess = "loadPremiumOptionsCP";
        objApi.errorMSG= {}
        callAPI(objApi, this);
    }

    submitPublicationCP = () => {
        var objApi = {};
        objApi.fetchUrl = "api/publications";
        objApi.functionAfterSuccess = "submitPublicationCP";
        objApi.functionAfterError = "submitPublicationCP";
        objApi.errorMSG= {}
        if(this.state.publicationID){
            // this is an edit
            objApi.objToSend = {
                "AccessToken": this.props.tokenObj.accesToken,
                "Publication": {
                    "IdPublication": this.state.publicationID,
                    "Mail": this.props.userData.Mail,
                    "SpaceType": parseInt(this.state.spaceTypeSelect),
                    "Title": this.state.spaceName,
                    "Description": this.state.description,
                    "Address": this.state.locationText,
                    "City": this.state.city,
                    "Location": {
                        "Latitude": this.state.geoLat,
                        "Longitude": this.state.geoLng
                    },
                    "Capacity": parseInt(this.state.capacity),
                    "VideoURL": this.state.youtubeURL,
                    "HourPrice": parseFloat(this.state.HourPrice),
                    "DailyPrice": parseFloat(this.state.DailyPrice),
                    "WeeklyPrice": parseFloat(this.state.WeeklyPrice),
                    "MonthlyPrice": parseFloat(this.state.MonthlyPrice),
                    "IdPlan": parseInt(this.state.premiumOptionSelected),
                    "Availability": this.state.availability,
                    "Facilities": this.state.facilitiesSelect,
                },
                "Base64Images": this.state.spaceImages,
                "ImagesURL" : this.state.imagesURL
            }
            objApi.method = "PUT";
            objApi.successMSG = {
                SUCC_PUBLICATIONUPDATED : this.props.translate('SUCC_PUBLICATIONUPDATED'),
            };
        }else{
            objApi.objToSend = {
                "AccessToken": this.props.tokenObj.accesToken,
                "VOPublication": {
                    "Mail": this.props.userData.Mail,
                    "SpaceType": parseInt(this.state.spaceTypeSelect),
                    "Title": this.state.spaceName,
                    "Description": this.state.description,
                    "Address": this.state.locationText,
                    "City" : this.state.city,
                    "Location": {
                        "Latitude": this.state.geoLat,
                        "Longitude": this.state.geoLng
                    },
                    "Capacity": parseInt(this.state.capacity),
                    "VideoURL": this.state.youtubeURL,
                    "HourPrice": parseFloat(this.state.HourPrice),
                    "DailyPrice": parseFloat(this.state.DailyPrice),
                    "WeeklyPrice": parseFloat(this.state.WeeklyPrice),
                    "MonthlyPrice": parseFloat(this.state.MonthlyPrice),
                    "IdPlan": parseInt(this.state.premiumOptionSelected),
                    "Availability": this.state.availability,
                    "Facilities": this.state.facilitiesSelect,
                },
                "Images": this.state.spaceImages
            }
            objApi.method = "POST";
            objApi.successMSG = {
                SUCC_PUBLICATIONCREATED : this.props.translate('SUCC_PUBLICATIONCREATED'),
            };
        }
        this.setState({ isLoading: true, buttonIsDisable: true });
        callAPI(objApi, this);
    }

    render() {
        const { translate, userData, login_status } = this.props;
 
        /* START SECURITY VALIDATIONS */
        if (login_status != 'LOGGED_IN') return <Redirect to='/' />
        if (this.state.generalError) return <Redirect to='/error' />
        // THIS ONE ONLY FOR PUBLISHER PAGES
        if (userData.PublisherValidated != true) return <Redirect to='/' />
        /* END SECURITY VALIDATIONS */     
        return (
            <>
                {this.state.pubIsLoading == false ? (
                    <>
                    {/*SEO Support*/}
                    <Helmet>
                        <title>TeamUp | {translate('createPub_main_header')}</title>
                        <meta name="description" content="---" />
                    </Helmet>
                    {/*SEO Support End */}
                    <Header />
                        <div className="col-md-9 center-column" id="content">
                            <div className="row">
                                <div className="col-md-3">
                                    <div className="well">
                                    </div>
                                </div>
                                <div className="col-md-9">
                                    <CreatePublicationStep1 parentState={this.state} onChange={this.onChange} />
                                    <CreatePublicationStep2 parentState={this.state} onChange={this.onChange} />
                                    <CreatePublicationStep3 parentState={this.state} onChange={this.onChange} />
                                    <CreatePublicationStep4 parentState={this.state} onChange={this.onChange} />
                                    <CreatePublicationStep5 parentState={this.state} onChange={this.onChange} />

                                    {this.previousButton}
                                    {this.nextButton}
                                    {this.endButton}
                                </div>

                            </div>
                        </div>
                    <Footer />
                    </>
                ) : (                
                <LoadingOverlay
                    active={!this.state.pubIsLoading}
                    spinner
                    text={translate('loading_text_small')}
                >
                    <div className="col-md-9 center-column" id="content"></div>
                </LoadingOverlay>)}
                
            </>
        );
    }
}
const mapStateToProps = (state) => {
    return {
        login_status: state.loginData.login_status,
        tokenObj: state.loginData.tokenObj,
        userData: state.loginData.userData,
    }
}
const enhance = compose(
    connect(mapStateToProps, null),
    withRouter,
    withTranslate
)
export default enhance(CreatePublication);