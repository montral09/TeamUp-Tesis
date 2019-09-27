import React, {Fragment} from 'react';
import {Route} from 'react-router-dom';

// Tables

import AllUsers from './AllUsers/';

// Layout

import AppHeader from '../../Layout/AppHeader/';
import AppSidebar from '../../Layout/AppSidebar/';
import AppFooter from '../../Layout/AppFooter/';

const Users = ({match}) => (
    <Fragment>
        <AppHeader/>
        <div className="app-main">
            <AppSidebar/>
            <div className="app-main__outer">
                <div className="app-main__inner">
                    {/* Todos Usuarios */}
                    <Route path={`${match.url}/allusers`} component={AllUsers}/>
                </div>
                <AppFooter/>
            </div>
        </div>
    </Fragment>
);

export default Users;