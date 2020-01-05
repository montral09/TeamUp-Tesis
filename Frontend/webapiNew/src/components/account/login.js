import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { logIn } from '../../services/login/actions';
import { displayErrorMessage } from '../../services/common/genericFunctions';
// Multilanguage
import { withTranslate } from 'react-redux-multilingual'
import { compose } from 'redux';

class Login extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            isLoading: false,
            buttonIsDisable: false,
            translate : props.translate,
            bindThis : this
        }
    }

    componentDidMount() {
        window.scrollTo(0, 0);
    }

    onChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    checkRequiredInputs() {
        let returnValue = false;
        let message = "";
        if (!this.state.password || !this.state.email) {
            message = this.props.translate('login_errorMsg1');
            returnValue = true;
        } else if (!this.state.email.match(/\S+@\S+/)) {
            message = this.props.translate('login_errorMsg2');
            returnValue = true;
        }

        if (message) {
            displayErrorMessage(message);
        }

        return returnValue;
    }

    login = () =>  {
        if (!this.checkRequiredInputs()) {
            this.toggleButton();
            this.props.logIn(this.state);
            const scopeThis = this;
            setTimeout(function () {
                scopeThis.toggleButton();
            }, 350);
        }
    }
    toggleButton() {
        this.setState({
            isLoading: !this.state.isLoading,
            buttonIsDisable: !this.state.buttonIsDisable
        })
    }

    render() {
        let { login_status, redirectToMain } = this.props;
        if (login_status == 'LOGGED_IN' && redirectToMain) return <Redirect to='/' />
        const { translate } = this.props;

        return (
            <div className="well">
                <form className="text-center border border-light p-5" action="#!">
                    <p className="h4 mb-4">{translate('login_login')}</p>
                    <input type="email" name="email" id="input-email" className="form-control mb-4" placeholder={translate('email_w')}maxLength="50" onChange={this.onChange}></input>
                    <input type="password" name="password" id="input-password" className="form-control mb-4" placeholder={translate('password_w')} maxLength="100" onChange={this.onChange}></input>
                    <div className="d-flex justify-content-around mb-2">
                        <div>
                            <Link target="_blank" to="/account/forgotPassword">{translate('login_forgotPassword')}</Link>
                        </div>
                    </div>
                    <button className="btn btn-primary" disabled={this.state.buttonIsDisable} type="button" value={translate('registerYourself_w')} onClick={() => { this.login() }} >

                        {translate('login_login')}&nbsp;&nbsp;
                                        {this.state.isLoading &&
                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        }
                    </button>
                    <p>{translate('login_dontHaveAccount')}
                        <Link target="_blank" to="/account/register"> {translate('registerYourself_w')}</Link>
                    </p>
                </form>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        login_status: state.loginData.login_status,
        userData: state.loginData.userData,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        logIn: (userData) => { dispatch(logIn(userData)) }
    }
}
const enhance = compose(
    connect(mapStateToProps, mapDispatchToProps),
    withTranslate
)
export default enhance(Login);
