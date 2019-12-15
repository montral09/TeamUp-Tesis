import React from 'react';
import RelatedPublications from '../publications/viewPublication/relatedPublications'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
        objApi.responseSuccess = "SUCC_PUBLICATIONSOK";
        objApi.successMessage = "";
        objApi.functionAfterSuccess = "loadRecommendedPubs";
        //this.callAPI(objApi);

        //HARDCODED
        var data = {
            "Recommended": [
                {
                    "SpaceType": 1,
                    "Publications": [
                        {
                            "IdPublication": 21,
                            "Title": "Salon de eventos espectacular",
                            "City": "Pocitos",
                            "Address": "Av Italia 6000",
                            "Capacity": 200,
                            "ImagesURL": [
                                "https://pyme.emol.com/wp-content/uploads/2019/03/cowork222.jpg",
                                "https://pyme.emol.com/wp-content/uploads/2019/03/cowork222.jpg"
                            ],
                        },
                        {
                            "IdPublication": 21,
                            "Title": "Salaaaaaaa",
                            "City": "Pocitos",
                            "Address": "Av Italia 6000",
                            "Capacity": 200,
                            "ImagesURL": [
                                "https://pyme.emol.com/wp-content/uploads/2019/03/cowork222.jpg",
                                "https://pyme.emol.com/wp-content/uploads/2019/03/cowork222.jpg"
                            ],
                        }
                    ],
                },
                {
                    "SpaceType": 2,
                    "Publications": [
                        {
                            "IdPublication": 21,
                            "Title": "Salaaaaaaa",
                            "City": "Pocitos",
                            "Address": "Av Italia 6000",
                            "Capacity": 200,
                            "ImagesURL": [
                                "https://pyme.emol.com/wp-content/uploads/2019/03/cowork222.jpg",
                                "https://pyme.emol.com/wp-content/uploads/2019/03/cowork222.jpg"
                            ],
                        },
                        {
                            "IdPublication": 21,
                            "Title": "Salaaaaaaa",
                            "City": "Pocitos",
                            "Address": "Av Italia 6000",
                            "Capacity": 200,
                            "ImagesURL": [
                                "https://pyme.emol.com/wp-content/uploads/2019/03/cowork222.jpg",
                                "https://pyme.emol.com/wp-content/uploads/2019/03/cowork222.jpg"
                            ],
                        },
                        {
                            "IdPublication": 21,
                            "Title": "Salaaaaaaa",
                            "City": "Pocitos",
                            "Address": "Av Italia 6000",
                            "Capacity": 200,
                            "ImagesURL": [
                                "https://pyme.emol.com/wp-content/uploads/2019/03/cowork222.jpg",
                                "https://pyme.emol.com/wp-content/uploads/2019/03/cowork222.jpg"
                            ],
                        }
                    ],
                }
            ]
        };
        var finalRecommended = data.Recommended;
        const spaceTypes = this.state.spaceTypes;
        finalRecommended.forEach(element => {
            const spaceType = spaceTypes.filter(space => {
                return space.Code === element.SpaceType
            });
            element.SpaceTypeDesc = spaceType[0].Description;    
        });
        this.setState({ recommendedPublications: finalRecommended});
        //HARDCODED
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
        return (
            <React.Fragment>
                <h3>Publicaciones recomendadas!</h3>
                {this.state.recommendedPublications.map((relPubs) => {
                    return (
                        <React.Fragment>
                            <RelatedPublications relatedPublications={relPubs.Publications} 
                                redirectToPub={this.redirectToPub} title={relPubs.SpaceTypeDesc}/>
                        </React.Fragment>
                    );
                })}
            </React.Fragment>
        );
    }
}


export default RecommendedPublications;