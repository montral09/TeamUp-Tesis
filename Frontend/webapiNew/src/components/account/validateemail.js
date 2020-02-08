import React from 'react';
import { Helmet } from 'react-helmet';
import Header from "../header/header";
import { callAPI } from '../../services/common/genericFunctions';
import { withTranslate } from 'react-redux-multilingual'

class ValidateEmail extends React.Component {
    constructor(props) {
        super(props);
        const emailtoken = props.match.params.emailtoken;
        this.state = {
            emailtoken: emailtoken,
            isLoading: true,
            message: ""
        }

    }
    componentDidMount() {
        this.validateEmail();
    }
    
    // This function will call the API
    validateEmail = () => {
        if(this.state.emailtoken){
            var objApi = {};
            objApi.objToSend = {
                ActivationCode: this.state.emailtoken
            }
            objApi.fetchUrl = "api/validateEmail";
            objApi.method = "POST";
            objApi.successMSG = {
                SUCC_EMAILVALIDATED : this.props.translate('SUCC_EMAILVALIDATED'),
            };
            objApi.functionAfterSuccess = "validateEmail";
            objApi.functionAfterError = "validateEmail";
            objApi.errorMSG= {
                ERR_ACTIVATIONCODENOTEXIST : this.props.translate('ERR_ACTIVATIONCODENOTEXIST')
            }
            callAPI(objApi, this);
        }
    }

    render() {
        return (
            <>
                {/*SEO Support*/}
                <Helmet>
                    <title>TeamUp | {this.props.translate('validateEmail_header')}</title>
                    <meta name="description" content="---" />
                </Helmet>
                {/*SEO Support End */}
                <Header />
                <div className="main-content  full-width  home">
                    <div className="col-md-6">
                        { this.state.isLoading ? 
                            (<div><div className="spinner-border"></div>{this.props.translate('validateEmail_header')}</div>) 
                                : 
                            (this.state.isValid ? (<div>{this.props.translate('validateEmail_validated')}</div>) : (<div>{this.props.translate('validateEmail_notValid')}</div>))}
                    </div>
                </div>
            </>
        );
    }
}

export default withTranslate(ValidateEmail);