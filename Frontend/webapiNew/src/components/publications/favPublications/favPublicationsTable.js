import React from 'react'
import { Table } from 'reactstrap';


// This component will render the table with the values passed as parameters -props-
const FavPublicationsTable = (props) =>{
    let publications = props.publications;
    let spaceTypes = props.spaceTypes;
    const columnsName = ['#Ref','Tipo de Espacio', 'Nombre','Ciudad','Dirección','Capacidad',"Precios",'Puntuación','Acción'];
    const columnsTable = columnsName.map( colName => {
        return <th className="text-center" key={colName}>{colName}</th>;
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
                <td>{obj.Title}</td>
                <td>{obj.City}</td>
                <td>{obj.Address}</td>
                <td>{obj.Capacity}</td>
                <td>{obj.HourPrice == 0 ? ("Por Hora: N/A") : ("Por Hora: $"+obj.HourPrice)}<br/>
                    {obj.DailyPrice == 0 ? ("Por Día: N/A") : ("Por Día: $"+obj.DailyPrice)}<br/>
                    {obj.WeeklyPrice == 0 ? ("Por Semana: N/A") : ("Por Semana: $"+obj.WeeklyPrice)}<br/>
                    {obj.MonthlyPrice == 0 ? ("Por Mes: N/A") : ("Por Mes: $"+obj.MonthlyPrice)}<br/>
                </td>
                <td>{obj.Ranking == 0 ? "N/A" : obj.Ranking}</td>
                <td><a href={url}><span><i className="col-md-3 fa fa-eye"></i></span> Ver</a></td>
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

export default FavPublicationsTable