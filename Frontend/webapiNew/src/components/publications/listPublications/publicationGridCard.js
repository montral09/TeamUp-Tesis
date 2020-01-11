import React from "react";
import { Link } from 'react-router-dom';

// Multilanguage
import { withTranslate } from 'react-redux-multilingual'

class PublicationGridCard extends React.Component {
 	render() {
        const {IdPublication, Capacity, HourPrice, DailyPrice, WeeklyPrice, MonthlyPrice, Title, ImagesURL, City, translate} = this.props;

		return (
			<React.Fragment>
				<div className="product clearfix product-hover">
				    <div className="left">
						<div className="sale">{translate('recommended_w')}</div>
				        <div className="image ">
							<Link to={`/publications/viewPublication/viewPublication/${IdPublication}`}>
                            	<img src={ImagesURL[0]} onError={(e)=>{e.target.onerror = null; e.target.src="../../../images/no-image-available.png"}} alt='No image available' className="" />
							</Link>
				    	</div>
					</div>
				    <div className="right">		
						<div className="name"><Link to={`/publications/viewPublication/viewPublication/${IdPublication}`}></Link></div>
						<div className="price">
							<i data-toggle="tooltip" title={translate('hour_w')} className="fas fa-clock" aria-hidden="true"></i>{HourPrice != 0 ? " $" + HourPrice : " -"}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
							<i data-toggle="tooltip" title={translate('day_w')} className="fas fa-calendar-day" aria-hidden="true"></i>{DailyPrice != 0 ? " $" + DailyPrice : " -"}<br/>
							<i data-toggle="tooltip" title={translate('week_w')} className="fas fa-calendar-week" aria-hidden="true"></i>{WeeklyPrice != 0 ? " $" + WeeklyPrice : " -"}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
							<i data-toggle="tooltip" title={translate('month_w')} className="fas fa-calendar-alt" aria-hidden="true"></i>{MonthlyPrice != 0 ? " $" + MonthlyPrice : " -"}
						</div>
				        <div className="">
							{Title}<br/>
							<i data-toggle="tooltip" title={translate('location_w')} className="fas fa-home" aria-hidden="true"></i>{" "+City}&ensp;&nbsp;&nbsp;&nbsp;
							<i data-toggle="tooltip" title={translate('capacity_w')} className="fas fa-users" aria-hidden="true"></i>{" "+Capacity}<br/>
				        </div>
				        <div className="only-hover">
				        	<a href="#redirectToPub" className="button" onClick={ () => this.props.redirectToPub(IdPublication)}>{translate('view_w')}</a>				            
				        </div>
				    </div>
				</div>
			</React.Fragment>
		);
	}
}

export default withTranslate(PublicationGridCard);