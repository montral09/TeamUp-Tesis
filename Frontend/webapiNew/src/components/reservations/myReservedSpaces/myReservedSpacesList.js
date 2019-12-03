import React, {Suspense} from 'react';
import Header from "../../header/header";
import { Redirect } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { connect } from 'react-redux';
import MyReservedSpacesTable from './myReservedSpacesTable';
import ModifyReservationModal from './modifyReservationModal';
import ModalReqInfo from '../../publications/viewPublication/modalReqInfo';


class MyReservedSpacesList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loadingReservations : true,
            reservationId : null,
            reservations : [],
            modalConfigObj : {},
            generalError : false,
            selectedIdRes : null,
            selectedResState : ""
        }
        this.modalElement = React.createRef();
        this.modalReqInfo = React.createRef();
        this.bindFunctions();
    }

    bindFunctions(){
        this.loadMyReservations = this.loadMyReservations.bind(this);    
        this.confirmEditReservation = this.confirmEditReservation.bind(this);
        this.triggerModal = this.triggerModal.bind(this);
        this.saveRate = this.saveRate.bind(this);
        this.saveCancel = this.saveCancel.bind(this);
        this.triggerSaveModal = this.triggerSaveModal.bind(this);
    }

    handleErrors(error) {
        this.setState({ generalError: true });
    }
    componentDidMount() {
        window.scrollTo(0, 0);
        this.loadMyReservations();
    }

    loadMyReservations(){
        try {
            fetch('https://localhost:44372/api/reservationCustomer', {
                method: 'POST',
                header: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify({
                    "AccessToken": this.props.tokenObj.accesToken,
                    "Mail": this.props.userData.Mail                   
                })
            }).then(response => response.json()).then(data => {
                if (data.responseCode == "SUCC_RESERVATIONSOK") {
                    this.setState({ reservations: data.Reservations, loadingReservations: false })
                } else {
                    toast.error('Hubo un error', {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                    });
                }
            }
            ).catch(error => {
                toast.error('Internal error', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
                console.log(error);
            }
        )
        }catch(error){
            toast.error('Internal error', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            console.log(error);
        }
    }

    editReservation = (key) => {
        const resData = this.state.reservations.filter(res => {
            return res.IdReservation === key
        });
        this.modalElement.current.toggle(resData[0], this.props.tokenObj, this.props.userData);
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

    confirmEditReservation(modalInfo) {
        let {IdReservation, HourFrom, HourTo, TotalPrice} = modalInfo.resDataChanged;
        let objRes = {
            AccessToken: this.props.tokenObj.accesToken,
            Mail: this.props.userData.Mail,
            IdReservation: IdReservation,
            DateFrom: this.convertDate(modalInfo.dateFrom),
            HourFrom: HourFrom,
            HourTo: HourTo,
            TotalPrice: TotalPrice,            
        }
        this.modalElement.current.changeModalLoadingState(false);
        fetch('https://localhost:44372/api/reservationCustomer', {
            method: 'PUT',
            header: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify(objRes)
        }).then(response => response.json()).then(data => {
            console.log("data:" + JSON.stringify(data));
            if (data.responseCode == "SUCC_RESERVATIONUPDATED") {
                this.modalElement.current.changeModalLoadingState(true);                               
                this.loadMyReservations();
            } else if (data.Message) {
                    toast.error('Hubo un error', {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                    });
                }
        }
        ).catch(error => {
            toast.error('Internal error', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            console.log(error);
        }
        )
    }

    triggerModal(mode, IdReservation, selectedResState){
        var modalConfigObj = {};
        if(mode === "CANCEL"){
            modalConfigObj ={
                title: 'Cancelar reserva', mainText: 'Desea cancelar la reserva? Por favor indique el motivo ', mode : mode, saveFunction : "saveCancel", textboxLabel: 'Comentario',
                textboxDisplay:true, cancelAvailable:true, confirmAvailable:true, cancelText :'No', confirmText :'Si' , login_status: this.props.login_status
            };
        }else if (mode === "RATE"){
            modalConfigObj ={
                title: 'Calificar reserva', mainText: 'Por favor, denos su calificación sobre la reserva y el lugar ', mode : mode, saveFunction : "saveRate", textboxLabel: 'Comentario',
                textboxDisplay:true, cancelAvailable:true, confirmAvailable:true, cancelText :'Cancelar', confirmText :'Calificar' , login_status: this.props.login_status,
                optionDisplay: true, optionLabel: 'Puntuación', optionDefaultValue:1, optionArray: [1,2,3,4,5]
            };
        }
        this.setState({modalConfigObj : modalConfigObj, selectedIdRes: IdReservation, selectedResState:selectedResState},() => {this.modalReqInfo.current.toggle();})
    }

    triggerSaveModal(saveFunction, objData){
        switch(saveFunction){
            case "saveCancel": this.saveCancel(objData.textboxValue);break;
            case "saveRate": this.saveRate(objData.optionValue, objData.textboxValue);break;
            case "saveConfirm": this.saveConfirm();break;
        }
    }

    saveCancel(commentValue){
        var objApi = {};
        objApi.objToSend = {
            "AccessToken": this.props.tokenObj.accesToken,
            "IdReservation": this.state.selectedIdRes,
            "Mail": this.props.userData.Mail,
            "OldState": this.state.selectedResState,
            "NewState": "CANCELED",
            "CanceledReason": commentValue
        }
        objApi.fetchUrl = "https://localhost:44372/api/reservation";
        objApi.method = "PUT";
        objApi.responseSuccess = "SUCC_RESERVATIONUPDATED";
        objApi.successMessage = "Se ha cancelado la reserva"
        this.callAPImodal(objApi);
    }

    saveRate(optionValue, commentValue){
        var objApi = {};
        objApi.objToSend = {
            "AccessToken": this.props.tokenObj.accesToken,
            "VOReview": {
                "Rating": optionValue,
                "Review": commentValue,
                "IdReservation": this.state.selectedIdRes,
                "Mail": this.props.userData.Mail
            }        
        }
        objApi.fetchUrl = "https://localhost:44372/api/review";
        objApi.method = "POST";
        objApi.responseSuccess = "SUCC_REVIEWCREATED";
        objApi.successMessage = "Calificación realizada correctamente!"
        this.callAPImodal(objApi);
    }

    callAPImodal(objApi){
        this.modalReqInfo.current.changeModalLoadingState(false);
        fetch(objApi.fetchUrl, {
            method: objApi.method,
            header: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify(objApi.objToSend)
        }).then(response => response.json()).then(data => {
            console.log("data:" + JSON.stringify(data));
            if (data.responseCode == objApi.responseSuccess) {
                toast.success(objApi.successMessage, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
                this.loadMyReservations();
                this.modalReqInfo.current.changeModalLoadingState(true);
            } else {
                this.modalReqInfo.current.changeModalLoadingState(false);
                this.handleErrors("Internal error");
            }
        }
        ).catch(error => {
            this.handleErrors(error);
        }
        )
    }

    render() {        
        const { login_status } = this.props;
        if (login_status != 'LOGGED_IN') return <Redirect to='/' />
        if (this.state.generalError) return <Redirect to='/error' />
        return (
            <>
                <>
                {/*SEO Support*/}
                <Helmet>
                    <title>TeamUp | Mis Reservas</title>
                    <meta name="description" content="---" />
                </Helmet>
                {/*SEO Support End */}
                <Header />
                <div className="main-content  full-width  home">
                    <div className="pattern" >
                        <div className="col-md-12 center-column">
                        <h1>Mis Reservas</h1>
                        <ModifyReservationModal ref = {this.modalElement} confirmEditReservation = {this.confirmEditReservation}/>
                        <MyReservedSpacesTable editReservation={this.editReservation} reservations={this.state.reservations} triggerModal={this.triggerModal}/>
                        <ModalReqInfo ref={this.modalReqInfo} modalSave={this.modalSave}
                                modalConfigObj={this.state.modalConfigObj} saveCancel={this.saveCancel} saveRate={this.saveRate}/>
                        </div>
                    </div>
                </div>
                </>
            </>
        );
    }
}
const mapStateToProps = (state) => {
    return {
        login_status: state.loginData.login_status,
        tokenObj: state.loginData.tokenObj,
        userData: state.loginData.userData,
    }
}

export default connect(mapStateToProps)(MyReservedSpacesList);