import React from 'react';
import { Redirect } from 'react-router-dom';
import { Helmet } from 'react-helmet';
// Multilanguage
import { withTranslate } from 'react-redux-multilingual'
import { compose } from 'redux';
import 'react-toastify/dist/ReactToastify.css';
import { connect } from 'react-redux';
import Header from "../header/header";
import MyMessagesTable from './myMessagesTable';
import LoadingOverlay from 'react-loading-overlay';
import ModalReqInfo from '../publications/viewPublication/modalReqInfo';
import { MAX_ELEMENTS_PER_TABLE } from '../../services/common/constants'
import { callAPI } from '../../services/common/genericFunctions';

class MyMessagesList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loadingMessages : true,
            messages : [],
            messagesToDisplay : [],
            generalError : false,
            modalConfigObj: {},
            pagination: [1],
            currentPage: 1
        }
        this.modalReqInfo    = React.createRef(); // Connects the reference to the modal
    }

    componentDidMount() {
        window.scrollTo(0, 0);
        this.loadMessages();
    }
    changePage = (pageClicked) => {
        this.setState({ messagesToDisplay: this.filterPaginationArray(this.state.messages, (this.state.currentPage - 1) * MAX_ELEMENTS_PER_TABLE), currentPage: pageClicked },
            () => this.setState({ messagesToDisplay: this.filterPaginationArray(this.state.messages, (this.state.currentPage - 1) * MAX_ELEMENTS_PER_TABLE), currentPage: pageClicked }))
    }

    filterPaginationArray = (arrayToFilter, startIndex) => {
        return arrayToFilter.slice(startIndex, startIndex + MAX_ELEMENTS_PER_TABLE)
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
                                <br />
                                <div className="row pagination-results">
                                    <div className="col-md-6 text-left">
                                        <ul className="pagination">
                                            {this.state.pagination.map(page => {
                                                return (
                                                    <li className={this.state.currentPage === page ? 'active' : ''} key={page}><a href="#pagination" onClick={() => this.changePage(page)}>{page}</a></li>
                                                );
                                            })}
                                        </ul>
                                    </div>
                                    <div className="col-md-6 text-right">{translate('showing_w')} {MAX_ELEMENTS_PER_TABLE * this.state.currentPage < this.state.messages.length ? MAX_ELEMENTS_PER_TABLE * this.state.currentPage : this.state.messages.length} {translate('of_w')} {this.state.messages.length}</div>
                                </div>
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