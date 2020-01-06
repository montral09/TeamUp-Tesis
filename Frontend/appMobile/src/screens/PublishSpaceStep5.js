import React, {Component} from 'react';
import { StyleSheet,Text,View,ScrollView,Keyboard,Picker,TextInput,TouchableOpacity,Image,ToastAndroid} from 'react-native';

class PublishSpaceStep5 extends Component{
constructor(props){
    super(props);
    
}

render(){
    if (this.props.parentState.currentStep !== 5) { // Prop: The current step
        return null
    }
    return (
      
        <View style={styles.container}>
            <Text style={styles.titleText}>Datos de tu espacio - Paso 5</Text>
            
            
            
            
        </View>
      );
  }
}

export default PublishSpaceStep5;

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

/*<TouchableOpacity style={styles.button} onPress={() => {this.props.navigation.navigate('Home')}}> 
                    <Text style={styles.buttonText}>Finalizar</Text>
            </TouchableOpacity>*/