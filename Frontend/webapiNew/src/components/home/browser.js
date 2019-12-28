import React from 'react';
import "react-datepicker/dist/react-datepicker.css";
import './browser.css';
import LocationSearchInput from './../publications/createPublication/LocationSearchInput';
import { withRouter } from "react-router";
import { toast } from 'react-toastify';
// Multilanguage
import { withTranslate } from 'react-redux-multilingual'
import { compose } from 'redux';


class Browser extends React.Component {
    componentDidMount() {
        window.scrollTo(0, 0);
        this.loadSpaceTypes();
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
        this.startSearch = this.startSearch.bind(this);
    }
    changeValue(text) {
        this.setState({ dropDownValue: text })
    }

    loadSpaceTypes() {
        try {
            fetch('https://localhost:44372/api/spaceTypes'
            ).then(response => response.json()).then(data => {
                if (data.responseCode == "SUCC_SPACETYPESOK") {
                    this.setState({ spaceTypes: data.spaceTypes , spaceTypeSelected : data.spaceTypes[0].Code })
                } else {
                    toast.error('Hubo un error', {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                    });
                }
            }
            ).catch(error => {
                toast.error('Internal error', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
                console.log(error);
            }
            )
        } catch (error) {
            toast.error('Internal error', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        }
    }

    startSearch() {
        let spaceTypeSelected = this.state.spaceTypeSelected  == "" ? "empty" :this.state.spaceTypeSelected;
        let capacity = this.state.capacity  == "" ? "empty" :this.state.capacity;
        let city = this.state.city  == "" ? "empty" :this.state.city;
        this.props.history.push('/publications/listPublications/mainPublications/'+spaceTypeSelected +'/'+capacity+'/'+city);
    }

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