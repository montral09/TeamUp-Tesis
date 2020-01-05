import React from 'react';
import PublicationGridCard from "./publicationGridCard";


class PublicationGrid extends React.Component {
    render() {
        
        return (
	        <>
				<div className="row">
					{this.props.publications.map(publication => {
						return (
	        				<div className="col-6 col-md-4 col-lg-3" key={publication.IdPublication+'_pub_grid_id'}>
								<PublicationGridCard redirectToPub={this.props.redirectToPub}
									key={publication.IdPublication}
									{...publication}
								/>
							</div>
						);
					})}
				</div>
            </>
        );
    }
}

export default PublicationGrid