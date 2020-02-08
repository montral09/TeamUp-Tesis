import React from 'react';
import RelatedPublications from '../publications/viewPublication/relatedPublications'
// Multilanguage
import { withTranslate } from 'react-redux-multilingual'
import { callAPI } from '../../services/common/genericFunctions';
import { MAIN_URL_WEB} from '../../services/common/constants'

class RecommendedPublications extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            recommendedPublications : [],
            spaceTypes              : [],
            generalError            : false,
        }
    }

    // This function will redirect to the publication clicked
    redirectToPub = (id) =>{
        window.open(MAIN_URL_WEB+'publications/viewPublication/viewPublication/' + id, '_blank');
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
        const { translate } = this.props;
        return (
            <React.Fragment>
                {this.state.recommendedPublications.length > 0 ? (<h3>{translate('recPubs_recommendedPubls')}</h3>) : (null)}
                {this.state.recommendedPublications.map((relPubs) => {
                    if(relPubs.Publications.length == 0){
                        return null;
                    }
                    return (
                        <React.Fragment key={relPubs.SpaceType}>
                            <RelatedPublications relatedPublications={relPubs.Publications} 
                                redirectToPub={this.redirectToPub} title={relPubs.SpaceTypeDesc}/>
                        </React.Fragment>
                    );
                })}
                <br/>
            </React.Fragment>
            
        );
    }
}
export default withTranslate(RecommendedPublications);