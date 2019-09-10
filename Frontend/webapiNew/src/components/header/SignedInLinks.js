import React from 'react';
import { NavLink } from 'react-router-dom';

const SignedInLinks = () =>{
    return(
        <React.Fragment>
            <li><NavLink to="/">Home</NavLink></li>
            <li className="">
                <a href="#my-account" title="My Account" data-hover="dropdown" className="dropdown-toggle" data-toggle="dropdown">Mi Cuenta <b className="caret"></b></a>
                <ul className="dropdown-menu dropdown-menu-right">
                    <li><NavLink to="/account/modify">Modificar Datos</NavLink></li>
                    <li><NavLink to="/account/logout">Log out</NavLink></li>
                </ul>
            </li>
        </React.Fragment>
    )
}

export default SignedInLinks;