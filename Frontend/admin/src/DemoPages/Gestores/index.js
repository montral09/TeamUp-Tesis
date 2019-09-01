import React, {Fragment} from 'react';
import {Route} from 'react-router-dom';

// Tables

import PendienteAprobacion from './PendienteAprobacion/';

// Layout

import AppHeader from '../../Layout/AppHeader/';
import AppSidebar from '../../Layout/AppSidebar/';
import AppFooter from '../../Layout/AppFooter/';

const Gestores = ({match}) => (
    <Fragment>
        <AppHeader/>
        <div className="app-main">
            <AppSidebar/>
            <div className="app-main__outer">
                <div className="app-main__inner">

                    {/* Pendiente Aprobacion */}
                    <Route path={`${match.url}/PendienteAprobacion`} component={PendienteAprobacion}/>

                </div>
                <AppFooter/>
            </div>
        </div>
    </Fragment>
);

export default Gestores;