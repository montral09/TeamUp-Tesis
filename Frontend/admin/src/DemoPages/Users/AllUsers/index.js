import React, { Fragment, Component } from 'react';

import {toast} from 'react-toastify';

// Extra

import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import PageTitle from '../../../Layout/AppMain/PageTitle';

import AllUsersTable from './AllUsersTable';

import ModifyUserModal from './ModifyUser';

import { connect } from 'react-redux';
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
            arrData: [],
            tokenObj: this.props.tokenObj,
            adminData: this.props.adminData
        }
        this.modalElement = React.createRef(); // esto hace unas magias para cambiar el estado de un componente hijo
    }
    
    // This function will trigger the save function inside the modal to update the values
    editUser = (key) => {
        console.log("arr data: ");
        console.log(this.state.arrData);
        const userData = this.state.arrData.filter(usr => {
            return usr.Mail === key
        });

        //this.modalElement.current.save(userData[0]);
        console.log("this.modalElement ");
        console.log(this.modalElement);

        this.modalElement.current.toggle(userData[0],this.state.tokenObj,this.state.adminData);
    }


    // This function will trigger when the component is mounted, to fill the data from the state
    componentDidMount() {
        console.log("component did mount state");
        console.log(this.state)
        fetch('https://localhost:44372/api/users', {
            method: 'POST',
            header: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: {
                Mail: this.state.adminData.Mail,
                AccessToken: this.state.tokenObj.AccessToken
            }
        }).then(response => response.json()).then(data => {
            if (data.responseCode == "SUCC_USERSOK") {
                this.setState({
                    ...this.state,
                    arrData : data.voUsers })
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
const mapStateToProps = (state) => {
    return {
        login_status: state.loginData.login_status,
        adminData: state.loginData.adminData,
        tokenObj: state.loginData.tokenObj,
    }
}

export default connect(mapStateToProps,null)(AllUsers);
