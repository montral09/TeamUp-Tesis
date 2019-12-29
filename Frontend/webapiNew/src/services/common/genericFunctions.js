import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const handleErrors = (error, bindThis) => {
    bindThis.setState({ generalError: true });
}

export const callAPI = (objApi, bindThis) => {
    if(objApi.method == "GET"){
        fetch("https://localhost:44372/"+objApi.fetchUrl).then(response => response.json()).then(data => {
            console.log("data.responseCode "+data.responseCode)
            console.log(data)   
            if (data.responseCode && data.responseCode in objApi.successMSG) {
                if(objApi.successMSG[data.responseCode] && objApi.successMSG[data.responseCode] != ""){
                    displaySuccessMessage(objApi.successMSG[data.responseCode]);
                }
                callFunctionAfterApiSuccess(objApi.functionAfterSuccess, data, objApi, bindThis);
            } else {
                callFunctionAfterApiError(objApi.functionAfterError, data, objApi, bindThis);
            }
        }
        ).catch(error => {
            alert(error)
            handleErrors(error, bindThis);
        }
        )
    }else{
        fetch("https://localhost:44372/"+objApi.fetchUrl, {
            method: objApi.method,
            header: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify(objApi.objToSend)
        }).then(response => response.json()).then(data => {
            console.log("data.responseCode "+data.responseCode)
            console.log(data)
            if (data.responseCode in objApi.successMSG) {
                if(objApi.successMSG[data.responseCode] && objApi.successMSG[data.responseCode] != ""){
                    displaySuccessMessage(objApi.successMSG[data.responseCode]);
                }
                callFunctionAfterApiSuccess(objApi.functionAfterSuccess, data, objApi, bindThis);
            } else {
                callFunctionAfterApiError(objApi.functionAfterError, data, objApi, bindThis);
            }
        }
        ).catch(error => {
            alert(error)
            handleErrors(error, bindThis);
        }
        )
    }
    
}

export const callFunctionAfterApiSuccess = (trigger, objData, objApi, bindThis) =>{
    switch(trigger){
        case "deleteUser":objApi.logOut();break;
        case "loadInfraestructureVP": bindThis.setState({ facilities: objData.facilities, infIsLoading: false }); break;

        case "loadPublicationVP":
            var pubObj = objData.Publication;
            pubObj.Favorite = objData.Favorite;
            var defaultPlanSelected = "";
            if (pubObj.HourPrice > 0) { defaultPlanSelected = "HourPrice"; } else if (pubObj.DailyPrice > 0) { defaultPlanSelected = "DailyPrice" } else if (pubObj.WeeklyPrice > 0) { defaultPlanSelected = "WeeklyPrice"; } else if (pubObj.MonthlyPrice > 0) { defaultPlanSelected = "MonthlyPrice"; }
            bindThis.setState({
                pubIsLoading: false, pubObj: pubObj, activeImage: { index: 0, src: pubObj.ImagesURL[0] },
                relatedPublications: objData.RelatedPublications, planChosen: defaultPlanSelected, arrQA : objData.Questions
            });
        break;
        case "submitFavoriteVP":
            bindThis.setState({ pubObj: { ...bindThis.state.pubObj, Favorite: objApi.objToSend.Code === 1 ? true : false } })
        break;
        case "confirmReservationVP":
            bindThis.setState({ isLoading: false, buttonIsDisable: false });
            bindThis.modalSummaryElement.current.changeModalLoadingState(true);
            bindThis.triggerModal({mode:'"RESSUCC"'});
        break;
        case "saveAnswerVP":
        case "saveQuestionVP":
            bindThis.modalReqInfo.current.changeModalLoadingState(true);
            bindThis.loadPublicationVP(bindThis.state.pubID);
        break;

        case "modifyUser":
            if(objApi.emailChanged){
                objApi.logOut()
                bindThis.props.history.push('/account/login');
            }else{
                bindThis.props.modifyData({
                    Mail: bindThis.state.originalEmail,
                    Name: bindThis.state.firstName,
                    LastName: bindThis.state.lastName,
                    Phone: bindThis.state.phone,
                    Rut: bindThis.state.rut,
                    RazonSocial: bindThis.state.razonSocial,
                    Address: bindThis.state.address,
                    Language: bindThis.state.Language
                });
                bindThis.props.history.push('/');
            }
        break;
        case "registerUser":
            bindThis.props.history.push('/account/login')
        break;

        case "validateEmail":
            bindThis.setState({isLoading: false});
            bindThis.props.history.push('/account/login');
        break;

        case "loadMessages":
            bindThis.setState({messages: objData.Messages, loadingMessages: false});
        break;
        
        case "saveAnswerMSG":
            bindThis.modalReqInfo.current.changeModalLoadingState(true);
            bindThis.loadMessages();
        break;
        case "restoreUser":
            bindThis.setState({isLoading: false});
            bindThis.props.history.push('/account/login');
        break;
    }
}

export const callFunctionAfterApiError = (trigger, objData, objApi, bindThis) =>{

    //Check for expired TOKEN
    switch(objData.responseCode){
        case "ERR_INVALIDACCESSTOKEN":
        case "ERR_ACCESSTOKENEXPIRED":
        case "ERR_INVALIDREFRESHTOKEN":
            bindThis.handleExpiredToken(objApi, bindThis)
            break;
    }

    switch(trigger){
        case "registerUser":
            bindThis.setState({isLoading: false, buttonIsDisable: false});
        break;
        case "restoreUser":
            bindThis.setState({isLoading: false});
        break;
        default:
    }
    if(objData.responseCode in objApi.errorMSG && objApi.errorMSG[objData.responseCode] && objApi.errorMSG[objData.responseCode] != ""){
        displayErrorMessage(objApi.errorMSG[objData.responseCode]);
    }else{
        handleErrors("Internal error", bindThis)
    }
}

export const handleExpiredToken = (retryObjApi, bindThis) =>{
    if(retryObjApi.functionAfterSuccess == "updateExpiredToken"){
        // This is the second attempt -> Log off
        //this.props.logOut();
        displayErrorMessage("Su sesión expiró, por favor inicie sesión nuevamente");
    }else{
        var objApi = {};
        objApi.objToSend = {
            "RefreshToken": this.props.tokenObj.refreshToken,
            "Mail": this.props.userData.Mail
        }
        objApi.fetchUrl = "https://localhost:44372/api/tokens";
        objApi.method = "PUT";
        objApi.responseSuccess = "SUCC_TOKENSUPDATED";
        objApi.successMessage = "";
        objApi.functionAfterSuccess = "updateExpiredToken";
        objApi.retryObjApi = retryObjApi;
        bindThis.callAPI(objApi, bindThis);
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