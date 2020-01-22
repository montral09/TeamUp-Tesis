import React from 'react'
import { Table, Progress } from 'reactstrap';


// This component will render the table with the values passed as parameters -props-
const AllPublicationsTable = ({publ, editPublication, isLoading}) =>{

    const columnsName = ['ID Pub','Mail','Nombre','Telefono','Fecha Creado','Titulo','Capacidad','Editar'];

    const columnsTable = columnsName.map( colName => {
        return (<th key={colName}>{colName}</th>)
    });

    const arrDataAppList = publ != null && publ.length ? (
        publ.map( obj => {
            return(
            <tr key={obj.IdPublication}>
                <td>{obj.IdPublication}</td>
                <td>{obj.Mail}</td>
                <td>{obj.NamePublisher}{"  "}{obj.LastNamePublisher}</td>
                <td>{obj.PhonePublisher}</td>
                <td>{obj.CreationDate}</td>
                <td>{obj.Title}</td>
                <td>{obj.Capacity}</td>
                <td><a href='javascript:void(0);' onClick={() => { editPublication(obj.IdPublication) }}><i className="lnr lnr-pencil"></i></a></td>                
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

export default AllPublicationsTable