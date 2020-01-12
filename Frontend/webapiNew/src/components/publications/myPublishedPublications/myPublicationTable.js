import React from 'react'
import { Table } from 'reactstrap';
import { MAIN_URL_WEB} from '../../../services/common/constants'
// Multilanguage
import { withTranslate } from 'react-redux-multilingual'

// This component will render the table with the values passed as parameters -props-
const MyPublicationTable = (props) =>{
    const {translate} = props;
    let publications = props.publications;
    let spaceTypes = props.spaceTypes;
    const columnsName = ['#Ref',translate('spaceType_w'),translate('dateCreated_w'),translate('title_w'),translate('status_w'),translate('payment_w')+' premium',translate('questionsWithoutAnswers_w'),translate('totalViews_w'),translate('action_w')];
    const columnsTable = columnsName.map( colName => {
        var valToRet = <th className="text-center" key={colName}>{colName}</th>;
        switch(colName){
            case translate('action_w'): valToRet = <th className="text-center" colSpan='3' key={colName}>{colName}</th>; break;
            case translate('payment_w')+' premium': valToRet = <th className="text-center" colSpan='2' key={colName}>{colName}</th>; break;
        }
        return valToRet;
    });
    publications.forEach(element => {
        const spaceType = spaceTypes.filter(space => {
            return space.Code === element.SpaceType
        });

        element.SpaceTypeDesc = spaceType[0].Description;    
    });
    const arrDataList = publications.length ? (
        publications.map( obj => {
            let url = MAIN_URL_WEB+"publications/viewPublication/viewPublication/"+obj.IdPublication;
            var objPayment = {paymentStatus: obj.PreferentialPlan.StateDescription, paymentStatusText:obj.PreferentialPlan.StateDescription, paymentAmmount: 
                obj.PreferentialPlan.Price,plan: obj.PreferentialPlan.Description,paymentDate:obj.PreferentialPlan.PaymentDate, IdPublication: obj.IdPublication};
            return(
            <tr key={obj.IdPublication}>
                <td>{obj.IdPublication}</td>
                <td>{obj.SpaceTypeDesc}</td>
                <td>{obj.CreationDate}</td>
                <td>{obj.Title}</td>
                <td>{translate('pubState_'+obj.State.replace(/\s/g,''))}</td>
                {objPayment.plan == 'FREE' ? (
                    <td colSpan="2">Plan Free</td>
                ) : (<>
                    <td>{translate('pubState_'+objPayment.paymentStatus.replace(/\s/g,''))}</td>
                    <td><a href="#" className = "col-md-12" onClick={() => props.triggerModalDetailPayment(objPayment)}> <span><i className="col-md-1 fa fa-align-justify"></i></span> {translate('details_w')}</a></td> 
                    </>
                )}
                <td>{obj.QuestionsWithoutAnswer}</td>
                <td>{obj.TotalViews}</td>
                <td>
                    <a href={url}><span><i className="col-md-3 fa fa-eye"></i></span> {translate('view_w')}</a>
                </td>
                {obj.State === 'ACTIVE' ? (
                    <>
                    <td><a href="#" className = "col-md-12" onClick={() => props.editPublication(obj.IdPublication,obj.IdPlan , obj.PreferentialPlan.IdPlan, obj.PreferentialPlan.Price)}> <span><i className="col-md-1 fa fa-pencil-alt"></i></span> {translate('edit_w')}</a></td> 
                    <td><a href="#" onClick={() => props.changePubState(obj.State, obj.IdPublication)}><span><i className="col-md-1 fa fa-pause"></i></span> {translate('pause_w')}</a></td>
                    </>
                ) : (
                    <>
                        {obj.State === 'PAUSED P' ? (
                            <>
                            <td><a href="#" className = "col-md-12" onClick={() => props.changePubState(obj.State, obj.IdPublication)}><span><i className="col-md-1 fa fa-play"></i></span> {translate('resume_w')}</a></td>
                            <td></td>
                            </>  
                        ) :(<><td></td><td></td></>) }
                    </>)}
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

export default withTranslate(MyPublicationTable)