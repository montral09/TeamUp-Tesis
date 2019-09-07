import React from 'react';
import Header from "../header/header";
import { Link, Redirect } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Multilanguage
import { withTranslate } from 'react-redux-multilingual'

class Login extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: ''
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
                if (data.responseCode == "SUCC-USRLOGSUCCESS") {
                    toast.success('Bienvenido, ' + data.vouserLog.Name, {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                    });
                    this.props.history.push('/')
                } else {
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
        const { translate } = this.props;
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
                                                        <form class="text-center border border-light p-5" action="#!">
                                                            <p class="h4 mb-4">Iniciar sesión</p>
                                                            <input type="email" name="email" id="input-email" class="form-control mb-4" placeholder="Correo" onChange={this.onChange}></input>
                                                            <input type="password" name="password" id="input-password" class="form-control mb-4" placeholder="Password" onChange={this.onChange}></input>
                                                            <div class="d-flex justify-content-around mb-2">
                                                                <div>
                                                                    <a href="">Olvido su contraseña?</a>
                                                                </div>
                                                            </div>
                                                            <input readOnly defaultValue='Login' className="btn btn-primary" onClick={() => { this.login() }} />
                                                            <p>No tiene cuenta?
                                                                <a href="">  Registrarse</a>
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

export default withTranslate(Login);