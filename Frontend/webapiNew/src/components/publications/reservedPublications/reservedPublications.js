import React, {Suspense} from 'react';
import Header from "../../header/header";
import { Redirect } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { connect } from 'react-redux';
import MyReservedSpacesTable from '../../reservations/myReservedSpaces/myReservedSpacesTable'
import LoadingOverlay from 'react-loading-overlay';
import ModalReqInfo from '../viewPublication/modalReqInfo';


class MyReservedPublications extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loadingReservations : true,
            reservationId : null,
            reservations : [],
            loadingStatusChange : false
        }
        this.cancelModal = React.createRef(); // Connects the reference to the modal
        this.loadMyReservations = this.loadMyReservations.bind(this);      
    }

    componentDidMount() {
        window.scrollTo(0, 0);
        this.loadMyReservations();
    }

    loadMyReservations(){
        try {
            fetch('https://localhost:44372/api/reservationPublisher', {
                method: 'POST',
                header: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify({
                    "AccessToken": this.props.tokenObj.accesToken,
                    "Mail": this.props.userData.Mail                   
                })
            }).then(response => response.json()).then(data => {
                if (data.responseCode == "SUCC_RESERVATIONSOK") {
                    this.setState({ reservations: data.Reservations, loadingReservations: false })
                } else {
                    toast.error('Hubo un error '+data.responseCode, {
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
    modalSave(){
        this.cancelModal.current.changeModalLoadingState(true);
    }
    render() {        
        if (this.props.login_status != 'LOGGED_IN') return <Redirect to='/' />
        return (
        <>
            {/*SEO Support*/}
            <Helmet>
                <title>TeamUp | Publicacines reservadas</title>
                <meta name="description" content="---" />
            </Helmet>
            {/*SEO Support End */}
            <LoadingOverlay
                active={this.state.loadingReservations || this.state.loadingStatusChange ? true : false}
                spinner
                text='Cargando...'
            >     
                <Header />
                <div className="main-content  full-width  home">
                    <div className="pattern" >
                        <div className="col-md-12 center-column">
                            <ModalReqInfo ref={this.cancelModal} modalSave={this.modalSave}
                                modalConfigObj={{
                                    title: 'Cancelar reserva', mainText: 'Desea cancelar la reserva? Por favor indique el motivo: ', 
                                    textboxDisplay: true, cancelAvailable: true, confirmAvailable: true, cancelText : 'No', confirmText : 'Si' 
                                }} />
                            <MyReservedSpacesTable isPublisher={true} editReservation={this.editReservation} 
                                reservations={this.state.reservations} cancelModal={this.cancelModal.current}/>
                        </div>
                    </div>
                </div>               
            </LoadingOverlay >
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

export default connect(mapStateToProps)(MyReservedPublications);