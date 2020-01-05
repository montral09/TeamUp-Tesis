import React from 'react'
import { Table } from 'reactstrap';
import { MAIN_URL_WEB} from '../../../services/common/constants'
// Multilanguage
import { withTranslate } from 'react-redux-multilingual'


// This component will render the table with the values passed as parameters -props-
const FavPublicationsTable = (props) =>{
    const {translate} = props;
    let publications = props.publications;
    let spaceTypes = props.spaceTypes;
    const columnsName = ['#Ref',translate('spaceType_w'), translate('name_w'),translate('citiy_w'),translate('address_w'),translate('capacity_w'),translate('price_w'),translate('rate_w'),translate('action_w')];
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
            let url = MAIN_URL_WEB+"publications/viewPublication/viewPublication/"+obj.IdPublication;
            return(
            <tr key={obj.IdPublication}>
                <td>{obj.IdPublication}</td>
                <td>{obj.SpaceTypeDesc}</td>
                <td>{obj.Title}</td>
                <td>{obj.City}</td>
                <td>{obj.Address}</td>
                <td>{obj.Capacity}</td>
                <td>{obj.HourPrice == 0 ? (translate('hourlyPrice_w')+": N/A") : (translate('hourlyPrice_w')+": $"+obj.HourPrice)}<br/>
                    {obj.DailyPrice == 0 ? (translate('dailyPrice_w')+": N/A") : (translate('dailyPrice_w')+": $"+obj.DailyPrice)}<br/>
                    {obj.WeeklyPrice == 0 ? (translate('weeklyPrice_w')+": N/A") : (translate('weeklyPrice_w')+": $"+obj.WeeklyPrice)}<br/>
                    {obj.MonthlyPrice == 0 ? (translate('monthlyPrice_w')+": N/A") : (translate('monthlyPrice_w')+": $"+obj.MonthlyPrice)}<br/>
                </td>
                <td>{obj.Ranking == 0 ? "N/A" : obj.Ranking}</td>
                <td><a href={url}><span><i className="col-md-3 fa fa-eye"></i></span> {translate('view_w')}</a></td>
            </tr>
            )
        })
    ) : (
        <tr><td colSpan={columnsName.length}>{translate('elementsNotFound_w')}</td></tr>
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

export default withTranslate(FavPublicationsTable)