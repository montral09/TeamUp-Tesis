import React from 'react'
import { Table } from 'reactstrap';


// This component will render the table with the values passed as parameters -props-
const PublicationApprovTable = ({publPendApp, approvePublication, editPublication}) =>{
    const columnsName = ['ID Pub','Mail','Nombre','Telefono','Fecha Creado','Titulo','Capacidad','Ver Mas','Aprobar','Rechazar'];

    const columnsTable = columnsName.map( colName => {
        return (<th key={colName}>{colName}</th>)
    });
    const arrDataAppList = publPendApp.length ? (
        publPendApp.map( obj => {
            return(
            <tr key={obj.IdPublication}>
                <td>{obj.IdPublication}</td>
                <td>{obj.Mail}</td>
                <td>{obj.NamePublisher}{"  "}{obj.LastNamePublisher}</td>
                <td>{obj.PhonePublisher}</td>
                <td>{obj.CreationDate}</td>
                <td>{obj.Title}</td>
                <td>{obj.Capacity}</td>
                <td><a onClick={() => { editPublication(obj.IdPublication) }}><i className="lnr lnr-magnifier"></i></a></td>
                <td><a onClick={() => { approvePublication(obj.IdPublication) }}><i className="lnr lnr-thumbs-up"></i></a></td>
                <td><a onClick={() => { approvePublication(obj.IdPublication) }}><i className="lnr lnr-thumbs-down"></i></a></td>
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

export default PublicationApprovTable