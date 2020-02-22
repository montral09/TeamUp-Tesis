import React, {Component} from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Linking, TextInput, Dimensions} from 'react-native';
import { connect } from 'react-redux';
import { callAPI } from '../common/genericFunctions';
import translations from '../common/translations';

class ReservationResCustPay extends Component {
    constructor(props) {
        super(props);
        const { navigation } = this.props;
        const IdReservationParam = navigation.getParam('IdReservationParam', 'NO-ID');
        const objPaymentDetailsParam = navigation.getParam('auxParam', 'default value');
        this.state = {
            modal: false,
            objPaymentDetails: objPaymentDetailsParam,
            IdReservation: IdReservationParam,
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
            "IdReservation": this.state.IdReservation,
            "Approved": false
        }
        objApi.fetchUrl = "api/reservationPaymentCustomer";
        objApi.method = "PUT";
        objApi.successMSG = {
            SUCC_PAYMENTUPDATED: translations[this.props.systemLanguage].messages['SUCC_PAYMENTUPDATED2'],
        };
        objApi.functionAfterSuccess = "rejectPayment";
        objApi.errorMSG = {}
        callAPI(objApi, this);
    }
    
    confirmPaymentRP = () =>{
        var objApi = {};
        objApi.objToSend = {
            "AccessToken": this.props.tokenObj.accesToken,
            "Mail": this.props.userData.Mail,
            "IdReservation": this.state.IdReservation,
            "Approved": true
        }
        objApi.fetchUrl = "api/reservationPaymentCustomer";
        objApi.method = "PUT";
        objApi.successMSG = {
            SUCC_PAYMENTUPDATED: translations[this.props.systemLanguage].messages['SUCC_PAYMENTUPDATED'],
        };
        objApi.functionAfterSuccess = "confirmPaymentRP";
        objApi.errorMSG = {}
        callAPI(objApi, this);
    }

    openFile = () =>{
        Linking.openURL(this.state.objPaymentDetails.paymentDocument);
    }

    render() {
        const { systemLanguage } = this.props;
        return (
            <View style={styles.container}>
                <View style={{alignItems: 'flex-start', marginLeft: 15}}>
                    <Text style={styles.titleText}>{translations[systemLanguage].messages['modalResCusPay_header']}</Text>
                    <View style={{flexDirection:'row', alignItems: 'center'}}>
                        <View style={{flex:1}}>
                            <Text style={styles.infoText}>{translations[systemLanguage].messages['myReservedSpacesList_custPay_paymentStatusTxt']} </Text>
                        </View>
                        <View style={{flex:1}}>
                            <TextInput style={styles.inputBox} 
                                underlineColorAndroid='rgba(0,0,0,0)'
                                placeholder={translations[systemLanguage].messages['myReservedSpacesList_custPay_paymentStatusTxt']}
                                placeholderTextColor="#ffffff"
                                value={this.state.objPaymentDetails.reservationPaymentStateText}
                                editable = {false}
                            />
                        </View>
                    </View>
                    <View style={{flexDirection:'row', alignItems: 'center'}}>
                        <View style={{flex:1}}>
                            <Text style={styles.infoText}>{translations[systemLanguage].messages['amount_w']} </Text>
                        </View>
                        <View style={{flex:1}}>
                            <TextInput style={styles.inputBox} 
                                underlineColorAndroid='rgba(0,0,0,0)'
                                placeholder={translations[systemLanguage].messages['amount_w']}
                                placeholderTextColor="#ffffff"
                                value={this.state.objPaymentDetails.reservationPaymentAmmount.toString()}
                                editable = {false}
                            />
                        </View>
                    </View>
                    <View style={{flexDirection:'row', alignItems: 'center'}}>
                        <View style={{flex:1}}>
                            <Text style={styles.infoText}>{translations[systemLanguage].messages['myReservedSpacesList_custPay_paymentDateTxt']} </Text>
                        </View>
                        <View style={{flex:1}}>
                            <TextInput style={styles.inputBox} 
                                underlineColorAndroid='rgba(0,0,0,0)'
                                placeholder={translations[systemLanguage].messages['myReservedSpacesList_custPay_paymentDateTxt']}
                                placeholderTextColor="#ffffff"
                                value={this.state.objPaymentDetails.reservationpaymentDate == null ? translations[systemLanguage].messages['pending_w'] : this.state.objPaymentDetails.reservationpaymentDate.toString()}
                                editable = {false}
                            />
                        </View>
                    </View>

                    {this.state.objPaymentDetails.reservationPaymentState == "PENDING CONFIRMATION" || this.state.objPaymentDetails.reservationPaymentState == "PAID" ? (
                    <>
                        {this.state.objPaymentDetails.paymentDocument ? (
                            <TouchableOpacity style={styles.button} onPress={()=> {this.openFile()}}> 
                                <Text style={styles.buttonText}>LINK</Text>
                            </TouchableOpacity>
                        ) : (null)}

                        {this.state.objPaymentDetails.paymentComment ? (
                            <View>
                                <Text>{translations[systemLanguage].messages['modalResCusPay_commentByCust']}</Text>
                                <TextInput style={styles.inputBox} 
                                    multiline = {true}
                                    numberOfLines = {4}
                                    underlineColorAndroid='rgba(0,0,0,0)'
                                    placeholder={translations[systemLanguage].messages['modalResCusPay_commentByCust']}
                                    placeholderTextColor="#ffffff"
                                    value={this.state.objPaymentDetails.paymentComment}
                                    editable = {false}
                                />
                            </View>
                        ) : (null)}
                        {this.state.objPaymentDetails.reservationPaymentState == "PAID" ? (
                            <View style={{aligntItems: 'center'}}> 
                                <Text style={styles.infoText}>{translations[systemLanguage].messages['modalResCusPay_txt3']}</Text>
                            </View>
                        ) : (null)}
                    </>
                    ) : (
                        <View style={{aligntItems: 'center'}}> 
                            <Text style={styles.infoText}>{translations[systemLanguage].messages['modalResCusPay_txt4']}</Text>             
                        </View>
                    )}   
                </View>
                <View style={{flexDirection: 'row'}}>
                    <TouchableOpacity style={styles.button} onPress={()=> {this.props.navigation.goBack()}} disabled={this.state.buttonIsDisabled}> 
                        <Text style={styles.buttonText}>{translations[systemLanguage].messages['cancel_w']}</Text>
                    </TouchableOpacity>
                    {this.state.objPaymentDetails.reservationPaymentState == 'PENDING CONFIRMATION' ? (
                    <>
                        <TouchableOpacity style={styles.button} onPress={()=> {this.rejectPayment()}} disabled={this.state.buttonIsDisabled}> 
                            <Text style={styles.buttonText}>{translations[systemLanguage].messages['reject_w']}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={()=> {this.confirmPaymentRP()}} disabled={this.state.buttonIsDisabled}> 
                            <Text style={styles.buttonText}>{translations[systemLanguage].messages['confirm_w']}</Text>
                        </TouchableOpacity>
                    </>
                    ) : (null)}
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

const mapStateToProps = (state) => {
    return {
        tokenObj: state.loginData.tokenObj,
        userData: state.loginData.userData,
        systemLanguage: state.loginData.systemLanguage
    }
}

export default connect(mapStateToProps)(ReservationResCustPay);