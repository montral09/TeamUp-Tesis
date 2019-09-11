import React from 'react';
import { NavLink } from 'react-router-dom';

const SignedOutLinks = () =>{
    return(
        <React.Fragment>
                <li><NavLink to="/account/register">Registrarse</NavLink></li>
                <li><NavLink to="/account/login">Iniciar sesión</NavLink></li>
        </React.Fragment>
    )
}

export default SignedOutLinks;