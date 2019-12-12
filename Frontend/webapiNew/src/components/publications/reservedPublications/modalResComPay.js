import React from 'react';
import {
    Button, Modal, ModalHeader, ModalBody, ModalFooter,
    Form, FormGroup, Label, Input, Col
} from 'reactstrap';
import { toast } from 'react-toastify';

class ModalResComPay extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: false,
            objPaymentDetails: {},
            reservationComment: "",
            isLoading: false,
            buttonIsDisabled: false
        };
        this.toggle = this.toggle.bind(this);
        this.save = this.save.bind(this);
        this.changeModalLoadingState = this.changeModalLoadingState.bind(this);
        this.getBase64 = this.getBase64.bind(this);
    }

    toggle(objPaymentDetails) {
        if (!this.state.isLoading) {
            this.setState({
                modal: !this.state.modal,
                objPaymentDetails: objPaymentDetails || {}
            });
        }
    }
    changeModalLoadingState(closeModal) {
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

    save() {
        this.changeModalLoadingState(false);
        this.props.saveComissionPayment(this.state.objPaymentDetails);
    }


    // Upload image functions
    maxSelectFile = (event) => {
        let files = event.target.files // create file object
        if ( files.length > 1) {
            event.target.value = null // discard selected file
            toast.error('Solo puede subir un archivo', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
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
                err += files[x].type + ' no es un formato soportado\n';
            }
        };

        if (err !== '') { // if message not empty that mean has error 
            event.target.value = null // discard selected file
            toast.error(err, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            return false;
        }
        return true;

    }
    checkFileSize = (event) => {
        let files = event.target.files
        let size = 1500000;
        let err = "";
        for (var x = 0; x < files.length; x++) {
            if (files[x].size > size) {
                err += files[x].type + ' es demasiado grande, por favor elija un archivo de menor tamaño\n';
            }
        };
        if (err !== '') {
            event.target.value = null
            toast.error(err, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            return false
        }

        return true;

    }

    // End Upload image functions
    onChange = (evt) => {
        if(evt.target.id != 'paymentComment'){
            if (this.maxSelectFile(evt) && this.checkMimeType(evt) && this.checkFileSize(evt)) {
                console.log(evt.target.files);
                this.setState({ spaceImages: [], tempFiles: evt.target.files }, () => {
                    for (var i = 0; i < this.state.tempFiles.length; i++) {
                        var file = this.state.tempFiles[i]; // FileList object
                        this.getBase64(file);
                    }
                });
                toast.success('Archivo cargado correctamente. ', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
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

    getBase64(file) {
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
        return (
            <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
                <ModalHeader toggle={this.toggle}>Detalle pago de la comisión</ModalHeader>
                <ModalBody>
                    <Form>
                        <FormGroup row>
                            <Label for="paymentAmmount" sm={4}>Monto</Label>
                            <Col sm={8}>
                                <Input type="text" name="paymentAmmount" id="paymentAmmount"
                                    value={this.state.objPaymentDetails.paymentAmmount} readOnly />
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label for="paymentStatusText" sm={4}>Estatus del pago</Label>
                            <Col sm={8}>
                                <Input type="text" name="paymentStatusText" id="paymentStatusText"
                                    value={this.state.objPaymentDetails.paymentStatusText} readOnly />
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label for="paymentDate" sm={4}>Fecha de pago</Label>
                            <Col sm={8}>
                                <Input type="text" name="paymentDate" id="paymentDate"
                                    value={this.state.objPaymentDetails.paymentDate == null ? "Pendiente" : this.state.objPaymentDetails.paymentDate} readOnly />
                            </Col>
                        </FormGroup>
                        {this.state.objPaymentDetails.paymentDocument ? (
                            <FormGroup row>
                                <Label for="paymentDocument" sm={4}>Documento subido</Label>
                                <Col sm={8}>
                                    <a href={this.state.objPaymentDetails.paymentDocument} target="_blank">Archivo subido</a>
                                </Col>
                            </FormGroup>
                        ) : (null)}
                        {this.state.objPaymentDetails.paymentStatus != "PAID" && this.state.objPaymentDetails.paymentStatus != "CANCELED" ? (
                            <FormGroup row>
                                <Label for="paymentDocumentNew" sm={4}>Documento prueba</Label>
                                <Col sm={8}>
                                    <Input type="file" name="paymentDocumentNew" id="paymentDocumentNew"
                                        value={this.state.objPaymentDetails.paymentDocumentNew} onChange={this.onChange} />
                                </Col>
                            </FormGroup>
                        ) : (null)}
                        <FormGroup row>
                            <Label for="paymentComment" sm={6}>Comentario (opcional)</Label>
                            <Col sm={12}>
                                <Input type="textarea" name="paymentComment" id="paymentComment"
                                    value={this.state.objPaymentDetails.paymentComment} onChange={this.onChange} readOnly={this.state.objPaymentDetails.paymentStatus != "PAID" || this.state.objPaymentDetails.paymentStatus != "CANCELED" ? false : true} />
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Col sm={12}>
                                {this.state.objPaymentDetails.paymentStatus != "PAID" && this.state.objPaymentDetails.paymentStatus != "CANCELED" ? (
                                    "Atencion! El pago deberá ser confirmado por el administrador. " +
                                    "Puede adjuntar una imagen/pdf y agregar un comentario."
                                ) : (
                                        "El pago fue confirmado."
                                    )}
                            </Col>
                        </FormGroup>

                    </Form>
                </ModalBody>
                <ModalFooter>
                    <Button color="link" onClick={this.toggle} disabled={this.state.buttonIsDisabled}>Cerrar</Button>
                    {this.state.objPaymentDetails.paymentStatus != "PAID" && this.state.objPaymentDetails.paymentStatus != "CANCELED" ? (
                        <Button color="primary" onClick={this.save} disabled={this.state.buttonIsDisabled}>Guardar
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

export default ModalResComPay;
