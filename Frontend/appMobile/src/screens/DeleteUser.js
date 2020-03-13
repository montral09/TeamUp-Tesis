import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';
import { callAPI } from '../common/genericFunctions'
import { logOut } from '../redux/actions/accountActions';
import translations from '../common/translations';

class DeleteUser extends Component{
    constructor() {
        super();
        this.state = {
            isLoading: false
        }
    }

    // This function will call the main API and delete the user if everything checks out
    deleteUser = () => {
        var objApi = {};
        objApi.objToSend = {
            "AccessToken": this.props.tokenObj.accesToken,
            "Mail": this.props.userData.Mail,
        }
        objApi.fetchUrl = "api/user";
        objApi.method = "DELETE";
        objApi.successMSG = {
            SUCC_USRDELETED: translations[this.props.systemLanguage].messages['SUCC_USRDELETED']
        };
        objApi.functionAfterSuccess = "deleteUser";
        objApi.functionAfterError = "deleteUser";
        objApi.errorMSG = {
            ERR_PENDINGRESERVATIONCUSTOMER: translations[this.props.systemLanguage].messages['ERR_PENDINGRESERVATIONCUSTOMER'],
            ERR_PENDINGRESERVATIONPAYMENT: translations[this.props.systemLanguage].messages['ERR_PENDINGRESERVATIONPAYMENT'],
            ERR_PENDINGPUBLICATION: translations[this.props.systemLanguage].messages['ERR_PENDINGPUBLICATION'],
            ERR_PENDINGRESERVATIONPUBLISHER: translations[this.props.systemLanguage].messages['ERR_PENDINGRESERVATIONPUBLISHER'],
            ERR_PENDINGPREFERENTIALPAYMENT: translations[this.props.systemLanguage].messages['ERR_PENDINGPREFERENTIALPAYMENT'],
            ERR_PENDINGCOMMISSIONPAYMENT: translations[this.props.systemLanguage].messages['ERR_PENDINGCOMMISSIONPAYMENT'],
        }
        objApi.logOut = this.props.logOut;
        this.setState({ isLoading: true });
        callAPI(objApi, this);
    }

    render() {
        const { systemLanguage } = this.props;
        return (
            <View style={styles.container}>
                {this.state.isLoading ? (
                    <ActivityIndicator
                        animating = {this.state.isLoading}
                        color = 'white'
                        size = "large"
                        style = {styles.activityIndicator}
                    />
                ) : (
                        <>
                            <Text style={styles.titleText}> {translations[systemLanguage].messages['deleteUser_body']}</Text>
                            <View style={{flexDirection:'row'}}>
                                <View style={{marginRight:10}}>
                                    <TouchableOpacity style={styles.button} onPress={()=> {this.props.navigation.goBack()}}>
                                        <Text style={styles.buttonText}>{translations[systemLanguage].messages['cancel_w']}</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={{marginLeft:10}}>
                                    <TouchableOpacity style={styles.button} onPress={() => {this.deleteUser()}} >
                                        <Text style={styles.buttonText}>{translations[systemLanguage].messages['accept_w']}</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </>
                    )}
            </View>
        )
    }

}

const mapStateToProps = (state) => {
    return {
        tokenObj: state.loginData.tokenObj,
        userData: state.loginData.userData,
        systemLanguage: state.loginData.systemLanguage
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        logOut: () => { dispatch(logOut()) }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DeleteUser);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#2196f3',
        alignItems: 'center',
        justifyContent: 'center',
    },
    titleText: {
        fontSize: 24,
        color: 'rgba(255,255,255,1)'
    },
    inputBox: {
        width: 300,
        backgroundColor: 'rgba(255,255,255,0.3)',
        borderRadius: 25,
        paddingHorizontal: 16,
        fontSize: 16,
        color: '#ffffff',
        marginVertical: 10
    },
    button: {
        width: 130,
        height: 30,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0069c0',
        borderRadius: 15,
        marginVertical: 10,
        elevation: 3,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#ffffff'
    },
    activityIndicator: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#2196f3',
        height: 80,
    },
});