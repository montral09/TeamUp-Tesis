import React from 'react'
import { Table, Progress } from 'reactstrap';


// This component will render the table with the values passed as parameters -props-
const CommissionPaymentsTable = ({paymentsPendingConfirmation, approveCommissionPayment, rejectCommissionPayment, isLoading, onlyView}) =>{
    const columnsName = ['ID Res','Publicacion','Mail','Nombre','Telefono', 'Monto','Comentario','Evidencia', 'Fecha Pago', 'Aprobar','Rechazar'];

    const columnsTable = columnsName.map( colName => {
        var colToReturn = <th key={colName}>{colName}</th>
        switch(colName){
            case "Aprobar":
            case "Rechazar":
                if(onlyView){colToReturn =""}
                break;
        }
        return (colToReturn)
    });
    const arrDataAppList = paymentsPendingConfirmation.length ? (
        paymentsPendingConfirmation.map( obj => {
            return(
            <tr key={obj.IdReservation}>
                <td>{obj.IdReservation}</td>
                <td>{obj.Publication}</td>
                <td>{obj.PublisherMail}</td>
                <td>{obj.PublisherName}{"  "}{obj.PublisherLastName}</td>
                <td>{obj.PublisherPhone}</td>
                <td>{obj.Commission}</td>
                <td title= {obj.Comment}>{obj.Comment.length < 25 ? (obj.Comment) : (obj.Comment.substring(0,25)+"...")}</td>                
                <td><a href={obj.Evidence} target="_blank">Ver</a></td>
                <td>{obj.PaymentDate}</td>
                {!onlyView ? (<td><a onClick={() => { approveCommissionPayment(obj.IdReservation) }}><i className="lnr lnr-thumbs-up"></i></a></td>) : (null) } 
                {!onlyView ? (<td><a onClick={() => { rejectCommissionPayment(obj.IdReservation) }}><i className="lnr lnr-thumbs-down"></i></a></td>) : (null) } 
            </tr>
            )
        })
    ) : (
        isLoading ? (<tr><td colSpan={columnsName.length}><Progress className="mb-3" animated value={100} /></td></tr>) : (<tr><td colSpan={columnsName.length}>No se encontraron elementos</td></tr>)
        );
    return(
    <Table hover className="mb-0" responsive = {true}>
        <thead>
          <tr>
            {columnsTable}
          </tr>
        </thead>
        <tbody>
            {arrDataAppList}
        </tbody>
    </Table>
    )
}

export default CommissionPaymentsTable