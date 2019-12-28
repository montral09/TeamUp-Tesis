import React from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { logOut } from '../../services/login/actions';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Modal from 'react-bootstrap/Modal';
import {Button} from 'react-bootstrap';
// Multilanguage
import { withTranslate } from 'react-redux-multilingual'
import { compose } from 'redux';

const SignedInLinks = (props) =>{
    console.log("SignedInLinks - props");
    console.log(props);
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

    const requestBePublisher = () =>{
      fetch('https://localhost:44372/api/customer', {
          method: 'PUT',
          header: { 'Content-Type': 'application/json', 'Accept': 'application/json' },

          body: JSON.stringify({
              Mail: Mail,
              AccessToken : tokenObj.accesToken
          })
      }).then(response => response.json()).then(data => {
          console.log("data:" + JSON.stringify(data));
          if (data.responseCode == "SUCC_USRUPDATED") {
              toast.success('Solicitud enviada correctamente', {
                  position: "top-right",
                  autoClose: 5000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
              });
              setShow(false);
          } else{
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

const mapStateToProps = (state) => {
    return {
        userData: state.loginData.userData,
        tokenObj: state.loginData.tokenObj,
    }
}

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