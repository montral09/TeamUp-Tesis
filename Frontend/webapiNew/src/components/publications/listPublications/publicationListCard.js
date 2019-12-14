import React from "react";
import { Link } from 'react-router-dom';

// Multilanguage
import { withTranslate } from 'react-redux-multilingual'

class PublicationListCard extends React.Component {

 	render() {
        const {IdPublication, Description, Capacity, HourPrice, DailyPrice, WeeklyPrice, MonthlyPrice, Title, ImagesURL, City, Ranking} = this.props;
		return (
			<React.Fragment>
                <div className="row">
                    <div className="image col-md-3">
                        <Link to={`/publications/viewPublication/viewPublication/${IdPublication}`}>
                            <img src={ImagesURL[0]} onError={(e)=>{e.target.onerror = null; e.target.src="/images/no-image-available.png"}} alt='No image available' className="" />
                        </Link>
                    </div>
                    <div className="name-desc col-md-6">
                        <div className="name"><Link to={`/publications/viewPublication/viewPublication/${IdPublication}`}>{Title}</Link></div>
                        <div className="description">
                            {Description.length < 175 ? (Description) : (Description.substring(0,175)+"...")}
                        </div>
                    </div>
                    <div className="actions col-md-3">
                        <div>
                            <div className="price">
                                {HourPrice != 0 ? "Hora $" + HourPrice :
                                     (DailyPrice != 0 ? "Día $" + HourPrice :
                                        WeeklyPrice != 0 ? "Semana $" + WeeklyPrice :
                                            MonthlyPrice != 0 ? "Mes $" + MonthlyPrice : (null))
                                }
                            </div>
                            <div className="add-to-cart">
				        	    <a href="#redirectToPub" className="button" onClick={ () => this.props.redirectToPub(IdPublication)}>Ver</a>				            
                            </div>
                        </div>
                    </div>
                </div>
			</React.Fragment>
		);
	}
}

export default PublicationListCard;