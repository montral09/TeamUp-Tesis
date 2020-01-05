import React, {Fragment} from 'react';
import {Route} from 'react-router-dom';

// Tables

import PublPendApprov from './publicationApprov/';
import AllPublications from './AllPublications/'

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
                    {/* Pendiente Aprobacion */}
                    <Route path={`${match.url}/publicationApprov`} component={PublPendApprov}/>
                    <Route path={`${match.url}/AllPublications`} component={AllPublications}/>
                </div>
                <AppFooter/>
            </div>
        </div>
    </Fragment>
);

export default Publications;