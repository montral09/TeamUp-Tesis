import React from 'react';
import { Helmet } from 'react-helmet';
import Header from "../header/header";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { callAPI } from '../../services/common/genericFunctions';

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
            objApi.callFunctionAfterApiError = "validateEmail";
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
                    <title>TeamUp | Validar Email</title>
                    <meta name="description" content="---" />
                </Helmet>
                {/*SEO Support End */}
                <Header />
                <div className="main-content  full-width  home">
                    <div className="col-md-6">
                        { this.state.isLoading ? <div><div className="spinner-border"></div>Validando...</div> : <div>VALIDADO!</div>}
                        Token received: {this.state.emailtoken}
                    </div>
                </div>
            </>
        );
    }
}

export default ValidateEmail;