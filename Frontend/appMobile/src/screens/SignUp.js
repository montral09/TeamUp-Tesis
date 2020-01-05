import React, {Component} from 'react';
import { StyleSheet,Text,View,TextInput,TouchableOpacity,ToastAndroid} from 'react-native';

import UserTypeSelector from '../components/UserTypeSelector';
import { connect } from 'react-redux';
import Globals from '../Globals';

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
        this.handleInputChange = this.handleInputChange.bind(this);
        this.register = this.register.bind(this);
    }
   
    handleInputChange(evt){
        this.setState({ [evt.target.name]: evt.target.value });
    }

    // Validate if all the required inputs are inputted, returns true or false
    checkRequiredInputs() {
        let returnValue = false;
        let message = "";
        if (!this.state.password || !this.state.email || !this.state.name
            || !this.state.lastName || !this.state.phone) {
                message='Por favor ingrese los campos obligatorios (*)';
                returnValue = true;
        } else if (!this.state.name.match(/^[A-Za-z]+$/)) {        
            returnValue = true;
            message = "Su nombre debe contener solo letras";
        } else if (this.state.name.length < 2) {        
            returnValue = true;
            message = "Nombre demasiado corto";            
        } else if (!this.state.lastName.match(/^[A-Za-z]+$/)) {
            returnValue = true;
            message = "Su apellido debe contener solo letras";
        } else if (this.state.lastName.length < 2) {        
            returnValue = true;
            message = "Apellido demasiado corto"; 
        } else /*if (this.state.password != this.state.passwordConfirm) {
            returnValue = true;
            message = "Ambos campos de contraseña deben ser iguales";
        } else*/ if (this.state.password.length < 6) {
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
        
        if(message){
            ToastAndroid.showWithGravity(
                message,
                ToastAndroid.LONG,
                ToastAndroid.CENTER,
            );
        }
        
        return returnValue;
    }

    register() {
        /*if(this.state.gestorCheckbox =='on'){
            this.state.gestorCheckbox = true;
        }else{
            this.state.gestorCheckbox = false;
        }*/
        if (!this.checkRequiredInputs()) {
            this.setState({isLoading: true, buttonIsDisable:true});
            fetch(Globals.baseURL + '/user', {
                method: 'POST',
                header: { 'Content-Type': 'application/json', 'Accept': 'application/json' },

                body: JSON.stringify({
                    Password: this.state.password,
                    Mail: this.state.email,
                    Name: this.state.name,
                    LastName: this.state.lastName,
                    Phone: this.state.phone,
                    CheckPublisher: this.state.checkPublisher,
                    Rut: this.state.rut,
                    RazonSocial: this.state.razonSocial,
                    Address: this.state.address,
                })
            }).then(response => response.json()).then(data => {
                this.setState({isLoading: false, buttonIsDisable:false});
                console.log("data:" + JSON.stringify(data));
                if (data.responseCode == "SUCC_USRCREATED") {
                    ToastAndroid.showWithGravity(
                        'Usuario creado correctamente, por favor revise su correo para activar la cuenta ',
                        ToastAndroid.LONG,
                        ToastAndroid.CENTER,
                    );
                    this.props.navigation.navigate('Login')
                } else {
                    if(data.Message){
                        ToastAndroid.showWithGravity(
                            'Hubo un error: ' + data.Message,
                            ToastAndroid.LONG,
                            ToastAndroid.CENTER,
                        );
                    }else{
                        ToastAndroid.showWithGravity(
                            'Ese correo ya esta en uso, por favor elija otro.',
                            ToastAndroid.LONG,
                            ToastAndroid.CENTER,
                        );
                    }


                }
            }
            ).catch(error => {
                this.setState({isLoading: false, buttonIsDisable:false});
                ToastAndroid.showWithGravity(
                    'Internal error',
                    ToastAndroid.LONG,
                    ToastAndroid.CENTER,
                );
                console.log(error);
            }
            )
        }

    }

   render(){
        
        return (
            <View style={styles.container}>
                <View style={styles.signupTitleContainer}>
                    <Text style={styles.titleText}>REGISTRO</Text>
                    <UserTypeSelector/>
                    {<TextInput style={styles.inputBox} 
                            underlineColorAndroid='rgba(0,0,0,0)'
                            placeholder="Nombre"
                            placeholderTextColor="#ffffff"
                            onChangeText={(name) => this.setState({name})}
                            value={this.state.name}
                    />}
                    {<TextInput style={styles.inputBox} 
                            underlineColorAndroid='rgba(0,0,0,0)'
                            placeholder="Apellido"
                            placeholderTextColor="#ffffff"
                            onChangeText={(lastName) => this.setState({lastName})}
                            value={this.state.lastName}
                    />}
                    <TextInput style={styles.inputBox} 
                            underlineColorAndroid='rgba(0,0,0,0)'
                            placeholder="Correo"
                            placeholderTextColor="#ffffff"
                            value={this.state.email}
                            onChangeText={(email) => this.setState({email})}
                    />
                    {<TextInput style={styles.inputBox} 
                            underlineColorAndroid='rgba(0,0,0,0)'
                            placeholder="Teléfono"
                            placeholderTextColor="#ffffff"
                            name = "phone"
                            value={this.state.phone}
                            onChangeText={(phone) => this.setState({phone})}
                    />}
                    <TextInput style={styles.inputBox} 
                            underlineColorAndroid='rgba(0,0,0,0)'
                            placeholder="Contraseña"
                            placeholderTextColor="#ffffff"
                            secureTextEntry={true}
                            name = "password"
                            value={this.state.password}
                            onChangeText={(password) => this.setState({password})}
                    />
                    {<TextInput style={styles.inputBox} 
                            underlineColorAndroid='rgba(0,0,0,0)'
                            placeholder="Confirmar contraseña"
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
                            placeholder="Razón Social"
                            placeholderTextColor="#ffffff"
                            name = "razonSocial"
                            value={this.state.razonSocial}
                            onChangeText={(razonSocial) => this.setState({razonSocial})}
                    />}
                    {<TextInput style={styles.inputBox} 
                            underlineColorAndroid='rgba(0,0,0,0)'
                            placeholder="Dirección"
                            placeholderTextColor="#ffffff"
                            name = "address"
                            value={this.state.address}
                            onChangeText={(address) => this.setState({address})}
                    />}
                    
                    <TouchableOpacity style={styles.button} onPress={() => { this.register() }}  /*onPress={() => {this.props.navigation.navigate('Home')}*/>
                        <Text style={styles.buttonText}>Registrarse</Text>   
                    </TouchableOpacity>
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
    signupTitleContainer: {
        alignItems: 'center',
        paddingVertical: 20,
        justifyContent: 'center',
    },
    titleText: {
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
        marginVertical: 10,
        elevation: 3,
    },
    buttonText: {
        fontSize:16,
        fontWeight:'500',
        color:'#ffffff',
    },
});

const mapStateToProps = (state) =>{
    return {
        login_status: state.loginData.login_status
    }
}

export default connect(mapStateToProps)(SignUp);

/*register = (ev) => {
        let url = baseURL + 'user';
        let req = new Request(url, {
            headers: {'Content-Type': 'application/json',
                      'Accept' : 'application/json',
            },
            method: 'POST',
            body: JSON.stringify({
            Mail : this.state.email,
            Password : this.state.password,
            Name : this.state.name,
            LastName : this.state.lastName,
            Phone : this.state.phone,
            CheckPublisher : false,
            Rut : this.state.rut,
            RazonSocial : this.state.razonSocial,
            Address : this.state.address,
            })
        })
        
        fetch(req)
        .then(response=>response.json())
        .then(this.showData)
        .catch(this.allErrors)

    }

    showData = (data)=>{
        console.log(data);
        switch(data.responseCode) {
            case "ERR_MAILALREADYEXIST":
                this.setState({error:"El mail ingresado ya fue utilizado"})
                break;   
            case "SUCC_USRCREATED":
                ToastAndroid.showWithGravity(
                "Usuario creado con exito",
                ToastAndroid.LONG,
                ToastAndroid.CENTER,
                );
                this.props.navigation.navigate('Login')
                break;
        }
        
    }
    
    //Se encarga de todo el manejo de errores en el llamado al API
    allErrors = (err) => {
        this.setState({error: err.message});
        console.log(err)
    }

   static navigationOptions = {
     header: null
   };    
    

*/