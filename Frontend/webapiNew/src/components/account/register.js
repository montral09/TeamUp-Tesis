import React from 'react';
import Header from "../header/header";
import { Redirect } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { connect } from 'react-redux';
import { callAPI } from '../../services/common/genericFunctions';
// Multilanguage
import { withTranslate } from 'react-redux-multilingual'
import { compose } from 'redux';

class Register extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            firstName : '',
            lastName : '',
            phone : '',
            email: '',
            password: '',
            passwordConfirm: "",
            gestorCheckbox : '',
            rut : '',
            razonSocial : '',
            address : '',
            isLoading : false,
            buttonIsDisable: false,
            Language : 'es'
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
        let returnValue = false;
        let message = "";
        if (!this.state.password || !this.state.email || !this.state.firstName
            || !this.state.lastName || !this.state.phone) {
                message='Por favor ingrese los campos obligatorios (*)';
                returnValue = true;
        } else if (!this.state.firstName.match(/^[A-Za-z]+$/)) {        
            returnValue = true;
            message = "Su nombre debe contener solo letras";
        } else if (this.state.firstName.length < 2) {        
            returnValue = true;
            message = "Nombre demasiado corto";            
        } else if (!this.state.lastName.match(/^[A-Za-z]+$/)) {
            returnValue = true;
            message = "Su apellido debe contener solo letras";
        } else if (this.state.lastName.length < 2) {        
            returnValue = true;
            message = "Apellido demasiado corto"; 
        } else if (this.state.password != this.state.passwordConfirm) {
            returnValue = true;
            message = "Ambos campos de contraseña deben ser iguales";
        } else if (this.state.password.length < 6) {
            message='La contraseña debe tener al menos 6 caracteres';
            returnValue = true;
        } else if (!this.state.email.match(/\S+@\S+.+/)) {
            message='Formato de email incorrecto';
            returnValue = true;
        } else if (!this.state.phone.match(/^[0-9]+$/) && !this.state.phone.match(/^[+]+[0-9]+$/)) {
            message='Telefono debe contener solo números o "+" si corresponde a un número internacional';
            returnValue = true;
        } else if (this.state.phone.length < 6) {
            message='Telefono demasiado corto';
            returnValue = true;
        } else if (this.state.rut && !this.state.rut.match(/^[0-9]+$/)) {
            message='Rut debe contener solo números';
            returnValue = true;
        } else if (this.state.rut && this.state.rut < 12) {
            message='Rut debe tener 12 números';
            returnValue = true;
        } else if (this.state.razonSocial && this.state.razonSocial < 3) {
            console.log ('entre a razon social');
            message='Razon social demasiada corta';
            returnValue = true;
        } else if (this.state.address && this.state.address < 10) {
            console.log ('entre a address');
            message='Direccion demasiado corta';
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
    registerUser = () => {
        if (!this.checkRequiredInputs()) {
            this.setState({isLoading: true, buttonIsDisable:true});
            var objApi = {};
            objApi.objToSend = {
                Password: this.state.password,
                Mail: this.state.email,
                Name: this.state.firstName,
                LastName: this.state.lastName,
                Phone: this.state.phone,
                CheckPublisher: this.state.gestorCheckbox == 'on' ? true : false,
                Rut: this.state.rut,
                RazonSocial: this.state.razonSocial,
                Address: this.state.address,
                Language : this.state.Language
            }
            objApi.fetchUrl = "api/user";
            objApi.method = "POST";
            objApi.successMSG = {
                SUCC_USRCREATED : this.props.translate('SUCC_USRCREATED'),
            };
            objApi.functionAfterSuccess = "registerUser";
            objApi.callFunctionAfterApiError = "registerUser";
            objApi.errorMSG= {
                ERR_MAILALREADYEXIST : this.props.translate('ERR_MAILALREADYEXIST')
            }
            callAPI(objApi, this);
        }

    }

    render() {
        const { login_status } = this.props;
        if(login_status == 'LOGGED_IN') return <Redirect to='/'/>
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
                                                        <input type="text" id="firstName" className="form-control mb-4" placeholder="Nombre (*)" maxLength="50" pattern="[a-z][A-Z]" onChange={this.onChange}></input>
                                                        <input type="text" id="lastName" className="form-control mb-3" placeholder="Apellido (*)" maxLength="50" onChange={this.onChange}></input>
                                                        <small id="emailHelper" className="form-text text-muted mb-2">Este va a ser su usuario</small>
                                                        <input type="email" id="email" className="form-control mb-4" placeholder="Correo (*)" maxLength="50" onChange={this.onChange}></input>                                                        
                                                        <input type="text" id="phone" className="form-control mb-4" placeholder="Numero telefónico (*)" aria-describedby="phone" maxLength="15" onChange={this.onChange}></input>
                                                        <small id="passwordHelper" className="form-text text-muted mb-2">La contraseña debe contener al menos 6 caracteres</small>
                                                        <input type="password" name="password" id="password" className="form-control mb-4" placeholder="Contraseña (*)" maxLength="100" onChange={this.onChange}></input>
                                                        <input type="password" name="passwordConfirm" id="passwordConfirm" className="form-control mb-4" placeholder="Repetir contraseña (*)" maxLength="100" onChange={this.onChange}></input>
                                                        <div className="custom-control custom-checkbox">
                                                            <input type="checkbox" className="custom-control-input mb-4" id="gestorCheckbox" onChange={this.onChange}></input>
                                                            <label className="custom-control-label mb-4" htmlFor="gestorCheckbox">Desea aplicar para ser gestor?</label>
                                                        </div>
                                                        <small id="emailHelper" className="form-text text-muted mb-2">Si es empresa, por favor llene lo siguiente:</small>
                                                        <input type="text" id="rut" className="form-control mb-4" placeholder="Rut" aria-describedby="rut" maxLength="12" onChange={this.onChange}></input>
                                                        <input type="text" id="razonSocial" className="form-control mb-4" placeholder="Razón Social" aria-describedby="razonSocial" maxLength="50" onChange={this.onChange}></input>
                                                        <input type="text" id="address" className="form-control mb-4" placeholder="Dirección" aria-describedby="address" maxLength="100" onChange={this.onChange}></input>
                                                        <div className="text-center">
                                                        <button className="btn btn-primary" disabled= {this.state.buttonIsDisable} type="button" value='Registrarse' onClick={() => { this.register() }} >
                                                            Registrarse&nbsp;&nbsp;
                                                            { this.state.isLoading && 
                                                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                                            }
                                                        </button>
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
const mapStateToProps = (state) =>{
    return {
        login_status: state.loginData.login_status
    }
}
const enhance = compose(
    connect(mapStateToProps, null),
    withTranslate
)
export default enhance(Register);