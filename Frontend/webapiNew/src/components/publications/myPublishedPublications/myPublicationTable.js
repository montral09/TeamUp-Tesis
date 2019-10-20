import React from 'react'
import { Table } from 'reactstrap';


// This component will render the table with the values passed as parameters -props-
const MyPublicationTable = (props) =>{
    let publications = props.publications;
    let spaceTypes = props.spaceTypes;
    const columnsName = ['ID Pub','Tipo de Espacio','Fecha Creado','Title','Estado','Ver Publicacion','Acción',];
    const columnsTable = columnsName.map( colName => {
        return (<th key={colName}>{colName}</th>)
    });
    publications.forEach(element => {
        const spaceType = spaceTypes.filter(space => {
            return space.Code === element.SpaceType
        });

        element.SpaceTypeDesc = spaceType[0].Description;    
    });
    const arrDataList = publications.length ? (
        publications.map( obj => {
            let url = "http://localhost:3000/publications/viewPublication/viewPublication/"+obj.IdPublication;
            return(
            <tr key={obj.IdPublication}>
                <td>{obj.IdPublication}</td>
                <td>{obj.SpaceTypeDesc}</td>
                <td>{obj.CreationDate}</td>
                <td>{obj.Title}</td>
                <td>{obj.State}</td>
                <td><a href={url}>Ver</a> </td>
                <td>EDITAR / PAUSAR (REANUDAR)</td>
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
            {arrDataList}
        </tbody>
    </Table>
    )
}

export default MyPublicationTable