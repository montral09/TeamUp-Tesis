import React from 'react';
import RelatedPublications from '../publications/viewPublication/relatedPublications'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// Multilanguage
import { withTranslate } from 'react-redux-multilingual'
import { compose } from 'redux';

class RecommendedPublications extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            recommendedPublications : [],
            spaceTypes              : [],
            generalError            : false,
        }
        this.loadRecommendedPubs = this.loadRecommendedPubs.bind(this);
        this.redirectToPub = this.redirectToPub.bind(this);
        this.handleErrors           = this.handleErrors.bind(this);
    }
    
    handleErrors(error) {
        this.setState({ generalError: true });
    }

    redirectToPub(id){
        window.open('http://localhost:3000/publications/viewPublication/viewPublication/' + id, '_blank');
    }

    componentDidMount() {
        this.loadSpaceTypes();
    }

    loadSpaceTypes() {
        var objApi = {};
        objApi.objToSend = {}
        objApi.fetchUrl = "https://localhost:44372/api/spaceTypes";
        objApi.method = "GET";
        objApi.responseSuccess = "SUCC_SPACETYPESOK";
        objApi.successMessage = "";
        objApi.functionAfterSuccess = "loadSpaceTypes";
        this.callAPI(objApi);
    }

    loadRecommendedPubs(){
        var objApi = {};
        objApi.objToSend = {}
        objApi.fetchUrl = "https://localhost:44372/api/recommendedPublications";
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
                        toast.success(objApi.successMessage, {
                            position: "top-right",
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                        });
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
                        toast.success(objApi.successMessage, {
                            position: "top-right",
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                        });
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
        const { translate } = this.props;
        return (
            <React.Fragment>
                <h3>{translate('recPubs_recommendedPubls')}</h3>
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
            </React.Fragment>
        );
    }
}
export default withTranslate(RecommendedPublications);