
import {
    LOG_IN,
    LOG_OUT,
    CHECK_LOGIN,
    LOG_IN_ERROR } 
from "./actionTypes";

// Here are all of the actions for account process, this is going to be called on login/logout page
export const logIn = (adminData) =>{
    return (dispatch, getState) =>{
        console.log("adminData ");
        console.log(adminData);

        fetch('https://localhost:44372/api/admin', {
            method: 'POST',
            header: { 'Content-Type': 'application/json', 'Accept': 'application/json' },

            body: JSON.stringify({
                Password: adminData.password,
                Mail: adminData.email
            })
        }).then(response => response.json()).then(data => {
            console.log("data:" + JSON.stringify(data));
            if (data.responseCode == "SUCC_USRLOGSUCCESS") {
                let originalDate = new Date();
                let quinceMinDateTime = new Date(originalDate.getTime() + 15*60000);
                let cincoDiasDateTime = new Date(originalDate.getTime() + 7200*60000);
                let admTokenObj = {
                    accesToken : data.AccessToken,
                    refreshToken : data.RefreshToken
                }
                dispatch({ type: LOG_IN, adminData: data.voAdmin, admTokenObj: admTokenObj, messageObj: { responseCode: "SUCC_USRLOGSUCCESS", successMessage: "Bienvenid@,  "+data.voAdmin.Name}});
            } else {
                dispatch({ type: LOG_IN_ERROR, messageObj: { responseCode: "ERR_USRWRONGPASS", errorMessage: "Datos incorrectos"}});
            }
        }
        ).catch(error => {
            dispatch({ type: LOG_IN_ERROR, messageObj: { responseCode: "ERR_SYSTEM_ERROR", errorMessage: "Internal error"}});
            console.log(error);
        }
        )
        /*
        fetch('https://localhost:44372/api/login', {
            method: 'POST',
            header: { 'Content-Type': 'application/json', 'Accept': 'application/json' },

            body: JSON.stringify({
                Password: userData.password,
                Mail: userData.email
            })
        }).then(response => response.json()).then(data => {
            //this.setState({isLoading: false, buttonIsDisable:false});
            console.log("logIn - data:");
            console.log(data);
            if (data.responseCode == "SUCC_USRLOGSUCCESS") {
                let originalDate = new Date();
                let quinceMinDateTime = new Date(originalDate.getTime() + 15*60000);
                let cincoDiasDateTime = new Date(originalDate.getTime() + 7200*60000);
                let admTokenObj = {
                    accesToken : data.AccessToken,
                    accesTokenExp : quinceMinDateTime,
                    refreshToken : data.RefreshToken,
                    refreshTokenExp: cincoDiasDateTime
                }
                //this.props.logIn(data.voUserLog, admTokenObj); // this is calling the reducer to store the data on redux Store
                //this.props.history.push('/');
                dispatch({ type: LOG_IN, userData: data.voUserLog, admTokenObj: admTokenObj, messageObj: { responseCode: "SUCC_USRLOGSUCCESS", successMessage: "Bienvenid@,  "+data.voUserLog.Name}});
            } else if(data.responseCode ==  "ERR_MAILNOTVALIDATED"){
                dispatch({ type: LOG_IN_ERROR, messageObj: { responseCode: "ERR_MAILNOTVALIDATED", errorMessage: "Correo pendiente de validar "}});
            }else{
                dispatch({ type: LOG_IN_ERROR, messageObj: { responseCode: "ERR_USRWRONGPASS", errorMessage: "Datos incorrectos"}});
            }
        }
        ).catch(error => {
            /*this.setState({isLoading: false, buttonIsDisable:false});*/
            /*dispatch({ type: LOG_IN_ERROR, messageObj: { responseCode: "ERR_SYSTEM_ERROR", errorMessage: "Internal error"}});
        }
        )*/
    }
}

export const logOut = () =>{
    return {
         type: LOG_OUT
    }
}

export const modifyData = (userData) =>{
    return {
         type: MODIFY_DATA, 
         userData: userData
    }
}
