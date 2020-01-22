import React, { Component } from 'react'
import DatePicker from 'react-native-datepicker'
 
export default class MyDatePicker extends Component {
  constructor(props){
    super(props)
    this.state = {
        date: new Date()
    };
  }
 
  render(){
    return (
      <DatePicker
        style={{width: 200}}
        date={this.state.date}
        mode="date"
        //placeholder={this.state.date}
        format="DD-MM-YYYY"
        minDate={new Date()}
        //maxDate="2016-06-01"
        confirmBtnText="Confirmar"
        cancelBtnText="Cancelar"
        customStyles={{
          /*dateIcon: {
            position: 'absolute',
            left: 0,
            top: 4,
            marginLeft: 0
          },*/
          dateInput: {
            borderColor: 'white',
            color: 'white',
          }
        }}
        onDateChange={(date) => {this.setState({date:date})}}
      />
    )
  }
}