import React, {Component} from 'react';
import {View,Text,StyleSheet,TextInput,TouchableOpacity,Modal,Picker,BackHandler} from 'react-native';
import { connect } from 'react-redux';
import { callAPI } from '../common/genericFunctions';
import { Ionicons } from "@expo/vector-icons";
import translations from '../common/translations';

class SearchBar extends Component {
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
        this.loadSpaceTypesBR();
    }
    
    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    }

    handleBackButton() {
        return true;
    }

    // This function will call the API
    loadSpaceTypesBR = () => {
        var objApi = {};
        objApi.objToSend = {}
        objApi.fetchUrl = "api/spaceTypes";
        objApi.method = "GET";
        objApi.successMSG = {
            SUCC_SPACETYPESOK : '',
        };
        objApi.functionAfterSuccess = "loadSpaceTypesBR";
        objApi.functionAfterError = "loadSpaceTypesBR";
        objApi.errorMSG = {}
        callAPI(objApi, this);
    }

    onSelectionsChangeSpace = (itemValue,itemIndex) => {
        this.setState({spaceTypeSelect:itemValue})
    }
    
    handleOnPress(visible){
        this.setState({searchPopUp: visible});
    }

    beginSearch(){
        this.setState({searchPopUp: false});
        this.props.navigate('SearchPublications', {spaceTypeSelect: this.state.spaceTypeSelect, city: this.state.city, capacity: this.state.capacity});
    }

    renderSearch(){
        const { systemLanguage } = this.props;
        return (
        <View>
            <Modal
            animationType="fade"
            transparent={true}
            visible={this.state.searchPopUp}
            >
            <View style={styles.modalView}>
                <View style={{alignItems: 'center', marginBottom: 10}}>
                    <View style={{position: 'absolute', right: 10, top: -2}}>
                        <TouchableOpacity
                            onPress={() => {
                            this.handleOnPress(false);
                            }}>
                            <Ionicons name="ios-close" size={40} color="white"></Ionicons>
                        </TouchableOpacity>  
                    </View>
                    <Text style={styles.reseñaText}>{translations[systemLanguage].messages['home_findSpaceText']}</Text>
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
                        underlineColorAndroid='rgba(0,0,0,0)'
                        placeholder = "Ej: Pocitos..."
                        placeholderTextColor="#ffffff"
                        name="city" 
                        type="text" 
                        value={this.state.city} 
                        onChangeText={(city) => this.setState({city})}
                    />
                    <TextInput 
                        style={styles.inputBox}
                        underlineColorAndroid='rgba(0,0,0,0)'
                        placeholder = {translations[systemLanguage].messages['capacity_w']}
                        placeholderTextColor="#ffffff"
                        name="capacity" 
                        type="text" 
                        value={this.state.capacity} 
                        onChangeText={(capacity) => this.setState({capacity})}
                    />
                    <TouchableOpacity style={styles.button} onPress={() => {this.beginSearch()}}> 
                        <Text style={styles.buttonText}>{translations[systemLanguage].messages['home_findButtonModal']}</Text>
                    </TouchableOpacity>  
                </View>
            </View>
            </Modal>
        </View>
        )
    }

    render (){
        const { systemLanguage } = this.props;
        return (
            <View>
            <TouchableOpacity style={styles.button} onPress={() => {this.handleOnPress(true)}}> 
                <Text style={styles.buttonText}>{translations[systemLanguage].messages['home_findButton']}</Text>
            </TouchableOpacity>           
                {this.renderSearch()}
            </View>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        systemLanguage: state.loginData.systemLanguage
    }
}

export default connect(mapStateToProps)(SearchBar)

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
      justifyContent: 'center',
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
