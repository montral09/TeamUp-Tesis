import React, {Component} from 'react';
import {StyleSheet,Text,View,ScrollView} from 'react-native';
import { connect } from 'react-redux';
import { callAPI } from '../common/genericFunctions';
import SpacesScrollView from './SpacesScrollView';
import translations from '../common/translations';


class RecommendedPublications extends Component {
    constructor(props) {
        super(props);

        this.state = {
            recommendedPublications : [],
            spaceTypes              : [],
            generalError            : false,
        }
    }
    
    componentDidMount() {
        this.loadSpaceTypesRP();
    }

    // This function will call the API
    loadSpaceTypesRP = () => {
        var objApi = {};
        objApi.objToSend = {}
        objApi.fetchUrl = "api/spaceTypes";
        objApi.method = "GET";
        objApi.successMSG = {
            SUCC_SPACETYPESOK : '',
        };
        objApi.functionAfterSuccess = "loadSpaceTypesRP";
        objApi.errorMSG= {}
        callAPI(objApi, this);
    }

    // This function will call the API
    loadRecommendedPubs = () =>{
        var objApi = {};
        objApi.objToSend = {}
        objApi.fetchUrl = "api/recommendedPublications";
        objApi.method = "GET";
        objApi.successMSG = {
            SUCC_FAVORITESOK : '',
        };
        objApi.functionAfterSuccess = "loadRecommendedPubs";
        objApi.errorMSG= {}
        callAPI(objApi, this);
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

