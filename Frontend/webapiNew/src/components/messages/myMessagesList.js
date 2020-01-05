import React from 'react';
import Header from "../header/header";
import { Redirect } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { connect } from 'react-redux';
import MyMessagesTable from './myMessagesTable';
import LoadingOverlay from 'react-loading-overlay';
import ModalReqInfo from '../publications/viewPublication/modalReqInfo';

import { callAPI } from '../../services/common/genericFunctions';
// Multilanguage
import { withTranslate } from 'react-redux-multilingual'
import { compose } from 'redux';


class MyMessagesList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loadingMessages : true,
            messages : [],
            generalError : false,
            modalConfigObj: {}
        }
        this.modalReqInfo    = React.createRef(); // Connects the reference to the modal
    }

    componentDidMount() {
        window.scrollTo(0, 0);
        this.loadMessages();
    }

    loadMessages = () => {
        var objApi = {};
        objApi.objToSend = {
            "AccessToken": this.props.tokenObj.accesToken,
            "Mail": this.props.userData.Mail,     
        }
        objApi.fetchUrl = "api/messages";
        objApi.method = "POST";
        objApi.successMSG = {
            SUCC_MESSAGESOK : "",
        };
        objApi.functionAfterSuccess = "loadMessages";
        objApi.functionAfterError = "loadMessages";
        objApi.errorMSG= {};
        callAPI(objApi, this);
    }
    
    answerMsg = (questionObj) => {
        var modalConfigObj ={
            title: 'Responder', mainText: <><strong>{this.props.translate('question_w')}:</strong><em>{' "'+questionObj.Question+'"'}</em></>, mode : "ANSWER", saveFunction : "saveAnswerMSG", textboxLabel: 'Respuesta',
            textboxDisplay:true, cancelAvailable:true, confirmAvailable:true, cancelText :this.props.translate('cancel_w'), confirmText : this.props.translate('reply_w') , login_status: this.props.login_status, IdQuestion : questionObj.IdQuestion
        };
        this.setState({modalConfigObj : modalConfigObj},() => {this.modalReqInfo.current.toggle();})

    }
    triggerSaveModal = (saveFunction, objData) => {
        switch(saveFunction){
            case "saveAnswerMSG": this.saveAnswerMSG(objData.textboxValue);break;
        }
    }
    saveAnswerMSG = (answer) => {
        var objApi = {};
        objApi.objToSend = {
            "AccessToken": this.props.tokenObj.accesToken,
            "Mail": this.props.userData.Mail,
            "IdQuestion": this.state.modalConfigObj.IdQuestion,
            "Answer": answer
        }
        objApi.fetchUrl = 'api/publicationQuestions';
        objApi.method = "PUT";
        objApi.successMSG = {
            SUCC_ANSWERCREATED : this.props.translate('SUCC_ANSWERCREATED'),
        };
        objApi.functionAfterSuccess = "saveAnswerMSG";
        objApi.functionAfterError = "saveAnswerMSG";
        objApi.errorMSG= {}
        this.modalReqInfo.current.changeModalLoadingState(false);
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
                    <title>TeamUp | {translate('myMessages_title')}</title>
                    <meta name="description" content="---" />
                </Helmet>
                {/*SEO Support End */}
                <LoadingOverlay
                    active={this.state.loadingMessages}
                    spinner
                    text='Cargando...'
                >
                    <Header />
                    <div className="main-content  full-width  home">
                        <div className="pattern" >
                            <h1>{translate('myMessages_title')}</h1>
                            <div className="col-md-12 center-column">
                                <ModalReqInfo ref={this.modalReqInfo} triggerSaveModal={this.triggerSaveModal}
                                    modalConfigObj={this.state.modalConfigObj} />
                                {(!this.state.loadingMessages) ?
                                    (<MyMessagesTable messages={this.state.messages} answerMsg={this.answerMsg} />)
                                : ( <div style={{ height:"100ph", display:"block", width:"100ph" }}> <p>{translate('loading_text_small')}</p></div>)
                                }
                            </div>
                        </div>
                    </div>
                </LoadingOverlay>
                </>
        );
    }
}
const mapStateToProps = (state) => {
    return {
        login_status: state.loginData.login_status,
        tokenObj: state.loginData.tokenObj,
        userData: state.loginData.userData,
    }
}
const enhance = compose(
    connect(mapStateToProps, null),
    withTranslate
)
export default enhance(MyMessagesList);