import React from "react";
import { Link } from 'react-router-dom';
import { withTranslate } from 'react-redux-multilingual'

class TabQuestions extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            textQuestion : "",
            isLoading : false
        }
    }
    onChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value
        });
    }
    render() {
        const {arrQA, isMyPublication, translate} = this.props;
        return (
            <React.Fragment>
                <form className="form-horizontal" id="form-review">
                    <div id="review">
                        {arrQA && arrQA.length > 0 ? (
                            <div className="review-list">
                                {arrQA.map((QA, index) => {
                                    return (
                                        <React.Fragment key={index}>
                                            <div className="review" >
                                                <div className="author"><b>{QA.Name}</b> <span>{QA.CreationDate}</span>{<span>{!QA.Answer && isMyPublication ? (<a className = "col-md-12" onClick={() => this.props.triggerModal({mode:"ANSWER", questionObj: QA })}><span><i className="col-md-1 fa fa-exclamation-circle"></i></span>{translate('reply_w')}</a>) : (null)}</span>}</div>
                                                <div className="text">{QA.Question}</div>
                                            </div>
                                            {QA.Answer ? (
                                                <div className="review" style={{ marginLeft: '5%' }}>
                                                    <div className="author"><strong><b>{translate('answer_w')}</b></strong><span>{QA.Answer.CreationDate}</span></div>
                                                    <div className="text">{QA.Answer.Answer}</div>
                                                </div>
                                            ) : (null)}
                                        </React.Fragment>
                                    )
                                })}
                            </div>
                        ) : (
                                <p>{translate('tabQuestions_questions')}</p>
                            )}
                    </div>
                    {isMyPublication ? (null) : (
                        <>
                        <h3>{translate('tabQuestions_makeYourRequest')}</h3>
                        <div className="form-group row">
                            <div className="col-md-12">
                                <label className="control-label" htmlFor="userName">{translate('name_w')}</label>
                                <input type="text" name="name" id="userName" className="form-control" disabled value={this.props.userData.Name || ""} />
                            </div>
                        </div>
                        <div className="form-group row required">
                            <div className="col-md-12">
                                <label className="control-label" htmlFor="textQuestion">{translate('question_w')}</label>
                                <textarea name="text" rows="5" id="textQuestion" className="form-control" value={this.state.textQuestion} onChange ={this.onChange} disabled={this.props.login_status == 'LOGGED_IN' ? false : true}></textarea>
                            </div>
                        </div>
                        {this.props.login_status == 'LOGGED_IN' ? (
                            <div className="buttons clearfix">
                                <div className="">
                                    <button type="button" id="button-review" disabled={this.state.isLoading} className="btn btn-primary" onClick ={ () => this.props.saveQuestionVP(this.state.textQuestion, this) }>{translate('confirm_w')}
                                    &nbsp;&nbsp;
                                    {this.state.isLoading &&  
                                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                    }</button>
                                </div>
                            </div>
                        ) : (<><p>{translate('tabQuestions_loginMsg1')} <Link target="_blank" to="/account/login">{translate('login_login')}</Link> {translate('tabQuestions_loginMsg2')}</p></>)}    
                        </>
                    )}
                    
                </form>
            </React.Fragment>
        );
    }
}

export default withTranslate(TabQuestions);