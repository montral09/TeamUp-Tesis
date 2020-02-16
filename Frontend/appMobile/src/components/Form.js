import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ActivityIndicator, Picker } from 'react-native';
import { withNavigation } from 'react-navigation';
import { connect } from 'react-redux';
import { logIn, changeLanguage } from '../redux/actions/accountActions';
import { displayErrorMessage } from '../common/genericFunctions';
//import Globals from '../Globals'; 
import languages from '../common/languages'
import translations from '../common/translations';

class Form extends Component{
    constructor() {
        super();
        this.state = {
            email: '',
            password: '',
            data: null,
            loaded: true,
            error: null,
            isLoading : false,
            bindThis : this,
            language : 'es'
        }
    }

    handleChangeEmail = (typedText) => {
        this.setState({ email: typedText });
    }

    handleChangePassword = (typedText) => {
        this.setState({ password: typedText });
    }
    
    onSelectionsChangeLanguage = (value, index) => {
        this.setState({language: value})
        this.props.changeParentLanguage(value);
        this.props.changeLanguage(value);
    }

    checkRequiredInputs() {
        let returnValue = false;
        let message = "";
        if (!this.state.password || !this.state.email) {
            message = translations[this.props.systemLanguage].messages['login_errorMsg1']//'Por favor ingrese correo y contraseña';
            returnValue = true;
        } else if (!this.state.email.match(/\S+@\S+/)) {
            message = translations[this.props.systemLanguage].messages['login_errorMsg2']//'Formato de email incorrecto';
            returnValue = true;
        }

        if (message) {
            displayErrorMessage(message);
        }
        return returnValue;
    }

    login = () => {
        if (!this.checkRequiredInputs()) {
            this.setState({ isLoading: true });
            this.props.logIn(this.state);
        }
    }

    render() {
        const { login_status, systemLanguage } = this.props;
        if (login_status == 'LOGGED_IN'){
            if (this.props.userData.PublisherValidated == true){
                return this.props.navigation.navigate('HomeG', {language:this.state.language});
            }
            else{
                return this.props.navigation.navigate('HomeC', {language:this.state.language});
            }
        } 

        return (
            <View style={styles.container}>
                
                {!this.state.loaded && (
                    <Text>Cargando</Text>
                )}
                {this.state.isLoading ? (
                    <ActivityIndicator
                    animating = {this.state.isLoading}
                    color = '#bc2b78'
                    size = "large"
                    style = {styles.activityIndicator}/>
                ) : (
                    <> 
                        <TextInput style={styles.inputBox}
                        underlineColorAndroid='rgba(0,0,0,0)'
                        placeholder={translations[systemLanguage].messages['email_w']}
                        placeholderTextColor="#ffffff"
                        onChangeText={this.handleChangeEmail} 
                        value={this.state.email}
                        />
                        <TextInput style={styles.inputBox}
                            underlineColorAndroid='rgba(0,0,0,0)'
                            placeholder={translations[systemLanguage].messages['password_w']}
                            secureTextEntry={true}
                            placeholderTextColor="#ffffff"
                            onChangeText={this.handleChangePassword}
                            value={this.state.password}
                        />
                        <Text style={styles.signupButton} onPress={() => { this.props.navigation.navigate('PasswordRecovery') }}> {translations[systemLanguage].messages['forgotPassword_header']}</Text>
                        <TouchableOpacity style={styles.button} onPress={() => { this.login() }}>
                            <Text style={styles.buttonText}>{translations[systemLanguage].messages['signOutLinks_head_login']}</Text>
                        </TouchableOpacity>
                        <Text style={styles.infoText}>{translations[systemLanguage].messages['language_w']}</Text> 
                        <Picker
                        style={styles.pickerBox}
                        selectedValue={this.state.language}
                        onValueChange={this.onSelectionsChangeLanguage}
                        >
                            {
                                languages.map((lang, key) => {
                                return (<Picker.Item key={lang.code} value={lang.code} label={lang.title} />);
                                })
                            }  
                        </Picker>
                    </>
                )} 

                
                {this.state.error && (
                    <Text style={styles.errorText}>{this.state.error}</Text>
                )}
            </View>
        )
    }

}

const mapStateToProps = (state) => {
    return {
        login_status: state.loginData.login_status,
        userData: state.loginData.userData,
        systemLanguage: state.loginData.systemLanguage
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        logIn: (userData) => { dispatch(logIn(userData)) },
        changeLanguage: (systemLanguage) => { dispatch(changeLanguage(systemLanguage)) },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withNavigation(Form));

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputBox: {
        width: 300,
        backgroundColor: 'rgba(255,255,255,0.3)',
        borderRadius: 25,
        paddingHorizontal: 16,
        fontSize: 16,
        color: '#ffffff',
        marginVertical: 10
    },
    button: {
        width: 130,
        height: 30,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0069c0',
        borderRadius: 15,
        marginVertical: 10,
        elevation: 3,
    },
    signupButton: {
        color: '#ffffff',
        fontSize: 14,
        fontWeight: '600',
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 10
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#ffffff'
    },
    errorText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'rgba(255,0,0,1)'
    },
    pickerBox: {
    width:300,
    backgroundColor:'rgba(255,255,255,0.3)',
    color:'#ffffff',
    marginVertical: 10
    },
    infoText:{
        fontSize: 18, 
        color: "#FFF",
        paddingHorizontal: 20,
        marginBottom: 5,
    },
    activityIndicator: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: 80,
    },
});
