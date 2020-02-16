import React, {Component} from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Linking, TextInput, Dimensions} from 'react-native';
import { callAPI } from '../common/genericFunctions';

class ReservationEditResCustPay extends Component {
    constructor(props) {
        super(props);
        const { navigation } = this.props;
        const objPaymentDetailsParam = navigation.getParam('auxParam', 'default value');
        this.state = {
            modal: false,
            objPaymentDetails: objPaymentDetailsParam,
            paymentComment : "",
            isLoading : false,
            buttonIsDisabled: false
        };

    }


    render() {
        return (
            <View style={styles.container}>
                <View style={{alignItems: 'flex-start', marginLeft: 15}}>
                    <Text style={styles.titleText}>Cambiar datos de reserva</Text>
                    <View style={{flexDirection:'row', alignItems: 'center'}}>
                        <View style={{flex:1}}>
                            <Text style={styles.infoText}>Fecha de pago </Text>
                        </View>
                        <View style={{flex:1}}>
                            <TextInput style={styles.inputBox} 
                                underlineColorAndroid='rgba(0,0,0,0)'
                                placeholder='Fecha de pago'
                                placeholderTextColor="#ffffff"
                                value={this.state.objPaymentDetails.reservationpaymentDate == null ? "Pendiente" : this.state.objPaymentDetails.reservationpaymentDate.toString()}
                                editable = {false}
                            />
                        </View>
                    </View>
                    <View style={{flexDirection:'row', alignItems: 'center'}}>
                        <View style={{flex:1}}>
                            <Text style={styles.infoText}>Personas </Text>
                        </View>
                        <View style={{flex:1}}>
                            <TextInput style={styles.inputBox} 
                                underlineColorAndroid='rgba(0,0,0,0)'
                                placeholder='Estatus del pago'
                                placeholderTextColor="#ffffff"
                                value={this.state.objPaymentDetails.reservationPaymentStateText}
                                editable = {false}
                            />
                        </View>
                    </View>
                    <View style={{flexDirection:'row', alignItems: 'center'}}>
                        <View style={{flex:1}}>
                            <Text style={styles.infoText}>Monto </Text>
                        </View>
                        <View style={{flex:1}}>
                            <TextInput style={styles.inputBox} 
                                underlineColorAndroid='rgba(0,0,0,0)'
                                placeholder='Monto'
                                placeholderTextColor="#ffffff"
                                value={this.state.objPaymentDetails.reservationPaymentAmmount.toString()}
                                editable = {false}
                            />
                        </View>
                    </View>  
                </View>
                <View style={{flexDirection: 'row'}}>
                    <TouchableOpacity style={styles.button} onPress={()=> {this.props.navigation.goBack()}} disabled={this.state.buttonIsDisabled}> 
                        <Text style={styles.buttonText}>Cancelar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={()=> {this.save}} disabled={this.state.buttonIsDisabled}> 
                        <Text style={styles.buttonText}>Guardar</Text>
                    </TouchableOpacity>
                    }
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
    justifyContent: 'center',
  },
  titleText:{
    fontSize: 32, 
    fontWeight: 'bold',
    color: "#FFF",
    marginTop: 20,
    marginBottom: 5,
  },
  subTitleText:{
    fontSize: 20, 
    fontWeight: 'bold',
    color: "#FFF",
    marginBottom: 5,
  },
  infoText:{
    color: "#FFF",
  },
  infoText2:{
    color: "#FFF",
    marginTop: 10,
  },
  inputBox: {
    width:180,
    backgroundColor:'rgba(255,255,255,0.3)',
    borderRadius: 25,
    paddingHorizontal: 16,
    fontSize: 16,
    color:'#ffffff',
    marginVertical: 10
  },
  inputBox2: {
    width: Dimensions.get('window').width - 20,
    backgroundColor:'rgba(255,255,255,0.3)',
    borderRadius: 25,
    paddingHorizontal: 16,
    fontSize: 16,
    color:'#ffffff',
    marginVertical: 10
  },
  button: {
    width:100,
    height:30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:'#0069c0',
    borderRadius: 15,
    marginVertical: 20,
    elevation: 3,
    marginHorizontal: 10,
  },
  buttonText: {
    fontSize:16,
    fontWeight:'500',
    color:'#ffffff'
  },
});

export default ReservationEditResCustPay;