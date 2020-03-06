import React, { Fragment } from 'react';
import {
    Container, Col, Form,
    FormGroup, Label, Input,
    Button
} from 'reactstrap';
import {BrowserRouter as Redirect} from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { connect } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import './Login.css';
import { logIn } from '../../reducers/auth/actions';
import {displayErrorMessage} from '../../config/genericFunctions'

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            loggedIn: false,
            isLoading: false,
            buttonIsDisable: false,
            bindThis : this
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
    toggleButton = () =>   {
        this.setState({
            isLoading: !this.state.isLoading,
            buttonIsDisable: !this.state.buttonIsDisable
        })
    }
    checkRequiredInputs=()=> {
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
            displayErrorMessage(message);
        }
        
        return returnValue;
    }
    submitForm =(e)=> {
        e.preventDefault();
        if (this.state.password && this.state.email) {
            this.toggleButton();
            this.props.logIn(this.state);
        } else {
            displayErrorMessage('Por favor ingrese correo y contraseña');
        }
    }
    render() {
        let { login_status } = this.props;
        if(login_status == 'LOGGED_IN') return <Redirect to='/'/>
        return (
            <Fragment>
                <ToastContainer/>
                <Container className="LoginForm">
                    <h2>Team UP! Admin - Login</h2>
                    <Form className="form" onSubmit={(e) => this.submitForm(e)}>
                        <Col>
                            <FormGroup>
                                <Label>Usuario</Label>
                                <Input
                                    type="email"
                                    name="email"
                                    id="email"
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
                        <Button>Login &nbsp;&nbsp;{this.state.isLoading &&
                                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>}</Button>
                    </Form>
                    
                </Container>
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