import React, {Component} from 'react';
import { StyleSheet, Text, View, Picker, Keyboard, TextInput, TouchableOpacity} from 'react-native';
import { callAPI } from '../common/genericFunctions';
import { connect } from 'react-redux';
import translations from '../common/translations';

class ReservationReqInfo extends Component {
    constructor(props) {
        super(props);
        const { navigation } = this.props;
        const screenConfigParam = navigation.getParam('screenConfig', 'default value');
        const IdReservationParam = navigation.getParam('selectedIdRes', 'NO-ID');
        this.state = {
            modal: false,
            selectedIdRes: IdReservationParam,
            optionalData: {},
            optionValue: 5,
            textboxValue: "",
            isLoading : false,
            buttonIsDisabled: false,
            screenConfig: screenConfigParam,  
        };
        this.save = this.save.bind(this);
        this.cancel = this.cancel.bind(this);
        this.changeModalLoadingState = this.changeModalLoadingState.bind(this);
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
        if(this.screenConfig.saveFunction){
            this.triggerSaveScreen(this.screenConfig.saveFunction,{optionValue:this.state.optionValue, textboxValue:this.state.textboxValue })
        }else{
            this.props.modalSave(this.state.textboxValue);
        }
    }

    triggerSaveScreen = (saveFunction, objData) => {
        switch (saveFunction) {
            case "saveCancelRP": this.saveCancelRP(objData.textboxValue); break;
            case "saveRateMRSL": this.saveRateMRSL(objData.optionValue, objData.textboxValue); break;
            case "saveConfirmRP": this.saveConfirmRP(objData.dateSelectValue); break;
        }
    }

    saveCancelRP = (commentValue) => {
        var objApi = {};
        objApi.objToSend = {
            "AccessToken": this.props.tokenObj.accesToken,
            "IdReservation": this.state.selectedIdRes,
            "Mail": this.props.userData.Mail,
            "OldState": this.state.selectedResState,
            "NewState": "CANCELED",
            "CanceledReason": commentValue,
            "DateTo": new Date()
        }
        objApi.fetchUrl = "api/reservation";
        objApi.method = "PUT";
        objApi.successMSG = {
            SUCC_RESERVATIONUPDATED: translations[this.props.systemLanguage].messages['SUCC_RESERVATIONUPDATED'],
        };
        objApi.functionAfterSuccess = "saveCancelRP";
        objApi.errorMSG = {}
        this.modalReqInfo.current.changeModalLoadingState(false);
        callAPI(objApi, this);
    }

    // This function will call the API
    saveRateMRSL = (optionValue, commentValue) => {
        if (!optionValue) {
            optionValue = 5;
        }
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
        objApi.fetchUrl = "api/review";
        objApi.method = "POST";
        objApi.successMSG = {
            SUCC_REVIEWCREATED: translations[this.props.systemLanguage].messages['SUCC_REVIEWCREATED'],
        };
        objApi.functionAfterSuccess = "saveRateMRSL";
        this.modalReqInfo.current.changeModalLoadingState(false);
        callAPI(objApi, this);
    }

    saveConfirmRP = (dateSelectValue) => {
        if (dateSelectValue == "") {
            displayErrorMessage(translations[this.props.systemLanguage].messages['reservedPublications_confirmModal_dateSelectMissingErr']);
        } else {
            var objApi = {};
            objApi.objToSend = {
                "AccessToken": this.props.tokenObj.accesToken,
                "IdReservation": this.state.selectedIdRes,
                "Mail": this.props.userData.Mail,
                "OldState": this.state.selectedResState,
                "NewState": "RESERVED",
                "DateTo": dateSelectValue
            }
            objApi.fetchUrl = "api/reservation";
            objApi.method = "PUT";
            objApi.successMSG = {
                SUCC_RESERVATIONUPDATED: translations[this.props.systemLanguage].messages['SUCC_RESERVATIONUPDATED2'],
            };
            objApi.functionAfterSuccess = "saveConfirmRP";
            objApi.errorMSG = {}
            this.modalReqInfo.current.changeModalLoadingState(false);
            callAPI(objApi, this);
        }

    }

    cancel(){
        console.Log(this.state.screenConfig.cancelText)
        if (this.state.screenConfig.cancelText === 'Entendido'){
            this.props.navigation.navigate('Home');
        }else{
            this.props.navigation.goBack();
        }
    }

    onChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value
          })
    }

    changeRating(value){
        this.setState({optionValue:value});
    }

    render() {
        const { systemLanguage } = this.props;
        return (
            <>
                {this.state.screenConfig ? (
                    <View style={styles.container}>
                        <Text style={styles.titleText}>{this.state.screenConfig.title}</Text>
                        <Text style={styles.infoText}>{this.state.screenConfig.mainText}</Text>
                        {this.state.screenConfig.optionDisplay ? 
                        (
                            <>
                            <Text style={styles.infoText}>{this.state.screenConfig.optionLabel}</Text>
                            <Picker
                                style={styles.pickerBox2}
                                selectedValue={this.state.optionValue}
                                onValueChange={(itemValue) => this.changeRating(itemValue)}
                            > 
                                {this.state.screenConfig.optionArray.map((option) => {
                                    return (
                                        <Picker.Item key={option} value={option} label={option} />
                                    );
                                })}
                            </Picker>
                            </>
                        ) : (null)}
                        {this.state.screenConfig.textboxDisplay ? 
                        (
                            <TextInput style={styles.inputBox} 
                                underlineColorAndroid='rgba(0,0,0,0)'
                                placeholder={this.state.screenConfig.textboxLabel}
                                placeholderTextColor="#ffffff"
                                onChangeText={(textboxValue) => this.setState({textboxValue})}
                                value={this.state.textboxValue}
                            />
                        ) : (null)}
                        <View style={{flexDirection: 'row'}}>
                            {this.state.screenConfig.cancelAvailable == true ? (<TouchableOpacity style={styles.button} onPress={()=> {this.cancel}}> 
                                                                                    <Text style={styles.buttonText}>{this.state.screenConfig.cancelText}</Text>
                                                                                </TouchableOpacity>
                                                                                ) : (null)
                            }                                                    
                            {this.state.screenConfig.confirmAvailable == true ? (<TouchableOpacity style={styles.button} onPress={()=> {this.save}}> 
                                                                                    <Text style={styles.buttonText}>{this.state.screenConfig.confirmText}</Text>
                                                                                    </TouchableOpacity>
                                                                                ) : (null)
                            }
                        </View>  
                    </View>
                ) : (null)}                
            </>   
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
  inputBox: {
    width:300,
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

export default connect(mapStateToProps)(ReservationReqInfo);