import React from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { logOut } from '../../services/login/actions';

import Modal from 'react-bootstrap/Modal';
import {Button} from 'react-bootstrap';

const SignedInLinks = (props) =>{
    let harcodedIsPublisher = true;
    const [show, setShow] = React.useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    let bePublisherLink = harcodedIsPublisher ? (
        <>
        <li><a onClick = { () => (handleShow())}>Quiero publicar</a></li>
  
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Quiero publicar</Modal.Title>
          </Modal.Header>
          <Modal.Body>Si quieres ser uno de nuestros colaboradores, pudiendo realizar publicaciones en el sito, haz click en el boton 'Quiero!'. Se enviara una solicitud y uno de nuestros representantes se comunicara contigo a la brevedad.</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Me lo pierdo
            </Button>
            <Button variant="primary" onClick={handleClose}>
              Quiero!
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    ) : (null);

    return(

        <React.Fragment>
            <li className="">
                <a href="#my-account" title="My Account" data-hover="dropdown" className="dropdown-toggle" data-toggle="dropdown">Mi Cuenta <b className="caret"></b></a>
                <ul className="dropdown-menu dropdown-menu-right">
                    <li><NavLink to="/account/modify">Modificar Datos</NavLink></li>
                    <li><a onClick = { () => (props.logOut())}>Log out</a></li>
                </ul>
            </li>
            {bePublisherLink}
        </React.Fragment>
    )
}

const mapStateToProps = (state) => {
    return {
        userData: state.loginData.userData,
    }
}

const mapDispatchToProps = (dispatch) =>{
    return {
        logOut: () => dispatch(logOut())
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(SignedInLinks);