import React, {Component} from 'react';
import {View,Text,StyleSheet,TouchableOpacity} from 'react-native';
import { connect } from 'react-redux';

class ErrorScreen extends Component {

    render (){

        return (
                <View style={styles.container}>
                    <Text style={styles.titleText}>Algo no salió bien</Text>
                    <Text style={styles.infoText}>Lo sentimos pero hubo un problema con la acción que intentó hacer, intente más tarde</Text>
                    <TouchableOpacity style={styles.button} onPress={() => {this.props.navigation.navigate('Home')}}>
                        <Text style={styles.buttonText}>Home</Text>   
                    </TouchableOpacity>
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
        elevation: 3,
    },
    buttonText: {
        fontSize:16,
        fontWeight:'500',
        color:'#ffffff',
    },
});

export default ErrorScreen;