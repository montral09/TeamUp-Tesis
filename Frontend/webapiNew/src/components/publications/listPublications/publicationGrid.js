import React from 'react';
import PublicationCard from "./publicationCard";


class PublicationGrid extends React.Component {
    render() {
        
        return (
	        <>
				<div className="row">
					{this.props.publications.map(publication => {
						return (
	        				<div className="col-6 col-md-4 col-lg-3" key={publication.id}>
								<PublicationCard
									key={publication.id}
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