import React, {Component} from 'react';
import { StyleSheet,Text,View,TextInput,TouchableOpacity} from 'react-native';
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
        this.register = this.register.bind(this);
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
            <View style={styles.container}>
                <View style={styles.signupTitleContainer}>
                    <Text style={styles.titleText}>{translations[systemLanguage].messages['registerYourself_w']}</Text>
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
                    
                    <TouchableOpacity style={styles.button} onPress={() => { this.register() }}  /*onPress={() => {this.props.navigation.navigate('Home')}*/>
                        <Text style={styles.buttonText}>{translations[systemLanguage].messages['registerYourself_w']}</Text>   
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
        login_status: state.loginData.login_status,
        systemLanguage: state.loginData.systemLanguage
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