import { MAIN_URL, MAIN_URL_WEB} from './constants';
import { showMessage, hideMessage } from "react-native-flash-message";

export const handleErrors = (error, bindThis) => {
    console.log("handleErrors: "+error)
    displayErrorMessage("Hubo un error, intente nuevamente");
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
        case "registerUser":
            objApi.dispatch({ type: objApi.typeSuccess, userData: objApi.objToSend});
        break;
        case "logIn":
            bindThis.setState({ isLoading: false });
            displaySuccessMessage(objApi.successMessage + objData.voUserLog.Name)
            objApi.dispatch({ type: objApi.typeSuccess, userData: objData.voUserLog, tokenObj: {
                accesToken : objData.AccessToken,
                refreshToken : objData.RefreshToken,
            }});
        break;
        case "modifyUser":
            bindThis.setState({ isLoading: false });
            if(objApi.emailChanged){
                bindThis.props.logOut();
                bindThis.props.navigation.navigate('Login')
            }else{
                try{
                    bindThis.props.modifyData({
                        Mail: bindThis.state.originalEmail,
                        Name: bindThis.state.firstName,
                        LastName: bindThis.state.lastName,
                        Phone: bindThis.state.phone,
                        Rut: bindThis.state.rut,
                        RazonSocial: bindThis.state.razonSocial,
                        Address: bindThis.state.address,
                        Language: 'es'
                    });
                }catch(error){}
            }
        break;        
        case "deleteUser": bindThis.setState({ isLoading: false }); objApi.logOut();break;

    }
}

export const callFunctionAfterApiError = (trigger, objData, objApi, bindThis) =>{
    //Check for expired TOKEN
    switch(objData.responseCode){
        case "ERR_INVALIDACCESSTOKEN":
        case "ERR_ACCESSTOKENEXPIRED":
        case "ERR_REFRESHTOKENEXPIRED":
        case "ERR_INVALIDREFRESHTOKEN":
            //handleExpiredToken(objApi, bindThis)
            break;
    }
    console.log("callFunctionAfterApiError objData.responseCode = "+objData.responseCode)
    console.log("callFunctionAfterApiError objApi.errorMSG = "+JSON.stringify(objApi.errorMSG))

    if(objData.responseCode && objApi.errorMSG && objData.responseCode in objApi.errorMSG && objApi.errorMSG[objData.responseCode] && objApi.errorMSG[objData.responseCode] != ""){
        displayErrorMessage(objApi.errorMSG[objData.responseCode]);
    }else{
        handleErrors("Internal error", bindThis)
    }

    switch(trigger){
        case "registerUser":
            //bindThis.setState({isLoading: false, buttonIsDisable: false});
            //objApi.dispatch({ type: objApi.typeSuccess, messageObj: { responseCode: objData.responseCode, errorMessage: objApi.errorMSG.ERR_MAILALREADYEXIST}});
        break;
        case "logIn":
            bindThis.setState({ isLoading: false });
            objApi.dispatch({type: objApi.typeError}); 
        break;
        case "modifyUser":
            bindThis.setState({ isLoading: false });
        break;
        case "deleteUser": bindThis.setState({ isLoading: false });break;
        default:
    }

}

export const displayErrorMessage = (message) =>{
    showMessage({
        message: message,
        type: "danger",
      });
}

export const displaySuccessMessage = (message) =>{
    showMessage({
        message: message,
        type: "success",
      });
}