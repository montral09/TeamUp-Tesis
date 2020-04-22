import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { logOut, updateToken } from '../reducers/auth/actions';
import store from './configureStore'
import { MAIN_URL, MAX_ELEMENTS_PER_TABLE} from './constants'

export const handleErrors = (error, bindThis) => {
    displayErrorMessage('Hubo un error');
}

export const callAPI = (objApi, bindThis) => {
    console.log("objApi ")
    console.log(objApi)   
    if(objApi.method == "GET"){
        fetch(MAIN_URL+objApi.fetchUrl).then(response => response.json()).then(data => {
            console.log("data.responseCode "+data.responseCode)
            console.log(data)   
            if (data.responseCode && objApi.successMSG && data.responseCode in objApi.successMSG) {
                if(objApi.successMSG[data.responseCode] && objApi.successMSG[data.responseCode] != ""){
                    displaySuccessMessage(objApi.successMSG[data.responseCode]);
                }
                callFunctionAfterApiSuccess(objApi.functionAfterSuccess, data, objApi, bindThis);
            } else {
                callFunctionAfterApiError(objApi.functionAfterError, data, objApi, bindThis);
            }
        }
        ).catch(error => {
            handleErrors(error, bindThis);
        }
        )
    }else{
        fetch(MAIN_URL+objApi.fetchUrl, {
            method: objApi.method,
            header: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify(objApi.objToSend)
        }).then(response => response.json()).then(data => {
            console.log("data.responseCode "+data.responseCode)
            console.log(data)
            if (data.responseCode && objApi.successMSG && data.responseCode in objApi.successMSG) {
                if(objApi.successMSG[data.responseCode] && objApi.successMSG[data.responseCode] != ""){
                    displaySuccessMessage(objApi.successMSG[data.responseCode]);
                }
                callFunctionAfterApiSuccess(objApi.functionAfterSuccess, data, objApi, bindThis);
            } else {
                callFunctionAfterApiError(objApi.functionAfterError, data, objApi, bindThis);
            }
        }
        ).catch(error => {
            handleErrors(error, bindThis);
        }
        )
    }
    
}

export const callFunctionAfterApiSuccess = (trigger, objData, objApi, bindThis) =>{
    switch(trigger){
        case "updateExpiredToken" : 
            store.dispatch(updateToken({AccessToken: objData.AccessToken, RefreshToken: objData.RefreshToken}));
            objApi.retryObjApi.objToSend.AccessToken = objData.AccessToken;
            callAPI(objApi.retryObjApi, bindThis);
            break;
        case "updateReservatonsStates" : 
            bindThis.loadReservations();
            break;
        case "logIn":
            bindThis.toggleButton();
            let admTokenObj = {
                accesToken : objData.AccessToken,
                refreshToken : objData.RefreshToken
            }
            objApi.dispatch({ type: objApi.typeSuccess, adminData: objData.voAdmin, admTokenObj: admTokenObj});            
        break;
        case "loadReservations":
            bindThis.setState({ 'reservations': objData.Reservations, reservationsToDisplay: filterInitialElementsToDisplay(objData.Reservations), isLoading : false  })
        break;
        case "loadPendingPublishers" :
            var sanitizedValues = objData.voUsers.filter(voUsr =>{
                return voUsr.PublisherValidated == false
            })
            bindThis.setState({ 'gestPendApr': sanitizedValues,'gestPendAprToDisplay': filterInitialElementsToDisplay(sanitizedValues) ,isLoading: false })
        break;
        case "submitPublisher" : bindThis.setState({ gestPendApr: objApi.newArrIfSuccess, isLoading: false, processing:false }); bindThis.loadPendingPublishers(); break;
        case "getUsers" : bindThis.setState ({...bindThis.state, arrDataUsers: objData.voUsers, arrDataUsersToDisplay: filterInitialElementsToDisplay(objData.voUsers), isLoading: false}); break;
        case "updateUser" : 
            bindThis.setState({ 
                userData: bindThis.state.userData, 
                userDataChanged: bindThis.state.userData
            }); 
            bindThis.changeModalLoadingState(true);
            bindThis.props.updateTable()
            break;
        case "loadFacilities" : bindThis.setState({ facilities: objData.facilities}); break;
        case "changePublicationTransition" :         
            bindThis.setState({
                modal: !bindThis.state.modal,
                isLoading: !bindThis.state.isLoading, 
                buttonIsDisabled: !bindThis.state.buttonIsDisabled
            });
            bindThis.props.updateTable(); 
            break;
        case "getPublicationsPendingApproval" : bindThis.setState({ 'publ': objData.Publications,publToDisplay: filterInitialElementsToDisplay(objData.Publications), isLoading : false  }); break;
        case "getAllPublications" : bindThis.setState({ 'allPubl': objData.Publications, allPublToDisplay: filterInitialElementsToDisplay(objData.Publications), isLoading : false }); break;
        case "editPublication" : 
        bindThis.setState({ 
            modal: !bindThis.state.modal,
            publData: bindThis.state.publData, 
            publDataChanged: bindThis.state.publDataChanged
        }); 
        bindThis.props.updateTable()
        break;
        case "getPreferentialPayments" :
            var paymentsPendingConfirmation = objData.Payments.filter(ppayment => {
                return ppayment.PreferentialPlanState === 'PENDING CONFIRMATION'
            });

            var paymentsPendingPay = objData.Payments.filter(ppayment => {
                return ppayment.PreferentialPlanState === 'PENDING PAYMENT'
            });

            var paymentsAll = objData.Payments;

            bindThis.setState({ 'preferentialPaymentsPendPay': paymentsPendingPay, preferentialPaymentsPendPayToDisplay : filterInitialElementsToDisplay(paymentsPendingPay), 'paymentsAll' : paymentsAll, 
                                paymentsAllToDisplay : filterInitialElementsToDisplay(paymentsAll), 'preferentialPaymentsPendConf' : paymentsPendingConfirmation, 
                                'preferentialPaymentsPendConfToDisplay' : filterInitialElementsToDisplay(paymentsPendingConfirmation)}); 
        break;
        case "appRejPreferentialPayment" : 
            bindThis.setState({
            modal: !bindThis.state.modal,
            isLoading: !bindThis.state.isLoading, 
            buttonIsDisabled: !bindThis.state.buttonIsDisabled
        });
        bindThis.props.updateTable(); 
        break;
        case "getPendingCommissions" :
            var commissions = objData.Commissions;
            var paymentsPendingConfirmation = commissions.filter(commission => {
                return commission.CommissionState === 'PENDING CONFIRMATION'
            });             
            bindThis.setState({ 'paymentsPendingConfirmation': paymentsPendingConfirmation, 
                    paymentsPendingConfirmationToDisplay : filterInitialElementsToDisplay(paymentsPendingConfirmation), 
                    paymentsComission : commissions, paymentsComissionToDisplay : filterInitialElementsToDisplay(commissions)});
        break;
        case "appRejCommissionPayment" :
            bindThis.setState({
                modal: !bindThis.state.modal,
                isLoading: !bindThis.state.isLoading, 
                buttonIsDisabled: !bindThis.state.buttonIsDisabled
            });
            bindThis.props.updateTable(); 
        break;
        case "getCommissionsUnpaid" :
            var commissions = objData.Commissions;
            var paymentsPendingPaid = commissions.filter(commission => {
                return commission.CommissionState === 'PENDING PAYMENT'
            });                
            bindThis.setState({ 'paymentsPendingPaid': paymentsPendingPaid , paymentsPendingPaidToDisplay : filterInitialElementsToDisplay(paymentsPendingPaid)});
        break;
        case "editCommission" :
            bindThis.modalElementUpdate.current.toggleLoading(true);
            bindThis.loadCommissionsUnpaid(); 
            break;
        case "gestPendApp":
            var sanitizedValues = objData.voUsers.filter(voUsr =>{
                return voUsr.PublisherValidated == false
            })
            bindThis.setState({ 'gestPendApr': sanitizedValues , 'gestPendAprToDisplay': filterInitialElementsToDisplay(sanitizedValues) })
        break;
        case "loadSpaceTypes":
            bindThis.setState({ spaceTypes: objData.spaceTypes })
        break;
        case "pauseUnpausePub":
            bindThis.loadAllPublications();
        break;
    } 
}

export const filterInitialElementsToDisplay = (originalArray) => {
    return originalArray.slice(0, MAX_ELEMENTS_PER_TABLE)
}

// This function will translate the diferent status to text
export const translateStates = (states) => {

    var textToReturn = "";
    switch(states){
        case "ACTIVE": textToReturn="Activo"; break;
        case "FINISHED": textToReturn="Finalizado"; break;
        case "REJECTED": textToReturn="Rechazado"; break;
        case "PAUSED A": textToReturn="Pausado Admin"; break;
        case "PAUSED P": textToReturn="Pausado Gestor"; break;
        case "NOT VALIDATED" : textToReturn="Sin validar"; break;
        case "PENDING": textToReturn="Pendiente"; break;
        case "RESERVED": textToReturn="Reservado"; break;
        case "IN PROGRESS": textToReturn="En progreso"; break;
        case "CANCELED": textToReturn="Cancelado"; break;
        case "PENDING PAYMENT" : textToReturn="Pendiente de pago"; break;
        case "PENDING CONFIRMATION": textToReturn="Pendiente de aprobación"; break;
        case "PAID": textToReturn="Pago"; break;
    }
    return textToReturn;
}

export const callFunctionAfterApiError = (trigger, objData, objApi, bindThis) =>{

    //Check for expired TOKEN
    if (objData.responseCode == 'ERR_INVALIDACCESSTOKEN' || 
        objData.responseCode == 'ERR_ACCESSTOKENEXPIRED' || 
        objData.responseCode == 'ERR_REFRESHTOKENEXPIRED' ||
        objData.responseCode == 'ERR_INVALIDREFRESHTOKEN') {
            displayErrorMessage("Su sesión expiró, por favor inicie sesión nuevamente");
            store.dispatch(logOut());
            return;
        }  
    switch(trigger){
        case "logIn":
            bindThis.toggleButton();
            objApi.dispatch({ type: objApi.typeError});
        break;
        case "submitPublisher" : bindThis.setState({ isLoading: false }); break;
        case "registerUser":
            bindThis.setState({isLoading: false, buttonIsDisable: false});
        break;
        case "appRejPreferentialPayment":
            bindThis.setState({
                isLoading: !bindThis.state.isLoading, 
                buttonIsDisabled: !bindThis.state.buttonIsDisabled 
            });
        break;
        case "editCommission":
            bindThis.modalElementUpdate.current.toggleLoading(false);
        default:
    }
    if(objData.responseCode && objApi.errorMSG && objData.responseCode in objApi.errorMSG && objApi.errorMSG[objData.responseCode] && objApi.errorMSG[objData.responseCode] != ""){
        displayErrorMessage(objApi.errorMSG[objData.responseCode]);
    }else{
        handleErrors("Internal error", bindThis)
    }
}

export const handleExpiredToken = (retryObjApi, bindThis) =>{
    if(retryObjApi.functionAfterSuccess == "updateExpiredToken"){
        // This is the second attempt -> Log off
        displayErrorMessage("Su sesión expiró, por favor inicie sesión nuevamente");
        store.dispatch(logOut());
    }else{
        var objApi = {};
        objApi.retryObjApi = retryObjApi;
        objApi.objToSend = {
            "RefreshToken": bindThis.props.tokenObj.refreshToken,
            "Mail": bindThis.props.userData.Mail
        }
        objApi.fetchUrl = "api/tokens";
        objApi.method = "PUT";
        objApi.successMSG = {
            SUCC_TOKENSUPDATED : '',
        };
        objApi.functionAfterError = "updateExpiredToken"
        objApi.functionAfterSuccess = "updateExpiredToken";
        callAPI(objApi, bindThis);
    }

}

export const displayErrorMessage = (message) =>{
    toast.error(message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
    });
}

export const displaySuccessMessage = (message) =>{
    toast.success(message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
    });
}