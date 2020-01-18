import React from 'react';
import { Redirect } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import LoadingOverlay from 'react-loading-overlay';
// Multilanguage
import { withTranslate } from 'react-redux-multilingual'
import { compose } from 'redux';

import Header from "../../header/header";
import CreatePublication from './../createPublication/createPublicationMaster';
import MyPublicationTable from './myPublicationTable';
import ModalDetailPayment from './modalDetailPayment';
import { callAPI } from '../../../services/common/genericFunctions';
import { MAX_ELEMENTS_PER_TABLE } from '../../../services/common/constants'

class MyPublicationsList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loadingPubs: true,
            loadingSpaceTypes: true,
            pubId: null,
            publications: [],
            publicationsToDisplay: [],
            spaceTypes: [],
            generalError: false,
            objPaymentDetails: {},
            currentIDPlan: null,
            IdPlan: null,
            planPrice: null,
            pagination: [1],
            currentPage: 1
        }
        this.ModalDetailPayment = React.createRef(); // Connects the reference to the modal
    }

    componentDidMount() {
        window.scrollTo(0, 0);
        this.loadSpaceTypesMPL();
        this.loadMyPublications();
    }

    loadSpaceTypesMPL = () => {
        var objApi = {};
        objApi.objToSend = {}
        objApi.fetchUrl = "api/spaceTypes";
        objApi.method = "GET";
        objApi.successMSG = {
            SUCC_SPACETYPESOK: '',
        };
        objApi.functionAfterSuccess = "loadSpaceTypesMPL";
        objApi.errorMSG = {}
        callAPI(objApi, this);
    }

    loadMyPublications = () => {
        var objApi = {};
        objApi.objToSend = {
            "AccessToken": this.props.tokenObj.accesToken,
            "Mail": this.props.userData.Mail
        }
        objApi.fetchUrl = "api/publisherSpaces";
        objApi.method = "POST";
        objApi.successMSG = {
            SUCC_PUBLICATIONSOK: '',
        };
        objApi.functionAfterSuccess = "loadMyPublications";
        callAPI(objApi, this);
    }

    changePage = (pageClicked) => {
        this.setState({ publicationsToDisplay: this.filterPaginationArray(this.state.publications, (this.state.currentPage - 1) * MAX_ELEMENTS_PER_TABLE), currentPage: pageClicked },
            () => this.setState({ publicationsToDisplay: this.filterPaginationArray(this.state.publications, (this.state.currentPage - 1) * MAX_ELEMENTS_PER_TABLE), currentPage: pageClicked }))
    }

    filterPaginationArray = (arrayToFilter, startIndex) => {
        return arrayToFilter.slice(startIndex, startIndex + MAX_ELEMENTS_PER_TABLE)
    }

    editPublication = (pubId, currentIDPlan, IdPlan, planPrice) => {
        this.setState({ pubId, currentIDPlan, IdPlan, planPrice })
    }

    changePubStateMPL = (pubState, pubId) => {
        var message = ""; var nextState = "";
        if (pubState === "ACTIVE") {
            message = this.props.translate('myPublications_pausePubMsg');
            nextState = "PAUSED P";
        } else if (pubState === "PAUSED P") {
            message = this.props.translate('myPublications_resumePubMsg');
            nextState = "ACTIVE";
        }
        if (window.confirm(message)) {
            this.setState({ loadingPubs: !this.state.loadingPubs });

            var objApi = {};
            objApi.objToSend = {
                Mail: this.props.userData.Mail,
                RejectedReason: "",
                OldState: pubState,
                NewState: nextState,
                AccessToken: this.props.tokenObj.accesToken,
                IdPublication: pubId
            }
            objApi.fetchUrl = "api/publication";
            objApi.method = "PUT";
            objApi.successMSG = {
                SUCC_PUBLICATIONUPDATED: this.props.translate('SUCC_PUBLICATIONUPDATED'),
            };
            objApi.functionAfterSuccess = "changePubStateMPL";
            callAPI(objApi, this);
        }
    }

    confirmPayment = (objPaymentDetails) => {
        var objApi = {};
        objApi.objToSend = {
            "AccessToken": this.props.tokenObj.accesToken,
            "Mail": this.props.userData.Mail,
            "IdPublication": objPaymentDetails.IdPublication,
            "Comment": objPaymentDetails.paymentComment || "",
            "Evidence": {
                "Base64String": objPaymentDetails.archivesUpload ? objPaymentDetails.archivesUpload[0].Base64String : "",
                "Extension": objPaymentDetails.archivesUpload ? objPaymentDetails.archivesUpload[0].Extension : ""
            }
        }
        objApi.fetchUrl = "api/publicationPlan";
        objApi.method = "PUT";
        objApi.successMSG = {
            SUCC_PAYMENTUPDATED: this.props.translate('SUCC_PAYMENTUPDATED'),
        };
        objApi.functionAfterSuccess = "confirmPayment";
        callAPI(objApi, this);
    }

    triggerModalDetailPayment = (objPaymentDetails) => {
        this.ModalDetailPayment.current.toggle(objPaymentDetails);
    }

    render() {
        const { translate, userData, login_status } = this.props;
        if (login_status != 'LOGGED_IN') return <Redirect to='/' />
        if (this.state.generalError) return <Redirect to='/error' />
        if (userData.PublisherValidated != true) return <Redirect to='/' />

        var loadStatus = !this.state.loadingPubs && !this.state.loadingSpaceTypes ? false : true;
        return (
            <>
                {this.state.pubId == null ? (
                    <>
                        {/*SEO Support*/}
                        <Helmet>
                            <title>TeamUp | {translate('myPublications_header')} </title>
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
                                    <h1>{translate('myPublications_header')}</h1>
                                    <div className="col-md-12 center-column">
                                        <ModalDetailPayment ref={this.ModalDetailPayment} confirmPayment={this.confirmPayment} isPublisher={true} />
                                        {(!this.state.loadingPubs && !this.state.loadingSpaceTypes) ?
                                            (<MyPublicationTable changePubState={this.changePubStateMPL} editPublication={this.editPublication} triggerModalDetailPayment={this.triggerModalDetailPayment}
                                                publications={this.state.publicationsToDisplay} spaceTypes={this.state.spaceTypes} />)
                                            : (<p>{translate('loading_text_small')}</p>)
                                        }
                                        <br />
                                        <div className="row pagination-results">
                                            <div className="col-md-6 text-left">
                                                <ul className="pagination">
                                                    {this.state.pagination.map(page => {
                                                        return (
                                                            <li className={this.state.currentPage === page ? 'active' : ''} key={page}><a href="#pagination" onClick={() => this.changePage(page)}>{page}</a></li>
                                                        );
                                                    })}
                                                </ul>
                                            </div>
                                            <div className="col-md-6 text-right">{translate('showing_w')} {MAX_ELEMENTS_PER_TABLE * this.state.currentPage < this.state.publications.length ? MAX_ELEMENTS_PER_TABLE * this.state.currentPage : this.state.publications.length} {translate('publications_w')} {translate('of_w')} {this.state.publications.length}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </LoadingOverlay>
                    </>
                ) : (
                        <CreatePublication publicationID={this.state.pubId} currentIDPlan={this.state.currentIDPlan} IdPlan={this.state.IdPlan}
                            planPrice={this.state.planPrice} />
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
const enhance = compose(
    connect(mapStateToProps, null),
    withTranslate
)
export default enhance(MyPublicationsList);