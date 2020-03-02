import React, {Component} from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, ActivityIndicator, Picker} from 'react-native';
import { connect } from 'react-redux';
import { callAPI } from '../common/genericFunctions';
import translations from '../common/translations';
import DatePicker from '../components/datePicker';

class ReservationEditResCustPay extends Component {
    constructor(props) {
        super(props);
        const { navigation } = this.props;
        const resDataParam = navigation.getParam('auxParam', 'default value');
        var dateConverted = this.splitDate(resDataParam.DateFromString)
        var dateFormated = new Date(dateConverted[2],parseInt(dateConverted[1])-1, dateConverted[0])
        this.state = {
            modal: false,
            resData: resDataParam,
            resDataChanged: resDataParam,
            dateFrom: dateFormated,
            hoursAvailable: ["00", '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13'
                            , '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'],
            pricePlanChosen: this.getPricePlanChosen(resDataParam),
            isLoading : false,
            buttonIsDisabled: false
        };

    }

    splitDate (date) {      
        return  date.split('/')
    }

    getPricePlanChosen(resData) {   
        var price;
        switch (resData.PlanSelected) {
            case "Hour" : price = resData.HourPrice; break;
            case "Day" : price = resData.DailyPrice; break;
            case "Week" : price = resData.WeeklyPrice; break;
            case "Month" : price = resData.MonthlyPrice; break;
        }
        return price;
    }

    calculatePrice = () => {
        var tmpHfs = 0;
        var tmpHts = 1;
        var totalPrice = 0;
        if (this.state.resData.PlanSelected === 'Hour') {
            tmpHfs = this.state.resDataChanged.HourFrom; 
            tmpHts = this.state.resDataChanged.HourTo == 0 ? 24 : this.state.resDataChanged.HourTo; 
            totalPrice = (parseInt(tmpHts-tmpHfs) * parseInt(this.state.pricePlanChosen));            
        }else{
            totalPrice = parseInt(this.state.pricePlanChosen) * parseInt(this.state.resDataChanged.ReservedQuantity);            
        }
        if(this.state.resData.IndividualRent == true && this.state.resDataChanged.People != null){
            totalPrice = totalPrice * parseInt(this.state.resDataChanged.People);
        }        

        this.setState({
            resDataChanged : {
                ...this.state.resDataChanged,                
                TotalPrice : totalPrice
            }
        });
    }

    confirmEditReservationMRSL = () => {
        this.setState({isLoading: true})
        let {IdReservation, HourFrom, HourTo, TotalPrice, People, ReservedQuantity} = this.state.resDataChanged;
        var objApi = {};
        objApi.objToSend = {
            AccessToken: this.props.tokenObj.accesToken,
            Mail: this.props.userData.Mail,
            IdReservation: IdReservation,
            DateFrom: this.convertDate(this.state.dateFrom),
            HourFrom: HourFrom,
            HourTo: HourTo,
            TotalPrice: TotalPrice,
            People : People,
            ReservedQuantity : ReservedQuantity
        }
        objApi.fetchUrl = "api/reservationCustomer";
        objApi.method = "PUT";
        objApi.successMSG = {
            SUCC_RESERVATIONUPDATED : translations[this.props.systemLanguage].messages['SUCC_RESERVATIONUPDATED1'],
        };
        objApi.functionAfterSuccess = "confirmEditReservationMRSL";
        objApi.functionAfterError = "confirmEditReservationMRSL";
        objApi.errorMSG = {}
        callAPI(objApi, this);
    }

    convertDate(date) {
        var today = new Date(date);
        var dd = today.getDate();
        var mm = today.getMonth() + 1; //January is 0!

        var yyyy = today.getFullYear();
        if (dd < 10) {
            dd = '0' + dd;
        }
        if (mm < 10) {
            mm = '0' + mm;
        }
        var dateConv = yyyy + "-" + mm + '-' + dd;
        return dateConv;
    }

    increaseQuantityPlan() {
        this.setState({
            resDataChanged: {
              ...this.state.resDataChanged,
              ReservedQuantity : parseInt(this.state.resDataChanged.ReservedQuantity) + 1
            }
          }, () => {this.calculatePrice()})
    }

    decreaseQuantityPlan() {
        if (parseInt(this.state.resDataChanged.ReservedQuantity) > 1) {
            this.setState({
                resDataChanged: {
                ...this.state.resDataChanged,
                ReservedQuantity : parseInt(this.state.resDataChanged.ReservedQuantity) - 1
                }
            }, () => {this.calculatePrice()})
        }
    }

    changeQuantityPlan(value) {
        if (parseInt(value) > 1) {
            this.setState({
                resDataChanged: {
                ...this.state.resDataChanged,
                ReservedQuantity : parseInt(value)
                }
            }, () => {this.calculatePrice()})
        }
    }

    increaseQuantityPeople() {
        this.setState({
            resDataChanged: {
              ...this.state.resDataChanged,
              People : parseInt(this.state.resDataChanged.People) + 1
            }
        }, () => {this.calculatePrice()})
    }

    decreaseQuantityPeople() {
        if (parseInt(this.state.resDataChanged.People) > 1){
            this.setState({
                resDataChanged: {
                ...this.state.resDataChanged,
                People : parseInt(this.state.resDataChanged.People) - 1
                }
            }, () => {this.calculatePrice()})
        }
    }

    changeQuantityPeople(value) {
        if (parseInt(value) > 1) {
            this.setState({
                resDataChanged: {
                ...this.state.resDataChanged,
                People : parseInt(value)
                }
            }, () => {this.calculatePrice()})
        }
    }

    changeHour(key, itemValue){
        var newHourFromSelect = this.state.resDataChanged.HourFrom;
        var newHourToSelect = this.state.resDataChanged.HourTo;
        if (key.indexOf("hourFrom") > -1){
            newHourFromSelect = itemValue;
            if(parseInt(newHourFromSelect) >= parseInt(newHourToSelect)  ){
                if((parseInt(newHourFromSelect)+1) <= 9){
                    newHourToSelect = "0"+(parseInt(newHourFromSelect)+1);
                }else{
                    newHourToSelect = parseInt(newHourFromSelect)+1;
                    if(newHourToSelect == 24){
                        newHourToSelect = "00";
                    }
                }
            }
        }else{
            // hourToSelect
            newHourToSelect = itemValue;
            if(parseInt(newHourToSelect) <= parseInt(newHourFromSelect)){
                if((parseInt(newHourFromSelect)-1) <= 9){
                    newHourFromSelect = "0"+(parseInt(newHourToSelect)-1);
                }else{
                    newHourFromSelect = parseInt(newHourFromSelect)-1;
                    if(newHourFromSelect == 0){
                        newHourFromSelect = "00";
                    }
                }
            }
        }
        if(newHourToSelect == "00" && newHourFromSelect == "00"){
            newHourToSelect = "01";
        };
        this.setState({
            resDataChanged: {
                ...this.state.resDataChanged,
                HourFrom : newHourFromSelect,
                HourTo   : newHourToSelect,
            }
        });
    }

    handleChangeDate = (dateFrom) =>{
        var splittedDate = dateFrom.split('-')
        var dateFromNew = new Date(splittedDate[2],splittedDate[1] - 1,splittedDate[0]);
        this.setState({dateFrom:dateFromNew});
    }

    render() {
        const { systemLanguage } = this.props;
        return (
            <>
            {this.state.isLoading == false ? (
                <View style={styles.container}>
                    <View style={{alignItems: 'center', marginLeft: 15}}>
                        <Text style={styles.titleText}>{translations[systemLanguage].messages['myReservedSpacesList_modalModify_header']}</Text>
                        <View style={{flexDirection:'row', alignItems: 'center'}}>
                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                <View style={{flex:1}}> 
                                    <Text style={styles.subTitleText}>{translations[systemLanguage].messages['date_w']} </Text>
                                </View>
                                <View style={{flex:1}}> 
                                <DatePicker 
                                    parentDate={this.state.dateFrom} 
                                    handleChangeDate={this.handleChangeDate}
                                    placeholder={translations[systemLanguage].messages['date_w']}
                                    onChangeDate={(dateFrom) => this.setState({dateFrom})}
                                />      
                                </View>
                            </View>
                        </View>
                        {this.state.resData.PlanSelected != 'Hour' ? (
                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                <View style={{flex:1}}> 
                                    <Text style={styles.subTitleText}>
                                        {this.state.resData.PlanSelected == "Day" ? (translations[systemLanguage].messages['planChosenQuantityDescriptionDays_w']): ('')}
                                        {this.state.resData.PlanSelected == "Week" ? (translations[systemLanguage].messages['planChosenQuantityDescriptionWeeks_w']): ('')}
                                        {this.state.resData.PlanSelected == "Month" ? (translations[systemLanguage].messages['planChosenQuantityDescriptionMonths_w']): ('')}
                                    </Text>
                                </View>
                                <View style={{flex:1, flexDirection: 'row'}}>
                                    <TouchableOpacity style={styles.button2} onPress={() => this.decreaseQuantityPlan()}> 
                                        <Text style={styles.buttonText}>-</Text>
                                    </TouchableOpacity>
                                    <TextInput style={styles.inputBox}
                                        underlineColorAndroid='rgba(0,0,0,0)'
                                        onChangeText={(value) => this.changeQuantityPlan(value)} 
                                        value={this.state.resDataChanged.ReservedQuantity.toString()}
                                        maxLength={3}
                                    />     
                                    <TouchableOpacity style={styles.button2} onPress={() => this.increaseQuantityPlan()}> 
                                        <Text style={styles.buttonText}>+</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            ) : (
                                <>
                                    {this.state.resData.PlanSelected == 'Hour' ? (
                                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                            <View style={{flex: 1}}>
                                                <Text style={styles.subTitleText}>{translations[systemLanguage].messages['hour_w']} </Text>
                                            </View>
                                            <View style={{flex: 1, flexDirection: 'row'}}>
                                                <Picker
                                                    style={styles.pickerBox2}
                                                    selectedValue={this.state.resDataChanged.HourFrom}
                                                    onValueChange={(itemValue) => this.changeHour('hourFrom', itemValue)}
                                                    > 
                                                    {this.state.hoursAvailable.map((hours) => {
                                                        return (
                                                            <Picker.Item key={'hourFrom'+hours} value={hours} label={hours} />
                                                        );
                                                    })}
                                                </Picker>
                                                <Text style={styles.subTitleText}> {translations[systemLanguage].messages['to_w']} </Text>
                                                <Picker
                                                    style={styles.pickerBox2}
                                                    selectedValue={this.state.resDataChanged.HourTo}
                                                    onValueChange={(itemValue) => this.changeHour('hourTo', itemValue)}
                                                    > 
                                                        {this.state.hoursAvailable.map((hours) => {
                                                            return (
                                                                <Picker.Item key={'hourTo'+hours} value={hours} label={hours} />
                                                            );
                                                        })}
                                                </Picker>
                                            </View>
                                        </View>                             
                                    ) : (null)
                                    }
                                </>
                                ) 
                            }
                        
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <View style={{flex:1}}>                    
                                <Text style={styles.subTitleText}>{translations[systemLanguage].messages['people_w']} </Text>
                            </View>
                            <View style={{flex:1, flexDirection: 'row'}}>
                                <TouchableOpacity style={styles.button2} onPress={() => this.decreaseQuantityPeople()}> 
                                    <Text style={styles.buttonText}>-</Text>
                                </TouchableOpacity>
                                <TextInput style={styles.inputBox}
                                    onChangeText={(value) => this.changeQuantityPeople(value)} 
                                    value={this.state.resDataChanged.People.toString()}
                                    maxLength={3}
                                />
                                <TouchableOpacity style={styles.button2} onPress={() => this.increaseQuantityPeople()}> 
                                    <Text style={styles.buttonText}>+</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={{flexDirection:'row', alignItems: 'center'}}>
                            <View style={{flex:1}}>
                                <Text style={styles.subTitleText}>{translations[systemLanguage].messages['amount_w']} </Text>
                            </View>
                            <View style={{flex:1}}>
                                <TextInput style={styles.inputBox3} 
                                    underlineColorAndroid='rgba(0,0,0,0)'
                                    placeholder='Monto'
                                    placeholderTextColor="#ffffff"
                                    value={this.state.resDataChanged.TotalPrice.toString()}
                                    editable = {false}
                                />
                            </View>
                        </View>  
                    </View>
                    <View style={{flexDirection: 'row'}}>
                        <TouchableOpacity style={styles.button} onPress={()=> {this.props.navigation.goBack()}} disabled={this.state.buttonIsDisabled}> 
                            <Text style={styles.buttonText}>{translations[systemLanguage].messages['cancel_w']}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={()=> {this.confirmEditReservationMRSL()}} disabled={this.state.buttonIsDisabled}> 
                            <Text style={styles.buttonText}>{translations[systemLanguage].messages['save_w']}</Text>
                        </TouchableOpacity>
                    </View>        
                </View>
            ) : (
                    <ActivityIndicator
                        animating = {this.state.isLoading}
                        color = 'white'
                        size = "large"
                        style = {styles.activityIndicator}
                    />
                )
            } 
            </>
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
    inputBox2: {
      width:50,
      backgroundColor:'rgba(255,255,255,0.3)',
      paddingHorizontal: 16,
      fontSize: 16,
      color:'#ffffff',
      marginVertical: 10
    },
    inputBox: {
        width:70,
        backgroundColor:'rgba(255,255,255,0.3)',
        paddingHorizontal: 16,
        fontSize: 16,
        color:'#ffffff',
        marginVertical: 10
    },
    inputBox3: {
        width:120,
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
        login_status: state.loginData.login_status,
        userData: state.loginData.userData,
        tokenObj: state.loginData.tokenObj,
        systemLanguage: state.loginData.systemLanguage
    }
}

export default connect(mapStateToProps)(ReservationEditResCustPay)