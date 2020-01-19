import React from 'react'
import { Table, Progress } from 'reactstrap';


// This component will render the table with the values passed as parameters -props-
const UpdateCommissionTable = ({paymentsPendingPaid, changeCommission, isLoading}) =>{
    const columnsName = ['ID Res','Publicacion','Mail','Nombre','Telefono', 'Monto', 'Editar'];

    const columnsTable = columnsName.map( colName => {
        return (<th key={colName}>{colName}</th>)
    });
    const arrDataAppList = paymentsPendingPaid.length ? (
        paymentsPendingPaid.map( obj => {
            return(
            <tr key={obj.IdReservation}>
                <td>{obj.IdReservation}</td>
                <td>{obj.Publication}</td>
                <td>{obj.PublisherMail}</td>
                <td>{obj.PublisherName}{"  "}{obj.PublisherLastName}</td>
                <td>{obj.PublisherPhone}</td>
                <td>{obj.Commission}</td>                
                <td><a onClick={() => { changeCommission(obj.IdReservation) }}><i className="lnr lnr-pencil"></i></a></td>                
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

export default UpdateCommissionTable