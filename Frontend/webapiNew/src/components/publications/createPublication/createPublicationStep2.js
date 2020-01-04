import React from 'react';
import { toast } from 'react-toastify';
import {Form, FormGroup, Label, Input, FormFeedback,
    Row,Col,Button, InputGroupAddon,InputGroup } from 'reactstrap';
import Geocode from "react-geocode";
import credentials from '../map/credentials';
import Upload from './upload/upload';
import Map from '../map/Map';
import LocationSearchInput from './LocationSearchInput';
import ViewImages from './upload/viewImages';
// Multilanguage
import { withTranslate } from 'react-redux-multilingual'

class CreatePublicationStep2 extends React.Component {
    constructor(props) {
        super(props);
        var locationTextValidatedInitial = false;
        if(this.props.parentState.geoLat != 0){
            locationTextValidatedInitial = true;
        }
        this.state= {
            youtubeURL: this.props.parentState.youtubeURL,
            matchYoutubeSuccess : false,
            matchYoutubeError : false,
            locationText: this.props.parentState.locationText,
            locationTextSuccess: false,
            locationTextError: false,
            loadingLocationVal: false,
            locationTextValidated: locationTextValidatedInitial,
            locationTextLoading: false,
            geoLat: this.props.parentState.geoLat,
            geoLng: this.props.parentState.geoLng
        }
        this.matchYoutubeUrl = this.matchYoutubeUrl.bind(this);
        this.validateLocation = this.validateLocation.bind(this);
        this.functionLoadLocation = this.functionLoadLocation.bind(this);
        this.deleteImage = this.deleteImage.bind(this);
        Geocode.setApiKey(credentials.mapsKey);
        Geocode.setRegion("uy");
        Geocode.enableDebug();
    }
    
    deleteImage(id){
        var tempImgArr = this.props.parentState.imagesURL.filter(function(value, index){
            return index != id;
        });
        this.props.onChange({target :{value:tempImgArr, id:"imagesURL"}});
    }

    matchYoutubeUrl(input) {
        let url = input.target.value;
        var p = /(?:https?:\/\/)?(?:youtu\.be\/|(?:www\.|m\.)?youtube\.com\/(?:watch|v|embed)(?:\.php)?(?:\?.*v=|\/))([a-zA-Z0-9\-_]+)/;
        var matches = String(url).match(p);
        if (matches && matches[1].length == 11) {
            this.props.onChange({target :{value:matches[0], id:"youtubeURL"}});
            this.setState({ matchYoutubeSuccess: true, matchYoutubeError: false, youtubeURL:input.target.value });
        }else{
            this.props.onChange({target :{value:"", id:"youtubeURL"}});
            this.setState({ matchYoutubeSuccess: false, matchYoutubeError: true, youtubeURL:input.target.value });
        }
    }

    validateLocation(){
        if(this.state.locationText ==""){
            toast.error("Por favor ingrese la ubicacion", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        }else{
            const scope = this;
            this.setState({
                locationTextLoading: true,
            }, () => {
                try{
                    Geocode.fromAddress(this.state.locationText).then(
                        response => {
                          const { lat, lng } = response.results[0].geometry.location;
                          scope.setState({
                            locationTextLoading: false,
                            locationTextValidated: true,
                            locationTextSuccess: true,
                            geoLat: lat,
                            geoLng: lng
                            });
                           scope.props.onChange({target :{value:scope.state.locationText,id:"locationText"}});
                           scope.props.onChange({target :{value:lat,id:"geoLat"}});
                           scope.props.onChange({target :{value:lng,id:"geoLng"}});
                        },
                        error => {
                            throw error;
                        }
                      );
                }catch(e){
                    scope.setState({
                        locationTextLoading: false,
                        locationTextValidated: false,
                        locationTextSuccess: false,
                        locationTextError: true,
                    });
                }

            });
            
        }
    }

    functionLoadLocation(e){
        // if the location was valid and you try to input again -) need to validate again
        if(this.state.locationTextValidated){
            this.props.onChange({target :{value:"",id:"locationText"}});
            this.props.onChange({target :{value:0,id:"geoLat"}});
            this.props.onChange({target :{value:0,id:"geoLng"}});
        }
        // if not, load the text
        this.setState({
            locationText: e.target.value,
            locationTextValidated: false,
            locationTextSuccess: false,
            locationTextError: false,
        });
    }

    render() {
      if (this.props.parentState.currentStep !== 2) { // Prop: The current step
        return null
      }
      const { translate } = this.props;

      // Step 2 UI
      return(
        <Form className="border border-light p-6">
            <p className="h4 mb-4 text-center">{translate('createPub_DataFromYourSpace')} - {translate('createPub_stepHeader')} 2</p>
            <FormGroup>
                <Upload onChange={this.props.onChange} loadedImages={this.props.parentState.imagesURL}/>
                {this.props.parentState.imagesURL.length > 0 ? (
                    <ViewImages loadedImages={this.props.parentState.imagesURL} deleteImage={this.deleteImage}/>
                ) : (null)}
                <Label for="">{translate('createPub_step2_photoLbl1')} : {this.props.parentState.imagesURL.length + this.props.parentState.spaceImages.length} , {translate('createPub_step2_photoLbl2')} : {this.props.parentState.imagesURL.length} , {translate('to_w')} {translate('upload_w')} : {this.props.parentState.spaceImages.length}</Label>
            </FormGroup>
            <FormGroup>
                <Label for="youtubeURL">{translate('video_w')} {translate('createPub_step2_youtubeLinkTxt')}</Label>
                <Input {...(this.state.matchYoutubeSuccess ? {valid :true} : {})} {...(this.state.matchYoutubeError ? {invalid :true} : {})} 
                    type="text" name="youtubeURL" id="youtubeURL" onChange={this.matchYoutubeUrl} maxLength="70" value={this.state.youtubeURL}/>
                <FormFeedback tooltip>{translate('createPub_step2_youtubeURLErrorTxt')}</FormFeedback>
            </FormGroup>
            <Row form>
                <Col md={8}>
                    <FormGroup>
                    <Label for="locationSearch">{translate('location2_w')} (*)</Label>
                    <LocationSearchInput onChange={this.props.onChange} city={this.props.parentState.city}/>
                    </FormGroup>
                </Col>
                <Col md={8}>
                    <FormGroup>
                        <Label for="locationText">{translate('location_w')} (*)</Label>
                        <InputGroup>
                            <InputGroupAddon addonType="prepend">
                                <Button id="locationTexButton" onClick={this.validateLocation} disabled={this.state.locationTextLoading}>{translate('validate_w')}</Button>
                            </InputGroupAddon>
                            <Input {...(this.state.locationTextSuccess ? {valid :true} : {})} {...(this.state.locationTextError ? {invalid :true} : {})} 
                                    type="text" name="locationText" placeholder="ej: 18 de julio 2233" id="locationText"
                                    value ={this.state.locationText} onChange={this.functionLoadLocation}/>
                        </InputGroup>
                    </FormGroup>
                </Col>
            </Row>
            {this.state.locationTextValidated &&
                <Map objGoogleMaps = {{zoom : 17, latitude: this.state.geoLat, longitude: this.state.geoLng}}/>
            }
            <FormGroup>
            </FormGroup>

        </Form>
      )
    }
  }

  export default withTranslate(CreatePublicationStep2);