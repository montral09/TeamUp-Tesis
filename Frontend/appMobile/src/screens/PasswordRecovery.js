import React, {Component} from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity} from 'react-native';
import { withNavigation } from 'react-navigation';
import { connect } from 'react-redux';
import translations from '../common/translations';
//import Login from './Login'
import Globals from '../Globals';

class PasswordRecovery extends Component{
    constructor(){
        super();
        this.state = {
            email: '',
            error: null,
        }
    }

    restoreUser = () => {
        if(this.state.email){
            var objApi = {};
            objApi.objToSend = {
                Mail: this.state.email
            }
            objApi.fetchUrl = "api/passwordRecovery";
            objApi.method = "POST";
            objApi.successMSG = {
                SUCC_PASSWORDUPDATED : this.props.translate('SUCC_PASSWORDUPDATED'),
            };
            objApi.functionAfterSuccess = "restoreUser";
            objApi.functionAfterError = "restoreUser";
            objApi.errorMSG= {
                ERR_USRMAILNOTEXIST : this.props.translate('ERR_USRMAILNOTEXIST')
            }
            objApi.logOut = this.props.logOut;
            callAPI(objApi, this);
        }else{
            displayErrorMessage('Por favor ingrese un correo');
        }
        
    }

    render(){
        const { systemLanguage } = this.props;
        return(
            <View style={styles.container}>
                <Text style={styles.titleText}>{translations[systemLanguage].messages['forgotPassword_header']}</Text>
                <TextInput style={styles.inputBox} 
                    underlineColorAndroid='rgba(0,0,0,0)'
                    placeholder={translations[systemLanguage].messages['email_w']}
                    placeholderTextColor="#ffffff"
                    value={this.state.email}
                    onChangeText={(email) => this.setState({email})}
                />
                
                <View style={{flexDirection:'row'}}>
                    <View style={{marginRight:10}}>
                        <TouchableOpacity style={styles.button} onPress={()=> {this.props.navigation.goBack()}}>
                            <Text style={styles.buttonText}>{translations[systemLanguage].messages['cancel_w']}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{marginLeft:10}}>
                        <TouchableOpacity style={styles.button} onPress={this.restoreUser} > 
                            <Text style={styles.buttonText}>{translations[systemLanguage].messages['recover_w']}</Text>      
                        </TouchableOpacity>
                    </View>
                </View>
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

export default connect(mapStateToProps)(PasswordRecovery)

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