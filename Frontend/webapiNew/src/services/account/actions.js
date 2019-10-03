
import {
    REGISTER_USER,
    MODIFY_USER
} 
from "./actionTypes";

// Here are all of the actions for account process, this is going to be called on register/modify
export const registerUser = (userData) =>{
    // Return function to use with thunk (for async call)
    return (dispatch, getState) =>{
        //Call to API
        
        dispatch({ type: REGISTER_USER, userData: userData}); // to update the store
        /*
        fetch('https://localhost:44372/api/user', {
            method: 'POST',
            header: { 'Content-Type': 'application/json', 'Accept': 'application/json' },

            body: JSON.stringify({
                Password: userData.password,
                Mail: userData.email,
                Name: userData.firstName,
                LastName: userData.lastName,
                Phone: userData.phone,
                CheckPublisher: userData.gestorCheckbox,
                Rut: userData.rut,
                RazonSocial: userData.razonSocial,
                Address: userData.direccion,
            })
        }).then(response => response.json()).then(data => {
            //this.setState({isLoading: false, buttonIsDisable:false});
            
            console.log("data:" + JSON.stringify(data));
            if (data.responseCode == "SUCC_USRCREATED") {
                toast.success('Usuario creado correctamente ', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
                //this.props.history.push('/account/login')
            } else {
                if(data.Message){
                    toast.error('Hubo un error: '+data.Message, {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                    });
                }else{
                    toast.error('Ese correo ya esta en uso, por favor elija otro.', {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                    });
                }


            }
        }
        ).catch(error => {
            dispatch({ type: REGISTER_USER_ERROR, error: error}); // to update the store with error
            /*
            this.setState({isLoading: false, buttonIsDisable:false});
            toast.error('Internal error', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            console.log(error);*//*
        }
        );
        */
    }
}