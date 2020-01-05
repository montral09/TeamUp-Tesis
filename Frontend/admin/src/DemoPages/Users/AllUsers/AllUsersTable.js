import React from 'react'
import { Table } from 'reactstrap';


// This component will render the table with the values passed as parameters -props-
const AllUsersTable = ({arrData, editUser}) =>{
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
        <tr><td colSpan="9">"No se encontraron elementos"</td></tr>
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

export default AllUsersTable