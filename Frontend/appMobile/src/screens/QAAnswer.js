import React, {Component} from 'react';
import { StyleSheet, Text, View, ScrollView, Keyboard, TextInput, TouchableOpacity, ActivityIndicator} from 'react-native';
import { connect } from 'react-redux';
import { callAPI } from '../common/genericFunctions';

import translations from '../common/translations';

class QAAnswer extends Component {
    constructor(props) {
        super(props);
        const { navigation } = this.props;
        const screenConfig = navigation.getParam('screenConfig', 'default value');
        this.state = {
            modal: false,
            optionalData: {},
            textboxValue: "",
            isLoading : false,
            buttonIsDisabled: false,
            screenConfig: screenConfig,
        };
        this.toggle = this.toggle.bind(this);
        this.changeModalLoadingState = this.changeModalLoadingState.bind(this);
    }

    toggle(optionalData) {
        if(optionalData){
            this.setState({
                modal: !this.state.modal,
                optionalData: optionalData
            });
        }else{
            if(!this.state.isLoading){
                this.setState({
                    modal: !this.state.modal
                });
            }
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

    saveAnswerVP = (answer) => {
        var objApi = {};
        objApi.objToSend = {
            "AccessToken": this.props.tokenObj.accesToken,
            "Mail": this.props.userData.Mail,
            "IdQuestion": this.state.screenConfig.IdQuestion,
            "Answer": answer
        }
        objApi.fetchUrl = 'api/publicationQuestions';
        objApi.method = "PUT";
        objApi.successMSG = {
            SUCC_ANSWERCREATED : translations[this.props.systemLanguage].messages['SUCC_ANSWERCREATED'],
        };
        objApi.functionAfterSuccess = "saveAnswerVP";
        objApi.functionAfterError = "saveAnswerVP";
        objApi.errorMSG= {}
        this.setState({isLoading:true})
        callAPI(objApi, this);
    }

    onChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value
          })
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
                        <Text style={styles.infoText}>{this.state.screenConfig.mainText}</Text>
                        {this.state.screenConfig.textboxDisplay ? 
                        (
                            <TextInput style={styles.inputBox} 
                                multiline = {true}
                                numberOfLines = {3}
                                underlineColorAndroid='rgba(0,0,0,0)'
                                placeholder={this.state.screenConfig.textboxLabel}
                                placeholderTextColor="#ffffff"
                                onChangeText={(textboxValue) => this.setState({textboxValue})}
                                value={this.state.textboxValue}
                            />
                        ) : (null)}
                    
                        
                        {this.state.screenConfig.login_status == 'LOGGED_IN' ? (
                            <View style={{flexDirection: 'row'}}>
                                {this.state.screenConfig.cancelAvailable == true ? (<TouchableOpacity style={styles.button} onPress={()=> {this.props.navigation.goBack()}}> 
                                                                                        <Text style={styles.buttonText}>{this.state.screenConfig.cancelText}</Text>
                                                                                    </TouchableOpacity>
                                                                                   ) : (null)
                                }                                                    
                                {this.state.screenConfig.confirmAvailable == true ? (<TouchableOpacity style={styles.button} onPress={()=> {this.saveAnswerVP(this.state.textboxValue)}}> 
                                                                                        <Text style={styles.buttonText}>{this.state.screenConfig.confirmText}</Text>
                                                                                     </TouchableOpacity>
                                                                                    ) : (null)
                                }
                            </View>
                        ) : (null)}    
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

export default connect(mapStateToProps)(QAAnswer);