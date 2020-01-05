import React from 'react';
import { NavLink } from 'react-router-dom';
// Multilanguage
import { withTranslate } from 'react-redux-multilingual'
import { compose } from 'redux';

const SignedOutLinks = (props) =>{
    
    const { translate } = props;

    return(
        <React.Fragment>
                <li><NavLink to="/account/register">{translate('registerYourself_w')}</NavLink></li>
                <li><NavLink to="/account/login">{translate('singOutLinks_head_login')}</NavLink></li>
        </React.Fragment>
    )
}

export default withTranslate(SignedOutLinks);