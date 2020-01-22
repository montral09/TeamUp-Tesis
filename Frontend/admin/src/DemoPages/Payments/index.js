import React, {Fragment} from 'react';
import {Route} from 'react-router-dom';

// Tables

import PreferentialPayments from './PreferentialPayments/';
import CommissionPayments from './CommissionPayments/';

// Layout

import AppHeader from '../../Layout/AppHeader/';
import AppSidebar from '../../Layout/AppSidebar/';
import AppFooter from '../../Layout/AppFooter/';

const Payments = ({match}) => (
    <Fragment>
        <AppHeader/>
        <div className="app-main">
            <AppSidebar/>
            <div className="app-main__outer">
                <div className="app-main__inner">
                    <Route path={`${match.url}/PreferentialPayments`} component={PreferentialPayments}/>
                    <Route path={`${match.url}/CommissionPayments`} component={CommissionPayments}/>
                </div>
                <AppFooter/>
            </div>
        </div>
    </Fragment>
);

export default Payments;