import React, {Component} from 'react';
import { StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { connect } from 'react-redux';
import translations from '../common/translations';

// This component will render the table with the values passed as parameters -props-
class ReservedPublicationsListScrollView extends Component {
    constructor(props) {
        super(props);
    }

render() {
    const { systemLanguage } = this.props;
    return(  
        <View style={styles.container}>       
            <View style={styles.spacesContainer}>
                <View style={styles.textView}>            
                    <Text style={styles.subTitleText}>{this.props.obj.TitlePublication}</Text>  
                    <Text style={styles.infoText}>#Ref: {this.props.obj.IdReservation}</Text>          
                    <Text style={styles.infoText}>{translations[systemLanguage].messages['email_w']}: {this.props.obj.MailCustomer}</Text>
                    <Text style={styles.infoText}>{translations[systemLanguage].messages['people_w']}: {this.props.obj.People}</Text>
                    <Text style={styles.infoText}>{translations[systemLanguage].messages['dateFrom_w']}: {this.props.obj.DateFromString}</Text>
                    <Text style={styles.infoText}>{translations[systemLanguage].messages['dateTo_w']}: {this.props.obj.DateToString}</Text>
                    <>
                        {this.props.obj.PlanSelected == 'Hour' ? (<Text style={styles.infoText}>{translations[systemLanguage].messages['from_w']} {this.props.obj.HourFrom} {translations[systemLanguage].messages['to_w']} {this.props.obj.HourTo}hs</Text> ) : (this.props.obj.ReservedQuantity == 1 ? (<Text style={styles.infoText}>{this.props.obj.ReservedQuantity+' '+ translations[systemLanguage].messages['planSelected_'+this.props.obj.PlanSelected]}</Text>):(<Text style={styles.infoText}>{this.props.obj.ReservedQuantity+' '+ translations[systemLanguage].messages['planSelected_'+this.props.obj.PlanSelected+'s']}</Text>))}
                    </>
                    <Text style={styles.infoText}>{translations[systemLanguage].messages['amount_w']}: {this.props.obj.TotalPrice}</Text>     
                    <View style={styles.borderContainer}>
                        <Text style={styles.subTitleText}>{translations[systemLanguage].messages['payment_w']}</Text>
                        <Text style={styles.infoText}>{translations[systemLanguage].messages['payState_'+this.props.objReservationCustomerPayment.reservationPaymentStateText.replace(/\s/g,'')]}</Text>               
                        <View style={{flexDirection: 'row'}}>
                            <TouchableOpacity style={styles.button} onPress={()=> {this.props.triggerScreen("PAYRESCUST", this.props.obj.IdReservation, this.props.objReservationCustomerPayment)}}> 
                                <Text style={styles.buttonText}>{translations[systemLanguage].messages['details_w']}</Text>
                            </TouchableOpacity>
                            <View style={{marginTop: 22}}>
                              {this.props.obj.Comment != '' ? (
                                <TouchableOpacity onPress={()=> {this.props.triggerScreen("COMMENT", this.props.obj.IdReservation, this.props.obj.Comment)}}> 
                                    <Ionicons name="ios-text"
                                      color="#fff"
                                      size={20}
                                    />
                                </TouchableOpacity>
                                ) : (null)
                              }
                            </View>
                        </View>
                    </View>
                    <View style={styles.borderContainer}>
                        <Text style={styles.subTitleText}>{translations[systemLanguage].messages['comission_w']}</Text>
                        <Text style={styles.infoText}>{this.props.objCommissionPayment.paymentStatusText}</Text>               
                        <TouchableOpacity style={styles.button} onPress={()=> {this.props.triggerScreen("PAYRESCOM", this.props.obj.IdReservation, this.props.objCommissionPayment)}}> 
                            <Text style={styles.buttonText}>{translations[systemLanguage].messages['details_w']}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.borderContainer}>
                        <Text style={styles.subTitleText}>{translations[systemLanguage].messages['status_w']}</Text>
                        <Text style={styles.infoText}>{translations[systemLanguage].messages['resState_'+this.props.obj.StateDescription.replace(/\s/g,'')]}</Text>                      
                    </View>
                    <View style={{flexDirection:'row'}}>
                      {this.props.obj.StateDescription === 'PENDING' || this.props.obj.StateDescription === 'RESERVED' ? (
                          <> 
                          <TouchableOpacity style={styles.button} onPress={()=> {this.props.triggerScreen("CANCEL", this.props.obj.IdReservation, this.props.obj.StateDescription)}}> 
                              <Text style={styles.buttonText}>{translations[systemLanguage].messages['cancel_w']}</Text>
                          </TouchableOpacity>
                          {this.props.obj.StateDescription === 'PENDING' ? (
                              <TouchableOpacity style={styles.button} onPress={()=> {this.props.triggerScreen("CONFIRM", this.props.obj.IdReservation, this.props.obj.StateDescription)}}>
                                  <Text style={styles.buttonText}>{translations[systemLanguage].messages['confirm_w']}</Text>
                              </TouchableOpacity>                            
                              ) : (null)
                          }
                          </>
                      ) : (null)                           
                      }
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
    marginHorizontal: 3,
  },
  buttonText: {
    fontSize:16,
    fontWeight:'500',
    color:'#ffffff'
  },
});

const mapStateToProps = (state) => {
    return {
        systemLanguage: state.loginData.systemLanguage
    }
}

export default connect(mapStateToProps)(ReservedPublicationsListScrollView)