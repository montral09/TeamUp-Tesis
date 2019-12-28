import React from 'react';
import Header from "../header/header";
import { Link, Redirect } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { connect } from 'react-redux';
import { logOut } from '../../services/login/actions';

import { callAPI } from '../generic/genericFunctions';
// Multilanguage
import { withTranslate } from 'react-redux-multilingual'
import { compose } from 'redux';

class DeleteUser extends React.Component {

    constructor(props){
        super(props);
        this.state ={
            generalError: false
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

    deleteUser = () => {
        var objApi = {};
        objApi.objToSend = {
            mail : ""
        }
        objApi.fetchUrl = "https://localhost:44372/api/user";
        objApi.method = "GET";
        objApi.responseSuccess = "SUCC_USRDELETED";
        objApi.successMSG = {
            SUCC_USRDELETED : this.props.translate('SUCC_USRDELETED'),
        };
        objApi.functionAfterSuccess = "deleteUser";
        objApi.callFunctionAfterApiError = "deleteUser";
        objApi.errorMSG= {
            ERR_PENDINGRESERVATIONCUSTOMER : this.props.translate('ERR_PENDINGRESERVATIONCUSTOMER'),
            ERR_PENDINGRESERVATIONPAYMENT : this.props.translate('ERR_PENDINGRESERVATIONPAYMENT'),
            ERR_PENDINGPUBLICATION : this.props.translate('ERR_PENDINGPUBLICATION'),
            ERR_PENDINGRESERVATIONPUBLISHER : this.props.translate('ERR_PENDINGRESERVATIONPUBLISHER'),
            ERR_PENDINGPREFERENTIALPAYMENT : this.props.translate('ERR_PENDINGPREFERENTIALPAYMENT'),
            ERR_PENDINGCOMMISSIONPAYMENT : this.props.translate('ERR_PENDINGCOMMISSIONPAYMENT'),
        }
        objApi.logOut = this.props.logOut;
        callAPI(objApi, this);
    }

    render() {
        if (this.props.login_status != 'LOGGED_IN') return <Redirect to='/' />
        if (this.state.generalError) return <Redirect to='/error' />
        const { translate } = this.props;

        return (
            <>
                {/*SEO Support*/}
                <Helmet>
                    <title>TeamUp | {translate('singInLinks_head_deleteUser')}</title>
                    <meta name="description" content="---" />
                </Helmet>
                {/*SEO Support End */}
                <Header />
                <div className="main-content  full-width  home">
                    <div className="pattern" >
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
                                                    <p className="h4 mb-4">{translate('singInLinks_head_deleteUser')}</p>
                                                    <p className="mb-4">{translate('deleteUser_body')}</p>
                                                    <input readOnly defaultValue={translate('accept_w')} className="btn btn-primary" onClick={() => { this.deleteUser() }} />
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

const mapDispatchToProps = (dispatch) => {
    return {
        logOut: () => { dispatch(logOut()) }
    }
}
const enhance = compose(
    connect(mapStateToProps, mapDispatchToProps),
    withTranslate
)
export default enhance(DeleteUser);