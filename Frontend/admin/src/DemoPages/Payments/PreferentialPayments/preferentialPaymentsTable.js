import React from 'react'
import { Table, Tooltip } from 'reactstrap';


// This component will render the table with the values passed as parameters -props-
const PreferentialPaymentsTable = ({payments, approvePreferentialPayment, rejectPreferentialPayment}) =>{
    const columnsName = ['ID Pub','Publicacion','Mail','Nombre','Telefono', 'Plan', 'Monto','Comentario','Evidencia','Fecha Pago','Aprobar','Rechazar'];

    const columnsTable = columnsName.map( colName => {
        return (<th key={colName}>{colName}</th>)
    });
    const arrDataAppList = payments.length ? (
        payments.map( obj => {
            return(
            <tr key={obj.IdPublication}>
                <td>{obj.IdPublication}</td>
                <td>{obj.Publication}</td>
                <td>{obj.PublisherMail}</td>
                <td>{obj.PublisherName}{"  "}{obj.PublisherLastName}</td>
                <td>{obj.PublisherPhone}</td>
                <td>{obj.PreferentialPlanName}</td>
                <td>{obj.Price}</td>
                <td title= {obj.Comment}>{obj.Comment.length < 25 ? (obj.Comment) : (obj.Comment.substring(0,25)+"...")}</td>                
                <td><a href={obj.Evidence} target="_blank">Ver</a></td>
                <td>{obj.PaymentDate}</td>
                <td><a onClick={() => { approvePreferentialPayment(obj.IdPublication) }}><i className="lnr lnr-thumbs-up"></i></a></td>
                <td><a onClick={() => { rejectPreferentialPayment(obj.IdPublication) }}><i className="lnr lnr-thumbs-down"></i></a></td>
            </tr>
            )
        })
    ) : (
        <tr><td colSpan={columnsName.length}>"No se encontraron elementos"</td></tr>
        );
    return(
    <Table hover className="mb-0">
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

export default PreferentialPaymentsTable