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
        date={this.props.parentDate}
        mode="date"
        format="DD-MM-YYYY"
        minDate={new Date()}
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
        onDateChange={this.props.handleChangeDate}
      />
    )
  }
}