import React, {Component} from 'react'
import { StyleSheet, Text, View, ScrollView, Keyboard, TouchableOpacity} from 'react-native';
import { connect } from 'react-redux';

// This component will render the table with the values passed as parameters -props-
class ReservedPublicationsListScrollView extends Component {
    constructor(props) {
        super(props);

    }

render() {

    return(  
        <View style={styles.container}>       
            <View style={styles.spacesContainer}>
                <View style={styles.textView}>            
                    <Text style={styles.subTitleText}>{this.props.obj.TitlePublication}</Text>            
                    <>
                        {this.props.isPublisher ? <Text style={styles.infoText}>Mail cliente: {this.props.obj.MailCustomer}</Text> : null}
                    </>
                    <Text style={styles.infoText}>Personas: {this.props.obj.People}</Text>
                    <Text style={styles.infoText}>Fecha: {this.props.obj.DateFromString}</Text>
                    <>
                        {this.props.obj.PlanSelected == 'Hour' ? (<Text style={styles.infoText}>Desde {this.props.obj.HourFrom} a {this.props.obj.HourTo}hs</Text> ) : (<Text style={styles.infoText}>1 {this.props.obj.PlanSelected}</Text>)}
                    </>
                    <Text style={styles.infoText}>Monto: {this.props.obj.TotalPrice}</Text>     
                    <View style={styles.borderContainer}>
                        <Text style={styles.subTitleText}>Pago reserva</Text>
                        <Text style={styles.infoText}>{this.props.objReservationCustomerPayment.reservationPaymentStateText}</Text>               
                        <TouchableOpacity style={styles.button} /*onPress={()=>}*/> 
                            <Text style={styles.buttonText}>Detalles</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.borderContainer}>
                        <Text style={styles.subTitleText}>Pago comisión</Text>
                        <Text style={styles.infoText}>{this.props.objCommisionPayment.paymentStatusText}</Text>               
                        <TouchableOpacity style={styles.button} /*onPress={()=>}*/> 
                            <Text style={styles.buttonText}>Detalles</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.borderContainer}>
                        <Text style={styles.subTitleText}>Estado reserva</Text>
                        <Text style={styles.infoText}>{this.props.obj.StateDescription}</Text>                
                        <>
                        {this.props.obj.StateDescription === 'PENDING' || this.props.obj.StateDescription === 'RESERVED' ? (
                            <TouchableOpacity style={styles.button} /*onPress={()=> {this.props.navigate("ReservationPaymentDetails", {IdReservation: this.props.obj.IdReservation, StateDescription: this.props.obj.StateDescription})}}*/> 
                                <Text style={styles.buttonText}>Cancelar</Text>
                            </TouchableOpacity>
                            ) : ( 
                                <> 
                                {this.props.isPublisher && this.props.obj.StateDescription === 'PENDING' ? (
                                    <TouchableOpacity style={styles.button} /*onPress={()=>}*/>
                                        <Text style={styles.buttonText}>Confirmar</Text>
                                    </TouchableOpacity>                            
                                    ) : (null)
                                }
                                </>
                                )                           
                        }
                        </>        
                    </View>
                </View>
            </View>
        </View>
    )
    
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2196f3',
    alignItems: 'center',
    justifyContent: 'center',
  },
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

export default ReservedPublicationsListScrollView

/*<td></td>
                    <td>
                        {obj.StateDescription === 'PENDING' ? (<p>Reserva pendiente de confirmar</p>) : (
                            <a href="#" className = "col-md-12" onClick={() => props.triggerModal("PAYRESCUST", obj.IdReservation, objReservationCustomerPayment)}> <span><i className="col-md-1 fa fa-align-justify"></i></span> Detalles</a>
                        )}
                    </td> 
                    {isPublisher ? <td>{objCommisionPayment.paymentStatusText}</td> : null}
                    {isPublisher ? <td><a href="#" className = "col-md-12" onClick={() => props.triggerModal("PAYRESCOM", obj.IdReservation, objCommisionPayment)}> <span><i className="col-md-1 fa fa-align-justify"></i></span> Detalles</a></td> : null}
                    
                    <td>
                        <div>
                            {obj.StateDescription === 'PENDING' || obj.StateDescription === 'RESERVED' ? (
                                <div>
                                    <a href="#" onClick={() => {props.triggerModal("CANCEL", obj.IdReservation, obj.StateDescription)}}><span><i className="col-md-1 fa fa-times"></i></span>Cancelar</a> 
                                    {isPublisher && obj.StateDescription === 'PENDING' ? (
                                        <a href="#" onClick={() => {props.triggerModal("CONFIRM", obj.IdReservation, obj.StateDescription)}}><span><i className="col-md-1 fa fa-check"></i></span> Confirmar</a>                            
                                        ) : (null)}
                                </div>
                                ) :(null)
                            }
                            {obj.StateDescription === 'FINISHED' && !isPublisher && !obj.Reviewed ? (
                                <div>
                                    <a href="#" onClick={() => {props.triggerModal("RATE", obj.IdReservation, obj.StateDescription)}}><span><i className="col-md-1 fa fa-star"></i></span> Calificar</a> 
                                </div>
                                ) :(
                                    <div>
                                    {!isPublisher && obj.StateDescription == 'PENDING'  ? (
                                            <a href="#" onClick={() => {props.editReservation(obj.IdReservation)}}><span><i className="col-md-1 fa fa-pencil-alt"></i></span> Editar</a>                            
                                        ) : (null)}
                                    </div>
                                )
                            }
                        </div>
                    </td>
                </tr>*/