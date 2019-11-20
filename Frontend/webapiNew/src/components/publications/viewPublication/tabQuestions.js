import React from "react";


class TabQuestions extends React.Component {
    render() {
        //const {questions} = this.props;
        const arrQA = [
            {
                Question: {
                    UserName: "Alex",
                    Date: "27/08/2019",
                    Text: "Hola, esta disponible?"
                },
                Answer: {
                    UserName: "Fabi",
                    Date: "28/08/2019",
                    Text: "Si. Saludos"
                }
            },{
                Question: {
                    UserName: "Bruno",
                    Date: "29/08/2019",
                    Text: "Hola, esta disponible!!! >-<?"
                }
            }];
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
					<div className="form-group row required">
						<div className="col-md-12">
							<label className="control-label" htmlFor="input-name">Nombre</label>
							<input type="text" name="name" id="input-name" className="form-control" />
						</div>
					</div>
					<div className="form-group row required">
						<div className="col-md-12">
							<label className="control-label" htmlFor="input-review">Consulta</label>
							<textarea name="text" rows="5" id="input-review" className="form-control"></textarea>
						</div>
					</div>
					<div className="buttons clearfix">
						<div className="">
							<button type="button" id="button-review" data-loading-text="Loading..." className="btn btn-primary" onClick ={ () => alert("Se ha enviado su consulta") }>Continuar</button>
						</div>
					</div>
                </form>
            </React.Fragment>
        );
    }
}

export default TabQuestions;