import React, {Component} from 'react';
import {View,Text,StyleSheet,TouchableOpacity,Picker,ActivityIndicator} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Header } from 'react-native-elements';
import translations from '../common/translations';
import {callAPI, displayErrorMessage} from '../common/genericFunctions';
import LoadingOverlay from 'react-native-loading-spinner-overlay';
import languages from '../common/languages';
import { connect } from 'react-redux';
import { modifyData } from '../redux/actions/accountActions';
import { logOut } from '../redux/actions/accountActions';

import FloatingTitle from '../components/FloatingTitleTextInput';

class Profile extends Component {
    constructor(props) {
        super(props);
        const { Address, LastName, Mail, Name, Phone, RazonSocial, Rut, Language } = props.userData;
        const tokenObj = props.tokenObj;
        this.state = {
            editActive: false,
            firstName: Name,
            lastName: LastName,
            phone: Phone,
            email: Mail,
            originalEmail: Mail,
            password: "",
            passwordConfirm: "",
            rut: Rut,
            razonSocial: RazonSocial,
            Language: Language,
            address: Address,
            anyChange: false,
            tokenObj: tokenObj,
            isLoading : false
        }
    }

    toggleEditable = () => {
        this.setState({editActive: !this.state.editActive});
        if (this.state.editActive){
            this.modifyUser()
        }

    }

    _updateMasterState = (attrName, value) => {
        this.setState({ [attrName]: value });
    }

    checkRequiredInputs = () => {
        let returnValue = false;
        let message = "";
        if (!this.state.password || !this.state.email || !this.state.firstName
            || !this.state.lastName || !this.state.phone) {
                message='Por favor ingrese los campos obligatorios (*)';
                returnValue = true;
        } else if (!this.state.firstName.match(/^[A-Za-z ]+$/)) {        
            returnValue = true;
            message = "Su nombre debe contener solo letras";
        } else if (this.state.firstName.length < 2) {        
            returnValue = true;
            message = "Nombre demasiado corto";            
        } else if (!this.state.lastName.match(/^[A-Za-z]+$/)) {
            returnValue = true;
            message = "Su apellido debe contener solo letras";
        } else if (this.state.lastName.length < 2) {        
            returnValue = true;
            message = "Apellido demasiado corto"; 
        } else if (this.state.password != this.state.passwordConfirm) {
            returnValue = true;
            message = "Ambos campos de contraseña deben ser iguales";
        } else if (this.state.password.length < 6) {
            message='La contraseña debe tener al menos 6 caracteres';
            returnValue = true;
        } else if (!this.state.email.match(/\S+@\S+.+/)) {
            message='Formato de email incorrecto';
            returnValue = true;
        } else if (!this.state.phone.match(/^[0-9]+$/) && !this.state.phone.match(/^[+]+[0-9]+$/)) {
            message='Telefono debe contener solo números o "+" si corresponde a un número internacional';
            returnValue = true;
        } else if (this.state.phone.length < 6) {
            message='Telefono demasiado corto';
            returnValue = true;
        } else if (this.state.rut && !this.state.rut.match(/^[0-9]+$/)) {
            message='Rut debe contener solo números';
            returnValue = true;
        } else if (this.state.rut && this.state.rut < 12) {
            message='Rut debe tener 12 números';
            returnValue = true;
        } else if (this.state.razonSocial && this.state.razonSocial < 3) {
            message='Razon social demasiada corta';
            returnValue = true;
        } else if (this.state.address && this.state.address < 10) {
            message='Direccion demasiado corta';
            returnValue = true;
        }
        if (message) {
            displayErrorMessage(message);
        }
        return returnValue;
    }

    // This function will call the API
    modifyUser = () => {
        if (!this.checkRequiredInputs()) {
            var objApi = {};
            objApi.objToSend = {
                Password: this.state.password || "",
                Mail: this.state.originalEmail,
                Name: this.state.firstName,
                LastName: this.state.lastName,
                Phone: this.state.phone,
                Rut: this.state.rut,
                RazonSocial: this.state.razonSocial,
                Address: this.state.address,
                NewMail: this.state.email,
                AccessToken: this.state.tokenObj.accesToken,
                Language : this.state.Language
            }
            objApi.fetchUrl = "api/user";
            objApi.method = "PUT";
            objApi.successMSG = {
                SUCC_USRUPDATED : this.state.email == this.state.originalEmail ? translations[this.props.systemLanguage].messages['SUCC_USRUPDATED'] : translations[this.props.systemLanguage].messages['SUCC_USRUPDATED2'],
            };
            objApi.functionAfterSuccess = "modifyUser";
            objApi.functionAfterError = "modifyUser";
            objApi.errorMSG= {
                ERR_MAILALREADYEXIST : translations[this.props.systemLanguage].messages['ERR_MAILALREADYEXIST']
            }
            // Custom
            objApi.emailChanged = this.state.email != this.state.originalEmail;
            objApi.logOut = this.props.logOut;
            this.setState({ isLoading: true });
            callAPI(objApi, this);
        }

    }

    onSelectionsChangeLanguage = (value, index) => {
        this.setState({Language: value})
    }

    render (){
        const { systemLanguage } = this.props;
        return (
            <>
            {this.state.isLoading == false ? (
                <KeyboardAwareScrollView
                    vertical
                    extraScrollHeight={135} 
                    enableOnAndroid={true} 
                    keyboardShouldPersistTaps='handled'
                    style={{flex: 1}}
                >
                    <View style={styles.container}>
                        {this.state.isLoading ? (
                            <LoadingOverlay
                            visible={this.state.isLoading}
                            textContent={'Cargando...'}
                        />
                        ) : (
                        <>
                        <Header
                            leftComponent={{ icon: 'menu', color: '#fff', flex:1, onPress: () => this.props.navigation.openDrawer()}}
                            rightComponent={{ icon: 'home', color: '#fff', flex:1, onPress: () => this.props.navigation.navigate('Home')}}
                        />
                        <View style={styles.titleContainer}>
                            <Text style={styles.titleText}>{translations[systemLanguage].messages['signInLinks_head_updateUserData']}</Text> 
                        </View>
                        <View style={styles.inputContainer}>
                            
                            <FloatingTitle
                                attrName = 'firstName'
                                title = {translations[systemLanguage].messages['name_w']}
                                value = {this.state.firstName}
                                updateMasterState = {this._updateMasterState}
                                editBool = {false}
                                passBool={false}
                            />
                            <FloatingTitle
                                attrName = 'lastName'
                                title = {translations[systemLanguage].messages['lastName_w']}
                                value = {this.state.lastName}
                                updateMasterState = {this._updateMasterState}
                                editBool = {false}
                                passBool={false}
                            />
                            <FloatingTitle
                                attrName = 'email'
                                title = 'Email'
                                value = {this.state.email}
                                updateMasterState = {this._updateMasterState}
                                editBool = {this.state.editActive}
                                passBool={false}
                            />
                            <FloatingTitle
                                attrName = 'password'
                                title = {translations[systemLanguage].messages['password_w']}
                                value = {this.state.password}
                                updateMasterState = {this._updateMasterState}
                                editBool = {this.state.editActive}
                                passBool={true}
                            />
                            <FloatingTitle
                                attrName = 'passwordConfirm'
                                title = {translations[systemLanguage].messages['register_repeatPassword']}
                                value = {this.state.passwordConfirm}
                                updateMasterState = {this._updateMasterState}
                                editBool = {this.state.editActive}
                                passBool={true}
                            />
                            <FloatingTitle
                                attrName = 'phone'
                                title = {translations[systemLanguage].messages['phoneNumber_w']}
                                value = {this.state.phone}
                                updateMasterState = {this._updateMasterState}
                                editBool = {this.state.editActive}
                                passBool={false}
                            />
                            <FloatingTitle
                                attrName = 'rut'
                                title = 'RUT'
                                value = {this.state.rut}
                                updateMasterState = {this._updateMasterState}
                                editBool = {false}
                                passBool={false}
                            />
                            <FloatingTitle
                                attrName = 'razonSocial'
                                title = 'Razón Social'
                                value = {this.state.razonSocial}
                                updateMasterState = {this._updateMasterState}
                                editBool = {false}
                                passBool={false}
                            />
                            <FloatingTitle
                                attrName = 'address'
                                title = {translations[systemLanguage].messages['address_w']}
                                value = {this.state.address}
                                updateMasterState = {this._updateMasterState}
                                editBool = {this.state.editActive}
                                passBool={false}
                            /> 
                            <Text style={styles.subtitleText}>{translations[systemLanguage].messages['modify_mailLanguage']}</Text>
                            <Picker
                                style={styles.pickerBox}
                                selectedValue={this.state.Language}
                                onValueChange={this.onSelectionsChangeLanguage}
                                editable = {this.state.editActive}
                            >
                            {
                                languages.map((lang) => {
                                return (<Picker.Item key={lang.code} value={lang.code} label={lang.title} />);
                                })
                            }  
                            </Picker>
                        </View>
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity style={styles.button} onPress={this.toggleEditable}>
                                <Text style={styles.buttonText}>{this.state.editActive === true ? (translations[systemLanguage].messages['save_w']) : (translations[systemLanguage].messages['edit_w'])}</Text>
                            </TouchableOpacity>
                        </View>
                        </>
                    )}   
                    </View>   
                </KeyboardAwareScrollView> 
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

const mapStateToProps = (state) => {
    return {
        login_status: state.loginData.login_status,
        userData: state.loginData.userData,
        tokenObj: state.loginData.tokenObj,
        systemLanguage: state.loginData.systemLanguage
    }
}

const mapDispatchToProps = (dispatch) =>{
    return{
        modifyData : (userData) => { dispatch (modifyData(userData))},
        logOut: () => dispatch(logOut()),
        updateToken: (tokenObj) => dispatch(updateToken(tokenObj))
    }
}
export default connect(mapStateToProps,mapDispatchToProps)(Profile);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#2196f3',
        //alignItems: 'center',
    },
    titleContainer: {
        alignItems: 'center',
    },
    buttonContainer: {
        alignItems: 'center',
        marginVertical: 15,
    },
    inputContainer: {
        marginTop: 20,
        marginLeft: 10,
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
    },
    titleText:{
        fontSize: 32, 
        fontWeight: 'bold',
        color: "#FFF",
        marginTop: 20,
        marginLeft: 20,
        marginBottom: 5,
    },
    textInput:{
        fontSize: 16,
        marginLeft: 5, 
        marginBottom: 10,
        fontWeight: 'bold',
        color: '#FFF', 
    },
    button: {
        width:130,
        height:30,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor:'#0069c0',
        borderRadius: 15,
        marginVertical: 5,
        elevation: 3,
    },
    buttonText: {
        fontSize:16,
        fontWeight:'500',
        color:'#ffffff'
    },
    subtitleText:{
        fontSize: 20, 
        fontWeight: 'bold',
        color: "#FFF",
        marginBottom: 5,
    },
    pickerBox: {
        width:300,
        backgroundColor:'rgba(255,255,255,0.3)',
        color:'#ffffff',
        marginVertical: 10
    },
    activityIndicator: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#2196f3',
        height: 80,
    },
});