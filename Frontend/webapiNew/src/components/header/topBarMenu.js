import React from 'react';
import { Link } from 'react-router-dom'



class TopBarMenu extends React.Component {
    render() {

	    return (
            <ul className="menu">
                <ul className="dropdown-menu dropdown-menu-right">
                    <li><Link to="/account/register">'register'</Link></li>
                    <li><Link to="/account/login">'login1'</Link></li>
                </ul>
                <li className="">
                    <a href="#my-account" title="My Account" data-hover="dropdown" className="dropdown-toggle" data-toggle="dropdown">Mi Cuenta <b className="caret"></b></a>
                    <ul className="dropdown-menu dropdown-menu-right">
                    <li><Link to="/account/register">Opción 1</Link></li>
                    <li><Link to="/account/login">Opción 2</Link></li>
                    </ul>
                </li>
                <li><Link to="/account/register">Registrarse</Link></li>
                <li><Link to="/account/login">Iniciar sesión</Link></li>
            </ul>
	    );
	}
}

export default TopBarMenu;