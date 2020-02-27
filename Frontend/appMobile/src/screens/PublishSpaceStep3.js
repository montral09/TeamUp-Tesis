import React, {Component} from 'react';
import { StyleSheet,Text,View,ScrollView,TextInput,TouchableOpacity,Button,Image} from 'react-native';
import { Header } from 'react-native-elements';
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from "expo-permissions";
import Constants from 'expo-constants';

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

class PublishSpaceStep3 extends Component{
  constructor(props){
    super(props);
    this.state = {
      image: null,
      ImageSource: null,
      youtubeURL: this.props.parentState.youtubeURL,
      matchYoutubeSuccess : false,
      matchYoutubeError : false,
    }
  }

  componentDidMount() {
    this.getPermissionAsync();
  }

  getPermissionAsync = async () => {
    if (Constants.platform.ios) {
        const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions to make this work!');
        }
    }
  }

  pickImage = async () => {
    try{ 
      const { status } = await Permissions.askAsync(Permissions.CAMERA, Permissions.CAMERA_ROLL)
      if (status === 'granted') {
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: true,
          aspect: [4, 3],
          base64: true,
        });
        
        if (!result.cancelled) {
          this.setState({ image: result.uri });
          this.props.onSelectionsChangeImages(result.base64,'jpeg')
        }
      }
    }catch (err) {
      
    }
  };
  
  render(){
    if (this.props.parentState.currentStep !== 3) { // Prop: The current step
        return null
    }
    const { photo } = this.state
    return (
        <View style={styles.container}>
            <Text style={styles.titleText}>Datos de tu espacio - Paso 3</Text>
            <View>
              <Image source={{ uri: this.state.image }} style={{ width: 300, height: 300 }}></Image>
            </View>
            <TouchableOpacity onPress={this.pickImage}>
              <Ionicons name="md-camera" size={32} color="#D8D9DB"></Ionicons>
            </TouchableOpacity>
            <MyTextInput 
              placeholder = "Youtube URL (opcional)"
              name="youtubeURL" 
              type="text" 
              value={this.props.parentState.youtubeURL} 
              onChange={this.props.onChange}
            />
        </View>
      );
  }
}

export default PublishSpaceStep3;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2196f3',
    alignItems: 'center',
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