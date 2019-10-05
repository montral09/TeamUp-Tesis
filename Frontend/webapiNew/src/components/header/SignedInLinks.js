import React from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { logOut } from '../../services/login/actions';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Modal from 'react-bootstrap/Modal';
import {Button} from 'react-bootstrap';

const SignedInLinks = (props) =>{
    const { CheckPublisher, Mail } = props.userData;
    const { tokenObj } = props;
    const [show, setShow] = React.useState(false);
    console.log("SignedInLinks - props");
    console.log(props);
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

    let bePublisherLink = !CheckPublisher ? (
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
            <Button variant="primary" onClick={requestBePublisher}>
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
        tokenObj: state.loginData.tokenObj,
    }
}

const mapDispatchToProps = (dispatch) =>{
    return {
        logOut: () => dispatch(logOut())
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(SignedInLinks);