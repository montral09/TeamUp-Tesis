import React from 'react'
import { Table, Progress } from 'reactstrap';


// This component will render the table with the values passed as parameters -props-
const AllUsersTable = ({arrData, editUser, isLoading}) =>{
    const columnsName = ['Mail','Nombre','Apellido','Telefono','RUT','Razon Social','Direccion','Es Gestor','Mail Validado','Editar'];

    const columnsTable = columnsName.map( colName => {
        return (<th key={colName}>{colName}</th>)
    });

    const arrDataAppList = arrData.length ? (
        arrData.map( usr => {
            return(
            <tr key={usr.Mail}>
                <td>{usr.Mail}</td>
                <td>{usr.Name}</td>
                <td>{usr.LastName}</td>
                <td>{usr.Phone}</td>
                <td>{usr.Rut}</td>
                <td>{usr.RazonSocial}</td>
                <td>{usr.Address}</td>
                <td>{usr.CheckPublisher ? 'Si' : 'No'}</td>
                <td>{usr.MailValidated ? 'Si' : 'No'}</td>
                <td><a onClick={() => { editUser(usr.Mail) }}><i className="lnr lnr-pencil"></i></a></td>
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

export default AllUsersTable