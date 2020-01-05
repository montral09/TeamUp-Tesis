import React from 'react';
import './Login.css';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import {Navigation} from '../Navigation/Navigation';



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

        fetch('https://localhost:44372/api/Login', {
            method: 'POST',
            header: { 'Content-Type': 'application/json', 'Accept': 'application/json' },

            body: JSON.stringify({
                Nombre: this.state.email,
                Apellido: null,
                Contrasena: null,
                Correo: null
            })
        })
            .then(response => response.json())
            .then((result) => {
                console.log(result);
            }
            ).catch(error =>  {
            console.log(error);
        }
            )
    }

    render() {
        return (
            <div>
                <Navigation />
            <Form className='login-form'>
                <h2 className="text-center">Bienvenidos</h2>
                <FormGroup>
                    <Label>Correo</Label>
                    <Input type="email" placeholder="Correo" onChange={(text) => { this.handleEmail(text) }} />
                </FormGroup>
                <FormGroup>
                    <Label>Contraseña</Label>
                    <Input type="password" placeholder="Contraseña" onChange={(text) => { this.handlePassowrd(text) }} />
                </FormGroup>
                <Button className='btn-lg btn-dark btn-block' onClick={() => { this.login() }}>Iniciar sesion</Button>
                <div className="text-center">
                    <a href='/registrarse'>Registrarse</a>
                    <span className='p-2'> | </span><br />
                    <a href='/olvidoclave'>Olvido su contraseña</a>
                </div>
            </Form>
            </div>
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