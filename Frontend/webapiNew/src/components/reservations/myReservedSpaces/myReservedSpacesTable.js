import React from 'react'
import { Table } from 'reactstrap';


// This component will render the table with the values passed as parameters -props-
const MyReservedSpacesTable = (props) =>{
    
    let reservations = props.reservations;
    const isPublisher = props.isPublisher || false;
    const columnsName = ['ID','Publicacion', 'Mail cliente', 'Personas', 'Fecha', 'Estadía', 'Monto', 'Pago reserva','Pago comisión', 'Estado reserva', 'Acción'];
    const columnsTable = columnsName.map( colName => {
        var valToRet = <th className="text-center" key={colName}>{colName}</th>;
        switch(colName){
            case "Pago reserva": valToRet = <th className="text-center" colSpan='2' key={colName}>{colName}</th>; break;
            case "Pago comisión": isPublisher ? valToRet = <th className="text-center" colSpan='2' key={colName}>{colName}</th> : valToRet = null; break;
        }
        return valToRet;
    });
    const arrDataList = reservations.length ? (
        reservations.map( obj => {
            console.log("MyReservedSpacesTable - obj:")
            console.log(obj)

            var objReservationCustomerPayment = {
                reservationPaymentState: obj.CustomerPaymentDescription,
                reservationPaymentStateText: obj.CustomerPaymentDescription,
                paymentDocument: 'http://www.google.com.uy',
                paymentComment: 'DUMMY HARDCODED COMMENT',
                reservationPaymentAmmount: obj.TotalPrice,
                reservationpaymentDate: 'DUMMY HARDCODED VALUE',
                IdReservation: obj.IdReservation
            }
            //DUMMY TO REMOVE
            var objCommisionPayment = {paymentStatus: 'PENDING PAYMENT', paymentStatusText:'Pendiente de pago', paymentAmmount:'$25',paymentDate:'Pending'};
            if(obj.IdReservation == 1){
                objCommisionPayment = {paymentStatus: 'PENDING CONFIRMATION', paymentStatusText:'Pendiente de confirmar', paymentAmmount:'$25',paymentDate:'07/12/2019',paymentComment:"Adjunto el documento",paymentDocument:"http://gcallapp.co/wp-content/uploads/2019/09/paid-invoice-template-invoice-payment-receipt-template.jpg"};
            }else if(obj.IdReservation == 2){
                objCommisionPayment = {paymentStatus: 'PAID', paymentStatusText:'Pago', paymentAmmount:'$25',paymentDate:'07/12/2019',paymentComment:"Adjunto el documento",paymentDocument:"http://gcallapp.co/wp-content/uploads/2019/09/paid-invoice-template-invoice-payment-receipt-template.jpg"};
            }
            //
            return(
            <tr key={obj.IdReservation}>
                <td>{obj.IdReservation}</td>
                <td>{obj.TitlePublication}</td>
                <td>{obj.MailCustomer}</td>
                <td>{obj.People}</td>
                <td>{obj.DateFromString}</td>
                <td>{obj.PlanSelected == 'Hour' ? ("Desde "+obj.HourFrom+" a "+obj.HourTo) : ("1 "+ obj.PlanSelected)}</td>
                <td>{obj.TotalPrice}</td>
                <td>{objReservationCustomerPayment.reservationPaymentStateText}</td>
                <td><a href="#" className = "col-md-12" onClick={() => props.triggerModal("PAYRESCUST", obj.IdReservation, objReservationCustomerPayment)}> <span><i className="col-md-1 fa fa-align-justify"></i></span> Detalles</a></td> 
                {isPublisher ? <td>{objCommisionPayment.paymentStatusText}</td> : null}
                {isPublisher ? <td><a href="#" className = "col-md-12" onClick={() => props.triggerModal("PAYRESCOM", obj.IdReservation, objCommisionPayment)}> <span><i className="col-md-1 fa fa-align-justify"></i></span> Detalles</a></td> : null}
                <td>{obj.StateDescription}</td>
                <td>
                    <div>
                        {obj.StateDescription === 'PENDING' || obj.StateDescription === 'RESERVED' ? (
                            <div>
                                <a href="" onClick={() => {props.triggerModal("CANCEL", obj.IdReservation, obj.StateDescription)}}><span><i className="col-md-1 fa fa-times"></i></span>Cancelar</a> 
                                {isPublisher && obj.StateDescription === 'PENDING' ? (
                                    <a href="" onClick={() => {props.triggerModal("CONFIRM", obj.IdReservation, obj.StateDescription)}}><span><i className="col-md-1 fa fa-check"></i></span> Confirmar</a>                            
                                    ) : (null)}
                            </div>
                            ) :(null)
                        }
                        {obj.StateDescription === 'FINISHED' && !isPublisher && !obj.Reviewed ? (
                            <div>
                                <a href="" onClick={() => {props.triggerModal("RATE", obj.IdReservation, obj.StateDescription)}}><span><i className="col-md-1 fa fa-star"></i></span> Calificar</a> 
                            </div>
                            ) :(
                                <div>
                                {!isPublisher && obj.StateDescription != 'FINISHED' && obj.StateDescription != 'CANCELED'  && obj.StateDescription != 'RESERVED' ? (
                                        <a href="" onClick={() => {props.editReservation(obj.IdReservation)}}><span><i className="col-md-1 fa fa-pencil-alt"></i></span> Editar</a>                            
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