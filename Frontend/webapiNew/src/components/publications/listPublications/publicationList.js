import React from 'react';
import PublicationListCard from './publicationListCard';

// Multilanguage
import { withTranslate } from 'react-redux-multilingual'

class PublicationList extends React.Component {
    render() {
        return (
	        <>
				{this.props.publications.map(publication => {
					return (
                        <div key={publication.IdPublication}>
                            <PublicationListCard redirectToPub={this.props.redirectToPub}
                            key={publication.IdPublication}
                            {...publication}/>
                        </div>
					);
				})}
            </>
        );
    }
}

export default PublicationList;