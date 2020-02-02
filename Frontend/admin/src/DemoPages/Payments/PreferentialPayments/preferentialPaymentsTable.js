import React from 'react'
import { Table, Progress } from 'reactstrap';
import { translateStates } from '../../../config/genericFunctions';

// This component will render the table with the values passed as parameters -props-
const PreferentialPaymentsTable = ({ preferentialPayments, approvePreferentialPayment, rejectPreferentialPayment, isLoading, mode }) => {
    const columnsName = ['ID Pub', 'Publicacion', 'Mail', 'Nombre', 'Telefono', 'Plan', 'Monto','Comentario', 'Evidencia', 'Fecha Pago',];

    if (mode == 'pendingConf') {
        columnsName.push('Aprobar', 'Rechazar');
    }else{
        columnsName.push('Estado');
    }

    const columnsTable = columnsName.map(colName => {
        return (<th key={colName}>{colName}</th>)
    });
    const arrDataAppList = preferentialPayments != null && preferentialPayments.length ? (
        preferentialPayments.map(obj => {
            return (
                <tr key={obj.IdPublication}>
                    <td>{obj.IdPublication}</td>
                    <td>{obj.Publication}</td>
                    <td>{obj.PublisherMail}</td>
                    <td>{obj.PublisherName}{"  "}{obj.PublisherLastName}</td>
                    <td>{obj.PublisherPhone}</td>
                    <td>{obj.PreferentialPlanName}</td>
                    <td>{obj.Price}</td>
                    <td title={obj.Comment}>{obj.Comment.length < 25 ? (obj.Comment) : (obj.Comment.substring(0, 25) + "...")}</td>
                    <td>{obj.Evidence ? (<a href={obj.Evidence} target="_blank">Ver</a>) : ('-')}</td>
                    <td>{obj.PaymentDate}</td>
                    {mode == 'pendingConf' ? (
                        <React.Fragment>
                            <td><a href="javascript:void(0);" onClick={() => { approvePreferentialPayment(obj.IdPublication) }}><i className="lnr lnr-thumbs-up"></i></a></td>
                            <td><a href="javascript:void(0);" onClick={() => { rejectPreferentialPayment(obj.IdPublication) }}><i className="lnr lnr-thumbs-down"></i></a></td>
                        </React.Fragment>
                    ) : (
                        <td>{translateStates(obj.PreferentialPlanState)}</td>
                    )}
                </tr>
            )
        })
    ) : (
            isLoading ? (<tr><td colSpan={columnsName.length}><Progress className="mb-3" animated value={100} /></td></tr>) : (<tr><td colSpan={columnsName.length}>No se encontraron elementos</td></tr>)
        );
    return (
        <Table hover className="mb-0" responsive={true}>
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

export default PreferentialPaymentsTable