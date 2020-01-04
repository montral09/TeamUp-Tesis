import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { logOut, updateToken } from '../../services/login/actions';
import store from '../../services/store'

export const handleErrors = (error, bindThis) => {
    bindThis.setState({ generalError: true });
}

export const callAPI = (objApi, bindThis) => {
    console.log("objApi ")
    console.log(objApi)   
    if(objApi.method == "GET"){
        fetch("http://teamup-001-site1.itempurl.com/"+objApi.fetchUrl).then(response => response.json()).then(data => {
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
            alert(error)
            handleErrors(error, bindThis);
        }
        )
    }else{
        fetch("http://teamup-001-site1.itempurl.com/"+objApi.fetchUrl, {
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
            alert(error)
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
        case "loadPublicationCP":
            var pubObj = objData.Publication;
            bindThis.setState({ pubIsLoading: false, spaceName:pubObj.Title, description:pubObj.Description,locationText:pubObj.Address,
                            DailyPrice:pubObj.DailyPrice,HourPrice:pubObj.HourPrice,WeeklyPrice:pubObj.WeeklyPrice,MonthlyPrice:pubObj.MonthlyPrice,
                            city:pubObj.City,geoLat:pubObj.Location.Latitude, geoLng:pubObj.Location.Longitude,facilitiesSelect:pubObj.Facilities,
                            imagesURL:pubObj.ImagesURL,capacity:pubObj.Capacity,availability:pubObj.Availability,youtubeURL:pubObj.VideoURL});
        break;
        case "loadSpaceTypesCP":
            bindThis.setState({ spaceTypes: objData.spaceTypes })
        break;
        case "loadInfraestructureCP":
            bindThis.setState({ facilities: objData.facilities });
        break;
        case "loadPremiumOptionsCP":
            bindThis.setState({ premiumOptions: objData.Plans });
        break;
        case "submitPublicationCP":
            bindThis.props.history.push('/');
        break;
        case "loadMyReservationsMRSL":
            bindThis.setState({ reservations: objData.Reservations, loadingReservations: false })
        break;
        case "confirmEditReservationMRSL":
            bindThis.modalElement.current.changeModalLoadingState(true);                               
            bindThis.loadMyReservationsMRSL();
        break;
        case "saveCancelMRSL":
        case "saveRateMRSL":
            bindThis.modalReqInfo.current.changeModalLoadingState(true);
            bindThis.loadMyReservationsMRSL();
            break;
        case "saveCustReservationPayment":
            bindThis.ModalCustResPay.current.changeModalLoadingState(true);
            bindThis.loadMyReservationsMRSL();
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
            handleExpiredToken(objApi, bindThis)
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
    if(objData.responseCode && objData.responseCode in objApi.errorMSG && objApi.errorMSG[objData.responseCode] && objApi.errorMSG[objData.responseCode] != ""){
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
        objApi.responseSuccess = "SUCC_TOKENSUPDATED";
        objApi.successMessage = "";
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