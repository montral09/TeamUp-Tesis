import React, {Component} from 'react';
import { StyleSheet, Text, View, ScrollView, Keyboard, TouchableOpacity, ToastAndroid} from 'react-native';
import { connect } from 'react-redux';
import { Header } from 'react-native-elements';
import { callAPI } from '../common/genericFunctions';
import { MAX_ELEMENTS_PER_TABLE } from '../common/constants';

import ReservationSpacesListScrollView from '../components/ReservationSpacesListScrollView';

import Globals from '../Globals';

class ReservationSpaceList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loadingReservations : true,
            reservationId : null,
            reservations : [],
            reservationsToDisplay: [],
            modalConfigObj : {},
            generalError : false,
            selectedIdRes : null,
            selectedResState : "",
            pagination: [1],
            currentPage: 1,
        }
        this.bindFunctions();
    }

    bindFunctions(){  
        //this.confirmEditReservation = this.confirmEditReservation.bind(this);
        //this.saveRate = this.saveRate.bind(this);
        //this.saveCancel = this.saveCancel.bind(this);
    }

    handleErrors(error) {
        this.setState({ generalError: true });
    }

    componentDidMount() {
        this.loadMyReservationsMRSL();
    }

    changePage = (pageClicked) => {
        this.setState({ reservationsToDisplay: this.filterPaginationArray(this.state.reservations, (pageClicked - 1) * MAX_ELEMENTS_PER_TABLE), currentPage: pageClicked },
            () => this.setState({ reservationsToDisplay: this.filterPaginationArray(this.state.reservations, (pageClicked - 1) * MAX_ELEMENTS_PER_TABLE), currentPage: pageClicked }))
    }

    filterPaginationArray = (arrayToFilter, startIndex) => {
        return arrayToFilter.slice(startIndex, startIndex + MAX_ELEMENTS_PER_TABLE)
    }

    loadMyReservationsMRSL = () => {
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
        objApi.functionAfterSuccess = "loadMyReservationsMRSL";
        objApi.errorMSG = {}
        callAPI(objApi, this);
    }

    /*loadMyReservations(){
        try {
            fetch(Globals.baseURL + '/reservationCustomer', {
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
                    ToastAndroid.showWithGravity(
                        'Hubo un error',
                        ToastAndroid.LONG,
                        ToastAndroid.CENTER,
                    );
                }
            }
            ).catch(error => {
                ToastAndroid.showWithGravity(
                    'Internal error',
                    ToastAndroid.LONG,
                    ToastAndroid.CENTER,
                );
                console.log(error);
            }
        )
        }catch(error){
            ToastAndroid.showWithGravity(
                'Internal error',
                ToastAndroid.LONG,
                ToastAndroid.CENTER,
            );
            console.log(error);
        }
    }*/

    triggerScreen = (mode, IdReservation, auxParam) => {
        var modalConfigObj = {};
        switch (mode) {
            case "CANCEL": 
                screenConfigObj ={
                    title: 'Cancelar reserva', mainText: 'Desea cancelar la reserva? Por favor indique el motivo ', mode : mode, saveFunction : "saveCancel", textboxLabel: 'Comentario',
                    textboxDisplay:true, cancelAvailable:true, confirmAvailable:true, cancelText :'No', confirmText :'Si' , login_status: this.props.login_status
                };
                this.props.navigation.navigate('ReservationReqInfo', {screenConfig: screenConfigObj});
            break;
            case "RATE":
                modalConfigObj = {
                    title: this.props.translate('myReservedSpacesList_modalRate_header'), mainText: this.props.translate('myReservedSpacesList_modalRate_main'), mode: mode, saveFunction: "saveRateMRSL", textboxLabel: this.props.translate('comment_w'),
                    textboxDisplay: true, cancelAvailable: true, confirmAvailable: true, cancelText: this.props.translate('cancel_w'), confirmText: this.props.translate('rate_w'), login_status: this.props.login_status,
                    optionDisplay: true, optionLabel: this.props.translate('score_w'), optionArray: [5, 4, 3, 2, 1]
                };
                this.setState({ modalConfigObj: modalConfigObj, selectedIdRes: IdReservation, selectedResState: auxParam }, () => { this.modalReqInfo.current.toggle(); })
                break;
            case "PAYCUSTRES":
                this.props.navigation.navigate('ReservationCustResPay', {auxParam: auxParam});
                break;
            case "EDIT":
                this.props.navigation.navigate('ReservationEditResCustPay', {auxParam: auxParam});
                break;
        }
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

    confirmEditReservation(modalInfo) {
        let {IdReservation, HourFrom, HourTo, TotalPrice, People} = modalInfo.resDataChanged;
        let objRes = {
            AccessToken: this.props.tokenObj.accesToken,
            Mail: this.props.userData.Mail,
            IdReservation: IdReservation,
            DateFrom: this.convertDate(modalInfo.dateFrom),
            HourFrom: HourFrom,
            HourTo: HourTo,
            TotalPrice: TotalPrice,
            People : People
        }
        this.modalElement.current.changeModalLoadingState(false);
        fetch(Globals.baseURL + '/reservationCustomer', {
            method: 'PUT',
            header: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify(objRes)
        }).then(response => response.json()).then(data => {
            console.log("data:" + JSON.stringify(data));
            if (data.responseCode == "SUCC_RESERVATIONUPDATED") {
                ToastAndroid.showWithGravity(
                    'Reserva modificada correctamente',
                    ToastAndroid.LONG,
                    ToastAndroid.CENTER,
                );
                //this.modalElement.current.changeModalLoadingState(true);                               
                this.loadMyReservations();
            } else if (data.Message) {
                    ToastAndroid.showWithGravity(
                        'Hubo un error',
                        ToastAndroid.LONG,
                        ToastAndroid.CENTER,
                    );
                }
        }
        ).catch(error => {
            ToastAndroid.showWithGravity(
                'Internal error',
                ToastAndroid.LONG,
                ToastAndroid.CENTER,
            );
            console.log(error);
        }
        )
    }

    /*triggerModal(mode, IdReservation, auxParam){
        var modalConfigObj = {};
        switch(mode){
            case "CANCEL":
                modalConfigObj ={
                    title: 'Cancelar reserva', mainText: 'Desea cancelar la reserva? Por favor indique el motivo ', mode : mode, saveFunction : "saveCancel", textboxLabel: 'Comentario',
                    textboxDisplay:true, cancelAvailable:true, confirmAvailable:true, cancelText :'No', confirmText :'Si' , login_status: this.props.login_status
                };
                this.setState({modalConfigObj : modalConfigObj, selectedIdRes: IdReservation, selectedResState: auxParam},() => {this.modalReqInfo.current.toggle();})
            break;
            case "RATE":
                modalConfigObj ={
                    title: 'Calificar reserva', mainText: 'Por favor, denos su calificación sobre la reserva y el lugar ', mode : mode, saveFunction : "saveRate", textboxLabel: 'Comentario',
                    textboxDisplay:true, cancelAvailable:true, confirmAvailable:true, cancelText :'Cancelar', confirmText :'Calificar' , login_status: this.props.login_status,
                    optionDisplay: true, optionLabel: 'Puntuación', optionDefaultValue:1, optionArray: [5,4,3,2,1]
                };
                this.setState({modalConfigObj : modalConfigObj, selectedIdRes: IdReservation, selectedResState: auxParam},() => {this.modalReqInfo.current.toggle();})
            break;
            case "PAYRESCUST": 
                this.ModalCustResPay.current.toggle(auxParam);
            break;
        }
    }*/

    

    saveRate(optionValue, commentValue){
        var objApi = {};
        objApi.objToSend = {
            "AccessToken": this.props.tokenObj.accesToken,
            "VOReview": {
                "Rating": optionValue,
                "Review": commentValue,
                "IdReservation": this.state.selectedIdRes,
                "Mail": this.props.userData.Mail
            }        
        }
        objApi.fetchUrl = Globals.baseURL + '/review';
        objApi.method = "POST";
        objApi.responseSuccess = "SUCC_REVIEWCREATED";
        objApi.successMessage = "Calificación realizada correctamente!";
        objApi.functionAfterSuccess = "saveRate";
        //this.modalReqInfo.current.changeModalLoadingState(false);
        this.callAPI(objApi);
    }
    
    /*saveCustReservationPayment(objPaymentDetails){
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
        console.log("confirmPayment: objToSend")
        console.log(objApi.objToSend)
        objApi.fetchUrl = "https://localhost:44372/api/reservationPaymentCustomer";
        objApi.method = "POST";
        objApi.responseSuccess = "SUCC_PAYMENTUPDATED";
        objApi.successMessage = "Se ha confirmado el envío de pago";
        objApi.functionAfterSuccess = "confirmPayment";
        this.callAPI(objApi);
    }*/
    
    /*callAPI(objApi){
        if(objApi.method == "GET"){
            fetch(objApi.fetchUrl).then(response => response.json()).then(data => {
                if (data.responseCode == objApi.responseSuccess) {
                    if(objApi.successMessage != ""){
                        ToastAndroid.showWithGravity(
                            objApi.successMessage,
                            ToastAndroid.LONG,
                            ToastAndroid.CENTER,
                        );            
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
        }else{
            fetch(objApi.fetchUrl,{
                    method: objApi.method,
                    header: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                    body: JSON.stringify(objApi.objToSend)
                }).then(response => response.json()).then(data => {
                if (data.responseCode == objApi.responseSuccess) {
                    if(objApi.successMessage != ""){
                        ToastAndroid.showWithGravity(
                            objApi.successMessage,
                            ToastAndroid.LONG,
                            ToastAndroid.CENTER,
                        ); 
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
    }*/

    /*callFunctionAfterApiSuccess(trigger, data){
        switch(trigger){
            case "saveCancel"   :
            case "saveRate" : 
                this.modalReqInfo.current.changeModalLoadingState(true);
                this.loadMyReservations();
            break;
            case "confirmPayment":
                this.ModalCustResPay.current.changeModalLoadingState(true);
                this.loadMyReservations();
            break;
        }
    }*/

    render() {
        if (this.props.login_status != 'LOGGED_IN') return <Redirect to='/' />
        if (this.state.generalError) return <Redirect to='/error' />
        return (
            <>
            {this.state.pubId == null ? (
                <View style={styles.container}>
                <Header
                    leftComponent={{ icon: 'menu', color: '#fff', flex:1, onPress: () => this.props.navigation.openDrawer()}}
                    rightComponent={{ icon: 'home', color: '#fff', flex:1, onPress: () => this.props.navigation.navigate('Home')}}
                />                    
                <Text style={styles.titleText}>Mis reservas</Text>
                <ScrollView vertical>
                    <View style={{flex:1}}>
                    <View style={{marginTop: 20, elevation: 3}}>
                        {
                        this.state.reservationsToDisplay.map((reservation) => {   
                        var newObj = {
                            IdReservation: reservation.IdReservation,
                            Title: reservation.TitlePublication,
                            People: reservation.People,
                            Date: reservation.DateFromString,
                            TotalPrice: reservation.TotalPrice,
                            PlanSelected: reservation.PlanSelected,
                            HourFrom: reservation.HourFrom,
                            HourTo: reservation.HourTo,
                            StateDescription: reservation.StateDescription,
                        }
                        var objReservationCustomerPayment = {
                            reservationPaymentState: reservation.CustomerPayment.PaymentDescription,
                            reservationPaymentStateText: reservation.CustomerPayment.PaymentDescription,
                            paymentDocument: reservation.CustomerPayment.PaymentEvidence,
                            paymentComment: reservation.CustomerPayment.PaymentComment,
                            reservationPaymentAmmount: reservation.TotalPrice,
                            reservationpaymentDate: reservation.CustomerPayment.PaymentDate,
                        }
                            return (<ReservationSpacesListScrollView key={reservation.IdReservation} parentData={newObj} navigate={this.props.navigation.navigate}
                                    objReservationCustomerPayment={objReservationCustomerPayment} triggerScreen={this.triggerScreen} editReservation={this.editReservation}
                                    /> );
                        })
                        }
                    </View>
                    <View style={{flexDirection: 'row'}}>
                        {this.state.pagination.map(page => {
                            return (
                                <TouchableOpacity style={styles.button} key={page} onPress={() => this.changePage(page)}><Text style={styles.buttonText}>{page}</Text></TouchableOpacity>
                            );
                        })}  
                    </View>
                    </View>
                </ScrollView>
            </View>
            
            ): (<View style={styles.container}>
                    <Text style={styles.titleText}>Mis reservas</Text>
                    <Text style={styles.subTiteText}>No ha realizado reservas</Text>
                </View>)
            }
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

export default connect(mapStateToProps)(ReservationSpaceList);

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
    marginTop: 20,
    marginBottom: 5,
  },
  subTiteText:{
    fontSize: 24, 
    fontWeight: 'bold',
    color: "#FFF",
    marginTop: 60,
    marginBottom: 5,
  },
  button: {
    width:40,
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