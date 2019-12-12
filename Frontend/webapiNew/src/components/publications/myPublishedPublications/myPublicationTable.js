import React from 'react'
import { Table } from 'reactstrap';


// This component will render the table with the values passed as parameters -props-
const MyPublicationTable = (props) =>{
    let publications = props.publications;
    let spaceTypes = props.spaceTypes;
    const columnsName = ['ID Pub','Tipo de Espacio','Fecha Creado','Title','Estado','Pago premium','Preguntas sin responder','Acción'];
    const columnsTable = columnsName.map( colName => {
        var valToRet = <th className="text-center" key={colName}>{colName}</th>;
        switch(colName){
            case "Acción": valToRet = <th className="text-center" colSpan='3' key={colName}>{colName}</th>; break;
            case "Pago premium": valToRet = <th className="text-center" colSpan='2' key={colName}>{colName}</th>; break;
        }
        return valToRet;
    });
    publications.forEach(element => {
        const spaceType = spaceTypes.filter(space => {
            return space.Code === element.SpaceType
        });

        element.SpaceTypeDesc = spaceType[0].Description;    
    });
    const arrDataList = publications.length ? (
        publications.map( obj => {
            console.log("MyPublicationTable ")
            console.log(obj)
            let url = "http://localhost:3000/publications/viewPublication/viewPublication/"+obj.IdPublication;
            var objPayment = {paymentStatus: obj.PreferentialPlan.StateDescription, paymentStatusText:obj.PreferentialPlan.StateDescription, paymentAmmount: 
                obj.PreferentialPlan.Price,plan: obj.PreferentialPlan.Description,paymentDate:obj.PreferentialPlan.PaymentDate, IdPublication: obj.IdPublication};
            return(
            <tr key={obj.IdPublication}>
                <td>{obj.IdPublication}</td>
                <td>{obj.SpaceTypeDesc}</td>
                <td>{obj.CreationDate}</td>
                <td>{obj.Title}</td>
                <td>{obj.State}</td>
                {objPayment.plan == 'FREE' ? (
                    <td colSpan="2">Plan Free</td>
                ) : (<>
                    <td>{objPayment.paymentStatus}</td>
                    <td><a href="#" className = "col-md-12" onClick={() => props.triggerModalDetailPayment(objPayment)}> <span><i className="col-md-1 fa fa-align-justify"></i></span> Detalles</a></td> 
                    </>
                )}

                <td>0</td>
                <td>
                    <a href={url}><span><i className="col-md-3 fa fa-eye"></i></span> Ver</a>
                </td>
                {obj.State === 'ACTIVE' ? (
                    <>
                    <td><a href="" className = "col-md-12" onClick={() => props.editPublication(obj.IdPublication)}> <span><i className="col-md-1 fa fa-pencil-alt"></i></span> Editar</a></td> 
                    <td><a href="" onClick={() => props.changePubState(obj.State, obj.IdPublication)}><span><i className="col-md-1 fa fa-pause"></i></span> Pausar</a></td>
                    </>
                ) : (
                    <>
                        {obj.State === 'PAUSED P' ? (
                            <>
                            <td><a href="" className = "col-md-12" onClick={() => props.changePubState(obj.State, obj.IdPublication)}><span><i className="col-md-1 fa fa-play"></i></span> Reanudar</a></td>
                            <td></td>
                            </>  
                        ) :(<><td></td><td></td></>) }
                    </>)}
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