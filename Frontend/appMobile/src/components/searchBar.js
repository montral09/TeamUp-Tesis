import React, {Component} from 'react';
import {View,Text,StyleSheet,TextInput,TouchableOpacity,Modal,Picker,TouchableHighlight,ToastAndroid,BackHandler} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';
import Globals from '../Globals';

const MyTextInput = ({ placeholder, value, name, type, onChange }) => {
  return (
    <TextInput style={styles.inputBox} 
      underlineColorAndroid='rgba(0,0,0,0)'
      placeholder = {placeholder}
      placeholderTextColor="#ffffff"
      value={value}
      onChangeText={text => this.onChange({ name, type, text })}
    />
  );
};

export default class SearchBar extends Component {
    constructor(props){
    super(props);
      this.state = {
        searchPopUp: false,
        spaceTypes: [],
        spaceTypeSelect: 1,
        city: '',
        capacity: '',
      }
    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
        this.getSpaceTypes();
    }
    
    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    }

    handleBackButton() {
        return true;
    }

    getSpaceTypes() {
        try {
            fetch(Globals.baseURL + '/spaceTypes')
            .then(response => response.json()).then(data => {
            //console.log("data spaces:" + JSON.stringify(data));
            if (data.responseCode == "SUCC_SPACETYPESOK") {
                this.setState({ spaceTypes: data.spaceTypes })
            } else {
                ToastAndroid.showWithGravity(
                'Hubo un error',
                ToastAndroid.LONG,
                ToastAndroid.CENTER,
                );
            }
            }
            ).catch(error => {
                ToastAndroid.showWithGravity(
                'Internal error',
                ToastAndroid.LONG,
                ToastAndroid.CENTER,
                );
            }
            )
        } catch (error) {
            ToastAndroid.showWithGravity(
            'Internal error',
            ToastAndroid.LONG,
            ToastAndroid.CENTER,
            );
            //console.log(error);
        }
    }

    onSelectionsChangeSpace = (itemValue,itemIndex) => {
        this.setState({spaceTypeSelect:itemValue})
    }

    handleInputChange(evt){
        this.setState({ [evt.target.name]: evt.target.value });
    }
    
    handleOnPress(visible){
        this.setState({searchPopUp: visible});
    }

    beginSearch(){
        this.setState({searchPopUp: false});
        this.props.navigate('SearchPublications', {spaceTypeSelect: this.state.spaceTypeSelect, city: this.state.city, capacity: this.state.capacity});
    }

    renderSearch(){
        return (
        <View>
            <Modal
            animationType="fade"
            transparent={true}
            visible={this.state.searchPopUp}
            >
            <View style={styles.modalView}>
                <View style={{marginBottom: 10}}>
                    <Text style={styles.reseñaText}>Opciones de búsqueda</Text>
                    <Picker
                        style={styles.pickerBox}
                        selectedValue={this.state.spaceTypeSelect}
                        onValueChange={(itemValue, itemIndex) => this.setState({spaceTypeSelect: itemValue})}
                        >
                        {
                            this.state.spaceTypes.map((space, key) => {
                                return (<Picker.Item key={key} value={space.Code} label={space.Description} />);
                            })
                        }  
                    </Picker>
                    <TextInput 
                        style={styles.inputBox}
                        placeholder = "Ej: Pocitos..."
                        name="city" 
                        type="text" 
                        value={this.state.city} 
                        onChangeText={(city) => this.setState({city})}
                    />
                    <TextInput 
                        style={styles.inputBox}
                        placeholder = "Capacidad"
                        name="capacity" 
                        type="text" 
                        value={this.state.capacity} 
                        onChangeText={(capacity) => this.setState({capacity})}
                    />
                    <TouchableOpacity style={styles.button} onPress={() => {this.beginSearch()}}> 
                        <Text style={styles.buttonText}>Buscar</Text>
                    </TouchableOpacity>
                    <TouchableHighlight
                        onPress={() => {
                        this.handleOnPress(false);
                        }}>
                        <Text>Cerrar</Text>
                    </TouchableHighlight>
                </View>
            </View>
            </Modal>
        </View>
        )
    }

    render (){
        return (
            <View>
            <TouchableOpacity style={styles.button} onPress={() => {this.handleOnPress(true)}}> 
                <Text style={styles.buttonText}>Buscar Espacios</Text>
            </TouchableOpacity>           
                {this.renderSearch()}
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
    button: {
        width:130,
        height:30,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor:'#0069c0',
        borderRadius: 15,
        marginVertical: 20,
        elevation: 3,
        paddingHorizontal: 5,
    },
    buttonText: {
        fontSize:16,
        fontWeight:'500',
        color:'#ffffff'
    },
    modalView: {
      //paddingTop: 10,
      alignSelf: 'center',
      alignItems: 'center',
      marginTop: 20,
      //justifyContent: 'center',
      backgroundColor: '#6ec6ff',
      borderRadius: 10,
      //height: 150,
      width: 320,
    },
    reseñaText: {
      fontSize: 18, 
      fontWeight: 'bold',
      color: 'white',
      marginTop: 20,
      //marginBottom: 15,
      //paddingLeft: 25,
    },
    pickerBox: {
        width:300,
        backgroundColor:'rgba(255,255,255,0.3)',
        color:'#ffffff',
        marginVertical: 10,
    },
    inputBox: {
        width:300,
        backgroundColor:'rgba(255,255,255,0.3)',
        borderRadius: 25,
        paddingHorizontal: 16,
        fontSize: 16,
        color:'#ffffff',
        marginVertical: 10,
    },
});

/*<View style={styles.searchContainer}>
    <Icon name='ios-search' style={{fontSize: 24, marginRight: 5, color: '#2196f3'}}/> 
    <TextInput style={styles.textInput} placeholder='Buscar espacios'/>        
  </View>

  <TextInput style={styles.inputBox} 
                        underlineColorAndroid='rgba(0,0,0,0)'
                        placeholder="Ej: Pocitos..."
                        placeholderTextColor="#ffffff"
                        onChangeText={(city) => this.setState({city})}
                        value={this.state.city}
                    /> 
    <TextInput style={styles.inputBox} 
                        underlineColorAndroid='rgba(0,0,0,0)'
                        placeholder="Capacidad"
                        placeholderTextColor="#ffffff"
                        onChangeText={this.props.handleChangeCapacity}
                        value={this.props.parentState.capacity}
                    />
    
*/
