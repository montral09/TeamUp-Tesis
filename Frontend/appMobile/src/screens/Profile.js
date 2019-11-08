import React, {Component} from 'react';
import {View,Text,StyleSheet,TextInput,TouchableOpacity} from 'react-native';
import { Header } from 'react-native-elements';

import FloatingTitle from '../components/FloatingTitleTextInput';
import SearchBar from '../components/searchBar';

export default class Profile extends Component {
    constructor(props) {
        super(props)
        this.state = {
            editActive: false,
            email: 'Correo@prueba.com',
            password: 'password.prueba',
        }

        this.toggleEditable = this.toggleEditable.bind(this)
    }

    toggleEditable(){
        this.setState({editActive: !this.state.editActive});
    }

    _updateMasterState = (attrName, value) => {
        this.setState({ [attrName]: value });
    }

    render (){
        return (
                <View style={styles.container}>
                    <Header
                        leftComponent={{ icon: 'menu', color: '#fff', flex:1, onPress: () => this.props.navigation.openDrawer()}}
                        //centerComponent={<SearchBar/>}
                        rightComponent={{ icon: 'home', color: '#fff', flex:1, onPress: () => this.props.navigation.navigate('Home')}}
                    />
                    <View style={styles.titleContainer}>
                        <Text style={styles.titleText}>Panel de usuario</Text> 
                    </View>
                    <View style={styles.inputContainer}>
                        <FloatingTitle
                            attrName = 'email'
                            title = 'Correo'
                            value = {this.state.email}
                            updateMasterState = {this._updateMasterState}
                            editBool = {this.state.editActive}
                        />
                        <FloatingTitle
                            attrName = 'password'
                            title = 'Contraseña'
                            value = {this.state.password}
                            updateMasterState = {this._updateMasterState}
                            editBool = {this.state.editActive}
                        />
                        {this.state.editable && <TextInput style={styles.textInput}
                            label = 'Correo' 
                            underlineColorAndroid='rgba(0,0,0,0)'
                            value = 'testEmail'
                            editable = {this.state.editActive}
                        />}
                        {this.state.editable && <TextInput style={styles.textInput} 
                            underlineColorAndroid='rgba(0,0,0,0)'
                            label = 'Contraseña'
                            value = 'testContraseña'
                            editable = {this.state.editActive}
                        />}   
                    </View>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.button} onPress={this.toggleEditable}>
                            <Text style={styles.buttonText}>{this.state.editActive === true ? ('Guardar') : ('Editar')}</Text>
                        </TouchableOpacity>
                    </View>
                </View>   
                 
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#2196f3',
        //alignItems: 'center',
    },
    titleContainer: {
        alignItems: 'center',
    },
    buttonContainer: {
        alignItems: 'center',
        marginVertical: 15,
    },
    inputContainer: {
        marginTop: 20,
        marginLeft: 10,
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
    },
    titleText:{
        fontSize: 32, 
        fontWeight: 'bold',
        color: "#FFF",
        marginTop: 20,
        marginLeft: 20,
        marginBottom: 5,
    },
    textInput:{
        fontSize: 16,
        marginLeft: 5, 
        marginBottom: 10,
        fontWeight: 'bold',
        color: '#FFF', 
    },
    button: {
        width:130,
        height:30,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor:'#0069c0',
        borderRadius: 15,
        marginVertical: 5,
        elevation: 3,
    },
    buttonText: {
        fontSize:16,
        fontWeight:'500',
        color:'#ffffff'
    },
});