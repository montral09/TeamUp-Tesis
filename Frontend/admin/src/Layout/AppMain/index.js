import {BrowserRouter as Router, Route, Redirect} from 'react-router-dom';
import React, {Suspense, lazy, Fragment} from 'react';

import {
    ToastContainer,
} from 'react-toastify';

const Dashboards = lazy(() => import('../../Pages/Dashboards'));

const Publications = lazy(() => import('../../Pages/Publications'));
const Reservations = lazy(() => import('../../Pages/Reservations'));
const Publishers = lazy(() => import('../../Pages/Publishers'));
const Users = lazy(() => import('../../Pages/Users'));
const Payments = lazy(() => import('../../Pages/Payments'));

const AppMain = () => {

    return (
        <Fragment>
            {/* Reservations */}

            <Suspense fallback={
                <div className="loader-container">
                    <div className="loader-container-inner">
                        <h6 className="mt-5">
                            Por favor espere mientras cargamos los datos
                            <small>Cargando...</small>
                        </h6>
                    </div>
                </div>
            }>
                <Route path="/reservations" component={Reservations}/>
            </Suspense>

            {/* Publications */}

            <Suspense fallback={
                <div className="loader-container">
                    <div className="loader-container-inner">
                        <h6 className="mt-5">
                            Por favor espere mientras cargamos los datos
                            <small>Cargando...</small>
                        </h6>
                    </div>
                </div>
            }>
                <Route path="/publications" component={Publications}/>
            </Suspense>

            {/* Publishers */}

            <Suspense fallback={
                <div className="loader-container">
                    <div className="loader-container-inner">
                        <h6 className="mt-5">
                            Por favor espere mientras cargamos los datos
                            <small>Cargando...</small>
                        </h6>
                    </div>
                </div>
            }>
                <Route path="/publishers" component={Publishers}/>
            </Suspense>

            {/* Users */}

            <Suspense fallback={
                <div className="loader-container">
                    <div className="loader-container-inner">
                        <h6 className="mt-5">
                            Por favor espere mientras cargamos los datos
                            <small>Cargando...</small>
                        </h6>
                    </div>
                </div>
            }>
                <Route path="/users" component={Users}/>
            </Suspense>

            {/* Payments */}
            <Suspense fallback={
                <div className="loader-container">
                    <div className="loader-container-inner">
                        <h6 className="mt-5">
                            Por favor espere mientras cargamos los datos
                            <small>Cargando...</small>
                        </h6>
                    </div>
                </div>
            }>
                <Route path="/payments" component={Payments}/>
            </Suspense>

            {/* Dashboards */}

            <Suspense fallback={
                <div className="loader-container">
                    <div className="loader-container-inner">
                        <h6 className="mt-3">
                                Por favor espere mientras cargamos los datos
                            <small>Cargando...</small>
                        </h6>
                    </div>
                </div>
            }>
                <Route path="/dashboards" component={Dashboards}/>
            </Suspense>
            

            <Route exact path="/" render={() => (
                <Redirect to="/dashboards/basic"/>
            )}/>
            <ToastContainer/>
        </Fragment>
    )
};

export default AppMain;