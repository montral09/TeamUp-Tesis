// react
import React from 'react';
import { connect } from "react-redux";
import store from '../../services/store';
import { withTranslate } from 'react-redux-multilingual'
import { IntlActions } from 'react-redux-multilingual'
import languages  from '../../api/languages'
import { updateLocale } from '../../services/login/actions';

class LanguageForm extends React.Component {
	constructor(props) {
        super(props);
		const serializedState = localStorage.getItem('state');
		if (serializedState === null) {
		  return undefined;
		}
		var loginData = JSON.parse(serializedState);
		if(loginData && loginData.locale ){
			// update locale
			store.dispatch(IntlActions.setLocale(loginData.locale))
		}
	}
	componentDidMount(){

	}
    changeLang(lang) {
		store.dispatch(IntlActions.setLocale(lang))
		this.props.updateLocale(lang)
    }
    render() {
		const { locale } = this.props;

	    return (
			<form method="post" id="language_form">
				<div className="dropdown">
					<a href="#language" className="dropdown-toggle" data-hover="dropdown" data-toggle="dropdown">
						{languages.map((language, index) => {
							if(language.code === locale) return language.title;
							return null;
						})}
					</a>
					<ul className="dropdown-menu">
						{languages.map((language, index) => <li key={index}><a href="#language" onClick={() => this.changeLang(language.code)}>{language.title}</a></li> )}
					</ul>
				</div>
			</form>
	    );
	}
}

function mapStateToProps(state) {
    return {
		locale: state.Intl.locale
    }
}
const mapDispatchToProps = (dispatch) =>{
    return{
        updateLocale: (locale) => dispatch(updateLocale(locale))
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(withTranslate(LanguageForm));