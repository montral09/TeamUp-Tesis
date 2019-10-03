
import {
    LOG_IN,
    LOG_OUT,
    CHECK_LOGIN,
    MODIFY_DATA,
    LOG_IN_ERROR } 
from "./actionTypes";

// Here are all of the actions for account process, this is going to be called on login/logout page
export const logIn = (userData) =>{
    return (dispatch, getState) =>{
        
        fetch('https://localhost:44372/api/login', {
            method: 'POST',
            header: { 'Content-Type': 'application/json', 'Accept': 'application/json' },

            body: JSON.stringify({
                Password: userData.password,
                Mail: userData.email
            })
        }).then(response => response.json()).then(data => {
            //this.setState({isLoading: false, buttonIsDisable:false});
            console.log("data:" + JSON.stringify(data));
            if (data.responseCode == "SUCC_USRLOGSUCCESS") {
                /*toast.success('Bienvenid@, ' + data.voUserLog.Name, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });*/
                console.log(data.voUserLog);
                let originalDate = new Date();
                let quinceMinDateTime = new Date(originalDate.getTime() + 15*60000);
                let cincoDiasDateTime = new Date(originalDate.getTime() + 7200*60000);
                let tokenObj = {
                    accesToken : data.token,
                    accesTokenExp : quinceMinDateTime,
                    refreshToken : 'd2343im4odi3m4oidm3oi4d3oi4dmo3i4dmoi34md',
                    refreshTokenExp: cincoDiasDateTime
                }
                //this.props.logIn(data.voUserLog, tokenObj); // this is calling the reducer to store the data on redux Store
                //this.props.history.push('/');
                dispatch({ type: LOG_IN, userData: userData, tokenObj: tokenObj, messageObj: { responseCode: "SUCC_USRLOGSUCCESS", successMessage: "Bienvenid@,  "+data.voUserLog.Name}});
            } else if(data.responseCode ==  "ERR_MAILNOTVALIDATED"){
                /*
                toast.error("Correo pendiente de validar", {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });*/
                dispatch({ type: LOG_IN_ERROR, messageObj: { responseCode: "ERR_MAILNOTVALIDATED", errorMessage: "Correo pendiente de validar "}});
            }else{
                /*
                toast.error('Datos incorrectos', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });*/
                dispatch({ type: LOG_IN_ERROR, messageObj: { responseCode: "ERR_USRWRONGPASS", errorMessage: "Datos incorrectos"}});
            }
        }
        ).catch(error => {
            /*
            this.setState({isLoading: false, buttonIsDisable:false});
            toast.error('Internal error', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });*/
            dispatch({ type: LOG_IN_ERROR, messageObj: { responseCode: "ERR_SYSTEM_ERROR", errorMessage: "Internal error"}});
        }
        )
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
