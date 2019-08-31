import React from 'react';
import Header from "../header/header";
import { Link } from 'react-router-dom';
import { Button } from 'reactstrap';

// Multilanguage
import { withTranslate } from 'react-redux-multilingual'

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: ''
        }
    }

    componentDidMount() {
        window.scrollTo(0, 0);
    }
    
    onChange = (e) => {
        this.setState( {
            [e.target.name]: e.target.value })
    }

    login() {
        fetch('https://localhost:44372/api/Login', {
            method: 'POST',
            header: { 'Content-Type': 'application/json', 'Accept': 'application/json' },

            body: JSON.stringify({                
                Password: this.state.password,
                Mail: this.state.email
            })
        })
            .then(response => response.json())
            .then(data => {  
                 this.props.setState({userName: data.Name});
                 console.log(this.props);                 
            }
            ).catch(error =>  {
                console.log(error);
             }
            )
    }
    
    render() {
        const { translate } = this.props;
        return (
            <>
                <Header />
                <div className="breadcrumb  full-width ">
                    <div className="background-breadcrumb"></div>
                    <div className="background">
                        <div className="shadow"></div>
                        <div className="pattern">
                            <div className="container">
                                <div className="clearfix">
                                    <ul>
                                        <li><Link to="/">Home</Link></li>
                                        <li><Link to="/">Mi cuenta</Link></li>
                                        <li>Login</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="main-content  full-width  home">
                    <div className="background-content"></div>
                    <div className="background">
                        <div className="shadow"></div>
                        <div className="pattern">
                            <div className="container">
                                <div className="row">
                                    <div className="col-md-12">
                                        <div className="row">                                                                  
                                            <div className="col-md-9 center-column" id="content">
                                                <h1>Login</h1>
                                                <div className="row">

                                                    <div className="col-md-6">
                                                        <div className="well">
                                                            <form onSubmit = {this.login}>
                                                                <div className="form-group">
                                                                    <label className="control-label" htmlFor="input-email">Correo</label>
                                                                    {/* Input for email */}
                                                                    <input 
                                                                        type="text"
                                                                        name="email" 
                                                                        placeholder='Correo'
                                                                        id="input-email" 
                                                                        className="form-control"
                                                                        onChange={this.onChange}
                                                                    />
                                                                </div>
                                                                <div className="form-group" style={{ paddingBottom: '10px' }}>
                                                                    <label className="control-label" htmlFor="input-password">Password</label>
                                                                    {/* Input for email */}
                                                                    <input 
                                                                        type="password"
                                                                        name="password" 
                                                                        placeholder='Password' 
                                                                        id="input-password" 
                                                                        className="form-control" 
                                                                        onChange={this.onChange}
                                                                    />
                                                                    
                                                                </div>
                                                                <Button className='btn btn-primary' onClick={() => { this.login() }}>Login</Button>
                                                                {/* <input type="submit" value={translate('login')} className="btn btn-primary" /> */}
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
                    </div>
                </div>
            </>
        );
    }
}

export default Login;