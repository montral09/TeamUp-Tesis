import { toast } from 'react-toastify';

export const handleErrors = (error, bindThis) => {
    bindThis.setState({ generalError: true });
}

export const callAPI = (objApi, bindThis) => {
    if(objApi.method == "GET"){
        fetch(objApi.fetchUrl).then(response => response.json()).then(data => {
            if (data.responseCode == objApi.responseSuccess) {
                if(objApi.successMessage != ""){
                    toast.success(objApi.successMessage, {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                    });
                }
                bindThis.callFunctionAfterApiSuccess(objApi.functionAfterSuccess, data, objApi);
            } else {
                bindThis.callFunctionAfterApiError(objApi.functionAfterError, data, objApi);
            }
        }
        ).catch(error => {
            alert(error)
            handleErrors(error, bindThis);
        }
        )
    }else{
        fetch(objApi.fetchUrl, {
            method: objApi.method,
            header: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify(objApi.objToSend)
        }).then(response => response.json()).then(data => {
            if (data.responseCode in objApi.successMSG) {
                if(objApi.successMSG[objApi.responseSuccess] != ""){
                    toast.success(objApi.successMessage, {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                    });
            }
                bindThis.callFunctionAfterApiSuccess(objApi.functionAfterSuccess, data, bindThis);
            } else {
                bindThis.callFunctionAfterApiError(objApi.functionAfterError, data, objApi, bindThis);
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
        case "deleteUser":
            objApi.logOut();
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
        case "deleteUser":
            if(objApi.errorMSG[objData.responseCode]){
                toast.error(objApi.errorMSG[objData.responseCode], {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
            }
            break;
        default: bindThis.handleErrors("Internal error");
    }
}

export const handleExpiredToken = (retryObjApi, bindThis) =>{
    if(retryObjApi.functionAfterSuccess == "updateExpiredToken"){
        // This is the second attempt -> Log off
        //this.props.logOut();
        toast.error("Su sesión expiró, por favor inicie sesión nuevamente", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
        });
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