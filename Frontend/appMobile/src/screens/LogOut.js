import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { withNavigation } from 'react-navigation';
import { logOut } from '../redux/actions/accountActions';

class LogOut extends Component<>{

    // This function will send the user to the login screen and remove the local user data
    logOutHandler = () => {
        this.props.navigation.navigate('Login')
        this.props.logOut()
    }

    render() {
        return (
            <View style={styles.container}>
                <TouchableOpacity style={styles.button} onPress={this.logOutHandler} >
                    <Text style={styles.buttonText}>Log out</Text>
                </TouchableOpacity>
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
export default connect(mapStateToProps, mapDispatchToProps)(withNavigation(LogOut));

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
});