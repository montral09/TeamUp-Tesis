﻿import React from 'react';
import Header from "../header/header";
import { Link, Redirect } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Multilanguage
import { withTranslate } from 'react-redux-multilingual'

class Register extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            firstName : '',
            lastName : '',
            phone : '',
            email: '',
            password: '',
            gestorCheckbox : '',
            rut : '',
            razonSocial : '',
            direccion : ''
        }
        this.register = this.register.bind(this);
    }

    componentDidMount() {
        window.scrollTo(0, 0);
    }

    onChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value
        })
    }
    
    // Validate if all the required inputs are inputted, returns true or false
    checkRequiredInputs() {
        var returnValue = false;
        if (this.state.password && this.state.email && this.state.firstName
            && this.state.lastName && this.state.phone) {
                returnValue = true;
        }
        return returnValue;
    }

    register() {
        if (this.checkRequiredInputs()) {
            fetch('https://localhost:44372/api/user', {
                method: 'POST',
                header: { 'Content-Type': 'application/json', 'Accept': 'application/json' },

                body: JSON.stringify({
                    Password: this.state.password,
                    Mail: this.state.email,
                    Name: this.state.firstName,
                    LastName: this.state.lastName,
                    Phone: this.state.email,
                    CheckPublisher: this.state.email,
                    Rut: this.state.email,
                    RazonSocial: this.state.email,
                    Address: this.state.email,
                })
            }).then(response => response.json()).then(data => {
                console.log("data:" + JSON.stringify(data));
                if (data.responseCode == "SUCC_USRCREATED") {
                    toast.success('Usuario creado correctamente ', {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                    });
                    this.props.history.push('/account/login')
                } else {
                    toast.error('Ese correo ya esta en uso, por favor elija otro.', {
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
            toast.error('Por favor ingrese los campos obligatorios (*)', {
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
                    <title>TeamUp | Registrarse</title>
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
                                                <div className="col-md-6">
                                                    <div className="well">
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <form className="border border-light p-6">
                                                        <p className="h4 mb-4 text-center">Registrarse</p>
                                                        <input type="text" id="firstName" className="form-control mb-4" placeholder="Nombre (*)" onChange={this.onChange}></input>
                                                        <input type="text" id="lastName" className="form-control mb-4" placeholder="Apellido (*)" onChange={this.onChange}></input>
                                                        <input type="email" id="email" className="form-control" placeholder="Correo (*)" onChange={this.onChange}></input>
                                                        <small id="emailHelper" className="form-text text-muted mb-2">Este va a ser su usuario</small>
                                                        <input type="text" id="phone" className="form-control mb-4" placeholder="Numero telefónico (*)" aria-describedby="phone" onChange={this.onChange}></input>
                                                        <input type="password" name="password" id="password" class="form-control mb-4" placeholder="Contraseña (*)" onChange={this.onChange}></input>
                                                        <div className="custom-control custom-checkbox">
                                                            <input type="checkbox" className="custom-control-input mb-4" id="gestorCheckbox" onChange={this.onChange}></input>
                                                            <label className="custom-control-label mb-4" for="gestorCheckbox">Desea aplicar para ser gestor?</label>
                                                        </div>
                                                        <small id="emailHelper" className="form-text text-muted mb-2">Si es empresa, por favor llene lo siguiente:</small>
                                                        <input type="text" id="rut" className="form-control mb-4" placeholder="Rut" aria-describedby="rut" onChange={this.onChange}></input>
                                                        <input type="text" id="razonSocial" className="form-control mb-4" placeholder="Razón Social" aria-describedby="razonSocial" onChange={this.onChange}></input>
                                                        <input type="text" id="direccion" className="form-control mb-4" placeholder="Dirección" aria-describedby="direccion" onChange={this.onChange}></input>
                                                        <div className="text-center">
                                                        <input readOnly defaultValue='Registrarse' className="btn btn-primary" onClick={() => { this.register() }} />
                                                            <hr></hr>
                                                            <p>Al hacer click en  
                                                                <em> Registrarse</em> usted acepta nuestros
                                                                <a href="" target="_blank"> terminos y condiciones</a>
                                                            </p>
                                                            <div className="mb-5" ></div>
                                                        </div>
                                                    </form>
                                                </div>

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

export default withTranslate(Register);