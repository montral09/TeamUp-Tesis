import React from 'react';
import "react-datepicker/dist/react-datepicker.css";
import './browser.css';
import LocationSearchInput from './../publications/createPublication/LocationSearchInput';
import { withRouter } from "react-router";
import { toast } from 'react-toastify';

class Browser extends React.Component {
    componentDidMount() {
        window.scrollTo(0, 0);
        this.loadSpaceTypes();
    }
    
    constructor(props) {
        super(props);
        this.state = {
            dropDownValue: "Tipo de espacio",
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
        this.props.history.push('/publications/listPublications/mainPublications/'+this.state.spaceTypeSelected+'/'+this.state.capacity+'/'+this.state.city+'');
    }

    onChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value
        });
    }
    render() {
        return (
            <div>
                <h1 style = {{ color: 'white', marginTop: '15%', marginBottom: '30px', marginLeft: '20px'}}>Encuentre el espacio que mas se adecue a su necesidad</h1>
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
                        <input type="text" id="capacity" placeholder="Capacidad" maxLength="3" onChange={this.onChange}></input>
                    </label>
                    <button className="btn btn-primary browser" disabled= {this.state.buttonIsDisabled} type="button" value='Registrarse' onClick={() => { this.startSearch() }} >
                        Buscar
                        { this.state.isLoading && 
                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        }
                    </button>
                </div>
            </div>
        );
    }
}
export default withRouter(Browser);