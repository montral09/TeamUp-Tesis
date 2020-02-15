import React, {Component} from 'react';
import { StyleSheet, Text, View, ScrollView, Keyboard, TouchableOpacity} from 'react-native';
import { connect } from 'react-redux';
import { callAPI } from '../common/genericFunctions';
import { MAX_ELEMENTS_PER_TABLE } from '../common/constants';
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
            reservationsToDisplay: [],
            loadingStatusChange : false,
            modalConfigObj : {},
            selectedIdRes : null,
            generalError : false,
            selectedResState : "",
            pagination: [1],
            currentPage: 1
        }

        //this.modalReqInfo = React.createRef(); // Connects the reference to the modal
        //this.ModalResCustPay = React.createRef(); // Connects the reference to the modal
        //this.ModalResComPay = React.createRef(); // Connects the reference to the modal
        //this.loadMyReservationsRP = this.loadMyReservationsRP.bind(this);   
        this.triggerScreen = this.triggerScreen.bind(this);   
        this.saveCancel = this.saveCancel.bind(this);
        this.saveConfirm = this.saveConfirm.bind(this);
        //this.triggerSaveModal = this.triggerSaveModal.bind(this);
        this.saveComissionPayment = this.saveComissionPayment.bind(this);
        //this.confirmPayment = this.confirmPayment.bind(this);
        this.handleExpiredToken = this.handleExpiredToken.bind(this);
    }

    componentDidMount() {
        this.loadMyReservationsRP();
    }

    handleErrors(error) {
        this.setState({ generalError: true });
    }

    loadMyReservationsRP = () => {
        var objApi = {};
        objApi.objToSend = {
            "AccessToken": this.props.tokenObj.accesToken,
            "Mail": this.props.userData.Mail
        }
        objApi.fetchUrl = "api/reservationCustomer";
        objApi.method = "POST";
        objApi.successMSG = {
            SUCC_RESERVATIONSOK: '',
        };
        objApi.functionAfterSuccess = "loadMyReservationsRP";
        objApi.errorMSG = {}
        objApi.logOut = this.props.logOut;
        callAPI(objApi, this);
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
                this.props.navigation.navigate('ReservationResCustPay', {auxParam: auxParam});
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

    changePage = (pageClicked) => {
        console.log("TODISPLAY: " + JSON.stringify(this.state.reservationsToDisplay))
        console.log("Reservations: " + JSON.stringify(this.state.reservations))
        /*this.setState({ reservationsToDisplay: this.filterPaginationArray(this.state.reservations, (pageClicked - 1) * MAX_ELEMENTS_PER_TABLE), currentPage: pageClicked },
            () => this.setState({ reservationsToDisplay: this.filterPaginationArray(this.state.reservations, (pageClicked - 1) * MAX_ELEMENTS_PER_TABLE), currentPage: pageClicked }))*/
    }

    filterPaginationArray = (arrayToFilter, startIndex) => {
        return arrayToFilter.slice(startIndex, startIndex + MAX_ELEMENTS_PER_TABLE)
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
                    {this.state.reservationsToDisplay.length ? (
                        <>
                        {this.state.reservationsToDisplay.map( obj => {
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
                        
                    })}
                        <View style={{flexDirection: 'row'}}>
                            {this.state.pagination.map(page => {
                                return (
                                    <TouchableOpacity style={styles.button} key={page} onPress={() => this.changePage(page)}><Text style={styles.buttonText}>{page}</Text></TouchableOpacity>
                                );
                            })}  
                        </View>  
                        </>  
                    ) : (
                        <>
                        <Text style={styles.subTitleText}>No se encontraron resultados</Text>
                        <TouchableOpacity style={styles.button} onPress={() => this.changePage(1)}><Text style={styles.buttonText}>Test</Text></TouchableOpacity>
                        </>
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
  button: {
    width:100,
    height:30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:'#0069c0',
    borderRadius: 15,
    marginVertical: 20,
    elevation: 3,
    paddingHorizontal: 5,
  },
  buttonText: {
    fontSize:16,
    fontWeight:'500',
    color:'#ffffff'
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