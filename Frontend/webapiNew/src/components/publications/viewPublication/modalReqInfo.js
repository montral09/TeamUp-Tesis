import React from 'react';
import {Button, Modal, ModalHeader, ModalBody, ModalFooter,
    Form, FormGroup, Label, Input, Col } from 'reactstrap';
import DatePicker from '../viewPublication/datePicker';


class ModalReqInfo extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            modal: false,
            optionalData: {},
            textboxValue: "",
            dateSelectValue : "",
            isLoading : false,
            buttonIsDisabled: false
        };
        this.toggle = this.toggle.bind(this);
        this.save = this.save.bind(this);
        this.changeModalLoadingState = this.changeModalLoadingState.bind(this);
    }

    toggle(optionalData) {
        if(optionalData){
            this.setState({
                modal: !this.state.modal,
                optionalData: optionalData
            });
        }else{
            if(!this.state.isLoading){
                this.setState({
                    modal: !this.state.modal
                });
            }
        }
    }

    changeModalLoadingState(closeModal){
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

    save() {
        if(this.props.modalConfigObj.saveFunction){
            this.props.triggerSaveModal(this.props.modalConfigObj.saveFunction,{optionValue:this.state.optionValue, textboxValue:this.state.textboxValue, dateSelectValue: this.state.dateSelectValue })
        }else{
            this.props.modalSave(this.state.textboxValue);
        }
    }
    onChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value
          })
    }
    handleDateChange = (e) => {
        this.setState({
            dateSelectValue: e
        });
    }

    render() {
        return (

            <span className="d-inline-block mb-2 mr-2">
                {this.props.modalConfigObj ? (
                    <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
                    <ModalHeader toggle={this.toggle}>{this.props.modalConfigObj.title}</ModalHeader>
                    <ModalBody>
                    <Form>
                        <p> {this.props.modalConfigObj.mainText} </p>
                        {this.props.modalConfigObj.optionDisplay ? 
                        (
                            <FormGroup row>
                                <Label for="optionValue" sm={2}>{this.props.modalConfigObj.optionLabel}</Label>
                                <Col sm={10}>
                                    <select style={{ marginLeft: '8%' }} className="browser" id="optionValue" 
                                        value={this.state.optionValue} onChange={this.onChange}>
                                        {this.props.modalConfigObj.optionArray.map((option) => {
                                            return (
                                                <option key={option} value={option}>{option}</option>
                                            );
                                        })}
                                    </select>
                                </Col>
                            </FormGroup>
                        ) : (null)}
                        {this.props.modalConfigObj.textboxDisplay ? 
                        (
                            <FormGroup row>
                                <Label for="textboxValue" sm={2}>{this.props.modalConfigObj.textboxLabel}</Label>
                                <Col sm={10}>
                                    <Input type="textarea" name="textboxValue" id="textboxValue"
                                            value={this.state.textboxValue || ""} onChange={this.onChange}/>
                                </Col>
                            </FormGroup>
                        ) : (null)}
                        {this.props.modalConfigObj.dateSelectDisplay ? 
                        (
                            <FormGroup row>
                                <Label for="dateSelectValue" sm={8}>{this.props.modalConfigObj.dateSelectLabel}</Label>
                                <Col sm={12}>
                                    <DatePicker placeholderText="dd/MM/yyyy"
                                        dateFormat="dd/MM/yyyy"
                                        selected={this.state.dateSelectValue}
                                        minDate={new Date()}
                                        onSelect={this.handleDateChange} //when day is clicked
                                        onChange={this.handleDateChange} //only when value has changed
                                    />
                                </Col>
                            </FormGroup>
                        ) : (null)}
                    </Form>
                    </ModalBody>
                        {this.props.modalConfigObj.login_status == 'LOGGED_IN' ? (
                        <ModalFooter>
                            {this.props.modalConfigObj.cancelAvailable == true ? (<Button color="link" onClick={this.toggle} disabled= {this.state.buttonIsDisabled}>{this.props.modalConfigObj.cancelText}</Button>) : (null)}
                            {this.props.modalConfigObj.confirmAvailable == true ? (<Button color="primary" onClick={this.save} disabled= {this.state.buttonIsDisabled}>{this.props.modalConfigObj.confirmText}
                                &nbsp;&nbsp;
                                {this.state.isLoading &&  
                                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                }
                            </Button>) : (null)}
                        </ModalFooter>
                    ) : (null)}
                </Modal>
                ) : (null)}
                
            </span>
        );
    }
}

export default ModalReqInfo;