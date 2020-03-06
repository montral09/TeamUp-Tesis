import React from 'react';
import Header from "../header/header";
import { Link, Redirect } from 'react-router-dom';
import { Helmet } from 'react-helmet';

import { connect } from 'react-redux';

import { callAPI, displayErrorMessage } from '../../services/common/genericFunctions';
// Multilanguage
import { withTranslate } from 'react-redux-multilingual'
import { compose } from 'redux';

class ForgotPassword extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            generalError: false,
            isLoading: false,
        }
    }

    componentDidMount() {
        window.scrollTo(0, 0);
    }

    // This function will handle the onchange event from the fields
    onChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    // This function will call the API
    restoreUser = () => {
        if (this.state.email) {
            var objApi = {};
            objApi.objToSend = {
                Mail: this.state.email
            }
            objApi.fetchUrl = "api/passwordRecovery";
            objApi.method = "POST";
            objApi.successMSG = {
                SUCC_PASSWORDUPDATED: this.props.translate('SUCC_PASSWORDUPDATED'),
            };
            objApi.functionAfterSuccess = "restoreUser";
            objApi.functionAfterError = "restoreUser";
            objApi.errorMSG = {
                ERR_USRMAILNOTEXIST: this.props.translate('ERR_USRMAILNOTEXIST')
            }
            objApi.logOut = this.props.logOut;
            this.setState({ isLoading: true });
            callAPI(objApi, this);
        } else {
            this.props.translate('forgotPassword_errMsg1');
        }

    }

    render() {
        const { login_status } = this.props;
        if (login_status == 'LOGGED_IN') return <Redirect to='/' />
        const { translate } = this.props;

        return (
            <>
                {/*SEO Support*/}
                <Helmet>
                    <title>TeamUp | {translate('forgotPassword_header')}</title>
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
                                                <div className="col-md-5">
                                                    <div className="well">
                                                    </div>
                                                </div>
                                                <div className="col-md-5">
                                                    <div className="well">
                                                        <form className="text-center border border-light p-5" action="#!">
                                                            <p className="h4 mb-4">{translate('forgotPassword_header')}</p>
                                                            <input type="email" name="email" id="input-email" className="form-control mb-4" placeholder={translate('email_w')} onChange={this.onChange}></input>
                                                            <button type="button" id="button-review" disabled={this.state.isLoading} className="btn btn-primary" onClick={() => this.restoreUser()}>{translate('recover_w')}
                                                                &nbsp;&nbsp;{this.state.isLoading &&
                                                                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                                            }</button>
                                                        </form>
                                                    </div>
                                                </div>
                                                <div className="col-md-2"></div>
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
    }
}

const enhance = compose(
    connect(mapStateToProps, null),
    withTranslate
)
export default enhance(ForgotPassword);
