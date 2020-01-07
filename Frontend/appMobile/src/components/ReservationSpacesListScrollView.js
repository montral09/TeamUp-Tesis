import React, {Component} from 'react';
import {View,Text,Image,StyleSheet,TouchableOpacity,ToastAndroid} from 'react-native';
import { Ionicons } from "@expo/vector-icons";

class ReservationSpacesListScrollView extends Component {

    render (){
        return (
            <View style={styles.spacesContainer}>
                <View style={styles.textView}>
                    <Text style={{color: 'white', fontSize: 20}}>{this.props.parentData.Title}</Text>
                    <Text style={{color: 'white', fontSize: 14, paddingHorizontal: 5}}>Fecha: {this.props.parentData.Date}</Text>
                    <>
                        {this.props.parentData.PlanSelected == 'Hour' ? (<Text style={styles.infoText}>Desde {this.props.parentData.HourFrom} a {this.props.parentData.HourTo}hs</Text> ) : (<Text style={styles.infoText}>1 {this.props.parentData.PlanSelected}</Text>)}
                    </>
                    <Text style={{color: 'white', fontSize: 14, paddingHorizontal: 5}}>Personas: {this.props.parentData.People}</Text>
                    <Text style={{color: 'white', fontSize: 14, paddingHorizontal: 5}}>Monto: {this.props.parentData.TotalPrice}</Text>  
                    <View style={styles.borderContainer}>
                        <Text style={styles.subTitleText}>Pago reserva</Text>
                        <Text style={styles.infoText}>{this.props.objReservationCustomerPayment.reservationPaymentStateText}</Text>               
                        <TouchableOpacity style={styles.button} /*onPress={()=>}*/> 
                            <Text style={styles.buttonText}>Detalles</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.borderContainer}>
                        <Text style={styles.subTitleText}>Estado reserva</Text>
                        <Text style={styles.infoText}>{this.props.parentData.StateDescription}</Text>                
                        <>
                        {this.props.parentData.StateDescription === 'PENDING' || this.props.parentData.StateDescription === 'RESERVED' ? (
                            <TouchableOpacity style={styles.button} /*onPress={()=>}*/>
                                <Text style={styles.buttonText}>Cancelar</Text>
                            </TouchableOpacity>
                            ) : ( null )
                        }
                        {this.props.parentData.StateDescription === 'FINISHED' && !this.props.parentData.Reviewed ? (
                            <TouchableOpacity style={styles.button} /*onPress={()=>}*/>
                                <Text style={styles.buttonText}>Calificar</Text>
                            </TouchableOpacity>
                            ) :(
                                <>
                                {this.props.parentData.StateDescription == 'PENDING'  ? (
                                    <TouchableOpacity style={styles.button} /*onPress={()=>}*/>
                                        <Text style={styles.buttonText}>Editar</Text>
                                    </TouchableOpacity>                            
                                    ) : (null)}
                                </>
                            )
                        }
                        </>        
                    </View>
                </View>       
            </View>    
        );
    }
}

export default ReservationSpacesListScrollView

const styles = StyleSheet.create({
    spacesContainer:{
        width: 360,
        borderWidth: 0.5,
        borderColor: '#0069c0',
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.3)',
        marginLeft: 20,
        marginRight: 20,
        marginBottom: 20,
        alignItems: 'center'
    },
    textView:{
        paddingTop: 10,
        paddingBottom: 10,
        color: 'white',
        alignItems: 'center',
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
    borderContainer: {
        marginTop: 10,
        paddingHorizontal: 10,
        borderColor: 'white',
        borderRadius: 20,
        borderWidth: 2,
        alignItems: 'center',
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
        paddingHorizontal: 5,
    },
    buttonText: {
        fontSize:16,
        fontWeight:'500',
        color:'#ffffff'
    },
});