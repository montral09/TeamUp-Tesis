import React, { Fragment } from 'react';
import {
    Container, Col, Form,
    FormGroup, Label, Input,
    Button
} from 'reactstrap';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Login.css';

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: 'admin@admin',
            password: 'admin',
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

    submitForm(e) {
        e.preventDefault();
        console.log(`Email: ${this.state.email}`)
        console.log(`password: ${this.state.password}`)
        if (this.state.password && this.state.email) {
            fetch('https://localhost:44372/api/admin', {
                method: 'POST',
                header: { 'Content-Type': 'application/json', 'Accept': 'application/json' },

                body: JSON.stringify({
                    Password: this.state.password,
                    Mail: this.state.email
                })
            }).then(response => response.json()).then(data => {
                console.log("data:" + JSON.stringify(data));
                if (data.responseCode == "SUCC_USRLOGSUCCESS") {
                    toast.success('Bienvenid@, ' + data.voAdmin.Name, {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                    });
                    console.log(data.voAdmin);
                    //his.props.logIn(data.voAdmin); // this is calling the reducer to store the data on redux Store
                    //this.props.history.push('#/dashboards/basic'); // TBD how to redirect???????????????
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
        const { email, password } = this.state;
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
                                    placeholder="myemail@email.com"
                                    value={email}
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
                                    placeholder="********"
                                    value={password}
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

export default Login;