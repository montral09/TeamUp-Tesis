import React from "react";
import { Link } from 'react-router-dom';


class TabQuestions extends React.Component {
    render() {
        const {arrQA} = this.props;

        return (
            <React.Fragment>
                <form className="form-horizontal" id="form-review">
                    <div id="review">
                        {arrQA && arrQA.length > 0 ? (
                            <div className="review-list">
                                {arrQA.map((QA, index) => {
                                    return (
                                        <>
                                            <div className="review" key={index+QA.Question.UserName}>
                                                <div className="author"><b>{QA.Question.UserName}</b> <span>{QA.Question.Date}</span></div>
                                                <div className="text">{QA.Question.Text}</div>
                                            </div>
                                            {QA.Answer ? (
                                                <div className="review" key={index+QA.Answer.UserName} style={{ marginLeft: '5%' }}>
                                                    <div className="author"><strong><b>{QA.Answer.UserName}</b></strong> (Gestor) <span>{QA.Answer.Date}</span></div>
                                                    <div className="text">{QA.Answer.Text}</div>
                                                </div>
                                            ) : (null)}
                                        </>
                                    )
                                })}
                            </div>
                        ) : (
                                <p>Sin preguntas</p>
                            )}
                    </div>
                    <h3>Haga su consulta</h3>
					<div className="form-group row">
						<div className="col-md-12">
							<label className="control-label" htmlFor="userName">Nombre</label>
							<input type="text" name="name" id="userName" className="form-control" disabled value={this.props.userData.Name || ""} />
						</div>
					</div>
					<div className="form-group row required">
						<div className="col-md-12">
							<label className="control-label" htmlFor="textQuestion">Consulta</label>
							<textarea name="text" rows="5" id="textQuestion" className="form-control" disabled={this.props.login_status == 'LOGGED_IN' ? false : true}></textarea>
						</div>
					</div>
                    {this.props.login_status == 'LOGGED_IN' ? (
                        <div className="buttons clearfix">
                            <div className="">
                                <button type="button" id="button-review" data-loading-text="Loading..." className="btn btn-primary" onClick ={ () => alert("Se ha enviado su consulta") }>Continuar</button>
                            </div>
                        </div>
                    ) : (<><p>Debe de estar logueado para poder realizar consultas, por favor <Link target="_blank" to="/account/login">inicie sesión</Link> o sino tiene cuenta regístrese</p></>)}

                </form>
            </React.Fragment>
        );
    }
}

export default TabQuestions;