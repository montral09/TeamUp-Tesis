import React from 'react'
import { Table } from 'reactstrap';
// Multilanguage
import { withTranslate } from 'react-redux-multilingual'

// This component will render the table with the values passed as parameters -props-
const MyMessagesTable = (props) =>{
    const { translate, messages } = props;
    const columnsName = ['#Ref',translate('publication_w'),translate('name_w'),translate('question_w'),translate('questionDate_w'),
                        translate('answer_w'),translate('answerDate_w'),'action'];
    const columnsTable = columnsName.map( colName => {
        var valToRet = <th className="text-center" key={colName}>{colName}</th>;
        switch(colName){
            case "action": valToRet = <th className="text-center" key={colName}><i className="fa fa-asterisk" aria-hidden="true"></i></th>; break;
        }
        return valToRet;
    });
    const arrDataList = messages.length ? (
        messages.map( obj => {
            return(
            <tr key={obj.IdQuestion}>
                <td>{obj.IdPublication}</td>
                <td>{obj.PublicationTitle}</td>
                <td>{obj.Name}</td>
                <td>{obj.Question}</td>
                <td>{obj.CreationDate}</td>
                {obj.Answer != null && obj.IsMyPublication == true ? (
                    <td>{obj.Answer.Answer}</td>) : (<td></td>)}
                {obj.Answer != null && obj.IsMyPublication == true ? (
                    <td>{obj.Answer.CreationDate}</td>) : (<td></td>)}
                {obj.Answer == null && obj.IsMyPublication == true ? (
                    <td><a href="#" className = "col-md-12" onClick={() => props.answerMsg(obj)}> <span><i className="col-md-1 fa fa-align-justify"></i></span> {translate('reply_w')}</a></td> 
                    ) : (<td></td>)}
            </tr>
            )
        })
    ) : (
        <tr><td colSpan={columnsName.length}>{translate('elementsNotFound_w')}</td></tr>
        );
    return(
        <div style={{
            overflowX: 'auto'
        }}>
            <Table hover striped bordered size="lg" responsive className="center">
                <thead>
                    <tr>
                        {columnsTable}
                    </tr>
                </thead>
                <tbody>
                    {arrDataList}
                </tbody>
            </Table>
        </div>
    )
}

export default withTranslate(MyMessagesTable)