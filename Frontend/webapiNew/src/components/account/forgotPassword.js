import React from 'react';
import Header from "../header/header";
import { Link, Redirect } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { connect } from 'react-redux';
import { logIn } from '../../services/login/actions';


// Multilanguage
import { withTranslate } from 'react-redux-multilingual'

class ForgotPassword extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            email: '',
        }
        this.login = this.restore.bind(this);
    }

    componentDidMount() {
        window.scrollTo(0, 0);

    }

    onChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    restore() {
        console.log("email to send: "+this.state.email)
    }

    render() {
        const { login_status } = this.props;
        if(login_status == 'LOGGED_IN') return <Redirect to='/'/>

        return (
            <>
                {/*SEO Support*/}
                <Helmet>
                    <title>TeamUp | Recuperar contraseña</title>
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
                                                    <div className="col-md-5">
                                                        <div className="well">
                                                        </div>
                                                    </div>
                                                    <div className="col-md-5">
                                                        <div className="well">
                                                        <form className="text-center border border-light p-5" action="#!">
                                                            <p className="h4 mb-4">Recuperar Contraseña</p>
                                                            <input type="email" name="email" id="input-email" className="form-control mb-4" placeholder="Correo" onChange={this.onChange}></input>
                                                            <input readOnly defaultValue='Recuperar' className="btn btn-primary" onClick={() => { this.restore() }} />
                                                        </form>
                                                    </div>
                                                </div>
                                                <div className="col-md-2"></div>
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

const mapStateToProps = (state) =>{
    return {
        login_status: state.loginData.login_status,
        userData: state.loginData.userData,
    }
}

const mapDispatchToProps = (dispatch) =>{
    return{
        logIn : (userData) => { dispatch (logIn(userData))}
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ForgotPassword);