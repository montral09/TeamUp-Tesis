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
								            <div className="author"><b>{review.Name}</b> <span>{review.date}</span></div>
											<div className="rating"><i className={review.Rating > 0 ? 'fa fa-star active' : 'fa fa-star'}></i><i className={review.Rating > 1 ? 'fa fa-star active' : 'fa fa-star'}></i><i className={review.Rating > 2 ? 'fa fa-star active' : 'fa fa-star'}></i><i className={review.Rating > 3 ? 'fa fa-star active' : 'fa fa-star'}></i><i className={review.Rating > 4 ? 'fa fa-star active' : 'fa fa-star'}></i></div>
								            <div className="text">{review.Review}</div>
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