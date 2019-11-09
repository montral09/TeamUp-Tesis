import React from "react";
import $ from 'jquery';
import { Link } from 'react-router-dom';

// Multilanguage
import { withTranslate } from 'react-redux-multilingual'

class PublicationCard extends React.Component {
	loadQuickview(id) {
		this.props.changeQuickview(id);
		setTimeout(function () {
			$('#modalProduct-' + id).modal('show')
		}, 100);
	}
 	render() {
        const {IdPublication, Description, Capacity, HourPrice, DailyPrice, WeeklyPrice, MonthlyPrice, Title, ImagesURL, City, Ranking} = this.props;
		return (
			<React.Fragment>
				<div className="product clearfix product-hover">
				    <div className="left">
						<div className="sale">Recomendados</div>
				        <div className="image ">
							<Link to={`/publications/viewPublication/viewPublication/${IdPublication}`}>
								<img src={ImagesURL[0]} className="" alt={Description} />		
							</Link>
				    	</div>
					</div>
				    <div className="right">		
						<div className="name"><Link to={`/publications/viewPublication/viewPublication/${IdPublication}`}></Link></div>
						<div className="price">
				            {HourPrice > 0 ? ("Por Hora $"+HourPrice) : (null)}
							{DailyPrice > 0 ? ("Por Día $"+DailyPrice) : (null)}
				            {WeeklyPrice > 0 ? ("Por Semana $"+WeeklyPrice) : (null)}
				            {MonthlyPrice > 0 ? ("Por Mes $"+MonthlyPrice) : (null) }
				        </div>
				        <div className="">
				            {City}
				        </div>
				        <div className="only-hover">
				        	<a href="#redirectToPub" className="button" onClick={ () => this.props.redirectToPub(IdPublication)}>Ver</a>				            
				        </div>
				    </div>
				</div>
			</React.Fragment>
		);
	}
}

export default PublicationCard;