import React, {Component} from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Linking, TextInput, Dimensions} from 'react-native';
import { callAPI } from '../common/genericFunctions';

class ReservationResCustPay extends Component {
    constructor(props) {
        super(props);
        const { navigation } = this.props;
        const objPaymentDetailsParam = navigation.getParam('auxParam', 'default value');
        this.state = {
            modal: false,
            objPaymentDetails: objPaymentDetailsParam,
            paymentComment : "",
            isLoading : false,
            buttonIsDisabled: false
        };
        this.toggle = this.toggle.bind(this);
        this.save = this.save.bind(this);
        this.changeModalLoadingState = this.changeModalLoadingState.bind(this);
    }

    toggle(objPaymentDetails) {
        if (!this.state.isLoading) {
            this.setState({
                modal: !this.state.modal,
                objPaymentDetails: objPaymentDetails || {}
            });
        }
    }

    changeModalLoadingState(closeModal){
        if(closeModal){
            this.setState({
                modal: !this.state.modal,
                isLoading: !this.state.isLoading,
                buttonIsDisabled: !this.state.buttonIsDisabled
            })
        }else{
            this.setState({
                isLoading: !this.state.isLoading,
                buttonIsDisabled: !this.state.buttonIsDisabled
            })
        }
    }

    save() {
        this.changeModalLoadingState(false);
        var objPaymentDetails = this.state.objPaymentDetails;
        objPaymentDetails.paymentComment = this.state.paymentComment;
        this.confirmPayment(this.state.objPaymentDetails);
    }

    deny(){
        this.changeModalLoadingState(false);
        this.rejectPayment();
    }

    rejectPayment = (objPaymentDetails) => {
        var objApi = {};
        objApi.objToSend = {
            "AccessToken": this.props.tokenObj.accesToken,
            "Mail": this.props.userData.Mail,
            "IdReservation": objPaymentDetails.IdReservation,
            "Approved": false
        }
        objApi.fetchUrl = Globals.baseURL + '/reservationPaymentCustomer';
        objApi.method = "PUT";
        objApi.successMSG = {
          //  SUCC_PAYMENTUPDATED: 
        };
        objApi.functionAfterSuccess = "rejectPayment";
        callAPI(objApi);
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
        callAPI(objApi);
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={{alignItems: 'flex-start', marginLeft: 15}}>
                    <Text style={styles.titleText}>Detalle pago de la reserva</Text>
                    <View style={{flexDirection:'row', alignItems: 'center'}}>
                        <View style={{flex:1}}>
                            <Text style={styles.infoText}>Monto </Text>
                        </View>
                        <View style={{flex:1}}>
                            <TextInput style={styles.inputBox} 
                                underlineColorAndroid='rgba(0,0,0,0)'
                                placeholder='Monto'
                                placeholderTextColor="#ffffff"
                                value={this.state.objPaymentDetails.reservationPaymentAmmount.toString()}
                                editable = {false}
                            />
                        </View>
                    </View>
                    <View style={{flexDirection:'row', alignItems: 'center'}}>
                        <View style={{flex:1}}>
                            <Text style={styles.infoText}>Estatus del pago </Text>
                        </View>
                        <View style={{flex:1}}>
                            <TextInput style={styles.inputBox} 
                                underlineColorAndroid='rgba(0,0,0,0)'
                                placeholder='Estatus del pago'
                                placeholderTextColor="#ffffff"
                                value={this.state.objPaymentDetails.reservationPaymentStateText}
                                editable = {false}
                            />
                        </View>
                    </View>
                    <View style={{flexDirection:'row', alignItems: 'center'}}>
                        <View style={{flex:1}}>
                            <Text style={styles.infoText}>Fecha de pago </Text>
                        </View>
                        <View style={{flex:1}}>
                            <TextInput style={styles.inputBox} 
                                underlineColorAndroid='rgba(0,0,0,0)'
                                placeholder='Fecha de pago'
                                placeholderTextColor="#ffffff"
                                value={this.state.objPaymentDetails.reservationpaymentDate == null ? "Pendiente" : this.state.objPaymentDetails.reservationpaymentDate.toString()}
                                editable = {false}
                            />
                        </View>
                    </View>

                    {this.state.objPaymentDetails.reservationPaymentState == "PENDING CONFIRMATION" || this.state.objPaymentDetails.reservationPaymentState == "PAID" ? (
                    <>
                        {this.state.objPaymentDetails.paymentDocument ? (
                            //{this.state.objPaymentDetails.paymentDocument} target="_blank">LINK</a>
                            <Text>LINK</Text>
                        ) : (null)}

                        {this.state.objPaymentDetails.paymentComment ? (
                            <View>
                                <Text>Comentario del cliente</Text>
                                <TextInput style={styles.inputBox} 
                                    multiline = {true}
                                    numberOfLines = {4}
                                    underlineColorAndroid='rgba(0,0,0,0)'
                                    placeholder='Comentario del cliente'
                                    placeholderTextColor="#ffffff"
                                    value={this.state.objPaymentDetails.paymentComment}
                                    editable = {false}
                                />
                            </View>
                        ) : (null)}
                        {this.state.objPaymentDetails.reservationPaymentState == "PAID" ? (
                            <Text>El pago fue confirmado.</Text>
                        ) : (null)}
                    </>
                    ) : (
                        <Text>El cliente aún no realizó el pago</Text>             
                    )}   
                </View>
                <View style={{flexDirection: 'row'}}>
                    <TouchableOpacity style={styles.button} onPress={()=> {this.props.navigation.goBack()}} disabled={this.state.buttonIsDisabled}> 
                        <Text style={styles.buttonText}>Cancelar</Text>
                    </TouchableOpacity>
                    {this.state.objPaymentDetails.reservationPaymentStateText != "PAID" && this.state.objPaymentDetails.reservationPaymentStateText != "CANCELED" ? (
                        <TouchableOpacity style={styles.button} onPress={()=> {this.save}} disabled={this.state.buttonIsDisabled}> 
                            <Text style={styles.buttonText}>Guardar</Text>
                        </TouchableOpacity>
                        ) : (null)
                    }
                </View>        
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
    marginTop: 20,
    marginBottom: 5,
  },
  subTitleText:{
    fontSize: 20, 
    fontWeight: 'bold',
    color: "#FFF",
    marginBottom: 5,
  },
  infoText:{
    color: "#FFF",
  },
  infoText2:{
    color: "#FFF",
    marginTop: 10,
  },
  inputBox: {
    width:180,
    backgroundColor:'rgba(255,255,255,0.3)',
    borderRadius: 25,
    paddingHorizontal: 16,
    fontSize: 16,
    color:'#ffffff',
    marginVertical: 10
  },
  inputBox2: {
    width: Dimensions.get('window').width - 20,
    backgroundColor:'rgba(255,255,255,0.3)',
    borderRadius: 25,
    paddingHorizontal: 16,
    fontSize: 16,
    color:'#ffffff',
    marginVertical: 10
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
    marginHorizontal: 10,
  },
  buttonText: {
    fontSize:16,
    fontWeight:'500',
    color:'#ffffff'
  },
});

export default ReservationResCustPay;