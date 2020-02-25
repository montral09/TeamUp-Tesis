import React, {Component} from 'react';
import {View,Text,Image,StyleSheet,TouchableOpacity} from 'react-native';
import { connect } from 'react-redux';
import { Ionicons } from "@expo/vector-icons";
import translations from '../common/translations';

class ReservationSpacesListScrollView extends Component {

    render (){
        const { systemLanguage } = this.props;
        return (
            <View style={styles.spacesContainer}>
                <View style={styles.textView}>
                    <Text style={{color: 'white', fontSize: 20}}>{this.props.parentData.Title}</Text>
                    <Text style={{color: 'white', fontSize: 14, paddingHorizontal: 5}}>#Ref: {this.props.parentData.IdReservation}</Text>    
                    <Text style={{color: 'white', fontSize: 14, paddingHorizontal: 5}}>{translations[systemLanguage].messages['date_w']}: {this.props.parentData.Date}</Text>
                    <>
                        {this.props.parentData.PlanSelected == 'Hour' ? (<Text style={styles.infoText}>{translations[systemLanguage].messages['from_w']} {this.props.parentData.HourFrom} {translations[systemLanguage].messages['to_w']} {this.props.parentData.HourTo}hs</Text> ) : (this.props.parentData.ReservedQuantity == 1 ? (<Text style={styles.infoText}>{this.props.parentData.ReservedQuantity+' '+ translations[systemLanguage].messages['planSelected_'+this.props.parentData.PlanSelected]}</Text>):(<Text style={styles.infoText}>{this.props.parentData.ReservedQuantity+' '+ translations[systemLanguage].messages['planSelected_'+this.props.parentData.PlanSelected+'s']}</Text>))}
                    </>
                    <Text style={{color: 'white', fontSize: 14, paddingHorizontal: 5}}>{translations[systemLanguage].messages['people_w']}: {this.props.parentData.People}</Text>
                    <Text style={{color: 'white', fontSize: 14, paddingHorizontal: 5}}>{translations[systemLanguage].messages['amount_w']}: {this.props.parentData.TotalPrice}</Text>  
                    <View style={styles.borderContainer}>
                        <Text style={styles.subTitleText}>{translations[systemLanguage].messages['payment_w']} {translations[systemLanguage].messages['reservation_w']}</Text>
                        <Text style={styles.infoText}>{translations[systemLanguage].messages['payState_'+ this.props.objReservationCustomerPayment.reservationPaymentStateText.replace(/\s/g,'')]}</Text>               
                        {this.props.parentData.StateDescription === 'PENDING' ? (
                            <Text style={styles.infoText}>{translations[systemLanguage].messages['myReservedSpacesList_reservedSpacesTable_pendingRes']}</Text>
                        ):(
                            <TouchableOpacity style={styles.button} onPress={()=> this.props.triggerScreen("PAYCUSTRES", this.props.parentData.IdReservation, this.props.objReservationCustomerPayment)}>
                                <Text style={styles.buttonText}>{translations[systemLanguage].messages['details_w']}</Text>
                            </TouchableOpacity>
                          )
                        }
                    </View>
                    <View style={styles.borderContainer}>
                        <Text style={styles.subTitleText}>{translations[systemLanguage].messages['status_w']}</Text>
                        <Text style={styles.infoText}>{translations[systemLanguage].messages['resState_' + this.props.parentData.StateDescription.replace(/\s/g,'')]}</Text>                        
                    </View>
                    <View style={{flexDirection:'row'}}>
                        {this.props.parentData.StateDescription === 'PENDING' || this.props.parentData.StateDescription === 'RESERVED' ? (
                            <TouchableOpacity style={styles.button} onPress={()=> this.props.triggerScreen("CANCEL", this.props.parentData.IdReservation, this.props.parentData.StateDescription)}>
                                <Text style={styles.buttonText}>{translations[systemLanguage].messages['cancel_w']}</Text>
                            </TouchableOpacity>
                            ) : ( null )
                        }
                        {this.props.parentData.StateDescription === 'FINISHED' && !this.props.parentData.Reviewed ? (
                            <TouchableOpacity style={styles.button} onPress={()=> this.props.triggerScreen("RATE", this.props.parentData.IdReservation, this.props.parentData.StateDescription)}>
                                <Text style={styles.buttonText}>{translations[systemLanguage].messages['rate_w']}</Text>
                            </TouchableOpacity>
                            ) :(
                                <>
                                {this.props.parentData.StateDescription == 'PENDING'  ? (
                                    <TouchableOpacity style={styles.button} onPress={()=> this.props.triggerScreen("EDIT", this.props.parentData.IdReservation, this.props.objReservationCustomerPayment)}>
                                        <Text style={styles.buttonText}>{translations[systemLanguage].messages['edit_w']}</Text>
                                    </TouchableOpacity>                            
                                    ) : (null)}
                                </>
                            )
                        }
                    </View>
                </View>       
            </View>    
        );
    }
}

const mapStateToProps = (state) => {
    return {
        systemLanguage: state.loginData.systemLanguage
    }
}

export default connect(mapStateToProps)(ReservationSpacesListScrollView)

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
        marginHorizontal: 3,
    },
    buttonText: {
        fontSize:16,
        fontWeight:'500',
        color:'#ffffff'
    },
});