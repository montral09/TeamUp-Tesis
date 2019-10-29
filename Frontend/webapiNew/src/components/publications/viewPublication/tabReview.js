import React from "react";


class TabReview extends React.Component {
 	render() {
        const {reviews} = this.props;
        	console.log(this.props)
		return (
			<React.Fragment>
				<form className="form-horizontal" id="form-review">
				    <div id="review">
						{reviews && reviews.length > 0 ? (
							<div className="review-list">
								{reviews.map((review, index) => {
									return (
										<div className="review" key={index}>
								            <div className="author"><b>{review.author}</b> <span>{review.date}</span></div>
											<div className="rating"><i className={review.rating > 0 ? 'fa fa-star active' : 'fa fa-star'}></i><i className={review.rating > 1 ? 'fa fa-star active' : 'fa fa-star'}></i><i className={review.rating > 2 ? 'fa fa-star active' : 'fa fa-star'}></i><i className={review.rating > 3 ? 'fa fa-star active' : 'fa fa-star'}></i><i className={review.rating > 4 ? 'fa fa-star active' : 'fa fa-star'}></i></div>
								            <div className="text">{review.review}</div>
										</div>
									)
								})}
							</div>
						) : (
							<p>Sin reviews</p>
						)}
				    </div>
				</form>
			</React.Fragment>
		);
	}
}

export default TabReview;