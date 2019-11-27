import React, {Suspense} from 'react';
import Header from "../../header/header";
import { Redirect } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { connect } from 'react-redux';
import MyReservedSpacesTable from './myReservedSpacesTable';
import ModifyReservationModal from './modifyReservationModal';
import ModalReqInfo from '../../publications/viewPublication/modalReqInfo';


class MyReservedSpacesList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loadingReservations : true,
            reservationId : null,
            reservations : []
        }
        this.modalElement = React.createRef();
        this.cancelModal = React.createRef();
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

    editReservation = (key) => {
        console.log ('edit reservation');
        console.log (key);
        const resData = this.state.reservations.filter(res => {
            return res.IdReservation === key
        });
        console.log(resData);
        this.modalElement.current.toggle(resData[0], this.props.tokenObj, this.props.userData);
    }

    render() {        
        const { login_status } = this.props;
        if (login_status != 'LOGGED_IN') return <Redirect to='/' />
        return (
            <>
                <>
                {/*SEO Support*/}
                <Helmet>
                    <title>TeamUp | Mis Reservas</title>
                    <meta name="description" content="---" />
                </Helmet>
                {/*SEO Support End */}
                <Header />
                <div className="main-content  full-width  home">
                    <div className="pattern" >
                        <div className="col-md-12 center-column">
                        <ModifyReservationModal ref = {this.modalElement}/>
                        <ModalReqInfo ref={this.cancelModal} modalSave={this.modalSave}
                                modalConfigObj={{
                                    title: 'Cancelar reserva', mainText: 'Desea cancelar la reserva? Por favor indique el motivo: ', 
                                    textboxDisplay: true, cancelAvailable: true, confirmAvailable: true, cancelText : 'No', confirmText : 'Si' 
                                }} />
                        <MyReservedSpacesTable editReservation={this.editReservation} reservations={this.state.reservations} cancelModal={this.cancelModal.current}/>
                        </div>
                    </div>
                </div>
                </>
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

export default connect(mapStateToProps)(MyReservedSpacesList);