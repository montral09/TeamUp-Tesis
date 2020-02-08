import React from "react";
import { Link } from 'react-router-dom';

// Multilanguage
import { withTranslate } from 'react-redux-multilingual'

class PublicationListCard extends React.Component {

 	render() {
        const {IdPublication, Capacity, HourPrice, DailyPrice, WeeklyPrice, MonthlyPrice, Title, ImagesURL, City, translate, IsRecommended} = this.props;
		return (
			<React.Fragment>
                <div className="row">
                    {IsRecommended ? (
                        <div className="sale">{translate('recommended_w')}</div>
				    ) : (null)}
                    <div className="image col-md-3">
                        <Link to={`/publications/viewPublication/viewPublication/${IdPublication}`}>
                            <img src={ImagesURL[0]} onError={(e)=>{e.target.onerror = null; e.target.src="../../../images/no-image-available.png"}} alt='No image available' className="" />
                        </Link>
                    </div>
                    <div className="name-desc col-md-6">
                        <div className="name"><Link to={`/publications/viewPublication/viewPublication/${IdPublication}`}>{Title}</Link></div>
				        <div className="">
							<i data-toggle="tooltip" title={translate('location_w')} className="fas fa-home" aria-hidden="true"></i>{" "+City}&ensp;&nbsp;&nbsp;&nbsp;
							<i data-toggle="tooltip" title={translate('capacity_w')} className="fas fa-users" aria-hidden="true"></i>{" "+Capacity}<br/>
				        </div>
                        <div className="price">
                        <br/>
							<i data-toggle="tooltip" title={translate('hour_w')} className="fas fa-clock" aria-hidden="true"></i>{HourPrice != 0 ? " $" + HourPrice : " -"}&nbsp;&nbsp;&nbsp;&nbsp;
							<i data-toggle="tooltip" title={translate('day_w')} className="fas fa-calendar-day" aria-hidden="true"></i>{DailyPrice != 0 ? " $" + DailyPrice : " -"}&nbsp;&nbsp;&nbsp;&nbsp;
							<i data-toggle="tooltip" title={translate('week_w')} className="fas fa-calendar-week" aria-hidden="true"></i>{WeeklyPrice != 0 ? " $" + WeeklyPrice : " -"}&nbsp;&nbsp;&nbsp;&nbsp;
							<i data-toggle="tooltip" title={translate('month_w')} className="fas fa-calendar-alt" aria-hidden="true"></i>{MonthlyPrice != 0 ? " $" + MonthlyPrice : " -"}&nbsp;&nbsp;&nbsp;&nbsp;
                        </div>
                    </div>
                    <div className="actions col-md-3">
                        <div>
                            <div className="add-to-cart">
                                <br/><a href="#redirectToPub" className="button" onClick={ () => this.props.redirectToPub(IdPublication)}>{translate('view_w')}</a>				            
                            </div>
                        </div>
                    </div>
                </div>
			</React.Fragment>
		);
	}
}

export default withTranslate(PublicationListCard);