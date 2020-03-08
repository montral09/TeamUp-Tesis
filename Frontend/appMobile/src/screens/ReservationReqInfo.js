import React, {Component} from 'react';
import { StyleSheet, Text, View, Picker, ActivityIndicator, TextInput, TouchableOpacity} from 'react-native';
import { callAPI } from '../common/genericFunctions';
import { connect } from 'react-redux';
import { displayErrorMessage } from '../common/genericFunctions';
import { ML_MODE } from '../common/constants';
import translations from '../common/translations';
import DatePicker from '../components/datePicker';

class ReservationReqInfo extends Component {
    constructor(props) {
        super(props);
        const { navigation } = this.props;
        const screenConfigParam = navigation.getParam('screenConfig', 'default value');
        const IdReservationParam = navigation.getParam('selectedIdRes', 'NO-ID');
        const selectedResStateParam = navigation.getParam('selectedResState', 'default value');
        var dateConverted = this.createDate()
        this.state = {
            modal: false,
            selectedIdRes: IdReservationParam,
            optionalData: {},
            optionValue: 5,
            textboxValue: "",
            dateSelectValue : dateConverted,
            selectedResState: selectedResStateParam || "",
            isLoading : false,
            buttonIsDisabled: false,
            screenConfig: screenConfigParam,  
            optionArray: [5, 4, 3, 2, 1]
        };
        this.save = this.save.bind(this);
        this.cancel = this.cancel.bind(this);
        this.changeModalLoadingState = this.changeModalLoadingState.bind(this);
    }

    createDate() {
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1; //January is 0!

        var yyyy = today.getFullYear();
        if (dd < 10) {
            dd = '0' + dd;
        }
        if (mm < 10) {
            mm = '0' + mm;
        }
        var dateConv = dd + "-" + mm + '-' + yyyy;
        return dateConv;
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
        this.setState({isLoading: true})
        if(this.state.screenConfig.saveFunction){
            this.triggerSaveScreen(this.state.screenConfig.saveFunction,{optionValue:this.state.optionValue, textboxValue:this.state.textboxValue, dateSelectValue: this.state.dateSelectValue })
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
        console.log(objApi.objToSend)
        callAPI(objApi, this);
    }

    // This function will call the API
    saveRateMRSL = (optionValue, commentValue) => {
        if (!optionValue) {
            optionValue = 5;
        }
        if(ML_MODE == 'ON' && commentValue.trim() == ""){
            displayErrorMessage(translations[this.props.systemLanguage].messages['createPub_stepNextError']);
            return;
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
        callAPI(objApi, this);
    }

    saveConfirmRP = (dateSelectValue) => {
        if (dateSelectValue == "") {
            displayErrorMessage(translations[this.props.systemLanguage].messages['reservedPublications_confirmModal_dateSelectMissingErr']);
            this.setState({isLoading: false})
        } else {
            var objApi = {};
            var splittedDate = dateSelectValue.split('-')
            var dateTo = new Date(splittedDate[2],splittedDate[1] - 1,splittedDate[0]);
            objApi.objToSend = {
                "AccessToken": this.props.tokenObj.accesToken,
                "IdReservation": this.state.selectedIdRes,
                "Mail": this.props.userData.Mail,
                "OldState": this.state.selectedResState,
                "NewState": "RESERVED",
                "DateTo": dateTo
            }
            objApi.fetchUrl = "api/reservation";
            objApi.method = "PUT";
            objApi.successMSG = {
                SUCC_RESERVATIONUPDATED: translations[this.props.systemLanguage].messages['SUCC_RESERVATIONUPDATED2'],
            };
            objApi.functionAfterSuccess = "saveConfirmRP";
            objApi.errorMSG = {}
            callAPI(objApi, this);
        }

    }

    cancel(){
        if (this.state.screenConfig.cancelText === translations[this.props.systemLanguage].messages['reservation_modal_ok']){
            this.props.navigation.navigate('Home');
        }else{
            this.props.navigation.goBack();
        }
    }

    handleChangeDate = (date) =>{
        this.setState({dateSelectValue:date});
    }

    changeRating(value){
        this.setState({optionValue:value});
    }

    render() {
        const { systemLanguage } = this.props;
        return (
            <>
            {this.state.isLoading == false ? (
            <>
                {this.state.screenConfig ? (
                    <View style={styles.container}>
                        <Text style={styles.titleText}>{this.state.screenConfig.title}</Text>
                        <Text style={styles.infoText2}>{this.state.screenConfig.mainText}</Text>
                        {this.state.screenConfig.optionDisplay ? 
                        (
                            <>
                            <View style={{flexDirection:'row', alignItems: 'center'}}>
                                <Text style={styles.infoTextPicker}>{this.state.screenConfig.optionLabel}</Text>
                                <Picker
                                    style={styles.pickerBox2}
                                    selectedValue={this.state.optionValue}
                                    onValueChange={(itemValue) => this.changeRating(itemValue)}
                                > 
                                    {this.state.optionArray.map((option) => {
                                        return (
                                            <Picker.Item key={option} value={option} label={option.toString()} />
                                        );
                                    })}
                                </Picker>
                            </View>
                            </>
                        ) : (null)}
                        {this.state.screenConfig.textboxDisplay ? 
                        (
                            <TextInput style={styles.inputBox} 
                                numberOfLines= {4}
                                underlineColorAndroid='rgba(0,0,0,0)'
                                placeholder={this.state.screenConfig.textboxLabel}
                                placeholderTextColor="#ffffff"
                                onChangeText={(textboxValue) => this.setState({textboxValue})}
                                value={this.state.textboxValue}
                            />
                        ) : (null)}
                        {this.state.screenConfig.dateSelectDisplay ? 
                        (
                            <>  
                                <Text style={styles.infoText}>{this.state.screenConfig.dateSelectLabel}</Text>
                                <DatePicker 
                                    parentDate={this.state.dateSelectValue} 
                                    handleChangeDate={this.handleChangeDate}
                                    placeholder={translations[systemLanguage].messages['date_w']}
                                    onChangeDate={(date) => this.setState({date})}
                                />  
                            </>
                        ) : (null)}
                        <View style={{flexDirection: 'row'}}>
                            {this.state.screenConfig.cancelAvailable == true ? (<TouchableOpacity style={styles.button} onPress={()=> {this.cancel()}}> 
                                                                                    <Text style={styles.buttonText}>{this.state.screenConfig.cancelText}</Text>
                                                                                </TouchableOpacity>
                                                                                ) : (null)
                            }                                                    
                            {this.state.screenConfig.confirmAvailable == true ? (<TouchableOpacity style={styles.button} onPress={()=> {this.save()}}> 
                                                                                    <Text style={styles.buttonText}>{this.state.screenConfig.confirmText}</Text>
                                                                                    </TouchableOpacity>
                                                                                ) : (null)
                            }
                        </View>  
                    </View>
                ) : (null)}                
            </>   
            ) : (
                    <ActivityIndicator
                        animating = {this.state.isLoading}
                        color = 'white'
                        size = "large"
                        style = {styles.activityIndicator}
                    />
                )
            }
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
    marginBottom: 20,
  },
  infoTextPicker:{
    color: "#FFF",
    marginRight: 10,
    fontSize: 20,
  },
  infoText2:{
    color: "#FFF",
    marginLeft: 0,
    fontSize: 16,
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
  pickerBox2: {
    width:50,
    backgroundColor:'rgba(255,255,255,0.3)',
    color:'#ffffff',
    marginVertical: 10,
  },  
  activityIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2196f3',
    height: 80,
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