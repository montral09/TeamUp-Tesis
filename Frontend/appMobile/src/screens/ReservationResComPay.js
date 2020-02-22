import React, {Component} from 'react';
import { StyleSheet, Text, View, ScrollView, TextInput, Dimensions, TouchableOpacity} from 'react-native';
import { connect } from 'react-redux';
import translations from '../common/translations';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from "expo-permissions";
import Constants from 'expo-constants';
import { callAPI, displayErrorMessage, displaySuccessMessage } from '../common/genericFunctions';
import { logOut, updateToken } from '../redux/actions/accountActions';

class ReservationResComPay extends Component {
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

    componentDidMount() {
        this.getPermissionAsync();
    }

    save = () => {
        this.saveComissionPayment(this.state.objPaymentDetails);
    }

    // This function will call the API
    saveComissionPayment = (objPaymentDetails) => {
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
        objApi.fetchUrl = "api/reservationPaymentPublisher";
        objApi.method = "POST";
        objApi.successMSG = {
            SUCC_PAYMENTUPDATED: translations[this.props.systemLanguage].messages['SUCC_PAYMENTUPDATED'],
        };
        objApi.functionAfterSuccess = "saveComissionPayment";
        objApi.errorMSG = {}
        callAPI(objApi, this);
    }
    
    // End Upload image functions
    onChange = (evt) => {
        if(evt.target.id != 'paymentComment'){
            if (this.maxSelectFile(evt) && this.checkMimeType(evt) && this.checkFileSize(evt)) {
                console.log(evt.target.files);
                this.setState({ spaceImages: [], tempFiles: evt.target.files }, () => {
                    for (var i = 0; i < this.state.tempFiles.length; i++) {
                        var file = this.state.tempFiles[i]; // FileList object
                        this.getBase64(file);
                    }
                });
                displaySuccessMessage(translations[this.props.systemLanguage].messages['myReservedSpacesList_custPay_succMsg1']);
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
        const { systemLanguage } = this.props;
        return (
            <View style={styles.container}>
                <View style={{alignItems: 'flex-start', marginLeft: 15}}>
                    <Text style={styles.titleText}>{translations[systemLanguage].messages['modalResComPay_header']}</Text>
                    <View style={{flexDirection:'row', alignItems: 'center'}}>
                        <View style={{flex:1}}>
                            <Text style={styles.infoText}>{translations[systemLanguage].messages['amount_w']}</Text>
                        </View>
                        <View style={{flex:1}}>
                            <TextInput style={styles.inputBox} 
                                underlineColorAndroid='rgba(0,0,0,0)'
                                placeholder= {translations[systemLanguage].messages['amount_w']}
                                placeholderTextColor="#ffffff"
                                value={this.state.objPaymentDetails.paymentAmmount.toString()}
                                editable = {false}
                            />
                        </View>
                    </View>
                    <View style={{flexDirection:'row', alignItems: 'center'}}>
                        <View style={{flex:1}}>
                            <Text style={styles.infoText}>{translations[systemLanguage].messages['myReservedSpacesList_custPay_paymentStatusTxt']}</Text>
                        </View>
                        <View style={{flex:1}}>
                            <TextInput style={styles.inputBox} 
                                underlineColorAndroid='rgba(0,0,0,0)'
                                placeholder= {translations[systemLanguage].messages['myReservedSpacesList_custPay_paymentStatusTxt']}
                                placeholderTextColor="#ffffff"
                                value={this.state.objPaymentDetails.paymentStatusText}
                                editable = {false}
                            />
                        </View>
                    </View>
                    <View style={{flexDirection:'row', alignItems: 'center'}}>
                        <View style={{flex:1}}>
                            <Text style={styles.infoText}>{translations[systemLanguage].messages['myReservedSpacesList_custPay_paymentDateTxt']}</Text>
                        </View>
                        <View style={{flex:1}}>
                            <TextInput style={styles.inputBox} 
                                underlineColorAndroid='rgba(0,0,0,0)'
                                placeholder= {translations[systemLanguage].messages['myReservedSpacesList_custPay_paymentDateTxt']}
                                placeholderTextColor="#ffffff"
                                value={this.state.objPaymentDetails.paymentDate == null ? "Pendiente" : this.state.objPaymentDetails.paymentDate.toString()}
                                editable = {false}
                            />
                        </View>
                    </View>
                    {this.state.objPaymentDetails.paymentDocument ? (
                        <View style={{flexDirection:'row', alignItems: 'center'}}>
                            <View style={{flex:1}}>
                                <Text style={styles.infoText}>{translations[systemLanguage].messages['myReservedSpacesList_custPay_uploadedDocument']}</Text>
                            </View>
                            <View style={{flex:1}}>
                                <Text style={styles.infoText}>LINK</Text>
                            </View>
                        </View>
                    ) : (null)}
                    {this.state.objPaymentDetails.paymentStatus != "PAID" && this.state.objPaymentDetails.paymentStatus != "CANCELED" ? (
                        <View style={{flexDirection:'row', alignItems: 'center'}}>
                            <View style={{flex:1}}>
                                <Text style={styles.infoText}>{translations[systemLanguage].messages['myReservedSpacesList_custPay_uploadDocument']}</Text>
                            </View>
                            <View style={{flex:1}}>
                                <TouchableOpacity style={styles.button} onPress={this.pickImage}>
                                    <Text style={styles.buttonText}>Subir prueba</Text>
                                </TouchableOpacity>
                            </View>
                        </View>        
                    ) : (null)}
                    <Text style={styles.infoText}>{translations[systemLanguage].messages['comment_w']} ({translations[systemLanguage].messages['optional_w']})</Text>
                    <TextInput style={styles.inputBox2} 
                        multiline = {true}
                        numberOfLines = {4}
                        underlineColorAndroid='rgba(0,0,0,0)'
                        placeholder= {translations[systemLanguage].messages['comment_w']}
                        placeholderTextColor="#ffffff"
                        value={this.state.objPaymentDetails.paymentComment}
                        onChangeText = {(value) => this.changePaymentComment(value)}
                        editable = {this.state.objPaymentDetails.paymentStatus != "PAID" && this.state.objPaymentDetails.paymentStatus != "CANCELED" ? true : false}
                    />
                    {this.state.objPaymentDetails.paymentStatus != "PAID" && this.state.objPaymentDetails.paymentStatus != "CANCELED" ? (
                        <Text style={styles.infoText}>{translations[systemLanguage].messages['modalResComPay_txt1']} {translations[systemLanguage].messages['modalResComPay_txt2']}</Text> 
                    ) : (
                        this.state.objPaymentDetails.paymentStatus != "CANCELED" ? (<Text>{translations[systemLanguage].messages['modalResComPay_txt3']}</Text>) : (null)
                    )}    
                </View>
                <View style={{flexDirection: 'row'}}>
                    <TouchableOpacity style={styles.button} onPress={()=> {this.props.navigation.goBack()}} disabled={this.state.buttonIsDisabled}> 
                        <Text style={styles.buttonText}>{translations[systemLanguage].messages['close_w']}</Text>
                    </TouchableOpacity>
                    {this.state.objPaymentDetails.paymentStatus != "PAID" && this.state.objPaymentDetails.paymentStatus != "CANCELED" ? (
                        <TouchableOpacity style={styles.button} onPress={()=> {this.save()}} disabled={this.state.buttonIsDisabled}> 
                            <Text style={styles.buttonText}>{translations[systemLanguage].messages['save_w']}</Text>
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
        tokenObj: state.loginData.tokenObj,
        userData: state.loginData.userData,
        systemLanguage: state.loginData.systemLanguage
    }
}

const mapDispatchToProps = (dispatch) =>{
    return{
        logOut: () => dispatch(logOut()),
        updateToken: (tokenObj) => dispatch(updateToken(tokenObj))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ReservationResComPay);