import React, {Component} from 'react';
import {StyleSheet,Text,View,ScrollView,Keyboard,TouchableOpacity,ToastAndroid} from 'react-native';
import { connect } from 'react-redux';
import SpacesScrollView from './SpacesScrollView';
import translations from '../common/translations';
import Globals from '../Globals';

class RecommendedPublications extends Component {
    constructor(props) {
        super(props);

        this.state = {
            recommendedPublications : [],
            spaceTypes              : [],
            generalError            : false,
        }
        this.loadRecommendedPubs = this.loadRecommendedPubs.bind(this);
        this.handleErrors           = this.handleErrors.bind(this);
    }
    
    handleErrors(error) {
        this.setState({ generalError: true });
    }

    componentDidMount() {
        this.loadSpaceTypes();
    }

    loadSpaceTypes() {
        var objApi = {};
        objApi.objToSend = {}
        objApi.fetchUrl = Globals.baseURL + '/spaceTypes';
        objApi.method = "GET";
        objApi.responseSuccess = "SUCC_SPACETYPESOK";
        objApi.successMessage = "";
        objApi.functionAfterSuccess = "loadSpaceTypes";
        this.callAPI(objApi);
    }

    loadRecommendedPubs(){
        var objApi = {};
        objApi.objToSend = {}
        objApi.fetchUrl = Globals.baseURL + '/recommendedPublications';
        objApi.method = "GET";
        objApi.responseSuccess = "SUCC_FAVORITESOK";
        objApi.successMessage = "";
        objApi.functionAfterSuccess = "loadRecommendedPubs";
        this.callAPI(objApi);
    }

    callAPI(objApi){
        if(objApi.method == "GET"){
            fetch(objApi.fetchUrl).then(response => response.json()).then(data => {
                if (data.responseCode == objApi.responseSuccess) {
                    if(objApi.successMessage != ""){
                        ToastAndroid.showWithGravity(
                            objApi.successMessage,
                            ToastAndroid.LONG,
                            ToastAndroid.CENTER,
                        );
                    }
                    this.callFunctionAfterApiSuccess(objApi.functionAfterSuccess, data);
                } else {
                    this.handleErrors("Internal error");
                }
            }
            ).catch(error => {
                this.handleErrors(error);
            }
            )
        }else{
            fetch(objApi.fetchUrl,{
                    method: objApi.method,
                    header: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                    body: JSON.stringify(objApi.objToSend)
                }).then(response => response.json()).then(data => {
                if (data.responseCode == objApi.responseSuccess) {
                    if(objApi.successMessage != ""){
                        ToastAndroid.showWithGravity(
                            objApi.successMessage,
                            ToastAndroid.LONG,
                            ToastAndroid.CENTER,
                        );
                    }
                    this.callFunctionAfterApiSuccess(objApi.functionAfterSuccess, data);
                } else {
                    this.handleErrors("Internal error");
                }
            }
            ).catch(error => {
                this.handleErrors(error);
            }
            )
        }
    }

    callFunctionAfterApiSuccess(trigger, objData){
        switch(trigger){
            case "loadRecommendedPubs":
                console.log("loadRecommendedPubs")
                console.log(objData)

                var finalRecommended = objData.Recommended;
                const spaceTypes = this.state.spaceTypes;
                finalRecommended.forEach(element => {
                    const spaceType = spaceTypes.filter(space => {
                        return space.Code === element.SpaceType
                    });
                    element.SpaceTypeDesc = spaceType[0].Description;    
                });
                this.setState({ recommendedPublications: finalRecommended});
            break;
            case "loadSpaceTypes" : this.setState({ spaceTypes: objData.spaceTypes }, () => {this.loadRecommendedPubs()}); break;
        }
    }
    
    render() {
        const { systemLanguage } = this.props;
        return (
            <View style={{marginTop: 20}}>
                <Text style={styles.titleText}>{translations[systemLanguage].messages['recPubs_recommendedPubls']}</Text>
                {this.state.recommendedPublications.map((relPubs) => {
                    if(relPubs.Publications.length == 0){
                        return null;
                    }
                    return (
                        <React.Fragment key={relPubs.SpaceType}>
                            <Text style={styles.subtitleText}>{relPubs.SpaceTypeDesc}</Text>
                            <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={false}
                            >   
                                {relPubs.Publications.map((relPubsPreview) => {
                                    return (<SpacesScrollView key={relPubsPreview.IdPublication} type={'recommended'} navigate={this.props.navigate} {...relPubsPreview}/>)
                                })}        
                            </ScrollView>
                        </React.Fragment>
                    );
                })}
            </View>
        );
    }
}

const styles = StyleSheet.create({
  titleText:{
    fontSize: 24, 
    fontWeight: 'bold',
    color: "#FFF",
    marginTop: 20,
    marginLeft: 20,
    marginBottom: 5,
  },
  subtitleText:{
    fontSize: 22, 
    fontWeight: 'bold',
    color: "#FFF",
    marginTop: 10,
    marginLeft: 20,
    marginBottom: 5,
  },
});

const mapStateToProps = (state) => {
    return {
        systemLanguage: state.loginData.systemLanguage
    }
}

export default connect(mapStateToProps)(RecommendedPublications);

