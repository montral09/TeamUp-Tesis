import React from 'react';
import { Redirect } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import 'react-toastify/dist/ReactToastify.css';
import { withTranslate } from 'react-redux-multilingual'
import { compose } from 'redux';
import { connect } from 'react-redux';
import Header from "../header/header";
import { callAPI, displayErrorMessage } from '../../services/common/genericFunctions';
import {MAIN_URL_WEB} from '../../services/common/constants';

class Register extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            firstName : '',
            lastName : '',
            phone : '',
            email: '',
            password: '',
            passwordConfirm: "",
            gestorCheckbox : '',
            rut : '',
            razonSocial : '',
            address : '',
            isLoading : false,
            buttonIsDisable: false,
            Language : 'es'
        }
    }

    componentDidMount() {
        window.scrollTo(0, 0);
    }

    // This function will handle the onchange event from the fields
    onChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value
        })
    }
    
    // Validate if all the required inputs are inputted, returns true or false
    checkRequiredInputs = () => {
        let returnValue = false;
        let message = "";
        if (!this.state.password || !this.state.email || !this.state.firstName
            || !this.state.lastName || !this.state.phone) {
                message= this.props.translate('register_checkErrorMsg1');
                returnValue = true;
        } else if (!this.state.firstName.match(/^[A-Za-z ]+$/)) {        
            returnValue = true;
            message = this.props.translate('register_checkErrorMsg2');
        } else if (this.state.firstName.length < 2) {        
            returnValue = true;
            message = this.props.translate('register_checkErrorMsg3');
        } else if (!this.state.lastName.match(/^[A-Za-z]+$/)) {
            returnValue = true;
            message = this.props.translate('register_checkErrorMsg4');
        } else if (this.state.lastName.length < 2) {        
            returnValue = true;
            message = this.props.translate('register_checkErrorMsg5');
        } else if (this.state.password != this.state.passwordConfirm) {
            returnValue = true;
            message = this.props.translate('register_checkErrorMsg6');
        } else if (this.state.password.length < 6) {
            message=this.props.translate('register_checkErrorMsg7');
            returnValue = true;
        } else if (!this.state.email.match(/\S+@\S+.+/)) {
            message=this.props.translate('register_checkErrorMsg8');
            returnValue = true;
        } else if (!this.state.phone.match(/^[0-9]+$/) && !this.state.phone.match(/^[+]+[0-9]+$/)) {
            message=this.props.translate('register_checkErrorMsg9');
            returnValue = true;
        } else if (this.state.phone.length < 6) {
            message=this.props.translate('register_checkErrorMsg10');
            returnValue = true;
        } else if (this.state.rut && !this.state.rut.match(/^[0-9]+$/)) {
            message=this.props.translate('register_checkErrorMsg11');
            returnValue = true;
        } else if (this.state.rut && this.state.rut < 12) {
            message=this.props.translate('register_checkErrorMsg12');
            returnValue = true;
        } else if (this.state.razonSocial && this.state.razonSocial < 3) {
            message=this.props.translate('register_checkErrorMsg13');
            returnValue = true;
        } else if (this.state.address && this.state.address < 10) {
            message=this.props.translate('register_checkErrorMsg14');
            returnValue = true;
        }
        if(this.state.rut != "" || this.state.razonSocial != "" || this.state.address != ""){
            if(this.state.rut == ""){
                message=this.props.translate('register_checkErrorMsg1');
                returnValue = true;
            }else if(this.state.razonSocial == ""){
                message=this.props.translate('register_checkErrorMsg1');
                returnValue = true;
            }else if(this.state.address == ""){
                message=this.props.translate('register_checkErrorMsg1');
                returnValue = true;
            }
        }
        if(message){
            displayErrorMessage(message);
        }
        return returnValue;
    }

    // This function will call the API
    registerUser = () => {
        if (!this.checkRequiredInputs()) {
            this.setState({isLoading: true, buttonIsDisable:true});
            var objApi = {};
            objApi.objToSend = {
                Password: this.state.password,
                Mail: this.state.email,
                Name: this.state.firstName,
                LastName: this.state.lastName,
                Phone: this.state.phone,
                CheckPublisher: this.state.gestorCheckbox == 'on' ? true : false,
                Rut: this.state.rut,
                RazonSocial: this.state.razonSocial,
                Address: this.state.address,
                Language : this.state.Language
            }
            objApi.fetchUrl = "api/user";
            objApi.method = "POST";
            objApi.successMSG = {
                SUCC_USRCREATED : this.props.translate('SUCC_USRCREATED'),
            };
            objApi.functionAfterSuccess = "registerUser";
            objApi.functionAfterError = "registerUser";
            objApi.errorMSG= {
                ERR_MAILALREADYEXIST : this.props.translate('ERR_MAILALREADYEXIST')
            }
            callAPI(objApi, this);
        }

    }

    render() {
        const { login_status } = this.props;
        if(login_status == 'LOGGED_IN') return <Redirect to='/'/>
        const { translate } = this.props;

        return (
            <>
                {/*SEO Support*/}
                <Helmet>
                    <title>TeamUp | {translate('registerYourself_w')}</title>
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
                                                <div className="col-md-6">
                                                    <div className="well">
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <form className="border border-light p-6">
                                                        <p className="h4 mb-4 text-center">{translate('registerYourself_w')}</p>
                                                        <input type="text" id="firstName" className="form-control mb-4" placeholder={translate('name_w')+" (*)"} maxLength="50" pattern="[a-z][A-Z]" onChange={this.onChange}></input>
                                                        <input type="text" id="lastName" className="form-control mb-3" placeholder={translate('lastName_w')+" (*)"} maxLength="50" onChange={this.onChange}></input>
                                                        <small id="emailHelper" className="form-text text-muted mb-2">{translate('register_helper_thisIsYourUser')}</small>
                                                        <input type="email" id="email" className="form-control mb-4" placeholder={translate('email_w')+" (*)"} maxLength="50" onChange={this.onChange}></input>                                                        
                                                        <input type="text" id="phone" className="form-control mb-4" placeholder={translate('phoneNumber_w')+" (*)"} aria-describedby="phone" maxLength="15" onChange={this.onChange}></input>
                                                        <small id="passwordHelper" className="form-text text-muted mb-2">{translate('register_helper_password')}</small>
                                                        <input type="password" name="password" id="password" className="form-control mb-4" placeholder={translate('password_w')+" (*)"} maxLength="100" onChange={this.onChange}></input>
                                                        <input type="password" name="passwordConfirm" id="passwordConfirm" className="form-control mb-4" placeholder={translate('register_repeatPassword')+" (*)"} maxLength="100" onChange={this.onChange}></input>
                                                        <div className="custom-control custom-checkbox">
                                                            <input type="checkbox" className="custom-control-input mb-4" id="gestorCheckbox" onChange={this.onChange}></input>
                                                            <label className="custom-control-label mb-4" htmlFor="gestorCheckbox">{translate('register_helper_publisherApply')}</label>
                                                        </div>
                                                        <small id="emailHelper" className="form-text text-muted mb-2">{translate('register_helper_companyMessage')}:</small>
                                                        <input type="text" id="rut" className="form-control mb-4" placeholder="Rut" aria-describedby="rut" maxLength="12" onChange={this.onChange}></input>
                                                        <input type="text" id="razonSocial" className="form-control mb-4" placeholder={translate('socialReason')} aria-describedby="razonSocial" maxLength="50" onChange={this.onChange}></input>
                                                        <input type="text" id="address" className="form-control mb-4" placeholder={translate('address_w')} aria-describedby="address" maxLength="100" onChange={this.onChange}></input>
                                                        <div className="text-center">
                                                        <button className="btn btn-primary" disabled= {this.state.buttonIsDisable} type="button" value={translate('registerYourself_w')} onClick={() => { this.registerUser() }} >
                                                            {translate('registerYourself_w')}&nbsp;&nbsp;
                                                            { this.state.isLoading && 
                                                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                                            }
                                                        </button>
                                                            <hr></hr>
                                                            <p>{translate('register_termsMsg1')}
                                                                <em> {translate('registerYourself_w')}</em> {translate('register_termsMsg2')}
                                                                <a href={MAIN_URL_WEB+'termsAndConditions'} target="_blank"> {translate('register_termsMsg3')}</a>
                                                            </p>
                                                            <div className="mb-5" ></div>
                                                        </div>
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

            </>
        );
    }
}
// Mapping the current state to props, to retrieve useful information from the state
const mapStateToProps = (state) =>{
    return {
        login_status: state.loginData.login_status
    }
}
const enhance = compose(
    connect(mapStateToProps, null),
    withTranslate
)
export default enhance(Register);