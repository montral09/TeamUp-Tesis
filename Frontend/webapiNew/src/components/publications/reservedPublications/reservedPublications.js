import React from 'react';
import { Redirect } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import { compose } from 'redux';
import LoadingOverlay from 'react-loading-overlay';
// Multilanguage
import { withTranslate } from 'react-redux-multilingual'
import MyReservedSpacesTable from '../../reservations/myReservedSpaces/myReservedSpacesTable'
import Header from "../../header/header";
import Footer from "../../footer/footer";
import ModalReqInfo from '../viewPublication/modalReqInfo';
import ModalResCustPay from './modalResCustPay'
import ModalResComPay from './modalResComPay';
import { callAPI, displayErrorMessage } from '../../../services/common/genericFunctions';
import { MAX_ELEMENTS_PER_TABLE } from '../../../services/common/constants'

class MyReservedPublications extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loadingReservations: true,
            reservationId: null,
            reservations: [],
            reservationsToDisplay: [],
            loadingStatusChange: false,
            modalConfigObj: {},
            selectedIdRes: null,
            generalError: false,
            selectedResState: "",
            pagination: [1],
            currentPage: 1
        }
        this.modalReqInfo = React.createRef(); // Connects the reference to the modal
        this.ModalResCustPay = React.createRef(); // Connects the reference to the modal
        this.ModalResComPay = React.createRef(); // Connects the reference to the modal
    }

    componentDidMount() {
        window.scrollTo(0, 0);
        this.loadMyReservationsRP();
    }

    // This function will call the API
    loadMyReservationsRP = () => {
        var objApi = {};
        objApi.objToSend = {
            "AccessToken": this.props.tokenObj.accesToken,
            "Mail": this.props.userData.Mail
        }
        objApi.fetchUrl = "api/reservationPublisher";
        objApi.method = "POST";
        objApi.successMSG = {
            SUCC_RESERVATIONSOK: '',
        };
        objApi.functionAfterSuccess = "loadMyReservationsRP";
        objApi.errorMSG = {}
        objApi.logOut = this.props.logOut;
        callAPI(objApi, this);
    }

    changePage = (pageClicked) => {
        this.setState({ reservationsToDisplay: this.filterPaginationArray(this.state.reservations, (pageClicked - 1) * MAX_ELEMENTS_PER_TABLE), currentPage: pageClicked },
            () => this.setState({ reservationsToDisplay: this.filterPaginationArray(this.state.reservations, (pageClicked - 1) * MAX_ELEMENTS_PER_TABLE), currentPage: pageClicked }))
    }

    filterPaginationArray = (arrayToFilter, startIndex) => {
        return arrayToFilter.slice(startIndex, startIndex + MAX_ELEMENTS_PER_TABLE)
    }

    modalSave = () => {
        this.modalReqInfo.current.changeModalLoadingState(true);
    }
    // This function will trigger the modal depending of the values passed
    triggerModal = (mode, IdReservation, auxParam) => {
        let { translate } = this.props
        var modalConfigObj = {};
        switch (mode) {
            case "CANCEL":
                modalConfigObj = {
                    title: translate('reservedPublications_cancelModal_header'), mainText: translate('reservedPublications_cancelModal_body'), mode: mode, saveFunction: "saveCancelRP", textboxLabel: translate('comment_w'),
                    textboxDisplay: true, cancelAvailable: true, confirmAvailable: true, cancelText: translate('no_w'), confirmText: translate('yes_w'), login_status: this.props.login_status
                };
                this.setState({ modalConfigObj: modalConfigObj, selectedIdRes: IdReservation, selectedResState: auxParam }, () => { this.modalReqInfo.current.toggle(); })
                break;
            case "CONFIRM":
                modalConfigObj = {
                    title: translate('reservedPublications_confirmModal_header'), mainText: translate('reservedPublications_confirmModal_body'), mode: mode, saveFunction: "saveConfirmRP",
                    cancelAvailable: true, confirmAvailable: true, cancelText: translate('cancel_w'), confirmText: translate('confirm_w'), login_status: this.props.login_status,
                    dateSelectLabel: translate('reservedPublications_confirmModal_dateSelectLabel'), dateSelectDisplay: true
                };
                this.setState({ modalConfigObj: modalConfigObj, selectedIdRes: IdReservation, selectedResState: auxParam }, () => { this.modalReqInfo.current.toggle(); })
                break;
            case "PAYRESCUST":
                this.ModalResCustPay.current.toggle(auxParam);
                break;
            case "PAYRESCOM":
                this.ModalResComPay.current.toggle(auxParam);
                break;
            case "COMMENT":
                modalConfigObj = {
                    title: this.props.translate('res_publicationsMessageTitle'), mainText: auxParam,
                    textboxDisplay: false, cancelAvailable: true, cancelText: this.props.translate('reservation_modal_ok'), mode: mode, saveFunction: "closeCommentModal"
                };
                this.setState({ modalConfigObj: modalConfigObj, selectedIdRes: IdReservation, selectedResState: auxParam }, () => { this.modalReqInfo.current.toggle(); })
                break;
        }
    }

    // This function will call the API
    saveCancelRP = (commentValue) => {
        var objApi = {};
        objApi.objToSend = {
            "AccessToken": this.props.tokenObj.accesToken,
            "IdReservation": this.state.selectedIdRes,
            "Mail": this.props.userData.Mail,
            "OldState": this.state.selectedResState,
            "NewState": "CANCELED",
            "CanceledReason": commentValue,
            "DateTo": new Date()
        }
        objApi.fetchUrl = "api/reservation";
        objApi.method = "PUT";
        objApi.successMSG = {
            SUCC_RESERVATIONUPDATED: this.props.translate('SUCC_RESERVATIONUPDATED'),
        };
        objApi.functionAfterSuccess = "saveCancelRP";
        objApi.errorMSG = {}
        this.modalReqInfo.current.changeModalLoadingState(false);
        callAPI(objApi, this);
    }

    // This function will call the API
    saveConfirmRP = (dateSelectValue) => {
        if (dateSelectValue == "") {
            displayErrorMessage(this.props.translate('reservedPublications_confirmModal_dateSelectMissingErr'));
        } else {
            var objApi = {};
            objApi.objToSend = {
                "AccessToken": this.props.tokenObj.accesToken,
                "IdReservation": this.state.selectedIdRes,
                "Mail": this.props.userData.Mail,
                "OldState": this.state.selectedResState,
                "NewState": "RESERVED",
                "DateTo": dateSelectValue
            }
            objApi.fetchUrl = "api/reservation";
            objApi.method = "PUT";
            objApi.successMSG = {
                SUCC_RESERVATIONUPDATED: this.props.translate('SUCC_RESERVATIONUPDATED2'),
            };
            objApi.functionAfterSuccess = "saveConfirmRP";
            objApi.errorMSG = {}
            this.modalReqInfo.current.changeModalLoadingState(false);
            callAPI(objApi, this);
        }

    }
    // This function will trigger the proper api calls for each function
    triggerSaveModal = (saveFunction, objData) => {
        switch (saveFunction) {
            case "saveCancelRP": this.saveCancelRP(objData.textboxValue); break;
            case "saveConfirmRP": this.saveConfirmRP(objData.dateSelectValue); break;
            case "closeCommentModal" :this.modalReqInfo.current.changeModalLoadingState(true); break;
        }
    }

    // This function will call the API
    saveComissionPayment = (objPaymentDetails) => {
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
        objApi.fetchUrl = "api/reservationPaymentPublisher";
        objApi.method = "POST";
        objApi.successMSG = {
            SUCC_PAYMENTUPDATED: this.props.translate('SUCC_PAYMENTUPDATED'),
        };
        objApi.functionAfterSuccess = "saveComissionPayment";
        objApi.errorMSG = {}
        console.log("saveComissionPayment")
        console.log(objPaymentDetails)

        console.log(objApi)
        alert("STOP"); return;
        this.ModalResComPay.current.changeModalLoadingState(false);
        callAPI(objApi, this);
    }

    // This function will call the API
    rejetPayment = (objPaymentDetails) => {
        var objApi = {};
        objApi.objToSend = {
            "AccessToken": this.props.tokenObj.accesToken,
            "Mail": this.props.userData.Mail,
            "IdReservation": objPaymentDetails.IdReservation,
            "Approved": false
        }
        objApi.fetchUrl = "api/reservationPaymentCustomer";
        objApi.method = "PUT";
        objApi.successMSG = {
            SUCC_PAYMENTUPDATED: this.props.translate('SUCC_PAYMENTUPDATED2'),
        };
        objApi.functionAfterSuccess = "rejetPayment";
        objApi.errorMSG = {}
        callAPI(objApi, this);
    }

    // This function will call the API
    confirmPaymentRP = (objPaymentDetails) => {
        var objApi = {};
        objApi.objToSend = {
            "AccessToken": this.props.tokenObj.accesToken,
            "Mail": this.props.userData.Mail,
            "IdReservation": objPaymentDetails.IdReservation,
            "Approved": true
        }
        objApi.fetchUrl = "api/reservationPaymentCustomer";
        objApi.method = "PUT";
        objApi.successMSG = {
            SUCC_PAYMENTUPDATED: this.props.translate('SUCC_PAYMENTUPDATED'),
        };
        objApi.functionAfterSuccess = "confirmPaymentRP";
        objApi.errorMSG = {}
        callAPI(objApi, this);
    }

    render() {
        const { translate, userData, login_status } = this.props;
        /* START SECURITY VALIDATIONS */
        if (login_status != 'LOGGED_IN') return <Redirect to='/' />
        // THIS ONE ONLY FOR PUBLISHER PAGES
        if (userData.PublisherValidated != true) return <Redirect to='/' />
        /* END SECURITY VALIDATIONS */
        return (
            <>
                {/*SEO Support*/}
                <Helmet>
                    <title>TeamUp | {translate('res_publications_title')}</title>
                    <meta name="description" content="---" />
                </Helmet>
                {/*SEO Support End */}
                <LoadingOverlay
                    active={this.state.loadingReservations || this.state.loadingStatusChange ? true : false}
                    spinner
                    text={translate('loading_text_small')}
                >
                    <Header />
                    <div className="main-content  full-width  home" style = {{minHeight:"50vh"}}>
                        <div className="pattern" >
                            <div className="col-md-12 center-column">
                                <h1>{translate('res_publications_title')}</h1>
                                <ModalResComPay ref={this.ModalResComPay} saveComissionPayment={this.saveComissionPayment} />
                                <ModalResCustPay ref={this.ModalResCustPay} confirmPayment={this.confirmPaymentRP} rejetPayment={this.rejetPayment} />
                                <ModalReqInfo ref={this.modalReqInfo} modalSave={this.modalSave}
                                    modalConfigObj={this.state.modalConfigObj} triggerSaveModal={this.triggerSaveModal} />
                                <MyReservedSpacesTable isPublisher={true} editReservation={this.editReservation} triggerModal={this.triggerModal}
                                    reservations={this.state.reservationsToDisplay} modalReqInfo={this.modalReqInfo.current} />
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
                </LoadingOverlay >
            </>
        );
    }
}

// Mapping the current state to props, to retrieve useful information from the state
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
export default enhance(MyReservedPublications);