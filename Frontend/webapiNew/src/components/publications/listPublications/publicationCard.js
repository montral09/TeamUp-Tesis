import React from "react";
import $ from 'jquery';

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
        const {Capacity, HourPrice, DailyPrice, WeeklyPrice, MonthlyPrice, Title, ImagesURL, City, Ranking} = this.props;
		return (
			<React.Fragment>
				<div className="product clearfix product-hover">
				    <div className="left">
						Recomendados</div>
						
				        <div className="image ">
								<img src={ImagesURL[0]} className="" />				       
				    </div>
				    <div className="right">				        
				        <div className="">
				            {City}
				        </div>
				        <div className="only-hover">
				        	<a href="#add_to_cart" className="button" onClick={ () => alert('Enganchar con ver publicacion')}>Ver</a>				            
				        </div>
				    </div>
				</div>
			</React.Fragment>
		);
	}
}

export default PublicationCard;