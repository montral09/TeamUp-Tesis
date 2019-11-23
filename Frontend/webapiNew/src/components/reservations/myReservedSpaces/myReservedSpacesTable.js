import React from 'react'
import { Table } from 'reactstrap';


// This component will render the table with the values passed as parameters -props-
const MyReservedSpacesTable = (props) =>{
    let reservations = props.reservations;
    const columnsName = ['ID','Publicacion', 'Mail cliente','Plan', 'Personas', 'Fecha', 'Hora desde', 'Hora hasta', 'Monto', 'Estado', 'Acción'];
    const columnsTable = columnsName.map( colName => {
        return (<th key={colName}>{colName}</th>)
    });

    const arrDataList = reservations.length ? (
        reservations.map( obj => {            
            return(
            <tr key={obj.IdReservation}>
                <td>{obj.IdReservation}</td>
                <td>{obj.TitlePublication}</td>
                <td>{obj.MailCustomer}</td>
                <td>{obj.PlanSelected}</td>
                <td>{obj.People}</td>
                <td>{obj.DateFrom}</td>
                <td>{obj.HourFrom}</td>
                <td>{obj.HourTo}</td>             
                <td>{obj.TotalPrice}</td>
                <td>{obj.StateDescription}</td>
                <td>
                    <div>
                    {obj.StateDescription != 'FINISHED' && obj.StateDescription != 'CANCELED' ? (
                        <div>
                            <a className = "col-md-12" onClick={() => {props.editReservation(obj.IdReservation)}}> <span><i className="col-md-1 fa fa-pencil-alt"></i></span>EDITAR</a>                            
                        </div>
                    ) : (
                        <div>
                            {obj.State === 'PAUSED P' ? (
                            <div>
                                <a className = "col-md-12" href="" onClick={() => alert("Agregar reanudar publicacion")}><span><i className="col-md-1 fa fa-play"></i></span>REANUDAR</a>                        
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

export default MyReservedSpacesTable