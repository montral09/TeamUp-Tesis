import Globals from './../../Globals';

// Here are all of the actions for account process, this is going to be called on register/modify
export const registerUser = (userData) =>{
    // Return function to use with thunk (for async call)
    return (dispatch, getState) =>{


        fetch(Globals.baseURL + '/user', {
            method: 'POST',
            header: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify(userData)
        }).then(response => response.json()).then(data => {

            if (data.responseCode == "SUCC_USRCREATED") {
                dispatch({ type: 'REGISTER_USER', userData: userData,  messageObj: { responseCode: data.responseCode, successMessage: "Usuario creado correctamente"}}); // to update the store

            } else {
                let message = "Ese correo ya esta en uso, por favor elija otro.";
                if(data.Message){
                    message='Hubo un error';
                }
                dispatch({ type: 'REGISTER_USER_ERROR', messageObj: { responseCode: data.responseCode, errorMessage: message}}); // to update the store
            }
        }
        ).catch(error => {
            dispatch({ type: 'REGISTER_USER_ERROR', messageObj: { responseCode: "ERR_SYSTEM_ERROR", errorMessage: "Internal Error"}}); // to update the store 
        }
        );

    }
}