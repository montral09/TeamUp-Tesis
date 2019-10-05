
import {
    REGISTER_USER,
    MODIFY_USER,
    MODIFY_USER_ERROR,
    REGISTER_USER_ERROR,
    TOKEN_UPDATED
} 
from "./actionTypes";

// Here are all of the actions for account process, this is going to be called on register/modify
export const registerUser = (userData) =>{
    // Return function to use with thunk (for async call)
    return (dispatch, getState) =>{
        //Call to API
        console.log("registerUser - userData:");
        console.log(userData);

        fetch('https://localhost:44372/api/user', {
            method: 'POST',
            header: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify(userData)
        }).then(response => response.json()).then(data => {
            //this.setState({isLoading: false, buttonIsDisable:false});
            
            console.log("registerUser- data:" + JSON.stringify(data));
            if (data.responseCode == "SUCC_USRCREATED") {
                dispatch({ type: REGISTER_USER, userData: userData,  messageObj: { responseCode: data.responseCode, successMessage: "Usuario creado correctamente"}}); // to update the store
                //this.props.history.push('/account/login');
            } else {
                let message = "Ese correo ya esta en uso, por favor elija otro.";
                if(data.Message){
                    message='Hubo un error';
                }
                dispatch({ type: REGISTER_USER_ERROR, messageObj: { responseCode: data.responseCode, errorMessage: message}}); // to update the store
            }
        }
        ).catch(error => {
            console.log(error);
            dispatch({ type: REGISTER_USER_ERROR, messageObj: { responseCode: "ERR_SYSTEM_ERROR", errorMessage: "Internal Error"}}); // to update the store 
        }
        );

    }
}