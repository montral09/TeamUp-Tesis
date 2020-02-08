import React from 'react';
import "react-datepicker/dist/react-datepicker.css";
import './browser.css';
import LocationSearchInput from './../publications/createPublication/LocationSearchInput';
import { withRouter } from "react-router";
// Multilanguage
import { withTranslate } from 'react-redux-multilingual'
import { compose } from 'redux';
import { callAPI } from '../../services/common/genericFunctions';


class Browser extends React.Component {
    componentDidMount() {
        window.scrollTo(0, 0);
        this.loadSpaceTypesBR();
    }
    
    constructor(props) {
        super(props);
        this.state = {
            dropDownValue: "Select",
            spaceTypes : [],
            spaceTypeSelected : "",
            city : "",
            capacity : "",
            isLoading : false,
            buttonIsDisabled: false
        };
    }
    changeValue(text) {
        this.setState({ dropDownValue: text })
    }

    // This function will call the API
    loadSpaceTypesBR() {
        var objApi = {};
        objApi.objToSend = {}
        objApi.fetchUrl = "api/spaceTypes";
        objApi.method = "GET";
        objApi.successMSG = {
            SUCC_SPACETYPESOK : '',
        };
        objApi.functionAfterSuccess = "loadSpaceTypesBR";
        objApi.functionAfterError = "loadSpaceTypesBR";
        objApi.errorMSG = {}
        callAPI(objApi, this);
    }

    // This function will redirect to next screen using different filteres on the URL
    startSearch = () => {
        let spaceTypeSelected = this.state.spaceTypeSelected  == "" ? "empty" :this.state.spaceTypeSelected;
        let capacity = this.state.capacity  == "" ? "empty" :this.state.capacity;
        let city = this.state.city  == "" ? "empty" :this.state.city;
        this.props.history.push('/publications/listPublications/mainPublications/'+spaceTypeSelected +'/'+capacity+'/'+city);
    }

    // This function will handle the onchange event from the fields
    onChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value
        });
    }
    
    render() {
        const { translate } = this.props;
        return (
            <div>
                <h1 style = {{ color: 'white', marginTop: '15%', marginBottom: '30px', marginLeft: '20px'}}>{translate('home_findSpaceText')}</h1>
                <div style = {{ marginLeft: '5%', marginBottom: '30%'}}> 
					<select id="spaceTypeSelected" onChange={this.onChange} className="browser">
                        <option defaultValue disabled="disabled">{translate('spaceType_w')}</option>    
                        {this.state.spaceTypes.map((space, key) => {
                            return <option key={key} value={space.Code}>{space.Description}</option>;
                        })}
                    </select>
                    <label className="browser">
                        <LocationSearchInput id="city" onChange={this.onChange}/>
                    </label>
                    <label className="browser">
                        <input type="text" id="capacity" placeholder={translate('capacity_w')} maxLength="3" onChange={this.onChange}></input>
                    </label>
                    <button className="btn btn-primary browser" disabled= {this.state.buttonIsDisabled} type="button" value={translate('registerYourself_w')} onClick={() => { this.startSearch() }} >
                        {translate('home_findButton')}
                        { this.state.isLoading && 
                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        }
                    </button>
                </div>
            </div>
        );
    }
}
const enhance = compose(
    withRouter,
    withTranslate
)
export default enhance(Browser);