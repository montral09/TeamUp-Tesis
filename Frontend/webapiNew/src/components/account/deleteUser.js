import React from 'react';
import Header from "../header/header";
import { Redirect } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import { logOut } from '../../services/login/actions';
import { callAPI } from '../../services/common/genericFunctions';
// Multilanguage
import { withTranslate } from 'react-redux-multilingual'
import { compose } from 'redux';

class DeleteUser extends React.Component {

    constructor(props){
        super(props);
        this.state ={
            generalError: false,
            buttonIsDisable: false,
            isLoading: false
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
    deleteUser = () => {
        var objApi = {};
        objApi.objToSend = {
            "AccessToken": this.props.tokenObj.accesToken,
            "Mail": this.props.userData.Mail,
        }
        objApi.fetchUrl = "api/user";
        objApi.method = "DELETE";
        objApi.successMSG = {
            SUCC_USRDELETED : this.props.translate('SUCC_USRDELETED'),
        };
        objApi.functionAfterSuccess = "deleteUser";
        objApi.functionAfterError = "deleteUser";
        objApi.errorMSG= {
            ERR_PENDINGRESERVATIONCUSTOMER : this.props.translate('ERR_PENDINGRESERVATIONCUSTOMER'),
            ERR_PENDINGRESERVATIONPAYMENT : this.props.translate('ERR_PENDINGRESERVATIONPAYMENT'),
            ERR_PENDINGPUBLICATION : this.props.translate('ERR_PENDINGPUBLICATION'),
            ERR_PENDINGRESERVATIONPUBLISHER : this.props.translate('ERR_PENDINGRESERVATIONPUBLISHER'),
            ERR_PENDINGPREFERENTIALPAYMENT : this.props.translate('ERR_PENDINGPREFERENTIALPAYMENT'),
            ERR_PENDINGCOMMISSIONPAYMENT : this.props.translate('ERR_PENDINGCOMMISSIONPAYMENT'),
        }
        objApi.logOut = this.props.logOut;
        this.toggleButton();
        callAPI(objApi, this);
    }
    // Change the button status
    toggleButton = () =>   {
        this.setState({
            isLoading: !this.state.isLoading,
            buttonIsDisable: !this.state.buttonIsDisable
        })
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
                                                    <button className="btn btn-primary" disabled={this.state.buttonIsDisable} type="button" value={translate('accept_w')} onClick={() => { this.deleteUser() }} >
                                                        {translate('accept_w')}&nbsp;&nbsp;
                                                            {this.state.isLoading &&
                                                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                                        }
                                                        </button>
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
        tokenObj: state.loginData.tokenObj
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