import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../logoTU.png';

class Logo extends React.Component {
    render() {
	    return (
			<div className="logo">
				<Link to="/">
					<img src={logo} title="TeamUp" alt="TeamUp" />
				</Link>
			</div>
	    );
	}
}

export default Logo;