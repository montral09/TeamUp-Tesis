import React from 'react';
import Header from "../header/header";
import { Helmet } from 'react-helmet';
import 'react-toastify/dist/ReactToastify.css';
import Login from './login';

class LoginPage extends React.Component {

    render() {
        return (
            <>
                {/*SEO Support*/}
                <Helmet>
                    <title>TeamUp | Login</title>
                    <meta name="description" content="---" />
                </Helmet>
                {/*SEO Support End */}
                <Header />
                <div className="main-content  full-width  home">
                    <div className="pattern" >
                        <div>
                            <div className="row">
                                <div className="col-md-12 ">
                                    <div className="row">
                                        <div className="col-md-9 center-column" id="content">
                                            <div className="row">
                                                <div className="col-md-5 col-sm-1">
                                                    <div className="well">
                                                    </div>
                                                </div>
                                                <div className="col-md-5 col-sm-10">
                                                    <Login redirectToMain={true} />
                                                </div>
                                                <div className="col-md-2 col-sm-1"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


            </>
        );
    }
}


export default LoginPage;