import React from 'react';
import {
    Button, Modal, ModalHeader, ModalBody, ModalFooter,
    Form, FormGroup, Label, Input, Col
} from 'reactstrap';
// Multilanguage
import { withTranslate } from 'react-redux-multilingual'
import { displayErrorMessage, displaySuccessMessage } from '../../../services/common/genericFunctions';

class ModalDetailPayment extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: false,
            objPaymentDetails: {},
            isLoading: false,
            buttonIsDisabled: false
        };
    }

    // This function will toggle on or off the modal and save the paymentdetails if any
    toggle =(objPaymentDetails)=> {
        if (!this.state.isLoading) {
            this.setState({
                modal: !this.state.modal,
                objPaymentDetails: objPaymentDetails || {}
            });
        }
    }
    // This function will toggle on or off the modal and also the loading states
    changeModalLoadingState = (closeModal) => {
        if (closeModal) {
            this.setState({
                modal: !this.state.modal,
                isLoading: !this.state.isLoading,
                buttonIsDisabled: !this.state.buttonIsDisabled
            })
        } else {
            this.setState({
                isLoading: !this.state.isLoading,
                buttonIsDisabled: !this.state.buttonIsDisabled
            })
        }
    }

    save = () =>{
        this.changeModalLoadingState(false);
        this.props.confirmPayment(this.state.objPaymentDetails);
    }


    // Upload image functions
    maxSelectFile = (event) => {
        let files = event.target.files // create file object
        if ( files.length > 1) {
            event.target.value = null // discard selected file
            displayErrorMessage(this.props.translate('myReservedSpacesList_custPay_errorMsg1'));
            return false;
        }
        return true;
    }

    checkMimeType = (event) => {
        //getting file object
        let files = event.target.files
        //define message container
        let err = ''
        // list allow mime type
        const types = ['image/png', 'image/jpeg', 'application/pdf']
        // loop access array
        for (var x = 0; x < files.length; x++) {
            // compare file type find doesn't matach
            if (types.every(type => files[x].type !== type)) {
                // create error message and assign to container   
                err += files[x].type + this.props.translate('myReservedSpacesList_custPay_errorMsg2');
            }
        };

        if (err !== '') { // if message not empty that mean has error 
            event.target.value = null // discard selected file
            displayErrorMessage(err);
            return false;
        }
        return true;

    }
    // This function will check if the picture isn't greater than the maximum size
    checkFileSize = (event) => {
        let files = event.target.files
        let size = 1500000;
        let err = "";
        for (var x = 0; x < files.length; x++) {
            if (files[x].size > size) {
                err += files[x].type + this.props.translate('myReservedSpacesList_custPay_errorMsg3');
            }
        };
        if (err !== '') {
            event.target.value = null
            displayErrorMessage(err);
            return false
        }

        return true;

    }

    // End Upload image functions
    onChange = (evt) => {
        console.log("evt.target.id")
        console.log(evt.target.id)
        console.log("evt.target.files")
        console.log(evt.target.files)
        console.log("SSSSSTRE.target.files")

        console.log(JSON.stringify(evt.target.files))
        if(evt.target.id == 'paymentDocumentNew'){
            if (this.maxSelectFile(evt) && this.checkMimeType(evt) && this.checkFileSize(evt)) {
                this.setState({ spaceImages: [], tempFiles: evt.target.files }, () => {
                    for (var i = 0; i < this.state.tempFiles.length; i++) {
                        var file = this.state.tempFiles[i]; // FileList object
                        this.getBase64(file);
                    }
                });
                displaySuccessMessage(this.props.translate('myReservedSpacesList_custPay_succMsg1'));
            }
        }else{
            var objPaymentDetails = {
                ...this.state.objPaymentDetails,
                [evt.target.id]: evt.target.value
            }
            this.setState({
                objPaymentDetails: objPaymentDetails
            });
        }

    }

    getBase64 = (file) => {
        var f = file; // FileList object
        var reader = new FileReader();
        // Closure to capture the file information.
        const scope = this;
        reader.onload = (function (theFile) {
            return function (e) {
                var binaryData = e.target.result;
                //Converting Binary Data to base 64
                var base64String = window.btoa(binaryData);
                //showing file converted to base64
                const fileTypeArr = file.type.split('/');
                var fileObj = {
                    Extension: fileTypeArr[1],
                    Base64String: base64String
                };
                var newarchivesUpload = [];
                if (scope.state) {
                    newarchivesUpload = scope.state.objPaymentDetails.archivesUpload || [];
                }
                newarchivesUpload.push(fileObj);
                var objPaymentDetails = {
                    ...scope.state.objPaymentDetails,
                    'archivesUpload': newarchivesUpload
                }
                scope.setState({ objPaymentDetails: objPaymentDetails });
            };
        })(f);
        // Read in the image file as a data URL.
        reader.readAsBinaryString(f);
    }

    render() {
        const { translate } = this.props;

        return (
            <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
                <ModalHeader toggle={this.toggle}>{translate('modalDetailPayment_header')}</ModalHeader>
                <ModalBody>
                    <Form>
                        <FormGroup row>
                            <Label for="plan" sm={4}>{translate('plan_w')}</Label>
                            <Col sm={8}>
                                <Input type="text" name="plan" id="plan"
                                    value={this.state.objPaymentDetails.plan || ""} readOnly />
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label for="paymentAmmount" sm={4}>{translate('amount_w')}</Label>
                            <Col sm={8}>
                                <Input type="text" name="paymentAmmount" id="paymentAmmount"
                                    value={this.state.objPaymentDetails.paymentAmmount || ""} readOnly />
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label for="paymentStatusText" sm={4}>{translate('myReservedSpacesList_custPay_paymentStatusTxt')}</Label>
                            <Col sm={8}>
                                <Input type="text" name="paymentStatusText" id="paymentStatusText"
                                    value={this.state.objPaymentDetails.paymentStatusText || ""} readOnly />
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label for="paymentDate" sm={4}>{translate('myReservedSpacesList_custPay_paymentDateTxt')}</Label>
                            <Col sm={8}>
                                <Input type="text" name="paymentDate" id="paymentDate"
                                    value={this.state.objPaymentDetails.paymentDate == null ? translate('pending_w') : this.state.objPaymentDetails.paymentDate} readOnly />
                            </Col>
                        </FormGroup>
                        {this.state.objPaymentDetails.paymentDocument ? (
                            <FormGroup row>
                                <Label for="paymentDocument" sm={4}>{translate('myReservedSpacesList_custPay_uploadedDocument')}</Label>
                                <Col sm={8}>
                                    <a href={this.state.objPaymentDetails.paymentDocument || ""} target="_blank">LINK</a>
                                </Col>
                            </FormGroup>
                        ) : (null)}
                        {this.state.objPaymentDetails.paymentStatus != "PAID" && this.state.objPaymentDetails.paymentStatus != "CANCELED" ? (
                            <FormGroup row>
                                <Label for="paymentDocumentNew" sm={4}>{translate('myReservedSpacesList_custPay_uploadDocument')}</Label>
                                <Col sm={8}>
                                    <Input type="file" name="paymentDocumentNew" id="paymentDocumentNew"
                                        value={this.state.objPaymentDetails.paymentDocumentNew || ""} onChange={this.onChange} />
                                </Col>
                            </FormGroup>
                        ) : (null)}
                        <FormGroup row>
                            <Label for="paymentComment" sm={6}>{translate('comment_w')} ({translate('optional_w')})</Label>
                            <Col sm={12}>
                                <Input type="textarea" name="paymentComment" id="paymentComment"
                                    value={this.state.objPaymentDetails.paymentComment || ""} onChange={this.onChange} readOnly={this.state.objPaymentDetails.paymentStatus != "PAID" && this.state.objPaymentDetails.paymentStatus != "CANCELED" ? false : true} />
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Col sm={12}>
                                {this.state.objPaymentDetails.paymentStatus != "PAID" && this.state.objPaymentDetails.paymentStatus != "CANCELED" ? (
                                   translate('modalDetailPayment_txt1')+ 
                                   translate('modalDetailPayment_txt2')
                                ) : (
                                    translate('modalDetailPayment_txt3')
                                    )}
                            </Col>
                        </FormGroup>
                    </Form>
                </ModalBody>
                <ModalFooter>
                    <Button color="link" onClick={this.toggle} disabled={this.state.buttonIsDisabled}>{translate('close_w')}</Button>
                    {this.state.objPaymentDetails.paymentStatus != "PAID" && this.state.objPaymentDetails.paymentStatus != "CANCELED" ? (
                        <Button color="primary" onClick={this.save} disabled={this.state.buttonIsDisabled}>{translate('confirm_w')}
                            &nbsp;&nbsp;
                            {this.state.isLoading &&
                                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                            }
                        </Button>
                    ) : (null)}
                </ModalFooter>
            </Modal>
        );
    }
}

export default withTranslate(ModalDetailPayment);
