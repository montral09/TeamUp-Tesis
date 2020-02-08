import React from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';

import SignedInLinks from './SignedInLinks';
import SignedOutLinks from './SignedOutLinks';

class TopBarMenu extends React.Component {
    
    render() {
        const availableLinks = this.props.login_status === "NOT_LOGGED_IN" ? <SignedOutLinks/> : <SignedInLinks/>;
	    return (
            <ul className="menu">
                <li><NavLink to="/">Home</NavLink></li>
                {availableLinks}
            </ul>
	    );
	}
}

// Mapping the current state to props, to retrieve useful information from the state
const mapStateToProps = (state) =>{
    return{
        login_status: state.loginData.login_status,
    }
}

export default connect(mapStateToProps)(TopBarMenu);