import React, {Component} from 'react';
import { StyleSheet, Text, View, ScrollView, Keyboard, TouchableOpacity, Linking, TextInput, Dimensions} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from "expo-permissions";
import Constants from 'expo-constants';
import translations from '../common/translations';
import { connect } from 'react-redux';
import { callAPI, displayErrorMessage, displaySuccessMessage } from '../common/genericFunctions';

class ReservationCustResPay extends Component {
    constructor(props) {
        super(props);
        const { navigation } = this.props;
        const IdReservationParam = navigation.getParam('IdReservationParam', 'NO-ID');
        const objPaymentDetailsParam = navigation.getParam('auxParam', 'default value');
        this.state = {
            modal: false,
            objPaymentDetails: objPaymentDetailsParam,
            IdReservation: IdReservationParam,
            reservationComment: "",
            isLoading: false,
            buttonIsDisabled: false
        };
    }

    save = () => {
        this.saveCustReservationPayment(this.state.objPaymentDetails);
    }

    saveCustReservationPayment = (objPaymentDetails) => {
        var objApi = {};
        objApi.objToSend = {
            "AccessToken": this.props.tokenObj.accesToken,
            "Mail": this.props.userData.Mail,
            "IdReservation": this.state.IdReservation,
            "Comment": objPaymentDetails.paymentComment || "",
            "Evidence": {
                "Base64String": objPaymentDetails.archivesUpload ? objPaymentDetails.archivesUpload[0].Base64String : "",
                "Extension": objPaymentDetails.archivesUpload ? objPaymentDetails.archivesUpload[0].Extension : ""
            }
        }
        objApi.fetchUrl = "api/reservationPaymentCustomer";
        objApi.method = "POST";
        objApi.successMSG = {
            SUCC_PAYMENTUPDATED: translations[this.props.systemLanguage].messages['SUCC_PAYMENTUPDATED'],
        };
        objApi.functionAfterSuccess = "saveCustReservationPayment";
        callAPI(objApi, this);
    }

    // End Upload image functions
    onChange = (evt) => {
        if(evt.target.id != "paymentComment"){
            if (this.maxSelectFile(evt) && this.checkMimeType(evt) && this.checkFileSize(evt)) {
                console.log(evt.target.files);
                this.setState({ spaceImages: [], tempFiles: evt.target.files }, () => {
                    for (var i = 0; i < this.state.tempFiles.length; i++) {
                        var file = this.state.tempFiles[i]; // FileList object
                        this.getBase64(file);
                    }
                });
                ToastAndroid.showWithGravity(
                    'Archivo cargado correctamente. ',
                    ToastAndroid.LONG,
                    ToastAndroid.CENTER,
                ); 
            }
        }else{
            var objPaymentDetails = {
                ...this.state.objPaymentDetails,
                [evt.target.id]: evt.target.value
            }
            this.setState({
                objPaymentDetails: objPaymentDetails
            });
        }

    }

    getPermissionAsync = async () => {
        if (Constants.platform.ios) {
            const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
            if (status !== 'granted') {
                alert('Sorry, we need camera roll permissions to make this work!');
            }
        }
    }

    pickImage = async () => {
        try{ 
            const { status } = await Permissions.askAsync(Permissions.CAMERA, Permissions.CAMERA_ROLL)
            if (status === 'granted') {
                const result = await ImagePicker.launchImageLibraryAsync({
                    mediaTypes: ImagePicker.MediaTypeOptions.All,
                    allowsEditing: false,
                    aspect: [4, 3],
                    base64: true,
                });
                console.log(result)
                var extension = "";
                let i = (result.uri).lastIndexOf('.');
                if (i > 0) {
                    extension = (result.uri).substring(i+1);
                }
                if (extension != 'jpg' && extension != 'png'){
                    displayErrorMessage(translations[this.props.systemLanguage].messages['myReservedSpacesList_custPay_errorMsg2'])
                    return;
                }
                var fileObj = {
                    Extension: extension,
                    Base64String: result.base64,
                };
                var newarchivesUpload = [];
                newarchivesUpload.push(fileObj);
                var objPaymentDetails = {
                    ...this.state.objPaymentDetails,
                    'archivesUpload': newarchivesUpload
                }
                this.setState({ objPaymentDetails: objPaymentDetails });
                displaySuccessMessage(translations[this.props.systemLanguage].messages['myReservedSpacesList_custPay_succMsg1'])
            }
        }catch (err) {
            //console.log("ERROR", (err && err.message) + "\n" + JSON.stringify(err));
        }
    };

    changePaymentComment(value){
        var objPaymentDetails = {
            ...this.state.objPaymentDetails,
            paymentComment: value
        }
        this.setState({
            objPaymentDetails: objPaymentDetails
        });
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

                    {this.state.objPaymentDetails.paymentDocument ? (
                        <View style={{flexDirection:'row', alignItems: 'center'}}>
                            <View style={{flex:1}}>
                                <Text style={styles.infoText}>Documento subido </Text>
                            </View>
                            <View style={{flex:1}}>
                                <TouchableOpacity style={styles.button} onPress={() => Linking.openURL(this.state.objPaymentDetails.paymentDocument)}> 
                                    <Text style={styles.buttonText}>LINK</Text>
                                </TouchableOpacity>        
                            </View>
                        </View>
                    ) : (null)}
                    {this.state.objPaymentDetails.reservationPaymentStateText != "PAID" && this.state.objPaymentDetails.reservationPaymentStateText != "CANCELED" ? (
                        <View style={{flexDirection:'row', alignItems: 'center'}}>
                            <View style={{flex:1}}>
                                <Text style={styles.infoText}>Documento prueba </Text>
                            </View>
                            <View style={{flex:1}}>
                                <TouchableOpacity style={styles.button} onPress={this.pickImage}>
                                    <Text style={styles.buttonText}>Subir prueba</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        // value={this.state.objPaymentDetails.paymentDocumentNew} onChange={this.onChange} />   
                    ) : (null)}
                    <Text style={styles.infoText2}>Comentario (opcional)</Text>
                    <TextInput style={styles.inputBox2} 
                        multiline = {true}
                        numberOfLines = {4}
                        underlineColorAndroid='rgba(0,0,0,0)'
                        placeholder='Comentario'
                        placeholderTextColor="#ffffff"
                        value={this.state.objPaymentDetails.paymentComment}
                        onChangeText={(value) => this.changePaymentComment(value)}
                        editable = {this.state.objPaymentDetails.reservationPaymentStateText == "PAID" || this.state.objPaymentDetails.reservationPaymentStateText == "CANCELED" ? false : true}
                    />
                    {this.state.objPaymentDetails.reservationPaymentStateText != "PAID" && this.state.objPaymentDetails.reservationPaymentStateText != "CANCELED" ? (
                            <Text style={styles.infoText}>Atencion! El pago deberá ser confirmado por el gestor.{'\n'}Puede adjuntar una imagen/pdf y agregar un comentario.</Text>
                        ) : (
                            <Text style={styles.infoText}>El pago fue confirmado.</Text>
                        )
                    }
                </View>   
                <View style={{flexDirection: 'row'}}>
                    <TouchableOpacity style={styles.button} onPress={()=> {this.props.navigation.goBack()}} disabled={this.state.buttonIsDisabled}> 
                        <Text style={styles.buttonText}>Cancelar</Text>
                    </TouchableOpacity>
                    {this.state.objPaymentDetails.reservationPaymentStateText != "PAID" && this.state.objPaymentDetails.reservationPaymentStateText != "CANCELED" ? (
                        <TouchableOpacity style={styles.button} onPress={()=> {this.save()}} disabled={this.state.buttonIsDisabled}> 
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

const mapStateToProps = (state) => {
    return {
        login_status: state.loginData.login_status,
        userData: state.loginData.userData,
        tokenObj: state.loginData.tokenObj,
        systemLanguage: state.loginData.systemLanguage
    }
}

export default connect(mapStateToProps)(ReservationCustResPay);