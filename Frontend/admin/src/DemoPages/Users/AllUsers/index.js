import React, { Fragment, Component } from 'react';

import {toast} from 'react-toastify';

// Extra

import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import PageTitle from '../../../Layout/AppMain/PageTitle';

import AllUsersTable from './AllUsersTable';

import ModifyUserModal from './ModifyUser';

// Table

import {
    Row, Col,
    Card, CardBody,
    CardTitle
} from 'reactstrap';

class AllUsers extends Component {
    constructor(props) {
        super(props);
        this.state = {
            arrData: []
        }
        this.modalElement = React.createRef(); // esto hace unas magias para cambiar el estado de un componente hijo
    }
    
    // This function will try to approve an specific publisher
    editUser = (key) => {

        const userData = this.state.arrData.filter(usr => {
            return usr.Mail === key
        });

        this.modalElement.current.toggle(userData[0]);
/*
        const arrDataNew = this.state.arrData.filter(gest => {
            return gest.Mail !== key
        });

        this.submitPublisher([gestToApprove[0].Mail], arrDataNew);*/
    }


    // This function will trigger when the component is mounted, to fill the data from the state
    componentDidMount() {
        fetch('https://localhost:44372/api/customer'
        ).then(response => response.json()).then(data => {
            if (data.responseCode == "SUCC_CUSTOMERSOK") {
                this.setState({
                    ...this.state,
                    arrData : data.voCustomers })
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
    }

    // This funciton will call the api to submit the publisher
    submitPublisher(usersEmails, newArrIfSuccess) {
        fetch('https://localhost:44372/api/customer', {
            method: 'PUT',
            header: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify({
                Mails: usersEmails
            })
        }).then(response => response.json()).then(data => {
            console.log("data:" + JSON.stringify(data));
            if (data.responseCode == "SUCC_PUBLISHERSOK") {
                let text = "Solicitud ejecutada correctamente";
                this.setState({
                    arrData: newArrIfSuccess,
                });
                toast.success(text, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
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
    }

    render() {

        return (
            <Fragment>
                <PageTitle
                    heading="Tabla con todos los usuarios del sistema"
                    subheading="En esta pantalla se mostrarán todos los usuarios registrados"
                    icon="pe-7s-drawer icon-gradient bg-happy-itmeo"
                />
                <ReactCSSTransitionGroup
                    component="div"
                    transitionName="TabsAnimation"
                    transitionAppear={true}
                    transitionAppearTimeout={0}
                    transitionEnter={false}
                    transitionLeave={false}>
                    <Row>
                        <ModifyUserModal ref = {this.modalElement} />
                        <Col lg="12">
                            <Card className="main-card mb-3">
                                <CardBody>
                                    <CardTitle>Tabla de usuarios</CardTitle>
                                    <AllUsersTable arrData={this.state.arrData} editUser={this.editUser} />
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </ReactCSSTransitionGroup>
            </Fragment>
        );
    }
}

export default AllUsers;