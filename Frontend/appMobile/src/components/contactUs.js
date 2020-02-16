import React, {Component} from 'react';
import {View,Text,StyleSheet} from 'react-native';
import { connect } from 'react-redux';

import translations from '../common/translations';

class Contact extends Component {
    render (){
        const { systemLanguage } = this.props;
        return (
                <View style={styles.contactContainer}>
                    <Text style={styles.titleText}>{translations[systemLanguage].messages['contact_w']}</Text>
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
        paddingBottom: 60,
        elevation: 14,
    },
    titleText:{
        fontSize: 24, 
        fontWeight: 'bold',
        color: '#FFF',
        marginTop: 20,
        marginLeft: 20,
    },
});