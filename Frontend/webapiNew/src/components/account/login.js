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
            email: 'fabi@gmail.com',
            password: '123'
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

    login() {
        if (this.state.password && this.state.email) {
            fetch('https://localhost:44372/api/login', {
                method: 'POST',
                header: { 'Content-Type': 'application/json', 'Accept': 'application/json' },

                body: JSON.stringify({
                    Password: this.state.password,
                    Mail: this.state.email
                })
            }).then(response => response.json()).then(data => {
                console.log("data:" + JSON.stringify(data));
                if (data.responseCode == "SUCC_USRLOGSUCCESS") {
                    toast.success('Bienvenid@, ' + data.voUserLog.Name, {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                    });
                    console.log(data.voUserLog);
                    this.props.logIn(data.voUserLog); // this is calling the reducer to store the data on redux Store
                    this.props.history.push('/');
                } else if(data.responseCode ==  "ERR_MAILNOTVALIDATED"){
                    toast.error("Correo pendiente de validar", {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                    });
                }else{
                    toast.error('Datos incorrectos', {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                    });
                }
            }
            ).catch(error => {
                toast.error('Internal error', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
                console.log(error);
            }
            )
        } else {
            toast.error('Por favor ingrese correo y contraseña', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        }

    }

    render() {
        const { login_status } = this.props;
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
                                                            <input type="email" name="email" id="input-email" className="form-control mb-4" placeholder="Correo" onChange={this.onChange}></input>
                                                            <input type="password" name="password" id="input-password" className="form-control mb-4" placeholder="Password" onChange={this.onChange}></input>
                                                            <div className="d-flex justify-content-around mb-2">
                                                                <div>
                                                                    <Link to="/account/forgotPassword">Olvido su contraseña?</Link>
                                                                </div>
                                                            </div>
                                                            <input readOnly defaultValue='Login' className="btn btn-primary" onClick={() => { this.login() }} />
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