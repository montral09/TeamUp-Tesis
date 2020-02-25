import React, {Component} from 'react';
import { StyleSheet,Text,View,ScrollView,TextInput,TouchableOpacity,Button,Image,ToastAndroid} from 'react-native';
import { Header } from 'react-native-elements';
import * as Permissions from "expo-permissions";
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Geocoder from 'react-native-geocoding';
import MapView, { Marker } from 'react-native-maps';

import Globals from '../Globals';

Geocoder.init(Globals.apiKey, {language : "es", region:'uy'});

class PublishSpaceStep2 extends Component{
  constructor(props){
    super(props);
    var locationTextValidatedInitial = false;
    if(this.props.parentState.geoLat != 0){
        locationTextValidatedInitial = true;
    }
    this.state = {
      address: null,
      coordinates: null,
      geoLat: this.props.parentState.geoLat,
      geoLng: this.props.parentState.geoLng,
      locationText: this.props.parentState.locationText,
      locationTextSuccess: false,
      locationTextError: false,
      loadingLocationVal: false,
      locationTextValidated: locationTextValidatedInitial,
      locationTextLoading: false,
    }
    //this.matchYoutubeUrl = this.matchYoutubeUrl.bind(this);
    this.validateLocation = this.validateLocation.bind(this);
    this.functionLoadLocation = this.functionLoadLocation.bind(this);
    //this.deleteImage = this.deleteImage.bind(this);
  }

  //handleInputChange(evt){
  //      this.setState({ [evt.target.name]: evt.target.value });
  //}

  functionLoadLocation(ev){
        // if the location was valid and you try to input again -) need to validate again
        if(this.state.locationTextValidated){
          scope.props.handleChange("", scope.state.locationText);
          scope.props.handleChange("", lat);
          scope.props.handleChange("", lng);
        }
        // if not, load the text
        this.setState({
            locationText: ev.target.value,
            locationTextValidated: false,
            locationTextSuccess: false,
            locationTextError: false,
        });
  }
  
  validateLocation(){
        if(this.state.locationText ==''){
          ToastAndroid.showWithGravity(
          'Por favor ingrese la ubicación',
          ToastAndroid.LONG,
          ToastAndroid.CENTER,
          );
        }else{
            const scope = this;
            this.setState({
              locationTextLoading: true,
            }, () => {
                try{
                  Geocoder.from(this.state.locationText)
                  .then(response => {
                    const { lat, lng } = response.results[0].geometry.location;
                    
                    scope.setState({
                      locationTextLoading: false,
                      locationTextValidated: true,
                      locationTextSuccess: true,
                      geoLat: lat,
                      geoLng: lng
                    });
                    scope.props.handleChange("locationText", scope.state.locationText);
                    scope.props.handleChange("geoLat", lat);
                    scope.props.handleChange("geoLng", lng);
                    scope.props.handleChange("city", scope.state.address);
                  },
                  error => {
                      throw error;
                  }
                  );
                }catch(e){
                  
                    scope.setState({
                      locationTextLoading: false,
                      locationTextValidated: false,
                      locationTextSuccess: false,
                      locationTextError: true,
                    });
                }

            });
            
        }
    }

  render(){
    if (this.props.parentState.currentStep !== 2) { // Prop: The current step
        return null
    }
    const { photo } = this.state
    return (
        <View style={styles.container}>
            <Text style={styles.titleText}>Datos de tu espacio - Paso 2</Text>
            <GooglePlacesAutocomplete
                placeholder='Localidad'
                minLength={2} // minimum length of text to search
                autoFocus={false}
                //returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
                listViewDisplayed='auto'    // true/false/undefined
                fetchDetails={true}
                //renderDescription={row => row.description} // custom description render
                onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true
                  
                  this.setState(
                            {
                              address: details.name, // selected address
                              coordinates: `${details.geometry.location.lat},${details.geometry.location.lng}` // selected coordinates
                            }
                          );
                  
                }}
                

                getDefaultValue={() => ''}

                query={{
                  // available options: https://developers.google.com/places/web-service/autocomplete
                  key: Globals.apiKey,
                  language: 'es', // language of the results
                  //types: 'neighborhood'
                }}

                styles={{
                  textInputContainer: {
                    width: '100%'
                  },
                  description: {
                    fontWeight: 'bold'
                  },
                  predefinedPlacesDescription: {
                    color: '#1faadb'
                  }
                }}

                currentLocation={false} // Will add a 'Current location' button at the top of the predefined places list
                //currentLocationLabel="Ubicación actual"
                nearbyPlacesAPI='GooglePlacesSearch' // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
                GoogleReverseGeocodingQuery={{
                  // available options for GoogleReverseGeocoding API : https://developers.google.com/maps/documentation/geocoding/intro
                }}

                filterReverseGeocodingByTypes={['neighborhood', 'political']} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities
                
                debounce={200} // debounce the requests in ms. Set to 0 to remove debounce. By default 0ms.
                //renderRightButton={() => <Text>Custom text after the input</Text>}
            />
            <TextInput style={styles.inputBox} 
              underlineColorAndroid='rgba(0,0,0,0)'
              placeholder="Ubicación"
              placeholderTextColor="#ffffff"
              onChangeText={(locationText) => this.setState({locationText})}
              value={this.state.locationText}
            />
            <TouchableOpacity style={styles.button} onPress={this.validateLocation}> 
              <Text style={styles.buttonText} >Validar</Text>
            </TouchableOpacity>
            {this.state.locationTextValidated &&
              <View>
                <MapView
                  style={{width: 300, height: 300}}
                  initialRegion={{
                    latitude: this.state.geoLat,
                    longitude: this.state.geoLng,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                  }}
                >
                  <Marker
                    coordinate={{
                      latitude: -34.903198,
                      longitude: -56.184748,
                    }}
                  />   
                </MapView>
                
              </View>     
            }
        </View>
      );
  }
}

export default PublishSpaceStep2;

//() => {this.props.navigation.navigate('PublishSpaceStep3')}

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
    marginTop: 20,
    marginBottom: 5,
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
    color:'#ffffff'
  },
});