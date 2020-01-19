import React from 'react'
import { Table, Progress } from 'reactstrap';


// This component will render the table with the values passed as parameters -props-
const AllReservationsTable = ({elements, isLoading}) =>{
    const columnsName = ['#Pub','#Res','Correo cliente','Correo gestor','Tipo reserva','Desde ','Hasta','Cant personas', 'Precio total', 'Estado'];

    const columnsTable = columnsName.map( colName => {
        return (<th key={colName}>{colName}</th>)
    });

    const arrDataAppList = elements.length ? (
        elements.map( obj => {
            return(
            <tr key={obj.IdPublication+"_resKeyTable"}>
                <td>{obj.IdPublication}</td>
                <td>{obj.IdReservation}</td>
                <td>{obj.MailCustomer}</td>
                <td>{obj.MailPublisher}</td>
                <td>{obj.ReservedQuantity}{"  "}{obj.PlanSelected}</td>
                <td>{obj.DateFromString}</td>
                <td>{obj.DateToString}</td>
                <td>{obj.People}</td>
                <td>{obj.TotalPrice}</td>
                <td>{obj.StateDescription}</td>
            </tr>
            )
        })
    ) : (
        isLoading ? (<tr><td colSpan={columnsName.length}><Progress className="mb-3" animated value={100} /></td></tr>) : (<tr><td colSpan={columnsName.length}>PENDIENTE DE REALIZAR</td></tr>)
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

export default AllReservationsTable