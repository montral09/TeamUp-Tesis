import React from 'react';
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from 'react-places-autocomplete';
import './LocationSearchInput.css';

class LocationSearchInput extends React.Component {
  constructor(props) {
    super(props);
      this.state = {address: props.city || ""};
  }
 
  handleChange = address => {
    this.setState({ address });
  };
 
  handleSelect = address => {
    let city = address.split(",")[0];
    console.log("city:"+city)

    this.props.onChange({target :{value:city,id:"city"}});
    this.setState({
      address : city
  })};
 
  render() {
    return (
      <PlacesAutocomplete
        value={this.state.address}
        onChange={this.handleChange}
        onSelect={this.handleSelect}
      >
        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
            <div className="Demo__search-input-container">
            <input
              {...getInputProps({
                placeholder: 'Ej: Pocitos ...',
                className: 'location-search-input',
              })}
            />
            <div >
              {loading && <div>Loading...</div>}
              {suggestions.map(suggestion => {
                const className = suggestion.active
                  ? 'Demo__suggestion-item--active'
                  : 'Demo__suggestion-item';
                return (
                  <div
                    {...getSuggestionItemProps(suggestion, {
                      className,
                    })}
                  >
                    <strong>
                      {suggestion.formattedSuggestion.mainText}
                    </strong>{' '}
                    <small>
                      {suggestion.formattedSuggestion.secondaryText}
                    </small>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </PlacesAutocomplete>
    );
  }
}

export default LocationSearchInput