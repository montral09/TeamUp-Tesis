import React, {Suspense} from 'react';
import Header from "../../header/header";
import { Redirect } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { connect } from 'react-redux';
import MyReservedSpacesTable from '../../reservations/myReservedSpaces/myReservedSpacesTable'
import LoadingOverlay from 'react-loading-overlay';
import ModalReqInfo from '../viewPublication/modalReqInfo';
import ModalResCustPay from './modalResCustPay'
import ModalResComPay from './modalResComPay';

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
        this.saveComissionPayment = this.saveComissionPayment.bind(this);
    }

    componentDidMount() {
        window.scrollTo(0, 0);
        this.loadMyReservations();
    }

    handleErrors(error) {
        this.setState({ generalError: true });
    }
    loadMyReservations(){
        try {
            fetch('https://localhost:44372/api/reservationPublisher', {
                method: 'POST',
                header: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify({
                    "AccessToken": this.props.tokenObj.accesToken,
                    "Mail": this.props.userData.Mail                   
                })
            }).then(response => response.json()).then(data => {
                if (data.responseCode == "SUCC_RESERVATIONSOK") {
                    this.setState({ reservations: data.Reservations, loadingReservations: false })
                } else {
                    toast.error('Hubo un error '+data.responseCode, {
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
            console.log(error);
        }
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
                    title: 'Confirmaar reserva', mainText: 'Desea confirmar esta reserva? ', mode : mode, saveFunction : "saveConfirm",
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

    saveComissionPayment(objPaymentDetails){
        var objApi = {};
        objApi.objToSend = {
            "AccessToken": this.props.tokenObj.accesToken,
            "Mail": this.props.userData.Mail,
            "IdPublication" : objPaymentDetails.IdPublication,
            "Comment" : objPaymentDetails.paymentComment,
            "Evidence" : {
                "Base64String" : objPaymentDetails.archivesUpload[0].Base64String || "",
                "Extension" :  objPaymentDetails.archivesUpload[0].Extension|| ""
            }
        }
        console.log("saveComissionPayment objToSend: ")
        console.log(objApi.objToSend);
        objApi.fetchUrl = "https://localhost:44372/api/reservationPaymentPublisher";
        objApi.method = "POST";
        objApi.responseSuccess = "SUCC_PAYMENTUPDATED";
        objApi.successMessage = "Se ha enviado el pago de comisión";
        objApi.functionAfterSuccess = "saveComissionPayment";
        this.ModalResComPay.current.changeModalLoadingState(false);
        this.callAPI(objApi);
    }
    rejetPayment(objPaymentDetails){
        alert("rejetPayment")
    }
    
    confirmPayment(objPaymentDetails){
        var objApi = {};
        objApi.objToSend = {
            "AccessToken": this.props.tokenObj.accesToken,
            "Mail": this.props.userData.Mail,
            "IdReservation": objPaymentDetails.IdReservation
        }
        console.log("confirmPayment objToSend: ")
        console.log(objApi.objToSend)
        objApi.fetchUrl = "https://localhost:44372/api/reservationPaymentCustomer";
        objApi.method = "PUT";
        objApi.responseSuccess = "SUCC_PAYMENTUPDATED";
        objApi.successMessage = "Se ha confirmado el envío de pago";
        objApi.functionAfterSuccess = "confirmPayment";
        this.callAPI(objApi);
    }
    callAPI(objApi){
        fetch(objApi.fetchUrl, {
            method: objApi.method,
            header: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify(objApi.objToSend)
        }).then(response => response.json()).then(data => {
            if (data.responseCode == objApi.responseSuccess) {
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
            } else {
                this.handleErrors("Internal error");
            }
        }
        ).catch(error => {
            this.handleErrors(error);
        }
        )
    }
    
    callFunctionAfterApiSuccess(trigger, objData){
        switch(trigger){
            case "saveComissionPayment":
            case "saveConfirm":
            case "saveCancel":
                this.loadMyReservations();
                this.modalReqInfo.current.changeModalLoadingState(true);
                break;
            case "confirmPayment":
                this.loadMyReservations();
                this.ModalResCustPay.current.changeModalLoadingState(true);
            break;
        }
    }
    render() {        
        if (this.props.login_status != 'LOGGED_IN') return <Redirect to='/' />
        return (
        <>
            {/*SEO Support*/}
            <Helmet>
                <title>TeamUp | Publicaciones reservadas</title>
                <meta name="description" content="---" />
            </Helmet>
            {/*SEO Support End */}
            <LoadingOverlay
                active={this.state.loadingReservations || this.state.loadingStatusChange ? true : false}
                spinner
                text='Cargando...'
            >     
                <Header />
                <div className="main-content  full-width  home">
                    <div className="pattern" >
                        <div className="col-md-12 center-column">
                            <h1>Publicaciones reservadas</h1>
                            <ModalResComPay ref={this.ModalResComPay} saveComissionPayment={this.saveComissionPayment}/>
                            <ModalResCustPay ref={this.ModalResCustPay} confirmPayment={this.confirmPayment} rejetPayment={this.rejetPayment}/>
                            <ModalReqInfo ref={this.modalReqInfo} modalSave={this.modalSave} saveConfirm={this.saveConfirm}
                                modalConfigObj={this.state.modalConfigObj} saveCancel={this.saveCancel}/>
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

export default connect(mapStateToProps)(MyReservedPublications);