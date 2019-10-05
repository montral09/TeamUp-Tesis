import React, {Component} from 'react';
import {View,Text,StyleSheet,TextInput} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';

export default class SearchBar extends Component {
    render (){
        return (
                <View style={styles.searchContainer}>
                    <Icon name='ios-search' style={{fontSize: 24, marginRight: 5, color: '#2196f3'}}/> 
                    <TextInput style={styles.textInput} placeholder='Buscar espacios'/>
                </View>    
        );
    }
}

const styles = StyleSheet.create({
    searchContainer:{
        flex: 4,
        flexDirection: 'row',
        backgroundColor: '#FFF',
        height: 50,
        padding: 5,
        marginTop: 10,
        marginBottom: 10,
        alignItems: 'center',
    },
    textInput:{
        fontSize: 16,
        marginLeft: 5, 
        fontWeight: 'bold',
        color: 'black', 
    },
});

