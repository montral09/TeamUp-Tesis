import React from 'react'
import { Table } from 'reactstrap';


// This component will render the table with the values passed as parameters -props-
const MyReservedSpacesTable = (props) =>{
    let reservations = props.reservations;
    const columnsName = ['ID','Publicacion', 'Mail cliente', 'Personas', 'Fecha', 'Estadía', 'Monto', 'Pago', 'Estado', 'Acción'];
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
                <td>{obj.People}</td>
                <td>{obj.DateFromString}</td>
                <td>{obj.PlanSelected == 'Hour' ? ("Desde "+obj.HourFrom+" a "+obj.HourTo) : ("1 "+ obj.PlanSelected)}</td>
                <td>{obj.TotalPrice}</td>
                <td>Pendiente de pago</td>
                <td>{obj.StateDescription}</td>
                <td>
                    <div>
                        {obj.StateDescription === 'PENDING' || obj.StateDescription === 'RESERVED' ? (
                            <div>
                                <a href="" onClick={() => {props.triggerModal("CANCEL", obj.IdReservation, obj.StateDescription)}}><span><i className="col-md-1 fa fa-times"></i></span>Cancelar</a> 
                                {isPublisher && obj.StateDescription === 'PENDING' ? (
                                    <a href="" onClick={() => {props.triggerModal("CONFIRM", obj.IdReservation, obj.StateDescription)}}><span><i className="col-md-1 fa fa-check"></i></span> Confirmar</a>                            
                                    ) : (null)}
                            </div>
                            ) :(null)
                        }
                        {obj.StateDescription === 'FINISHED' && !isPublisher && !obj.Reviewed ? (
                            <div>
                                <a href="" onClick={() => {props.triggerModal("RATE", obj.IdReservation, obj.StateDescription)}}><span><i className="col-md-1 fa fa-star"></i></span> Calificar</a> 
                            </div>
                            ) :(
                                <div>
                                {!isPublisher && obj.StateDescription != 'FINISHED' && obj.StateDescription != 'CANCELED'  && obj.StateDescription != 'RESERVED' ? (
                                        <a href="" onClick={() => {props.editReservation(obj.IdReservation)}}><span><i className="col-md-1 fa fa-pencil-alt"></i></span> Editar</a>                            
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