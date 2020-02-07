import React, {Component} from 'react';
import { StyleSheet, Text, View, ScrollView, Keyboard, TouchableOpacity, Linking, TextInput, Dimensions} from 'react-native';
import { callAPI } from '../common/genericFunctions';

class ReservationCustResPay extends Component {
    constructor(props) {
        super(props);
        const { navigation } = this.props;
        const objPaymentDetailsParam = navigation.getParam('auxParam', 'default value');
        this.state = {
            modal: false,
            objPaymentDetails: objPaymentDetailsParam,
            reservationComment: "",
            isLoading: false,
            buttonIsDisabled: false
        };
        this.toggle = this.toggle.bind(this);
        this.save = this.save.bind(this);
        this.changeModalLoadingState = this.changeModalLoadingState.bind(this);
        this.getBase64 = this.getBase64.bind(this);
    }

    toggle(objPaymentDetails) {
        if (!this.state.isLoading) {
            this.setState({
                modal: !this.state.modal,
                objPaymentDetails: objPaymentDetails || {}
            });
        }
    }

    changeModalLoadingState(closeModal) {
        if (closeModal) {
            this.setState({
                modal: !this.state.modal,
                isLoading: !this.state.isLoading,
                buttonIsDisabled: !this.state.buttonIsDisabled
            })
        } else {
            this.setState({
                isLoading: !this.state.isLoading,
                buttonIsDisabled: !this.state.buttonIsDisabled
            })
        }
    }

    save() {
        this.changeModalLoadingState(false);
        this.saveCustReservationPayment(this.state.objPaymentDetails);
    }

    saveCustReservationPayment = (objPaymentDetails) => {
        var objApi = {};
        objApi.objToSend = {
            "AccessToken": this.props.tokenObj.accesToken,
            "Mail": this.props.userData.Mail,
            "IdReservation": objPaymentDetails.IdReservation,
            "Comment": objPaymentDetails.paymentComment || "",
            "Evidence": {
                "Base64String": objPaymentDetails.archivesUpload ? objPaymentDetails.archivesUpload[0].Base64String : "",
                "Extension": objPaymentDetails.archivesUpload ? objPaymentDetails.archivesUpload[0].Extension : ""
            }
        }
        objApi.fetchUrl = "api/reservationPaymentCustomer";
        objApi.method = "POST";
        objApi.successMSG = {
            SUCC_PAYMENTUPDATED: this.props.translate('SUCC_PAYMENTUPDATED'),
        };
        objApi.functionAfterSuccess = "saveCustReservationPayment";
        callAPI(objApi, this);
    }



    // Upload image functions
    maxSelectFile = (event) => {
        let files = event.target.files // create file object
        if ( files.length > 1) {
            event.target.value = null // discard selected file
            ToastAndroid.showWithGravity(
                'Solo puede subir un archivo',
                ToastAndroid.LONG,
                ToastAndroid.CENTER,
            ); 
            return false;
        }
        return true;
    }

    checkMimeType = (event) => {
        //getting file object
        let files = event.target.files
        //define message container
        let err = ''
        // list allow mime type
        const types = ['image/png', 'image/jpeg', 'application/pdf']
        // loop access array
        for (var x = 0; x < files.length; x++) {
            // compare file type find doesn't matach
            if (types.every(type => files[x].type !== type)) {
                // create error message and assign to container   
                err += files[x].type + ' no es un formato soportado\n';
            }
        };

        if (err !== '') { // if message not empty that mean has error 
            event.target.value = null // discard selected file
            ToastAndroid.showWithGravity(
                err,
                ToastAndroid.LONG,
                ToastAndroid.CENTER,
            ); 
            return false;
        }
        return true;

    }

    checkFileSize = (event) => {
        let files = event.target.files
        let size = 1500000;
        let err = "";
        for (var x = 0; x < files.length; x++) {
            if (files[x].size > size) {
                err += files[x].type + ' es demasiado grande, por favor elija un archivo de menor tamaño\n';
            }
        };
        if (err !== '') {
            event.target.value = null
            ToastAndroid.showWithGravity(
                err,
                ToastAndroid.LONG,
                ToastAndroid.CENTER,
            ); 
            return false
        }

        return true;

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

    getBase64(file) {
        var f = file; // FileList object
        var reader = new FileReader();
        // Closure to capture the file information.
        const scope = this;
        reader.onload = (function (theFile) {
            return function (e) {
                var binaryData = e.target.result;
                //Converting Binary Data to base 64
                var base64String = window.btoa(binaryData);
                //showing file converted to base64
                const fileTypeArr = file.type.split('/');
                var fileObj = {
                    Extension: fileTypeArr[1],
                    Base64String: base64String
                };
                var newarchivesUpload = [];
                if (scope.state) {
                    newarchivesUpload = scope.state.objPaymentDetails.archivesUpload || [];
                }
                newarchivesUpload.push(fileObj);
                var objPaymentDetails = {
                    ...scope.state.objPaymentDetails,
                    'archivesUpload': newarchivesUpload
                }
                scope.setState({ objPaymentDetails: objPaymentDetails });
            };
        })(f);
        // Read in the image file as a data URL.
        reader.readAsBinaryString(f);
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
                                <Text style={styles.infoText} onPress={() => Linking.openURL(this.state.objPaymentDetails.paymentDocument)}>Archivo subido</Text>
                            </View>
                        </View>
                    ) : (null)}
                    {this.state.objPaymentDetails.reservationPaymentStateText != "PAID" && this.state.objPaymentDetails.reservationPaymentStateText != "CANCELED" ? (
                        <View style={{flexDirection:'row', alignItems: 'center'}}>
                            <View style={{flex:1}}>
                                <Text style={styles.infoText}>Documento prueba </Text>
                            </View>
                            <View style={{flex:1}}>
                                <Text style={styles.infoText} /*onPress={() => Linking.openURL(this.state.objPaymentDetails.paymentDocumentNew)}*/>Subir Imagen</Text>
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
                        value={this.state.objPaymentDetails.reservationpaymentDate == null ? "Pendiente" : this.state.objPaymentDetails.reservationpaymentDate}
                        editable = {this.state.objPaymentDetails.reservationPaymentStateText == "PAID" || this.state.objPaymentDetails.reservationPaymentStateText == "CANCELED" ? true : false}
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

export default ReservationCustResPay;