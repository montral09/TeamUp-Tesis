import React, {Component} from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ToastAndroid} from 'react-native';
import { withNavigation } from 'react-navigation';

//import Login from './Login'
import Globals from '../Globals';

export default class PasswordRecovery extends Component<>{
    constructor(){
        super();
        this.state = {
            email: '',
            error: null,
        }
    }

    passRecovery = (ev) => {
        let url = Globals.baseURL + 'passwordRecovery';
        let req = new Request(url, {
            headers: {'Content-Type': 'application/json',
                      'Accept' : 'application/json',
            },
            method: 'POST',
            body: JSON.stringify({
            Mail : this.state.email,
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
            case "ERR_USRMAILNOTEXIST":
                this.setState({error:"El mail ingresado ya fue utilizado"})
                break;   
            case "SUCC_PASSWORDUPDATED":
                ToastAndroid.showWithGravity(
                "Se ha enviado un correo con su nueva contraseña",
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

    render(){
        return(
            <View style={styles.container}>
                <Text style={styles.titleText}>Recuperar contraseña</Text>
                <TextInput style={styles.inputBox} 
                    underlineColorAndroid='rgba(0,0,0,0)'
                    placeholder="Correo"
                    placeholderTextColor="#ffffff"
                    value={this.state.email}
                    onChangeText={(email) => this.setState({email})}
                />
                <TouchableOpacity style={styles.button} onPress={this.passRecovery} > 
                    <Text style={styles.buttonText}>Enviar correo</Text>      
                </TouchableOpacity>
            </View>
        )
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#2196f3',
        alignItems: 'center',
        justifyContent: 'center',
    },
    titleText : {
        fontSize: 24,
        color: 'rgba(255,255,255,1)'
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
        color:'#ffffff'
    },
});