import React, {Component} from 'react';
import { StyleSheet, Text, View, ScrollView, ActivityIndicator, TextInput, TouchableOpacity, Dimensions} from 'react-native';
import { connect } from 'react-redux';
import { callAPI } from '../common/genericFunctions';

import translations from '../common/translations';

class ReserveSpaceSummary extends Component {
    constructor(props) {
        super(props);
        const { navigation } = this.props;
        const summaryObjectParams = navigation.getParam('summaryObject', 'default value');
        this.state = {
            reservationComment  : "",
            summaryObject       : summaryObjectParams,
            isLoading           : false,
        }
    }

    confirmReservationVP = (comment) => {
        var objApi = {}; var PlanSelected = "";
        switch (this.state.summaryObject.planChosen) {
            case "HourPrice": PlanSelected = "Hour"; break;
            case "DailyPrice": PlanSelected = "Day"; break;
            case "WeeklyPrice": PlanSelected = "Week"; break;
            case "MonthlyPrice": PlanSelected = "Month"; break;
        }
        var splittedDate = this.state.summaryObject.date.split('-')
        var dateFrom = new Date(splittedDate[2],splittedDate[1] - 1,splittedDate[0]);
        objApi.objToSend = {
            "AccessToken": this.props.tokenObj.accesToken,
            "VOReservation": {
                "IdPublication": this.state.summaryObject.pubID,
                "MailCustomer": this.props.userData.Mail,
                "PlanSelected": PlanSelected,
                "ReservedQuantity": this.state.summaryObject.reservedQuantity,
                "DateFrom": dateFrom,
                "HourFrom": this.state.summaryObject.hourFromSelect,
                "HourTo": this.state.summaryObject.hourToSelect,
                "People": this.state.summaryObject.quantityPeople,
                "Comment": comment,
                "TotalPrice": this.state.summaryObject.totalPrice
            }
        }

        objApi.fetchUrl = 'api/reservation';
        objApi.method = "POST";
        objApi.successMSG = {
            SUCC_RESERVATIONCREATED: "",
        };
        objApi.functionAfterSuccess = "confirmReservationVP";
        objApi.functionAfterError = "confirmReservationVP";
        objApi.errorMSG = {}
        if(this.state.isLoading == false) this.setState({ isLoading: true });
        callAPI(objApi, this);
    }

    triggerScreen(objTrigger){
        var screenConfigObj = {};   
        screenConfigObj ={
            title: translations[this.props.systemLanguage].messages['reservation_modal_title'], mainText: translations[this.props.systemLanguage].messages['reservation_modal_mainText'] ,
            textboxDisplay: false, cancelAvailable: true, cancelText : translations[this.props.systemLanguage].messages['reservation_modal_ok'], mode : objTrigger.mode, saveFunction : "reservationSuccess"
        };
        this.props.navigation.navigate('ReservationReqInfo', {screenConfig: screenConfigObj});          
    }

    render() {
        const { systemLanguage } = this.props;
        return (
            <>
            {this.state.isLoading == false ? (
            <View style={styles.container}>
                <Text style={styles.titleText}>{translations[systemLanguage].messages['summary_w']}</Text>
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
                            <Text style={styles.subTitleText}>{translations[systemLanguage].messages['ammount_w']} {this.state.summaryObject.planChosenText} </Text>
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
                            <Text style={styles.subTitleText}>{translations[systemLanguage].messages['people_w']} </Text>
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
                                    <Text style={styles.subTitleText}>{translations[systemLanguage].messages['hour_w']} </Text>
                                    <TextInput style={styles.inputBox} 
                                        underlineColorAndroid='rgba(0,0,0,0)'
                                        placeholder='Tipo de reserva'
                                        placeholderTextColor="#ffffff"
                                        value={'Desde '+this.state.summaryObject.hourFromSelect+ ' hasta '+this.state.summaryObject.hourToSelect+' hrs'}
                                        editable = {false}
                                    />
                                </View>
                                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                <Text style={styles.subTitleText}>{translations[systemLanguage].messages['totalHours_w']} </Text>
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
                            <Text style={styles.subTitleText}>{translations[systemLanguage].messages['totalAmount_w']} </Text>
                            <TextInput style={styles.inputBox} 
                                underlineColorAndroid='rgba(0,0,0,0)'
                                placeholder='Tipo de reserva'
                                placeholderTextColor="#ffffff"
                                value={this.state.summaryObject.totalPrice.toString()}
                                editable = {false}
                            />    
                        </View>                                        
                        <Text style={styles.subTitleText}>{translations[systemLanguage].messages['comment_w']} ({translations[systemLanguage].messages['optional_w']}) </Text>
                        <TextInput style={styles.inputBox3}
                            multiline = {true}
                            numberOfLines = {4}
                            underlineColorAndroid='rgba(0,0,0,0)'
                            onChangeText= {(reservationComment) => this.setState({reservationComment})}
                            value={this.state.reservationComment}
                        />
                        <Text style={styles.infoText}>Atencion! Este valor esta pendiente de confirmar.{'\n'}
                                Va a recibir un correo con los detalles finales y la confirmacion dentro de las proximas 48hrs.</Text>
                        <View style={{flexDirection: 'row'}}> 
                            <TouchableOpacity style={styles.button} onPress={() => {this.props.navigation.goBack()}}> 
                                <Text style={styles.buttonText}>{translations[systemLanguage].messages['cancel_w']}</Text>
                            </TouchableOpacity>                     
                            <TouchableOpacity style={styles.button} onPress={() => this.confirmReservationVP(this.state.reservationComment)}> 
                                <Text style={styles.buttonText}>{translations[systemLanguage].messages['accept_w']}</Text>
                            </TouchableOpacity>
                        </View>        
                    </View>
                </ScrollView>
                
            </View>) : (<ActivityIndicator
                        animating = {this.state.isLoading}
                        color = '#bc2b78'
                        size = "large"
                        style = {styles.activityIndicator}
                        />
                       )}  
        </>     
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
      marginTop: 40,
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
    activityIndicator: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#2196f3',
        height: 80,
    },
    
});

    const mapStateToProps = (state) => {
        return {
            tokenObj: state.loginData.tokenObj,
            userData: state.loginData.userData,
            systemLanguage: state.loginData.systemLanguage
        }
    }

export default connect(mapStateToProps)(ReserveSpaceSummary);