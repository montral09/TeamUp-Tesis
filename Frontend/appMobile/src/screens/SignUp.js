import React, {Component} from 'react';
import { StyleSheet,Text,View,TextInput,TouchableOpacity,KeyboardAvoidingView} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { callAPI, displayErrorMessage } from '../common/genericFunctions';
import UserTypeSelector from '../components/UserTypeSelector';
import { connect } from 'react-redux';
import translations from '../common/translations';

class SignUp extends Component{
    constructor(){
        super();
        this.state = {
            email: '',
            password: '',
            passwordConfirm: '',
            name: '',
            lastName: '',
            phone: '',
            checkPublisher: false,
            rut: '',
            razonSocial: '',
            address: '',
            isLoading : false,
            buttonIsDisable: false
        };
    }

    handleCheckPublisher = (checkValue) =>{
        if (checkValue === 'publisher'){
            this.setState({checkPublisher:true})
        }else{
            this.setState({checkPublisher:false})
        }
    }
   
    // Validate if all the required inputs are inputted, returns true or false
    checkRequiredInputs = () => {
        let returnValue = false;
        let message = "";
        if (!this.state.password || !this.state.email || !this.state.firstName
            || !this.state.lastName || !this.state.phone) {
                message= translations[this.props.systemLanguage].messages['register_checkErrorMsg1'];
                returnValue = true;
        } else if (!this.state.firstName.match(/^[A-Za-z]+$/)) {        
            returnValue = true;
            message = translations[this.props.systemLanguage].messages['register_checkErrorMsg2'];
        } else if (this.state.firstName.length < 2) {        
            returnValue = true;
            message = translations[this.props.systemLanguage].messages['register_checkErrorMsg3'];
        } else if (!this.state.lastName.match(/^[A-Za-z]+$/)) {
            returnValue = true;
            message = translations[this.props.systemLanguage].messages['register_checkErrorMsg4'];
        } else if (this.state.lastName.length < 2) {        
            returnValue = true;
            message = translations[this.props.systemLanguage].messages['register_checkErrorMsg5'];
        } else if (this.state.password != this.state.passwordConfirm) {
            returnValue = true;
            message = translations[this.props.systemLanguage].messages['register_checkErrorMsg6'];
        } else if (this.state.password.length < 6) {
            message = translations[this.props.systemLanguage].messages['register_checkErrorMsg7'];
            returnValue = true;
        } else if (!this.state.email.match(/\S+@\S+.+/)) {
            message = translations[this.props.systemLanguage].messages['register_checkErrorMsg8'];
            returnValue = true;
        } else if (!this.state.phone.match(/^[0-9]+$/) && !this.state.phone.match(/^[+]+[0-9]+$/)) {
            message = translations[this.props.systemLanguage].messages['register_checkErrorMsg9'];
            returnValue = true;
        } else if (this.state.phone.length < 6) {
            message = translations[this.props.systemLanguage].messages['register_checkErrorMsg10'];
            returnValue = true;
        } else if (this.state.rut && !this.state.rut.match(/^[0-9]+$/)) {
            message = translations[this.props.systemLanguage].messages['register_checkErrorMsg11'];
            returnValue = true;
        } else if (this.state.rut && this.state.rut < 12) {
            message = translations[this.props.systemLanguage].messages['register_checkErrorMsg12'];
            returnValue = true;
        } else if (this.state.razonSocial && this.state.razonSocial < 3) {
            message = translations[this.props.systemLanguage].messages['register_checkErrorMsg13'];
            returnValue = true;
        } else if (this.state.address && this.state.address < 10) {
            message = translations[this.props.systemLanguage].messages['register_checkErrorMsg14'];
            returnValue = true;
        }
        
        if(message){
            displayErrorMessage(message);
        }
        return returnValue;
    }

    // This function will call the API
    registerUser = () => {
        if (!this.checkRequiredInputs()) {
            this.setState({isLoading: true, buttonIsDisable:true});
            var objApi = {};
            objApi.objToSend = {
                Password: this.state.password,
                Mail: this.state.email,
                Name: this.state.firstName,
                LastName: this.state.lastName,
                Phone: this.state.phone,
                CheckPublisher: this.state.CheckPublisher,
                Rut: this.state.rut,
                RazonSocial: this.state.razonSocial,
                Address: this.state.address,
                Language : this.state.Language
            }
            objApi.fetchUrl = "api/user";
            objApi.method = "POST";
            objApi.successMSG = {
                SUCC_USRCREATED : translations[this.props.systemLanguage].messages['SUCC_USRCREATED'],
            };
            objApi.functionAfterSuccess = "registerUser";
            objApi.functionAfterError = "registerUser";
            objApi.errorMSG= {
                ERR_MAILALREADYEXIST : translations[this.props.systemLanguage].messages['ERR_MAILALREADYEXIST']
            }
            callAPI(objApi, this);
        }
    }

   render(){
        const { systemLanguage } = this.props;
        return (

            <KeyboardAwareScrollView 
                vertical
                extraScrollHeight={135} 
                enableOnAndroid={true} 
                keyboardShouldPersistTaps='handled'
                style={{flex: 1}}
            >
                <KeyboardAvoidingView style={styles.container}>  
                    <KeyboardAvoidingView style={styles.signupTitleContainer}>
                        <Text style={styles.titleText}>{translations[systemLanguage].messages['registerYourself2_w']}</Text>
                        <UserTypeSelector handleCheckPublisher={this.handleCheckPublisher}/>
                        {<TextInput style={styles.inputBox} 
                                underlineColorAndroid='rgba(0,0,0,0)'
                                placeholder={translations[systemLanguage].messages['name_w'] + '(*)'}
                                placeholderTextColor="#ffffff"
                                onChangeText={(name) => this.setState({name})}
                                value={this.state.name}
                        />}
                        {<TextInput style={styles.inputBox} 
                                underlineColorAndroid='rgba(0,0,0,0)'
                                placeholder={translations[systemLanguage].messages['lastName_w'] + '(*)'}
                                placeholderTextColor="#ffffff"
                                onChangeText={(lastName) => this.setState({lastName})}
                                value={this.state.lastName}
                        />}
                        <TextInput style={styles.inputBox} 
                                underlineColorAndroid='rgba(0,0,0,0)'
                                placeholder={translations[systemLanguage].messages['email_w'] + '(*)'}
                                placeholderTextColor="#ffffff"
                                value={this.state.email}
                                onChangeText={(email) => this.setState({email})}
                        />
                        {<TextInput style={styles.inputBox} 
                                underlineColorAndroid='rgba(0,0,0,0)'
                                placeholder={translations[systemLanguage].messages['phoneNumber_w'] + '(*)'}
                                placeholderTextColor="#ffffff"
                                name = "phone"
                                value={this.state.phone}
                                onChangeText={(phone) => this.setState({phone})}
                        />}
                        <TextInput style={styles.inputBox} 
                                underlineColorAndroid='rgba(0,0,0,0)'
                                placeholder={translations[systemLanguage].messages['password_w'] + '(*)'}
                                placeholderTextColor="#ffffff"
                                secureTextEntry={true}
                                name = "password"
                                value={this.state.password}
                                onChangeText={(password) => this.setState({password})}
                        />
                        {<TextInput style={styles.inputBox} 
                                underlineColorAndroid='rgba(0,0,0,0)'
                                placeholder={translations[systemLanguage].messages['register_repeatPassword'] + '(*)'}
                                placeholderTextColor="#ffffff"
                                secureTextEntry={true}
                                name = "confirmPassword"
                                value={this.state.confirmPassword}
                                onChangeText={(confirmPassword) => this.setState({confirmPassword})}
                        />}
                        {<TextInput style={styles.inputBox} 
                                underlineColorAndroid='rgba(0,0,0,0)'
                                placeholder="RUT"
                                placeholderTextColor="#ffffff"
                                name = "rut"
                                value={this.state.rut}
                                onChangeText={(rut) => this.setState({rut})}
                        />}
                        {<TextInput style={styles.inputBox} 
                                underlineColorAndroid='rgba(0,0,0,0)'
                                placeholder={translations[systemLanguage].messages['socialReason']}
                                placeholderTextColor="#ffffff"
                                name = "razonSocial"
                                value={this.state.razonSocial}
                                onChangeText={(razonSocial) => this.setState({razonSocial})}
                        />}
                        {<TextInput style={styles.inputBox} 
                                underlineColorAndroid='rgba(0,0,0,0)'
                                placeholder={translations[systemLanguage].messages['address_w']}
                                placeholderTextColor="#ffffff"
                                name = "address"
                                value={this.state.address}
                                onChangeText={(address) => this.setState({address})}
                        />}
                        <KeyboardAvoidingView style={{flexDirection:'row'}}>
                        <TouchableOpacity style={styles.button} onPress={() => {this.props.navigation.goBack()}}>
                            <Text style={styles.buttonText}>{translations[systemLanguage].messages['cancel_w']}</Text>   
                        </TouchableOpacity>    
                        <TouchableOpacity style={styles.button} onPress={() => { this.register() }}>
                            <Text style={styles.buttonText}>{translations[systemLanguage].messages['registerYourself2_w']}</Text>   
                        </TouchableOpacity>
                        </KeyboardAvoidingView>
                        <KeyboardAvoidingView style={{flexDirection:'row'}}>
                            <Text style={styles.infoText}>{translations[systemLanguage].messages['register_termsMsg1']} </Text> 
                            <Text style={styles.infoText2}>{translations[systemLanguage].messages['registerYourself2_w']} </Text> 
                            <Text style={styles.infoText}>{translations[systemLanguage].messages['register_termsMsg2']} </Text> 
                        </KeyboardAvoidingView>
                        <TouchableOpacity onPress={() => { this.props.navigation.navigate('TermsAndConditions') }}>
                            <Text style={styles.infoText3}>{translations[systemLanguage].messages['register_termsMsg3']}</Text>
                        </TouchableOpacity>
                    </KeyboardAvoidingView>    
                </KeyboardAvoidingView>
            </KeyboardAwareScrollView>
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
    signupTitleContainer: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 5,
        justifyContent: 'center',
    },
    titleText: {
        marginTop: 20,
        fontSize: 24, 
        fontWeight: 'bold',
        color: "#FFF",
    },
    signupText: {
        color: 'rgba(255,255,255,1.0)',
        fontSize: 16,
    },
    signupButton: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '600',
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
        width:130,
        height:30,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor:'#0069c0',
        borderRadius: 15,
        marginVertical: 6,
        elevation: 3,
        marginHorizontal: 10,
    },
    buttonText: {
        fontSize:16,
        fontWeight:'500',
        color:'#ffffff',
    },
    infoText:{
        color: "#FFF",
    },
    infoText2:{
        color: "#FFF",
        fontWeight: 'bold',
    },
    infoText3:{
        color: '#ffffff',
        fontWeight: '600',
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: {width: -1, height: 1},
        textShadowRadius: 10
    },
});

const mapStateToProps = (state) =>{
    return {
        login_status: state.loginData.login_status,
        systemLanguage: state.loginData.systemLanguage
    }
}

export default connect(mapStateToProps)(SignUp);