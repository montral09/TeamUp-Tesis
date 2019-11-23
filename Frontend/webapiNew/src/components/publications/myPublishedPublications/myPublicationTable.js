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
                <td><a href={url}><span><i className="col-md-3 fa fa-eye"></i></span>Ver</a> </td>
                <td>
                    <div>
                    {obj.State === 'ACTIVE' ? (
                        <div>
                            <a className = "col-md-12" onClick={() => props.editPublication(obj.IdPublication)}> <span><i className="col-md-1 fa fa-pencil-alt"></i></span>EDITAR</a>
                            <a href="" onClick={() => props.changePubState(obj.State, obj.IdPublication)}><span><i className="col-md-1 fa fa-pause"></i></span>PAUSAR</a>
                        </div>
                    ) : (
                        <div>
                            {obj.State === 'PAUSED P' ? (
                            <div>
                                <a className = "col-md-12" href="" onClick={() => props.changePubState(obj.State, obj.IdPublication)}><span><i className="col-md-1 fa fa-play"></i></span>REANUDAR</a>                        
                            </div>
                            ) :(null) }
                        </div>)}
                    </div>
                </td>
            </tr>
            )
        })
    ) : (
        <tr><td colSpan={columnsName.length}>"No se encontraron elementos"</td></tr>
        );
    return(
    <Table hover striped bordered size="lg" responsive className = "center">
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