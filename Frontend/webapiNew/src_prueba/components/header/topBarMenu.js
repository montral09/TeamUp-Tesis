import React from 'react';
import { Link } from 'react-router-dom'
import { withTranslate } from 'react-redux-multilingual'

class TopBarMenu extends React.Component {
    render() {
    	const { translate } = this.props;
	    return (
            <ul className="menu">
                <li className="">
                    <a href="#my-account" title="My Account" data-hover="dropdown"  className="dropdown-toggle" data-toggle="dropdown">Cuenta <b className="caret"></b></a>
                    <ul className="dropdown-menu dropdown-menu-right">
                        <li><Link to="/account/register">reg</Link></li>
                        <li><Link to="/account/login">login</Link></li>
                    </ul>                
                </li>
                <li><Link to="/wishlist">a</Link></li>
                <li><Link to="/cart">b</Link></li>
                <li><Link to="/checkout">c</Link></li>
            </ul>
	    );
	}
}

export default withTranslate(TopBarMenu);