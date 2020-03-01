import React from 'react';
import { Redirect } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
// Multilanguage
import { withTranslate } from 'react-redux-multilingual'
import { compose } from 'redux';
import LoadingOverlay from 'react-loading-overlay';

import Header from "../../header/header";
import Footer from "../../footer/footer";
import MyReservedSpacesTable from './myReservedSpacesTable';
import ModifyReservationModal from './modifyReservationModal';
import ModalReqInfo from '../../publications/viewPublication/modalReqInfo';
import ModalCustResPay from './modalCustResPay'
import { callAPI, displayErrorMessage } from '../../../services/common/genericFunctions';

import { MAX_ELEMENTS_PER_TABLE, ML_MODE } from '../../../services/common/constants'

class MyReservedSpacesList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loadingReservations: true,
            reservationId: null,
            reservations: [],
            reservationsToDisplay: [],
            modalConfigObj: {},
            generalError: false,
            selectedIdRes: null,
            selectedResState: "",
            pagination: [1],
            currentPage: 1
        }
        this.modalElement = React.createRef();
        this.modalReqInfo = React.createRef();
        this.ModalCustResPay = React.createRef();
    }

    componentDidMount() {
        window.scrollTo(0, 0);
        this.loadMyReservationsMRSL();
    }
    changePage = (pageClicked) => {
        this.setState({ reservationsToDisplay: this.filterPaginationArray(this.state.reservations, (pageClicked - 1) * MAX_ELEMENTS_PER_TABLE), currentPage: pageClicked },
            () => this.setState({ reservationsToDisplay: this.filterPaginationArray(this.state.reservations, (pageClicked - 1) * MAX_ELEMENTS_PER_TABLE), currentPage: pageClicked }))
    }

    filterPaginationArray = (arrayToFilter, startIndex) => {
        return arrayToFilter.slice(startIndex, startIndex + MAX_ELEMENTS_PER_TABLE)
    }

    loadMyReservationsMRSL = () => {
        var objApi = {};
        objApi.objToSend = {
            "AccessToken": this.props.tokenObj.accesToken,
            "Mail": this.props.userData.Mail
        }
        objApi.fetchUrl = "api/reservationCustomer";
        objApi.method = "POST";
        objApi.successMSG = {
            SUCC_RESERVATIONSOK: '',
        };
        objApi.functionAfterSuccess = "loadMyReservationsMRSL";
        objApi.errorMSG = {}
        callAPI(objApi, this);
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

    confirmEditReservationMRSL=(modalInfo)=> {
        let {IdReservation, HourFrom, HourTo, TotalPrice, People, ReservedQuantity} = modalInfo.resDataChanged;
        var objApi = {};
        objApi.objToSend = {
            AccessToken: this.props.tokenObj.accesToken,
            Mail: this.props.userData.Mail,
            IdReservation: IdReservation,
            DateFrom: this.convertDate(modalInfo.dateFrom),
            HourFrom: HourFrom,
            HourTo: HourTo,
            TotalPrice: TotalPrice,
            People : People,
            ReservedQuantity : ReservedQuantity
        }
        objApi.fetchUrl = "api/reservationCustomer";
        objApi.method = "PUT";
        objApi.successMSG = {
            SUCC_RESERVATIONUPDATED : this.props.translate('SUCC_RESERVATIONUPDATED1'),
        };
        objApi.functionAfterSuccess = "confirmEditReservationMRSL";
        objApi.functionAfterError = "confirmEditReservationMRSL";
        objApi.errorMSG = {}
        this.modalElement.current.changeModalLoadingState(false);
        callAPI(objApi, this);
    }

    triggerModal = (mode, IdReservation, auxParam) => {
        var modalConfigObj = {};
        switch (mode) {
            
            case "CANCEL":
                modalConfigObj = {
                    title: this.props.translate('myReservedSpacesList_modalCancel_header'), mainText: this.props.translate('myReservedSpacesList_modalCancel_main'), mode: mode, saveFunction: "saveCancelMRSL", textboxLabel: this.props.translate('comment_w'),
                    textboxDisplay: true, cancelAvailable: true, confirmAvailable: true, cancelText: this.props.translate('no_w'), confirmText: this.props.translate('yes_w'), login_status: this.props.login_status
                };
                this.setState({ modalConfigObj: modalConfigObj, selectedIdRes: IdReservation, selectedResState: auxParam }, () => { this.modalReqInfo.current.toggle(); })
                break;
            case "RATE":
                modalConfigObj = {
                    title: this.props.translate('myReservedSpacesList_modalRate_header'), mainText: this.props.translate('myReservedSpacesList_modalRate_main'), mode: mode, saveFunction: "saveRateMRSL", textboxLabel: this.props.translate('comment_w'),
                    textboxDisplay: true, cancelAvailable: true, confirmAvailable: true, cancelText: this.props.translate('cancel_w'), confirmText: this.props.translate('rate_w'), login_status: this.props.login_status,
                    optionDisplay: ML_MODE != 'ON', optionLabel: this.props.translate('score_w'), optionArray: [5, 4, 3, 2, 1]
                };
                this.setState({ modalConfigObj: modalConfigObj, selectedIdRes: IdReservation, selectedResState: auxParam }, () => { this.modalReqInfo.current.toggle(); })
                break;
            case "PAYRESCUST":
                this.ModalCustResPay.current.toggle(auxParam);
                break;

        }
    }

    triggerSaveModal = (saveFunction, objData) => {
        switch (saveFunction) {
            case "saveCancelMRSL": this.saveCancelMRSL(objData.textboxValue); break;
            case "saveRateMRSL": this.saveRateMRSL(objData.optionValue, objData.textboxValue); break;
            case "saveConfirm": this.saveConfirm(); break;
        }
    }

    // This function will call the API
    saveCancelMRSL = (commentValue) => {
        var objApi = {};
        objApi.objToSend = {
            "AccessToken": this.props.tokenObj.accesToken,
            "IdReservation": this.state.selectedIdRes,
            "Mail": this.props.userData.Mail,
            "OldState": this.state.selectedResState,
            "NewState": "CANCELED",
            "CanceledReason": commentValue
        }
        objApi.fetchUrl = "api/reservation";
        objApi.method = "PUT";
        objApi.successMSG = {
            SUCC_RESERVATIONUPDATED: this.props.translate('SUCC_RESERVATIONUPDATED'),
        };
        objApi.functionAfterSuccess = "saveCancelMRSL";
        objApi.errorMSG = {}
        this.modalReqInfo.current.changeModalLoadingState(false);
        callAPI(objApi, this);
    }

    // This function will call the API
    saveRateMRSL = (optionValue, commentValue) => {
        if (!optionValue) {
            optionValue = 5;
        }
        if(ML_MODE == 'ON' && commentValue.trim() == ""){
            displayErrorMessage(this.props.translate('createPub_stepNextError'));
            return;
        }
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
        objApi.fetchUrl = "api/review";
        objApi.method = "POST";
        objApi.successMSG = {
            SUCC_REVIEWCREATED: this.props.translate('SUCC_REVIEWCREATED'),
        };
        objApi.functionAfterSuccess = "saveRateMRSL";
        this.modalReqInfo.current.changeModalLoadingState(false);
        callAPI(objApi, this);
    }
    
    // This function will call the API
    saveCustReservationPayment = (objPaymentDetails) => {
        var objApi = {};
        objApi.objToSend = {
            "AccessToken": this.props.tokenObj.accesToken,
            "Mail": this.props.userData.Mail,
            "IdReservation": objPaymentDetails.IdReservation,
            "Comment": objPaymentDetails.paymentComment || "",
            "Evidence": {
                "Base64String": objPaymentDetails.archivesUpload ? objPaymentDetails.archivesUpload[0].Base64String : null,
                "Extension": objPaymentDetails.archivesUpload ? objPaymentDetails.archivesUpload[0].Extension : null
            }
        }
        objApi.fetchUrl = "api/reservationPaymentCustomer";
        objApi.method = "POST";
        objApi.successMSG = {
            SUCC_PAYMENTUPDATED: this.props.translate('SUCC_PAYMENTUPDATED'),
        };
        objApi.functionAfterSuccess = "saveCustReservationPayment";
        callAPI(objApi, this);
    }

    render() {
        const { login_status, translate } = this.props;
        if (login_status != 'LOGGED_IN') return <Redirect to='/' />
        if (this.state.generalError) return <Redirect to='/error' />

        return (
            <>
                <>
                    {/*SEO Support*/}
                    <Helmet>
                        <title>TeamUp | {translate('myReservedSpacesList_header')}</title>
                        <meta name="description" content="---" />
                    </Helmet>
                    {/*SEO Support End */}
                    <LoadingOverlay
                        active={this.state.loadingReservations}
                        spinner
                        text={translate('loading_text_small')}
                    >
                    <Header />
                    <div className="main-content  full-width  home" style = {{minHeight:"50vh"}}>
                        <div className="pattern" >
                            <div className="col-md-12 center-column">
                                <h1>{translate('myReservedSpacesList_header')}</h1>
                                <ModifyReservationModal ref={this.modalElement} confirmEditReservation={this.confirmEditReservationMRSL} />
                                <ModalCustResPay ref={this.ModalCustResPay} saveCustReservationPayment={this.saveCustReservationPayment} />
                                <MyReservedSpacesTable editReservation={this.editReservation} reservations={this.state.reservationsToDisplay} triggerModal={this.triggerModal} />
                                <ModalReqInfo ref={this.modalReqInfo} modalSave={this.modalSave} triggerSaveModal={this.triggerSaveModal}
                                    modalConfigObj={this.state.modalConfigObj} />

                                <br />
                                <div className="row pagination-results">
                                    <div className="col-md-6 text-left">
                                        <ul className="pagination">
                                            {this.state.pagination.map(page => {
                                                return (
                                                    <li className={this.state.currentPage === page ? 'active' : ''} key={page}><a href="#pagination" onClick={() => this.changePage(page)}>{page}</a></li>
                                                );
                                            })}
                                        </ul>
                                    </div>
                                    <div className="col-md-6 text-right">{translate('showing_w')} {MAX_ELEMENTS_PER_TABLE * this.state.currentPage < this.state.reservations.length ? MAX_ELEMENTS_PER_TABLE * this.state.currentPage : this.state.reservations.length} {translate('reservations_w')} {translate('of_w')} {this.state.reservations.length}</div>
                                </div>
                            </div>
                        </div>

                    </div>
                    <br />
                    <Footer /> 
                    </LoadingOverlay>
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
const enhance = compose(
    connect(mapStateToProps, null),
    withTranslate
)
export default enhance(MyReservedSpacesList);