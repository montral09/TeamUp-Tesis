// react
import React from 'react';
import { connect } from "react-redux";
import store from '../../services/store';
import { withTranslate } from 'react-redux-multilingual'
import { IntlActions } from 'react-redux-multilingual'
import languages  from '../../api/languages'
import { updateLocale } from '../../services/login/actions';

class LanguageForm extends React.Component {
	_isMounted = false;
	constructor(props) {
		super(props);
		var langToUse = this.props.locale;
		var localLang = localStorage.getItem('lang');
		if(localLang  ){
			langToUse = localLang;
		}
		this.state = {
			lang: langToUse
		}
		
		store.dispatch(IntlActions.setLocale(langToUse))
	}
	componentDidMount(){
		this._isMounted = true;
		if(this._isMounted){
			//store.dispatch(IntlActions.setLocale(this.state.lang))
		}
		
	}
    changeLang(lang) {
		store.dispatch(IntlActions.setLocale(lang))
		this.props.updateLocale(lang)
		localStorage.setItem("lang", lang);
		this.setState({lang:lang});
	}
	componentWillUnmount() {
		this._isMounted = false;
	  }
    render() {
	    return (
			<form method="post" id="language_form">
				<div className="dropdown">
					<a href="#language" className="dropdown-toggle" data-hover="dropdown" data-toggle="dropdown">
						{languages.map((language, index) => {
							if(language.code === this.state.lang) return language.title;
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