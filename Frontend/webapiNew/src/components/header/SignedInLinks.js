import React from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { logOut } from '../../services/login/actions';
import Modal from 'react-bootstrap/Modal';
import {Button} from 'react-bootstrap';
// Multilanguage
import { withTranslate } from 'react-redux-multilingual'
import { compose } from 'redux';
import { callAPI } from '../../services/common/genericFunctions';

const SignedInLinks = (props) =>{
    var PublisherValidated = false;
    var Mail = false;
    var tokenObj = false;
    if(props.userData){
        var { PublisherValidated, Mail } = props.userData;
        var { tokenObj } = props;
    }

    const [show, setShow] = React.useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    // This function will call the API
    const requestBePublisher = () =>{
        var objApi = {};
        objApi.objToSend = {
            Mail: Mail,
            AccessToken : tokenObj.accesToken
        }
        objApi.fetchUrl = "api/customer";
        objApi.method = "PUT";
        objApi.successMSG = {
            SUCC_USRUPDATED : this.props.translate('SUCC_USRUPDATED3'),
        };
        objApi.functionAfterSuccess = "requestBePublisher";
        objApi.functionAfterError = "requestBePublisher";
        objApi.errorMSG= {}
        callAPI(objApi, this);
      
    }
    const { translate } = props;
    return(

        <React.Fragment>
            {!PublisherValidated ? (
            <>
                <li><a onClick = { () => (handleShow())}>{translate('singInLinks_wantToPublish')}</a></li>
        
                <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{translate('singInLinks_wantToPublish')}</Modal.Title>
                </Modal.Header>
                <Modal.Body>{translate('singInLinks_wantToPublishBody')}</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                    {translate('singInLinks_notwantToPublishBody')}
                    </Button>
                    <Button variant="primary" onClick={requestBePublisher}>
                    {translate('singInLinks_wantToPublishButton')}
                    </Button>
                </Modal.Footer>
                </Modal>

            </>
            ) : (                
            <li className="">
                <a href="#publications" title="Publicaciones" data-hover="dropdown" className="dropdown-toggle" data-toggle="dropdown">{translate('singInLinks_head_publications')} <b className="caret"></b></a>
                <ul className="dropdown-menu dropdown-menu-right">
                    <li><NavLink to="/publications/createPublication/createPublicationMaster">{translate('singInLinks_head_createPublication')}</NavLink></li>
                    <li><NavLink to="/publications/myPublishedPublications/myPublicationsList">{translate('singInLinks_head_myPublications')}</NavLink></li>     
                    <li><NavLink to="/publications/reservedPublications/reservedPublications">{translate('singInLinks_head_myResSpaces')}</NavLink></li>
                </ul>
            </li>)}
            <li><NavLink to="/reservations/myReservedSpaces/myReservedSpacesList">{translate('singInLinks_head_myReservations')}</NavLink></li>   
            <li><NavLink to="/publications/favPublications">{translate('singInLinks_head_favorites')}</NavLink></li>
            <li><NavLink to="/messages">{translate('myMessages_title')}</NavLink></li>
            <li className="">
                <a href="#my-account" title="My Account" data-hover="dropdown" className="dropdown-toggle" data-toggle="dropdown">{translate('singInLinks_head_myAccount')}<b className="caret"></b></a>
                <ul className="dropdown-menu dropdown-menu-right">
                    <li><NavLink to="/account/modify">{translate('singInLinks_head_updateUserData')}</NavLink></li>
                    <li><NavLink to="/account/deleteUser">{translate('singInLinks_head_deleteUser')}</NavLink></li>
                    <li><a onClick = { () => (props.logOut())}>Log out</a></li>
                </ul>
            </li>
        </React.Fragment>
    )
}

// Mapping the current state to props, to retrieve useful information from the state
const mapStateToProps = (state) => {
    return {
        userData: state.loginData.userData,
        tokenObj: state.loginData.tokenObj,
    }
}

// Mapping the dispatch elements to prop, to trigger some of the redux functions
const mapDispatchToProps = (dispatch) =>{
    return {
        logOut: () => dispatch(logOut())
    }
}
const enhance = compose(
    connect(mapStateToProps,mapDispatchToProps),
    withTranslate
)
export default enhance(SignedInLinks);