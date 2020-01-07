import React, {Component} from 'react';
import { StyleSheet,Text,View,ScrollView,Keyboard,Picker,TextInput,TouchableOpacity,Image,ToastAndroid} from 'react-native';
import { Header } from 'react-native-elements';

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

class PublishSpaceStep4 extends Component{
constructor(props){
    super(props);
    
}

render(){
    if (this.props.parentState.currentStep !== 4) { // Prop: The current step
        return null
    }
    return (
      
        <View style={styles.container}>
            <Text style={styles.titleText}>Datos de tu espacio - Paso 4</Text>

            <MyTextInput 
              placeholder = "Precio por hora"
              name="HourPrice" 
              type="text" 
              value={this.props.parentState.HourPrice.toString()}
              onChange={this.props.onChange}
            />
            <MyTextInput 
              placeholder = "Precio por día"
              name="DailyPrice" 
              type="text" 
              value={this.props.parentState.DailyPrice.toString()}
              onChange={this.props.onChange}
            />
            <MyTextInput 
              placeholder = "Precio por hora"
              name="WeeklyPrice" 
              type="text" 
              value={this.props.parentState.WeeklyPrice.toString()}
              onChange={this.props.onChange}
            />
            <MyTextInput 
              placeholder = "Precio por hora"
              name="MonthlyPrice" 
              type="text" 
              value={this.props.parentState.MonthlyPrice.toString()}
              onChange={this.props.onChange}
            />
            
        </View>
      );
  }
}

export default PublishSpaceStep4;

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

/*<TextInput style={styles.inputBox} 
              underlineColorAndroid='rgba(0,0,0,0)'
              placeholder="Precio por hora"
              placeholderTextColor="#ffffff"
              //onChangeText={this.handleChangeEmail}
            />
*/

/*<TextInput style={styles.inputBox} 
              underlineColorAndroid='rgba(0,0,0,0)'
              placeholder="Precio por día"
              placeholderTextColor="#ffffff"
              //onChangeText={this.handleChangePassword}
            />
*/

/*<TextInput style={styles.inputBox} 
              underlineColorAndroid='rgba(0,0,0,0)'
              placeholder="Precio por semana"
              placeholderTextColor="#ffffff"
              //onChangeText={this.handleChangePassword}
            />
*/

/*<TextInput style={styles.inputBox} 
              underlineColorAndroid='rgba(0,0,0,0)'
              placeholder="Precio por mes"
              placeholderTextColor="#ffffff"
              //onChangeText={this.handleChangePassword}
            />
*/