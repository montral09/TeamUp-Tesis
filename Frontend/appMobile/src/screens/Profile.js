import React, {Component} from 'react';
import {View,Text,ScrollView,StyleSheet,TextInput,TouchableOpacity} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Header } from 'react-native-elements';
import translations from '../common/translations';
import {callAPI, displayErrorMessage} from '../common/genericFunctions';
import LoadingOverlay from 'react-native-loading-spinner-overlay';

import { connect } from 'react-redux';
import { modifyData } from '../redux/actions/accountActions';
import { logOut } from '../redux/actions/accountActions';

import FloatingTitle from '../components/FloatingTitleTextInput';


class Profile extends Component {
    constructor(props) {
        super(props);
        const { Address, LastName, Mail, Name, Phone, RazonSocial, Rut } = props.userData;
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
            address: Address,
            anyChange: false,
            tokenObj: tokenObj,
            isLoading : false
        }
    }

    toggleEditable = () => {
        this.setState({editActive: !this.state.editActive});
        if (this.state.editActive){
            this.modify()
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
        } else if (!this.state.firstName.match(/^[A-Za-z]+$/)) {        
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
            console.log ('entre a razon social');
            message='Razon social demasiada corta';
            returnValue = true;
        } else if (this.state.address && this.state.address < 10) {
            console.log ('entre a address');
            message='Direccion demasiado corta';
            returnValue = true;
        }
        if (message) {
            displayErrorMessage(message);
        }
        return returnValue;
    }

    modify = () => {
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
                Language : 'es'
            }
            objApi.fetchUrl = "api/user";
            objApi.method = "PUT";
            objApi.successMSG = {
                SUCC_USRUPDATED : this.state.email == this.state.originalEmail ? translations['es'].messages['SUCC_USRUPDATED'] : translations['es'].messages['SUCC_USRUPDATED2'],
            };
            objApi.functionAfterSuccess = "modifyUser";
            objApi.functionAfterError = "modifyUser";
            objApi.errorMSG= {
                ERR_MAILALREADYEXIST : translations['es'].messages['ERR_MAILALREADYEXIST']
            }
            // Custom
            objApi.emailChanged = this.state.email != this.state.originalEmail;
            this.setState({ isLoading: true });
            callAPI(objApi, this);
        }

    }

    render (){
        const { systemLanguage } = this.props;

        return (
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
                            editBool = {this.state.editActive}
                        />
                        <FloatingTitle
                            attrName = 'lastName'
                            title = {translations[systemLanguage].messages['lastName_w']}
                            value = {this.state.lastName}
                            updateMasterState = {this._updateMasterState}
                            editBool = {this.state.editActive}
                        />
                        <FloatingTitle
                            attrName = 'email'
                            title = 'Email'
                            value = {this.state.email}
                            updateMasterState = {this._updateMasterState}
                            editBool = {this.state.editActive}
                        />
                        <FloatingTitle
                            attrName = 'password'
                            title = {translations[systemLanguage].messages['password_w']}
                            value = {this.state.password}
                            updateMasterState = {this._updateMasterState}
                            editBool = {this.state.editActive}
                        />
                        <FloatingTitle
                            attrName = 'passwordConfirm'
                            title = {translations[systemLanguage].messages['register_repeatPassword']}
                            value = {this.state.passwordConfirm}
                            updateMasterState = {this._updateMasterState}
                            editBool = {this.state.editActive}
                        />
                        <FloatingTitle
                            attrName = 'phone'
                            title = {translations[systemLanguage].messages['phoneNumber_w']}
                            value = {this.state.phone}
                            updateMasterState = {this._updateMasterState}
                            editBool = {this.state.editActive}
                        />
                        <FloatingTitle
                            attrName = 'rut'
                            title = 'RUT'
                            value = {this.state.rut}
                            updateMasterState = {this._updateMasterState}
                            editBool = {this.state.editActive}
                        />
                        <FloatingTitle
                            attrName = 'razonSocial'
                            title = 'Razón Social'
                            value = {this.state.razonSocial}
                            updateMasterState = {this._updateMasterState}
                            editBool = {this.state.editActive}
                        />
                        <FloatingTitle
                            attrName = 'address'
                            title = {translations[systemLanguage].messages['address_w']}
                            value = {this.state.address}
                            updateMasterState = {this._updateMasterState}
                            editBool = {this.state.editActive}
                        /> 
 
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
});