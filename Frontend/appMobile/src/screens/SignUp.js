import React, {Component} from 'react';
import { StyleSheet,Text,View,TextInput,TouchableOpacity,ToastAndroid} from 'react-native';

import UserTypeSelector from '../components/UserTypeSelector';

baseURL = 'http://192.168.0.145:59767/api/';

export default class SignUp extends Component{
    constructor(){
        super();
        this.state = {
            email: '',
            password: '',
            name: '',
            lastName: '',
            phone: '',
            checkPublisher: false,
            rut: '',
            razonSocial: '',
            address: '',
            error: null,
        };
        this.handleInputChange = this.handleInputChange.bind(this);
    }
   
    handleInputChange(evt){
        this.setState({ [evt.target.name]: evt.target.value });
    }

    register = (ev) => {
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
                this.props.navigation.navigate('Home')
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
                            //onChangeText={this.handleChangeConfirmPassword}
                            //value={this.state.confirmPassword}
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
                    
                    <TouchableOpacity style={styles.button} onPress={this.register} /*onPress={() => {this.props.navigation.navigate('Home')}*/>
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