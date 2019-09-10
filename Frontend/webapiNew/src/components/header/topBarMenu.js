import React from 'react';
import { Link } from 'react-router-dom'

import SignedInLinks from './SignedInLinks';
import SignedOutLinks from './SignedOutLinks';

class TopBarMenu extends React.Component {
    render() {

	    return (
            <ul className="menu">
                <SignedInLinks/>
                <SignedOutLinks/>
            </ul>
	    );
	}
}

export default TopBarMenu;