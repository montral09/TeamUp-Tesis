import React from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { logOut } from '../../services/login/actions';

const SignedInLinks = (props) =>{

    return(

        <React.Fragment>
            <li className="">
                <a href="#my-account" title="My Account" data-hover="dropdown" className="dropdown-toggle" data-toggle="dropdown">Mi Cuenta <b className="caret"></b></a>
                <ul className="dropdown-menu dropdown-menu-right">
                    <li><NavLink to="/account/modify">Modificar Datos</NavLink></li>
                    <li><a onClick = { () => (props.logOut())}>Log out</a></li>
                </ul>
            </li>
        </React.Fragment>
    )
}

const mapDispatchToProps = (dispatch) =>{
    return {
        logOut: () => dispatch(logOut())
    }
}

export default connect(null,mapDispatchToProps)(SignedInLinks);