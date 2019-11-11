import React from "react";
import $ from 'jquery';
import { Link } from 'react-router-dom';

// Multilanguage
import { withTranslate } from 'react-redux-multilingual'

class PublicationGridCard extends React.Component {
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
						<div className="sale">Recomendado</div>
				        <div className="image ">
							<Link to={`/publications/viewPublication/viewPublication/${IdPublication}`}>
								<img src={ImagesURL[0]} className="" alt='No image available' />		
							</Link>
				    	</div>
					</div>
				    <div className="right">		
						<div className="name"><Link to={`/publications/viewPublication/viewPublication/${IdPublication}`}></Link></div>
						<div className="price">
							<i className="fa fa-money" aria-hidden="true"></i>{"Hora$"+HourPrice}<br/>
						</div>
				        <div className="">
							{Title}<br/>
							<i className="fa fa-home" aria-hidden="true"></i>{" "+City}<br/>
							<i className="fa fa-users" aria-hidden="true"></i>{" "+Capacity}<br/>
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

export default PublicationGridCard;