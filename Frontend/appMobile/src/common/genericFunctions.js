import { MAIN_URL, MAX_ELEMENTS_PER_TABLE} from './constants';
import { showMessage} from "react-native-flash-message";
import registerForPushNotificationsAsync from './registerForPushNotificationsAsync';

export const handleErrors = (error, bindThis) => {
    displayErrorMessage("Hubo un error, intente nuevamente");
}
export const callAPI = (objApi, bindThis) => {
    if(objApi.method == "GET"){
        fetch(MAIN_URL+objApi.fetchUrl).then(response => response.json()).then(data => {
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
            //registerForPushNotificationsAsync(objData.voUserLog.Mail);
        break;
        case "restoreUser":
            bindThis.setState({isLoading: false});
            bindThis.props.history.push('/account/login');
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
        case "requestBePublisher":
            bindThis.props.navigation.navigate('Home');
        break;     
        case "deleteUser": 
            bindThis.setState({ isLoading: false }); 
            objApi.logOut();
        break;
        case "loadSpaceTypesBR":
            bindThis.setState({ spaceTypes: objData.spaceTypes })
        break;
        case "loadSpaceTypesMPL"    : 
            bindThis.setState({ spaceTypes: objData.spaceTypes, loadingSpaceTypes: false }); 
        break;
        case "changePubStateMPL"    : 
            bindThis.loadMyPublications(); 
        break;
        case "loadMyPublications"   :
            var newTotalPages = Math.round(parseFloat(objData.Publications.length/MAX_ELEMENTS_PER_TABLE));
            if(newTotalPages % 2 != 0){
                newTotalPages=newTotalPages+1;
            }
            var newPagination = [];
            for(var i=1;i<=newTotalPages;i++){
                newPagination.push(i);
            }
            bindThis.setState({ publications: objData.Publications, loadingPubs: false, 
                publicationsToDisplay: bindThis.filterPaginationArray(objData.Publications, 0), pagination: newPagination });   
        
        break;
        case "loadInfraestructureVP": bindThis.setState({ facilities: objData.facilities, infIsLoading: false }); 
        break;
        case "loadPublicationVP":
            var pubObj = objData.Publication;
            pubObj.Favorite = objData.Favorite;
            var defaultPlanSelected = "";
            if (pubObj.HourPrice > 0) { defaultPlanSelected = "HourPrice"; } else if (pubObj.DailyPrice > 0) { defaultPlanSelected = "DailyPrice" } else if (pubObj.WeeklyPrice > 0) { defaultPlanSelected = "WeeklyPrice"; } else if (pubObj.MonthlyPrice > 0) { defaultPlanSelected = "MonthlyPrice"; }
            bindThis.setState({
                pubIsLoading: false, pubObj: pubObj, activeImage: { index: 0, src: pubObj.ImagesURL[0] },
                relatedPublications: objData.RelatedPublications, otherPublicationConfig: objData.OtherPublicationConfig, planChosen: defaultPlanSelected, arrQA : objData.Questions
            });
        break;
        case "saveAnswerVP":
        case "saveQuestionVP":
            bindThis.loadPublicationVP(bindThis.state.pubID);
        break;
        case "loadMyReservationsMRSL":
            var newTotalPages = Math.round(parseFloat(objData.Reservations.length/MAX_ELEMENTS_PER_TABLE));
            var newPagination = [];
            for(var i=1;i<=newTotalPages;i++){
                newPagination.push(i);
            }
            bindThis.setState({ reservations: objData.Reservations, loadingReservations: false,
                reservationsToDisplay: bindThis.filterPaginationArray(objData.Reservations, 0), pagination: newPagination })
        break;
        case "loadMyReservationsRP":
            var newTotalPages = Math.round(parseFloat(objData.Reservations.length/MAX_ELEMENTS_PER_TABLE));
            var newPagination = [];
            for(var i=1;i<=newTotalPages;i++){
                newPagination.push(i);
            }
            bindThis.setState({ reservations: objData.Reservations, loadingReservations: false,
            reservationsToDisplay: bindThis.filterPaginationArray(objData.Reservations, 0), pagination: newPagination })
        break;
        case "confirmEditReservationMRSL":
        case "saveRateMRSL":
        case "saveCustReservationPayment":
        case "saveComissionPayment":
        case "confirmPaymentRP":
        case "rejectPayment":
        case "saveConfirmRP":
        case "saveCancelRP":
            bindThis.props.navigation.goBack()
        break;
        case "loadInfraestructureMP":
            bindThis.setState({ facilities: objData.facilities });
            bindThis.getInfraList();
        break;
        case "loadSpaceTypesFP": 
            bindThis.setState({ spaceTypes: objData.spaceTypes, loadingSpaceTypes: false }); 
        break;
        case "loadMyFavoritePublications": 
            bindThis.setState({ publications: objData.Publications, loadingPubs: false });   
        break;
        case "loadSpaceTypesMP":
            if(bindThis.state.spacetypeSelected == ""){
                var newSpaceTypeSelected = objData.spaceTypes[0].Code;
                var spaceTypeSelectedText = objData.spaceTypes.filter(function(st){
                    return parseInt(st.Code) === parseInt(newSpaceTypeSelected);
                });
                bindThis.setState({ spaceTypes: objData.spaceTypes, spacetypeSelected: newSpaceTypeSelected, spaceTypesLoaded: true, spaceTypeSelectedText: spaceTypeSelectedText[0].Description },
                                () => {bindThis.startSearchMP();})
            }else{
                let sts = bindThis.state.spacetypeSelected;
                var spaceTypeSelectedText = objData.spaceTypes.filter(function(st){
                    return parseInt(st.Code) === parseInt(sts);
                });
                if(!spaceTypeSelectedText){
                    spaceTypeSelectedText = objData.spaceTypes[0].Description;
                    bindThis.setState({ spacetypeSelected: objData.spaceTypes[0].Code})
                }
                bindThis.setState({ spaceTypes: objData.spaceTypes, spaceTypesLoaded: true, spaceTypeSelectedText: spaceTypeSelectedText[0].Description || "" },
                    () => {bindThis.startSearchMP();})
            }
        break;
        case "startSearchMP":
            var newTotalPages = Math.round(parseFloat(objData.TotalPublications/bindThis.state.publicationsPerPage));
            var newPagination = [];
            for(var i=1;i<=newTotalPages;i++){
                newPagination.push(i);
            }
            bindThis.setState({ publicationsLoaded: true, publications:objData.Publications, 
                totalPublications:objData.TotalPublications,totalPages:newTotalPages, pagination: newPagination });
        break;
        case "saveQuestionVP":
            objApi.tabQuestionThis.setState({isLoading : false});
        break;  
        case "submitFavoriteVP":
            bindThis.setState({ pubObj: { ...bindThis.state.pubObj, Favorite: objApi.objToSend.Code === 1 ? true : false } })
        break;
        case "confirmReservationVP":
            bindThis.setState({ isLoading: false, buttonIsDisable: false });
            bindThis.triggerScreen({mode:'"RESSUCC"'});    
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

        break;
    }
    if(objData.responseCode && objApi.errorMSG && objData.responseCode in objApi.errorMSG && objApi.errorMSG[objData.responseCode] && objApi.errorMSG[objData.responseCode] != ""){
        displayErrorMessage(objApi.errorMSG[objData.responseCode]);
    }else{
        handleErrors("Internal error", bindThis)
    }

    switch(trigger){
        case "registerUser":
            bindThis.setState({isLoading: false, buttonIsDisable: false});
            objApi.dispatch({ type: objApi.typeSuccess, messageObj: { responseCode: objData.responseCode, errorMessage: objApi.errorMSG.ERR_MAILALREADYEXIST}});
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

export const displayInfoMessage = (message) =>{
    showMessage({
        message: message,
        type: "info",
      });
}