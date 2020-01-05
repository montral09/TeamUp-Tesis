import React, {Component} from 'react';
import {View,Text,ScrollView,StyleSheet,TextInput,TouchableOpacity,ToastAndroid} from 'react-native';
import { Header } from 'react-native-elements';

import { connect } from 'react-redux';
import { modifyData } from '../redux/actions/accountActions';
import { logOut } from '../redux/actions/accountActions';

import FloatingTitle from '../components/FloatingTitleTextInput';

baseURL = 'http://192.168.1.2:59767/api/';

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
            tokenObj: tokenObj
        }
        this.modify = this.modify.bind(this);
        this.toggleEditable = this.toggleEditable.bind(this)
    }

    toggleEditable(){
        this.setState({editActive: !this.state.editActive});
        if (this.state.editActive){
            this.modify()
        }

    }

    _updateMasterState = (attrName, value) => {
        this.setState({ [attrName]: value });
    }

    checkRequiredInputs() {
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
            ToastAndroid.showWithGravity(
                message,
                ToastAndroid.LONG,
                ToastAndroid.CENTER,
            );
        }
        return returnValue;
    }

    modify() {
        if (this.checkRequiredInputs()) {
            console.log("Token OBJ: ");
            console.log(this.state.tokenObj);
            fetch(baseURL + 'user', {
            method: 'PUT',
            header: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify({
                Password: this.state.password || "",
                Mail: this.state.originalEmail,
                Name: this.state.firstName,
                LastName: this.state.lastName,
                Phone: this.state.phone,
                Rut: this.state.rut,
                RazonSocial: this.state.razonSocial,
                Address: this.state.address,
                NewMail: this.state.email,
                AccessToken: this.state.tokenObj.accesToken
            })
        }).then(response => response.json()).then(data => {
            console.log("data:" + JSON.stringify(data));
            switch(data.responseCode){
                case "SUCC_USRUPDATED":
                    if(this.state.email != this.state.originalEmail){
                        ToastAndroid.showWithGravity(
                            'Usuario actualizado correctamente, se ha enviado un correo de verificacion a su nueva casilla ',
                            ToastAndroid.LONG,
                            ToastAndroid.CENTER,
                        );
                        this.props.logOut();
                        this.props.navigation.navigate('Login');
                    }else{
                        this.props.modifyData({
                            Mail: this.state.originalEmail,
                            Name: this.state.firstName,
                            LastName: this.state.lastName,
                            Phone: this.state.phone,
                            Rut: this.state.rut,
                            RazonSocial: this.state.razonSocial,
                            Address: this.state.address,
                        }); // this is calling the reducer to store the data on redux Store
                        ToastAndroid.showWithGravity(
                            'Usuario actualizado correctamente',
                            ToastAndroid.LONG,
                            ToastAndroid.CENTER,
                        );
                        this.props.navigation.navigate('Home');
                    }
                break;
                case "ERR_MAILALREADYEXIST":
                    ToastAndroid.showWithGravity(
                        'Ese correo ya esta en uso, por favor elija otro',
                        ToastAndroid.LONG,
                        ToastAndroid.CENTER,
                    );
                break;
                case "ERR_INVALIDACCESSTOKEN":
                    fetch(baseURL + 'tokens', {
                        method: 'PUT',
                        header: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        
                        body: JSON.stringify({
                            Mail: this.state.email,
                            RefreshToken: this.state.tokenObj.refreshToken
                        })
                    }).then(response => response.json()).then(data => {
                        this.setState({isLoading: false, buttonIsDisable:false});
                        console.log("data:" + JSON.stringify(data));
                        
                        switch(data.responseCode){
                            case "SUCC_TOKENSUPDATED":
                                let newTokenObj = {
                                    accesToken: data.AccessToken,
                                    refreshToken: data.RefreshToken
                                };
                                this.props.updateToken(newTokenObj);
                                this.setState({tokenObj: newTokenObj}, () => this.modify());                            
                            break;
                            case "ERR_INVALIDREFRESHTOKEN":
                                console.log(data.responseCode);
                            break;
                            case "ERR_REFRESHTOKENEXPIRED":
                                    console.log(data.responseCode);
                            break;
                            default:
                            case "ERR_SYSTEM":
                                    console.log(data.responseCode);
                            break;
                        }
                    }
                    ).catch(error => {
                        this.setState({isLoading: false, buttonIsDisable:false});
                        toast.error('Internal error', {
                            position: "top-right",
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                        });
                        console.log(error);
                    }
                    )
                break;

                case "ERR_ACCESSTOKENEXPIRED":
                        console.log(data.responseCode);
                break;

                default:
                    toast.error('Hubo un error', {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                    });
                break;
            }
        }
        ).catch(error => {
            toast.error('Internal error', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            console.log(error);
        }
        )
            
        }

    }

    render (){


        return (
            <ScrollView>
                <View style={styles.container}>
                    <Header
                        leftComponent={{ icon: 'menu', color: '#fff', flex:1, onPress: () => this.props.navigation.openDrawer()}}
                        rightComponent={{ icon: 'home', color: '#fff', flex:1, onPress: () => this.props.navigation.navigate('Home')}}
                    />
                    <View style={styles.titleContainer}>
                        <Text style={styles.titleText}>Panel de usuario</Text> 
                    </View>
                    <View style={styles.inputContainer}>
                        <FloatingTitle
                            attrName = 'firstName'
                            title = 'Nombre'
                            value = {this.state.firstName}
                            updateMasterState = {this._updateMasterState}
                            editBool = {this.state.editActive}
                        />
                        <FloatingTitle
                            attrName = 'lastName'
                            title = 'Apellido'
                            value = {this.state.lastName}
                            updateMasterState = {this._updateMasterState}
                            editBool = {this.state.editActive}
                        />
                        <FloatingTitle
                            attrName = 'email'
                            title = 'Correo'
                            value = {this.state.email}
                            updateMasterState = {this._updateMasterState}
                            editBool = {this.state.editActive}
                        />
                        <FloatingTitle
                            attrName = 'password'
                            title = 'Contraseña'
                            value = {this.state.password}
                            updateMasterState = {this._updateMasterState}
                            editBool = {this.state.editActive}
                        />
                        <FloatingTitle
                            attrName = 'passwordConfirm'
                            title = 'Confirmar contraseña'
                            value = {this.state.passwordConfirm}
                            updateMasterState = {this._updateMasterState}
                            editBool = {this.state.editActive}
                        />
                        <FloatingTitle
                            attrName = 'phone'
                            title = 'Número de teléfono'
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
                            title = 'Dirección'
                            value = {this.state.address}
                            updateMasterState = {this._updateMasterState}
                            editBool = {this.state.editActive}
                        />    
                    </View>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.button} onPress={this.toggleEditable}>
                            <Text style={styles.buttonText}>{this.state.editActive === true ? ('Guardar') : ('Editar')}</Text>
                        </TouchableOpacity>
                    </View>
                </View>   
            </ScrollView>     
        );
    }
}

const mapStateToProps = (state) => {
    return {
        login_status: state.loginData.login_status,
        userData: state.loginData.userData,
        tokenObj: state.loginData.tokenObj,
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

