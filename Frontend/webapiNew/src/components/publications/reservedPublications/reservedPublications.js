import React from 'react';
import { Redirect } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import { compose } from 'redux';
import LoadingOverlay from 'react-loading-overlay';
import MyReservedSpacesTable from '../../reservations/myReservedSpaces/myReservedSpacesTable'
import Header from "../../header/header";
import ModalReqInfo from '../viewPublication/modalReqInfo';
import ModalResCustPay from './modalResCustPay'
import ModalResComPay from './modalResComPay';
// Multilanguage
import { withTranslate } from 'react-redux-multilingual'
import { callAPI } from '../../../services/common/genericFunctions';

class MyReservedPublications extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loadingReservations : true,
            reservationId : null,
            reservations : [],
            loadingStatusChange : false,
            modalConfigObj : {},
            selectedIdRes : null,
            generalError : false,
            selectedResState : ""
        }
        this.modalReqInfo = React.createRef(); // Connects the reference to the modal
        this.ModalResCustPay = React.createRef(); // Connects the reference to the modal
        this.ModalResComPay = React.createRef(); // Connects the reference to the modal
    }

    componentDidMount() {
        window.scrollTo(0, 0);
        this.loadMyReservationsRP();
    }

    loadMyReservationsRP=()=>{
        var objApi = {};
        objApi.objToSend = {
            "AccessToken": this.props.tokenObj.accesToken,
            "Mail": this.props.userData.Mail
        }
        objApi.fetchUrl = "api/reservationPublisher";
        objApi.method = "POST";
        objApi.successMSG = {
            SUCC_RESERVATIONSOK : '',
        };
        objApi.functionAfterSuccess = "loadMyReservationsRP";
        objApi.errorMSG= {}
        objApi.logOut = this.props.logOut;
        callAPI(objApi, this);
    }
    modalSave=()=>{
        this.modalReqInfo.current.changeModalLoadingState(true);
    }

    triggerModal=(mode, IdReservation, auxParam)=>{
        var modalConfigObj = {};
        switch(mode){
            case "CANCEL": 
                modalConfigObj ={
                    title: this.props.translate('reservedPublications_cancelModal_header'), mainText: this.props.translate('reservedPublications_cancelModal_body'), mode : mode, saveFunction : "saveCancelRP", textboxLabel: this.props.translate('comment_w'),
                    textboxDisplay:true, cancelAvailable:true, confirmAvailable:true, cancelText :this.props.translate('yes_w'), confirmText :this.props.translate('no_w') , login_status: this.props.login_status
                };
                this.setState({modalConfigObj : modalConfigObj, selectedIdRes: IdReservation, selectedResState:auxParam},() => {this.modalReqInfo.current.toggle();})
            break;
            case "CONFIRM": 
                modalConfigObj ={
                    title: this.props.translate('reservedPublications_confirmModal_header'), mainText: this.props.translate('reservedPublications_confirmModal_body'), mode : mode, saveFunction : "saveConfirmRP",
                    cancelAvailable:true, confirmAvailable:true, cancelText :this.props.translate('cancel_w'), confirmText :this.props.translate('confirm_w') , login_status: this.props.login_status,
                };
                this.setState({modalConfigObj : modalConfigObj, selectedIdRes: IdReservation, selectedResState:auxParam},() => {this.modalReqInfo.current.toggle();})
            break;
            case "PAYRESCUST": 
                this.ModalResCustPay.current.toggle(auxParam);
            break;
            case "PAYRESCOM": 
                this.ModalResComPay.current.toggle(auxParam);
            break;
        }
    }

    saveCancelRP=(commentValue)=>{
        var objApi = {};
        objApi.objToSend = {
            "AccessToken": this.props.tokenObj.accesToken,
            "IdReservation": this.state.selectedIdRes,
            "Mail": this.props.userData.Mail,
            "OldState": this.state.selectedResState,
            "NewState": "CANCELED",
            "CanceledReason": commentValue
        }
        objApi.fetchUrl = "api/reservation";
        objApi.method = "PUT";
        objApi.successMSG = {
            SUCC_RESERVATIONUPDATED : this.props.translate('SUCC_RESERVATIONUPDATED'),
        };
        objApi.functionAfterSuccess = "saveCancelRP";
        objApi.errorMSG= {}
        this.modalReqInfo.current.changeModalLoadingState(false);
        callAPI(objApi, this);
    }

    saveConfirmRP=()=>{
        var objApi = {};
        objApi.objToSend = {
            "AccessToken": this.props.tokenObj.accesToken,
            "IdReservation": this.state.selectedIdRes,
            "Mail": this.props.userData.Mail,
            "OldState": this.state.selectedResState,
            "NewState": "RESERVED"
        }
        objApi.fetchUrl = "api/reservation";
        objApi.method = "PUT";
        objApi.successMSG = {
            SUCC_RESERVATIONUPDATED : this.props.translate('SUCC_RESERVATIONUPDATED2'),
        };
        objApi.functionAfterSuccess = "saveConfirmRP";
        objApi.errorMSG= {}
        this.modalReqInfo.current.changeModalLoadingState(false);
        callAPI(objApi, this);
    }

    triggerSaveModal=(saveFunction, objData)=>{
        switch(saveFunction){
            case "saveCancelRP": this.saveCancelRP(objData.textboxValue);break;
            case "saveConfirmRP": this.saveConfirmRP();break;
        }
    }
    saveComissionPayment=(objPaymentDetails)=>{
        var objApi = {};
        objApi.objToSend = {
            "AccessToken": this.props.tokenObj.accesToken,
            "Mail": this.props.userData.Mail,
            "IdReservation" : objPaymentDetails.IdReservation,
            "Comment" : objPaymentDetails.paymentComment || "",
            "Evidence" : {
                "Base64String" : objPaymentDetails.archivesUpload ? objPaymentDetails.archivesUpload[0].Base64String : "",
                "Extension" :  objPaymentDetails.archivesUpload ? objPaymentDetails.archivesUpload[0].Extension : ""
            }
        }
        objApi.fetchUrl = "api/reservationPaymentPublisher";
        objApi.method = "POST";
        objApi.successMSG = {
            SUCC_PAYMENTUPDATED : this.props.translate('SUCC_PAYMENTUPDATED'),
        };
        objApi.functionAfterSuccess = "saveComissionPayment";
        objApi.errorMSG= {}
        this.ModalResComPay.current.changeModalLoadingState(false);
        callAPI(objApi, this);
    }
    rejetPayment=(objPaymentDetails)=>{
        var objApi = {};
        objApi.objToSend = {
            "AccessToken": this.props.tokenObj.accesToken,
            "Mail": this.props.userData.Mail,
            "IdReservation": objPaymentDetails.IdReservation,
            "Approved": false
        }
        objApi.fetchUrl = "api/reservationPaymentCustomer";
        objApi.method = "PUT";
        objApi.successMSG = {
            SUCC_PAYMENTUPDATED : this.props.translate('SUCC_PAYMENTUPDATED2'),
        };
        objApi.functionAfterSuccess = "rejetPayment";
        objApi.errorMSG= {}
        callAPI(objApi, this);
    }
    
    confirmPaymentRP=(objPaymentDetails)=>{
        var objApi = {};
        objApi.objToSend = {
            "AccessToken": this.props.tokenObj.accesToken,
            "Mail": this.props.userData.Mail,
            "IdReservation": objPaymentDetails.IdReservation,
            "Approved": true
        }
        objApi.fetchUrl = "api/reservationPaymentCustomer";
        objApi.method = "PUT";
        objApi.successMSG = {
            SUCC_PAYMENTUPDATED : this.props.translate('SUCC_PAYMENTUPDATED'),
        };
        objApi.functionAfterSuccess = "confirmPaymentRP";
        objApi.errorMSG= {}
        callAPI(objApi, this);
    }

    render() {
        const { translate } = this.props;
                    /* START SECURITY VALIDATIONS */
        if (this.props.login_status != 'LOGGED_IN') return <Redirect to='/' />
        // THIS ONE ONLY FOR PUBLISHER PAGES
        if (this.props.userData.PublisherValidated != true) return <Redirect to='/' />
                    /* END SECURITY VALIDATIONS */
        return (
        <>
            {/*SEO Support*/}
            <Helmet>
                <title>TeamUp | {translate('res_publications_title')}</title>
                <meta name="description" content="---" />
            </Helmet>
            {/*SEO Support End */}
            <LoadingOverlay
                active={this.state.loadingReservations || this.state.loadingStatusChange ? true : false}
                spinner
                text={translate('loading_text_small')}
            >     
                <Header />
                <div className="main-content  full-width  home">
                    <div className="pattern" >
                        <div className="col-md-12 center-column">
                            <h1>{translate('res_publications_title')}</h1>
                            <ModalResComPay ref={this.ModalResComPay} saveComissionPayment={this.saveComissionPayment}/>
                            <ModalResCustPay ref={this.ModalResCustPay} confirmPayment={this.confirmPaymentRP} rejetPayment={this.rejetPayment}/>
                            <ModalReqInfo ref={this.modalReqInfo} modalSave={this.modalSave}
                                modalConfigObj={this.state.modalConfigObj} triggerSaveModal={this.triggerSaveModal}/>
                            <MyReservedSpacesTable isPublisher={true} editReservation={this.editReservation} triggerModal={this.triggerModal} 
                                reservations={this.state.reservations} modalReqInfo={this.modalReqInfo.current} />
                        </div>
                    </div>
                </div>               
            </LoadingOverlay >
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
    withTranslate
)
export default enhance(MyReservedPublications);