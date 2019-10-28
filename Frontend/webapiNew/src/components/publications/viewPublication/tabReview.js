import React from "react";


class TabReview extends React.Component {
 	render() {
 		var reviews = [
            {
                id: 1,
                product: 1,
                rating: 4,
                author: 'Artur',
                date: '12/12/2019',
                review: 'Excelente todo, lo volvere a usar'
            },
            {
                id: 2,
                product: 2,
                rating: 5,
                author: 'Jose',
                date: '12/12/2019',
                review: 'Esta es una review super larga para probar que no se rompa si tengo muchos caracteres porque no queremos que eso pase nocierto? Seguimos escribiendo? si, seguimos escribiendo, al final no va a ser tan largo porque ya no se que mas poner',
            },
            {
                id: 3,
                product: 3,
                rating: 5,
                author: 'Artur',
                date: '12/12/2019',
                review: 'Esta es una review super larga para probar que no se rompa si tengo muchos caracteres porque no queremos que eso pase nocierto? Seguimos escribiendo? si, seguimos escribiendo, al final no va a ser tan largo porque ya no se que mas poner',
            },
            {
                id: 4,
                product: 4,
                rating: 4,
                author: 'Santiago',
                date: '12/12/2019',
                review: 'Bien',
            },
            {
                id: 5,
                product: 5,
                rating: 5,
                author: 'Maria Julia',
                date: '12/12/2019',
                review: ''
            },
            {
                id: 6,
                product: 6,
                rating: 1,
                author: 'Artur',
                date: '12/12/2019',
                review: 'Nunca mas'
            },
        ];

 	
		return (
			<React.Fragment>
				<form className="form-horizontal" id="form-review">
				    <div id="review">
						{reviews.length > 0 ? (
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