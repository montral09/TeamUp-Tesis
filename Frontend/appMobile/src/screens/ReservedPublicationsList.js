import React, {Component} from 'react';
import { StyleSheet, Text, View, ScrollView, Keyboard, TouchableOpacity} from 'react-native';
import { connect } from 'react-redux';

import { logOut, updateToken } from '../redux/actions/accountActions';

import ReservedPublicationsListScrollView from '../components/ReservedPublicationsListScrollView';

import Globals from '../Globals';

class ReservedPublicationsList extends Component {

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

        //this.modalReqInfo = React.createRef(); // Connects the reference to the modal
        //this.ModalResCustPay = React.createRef(); // Connects the reference to the modal
        //this.ModalResComPay = React.createRef(); // Connects the reference to the modal
        this.loadMyReservations = this.loadMyReservations.bind(this);   
        this.triggerScreen = this.triggerScreen.bind(this);   
        this.saveCancel = this.saveCancel.bind(this);
        this.saveConfirm = this.saveConfirm.bind(this);
        //this.triggerSaveModal = this.triggerSaveModal.bind(this);
        this.saveComissionPayment = this.saveComissionPayment.bind(this);
        this.confirmPayment = this.confirmPayment.bind(this);
        this.handleExpiredToken = this.handleExpiredToken.bind(this);
    }

    componentDidMount() {
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
        objApi.fetchUrl = Globals.baseURL + '/reservationPublisher';
        objApi.method = "POST";
        objApi.responseSuccess = "SUCC_RESERVATIONSOK";
        objApi.successMessage = "";
        objApi.functionAfterSuccess = "loadMyReservations";
        this.callAPI(objApi);
    }

    /*modalSave(){
        this.modalReqInfo.current.changeModalLoadingState(true);
    }*/

    triggerScreen(mode, IdReservation, auxParam){
        var screenConfigObj = {};
        switch(mode){
            case "CANCEL": 
                screenConfigObj ={
                    title: 'Cancelar reserva', mainText: 'Desea cancelar la reserva? Por favor indique el motivo ', mode : mode, saveFunction : "saveCancel", textboxLabel: 'Comentario',
                    textboxDisplay:true, cancelAvailable:true, confirmAvailable:true, cancelText :'No', confirmText :'Si' , login_status: this.props.login_status
                };
                this.props.navigation.navigate('ReservationReqInfo', {screenConfig: screenConfigObj});
            break;
            case "CONFIRM": 
                screenConfigObj ={
                    title: 'Confirmar reserva', mainText: 'Desea confirmar esta reserva? ', mode : mode, saveFunction : "saveConfirm",
                    cancelAvailable:true, confirmAvailable:true, cancelText :'Cancelar', confirmText :'Confirmar' , login_status: this.props.login_status,
                };
                this.props.navigation.navigate('ReservationReqInfo', {screenConfig: screenConfigObj});
            break;
            case "PAYRESCUST": 
                this.props.navigation.navigate('ReservationCustResPay', {auxParam: auxParam});
            break;
            /*
            case "PAYRESCOM": 
                this.ModalResComPay.current.toggle(auxParam);
            break;*/
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
        objApi.fetchUrl = Globals.baseURL + '/reservation';
        objApi.method = "PUT";
        objApi.responseSuccess = "SUCC_RESERVATIONUPDATED";
        objApi.successMessage = "Se ha cancelado la reserva";
        objApi.functionAfterSuccess = "saveCancel";
        //this.modalReqInfo.current.changeModalLoadingState(false);
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
        objApi.fetchUrl = Globals.baseURL + '/reservation';
        objApi.method = "PUT";
        objApi.responseSuccess = "SUCC_RESERVATIONUPDATED";
        objApi.successMessage = "Se ha confirmado la reserva";
        objApi.functionAfterSuccess = "saveConfirm";
        //this.modalReqInfo.current.changeModalLoadingState(false);
        this.callAPI(objApi);
    }

    /*triggerSaveModal(saveFunction, objData){
        switch(saveFunction){
            case "saveCancel": this.saveCancel(objData.textboxValue);break;
            case "saveConfirm": this.saveConfirm();break;
        }
    }*/

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
        objApi.fetchUrl = Globals.baseURL + '/reservationPaymentPublisher';
        objApi.method = "POST";
        objApi.responseSuccess = "SUCC_PAYMENTUPDATED";
        objApi.successMessage = "Se ha enviado el pago de comisión";
        objApi.functionAfterSuccess = "saveComissionPayment";
        //this.ModalResComPay.current.changeModalLoadingState(false);
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
            "IdReservation": objPaymentDetails.IdReservation,
            "Approved": true
        }
        objApi.fetchUrl = Globals.baseURL + '/reservationPaymentCustomer';
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
            objApi.fetchUrl = Globals.baseURL + '/tokens';
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
                    /* START SECURITY VALIDATIONS */
        //if (this.props.login_status != 'LOGGED_IN') return <Redirect to='/' />
        // THIS ONE ONLY FOR PUBLISHER PAGES
        //if (this.props.userData.PublisherValidated != true) return <Redirect to='/' />
                    /* END SECURITY VALIDATIONS */
        return (
            <View style={styles.container}>
                <Text style={styles.titleText}>Publicaciones reservadas</Text>
                <ScrollView>
                    {this.state.reservations.length ? (
                        this.state.reservations.map( obj => {
                            var objReservationCustomerPayment = {
                                reservationPaymentState: obj.CustomerPayment.PaymentDescription,
                                reservationPaymentStateText: obj.CustomerPayment.PaymentDescription,
                                paymentDocument: obj.CustomerPayment.PaymentEvidence,
                                paymentComment: obj.CustomerPayment.PaymentComment,
                                reservationPaymentAmmount: obj.TotalPrice,
                                reservationpaymentDate: obj.CustomerPayment.PaymentDate,
                                IdReservation: obj.IdReservation
                             }
                            var objCommisionPayment = {
                                paymentStatus: obj.CommissionPayment.PaymentDescription, 
                                paymentStatusText: obj.CommissionPayment.PaymentDescription,
                                paymentAmmount: obj.CommissionPayment.Commission,
                                paymentDate: obj.CommissionPayment.PaymentDate,
                                IdReservation :obj.IdReservation
                            };     

                        return(
                            <ReservedPublicationsListScrollView key={obj.IdReservation} isPublisher={true} editReservation={this.editReservation}  
                                obj={obj} objReservationCustomerPayment={objReservationCustomerPayment} objCommisionPayment={objCommisionPayment}
                                triggerScreen = {this.triggerScreen}/>  
                        )   
                    })
                    ) : (
                        <Text style={styles.subTitleText}>No se encontraron resultados</Text>
                    )}                     
                </ScrollView>       
            </View>
        );
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2196f3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleText:{
    fontSize: 32, 
    fontWeight: 'bold',
    color: "#FFF",
    paddingTop: 20,
    marginBottom: 10,
  },
  subTitleText:{
    fontSize: 24, 
    fontWeight: 'bold',
    color: "#FFF",
    marginTop: 60,
    marginBottom: 5,
  },
});

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

export default connect(mapStateToProps, mapDispatchToProps)(ReservedPublicationsList);

/*<ModalResComPay ref={this.ModalResComPay} saveComissionPayment={this.saveComissionPayment}/>
  <ModalResCustPay ref={this.ModalResCustPay} confirmPayment={this.confirmPayment} rejetPayment={this.rejetPayment}/>
  <ModalReqInfo ref={this.modalReqInfo} modalSave={this.modalSave}
    modalConfigObj={this.state.modalConfigObj} triggerSaveModal={this.triggerSaveModal}/>*/