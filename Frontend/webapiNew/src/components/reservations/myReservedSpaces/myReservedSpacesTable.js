import React from 'react'
import { Table } from 'reactstrap';
// Multilanguage
import { withTranslate } from 'react-redux-multilingual'

// This component will render the table with the values passed as parameters -props-
const MyReservedSpacesTable = (props) =>{
    const { translate } = props;
    let reservations = props.reservations;
    const isPublisher = props.isPublisher || false;
    const columnsName = ['#Ref',translate('publication_w'), translate('custonerName'), translate('email_w'), translate('people_w'), translate('dateFrom_w'), translate('dateTo_w'), translate('stay_w'), translate('amount_w')+ ' ($)', translate('payment_w')+' '+translate('reservation_w'),translate('payment_w')+' '+translate('comission_w'), translate('status_w')+' '+translate('reservation_w'), translate('action_w')];
    const columnsTable = columnsName.map( colName => {
        var valToRet = <th className="text-center" key={colName}>{colName}</th>;
        switch(colName){
            case translate('payment_w')+' '+translate('reservation_w')  : valToRet = <th className="text-center" colSpan='2' key={colName}>{colName}</th>; break;
            case translate('payment_w')+' '+translate('comission_w') : isPublisher ? valToRet = <th className="text-center" colSpan='2' key={colName}>{colName}</th> : valToRet = null; break;
            case translate('email_w') : isPublisher ? valToRet = <th className="text-center" key={colName}>{colName}</th> : valToRet = null; break;
            case translate('people_w')  : valToRet = <th className="text-center" key={colName}><i className="fa fa-users" aria-hidden="true" title={colName}></i></th>; break;
        }
        return valToRet;
    });
    const arrDataList = reservations.length ? (
        reservations.map( obj => {
            var objReservationCustomerPayment = {
                reservationPaymentState: obj.CustomerPayment.PaymentDescription,
                reservationPaymentStateText: obj.CustomerPayment.PaymentDescription,
                paymentDocument: obj.CustomerPayment.PaymentEvidence,
                paymentComment: obj.CustomerPayment.PaymentComment,
                reservationPaymentAmmount: obj.TotalPrice,
                reservationpaymentDate: obj.CustomerPayment.PaymentDate,
                IdReservation: obj.IdReservation
            }
            if(isPublisher){
                var objCommisionPayment = {
                    paymentStatus: obj.CommissionPayment.PaymentDescription, 
                    paymentStatusText: obj.CommissionPayment.PaymentDescription,
                    paymentAmmount: obj.CommissionPayment.Commission,
                    paymentDate: obj.CommissionPayment.PaymentDate,
                    paymentDocument: obj.CommissionPayment.PaymentEvidence,
                    paymentComment: obj.CommissionPayment.PaymentComment,
                    IdReservation :obj.IdReservation
                };
            }

            return(
            <tr key={obj.IdReservation}>
                <td>{obj.IdReservation}</td>
                <td>{obj.TitlePublication}</td> 
                <td>{obj.CustomerName}</td>
                {isPublisher ? <td>{obj.MailCustomer}</td> : null}
                <td>{obj.People}</td>
                <td>{obj.DateFromString}</td>
                <td>99/99/9999</td>
                <td>{obj.PlanSelected == 'Hour' ? (translate('from_w')+" "+obj.HourFrom+" "+translate('to_w')+" "+obj.HourTo+" hs") : (obj.ReservedQuantity == 1 ? (obj.ReservedQuantity+' '+ translate('planSelected_'+obj.PlanSelected)) : (obj.ReservedQuantity+' '+ translate('planSelected_'+obj.PlanSelected+'s')))}</td>
                <td>{obj.TotalPrice}</td>
                <td>{translate('pubState_'+objReservationCustomerPayment.reservationPaymentStateText.replace(/\s/g,''))}</td>
                <td>
                    {obj.StateDescription === 'PENDING' ? (<p>{translate('myReservedSpacesList_reservedSpacesTable_pendingRes')}</p>) : (
                        <a href="#" className = "col-md-12" onClick={() => props.triggerModal("PAYRESCUST", obj.IdReservation, objReservationCustomerPayment)}> <span><i className="col-md-1 fa fa-align-justify"></i></span> {translate('details_w')}</a>
                    )}
                </td> 
                {isPublisher ? <td>{translate('pubState_'+objCommisionPayment.paymentStatusText.replace(/\s/g,''))}</td> : null}
                {isPublisher ? <td><a href="#" className = "col-md-12" onClick={() => props.triggerModal("PAYRESCOM", obj.IdReservation, objCommisionPayment)}> <span><i className="col-md-1 fa fa-align-justify"></i></span> {translate('details_w')}</a></td> : null}
                <td>{translate('resState_'+obj.StateDescription.replace(/\s/g,''))}</td>
                <td>
                    <div>
                        {obj.StateDescription === 'PENDING' || obj.StateDescription === 'RESERVED' ? (
                            <div>
                                <a href="#" onClick={() => {props.triggerModal("CANCEL", obj.IdReservation, obj.StateDescription)}}><span><i className="col-md-1 fa fa-times"></i></span>{translate('cancel_w')}</a> 
                                {isPublisher && obj.StateDescription === 'PENDING' ? (
                                    <a href="#" onClick={() => {props.triggerModal("CONFIRM", obj.IdReservation, obj.StateDescription)}}><span><i className="col-md-1 fa fa-check"></i></span> {translate('confirm_w')}</a>                            
                                    ) : (null)}
                            </div>
                            ) :(null)
                        }
                        {obj.StateDescription === 'FINISHED' && !isPublisher && !obj.Reviewed ? (
                            <div>
                                <a href="#" onClick={() => {props.triggerModal("RATE", obj.IdReservation, obj.StateDescription)}}><span><i className="col-md-1 fa fa-star"></i></span> {translate('rate_w')}</a> 
                            </div>
                            ) :(
                                <div>
                                {!isPublisher && obj.StateDescription == 'PENDING'  ? (
                                        <a href="#" onClick={() => {props.editReservation(obj.IdReservation)}}><span><i className="col-md-1 fa fa-pencil-alt"></i></span> {translate('edit_w')}</a>                            
                                    ) : (null)}
                                </div>
                            )
                        }
                    </div>
                </td>
            </tr>
            )
        })
    ) : (
        <tr><td colSpan={columnsName.length}>{translate('elementsNotFound_w')}</td></tr>
        );
    return(
    <Table hover striped bordered size="lg" responsive className = "center">
        <thead>
          <tr>
            {columnsTable}
          </tr>
        </thead>
        <tbody>
            {arrDataList}
        </tbody>
    </Table>
    )
}

export default withTranslate(MyReservedSpacesTable)