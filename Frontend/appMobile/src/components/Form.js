import React, {Component} from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ToastAndroid} from 'react-native';
import { withNavigation } from 'react-navigation';

//import Globals from '../Globals'; 

baseURL = 'http://192.168.0.145:59767/api/';

class Form extends Component<{}>{
    constructor(){
        super();
        this.state = {
            password: '',
            email: '',
            data: null,
            loaded: true,
            error: null,
            ip: '',
            conecta: 'desconectado',
        }
    }

    handleChangeEmail = (typedText) => {
        this.setState({email: typedText});
    }

    handleChangePassword = (typedText) => {
        this.setState({password: typedText});
    }

    handleChangeIp = (typedText) => {
        this.setState({ip: typedText});
    }

    login = (ev) => {
        console.log("Entra: " + this.state.email + " " + this.state.password)
        //Loaded seteada en false para desplegar gif de carga al momento de inciar sesión
        //Se vuelve a poner error en null, para limpiar errores previos de la pantalla
        this.setState({loaded:false, error:null});
        let url = baseURL + 'login';
        console.log(url);
        //let h = new Headers();
        //Agrego cabezales (Headers)
        // h.append('Content-Type', 'application/json')
        // h.append('Accept', 'application/json')
        let req = new Request(url, {
            headers: {'Content-Type': 'application/json',
                      'Accept' : 'application/json',
            },
            method: 'POST',
            body: JSON.stringify({
            Password: this.state.password,
            Mail: this.state.email
            })
        })
        
        fetch(req)
        .then(response=>response.json())
        .then(this.showData)
        .catch(this.allErrors)

    }

    //Devuelve la data que se obtuvo en el fetch
    showData = (data)=>{
        //Al momento de mostrar concretarse el inicio de sesión correctamente ya no se muestra el gif
        this.setState({loaded:true});
        console.log(data);
        switch(data.responseCode) {
            case "ERR_USRMAILNOTEXIST":
                this.setState({error:"El mail ingresado no existe"})
                break;
            case "ERR_USRWRONGPASS":
                this.setState({error:"Contraseña incorrecta"})
                break;
            case "ERR_MAILNOTVALIDATED":
                this.setState({error:"El mail ingresado se encuentra en espera de validación"})
                break;   
            case "SUCC_USRLOGSUCCESS":
                ToastAndroid.showWithGravity(
                "Bienvenido, " + data.voUserLog.Name,
                ToastAndroid.LONG,
                ToastAndroid.CENTER,
                );
                //ToastAndroid.show(, ToastAndroid.SHORT);
                this.props.navigation.navigate('Home')
                break;
        }
        
    }

    //Se encarga de todo el manejo de errores en el llamado al API
    allErrors = (err) => {
        //Se saca el gif de carga, ya que para desplegar un error se tiene que haber cargado la información
        this.setState({loaded:true, error: err.message});
        console.log(err)
    }

    render(){
        return(
            <View style={styles.container}>
                {!this.state.loaded && (
                    <Text>Cargando</Text>
                )}
                <TextInput style={styles.inputBox} 
                           underlineColorAndroid='rgba(0,0,0,0)'
                           placeholder="Correo"
                           placeholderTextColor="#ffffff"
                           onChangeText={this.handleChangeEmail}
                           value={this.state.email}
                />
                <TextInput style={styles.inputBox} 
                           underlineColorAndroid='rgba(0,0,0,0)'
                           placeholder="Contraseña"
                           secureTextEntry={true}
                           placeholderTextColor="#ffffff"
                           onChangeText={this.handleChangePassword}
                           value={this.state.password}
                />
                {/*<TextInput style={styles.inputBox} 
                           underlineColorAndroid='rgba(0,0,0,0)'
                           placeholder="Ip"
                           placeholderTextColor="#ffffff"
                           onChangeText={this.handleChangeIp}
                           value={this.state.ip}
                />*/}
                <Text style={styles.signupButton} onPress={() => {this.props.navigation.navigate('PasswordRecovery')}}> No recuerdo mi contraseña</Text>
                <TouchableOpacity style={styles.button} onPress={this.login} > 
                    <Text style={styles.buttonText}>Iniciar sesión</Text>
                    
                </TouchableOpacity>
                {/*<Text style={styles.errorText}>"Debugger"</Text>*/}
                {this.state.error && (
                        <Text style={styles.errorText}>{this.state.error}</Text>  
                )}
                {/*<Text style={styles.errorText}>{this.state.conecta}</Text>*/}
                {/*<Text style={styles.errorText}> {this.state.error} </Text>*/}
            </View>
        )
    }

}

export default withNavigation(Form);

const styles = StyleSheet.create({
    container: {
      flexGrow: 1,
      alignItems: 'center',
      justifyContent: 'center',
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
    signupButton: {
        color: '#ffffff',
        fontSize: 14,
        fontWeight: '600',
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: {width: -1, height: 1},
        textShadowRadius: 10
    },
    buttonText: {
        fontSize:16,
        fontWeight:'500',
        color:'#ffffff'
    },
    errorText: {
        fontSize: 16,
        fontWeight: 'bold',
        color:'rgba(255,0,0,1)'
    }
});

/*onPress={() => {this.props.navigation.navigate('Home')}*/