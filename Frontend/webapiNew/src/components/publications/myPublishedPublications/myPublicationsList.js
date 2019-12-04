import React, {Suspense} from 'react';
import Header from "../../header/header";
import { Link, Redirect } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { connect } from 'react-redux';
import CreatePublication from './../createPublication/createPublicationMaster';
import MyPublicationTable from './myPublicationTable';
import LoadingOverlay from 'react-loading-overlay';

class MyPublicationsList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loadingPubs : true,
            loadingSpaceTypes : true,
            pubId : null,
            publications : [],
            spaceTypes : [],
            generalError : false
        }
        this.loadMyPublications = this.loadMyPublications.bind(this);
        this.editPublication = this.editPublication.bind(this);
        this.changePubState = this.changePubState.bind(this);
    }
    handleErrors(error) {
        this.setState({ generalError: true });
    }
    componentDidMount() {
        window.scrollTo(0, 0);
        this.loadSpaceTypes();
        this.loadMyPublications();
    }

    loadSpaceTypes() {
        try {
            fetch('https://localhost:44372/api/spaceTypes'
            ).then(response => response.json()).then(data => {
                if (data.responseCode == "SUCC_SPACETYPESOK") {
                    this.setState({ spaceTypes: data.spaceTypes, loadingSpaceTypes: false })
                } else {
                    toast.error('Hubo un error', {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                    });
                }
            }
            ).catch(error => {
                toast.error('Internal error', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
                console.log(error);
            }
            )
        } catch (error) {
            toast.error('Internal error', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        }
    }

    loadMyPublications(){
        try {
            fetch('https://localhost:44372/api/publisherSpaces', {
                method: 'POST',
                header: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify({
                    "AccessToken": this.props.tokenObj.accesToken,
                    "Mail": this.props.userData.Mail                   
                })
            }).then(response => response.json()).then(data => {
                if (data.responseCode == "SUCC_PUBLICATIONSOK") {
                    this.setState({ publications: data.Publications, loadingPubs: false })
                } else {
                    toast.error('Hubo un error', {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                    });
                }
            }
            ).catch(error => {
                toast.error('Internal error', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
                console.log(error);
            }
        )
        }catch(error){
            toast.error('Internal error', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            console.log(error);
        }
    }

    editPublication(pubId){
        this.setState({ pubId: pubId })
    }

    changePubState(pubState, pubId){
        var message = "";var nextState = "";
        if(pubState == "ACTIVE"){
            message = "Desea pausar la publicacion?";
            nextState = "PAUSED P";
        }else if(pubState == "PAUSED P"){
            message = "Desea reanudar la publicacion?";
            nextState = "ACTIVE";
        }
        if(window.confirm(message)){
            this.setState({loadingPubs: !this.state.loadingPubs});
            let objPub = {
                Mail: this.props.userData.Mail,
                RejectedReason : "",
                OldState: pubState,
                NewState: nextState,
                AccessToken: this.props.tokenObj.accesToken,
                IdPublication: pubId
            } 
            fetch('https://localhost:44372/api/publication', {
                method: 'PUT',
                header: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify(objPub)
            }).then(response => response.json()).then(data => {
                if (data.responseCode == "SUCC_PUBLICATIONUPDATED") {
                    toast.success('Publicacion actualizada correctamente ', {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                    });
                } else{
                    this.handleErrors('Hubo un error');
                    this.setState({loadingPubs: !this.state.loadingPubs});
                }
            }
            ).catch(error => {
                this.handleErrors(error);
                this.setState({loadingPubs: !this.state.loadingPubs});
            }
            )
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
                    <title>TeamUp | Mis Publicaciones</title>
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
                            <h1>Mis publicaciones</h1>
                            <div className="col-md-12 center-column">
                                {(!this.state.loadingPubs && !this.state.loadingSpaceTypes) ?
                                (<MyPublicationTable changePubState={this.changePubState} editPublication={this.editPublication}  publications={this.state.publications} spaceTypes={this.state.spaceTypes} />)
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

export default connect(mapStateToProps)(MyPublicationsList);