import React from 'react';
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from 'react-places-autocomplete';
import './LocationSearchInput.css';
// Multilanguage
import { withTranslate } from 'react-redux-multilingual';

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
    this.props.onChange({target :{value:city,id:"city"}});
    this.setState({
      address : city
  })};
 
  render() {
    // these options will bias the autocomplete predictions towards Uruguay,
    // and limit the results to addresses only
    const searchOptions = {
      location: new window.google.maps.LatLng(-34, -56),
      radius: 100000,
    }
    return (
      <PlacesAutocomplete
        value={this.state.address}
        onChange={this.handleChange}
        onSelect={this.handleSelect}
        searchOptions={searchOptions}
      >
        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
            <div className="Demo__search-input-container">
            <input
              {...getInputProps({
                placeholder: 'Pocitos...',
                className: 'location-search-input',
              })}
            />
            <div style ={{ position: "absolute"}} >
              {loading && <div className = 'Demo__suggestion-item'>{this.props.translate('loading_text_small')}</div>}
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

export default withTranslate(LocationSearchInput);