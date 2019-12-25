import React from 'react'
import { Table } from 'reactstrap';


// This component will render the table with the values passed as parameters -props-
const MyReservedSpacesTable = (props) =>{
    
    let reservations = props.reservations;
    const isPublisher = props.isPublisher || false;
    const columnsName = ['#Ref','Publicacion', 'Mail cliente', 'Personas', 'Fecha', 'Estadía', 'Monto', 'Pago reserva','Pago comisión', 'Estado reserva', 'Acción'];
    const columnsTable = columnsName.map( colName => {
        var valToRet = <th className="text-center" key={colName}>{colName}</th>;
        switch(colName){
            case "Pago reserva"  : valToRet = <th className="text-center" colSpan='2' key={colName}>{colName}</th>; break;
            case "Pago comisión" : isPublisher ? valToRet = <th className="text-center" colSpan='2' key={colName}>{colName}</th> : valToRet = null; break;
            case "Mail cliente"  : isPublisher ? valToRet = <th className="text-center" key={colName}>{colName}</th> : valToRet = null; break;
            case "Personas"  : valToRet = <th className="text-center" key={colName}><i className="fa fa-users" aria-hidden="true" title={colName}></i></th>; break;
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
                    IdReservation :obj.IdReservation
                };
            }

            return(
            <tr key={obj.IdReservation}>
                <td>{obj.IdReservation}</td>
                <td>{obj.TitlePublication}</td>
                {isPublisher ? <td>{obj.MailCustomer}</td> : null}
                <td>{obj.People}</td>
                <td>{obj.DateFromString}</td>
                <td>{obj.PlanSelected == 'Hour' ? ("Desde "+obj.HourFrom+" a "+obj.HourTo+" hs") : ("1 "+ obj.PlanSelected)}</td>
                <td>{obj.TotalPrice}</td>
                <td>{objReservationCustomerPayment.reservationPaymentStateText}</td>
                <td>
                    {obj.StateDescription === 'PENDING' ? (<p>Reserva pendiente de confirmar</p>) : (
                        <a href="#" className = "col-md-12" onClick={() => props.triggerModal("PAYRESCUST", obj.IdReservation, objReservationCustomerPayment)}> <span><i className="col-md-1 fa fa-align-justify"></i></span> Detalles</a>
                    )}
                </td> 
                {isPublisher ? <td>{objCommisionPayment.paymentStatusText}</td> : null}
                {isPublisher ? <td><a href="#" className = "col-md-12" onClick={() => props.triggerModal("PAYRESCOM", obj.IdReservation, objCommisionPayment)}> <span><i className="col-md-1 fa fa-align-justify"></i></span> Detalles</a></td> : null}
                <td>{obj.StateDescription}</td>
                <td>
                    <div>
                        {obj.StateDescription === 'PENDING' || obj.StateDescription === 'RESERVED' ? (
                            <div>
                                <a href="#" onClick={() => {props.triggerModal("CANCEL", obj.IdReservation, obj.StateDescription)}}><span><i className="col-md-1 fa fa-times"></i></span>Cancelar</a> 
                                {isPublisher && obj.StateDescription === 'PENDING' ? (
                                    <a href="#" onClick={() => {props.triggerModal("CONFIRM", obj.IdReservation, obj.StateDescription)}}><span><i className="col-md-1 fa fa-check"></i></span> Confirmar</a>                            
                                    ) : (null)}
                            </div>
                            ) :(null)
                        }
                        {obj.StateDescription === 'FINISHED' && !isPublisher && !obj.Reviewed ? (
                            <div>
                                <a href="#" onClick={() => {props.triggerModal("RATE", obj.IdReservation, obj.StateDescription)}}><span><i className="col-md-1 fa fa-star"></i></span> Calificar</a> 
                            </div>
                            ) :(
                                <div>
                                {!isPublisher && obj.StateDescription == 'PENDING'  ? (
                                        <a href="#" onClick={() => {props.editReservation(obj.IdReservation)}}><span><i className="col-md-1 fa fa-pencil-alt"></i></span> Editar</a>                            
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
        <tr><td colSpan={columnsName.length}>"No se encontraron resultados"</td></tr>
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

export default MyReservedSpacesTable