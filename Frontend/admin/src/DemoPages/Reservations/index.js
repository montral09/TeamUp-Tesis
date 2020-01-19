import React, {Fragment} from 'react';
import {Route} from 'react-router-dom';

// Tables

import AllReservations from './AllReservations/'

// Layout

import AppHeader from '../../Layout/AppHeader/';
import AppSidebar from '../../Layout/AppSidebar/';
import AppFooter from '../../Layout/AppFooter/';

const Publications = ({match}) => (
    <Fragment>
        <AppHeader/>
        <div className="app-main">
            <AppSidebar/>
            <div className="app-main__outer">
                <div className="app-main__inner">
                    {/* Todas las reservas */}
                    <Route path={`${match.url}/AllReservations`} component={AllReservations}/>
                </div>
                <AppFooter/>
            </div>
        </div>
    </Fragment>
);

export default Publications;