import React, {Component} from 'react';
import { StyleSheet, Text, View, ScrollView, Picker, TextInput, TouchableOpacity, Dimensions} from 'react-native';
import { connect } from 'react-redux';

import translations from '../common/translations';
import DatePicker from '../components/datePicker';

class ReserveSpace extends Component {
    
    constructor(props) {
        super(props);
        const { navigation } = this.props;
        const pubObjParams = navigation.getParam('pubObj', 'default value');
        this.state = {
            quantityPlan        : 1,
            planChosen          : "HourPrice",
            quantityPeople      : '1',
            generalError        : false,
            date                : new Date(),
            hoursAvailable      : ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13'
                                    , '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'],
            hourFromSelect      : '00',
            hourToSelect        : '01',
            reservationComment  : "",
            pubObj              : pubObjParams,
        }
    }

    /*setInitialHour(){
        var today = new Date();
        var hourFromSelect = today.getHours();
        this.changeHour({target : {value : hourFromSelect, id: "hourFromSelect" }})

    }*/

    triggerSummaryScreen(){
        var validObj = this.validateReservation();
        if(validObj.valid){
            var planChosenText = "";
            var tmpHfs = 0;
            var tmpHts = 1;
            switch(this.state.planChosen){
                case "HourPrice" : planChosenText = "por hora"; tmpHfs = this.state.hourFromSelect; tmpHts = this.state.hourToSelect == 0 ? 24 : this.state.hourToSelect;  break;
                case "DailyPrice" : planChosenText = "por día"; break;
                case "WeeklyPrice" : planChosenText = "por semana"; break;
                case "MonthlyPrice" : planChosenText = "por mes"; break;
            }
            var totalPrice = (parseInt(tmpHts-tmpHfs) * parseInt(this.state.pubObj[this.state.planChosen]));
            if(this.state.pubObj.IndividualRent == true){
                totalPrice = totalPrice * parseInt(this.state.quantityPeople);
            }
            this.setState({
                totalPrice : totalPrice
            });
            
            var summaryObject = {
                planChosen: this.state.planChosen,
                planChosenText: planChosenText,
                planValue : this.state.pubObj[this.state.planChosen],
                hourFromSelect : tmpHfs,
                hourToSelect : tmpHts,
                date: this.convertDate(this.state.date),
                quantityPeople : this.state.quantityPeople,
                totalPrice : totalPrice,
            };
            this.props.navigation.navigate('ReserveSpaceSummary', {summaryObject:summaryObject});
        }else{
            ToastAndroid.showWithGravity(
                validObj.message,
                ToastAndroid.LONG,
                ToastAndroid.CENTER,
            );
        }
    }

    validateReservation(){
        if(this.state.date){}
        var objResponse = {
            valid : true,
            message : ""
        }
        return objResponse;;
    }

    increaseQuantityPlan() {
        this.setState({ quantityPlan: parseInt(this.state.quantityPlan) + 1 });
    }

    decreaseQuantityPlan() {
        if (parseInt(this.state.quantityPlan) > 1) {
            this.setState({ quantityPlan: parseInt(this.state.quantityPlan) - 1 });
        }
    }

    changeQuantityPlan(value) {
        if (parseInt(value) > 0) {
            this.setState({ quantityPlan: parseInt(value) });
        }
    }

    increaseQuantityPeople() {
        this.setState({ quantityPeople: parseInt(this.state.quantityPeople) + 1 });
    }

    decreaseQuantityPeople() {
        if (parseInt(this.state.quantityPeople) > 1) {
            this.setState({ quantityPeople: parseInt(this.state.quantityPeople) - 1 });
        }
    }

    changeQuantityPeople(value) {
        if (parseInt(value) > 0) {
            this.setState({ quantityPeople: parseInt(value) });
        }
    }

    changeHour(key, itemValue){
        var newHourFromSelect = this.state.hourFromSelect;
        var newHourToSelect = this.state.hourToSelect;
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
            hourFromSelect: newHourFromSelect,
            hourToSelect: newHourToSelect
        });
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
        var dateConv = dd + "-" + mm + '-' + yyyy;
        return dateConv;
    }

    handleChangeDate(date){
        this.setState({date:date});
    }

    

    render() {
        const { systemLanguage } = this.props;
        const pickerItems = [
            {
              key: 1,
              label: translations[systemLanguage].messages['hourlyPrice_w'] +": $" + this.state.pubObj.HourPrice,
              value: "HourPrice",
            },
            {
              key: 2,
              label: translations[systemLanguage].messages['dailyPrice_w'] + ": $" + this.state.pubObj.DailyPrice,
              value: "DailyPrice",
            },
            {
              key: 3,
              label: translations[systemLanguage].messages['weeklyPrice_w'] + ": $" + this.state.pubObj.WeeklyPrice,
              value: "WeeklyPrice",
            },
            {
              key: 4,
              label: translations[systemLanguage].messages['monthlyPrice_w'] + ": $" + this.state.pubObj.MonthlyPrice,
              value: "MonthlyPrice",
            },
        ];
        const filteredItems = pickerItems.filter(item => {
            let returnBool = false;
            switch(item.value){
                case "HourPrice":
                    if (this.state.pubObj.HourPrice > 0) {
                        returnBool = true;
                    }
                break;
                case "DailyPrice":
                    if (this.state.pubObj.DailyPrice > 0) {
                        returnBool = true;
                    }
                break;
                case "WeeklyPrice":
                    if (this.state.pubObj.WeeklyPrice > 0) {
                        returnBool = true;
                    }
                break;
                case "MonthlyPrice":
                    if (this.state.pubObj.MonthlyPrice > 0) {
                        returnBool = true;
                    }
                break;
            }
            return returnBool;
        });
        return (
            <View style={styles.container}>
                <View style={{alignItems: 'flex-start'}}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Text style={styles.subTitleText}>Plan </Text>
                        <Picker
                            style={styles.pickerBox}
                            selectedValue={this.state.planChosen}
                            onValueChange={(itemValue, itemIndex) => this.setState({planChosen: itemValue})}
                            >
                            { filteredItems.map(item => <Picker.Item key={item.key} value={item.value} label={item.label}/>)}
                        </Picker>
                    </View>
                    <>
                    {this.state.planChosen == "HourPrice" ? (
                        <View>
                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                <Text style={styles.subTitleText}>{translations[systemLanguage].messages['hour_w']} </Text>
                                <Picker
                                    style={styles.pickerBox2}
                                    selectedValue={this.state.hourFromSelect}
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
                                    selectedValue={this.state.hourToSelect}
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
                    ) : (null)}
                    </>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Text style={styles.subTitleText}>{translations[systemLanguage].messages['date_w']} </Text>
                        <DatePicker 
                            parentState={this.state} 
                            handleChangeDate={this.handleChangeDate}
                            placeholder={translations[systemLanguage].messages['date_w']}
                            onChangeDate={(date) => {this.props.handleChangeDate(date)}}
                        />      
                    </View>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>                    
                        <Text style={styles.subTitleText}>{translations[systemLanguage].messages['people_w']} </Text>
                        <TouchableOpacity style={styles.button2} onPress={() => this.decreaseQuantityPeople()}> 
                            <Text style={styles.buttonText}>-</Text>
                        </TouchableOpacity>
                        <TextInput style={styles.inputBox}
                            underlineColorAndroid='rgba(0,0,0,0)'
                            placeholder={translations[systemLanguage].messages['email_w']}
                            placeholderTextColor="#ffffff"
                            onChangeText={(value) => this.changeQuantityPeople(value)} 
                            value={this.state.quantityPeople.toString()}
                            maxLength={3}
                        />
                        <TouchableOpacity style={styles.button2} onPress={() => this.increaseQuantityPeople()}> 
                            <Text style={styles.buttonText}>+</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{flexDirection: 'row'}}> 
                    <TouchableOpacity style={styles.button} onPress={() => {this.props.navigation.goBack()}}> 
                        <Text style={styles.buttonText}>Cancelar</Text>
                    </TouchableOpacity>                     
                    <TouchableOpacity style={styles.button} onPress={() => this.triggerSummaryScreen()}> 
                        <Text style={styles.buttonText}>Confirmar</Text>
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

export default connect(mapStateToProps)(ReserveSpace);

/*<DatePicker placeholderText={translate('date_w')}
                        dateFormat="dd/MM/yyyy"
                        selected={this.state.date}
                        minDate={new Date()}
                        onSelect={this.handleChange} //when day is clicked
                        onChange={this.handleChange} //only when value has changed
                    />*/
/*<div className={this.state.pubObj.state === 3 ? 'hidden' : 'shown'}>*/

//{this.state.pubObj.WeeklyPrice > 0 && this.state.pubObj.WeeklyPrice != '' ? (<Picker.Item key={3} value={"WeeklyPrice"} label={translations[systemLanguage].messages['weeklyPrice_w'] + ": $" + this.state.pubObj.WeeklyPrice}/>):(null)}
//{this.state.pubObj.MonthlyPrice > 0 && this.state.pubObj.MonthlyPrice != '' ? (<Picker.Item key={4} value={"MonthlyPrice"} label={translations[systemLanguage].messages['monthlyPrice_w'] + ": $" + this.state.pubObj.MonthlyPrice}/>):(null)}

//{this.state.pubObj.HourPrice > 0 && this.state.pubObj.HourPrice != '' ? (<Picker.Item key={1} value={"HourPrice"} label={translations[systemLanguage].messages['hourlyPrice_w'] +": $" + this.state.pubObj.HourPrice}/>):(<Picker.Item key={1} value={"test"} label={"$"}/>)}
//{this.state.pubObj.DailyPrice > 0 && this.state.pubObj.DailyPrice != '' ? (<Picker.Item key={2} value={"DailyPrice"} label={translations[systemLanguage].messages['dailyPrice_w'] + ": $" + this.state.pubObj.DailyPrice}/>):(<Picker.Item key={2} value={"test"} label={"$"}/>)}
//{this.state.pubObj.WeeklyPrice > 0 && this.state.pubObj.WeeklyPrice != '' ? (<Picker.Item key={3} value={"WeeklyPrice"} label={translations[systemLanguage].messages['weeklyPrice_w'] + ": $" + this.state.pubObj.WeeklyPrice}/>):(<Picker.Item key={3} value={"test"} label={"$"}/>)}
//{this.state.pubObj.MonthlyPrice > 0 && this.state.pubObj.MonthlyPrice != '' ? (<Picker.Item key={4} value={"MonthlyPrice"} label={translations[systemLanguage].messages['monthlyPrice_w'] + ": $" + this.state.pubObj.MonthlyPrice}/>):(<Picker.Item key={4} value={"test"} label={"$"}/>)}