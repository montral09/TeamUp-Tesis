import React from 'react';
import Header from "../header/header";
import { Redirect } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { modifyData, updateToken } from '../../services/login/actions';
import { logOut } from '../../services/login/actions';

import { connect } from 'react-redux';
// Multilanguage
import { withTranslate } from 'react-redux-multilingual'

class Modify extends React.Component {

    constructor(props) {
        super(props);
        console.log("Modify - props:")
        console.log(props);
        const { Address, LastName, Mail, Name, Phone, RazonSocial, Rut } = props.userData;
        const tokenObj = props.tokenObj;
        this.state = {
            firstName: Name,
            lastName: LastName,
            phone: Phone,
            email: Mail,
            originalEmail: Mail,
            password: "",
            passwordConfirm: "",
            rut: Rut,
            razonSocial: RazonSocial,
            address: Address,
            anyChange: false,
            tokenObj: tokenObj
        }
        this.modify = this.modify.bind(this);
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
            message='Razon social demasiada corta';
            returnValue = true;
        } else if (this.state.address && this.state.address < 10) {
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

    modify() {
        if (!this.checkRequiredInputs()) {
            console.log("Token OBJ: ");
            console.log(this.state.tokenObj);
            fetch('https://localhost:44372/api/user', {
            method: 'PUT',
            header: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify({
                Password: this.state.password || "",
                Mail: this.state.originalEmail,
                Name: this.state.firstName,
                LastName: this.state.lastName,
                Phone: this.state.phone,
                Rut: this.state.rut,
                RazonSocial: this.state.razonSocial,
                Address: this.state.address,
                NewMail: this.state.email,
                AccessToken: this.state.tokenObj.accesToken
            })
        }).then(response => response.json()).then(data => {
            console.log("data:" + JSON.stringify(data));
            switch(data.responseCode){
                case "SUCC_USRUPDATED":
                    if(this.state.email != this.state.originalEmail){
                        toast.success('Usuario actualizado correctamente, se ha enviado un correo de verificacion a su nueva casilla ', {
                            position: "top-right",
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                        });
                        this.props.logOut();
                        this.props.history.push('/account/login');
                    }else{
                        this.props.modifyData({
                            Mail: this.state.originalEmail,
                            Name: this.state.firstName,
                            LastName: this.state.lastName,
                            Phone: this.state.phone,
                            Rut: this.state.rut,
                            RazonSocial: this.state.razonSocial,
                            Address: this.state.address,
                        }); // this is calling the reducer to store the data on redux Store
                        toast.success('Usuario actualizado correctamente', {
                            position: "top-right",
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                        });
                        this.props.history.push('/');
                    }
                break;
                case "ERR_MAILALREADYEXIST":
                    toast.error('Ese correo ya esta en uso, por favor elija otro.', {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                    });
                break;
                case "ERR_INVALIDACCESSTOKEN":
                    fetch('https://localhost:44372/api/tokens', {
                        method: 'PUT',
                        header: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        
                        body: JSON.stringify({
                            Mail: this.state.email,
                            RefreshToken: this.state.tokenObj.refreshToken
                        })
                    }).then(response => response.json()).then(data => {
                        this.setState({isLoading: false, buttonIsDisable:false});
                        console.log("data:" + JSON.stringify(data));
                        
                        switch(data.responseCode){
                            case "SUCC_TOKENSUPDATED":
                                let newTokenObj = {
                                    accesToken: data.AccessToken,
                                    refreshToken: data.RefreshToken
                                };
                                this.props.updateToken(newTokenObj);
                                this.setState({tokenObj: newTokenObj}, () => this.modify());                            
                            break;
                            case "ERR_INVALIDREFRESHTOKEN":
                                console.log(data.responseCode);
                            break;
                            case "ERR_REFRESHTOKENEXPIRED":
                                    console.log(data.responseCode);
                            break;
                            default:
                            case "ERR_SYSTEM":
                                    console.log(data.responseCode);
                            break;
                        }
                    }
                    ).catch(error => {
                        this.setState({isLoading: false, buttonIsDisable:false});
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
                break;

                case "ERR_ACCESSTOKENEXPIRED":
                        console.log(data.responseCode);
                break;

                default:
                    toast.error('Hubo un error', {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                    });
                break;
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
            
        }

    }

    refreshToken(){

    }

    render() {
        const { login_status } = this.props;
        if (login_status !== 'LOGGED_IN') return <Redirect to='/' />
        return (
            <>
                {/*SEO Support*/}
                <Helmet>
                    <title>TeamUp | Modificar datos</title>
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
                                                        <p className="h4 mb-4 text-center">Modificar Datos</p>
                                                        <input type="text" id="firstName" className="form-control mb-4" placeholder="Nombre" maxLength="50" onChange={this.onChange} value={this.state.firstName} readOnly ></input>
                                                        <input type="text" id="lastName" className="form-control mb-4" placeholder="Apellido" maxLength="50" onChange={this.onChange} value={this.state.lastName} readOnly></input>
                                                        <input type="email" id="email" className="form-control mb-4" placeholder="Correo (*)" maxLength="50" onChange={this.onChange} value={this.state.email}></input>                                                        
                                                        <input type="text" id="phone" className="form-control mb-4" placeholder="Numero telefónico" aria-describedby="phone" maxLength="30" onChange={this.onChange} value={this.state.phone}></input>
                                                        <small id="passwordHelper" className="form-text text-muted mb-2">La contraseña debe contener al menos 6 caracteres</small>
                                                        <input type="password" name="password" id="password" className="form-control mb-4" placeholder="Contraseña (*)" maxLength="100" onChange={this.onChange}></input>
                                                        <input type="password" name="passwordConfirm" id="passwordConfirm" className="form-control mb-4" placeholder="Repetir contraseña (*)" maxLength="100" onChange={this.onChange}></input>
                                                        <small id="emailHelper" className="form-text text-muted mb-2">Estos son los datos de su empresa (si aplica):</small>
                                                        <input type="text" id="rut" className="form-control mb-4" placeholder="Rut" aria-describedby="rut" maxLength="50" onChange={this.onChange} value={this.state.rut} readOnly></input>
                                                        <input type="text" id="razonSocial" className="form-control mb-4" placeholder="Razón Social" aria-describedby="razonSocial" maxLength="50" onChange={this.onChange} value={this.state.razonSocial} readOnly></input>
                                                        <input type="text" id="address" className="form-control mb-4" placeholder="Dirección" aria-describedby="address" maxLength="100" onChange={this.onChange} value={this.state.address}></input>
                                                        <div className="text-center">
                                                            <input readOnly defaultValue='Guardar' className="btn btn-primary" onClick={() => { this.modify() }} />
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
const mapStateToProps = (state) => {
    return {
        login_status: state.loginData.login_status,
        userData: state.loginData.userData,
        tokenObj: state.loginData.tokenObj,
    }
}

const mapDispatchToProps = (dispatch) =>{
    return{
        modifyData : (userData) => { dispatch (modifyData(userData))},
        logOut: () => dispatch(logOut()),
        updateToken: (tokenObj) => dispatch(updateToken(tokenObj))
    }
}
export default connect(mapStateToProps,mapDispatchToProps)(Modify);