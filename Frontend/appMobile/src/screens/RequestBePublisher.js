import React, {Component} from 'react';
import {View,Text,StyleSheet,TouchableOpacity} from 'react-native';
import { Header } from 'react-native-elements';
import { connect } from 'react-redux';
import { callAPI } from '../common/genericFunctions';
import translations from '../common/translations';

class RequestBePublisher extends Component {  
    constructor(props) {
        super(props);
        this.state = {
            PublisherValidated: props.userData.PublisherValidated,
            Mail: props.userData.Mail,
            tokenObj: props.tokenObj,  
        }
    }

    requestBePublisher = () =>{
        var objApi = {};
        objApi.objToSend = {
            Mail: this.state.Mail,
            AccessToken : this.state.tokenObj.accesToken
        }
        objApi.fetchUrl = "api/customer";
        objApi.method = "PUT";
        objApi.successMSG = {
            SUCC_USRUPDATED : translations[this.props.systemLanguage].messages['SUCC_USRUPDATED3'],
        };
        objApi.functionAfterSuccess = "requestBePublisher";
        objApi.functionAfterError = "requestBePublisher";
        objApi.errorMSG= {}
        callAPI(objApi, this);     
    }

    render (){
        const { systemLanguage } = this.props;
        return (
                <View style={styles.container}>
                    <Header
                        leftComponent={{ icon: 'menu', color: '#fff', flex: 1, onPress: () => this.props.navigation.openDrawer()}}
                        rightComponent={{ icon: 'home', color: '#fff', flex:1, onPress: () => this.props.navigation.navigate('Home')}}
                    />
                    <View style={{alignItems: 'center', justifyContent: 'center',}}>
                        <Text style={styles.titleText}>{translations[systemLanguage].messages['signInLinks_wantToPublish']}</Text>
                        <Text style={styles.infoText}>{translations[systemLanguage].messages['signInLinks_wantToPublishBody']}</Text>
                        <View style={{flexDirection: 'row'}}>
                            <TouchableOpacity style={styles.button} onPress={() => {this.props.navigation.navigate('Home')}}>
                                <Text style={styles.buttonText}>{translations[systemLanguage].messages['signInLinks_notwantToPublishBody']}</Text>   
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.button} onPress={() => {this.requestBePublisher()}}>
                                <Text style={styles.buttonText}>{translations[systemLanguage].messages['signInLinks_wantToPublishButton']}</Text>   
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>    
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#2196f3',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
    },
    titleText:{
        fontSize: 32, 
        fontWeight: 'bold',
        color: "#FFF",
        marginTop: 20,
        marginBottom: 5,
    },
    infoText:{
        fontSize: 18, 
        color: "#FFF",
        paddingHorizontal: 20,
        marginBottom: 5,
    },
    button: {
        width:130,
        height:30,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor:'#0069c0',
        borderRadius: 15,
        marginVertical: 10,
        marginLeft: 20,
        elevation: 3,
    },
    buttonText: {
        fontSize:16,
        fontWeight:'500',
        color:'#ffffff',
    },
});

const mapStateToProps = (state) => {
    return {
        userData: state.loginData.userData,
        tokenObj: state.loginData.tokenObj,
        systemLanguage: state.loginData.systemLanguage
    }
}

const mapDispatchToProps = (dispatch) =>{
    return {
        logOut: () => dispatch(logOut())
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(RequestBePublisher);