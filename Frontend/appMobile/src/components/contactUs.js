import React, {Component} from 'react';
import {View,Text,StyleSheet} from 'react-native';

export default class Contact extends Component {
    render (){
        return (
                <View style={styles.contactContainer}>
                    <Text style={styles.titleText}>Nuestro contacto:</Text>
                </View>    
        );
    }

}

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