import React from 'react';
import {Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input, Col} from 'reactstrap';
import DatePicker from  '../../publications/viewPublication/datePicker';
// Multilanguage
import { withTranslate } from 'react-redux-multilingual'

class ModifyReservationModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: false,
            resData: {},
            resDataChanged: {},
            tokenObj: {},
            userData: {},
            dateFrom: null,
            hoursAvailable      : ["00", '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13'
                                    , '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'],
            pricePlanChosen: null,
            isLoading : false,
            buttonIsDisabled: false
        };
    }

    toggle = (resData, tokenObj, userData)  => {
        if (resData != null) {
            if(resData.DateFromString) {
                var dateConverted = this.splitDate(resData.DateFromString)
                var dateFormated = new Date(dateConverted[2],parseInt(dateConverted[1])-1, dateConverted[0])
                this.setState({
                    modal: !this.state.modal,
                    resData: resData,
                    resDataChanged: resData,
                    tokenObj: tokenObj,
                    userData: userData,
                    dateFrom: dateFormated,
                    pricePlanChosen: this.getPricePlanChosen(resData)
                }, () => {
                    if((parseInt(resData.HourFrom)) <= 9){
                        resData.HourFrom = "0"+(parseInt(resData.HourFrom));
                    }
                    if((parseInt(resData.HourTo)) <= 9){
                        resData.HourTo = "0"+(parseInt(resData.HourTo));
                    }
                    this.changeHour({target : {value : resData.HourFrom, id: "hourFromSelect" }})
                    this.changeHour({target : {value : resData.HourTo, id: "hourToSelect" }})});
            }
        }
        this.setState({
            modal: !this.state.modal
        })
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

    handleChange = (e) => {
        this.setState({
                dateFrom: e
        });
    }

    changeHour = (e) => {
        var newHourFromSelect = this.state.resDataChanged.HourFrom;                
        var newHourToSelect = this.state.resDataChanged.HourTo;
        if(e.target.id == "hourFromSelect"){
            newHourFromSelect = e.target.value;
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
            newHourToSelect = e.target.value;
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
            resDataChanged : {
                ...this.state.resDataChanged,
                HourFrom: newHourFromSelect,
                HourTo: newHourToSelect
            }
        }, () => this.calculatePrice());
        
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
            totalPrice = parseInt(this.state.pricePlanChosen);
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

    onChange = (e) => {
        var valueToUpdate = e.target.value;
        if (e.target.name == 'People' && (valueToUpdate == '' || isNaN(valueToUpdate) || parseInt(valueToUpdate) <= 0)) {
            valueToUpdate = 1
        }
        this.setState({
            resDataChanged: {
              ...this.state.resDataChanged,
              [e.target.name] : valueToUpdate
            }
          }, () => {this.calculatePrice()})
    }

    changeModalLoadingState = (closeModal)  => {
        if(closeModal){
            this.setState({
                modal: !this.state.modal,
                isLoading: !this.state.isLoading,
                buttonIsDisabled: !this.state.buttonIsDisabled
            })
        }else{
            this.setState({
                isLoading: !this.state.isLoading,
                buttonIsDisabled: !this.state.buttonIsDisabled
            })
        }
    }

    save = () =>  {
        this.changeModalLoadingState();
        this.props.confirmEditReservation(this.state);
    }

    render() {
        const { translate } = this.props;
        return (
            <span className="d-inline-block mb-2 mr-2">
                <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
                    <ModalHeader toggle={this.toggle}>{translate('myReservedSpacesList_modalModify_header')}</ModalHeader>
                    <ModalBody>
                    <Form>
                        <FormGroup row>
                        <Label for="DateFrom" sm={4}>{translate('date_w')}</Label>
                        <DatePicker placeholderText={translate('date_w')}
                            dateFormat="dd-MM-yyyy"
                            selected= {this.state.dateFrom}
                            minDate={new Date()}
                            onSelect={this.handleChange} //when day is clicked
                            onChange={this.handleChange} //only when value has changed
                        />
                        </FormGroup>
                        {this.state.resData.PlanSelected == 'Hour' ? (
                            <FormGroup>
                            <div className="cart">
                                <div className="add-to-cart d-flex">
                                    <span><b>{translate('hour_w')}</b></span>
                                    <div style={{ marginLeft: '8%' }} className="browser">
                                        <select style={{ marginLeft: '8%' }} className="browser" id="hourFromSelect" 
                                            value={this.state.resDataChanged.HourFrom} onChange={this.changeHour} >
                                            {this.state.hoursAvailable.map((hours) => {
                                                return (
                                                    <option key={'hourTo'+hours} value={hours}>{hours}</option>
                                                );
                                            })}
                                        </select>
                                    </div>
                                    <b style={{ marginLeft: '8%' }}>{translate('to_w')}</b>
                                    <div className="browser">
                                        <select className="browser" id="hourToSelect" 
                                        value={this.state.resDataChanged.HourTo} onChange={this.changeHour} >
                                        {this.state.hoursAvailable.map((hours) => {
                                                return (
                                                    <option key={'hourTo'+hours} value={hours}>{hours}</option>
                                                );
                                            })}
                                        </select>
                                    </div>
                                </div>
                            </div>
                            </FormGroup>
                        ) : (null)}                        
                        <FormGroup row>
                        <Label for="People" sm={8}>{translate('people_w')}</Label>
                        <Col sm={10}>
                        <Input type="number" name="People" id="People"
                                        value={this.state.resDataChanged.People} onChange={this.onChange}/>
                        </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label for="TotalPrice" sm={8}>{translate('amount_w')}</Label>
                            <Col sm={10}>
                                <Input disabled type="text" name="TotalPrice" id="TotalPrice"
                                        value={this.state.resDataChanged.TotalPrice} />
                            </Col>
                        </FormGroup>                        
                    </Form>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="link" onClick={this.toggle}>{translate('cancel_w')}</Button>
                        <Button color="primary" onClick={this.save} disabled= {this.state.buttonIsDisabled}>{translate('save_w')}
                        &nbsp;&nbsp;
                            {this.state.isLoading &&  
                                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                            }
                        </Button>
                    </ModalFooter>
                </Modal>
            </span>
        );
    }
}

export default withTranslate(ModifyReservationModal);