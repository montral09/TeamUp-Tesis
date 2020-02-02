import React from 'react'
import { Table, Progress } from 'reactstrap';


// This component will render the table with the values passed as parameters -props-
const PublisherApprovTable = ({pubPendApp, approvePublisher, approveAllPublishers, isLoading}) =>{
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
                <td><a href="javascript:void(0);" onClick={() => { approvePublisher(publ.Mail) }}><i className="lnr-checkmark-circle"></i></a></td>
            </tr>
            )
        })
    ) : (
        isLoading ? (<tr><td colSpan={8}><Progress className="mb-3" animated value={100} /></td></tr>) : (<tr><td colSpan={8}>No se encontraron elementos</td></tr>)
        );
    const approveAllButton = pubPendApp.length ? ( <tr><td colSpan="8"><button type="button" className="btn btn-outline-primary mr-2" onClick={() => {approveAllPublishers()}}>Aprobar todos</button></td></tr> ) : (null);
    return(
    <Table hover className="mb-0" responsive = {true}>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Correo</th>
            <th>Telefono</th>
            <th>RUT</th>
            <th>Razón Social</th>
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

export default PublisherApprovTable