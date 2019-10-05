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

class Login extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            isLoading : false,
            buttonIsDisable: false
        }
        this.login = this.login.bind(this);
    }

    componentDidMount() {
        window.scrollTo(0, 0);

    }

    onChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    checkRequiredInputs() {
        let returnValue = false;
        let message = "";
        if (!this.state.password || !this.state.email) {
                message='Por favor ingrese correo y contraseña';
                returnValue = true;        
        } else if (!this.state.email.match(/\S+@\S+/)) {
            message='Formato de email incorrecto';
            returnValue = true;
        }
        
        if(message){
            toast.error(message, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        }
        
        return returnValue;
    }

    login() {
        if (!this.checkRequiredInputs()) {
            this.props.logIn(this.state);
        } 
    }

    render() {
        let { login_status } = this.props;
        if(login_status == 'LOGGED_IN') return <Redirect to='/'/>
        

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
                                                    <div className="col-md-5">
                                                        <div className="well">
                                                        </div>
                                                    </div>
                                                    <div className="col-md-5">
                                                        <div className="well">
                                                        <form className="text-center border border-light p-5" action="#!">
                                                            <p className="h4 mb-4">Iniciar sesión</p>
                                                            <input type="email" name="email" id="input-email" className="form-control mb-4" placeholder="Correo" maxLength="50" onChange={this.onChange}></input>
                                                            <input type="password" name="password" id="input-password" className="form-control mb-4" placeholder="Password" maxLength="100" onChange={this.onChange}></input>
                                                            <div className="d-flex justify-content-around mb-2">
                                                                <div>
                                                                    <Link to="/account/forgotPassword">Olvido su contraseña?</Link>
                                                                </div>
                                                            </div>
                                                            <button className="btn btn-primary" disabled= {this.state.buttonIsDisable} type="button" value='Registrarse' onClick={() => {  this.login() }} >

                                                                Login&nbsp;&nbsp;
                                                                { this.state.isLoading && 
                                                                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                                                }
                                                            </button>
                                                            <p>No tiene cuenta? 
                                                                <Link to="/account/register"> Registrarse</Link>
                                                            </p>
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

export default connect(mapStateToProps, mapDispatchToProps)(Login);