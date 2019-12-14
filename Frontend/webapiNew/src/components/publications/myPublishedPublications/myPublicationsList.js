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
import ModalDetailPayment from './modalDetailPayment';

class MyPublicationsList extends React.Component {

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
        this.loadMyPublications = this.loadMyPublications.bind(this);
        this.editPublication = this.editPublication.bind(this);
        this.changePubState = this.changePubState.bind(this);
        this.confirmPayment = this.confirmPayment.bind(this);
        this.ModalDetailPayment    = React.createRef(); // Connects the reference to the modal
        this.triggerModalDetailPayment = this.triggerModalDetailPayment.bind(this);
    }

    handleErrors(error) {
        this.setState({ generalError: true });
    }

    componentDidMount() {
        window.scrollTo(0, 0);
        this.loadSpaceTypes();
        this.loadMyPublications();
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

    loadMyPublications(){
        var objApi = {};
        objApi.objToSend = {
            "AccessToken": this.props.tokenObj.accesToken,
            "Mail": this.props.userData.Mail
        }
        objApi.fetchUrl = "https://localhost:44372/api/publisherSpaces";
        objApi.method = "POST";
        objApi.responseSuccess = "SUCC_PUBLICATIONSOK";
        objApi.successMessage = "";
        objApi.functionAfterSuccess = "loadMyPublications";
        this.callAPI(objApi);
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
            var objApi = {};
            objApi.objToSend = {
                Mail: this.props.userData.Mail,
                RejectedReason : "",
                OldState: pubState,
                NewState: nextState,
                AccessToken: this.props.tokenObj.accesToken,
                IdPublication: pubId
            };
            objApi.fetchUrl = "https://localhost:44372/api/publication";
            objApi.method = "PUT";
            objApi.responseSuccess = "SUCC_PUBLICATIONUPDATED";
            objApi.successMessage = "Publicacion actualizada correctamente";
            objApi.functionAfterSuccess = "changePubState";
            this.callAPI(objApi);
        }
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
            case "loadMyPublications"   : this.setState({ publications: data.Publications, loadingPubs: false });   break;
            case "loadSpaceTypes"       : this.setState({ spaceTypes: data.spaceTypes, loadingSpaceTypes: false }); break;
            case "confirmPayment"       : this.ModalDetailPayment.current.changeModalLoadingState(true); break;
        }
    }

    confirmPayment(objPaymentDetails){
        var objApi = {};
        objApi.objToSend = {
            "AccessToken": this.props.tokenObj.accesToken,
            "Mail": this.props.userData.Mail,
            "IdPublication" : objPaymentDetails.IdPublication,
            "Comment" : objPaymentDetails.paymentComment || "",
            "Evidence" : {
                "Base64String" : objPaymentDetails.archivesUpload ? objPaymentDetails.archivesUpload[0].Base64String : "",
                "Extension" :  objPaymentDetails.archivesUpload ? objPaymentDetails.archivesUpload[0].Extension : ""
            }
        }
        console.log("confirmPayment: objToSend")
        console.log(objApi.objToSend)
        objApi.fetchUrl = "https://localhost:44372/api/publicationPlan";
        objApi.method = "PUT";
        objApi.responseSuccess = "SUCC_PAYMENTUPDATED";
        objApi.successMessage = "Se ha confirmado el envío de pago";
        objApi.functionAfterSuccess = "confirmPayment";
        this.callAPI(objApi);
    }

    triggerModalDetailPayment(objPaymentDetails){
        this.ModalDetailPayment.current.toggle(objPaymentDetails);
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
                                <ModalDetailPayment ref={this.ModalDetailPayment} confirmPayment={this.confirmPayment} isPublisher={true}/>
                                {(!this.state.loadingPubs && !this.state.loadingSpaceTypes) ?
                                (<MyPublicationTable changePubState={this.changePubState} editPublication={this.editPublication} triggerModalDetailPayment={this.triggerModalDetailPayment}
                                    publications={this.state.publications} spaceTypes={this.state.spaceTypes} />)
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