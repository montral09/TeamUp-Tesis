import React, { Component } from "react"
import { compose } from "recompose"
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker
} from "react-google-maps"
import {API_CREDENTIALS, GMAP_URL} from '../../../services/common/constants';

const mapURL = GMAP_URL+`${API_CREDENTIALS}`;
const MapWithAMarker = compose(withScriptjs, withGoogleMap)(props => {
const {zoom, latitude, longitude } = props.objGoogleMaps;
  return (
    <GoogleMap defaultZoom={zoom} defaultCenter={{ lat: latitude, lng: longitude }}>
          <Marker position={{ lat: latitude, lng: longitude }}>
          </Marker>
    </GoogleMap>
  )
})

export default class Map extends Component {
    
  constructor(props) {
    super(props)
    this.state = {
        objGoogleMaps: this.props.objGoogleMaps
      }
    
  }


  render() {
    return (
      <MapWithAMarker
        googleMapURL={mapURL}
        loadingElement={<div style={{ height: `100%` }} />}
        containerElement={<div style={{ height: `400px` }} />}
        mapElement={<div style={{ height: `100%` }} />}
        objGoogleMaps = {this.state.objGoogleMaps}
      />
    )
  }
}