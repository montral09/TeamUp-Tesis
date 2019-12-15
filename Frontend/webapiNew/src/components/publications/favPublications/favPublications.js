import React, {Suspense} from 'react';
import Header from "../../header/header";
import { Link, Redirect } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { connect } from 'react-redux';
import CreatePublication from './../createPublication/createPublicationMaster';
import FavPublicationsTable from './favPublicationsTable';
import LoadingOverlay from 'react-loading-overlay';

class FavPublications extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loadingPubs : true,
            loadingSpaceTypes : true,
            pubId : null,
            publications : [],
            spaceTypes : [],
            generalError : false,
            objPaymentDetails : {}
        }
        this.loadMyFavoritePublications = this.loadMyFavoritePublications.bind(this);
    }

    handleErrors(error) {
        this.setState({ generalError: true });
    }

    componentDidMount() {
        window.scrollTo(0, 0);
        this.loadSpaceTypes();
        this.loadMyFavoritePublications();
    }

    loadSpaceTypes(){
        var objApi = {};
        objApi.objToSend = {}
        objApi.fetchUrl = "https://localhost:44372/api/spaceTypes";
        objApi.method = "GET";
        objApi.responseSuccess = "SUCC_SPACETYPESOK";
        objApi.successMessage = "";
        objApi.functionAfterSuccess = "loadSpaceTypes";
        this.callAPI(objApi);
    }

    loadMyFavoritePublications(){
        var objApi = {};
        objApi.objToSend = {
            "AccessToken": this.props.tokenObj.accesToken,
            "Mail": this.props.userData.Mail
        }
        objApi.fetchUrl = "https://localhost:44372/api/favorite";
        objApi.method = "PUT";
        objApi.responseSuccess = "SUCC_FAVORITESOK";
        objApi.successMessage = "";
        objApi.functionAfterSuccess = "loadMyFavoritePublications";
        
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

    callFunctionAfterApiSuccess(trigger, data){
        switch(trigger){
            case "loadMyFavoritePublications"   : this.setState({ publications: data.Publications, loadingPubs: false });   break;
            case "loadSpaceTypes"               : this.setState({ spaceTypes: data.spaceTypes, loadingSpaceTypes: false }); break;
        }
    }


    render() {
        if (this.props.login_status != 'LOGGED_IN') return <Redirect to='/' />
        if (this.state.generalError) return <Redirect to='/error' />
        var loadStatus = !this.state.loadingPubs && !this.state.loadingSpaceTypes ? false : true;
        return (
            <>
            {this.state.pubId == null ? (
                <>
                {/*SEO Support*/}
                <Helmet>
                    <title>TeamUp | Mis Publicaciones favoritas</title>
                    <meta name="description" content="---" />
                </Helmet>
                {/*SEO Support End */}
                <LoadingOverlay
                    active={loadStatus}
                    spinner
                    text='Cargando...'
                >
                    <Header />
                    <div className="main-content  full-width  home">
                        <div className="pattern" >
                            <h1>Mis publicaciones favoritas</h1>
                            <div className="col-md-12 center-column">
                                {(!this.state.loadingPubs && !this.state.loadingSpaceTypes) ?
                                (<FavPublicationsTable publications={this.state.publications} spaceTypes={this.state.spaceTypes} />)
                                : ( <p>LOADING</p>)
                                }
                            </div>
                        </div>
                    </div>
                </LoadingOverlay>
                </>
            ) : (
                <CreatePublication publicationID={this.state.pubId} />
            )}
                
            </>
        );
    }
}
const mapStateToProps = (state) => {
    return {
        login_status: state.loginData.login_status,
        tokenObj: state.loginData.tokenObj,
        userData: state.loginData.userData,
    }
}

export default connect(mapStateToProps)(FavPublications);