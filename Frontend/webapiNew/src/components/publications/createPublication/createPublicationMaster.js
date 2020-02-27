import React from 'react';
import { Redirect } from 'react-router-dom';
import { withRouter } from "react-router";
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import LoadingOverlay from 'react-loading-overlay';
// Multilanguage
import { withTranslate } from 'react-redux-multilingual';
import { compose } from 'redux';
import {Alert} from 'reactstrap';

import CreatePublicationStep1 from './createPublicationStep1';
import CreatePublicationStep2 from './createPublicationStep2';
import CreatePublicationStep3 from './createPublicationStep3';
import CreatePublicationStep4 from './createPublicationStep4';
import CreatePublicationStep5 from './createPublicationStep5';
import Header from "../../header/header";
import Footer from "../../footer/footer";
import { callAPI, displayErrorMessage } from '../../../services/common/genericFunctions';


class CreatePublication extends React.Component {

    constructor(props) {
        super(props);
        var pubIsLoading = false; var editObject = {}; var premiumOptionSelected = null; var spaceTypeSelect = "1";
        if(props.publicationID){
            // When is on edit mode, load the following values
            pubIsLoading = true;
            editObject.publicationID = props.publicationID;
            editObject.currentIDPlan = props.currentIDPlan;
            editObject.IdPlan = props.IdPlan;
            editObject.planPrice = props.planPrice;
            editObject.stateDescription = props.stateDescription;
            spaceTypeSelect = props.spaceTypeId;
            premiumOptionSelected = props.IdPlan;
        }

        this.state = {
            publicationID: props.publicationID,
            editObject : editObject,
            pubIsLoading : pubIsLoading,
            imagesURL : [],
            currentStep: 1,
            spaceTypes: [],
            isLoading: false,
            buttonIsDisable: false,
            spaceTypeSelect: spaceTypeSelect,
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
            premiumOptionSelected: premiumOptionSelected,
            HourPrice: 0,
            DailyPrice: 0,
            WeeklyPrice: 0,
            MonthlyPrice: 0,
            maxSteps: 5,
            generalError : false,
            cpMode : props.cpMode || 'create'
        }
    }

    // This function will call the API
    loadPublicationCP = (pubID) => {
        var objApi = {};
        objApi.objToSend = {}

        var url = 'api/publication?idPublication=' + pubID + '&mail';
        if (this.props.userData.Mail != null) {
            url = url + '=' + this.props.userData.Mail;
        }
        objApi.fetchUrl = url;
        objApi.method = "GET";
        objApi.successMSG = {
            SUCC_PUBLICATIONSOK : '',
        };
        objApi.functionAfterSuccess = "loadPublicationCP";
        objApi.errorMSG= {}
        this.setState({ pubIsLoading: true});
        callAPI(objApi, this);
    }

    // Validate if evey element was populated on each step
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
    // Trigger next step
    _nextStep = () => {
        if(this.validateStep() == true){
            let currentStep = this.state.currentStep;
            // If the current step is not the last one, then add one on "next" button click
            currentStep = currentStep >= (this.state.maxSteps - 1) ? this.state.maxSteps : currentStep + 1
            this.setState({
                currentStep: currentStep
            })
        }else{
            displayErrorMessage(this.props.translate('createPub_stepNextError'));
        }

    }
    // Trigger previous step
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
                    {this.props.translate('back_w')}
            </button>
            )
        }
        // ...else return nothing
        return null;
    }
    // Obtain the next button
    get nextButton() {
        let currentStep = this.state.currentStep;
        // If the current step is not the last step, then render the "next" button
        if (currentStep < this.state.maxSteps) {
            return (
                <button
                    className="btn btn-primary float-right"
                    type="button" onClick={this._nextStep}>
                    {this.props.translate('next_w')}
            </button>
            )
        }
        // ...else render nothing
        return null;
    }
    // Obtain the end button
    get endButton() {
        let currentStep = this.state.currentStep;
        // If the current step is the last step, then render the "end" button
        if (currentStep === this.state.maxSteps) {
            return (
                <button
                    className="btn btn-primary float-right"
                    type="button" onClick={this.submitPublicationCP} disabled={this.state.buttonIsDisable}>
                    {this.props.translate('finalize_w')}
                    &nbsp;&nbsp;
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

    // This function will handle the onchange event from the fields
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

    // This function will call the API
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

    // This function will call the API
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

    // This function will call the API
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

    // This function will call the API
    submitPublicationCP = () => {
        var objApi = {};
        objApi.fetchUrl = "api/publications";
        objApi.functionAfterSuccess = "submitPublicationCP";
        objApi.functionAfterError = "submitPublicationCP";
        objApi.errorMSG= {}
        if(this.state.cpMode == 'edit'){
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
        }else if(this.state.cpMode =='create' || this.state.cpMode == 'split'){
            objApi.fetchUrl = "api/publication";
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
                    'IdParentPublication' : this.state.publicationID || null
                },
                "Images": this.state.spaceImages,
                "ImagesURL" : this.state.imagesURL
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
                        <title>TeamUp | {translate('createPub_main_header_'+this.state.cpMode)}</title>
                        <meta name="description" content="---" />
                    </Helmet>
                    {/*SEO Support End */}
                    <Header />
                        <div className="col-md-9" id="content">
                            <div className="row">
                                <div className="col-md-3">
                                    <div className="well">
                                    </div>
                                </div>
                                <div className="col-md-9" style={{ marginTop: '2%' }}>
                                    {this.state.cpMode == 'split' ? (
                                        <Alert color="info">
                                            {translate('createPub_splitPubMSg')}
                                        </Alert>
                                    ) : (null)}

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
                        <br/>
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

// Mapping the current state to props, to retrieve useful information from the state
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