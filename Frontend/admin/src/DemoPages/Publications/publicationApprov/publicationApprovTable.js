import React from 'react'
import { Table } from 'reactstrap';


// This component will render the table with the values passed as parameters -props-
const PublicationApprovTable = ({pubPendApp, approvePublisher, approveAllPublications}) =>{
    const pubPendAppList = pubPendApp.length ? (
        pubPendApp.map( publ => {
            return(
            <tr key={publ.Mail}>
                <td>{publ.Name}</td>
                <td>{publ.LastName}</td>
                <td>{publ.Mail}</td>
                <td>{publ.Phone}</td>
                <td>{publ.Rut}</td>
                <td>{publ.RazonSocial}</td>
                <td>{publ.Address}</td>
                <td><a onClick={() => { approvePublisher(publ.Mail) }}><i className="lnr-checkmark-circle"></i></a></td>
            </tr>
            )
        })
    ) : (
        <tr><td colSpan="8">"No se encontraron elementos"</td></tr>
        );
    const approveAllButton = pubPendApp.length ? ( <tr><td colSpan="8"><button type="button" className="btn btn-outline-primary mr-2" onClick={() => {approveAllPublishers()}}>Aprobar todos</button></td></tr> ) : (null);
    return(
    <Table hover className="mb-0">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Correo</th>
            <th>Telefono</th>
            <th>RUT</th>
            <th>Razon Social</th>
            <th>Dirección</th>
            <th>Aprobar</th>
          </tr>
        </thead>
        <tbody>
            {pubPendAppList}
            {approveAllButton}
        </tbody>
    </Table>
    )
}

export default PublicationApprovTable