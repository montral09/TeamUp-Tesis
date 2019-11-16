import React from 'react';
import { Link, Redirect } from 'react-router-dom';
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
            isLoading: false,
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
            message = 'Por favor ingrese correo y contraseña';
            returnValue = true;
        } else if (!this.state.email.match(/\S+@\S+/)) {
            message = 'Formato de email incorrecto';
            returnValue = true;
        }

        if (message) {
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
            this.toggleButton();
            this.props.logIn(this.state);
            const scopeThis = this;
            setTimeout(function () {
                scopeThis.toggleButton();
            }, 150);
        }
    }
    toggleButton() {
        this.setState({
            isLoading: !this.state.isLoading,
            buttonIsDisable: !this.state.buttonIsDisable
        })
    }

    render() {
        let { login_status, redirectToMain } = this.props;
        if (login_status == 'LOGGED_IN' && redirectToMain) return <Redirect to='/' />
        return (
            <div className="well">
                <form className="text-center border border-light p-5" action="#!">
                    <p className="h4 mb-4">Iniciar sesión</p>
                    <input type="email" name="email" id="input-email" className="form-control mb-4" placeholder="Correo" maxLength="50" onChange={this.onChange}></input>
                    <input type="password" name="password" id="input-password" className="form-control mb-4" placeholder="Password" maxLength="100" onChange={this.onChange}></input>
                    <div className="d-flex justify-content-around mb-2">
                        <div>
                            <Link target="_blank" to="/account/forgotPassword">Olvido su contraseña?</Link>
                        </div>
                    </div>
                    <button className="btn btn-primary" disabled={this.state.buttonIsDisable} type="button" value='Registrarse' onClick={() => { this.login() }} >

                        Login&nbsp;&nbsp;
                                        {this.state.isLoading &&
                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        }
                    </button>
                    <p>No tiene cuenta?
                                        <Link target="_blank" to="/account/register"> Registrarse</Link>
                    </p>
                </form>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        login_status: state.loginData.login_status,
        userData: state.loginData.userData,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        logIn: (userData) => { dispatch(logIn(userData)) }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);