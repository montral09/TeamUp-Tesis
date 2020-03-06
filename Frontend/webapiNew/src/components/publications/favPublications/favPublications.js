import React from 'react';
import { Redirect } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import LoadingOverlay from 'react-loading-overlay';
import { withTranslate } from 'react-redux-multilingual'
import { compose } from 'redux';
import CreatePublication from './../createPublication/createPublicationMaster';
import FavPublicationsTable from './favPublicationsTable';
import Header from "../../header/header";
import Footer from "../../footer/footer";
import { callAPI } from '../../../services/common/genericFunctions';

class FavPublications extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loadingPubs: true,
            loadingSpaceTypes: true,
            pubId: null,
            publications: [],
            spaceTypes: [],
            generalError: false,
            objPaymentDetails: {}
        }
    }

    componentDidMount() {
        window.scrollTo(0, 0);
        this.loadSpaceTypesFP();
        this.loadMyFavoritePublications();
    }

    // This function will call the API
    loadSpaceTypesFP = () => {
        var objApi = {};
        objApi.objToSend = {}
        objApi.fetchUrl = "api/spaceTypes";
        objApi.method = "GET";
        objApi.successMSG = {
            SUCC_SPACETYPESOK: '',
        };
        objApi.functionAfterSuccess = "loadSpaceTypesFP";
        objApi.errorMSG = {}
        callAPI(objApi, this);
    }
    
    // This function will call the API
    loadMyFavoritePublications = () => {
        var objApi = {};
        objApi.objToSend = {
            "AccessToken": this.props.tokenObj.accesToken,
            "Mail": this.props.userData.Mail
        }
        objApi.fetchUrl = "api/favorite";
        objApi.method = "PUT";
        objApi.successMSG = {
            SUCC_FAVORITESOK: '',
        };
        objApi.functionAfterSuccess = "loadMyFavoritePublications";
        objApi.errorMSG = {}
        objApi.logOut = this.props.logOut;
        callAPI(objApi, this);
    }

    render() {
        const { translate, login_status } = this.props;
        if (login_status != 'LOGGED_IN') return <Redirect to='/' />
        if (this.state.generalError) return <Redirect to='/error' />
        var loadStatus = !this.state.loadingPubs && !this.state.loadingSpaceTypes ? false : true;

        return (
            <>
                {this.state.pubId == null ? (
                    <>
                        {/*SEO Support*/}
                        <Helmet>
                            <title>TeamUp | {translate('favPublications_head')}</title>
                            <meta name="description" content="---" />
                        </Helmet>
                        {/*SEO Support End */}
                        <LoadingOverlay
                            active={loadStatus}
                            spinner
                            text={translate('loading_text_small')}
                        >
                            <Header />
                            <div className="main-content  full-width  home" style={{ minHeight: "50vh" }}>
                                <div className="pattern" >
                                    <h1>{translate('favPublications_head')}</h1>
                                    <div className="col-md-12 center-column">
                                        {(!this.state.loadingPubs && !this.state.loadingSpaceTypes) ?
                                            (<FavPublicationsTable publications={this.state.publications} spaceTypes={this.state.spaceTypes} />)
                                            : (<p>{translate('loading_text_small')}</p>)
                                        }
                                    </div>
                                </div>
                            </div>
                            <br />
                            <Footer />
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
const enhance = compose(
    connect(mapStateToProps, null),
    withTranslate
)
export default enhance(FavPublications);