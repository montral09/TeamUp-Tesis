import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { logOut, updateToken } from '../../services/login/actions';
import store from '../../services/store';
import { MAIN_URL, MAIN_URL_WEB, MAX_ELEMENTS_PER_TABLE} from './constants';

export const handleErrors = (error, bindThis) => {
    displayErrorMessage("Hubo un error, intente nuevamente");   
    window.open(MAIN_URL_WEB+"error", "_self");
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
        case "deleteUser":bindThis.toggleButton(); objApi.logOut();break;
        case "loadInfraestructureVP": bindThis.setState({ facilities: objData.facilities, infIsLoading: false }); break;

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
        case "submitFavoriteVP":
            bindThis.setState({ pubObj: { ...bindThis.state.pubObj, Favorite: objApi.objToSend.Code === 1 ? true : false },pubIsLoading: false })
        break;
        case "confirmReservationVP":
            bindThis.setState({ isLoading: false, buttonIsDisable: false });
            bindThis.modalSummaryElement.current.changeModalLoadingState(true);
            bindThis.triggerModal({mode:'"RESSUCC"'});
        break;
        case "saveAnswerVP":
        case "saveQuestionVP":
            objApi.tabQuestionThis.setState({isLoading : false});
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
            bindThis.setState({isLoading: false, isValid: true});
            bindThis.props.history.push('/account/login');
        break;

        case "loadMessages":
            var newTotalPages = Math.round(parseFloat(objData.Messages.length/MAX_ELEMENTS_PER_TABLE));
            if(newTotalPages % 2 != 0){
                newTotalPages=newTotalPages+1;
            }
            var newPagination = [];
            for(var i=1;i<=newTotalPages;i++){
                newPagination.push(i);
            }
            bindThis.setState({ messages: objData.Messages, loadingMessages: false,
                messagesToDisplay: bindThis.filterPaginationArray(objData.Messages, 0), pagination: newPagination })
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
        case "loadInfraestructureMP":
            bindThis.setState({ facilities: objData.facilities });
        break;
        case "loadPremiumOptionsCP":
            bindThis.setState({ premiumOptions: objData.Plans });
        break;
        case "submitPublicationCP":
            bindThis.props.history.push('/');
        break;
        case "loadMyReservationsMRSL":
            var newTotalPages = Math.round(parseFloat(objData.Reservations.length/MAX_ELEMENTS_PER_TABLE));
            if(newTotalPages % 2 != 0){
                newTotalPages=newTotalPages+1;
            }
            var newPagination = [];
            for(var i=1;i<=newTotalPages;i++){
                newPagination.push(i);
            }
            bindThis.setState({ reservations: objData.Reservations, loadingReservations: false,
                reservationsToDisplay: bindThis.filterPaginationArray(objData.Reservations, 0), pagination: newPagination })
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
        case "registerUser":
            objApi.dispatch({ type: objApi.typeSuccess, userData: objApi.objToSend});
        break;
        case "logIn":
            bindThis.toggleButton();
            displaySuccessMessage(objApi.successMessage + objData.voUserLog.Name)
            objApi.dispatch({ type: objApi.typeSuccess, userData: objData.voUserLog, tokenObj: {
                accesToken : objData.AccessToken,
                refreshToken : objData.RefreshToken,
            }});
        break;
        case "requestBePublisher":
            objApi.handleClose();
        break;
        case "loadSpaceTypesBR":
            bindThis.setState({ spaceTypes: objData.spaceTypes })
        break;
        case "loadSpaceTypesRP" : bindThis.setState({ spaceTypes: objData.spaceTypes }, () => {bindThis.loadRecommendedPubs()}); break;
        case "loadRecommendedPubs":
            var finalRecommended = objData.Recommended;
            const spaceTypes = bindThis.state.spaceTypes;
            finalRecommended.forEach(element => {
                const spaceType = spaceTypes.filter(space => {
                    return space.Code === element.SpaceType
                });
                element.SpaceTypeDesc = spaceType[0].Description;    
            });
            bindThis.setState({ recommendedPublications: finalRecommended});
        break;
        case "loadMyFavoritePublications"   : bindThis.setState({ publications: objData.Publications, loadingPubs: false });   break;
        case "loadSpaceTypesFP"             : bindThis.setState({ spaceTypes: objData.spaceTypes, loadingSpaceTypes: false }); break;
        case "startSearchMP":
            var newTotalPages = Math.round(parseFloat(objData.TotalPublications/bindThis.state.publicationsPerPage));
            if(newTotalPages % 2 != 0){
                newTotalPages=newTotalPages+1;
            }
            var newPagination = [];
            for(var i=1;i<=newTotalPages;i++){
                newPagination.push(i);
            }
            bindThis.setState({ publicationsLoaded: true, publications:objData.Publications, 
                totalPublications:objData.TotalPublications,totalPages:newTotalPages, pagination: newPagination });
        break;
        case "loadSpaceTypesMPL"    : bindThis.setState({ spaceTypes: objData.spaceTypes, loadingSpaceTypes: false }); break;
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
        case "changePubStateMPL"    : bindThis.loadMyPublications(); break;
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
        case "confirmPayment"       : bindThis.ModalDetailPayment.current.changeModalLoadingState(true); bindThis.loadMyPublications(); break;
        case "saveComissionPayment":
            bindThis.ModalResComPay.current.changeModalLoadingState(true);
            bindThis.loadMyReservationsRP();
            break;
        case "saveConfirmRP":
        case "saveCancelRP":
            bindThis.loadMyReservationsRP();
            bindThis.modalReqInfo.current.changeModalLoadingState(true);
            break;
        case "confirmPaymentRP":
        case "rejetPayment":
            bindThis.loadMyReservationsRP();
            bindThis.ModalResCustPay.current.changeModalLoadingState(true);
        break;

        case "loadMyReservationsRP":
            var newTotalPages = Math.round(parseFloat(objData.Reservations.length/MAX_ELEMENTS_PER_TABLE));
            if(newTotalPages % 2 != 0){
                newTotalPages=newTotalPages+1;
            }
            var newPagination = [];
            for(var i=1;i<=newTotalPages;i++){
                newPagination.push(i);
            }
            bindThis.setState({ reservations: objData.Reservations, loadingReservations: false,
                reservationsToDisplay: bindThis.filterPaginationArray(objData.Reservations, 0), pagination: newPagination })
        break;
    }
}

export const callFunctionAfterApiError = (trigger, objData, objApi, bindThis) =>{
    //Check for expired TOKEN
    if (objData.responseCode == 'ERR_INVALIDACCESSTOKEN' || 
        objData.responseCode == 'ERR_ACCESSTOKENEXPIRED' || 
        objData.responseCode == 'ERR_REFRESHTOKENEXPIRED' ||
        objData.responseCode == 'ERR_INVALIDREFRESHTOKEN') {
            handleExpiredToken(objApi, bindThis)
            return;
        }  

    switch(trigger){
        case "registerUser":
            bindThis.setState({isLoading: false, buttonIsDisable: false});
        break;
        case "restoreUser":
            bindThis.setState({isLoading: false});
        break;
        case "registerUser":
            objApi.dispatch({ type: objApi.typeSuccess, messageObj: { responseCode: objData.responseCode, errorMessage: objApi.errorMSG.ERR_MAILALREADYEXIST}});
        break;
        case "logIn":
            bindThis.toggleButton(); objApi.dispatch({type: objApi.typeError}); 
        break;
        case "deleteUser":bindThis.toggleButton();break;
        case "confirmReservationVP":
            bindThis.modalSummaryElement.current.changeModalLoadingState(false);
        break;
        case "validateEmail":
            bindThis.setState({isLoading: false, isvalid: false});
        break;
        case "saveQuestionVP":
            objApi.tabQuestionThis.setState({isLoading : false});
        break;        
        default:
    }
    console.log("objData.responseCode + "+objData.responseCode)
    console.log("objApi.errorMSG + "+objApi.errorMSG)

    if(objData.responseCode && objApi.errorMSG && objData.responseCode in objApi.errorMSG && objApi.errorMSG[objData.responseCode] && objApi.errorMSG[objData.responseCode] != ""){
        displayErrorMessage(objApi.errorMSG[objData.responseCode]);
    }else{
        handleErrors("Internal error", bindThis)
    }
}

export const handleExpiredToken = (retryObjApi, bindThis) =>{
    if(retryObjApi.functionAfterSuccess == "updateExpiredToken"){
        // This is the second attempt -> Log off
        store.dispatch(logOut());
        try {
            displayErrorMessage (bindThis.props.translate('sessionExpired'));
        } catch (error) {
            displayErrorMessage ('Su sesion expiro/ Your session has expired');
        }
        
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
        objApi.functionAfterSuccess = "updateExpiredToken";
        objApi.errorMSG= {
            ERR_REFRESHTOKENEXPIRED : '',
        };
        objApi.functionAfterError = "updateExpiredToken";
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