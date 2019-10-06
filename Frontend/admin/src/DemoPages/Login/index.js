import React, { Fragment } from 'react';
import {
    Container, Col, Form,
    FormGroup, Label, Input,
    Button
} from 'reactstrap';
import {BrowserRouter as Router, Route, Redirect} from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Login.css';

import { connect } from 'react-redux';
import { logIn } from '../../reducers/auth/actions';

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: 'admin@admin',
            password: 'admin',
            loggedIn: false
        }
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange = async (event) => {
        const { target } = event;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const { name } = target;
        await this.setState({
            [name]: value,
        });
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
    submitForm(e) {
        e.preventDefault();
        console.log(`Email: ${this.state.email}`)
        console.log(`password: ${this.state.password}`)
        if (this.state.password && this.state.email) {
            this.props.logIn(this.state);
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
        const { email, password } = this.state;
        let { login_status } = this.props;
        if(login_status == 'LOGGED_IN') return <Redirect to='/'/>
        return (
            <Fragment>
                <Container className="LoginForm">
                    <h2>Team UP! Admin - Login</h2>
                    <Form className="form" onSubmit={(e) => this.submitForm(e)}>
                        <Col>
                            <FormGroup>
                                <Label>Username</Label>
                                <Input
                                    type="email"
                                    name="email"
                                    id="exampleEmail"
                                    placeholder="Correo"
                                    onChange={(e) => {
                                        this.handleChange(e)
                                    }}
                                />
                            </FormGroup>
                        </Col>
                        <Col>
                            <FormGroup>
                                <Label for="adminPassword">Contraseña</Label>
                                <Input
                                    type="password"
                                    name="password"
                                    id="adminPassword"
                                    placeholder="Password"
                                    onChange={(e) => this.handleChange(e)}
                                />
                            </FormGroup>
                        </Col>
                        <Button>Login</Button>
                    </Form>
                </Container>
                <ToastContainer/>
            </Fragment>
        );
    }
}
const mapStateToProps = (state) =>{
    return {
        login_status: state.loginData.login_status,
        adminData: state.loginData.adminData,
    }
}

const mapDispatchToProps = (dispatch) =>{
    return{
        logIn : (adminData) => { dispatch (logIn(adminData))}
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);