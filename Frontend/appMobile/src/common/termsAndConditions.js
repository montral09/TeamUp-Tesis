import React, {Component} from 'react';
import { StyleSheet,Text,View,TouchableOpacity} from 'react-native';
import { connect } from 'react-redux';
import translations from '../common/translations';

class TermsAndConditions extends Component {

    render() {
        const { systemLanguage } = this.props;
        return (
            <View style={styles.container}>
                <Text style={styles.titleText}>{translations[systemLanguage].messages['termsandcond_main_header']}</Text>             
                <Text style={styles.infoText}>{translations[systemLanguage].messages['termsandcond_mainText']}</Text>  
                <TouchableOpacity style={styles.button} onPress={() => {this.props.navigation.goBack()}}> 
                    <Text style={styles.buttonText}>{translations[systemLanguage].messages['reservation_modal_ok']}</Text> 
                </TouchableOpacity>
            </View> 
        );
    }
}

const mapStateToProps = (state) => {
    return {
        systemLanguage: state.loginData.systemLanguage
    }
}

export default connect(mapStateToProps)(TermsAndConditions);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#2196f3',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 10,
    },
    titleText: {
        marginTop: 20,
        marginBottom: 10,
        fontSize: 24, 
        fontWeight: 'bold',
        color: "#FFF",
    },
    button: {
        width:130,
        height:30,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor:'#0069c0',
        borderRadius: 15,
        marginVertical: 6,
        elevation: 3,
        marginHorizontal: 10,
    },
    buttonText: {
        fontSize:16,
        fontWeight:'500',
        color:'#ffffff',
    },
    infoText:{
        color: "#FFF",
        marginBottom: 10,
    },
});