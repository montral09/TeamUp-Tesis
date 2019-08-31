import React from 'react';
import Header from "../header/header";
import Footer from "../footer/footer";
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet'
import WidgetAccount from "../widgets/widgetAccount";
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
             }
            )
    }
    
    render() {
        const { translate } = this.props;
        return (
            <>
                {/*SEO Support*/}
                <Helmet>
                    <title>Avano | My Account Page</title>
                    <meta name="description" content="Avano – Multipurpose eCommerce React Template" />
                </Helmet>
                {/*SEO Support End */}
                <Header />
                <div className="breadcrumb  full-width ">
                    <div className="background-breadcrumb"></div>
                    <div className="background">
                        <div className="shadow"></div>
                        <div className="pattern">
                            <div className="container">
                                <div className="clearfix">
                                    <ul>
                                        <li><Link to="/">{translate('home')}</Link></li>
                                        <li><Link to="/">{translate('my_account')}</Link></li>
                                        <li>{translate('login')}</li>
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
                                                <h1>{translate('login')}</h1>
                                                <div className="row">
                                                    <div className="col-md-6">
                                                        <div className="well">
                                                            <h4>{translate('new_customer')}</h4>
                                                            <p><strong>{translate('register_account')}</strong></p>
                                                            <p style={{ paddingBottom: '10px' }}>{translate('login_text_1')}</p>
                                                            <Link to={`${process.env.PUBLIC_URL}/account/register`} className="btn btn-primary">{translate('continue')}</Link>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="well">
                                                            <h4>{translate('returning_customer')}</h4>
                                                            <p><strong>{translate('i_am_returning_customer')}</strong></p>
                                                            <form onSubmit = {this.login}>
                                                                <div className="form-group">
                                                                    <label className="control-label" htmlFor="input-email">{translate('email_address')}</label>
                                                                    {/* Input for email */}
                                                                    <input 
                                                                        type="text"
                                                                        name="email" 
                                                                        placeholder={translate('email_address')} 
                                                                        id="input-email" 
                                                                        className="form-control"
                                                                        onChange={this.onChange}
                                                                    />
                                                                </div>
                                                                <div className="form-group" style={{ paddingBottom: '10px' }}>
                                                                    <label className="control-label" htmlFor="input-password">{translate('password')}</label>
                                                                    {/* Input for email */}
                                                                    <input 
                                                                        type="password"
                                                                        name="password" 
                                                                        placeholder={translate('password')} 
                                                                        id="input-password" 
                                                                        className="form-control" 
                                                                        onChange={this.onChange}
                                                                    />
                                                                    <Link to={`${process.env.PUBLIC_URL}/account/forgotten`}>{translate('forgotten')}</Link>
                                                                </div>
                                                                <Button className='btn btn-primary' onClick={() => { this.login() }}>{translate('login')}</Button>
                                                                {/* <input type="submit" value={translate('login')} className="btn btn-primary" /> */}
                                                            </form>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-3 " id="column-right">
                                                <WidgetAccount />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </>
        );
    }
}

export default withTranslate(Login);