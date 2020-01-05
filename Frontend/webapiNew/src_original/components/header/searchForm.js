// react
import React from 'react';
import { withTranslate } from 'react-redux-multilingual'

class SearchForm extends React.Component {
    render() {
    	const {translate} = this.props;
	    return (
			<div className="search_form">
			     <div className="button-search">n</div>
			     <input type="text" className="input-block-level search-query" name="search" placeholder={translate('search')} />
			</div>
	    );
	}
}

export default withTranslate(SearchForm);