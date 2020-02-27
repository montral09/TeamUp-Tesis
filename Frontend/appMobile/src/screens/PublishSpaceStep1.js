import React, {Component} from 'react';
import { StyleSheet,Text,View,ScrollView,Keyboard,Picker,TextInput,TouchableOpacity,TouchableWithoutFeedback,Image,ToastAndroid} from 'react-native';
import SelectMultiple from 'react-native-select-multiple';

const MyTextInput = ({ placeholder, value, name, type, onChange }) => {
  return (
    <TextInput style={styles.inputBox} 
      underlineColorAndroid='rgba(0,0,0,0)'
      placeholder = {placeholder}
      placeholderTextColor="#ffffff"
      value={value}
      onChangeText={text => onChange({ name, type, text })}
    />
  );
};

const renderLabel = (label, style) => {
  return (
    <View style={{flexDirection: 'row', alignItems: 'center'}}>
      <View style={{marginLeft: 10}}>
        <Text style={{color: 'white'}}>{label}</Text>
      </View>
    </View>
  )
}

class PublishSpaceStep1 extends Component{

  render(){
    if (this.props.parentState.currentStep !== 1) { // Prop: The current step
        return null
    }
    return (
      
        <View style={styles.container}>
            <Text style={styles.titleText}>Datos de tu espacio - Paso 1</Text>
            <Picker
              style={styles.pickerBox}
              selectedValue={this.props.parentState.spaceTypeSelect}
              onValueChange={this.props.onSelectionsChangeSpace}
            >
              {this.props.parentState.spaceTypeSelect == '' ? <Picker.Item label="Seleccione tipo de espacio" value ="" /> : <Picker.Item label="" value ="" /> }
              {
                this.props.parentState.spaceTypes.map((space, key) => {
                  return (<Picker.Item key={key} value={space.Code} label={space.Description} />);
                })
              }  
            </Picker>
            <MyTextInput 
              placeholder = "Nombre del espacio (*)"
              name="spaceName" 
              type="text" 
              value={this.props.parentState.spaceName} 
              onChange={this.props.onChange}
            />
            <MyTextInput 
              placeholder = "Descripción"
              name="description" 
              type="text" 
              value={this.props.parentState.description} 
              onChange={this.props.onChange}
            />
            <MyTextInput 
              placeholder = "Capacidad (*)"
              name="capacity" 
              type="text" 
              value={this.props.parentState.capacity} 
              onChange={this.props.onChange}
            />
            <MyTextInput 
              placeholder = "Disponibilidad (*)"
              name="availability" 
              type="text" 
              value={this.props.parentState.availability} 
              onChange={this.props.onChange}
            />
            <Text style={styles.facilitiesText}>Infraestructura</Text>
            <View style={{width:300}}>
              <SelectMultiple
                items={this.props.parentState.facilities}
                renderLabel={renderLabel}
                rowStyle={{backgroundColor: '#2196f3'}}
                checkboxSource={require('../images/facilityNotSelected.png')}
                checkboxStyle={{width: 20, height: 20}}
                selectedCheckboxSource={require('../images/facilitySelected.png')}
                selectedCheckboxStyle={{width: 20, height: 20}}
                selectedItems={this.props.parentState.facilitiesSelectCompuesta}
                onSelectionsChange={this.props.onSelectionsChange} 
              />
            </View>
            
            
        </View>
      );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2196f3',
    alignItems: 'center',
    //justifyContent: 'center',
  },
  titleText:{
    fontSize: 24, 
    fontWeight: 'bold',
    color: "#FFF",
    marginTop: 10,
    marginBottom: 30,
    paddingTop: 10,
  },
  inputBox: {
    width:300,
    backgroundColor:'rgba(255,255,255,0.3)',
    borderRadius: 25,
    paddingHorizontal: 16,
    fontSize: 16,
    color:'#ffffff',
    marginVertical: 10
  },
  pickerBox: {
    width:300,
    backgroundColor:'rgba(255,255,255,0.3)',
    color:'#ffffff',
    marginVertical: 10
  },
  facilitiesText: {
    paddingHorizontal: 16,
    fontSize: 16,
    color:'#ffffff',
    marginVertical: 10,
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
  },
  buttonText: {
    fontSize:16,
    fontWeight:'500',
    color:'#ffffff'
  },
});

export default PublishSpaceStep1;

/*const StackNavigator = createStackNavigator({
  PublishSpaceStep1: {screen: PublishSpaceStep1, navigationOptions: ({ navigation }) => ({
                              header: null,
                      })},
  PublishSpaceStep2: {screen: PublishSpaceStep2, navigationOptions: ({ navigation }) => ({
                              header: null,
                      })},
  PublishSpaceStep3: {screen: PublishSpaceStep3, navigationOptions: ({ navigation }) => ({
                              header: null,
                      })},
  PublishSpaceStep4: {screen: PublishSpaceStep4, navigationOptions: ({ navigation }) => ({
                              header: null,
                      })},
});*/

//const AppContainer = createAppContainer(StackNavigator)

/*<Picker.Item label="Despachos y oficinas" value ="despacho-oficina" />
<Picker.Item label="Coworkings" value ="coworkings" />
<Picker.Item label="Salas" value ="salas" />
<Picker.Item label="Oficinas virtuales" value ="oficinasVirtuales" />*/

/*<TextInput style={styles.inputBox} 
  underlineColorAndroid='rgba(0,0,0,0)'
  placeholder="Infraestructura"
  placeholderTextColor="#ffffff"
  //onChangeText={this.handleChangePassword}
/>*/

/*<GooglePlacesAutocomplete
  placeholder='Ubicación'
  minLength={2}
  autofocus={false}
  fetchDetails={true}
  onPress={(data, details = null) => {
    
  }}
  query={{
    key: 'AIzaSyCEj158pfwnqjHz5dN21eNjocfma5ck5Ms',
    language: 'es',
    types: '(cities)',
  }}
  styles={{
    textInputContainer: {
      width: '100%'
    },
    description: {
      fontWeight: 'bold',
    },
    predefinedPlacesDescription: {
      color: '000',
    },
  }}

  filterReverseGeocodingByTypes={['locality', 'administrative_area_level_3']}

  predefinedPlacesAlwaysVisible={true}
/>*/

/*<MapView
  style={{width: 300, height: 300}}
  initialRegion={{
  latitude: -34.909397000,
  longitude: -56.138561000,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
  }}
/>
            
<TouchableOpacity style={styles.button} onPress={() => {this.props.navigation.navigate('PublishSpaceStep2')}}> 
  <Text style={styles.buttonText}>Siguiente</Text>
</TouchableOpacity>            
            
*/

/*<TextInput style={styles.inputBox} 
  underlineColorAndroid='rgba(0,0,0,0)'
  placeholder="Nombre del espacio (*)"
  placeholderTextColor="#ffffff"
  value = {this.props.parentState.spaceName}

/>*/

/*<TextInput style={styles.inputBox} 
  underlineColorAndroid='rgba(0,0,0,0)'
  placeholder="Capacidad (*)"
  placeholderTextColor="#ffffff"
  //onChangeText={this.handleChangePassword}
/>*/

/*<TextInput style={styles.inputBox} 
  underlineColorAndroid='rgba(0,0,0,0)'
  placeholder="Disponibilidad (*)"
  placeholderTextColor="#ffffff"
  //onChangeText={this.handleChangePassword}
/>*/

/*<TextInput style={styles.inputBox} 
  underlineColorAndroid='rgba(0,0,0,0)'
  placeholder="Descripción"
  placeholderTextColor="#ffffff"
  //onChangeText={this.handleChangePassword}
/>*/

/*<TextInput style={styles.inputBox} 
  underlineColorAndroid='rgba(0,0,0,0)'
  placeholder="Ubicación"
  placeholderTextColor="#ffffff"
  //onChangeText={this.handleChangePassword}
/>*/