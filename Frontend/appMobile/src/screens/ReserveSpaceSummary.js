import React, {Component} from 'react';
import { StyleSheet, Text, View, ScrollView, Picker, TextInput, TouchableOpacity, Dimensions} from 'react-native';
import { connect } from 'react-redux';

import translations from '../common/translations';

class ReserveSpaceSummary extends Component {
    constructor(props) {
        super(props);
        const { navigation } = this.props;
        const summaryObjectParams = navigation.getParam('summaryObject', 'default value');
        this.state = {
            reservationComment  : "",
            summaryObject       : summaryObjectParams,
        }
    }

    render() {
        const { systemLanguage } = this.props;

        return (
            <View style={styles.container}>
                <Text style={styles.titleText}>Resumen</Text>
                <ScrollView>
                    <View style={{alignItems: 'flex-start', marginLeft: 15}}>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <Text style={styles.subTitleText}>Tipo de reserva </Text>
                            <TextInput style={styles.inputBox} 
                                underlineColorAndroid='rgba(0,0,0,0)'
                                placeholder='Tipo de reserva'
                                placeholderTextColor="#ffffff"
                                value={this.state.summaryObject.planChosenText}
                                editable = {false}
                            />
                        </View>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <Text style={styles.subTitleText}>Valor {this.state.summaryObject.planChosenText} </Text>
                            <TextInput style={styles.inputBox} 
                                underlineColorAndroid='rgba(0,0,0,0)'
                                placeholder='Valor'
                                placeholderTextColor="#ffffff"
                                value={this.state.summaryObject.planValue.toString()}
                                editable = {false}
                            />
                        </View>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <Text style={styles.subTitleText}>Fecha de reserva </Text>
                            <TextInput style={styles.inputBox} 
                                underlineColorAndroid='rgba(0,0,0,0)'
                                placeholder='Tipo de reserva'
                                placeholderTextColor="#ffffff"
                                value={this.state.summaryObject.date}
                                editable = {false}
                            />
                        </View>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <Text style={styles.subTitleText}>Cantidad de personas </Text>
                            <TextInput style={styles.inputBox2} 
                                underlineColorAndroid='rgba(0,0,0,0)'
                                placeholder='Tipo de reserva'
                                placeholderTextColor="#ffffff"
                                value={this.state.summaryObject.quantityPeople.toString()}
                                editable = {false}
                            />
                        </View>
                        {this.state.summaryObject.planChosen == "HourPrice" ? (
                        <>
                            <View>
                                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                    <Text style={styles.subTitleText}>Hora de reserva </Text>
                                    <TextInput style={styles.inputBox} 
                                        underlineColorAndroid='rgba(0,0,0,0)'
                                        placeholder='Tipo de reserva'
                                        placeholderTextColor="#ffffff"
                                        value={'Desde '+this.state.summaryObject.hourFromSelect+ ' hasta '+this.state.summaryObject.hourToSelect+' hrs'}
                                        editable = {false}
                                    />
                                </View>
                                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                <Text style={styles.subTitleText}>Total horas </Text>
                                    <TextInput style={styles.inputBox2} 
                                        underlineColorAndroid='rgba(0,0,0,0)'
                                        placeholder='Tipo de reserva'
                                        placeholderTextColor="#ffffff"
                                        value={(this.state.summaryObject.hourToSelect-this.state.summaryObject.hourFromSelect).toString()}
                                        editable = {false}
                                    />
                                </View>
                            </View>
                        </>
                        ) : (null)}
                        
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <Text style={styles.subTitleText}>Precio final </Text>
                            <TextInput style={styles.inputBox} 
                                underlineColorAndroid='rgba(0,0,0,0)'
                                placeholder='Tipo de reserva'
                                placeholderTextColor="#ffffff"
                                value={this.state.summaryObject.totalPrice.toString()}
                                editable = {false}
                            />    
                        </View>                                        
                        <Text style={styles.subTitleText}>Comentario (opcional) </Text>
                        <TextInput style={styles.inputBox3}
                            multiline = {true}
                            numberOfLines = {4}
                            underlineColorAndroid='rgba(0,0,0,0)'
                            onChangeText={this.onChange} 
                            value={this.state.reservationComment || ""}
                        />
                        <Text style={styles.infoText}>Atencion! Este valor esta pendiente de confirmar.{'\n'}
                                Va a recibir un correo con los detalles finales y la confirmacion dentro de las proximas 48hrs.</Text>
                    </View>
                </ScrollView>
                <View style={{flexDirection: 'row'}}> 
                    <TouchableOpacity style={styles.button} onPress={() => {this.props.navigation.goBack()}}> 
                        <Text style={styles.buttonText}>Cancelar</Text>
                    </TouchableOpacity>                     
                    <TouchableOpacity style={styles.button} /*onPress={() => this.props.increaseQuantityPeople()}*/> 
                        <Text style={styles.buttonText}>Finalizar</Text>
                    </TouchableOpacity>
                </View>
            </View>                    
        )}
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
    inputBox: {
        width:200,
        backgroundColor:'rgba(255,255,255,0.3)',
        paddingHorizontal: 16,
        fontSize: 16,
        color:'#ffffff',
        marginVertical: 10
    },
    inputBox2: {
        width:50,
        backgroundColor:'rgba(255,255,255,0.3)',
        paddingHorizontal: 16,
        fontSize: 16,
        color:'#ffffff',
        marginVertical: 10
    },
    inputBox3: {
        width: Dimensions.get('window').width - 20,
        backgroundColor:'rgba(255,255,255,0.3)',
        paddingHorizontal: 16,
        fontSize: 16,
        color:'#ffffff',
        marginVertical: 10
    },
    button: {
      width: 130,  
      height:30,
      borderRadius: 25,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor:'#0069c0',
      borderRadius: 15,
      marginVertical: 20,
      elevation: 3,
      marginHorizontal: 10,
    },
    button2: {
      width:30,
      height: 30,
      borderRadius: 25,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#0069c0',
      borderRadius: 15,
      marginVertical: 10,
      marginHorizontal: 5,
      elevation: 3,
    },
    buttonText: {
      fontSize:16,
      fontWeight:'500',
      color:'#ffffff'
    },
    pickerBox: {
        width:150,
        backgroundColor:'rgba(255,255,255,0.3)',
        color:'#ffffff',
        marginVertical: 10,
    },
    pickerBox2: {
        width:50,
        backgroundColor:'rgba(255,255,255,0.3)',
        color:'#ffffff',
        marginVertical: 10,
    },
    
});

    const mapStateToProps = (state) => {
        return {
            systemLanguage: state.loginData.systemLanguage
        }
    }

export default connect(mapStateToProps)(ReserveSpaceSummary);