import React, {Component} from 'react';
import {View,Text,StyleSheet} from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { CONTACT_PHONENUMBER, CONTACT_EMAIL} from '../common/constants';
import { connect } from 'react-redux';

import translations from '../common/translations';

class Contact extends Component {
    render (){
        const { systemLanguage } = this.props;
        return (
                <View style={styles.contactContainer}>
                    <View style={{flexDirection:'row'}}>
                        <View style={{flex: 1}}>
                            <Text style={styles.subtitleText}>{translations[systemLanguage].messages['about_us']}</Text>
                            <Text style={styles.infoText}>TeamUp!</Text>
                            <Text style={styles.infoText}>{translations[systemLanguage].messages['about_mainText']}</Text>
                        </View>
                        <View style={{flex: 1}}>
                            <Text style={styles.subtitleText}>{translations[systemLanguage].messages['contact_w']}</Text>
                            <View style={{flexDirection:'row'}}>  
                                <View style={{marginBottom:8}}>
                                    <Ionicons name="ios-phone-portrait"
                                        color="#fff"
                                        size={32}
                                    />
                                </View>
                                <Text style={styles.infoText}> {CONTACT_PHONENUMBER}</Text>
                            </View> 
                            <View style={{flexDirection:'row'}}>
                                <View style={{marginBottom:8}}>
                                    <Ionicons name="ios-mail"
                                        color="#fff"
                                        size={32} 
                                    />
                                </View>
                                <Text style={styles.infoText}> {CONTACT_EMAIL}</Text>
                            </View> 
                        </View>
                    </View>
                </View>    
        );
    }

}

const mapStateToProps = (state) => {
    return {
        systemLanguage: state.loginData.systemLanguage
    }
}

export default connect(mapStateToProps)(Contact)

const styles = StyleSheet.create({
    contactContainer:{
        flex: 1,
        backgroundColor: '#0069c0',
        marginTop: 40,
        paddingBottom: 40,
        paddingLeft: 10,
        elevation: 14,
    },
    titleText:{
        fontSize: 24, 
        fontWeight: 'bold',
        color: '#FFF',
        marginTop: 20,
        marginLeft: 20,
    },
    subtitleText:{
        fontSize: 20, 
        fontWeight: 'bold',
        color: "#FFF",
        marginBottom: 5,
    },
    infoText:{
        color: "#FFF",
    },
});