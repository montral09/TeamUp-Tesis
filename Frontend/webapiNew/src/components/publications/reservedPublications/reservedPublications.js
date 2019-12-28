import React, {Suspense} from 'react';
import Header from "../../header/header";
import { Redirect } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { connect } from 'react-redux';
import { compose } from 'redux';
import MyReservedSpacesTable from '../../reservations/myReservedSpaces/myReservedSpacesTable'
import LoadingOverlay from 'react-loading-overlay';
import ModalReqInfo from '../viewPublication/modalReqInfo';
import ModalResCustPay from './modalResCustPay'
import ModalResComPay from './modalResComPay';
import { logOut, updateToken } from '../../../services/login/actions';

// Multilanguage
import { withTranslate } from 'react-redux-multilingual'

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
        this.loadMyReservations = this.loadMyReservations.bind(this);   
        this.triggerModal = this.triggerModal.bind(this);   
        this.saveCancel = this.saveCancel.bind(this);
        this.saveConfirm = this.saveConfirm.bind(this);
        this.triggerSaveModal = this.triggerSaveModal.bind(this);
        this.saveComissionPayment = this.saveComissionPayment.bind(this);
        this.confirmPayment = this.confirmPayment.bind(this);
        this.handleExpiredToken = this.handleExpiredToken.bind(this);
    }

    componentDidMount() {
        window.scrollTo(0, 0);
        this.loadMyReservations();
    }

    handleErrors(error) {
        this.setState({ generalError: true });
    }
    loadMyReservations(){
        var objApi = {};
        objApi.objToSend = {
            "AccessToken": this.props.tokenObj.accesToken,
            "Mail": this.props.userData.Mail
        }
        objApi.fetchUrl = "https://localhost:44372/api/reservationPublisher";
        objApi.method = "POST";
        objApi.responseSuccess = "SUCC_RESERVATIONSOK";
        objApi.successMessage = "";
        objApi.functionAfterSuccess = "loadMyReservations";
        this.callAPI(objApi);
    }
    modalSave(){
        this.modalReqInfo.current.changeModalLoadingState(true);
    }

    triggerModal(mode, IdReservation, auxParam){
        var modalConfigObj = {};
        switch(mode){
            case "CANCEL": 
                modalConfigObj ={
                    title: 'Cancelar reserva', mainText: 'Desea cancelar la reserva? Por favor indique el motivo ', mode : mode, saveFunction : "saveCancel", textboxLabel: 'Comentario',
                    textboxDisplay:true, cancelAvailable:true, confirmAvailable:true, cancelText :'No', confirmText :'Si' , login_status: this.props.login_status
                };
                this.setState({modalConfigObj : modalConfigObj, selectedIdRes: IdReservation, selectedResState:auxParam},() => {this.modalReqInfo.current.toggle();})
            break;
            case "CONFIRM": 
                modalConfigObj ={
                    title: 'Confirmar reserva', mainText: 'Desea confirmar esta reserva? ', mode : mode, saveFunction : "saveConfirm",
                    cancelAvailable:true, confirmAvailable:true, cancelText :'Cancelar', confirmText :'Confirmar' , login_status: this.props.login_status,
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

    saveCancel(commentValue){
        var objApi = {};
        objApi.objToSend = {
            "AccessToken": this.props.tokenObj.accesToken,
            "IdReservation": this.state.selectedIdRes,
            "Mail": this.props.userData.Mail,
            "OldState": this.state.selectedResState,
            "NewState": "CANCELED",
            "CanceledReason": commentValue
        }
        objApi.fetchUrl = "https://localhost:44372/api/reservation";
        objApi.method = "PUT";
        objApi.responseSuccess = "SUCC_RESERVATIONUPDATED";
        objApi.successMessage = "Se ha cancelado la reserva";
        objApi.functionAfterSuccess = "saveCancel";
        this.modalReqInfo.current.changeModalLoadingState(false);
        this.callAPI(objApi);
    }

    saveConfirm(){
        var objApi = {};
        objApi.objToSend = {
            "AccessToken": this.props.tokenObj.accesToken,
            "IdReservation": this.state.selectedIdRes,
            "Mail": this.props.userData.Mail,
            "OldState": this.state.selectedResState,
            "NewState": "RESERVED"
        }
        objApi.fetchUrl = "https://localhost:44372/api/reservation";
        objApi.method = "PUT";
        objApi.responseSuccess = "SUCC_RESERVATIONUPDATED";
        objApi.successMessage = "Se ha confirmado la reserva";
        objApi.functionAfterSuccess = "saveConfirm";
        this.modalReqInfo.current.changeModalLoadingState(false);
        this.callAPI(objApi);
    }

    triggerSaveModal(saveFunction, objData){
        switch(saveFunction){
            case "saveCancel": this.saveCancel(objData.textboxValue);break;
            case "saveConfirm": this.saveConfirm();break;
        }
    }
    saveComissionPayment(objPaymentDetails){
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
        objApi.fetchUrl = "https://localhost:44372/api/reservationPaymentPublisher";
        objApi.method = "POST";
        objApi.responseSuccess = "SUCC_PAYMENTUPDATED";
        objApi.successMessage = "Se ha enviado el pago de comisión";
        objApi.functionAfterSuccess = "saveComissionPayment";
        this.ModalResComPay.current.changeModalLoadingState(false);
        this.callAPI(objApi);
    }
    rejetPayment(objPaymentDetails){
        var objApi = {};
        objApi.objToSend = {
            "AccessToken": this.props.tokenObj.accesToken,
            "Mail": this.props.userData.Mail,
            "IdReservation": objPaymentDetails.IdReservation,
            "Approved": false
        }
        objApi.fetchUrl = "https://localhost:44372/api/reservationPaymentCustomer";
        objApi.method = "PUT";
        objApi.responseSuccess = "SUCC_PAYMENTUPDATED";
        objApi.successMessage = "Se ha rechazado el envío de pago";
        objApi.functionAfterSuccess = "confirmPayment";
        this.callAPI(objApi);
    }
    
    confirmPayment(objPaymentDetails){
        var objApi = {};
        objApi.objToSend = {
            "AccessToken": this.props.tokenObj.accesToken,
            "Mail": this.props.userData.Mail,
            "IdReservation": objPaymentDetails.IdReservation,
            "Approved": true
        }
        objApi.fetchUrl = "https://localhost:44372/api/reservationPaymentCustomer";
        objApi.method = "PUT";
        objApi.responseSuccess = "SUCC_PAYMENTUPDATED";
        objApi.successMessage = "Se ha confirmado el envío de pago";
        objApi.functionAfterSuccess = "confirmPayment";
        this.callAPI(objApi);
    }

            /* START OF API FUNCTIONS */
    callAPI(objApi){
        console.log("API CALL => "+objApi.functionAfterSuccess)
        console.log(objApi)
        if(objApi.method == "GET"){
            fetch(objApi.fetchUrl).then(response => response.json()).then(data => {
                console.log("<= RESPONSE =>")
                console.log(data)
                switch(data.responseCode){
                    case objApi.responseSuccess: 
                        if(objApi.successMessage != ""){
                            toast.success(objApi.successMessage, {
                                position: "top-right",
                                autoClose: 5000,
                                hideProgressBar: false,
                                closeOnClick: true,
                                pauseOnHover: true,
                                draggable: true,
                            });
                        }
                        this.callFunctionAfterApiSuccess(objApi.functionAfterSuccess, data);
                    break;
    
                    case "ERR_INVALIDACCESSTOKEN": this.handleExpiredToken(objApi);break;
                    case "ERR_ACCESSTOKENEXPIRED": this.handleExpiredToken(objApi);break;
                    case "ERR_INVALIDREFRESHTOKEN": this.handleExpiredToken(objApi);break;
                    
                    default: 
                        this.handleErrors("Internal error");
                    break;
                }
            }
            ).catch(error => {
                this.handleErrors(error);
            }
            )
        }else{
            fetch(objApi.fetchUrl, {
                method: objApi.method,
                header: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify(objApi.objToSend)
            }).then(response => response.json()).then(data => {
                console.log("<= RESPONSE =>")
                console.log(data)
                switch(data.responseCode){
                    case objApi.responseSuccess: 
                        if(objApi.successMessage != ""){
                            toast.success(objApi.successMessage, {
                                position: "top-right",
                                autoClose: 5000,
                                hideProgressBar: false,
                                closeOnClick: true,
                                pauseOnHover: true,
                                draggable: true,
                            });
                        }
                        this.callFunctionAfterApiSuccess(objApi.functionAfterSuccess, data);
                    break;
    
                    case "ERR_INVALIDACCESSTOKEN": this.handleExpiredToken(objApi);break;
                    case "ERR_ACCESSTOKENEXPIRED": this.handleExpiredToken(objApi);break;
                    case "ERR_INVALIDREFRESHTOKEN": this.handleExpiredToken(objApi);break;
                    
                    default: 
                        this.handleErrors("Internal error");
                    break;
                }
            }
            ).catch(error => {
                this.handleErrors(error);
            }
            )
        }

    }

    callFunctionAfterApiSuccess(trigger, objData){
        switch(trigger){
            case "saveComissionPayment":
                this.ModalResComPay.current.changeModalLoadingState(true);
                this.loadMyReservations();
                break;
            case "saveConfirm":
            case "saveCancel":
                this.loadMyReservations();
                this.modalReqInfo.current.changeModalLoadingState(true);
                break;
            case "confirmPayment":
                this.loadMyReservations();
                this.ModalResCustPay.current.changeModalLoadingState(true);
            break;

            case "loadMyReservations":
                this.setState({ reservations: objData.Reservations, loadingReservations: false })
            break;

            case "updateExpiredToken":
                // updatetoken &
                let newTokenObj = {
                    accesToken: objData.AccessToken,
                    refreshToken: objData.RefreshToken
                };
                this.props.updateToken(newTokenObj);
                var scopeThis = this;
                setTimeout(function () {
                    scopeThis.callAPI(objData.retryObjApi);
                }, 350);
            break;
        }
    }

    handleExpiredToken(retryObjApi){
        if(retryObjApi.functionAfterSuccess == "updateExpiredToken"){
            // This is the second attempt -> Log off
            this.props.logOut();
            toast.error("Su sesión expiró, por favor inicie sesión nuevamente", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        }else{
            var objApi = {};
            objApi.objToSend = {
                "RefreshToken": this.props.tokenObj.refreshToken,
                "Mail": this.props.userData.Mail
            }
            objApi.fetchUrl = "https://localhost:44372/api/tokens";
            objApi.method = "PUT";
            objApi.responseSuccess = "SUCC_TOKENSUPDATED";
            objApi.successMessage = "";
            objApi.functionAfterSuccess = "updateExpiredToken";
            objApi.retryObjApi = retryObjApi;
            this.callAPI(objApi);
        }

    }
            /* END OF API FUNCTIONS */

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
                            <ModalResCustPay ref={this.ModalResCustPay} confirmPayment={this.confirmPayment} rejetPayment={this.rejetPayment}/>
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

const mapDispatchToProps = (dispatch) =>{
    return{
        logOut: () => dispatch(logOut()),
        updateToken: (tokenObj) => dispatch(updateToken(tokenObj))
    }
}

const enhance = compose(
    connect(mapStateToProps, mapDispatchToProps),
    withTranslate
)
export default enhance(MyReservedPublications);