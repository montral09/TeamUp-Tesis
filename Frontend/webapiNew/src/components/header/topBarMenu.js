import React from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';

import SignedInLinks from './SignedInLinks';
import SignedOutLinks from './SignedOutLinks';

class TopBarMenu extends React.Component {
    
    render() {
        console.log("status: "+JSON.stringify(this.props.login_status));
        const availableLinks = this.props.login_status === "NOT_LOGGED_IN" ? <SignedOutLinks/> : <SignedInLinks/>;
	    return (
            <ul className="menu">
                <li><NavLink to="/">Home</NavLink></li>
                {availableLinks}
            </ul>
	    );
	}
}

const mapStateToProps = (state) =>{
    console.log("mapStateToProps");
    console.log(state);
    return{
        login_status: state.loginData.login_status,
    }
}

export default connect(mapStateToProps)(TopBarMenu);