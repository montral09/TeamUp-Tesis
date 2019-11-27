import React from 'react'
import { Table } from 'reactstrap';


// This component will render the table with the values passed as parameters -props-
const MyReservedSpacesTable = (props) =>{
    let reservations = props.reservations;
    const columnsName = ['ID','Publicacion', 'Mail cliente','Plan', 'Personas', 'Fecha', 'Hora desde', 'Hora hasta', 'Monto', 'Estado', 'Acción'];
    const columnsTable = columnsName.map( colName => {
        return (<th key={colName}>{colName}</th>)
    });
    const isPublisher = props.isPublisher || false;
    const arrDataList = reservations.length ? (
        reservations.map( obj => {            
            return(
            <tr key={obj.IdReservation}>
                <td>{obj.IdReservation}</td>
                <td>{obj.TitlePublication}</td>
                <td>{obj.MailCustomer}</td>
                <td>{obj.PlanSelected}</td>
                <td>{obj.People}</td>
                <td>{obj.DateFromString}</td>
                <td>{obj.HourFrom}</td>
                <td>{obj.HourTo}</td>             
                <td>{obj.TotalPrice}</td>
                <td>{obj.StateDescription}</td>
                <td>
                    <div>
                        {obj.StateDescription === 'PENDING' || obj.StateDescription === 'RESERVED' ? (
                            <div>
                                <a onClick={() => {props.triggerModal("CANCEL")}}> <span><i className="col-md-1 fa fa-times"></i></span>CANCELAR</a> 
                                {isPublisher && obj.StateDescription === 'PENDING' ? (
                                    <a onClick={() => {alert("Confirmar")}}> <span><i className="col-md-1 fa fa-check"></i></span>CONFIRMAR</a>                            
                                    ) : (null)}
                            </div>
                            ) :(null)
                        }
                        {obj.StateDescription === 'FINISHED' && !isPublisher ? (
                            <div>
                                <a onClick={() => {props.triggerModal("RATE")}}> <span><i className="col-md-1 fa fa-comments"></i></span> CALIFICAR</a> 
                            </div>
                            ) :(
                                <div>
                                {!isPublisher && obj.StateDescription != 'FINISHED' && obj.StateDescription != 'CANCELED'  && obj.StateDescription != 'RESERVED' ? (
                                        <a onClick={() => {props.editReservation(obj.IdReservation)}}> <span><i className="col-md-1 fa fa-pencil-alt"></i></span>EDITAR</a>                            
                                    ) : (null)}
                                </div>
                            )
                        }
                    </div>
                </td>
            </tr>
            )
        })
    ) : (
        <tr><td colSpan={columnsName.length}>"No se encontraron resultados"</td></tr>
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