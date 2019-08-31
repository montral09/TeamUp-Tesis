import React from 'react';
import { Link } from 'react-router-dom'
import { withTranslate } from 'react-redux-multilingual'

class TopBarMenu extends React.Component {
    render() {
    	const { translate } = this.props;
	    return (
            <ul className="menu">
                <li className="">
                    <a href="#my-account" title="My Account" data-hover="dropdown" className="dropdown-toggle" data-toggle="dropdown">Hola <b className="caret"></b></a>
                    <ul className="dropdown-menu dropdown-menu-right">
                        <li><Link to="/account/register">Regis</Link></li>
                        <li><Link to="/account/login">Login</Link></li>
                    </ul>
                </li>
                <li><Link to="/wishlist">wish</Link></li>
                <li><Link to="/cart">cart</Link></li>
                <li><Link to="/checkout">checkout</Link></li>
            </ul>
	    );
	}
}

export default TopBarMenu;