import React, {Component} from 'react';

import SearchSpaceView from "./SearchSpaceView";


class SearchSpaceList extends Component {
    render() {
        
        return (
            <>
                {this.props.publications.map(publication => {
                    return (
                        <SearchSpaceView key={publication.IdPublication} navigate={this.props.navigate} {...publication}/>
                    );
                })}
            </>
        );
    }
}

export default SearchSpaceList