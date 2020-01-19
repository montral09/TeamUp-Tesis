import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { logOut, updateToken } from '../reducers/auth/actions';
import store from './configureStore'
import { MAIN_URL} from './constants'

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
        case "logIn":
            bindThis.toggleButton();
            let admTokenObj = {
                accesToken : objData.AccessToken,
                refreshToken : objData.RefreshToken
            }
            objApi.dispatch({ type: objApi.typeSuccess, adminData: objData.voAdmin, admTokenObj: admTokenObj});            
        break;
        case "loadPendingPublishers" :
            var sanitizedValues = objData.voUsers.filter(voUsr =>{
                return voUsr.PublisherValidated == false
            })
            bindThis.setState({ 'gestPendApr': sanitizedValues, isLoading: false })
        break;
        case "submitPublisher" : bindThis.setState({ gestPendApr: objApi.newArrIfSuccess }); break;
        case "getUsers" : bindThis.setState ({...bindThis.state, arrData: objData.voUsers, isLoading: false}); break;
        case "updateUser" : 
            bindThis.setState({ 
                modal: !bindThis.state.modal,
                userData: bindThis.state.userData, 
                userDataChanged: bindThis.state.userData
            }); 
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
        case "getPublicationsPendingApproval" : bindThis.setState({ 'publ': objData.Publications, isLoading : false  }); break;
        case "getAllPublications" : bindThis.setState({ 'publ': objData.Publications, isLoading : false }); break;
        case "editPublication" : 
        bindThis.setState({ 
            modal: !bindThis.state.modal,
            publData: bindThis.state.publData, 
            publDataChanged: bindThis.state.publDataChanged
        }); 
        bindThis.props.updateTable()
        break;
        case "getPreferentialPayments" :  bindThis.setState({ 'preferentialPayments': objData.Payments, isLoading : false }); break;
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
            bindThis.setState({ 'paymentsPendingConfirmation': paymentsPendingConfirmation , isLoading : false});
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
            bindThis.setState({ 'paymentsPendingPaid': paymentsPendingPaid , isLoading : false});
            break;
        case "editCommission" :
            bindThis.setState({
                modal: !bindThis.state.modal,
                isLoading: !bindThis.state.isLoading, 
                buttonIsDisabled: !bindThis.state.buttonIsDisabled
            });
            bindThis.props.updateTable(); 
            break;
        case "gestPendApp":
            var sanitizedValues = objData.voUsers.filter(voUsr =>{
                return voUsr.PublisherValidated == false
            })
            bindThis.setState({ 'gestPendApr': sanitizedValues })
            break;
    } 
}

export const callFunctionAfterApiError = (trigger, objData, objApi, bindThis) =>{
    //Check for expired TOKEN
    switch(objData.responseCode){
        case "ERR_INVALIDACCESSTOKEN":
        case "ERR_ACCESSTOKENEXPIRED":
        case "ERR_REFRESHTOKENEXPIRED":
        case "ERR_INVALIDREFRESHTOKEN":
            displayErrorMessage("Su sesión expiró, por favor inicie sesión nuevamente");
            store.dispatch(logOut());
            //handleExpiredToken(objApi, bindThis)
            break;
    }
    switch(trigger){
        case "logIn":
            bindThis.toggleButton();
            objApi.dispatch({ type: objApi.typeError});
        break;
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
            bindThis.setState({
                isLoading: !bindThis.state.isLoading, 
                buttonIsDisabled: !bindThis.state.buttonIsDisabled 
            });
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