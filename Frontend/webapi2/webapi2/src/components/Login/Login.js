import React from 'react';
import './Login.css';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';


class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: ''
        }
    }
    handleEmail(text) {
        this.setState({ email: text.target.value })
    }
    handlePassowrd(text) {
        this.setState({ password: text.target.value })
    }
    login() {
        /*
        let loginObj = {
            email: this.state.email,
            password: this.state.password
        };*/
        let tempTESTLOGINHARDCODED = {
            Nombre: this.state.email,
            Apellido: this.state.email,
            Contrasena: this.state.email,
            Correo: this.state.email
        }

        fetch('https://localhost:44372/api/login2', {
            header: { 'Content-Type': 'application/json' , 'Accept': 'application/json'},
            method: 'POST',
            body: JSON.stringify(tempTESTLOGINHARDCODED)
        })
            .then(response => {
                console.log("Retrieved data:");
                console.log(response);
            })
            .catch(error => {
                console.log(error);
            });
    }

    render() {
        return (
            <Form className='login-form'>
                <h1>
                    <span className='font-weight-bold'>TEAMUP</span>.com
        </h1>
                <h2 className="text-center">Bienvenidos</h2>
                <FormGroup>
                    <Label>Correo</Label>
                    <Input type="email" placeholder="Correo" onChange={(text) => { this.handleEmail(text) }} />
                </FormGroup>
                <FormGroup>
                    <Label>Contraseña</Label>
                    <Input type="password" placeholder="Contraseña" onChange={(text) => { this.handlePassowrd(text) }} />
                </FormGroup>
                <Button className='btn-lg btn-dark btn-block' onClick={()=>{this.login()}}>Iniciar sesion</Button>
                <div className="text-center">
                    <a href='/registrarse'>Registrarse</a>
                    <span className='p-2'> | </span><br />
                    <a href='/olvidoclave'>Olvido su contraseña</a>
                </div>
            </Form>
        );
    }
}

/*
OLD
const Login = (props) => {
    return (
        <Form className='login-form'>
            <h1>
                <span className='font-weight-bold'>TEAMUP</span>.com
            </h1>
            <h2 className="text-center">Bienvenidos</h2>
            <FormGroup>
                <Label>Correo</Label>
                <Input type="email" placeholder="Correo"/>
            </FormGroup>
            <FormGroup>
                <Label>Contraseña</Label>
                <Input type="password" placeholder="Contraseña"/>
            </FormGroup>
            <Button className='btn-lg btn-dark btn-block'>Iniciar sesion</Button>
            <div className="text-center">
                <a href='/registrarse'>Registrarse</a>
                <span className='p-2'> | </span>
                <a href='/olvidoclave'>Olvido su contraseña</a>
            </div>
        </Form>
    )
}
*/
export default Login;