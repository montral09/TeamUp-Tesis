import React, { Fragment, Component } from 'react';

import {toast} from 'react-toastify';

// Extra

import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import PageTitle from '../../../Layout/AppMain/PageTitle';

import PublicationApprovTable from './publicationApprovTable';
import ModifyPublicationModal from './modifyPublication';

import { connect } from 'react-redux';

// Table

import {
    Row, Col,
    Card, CardBody,
    CardTitle
} from 'reactstrap';

class PublPendApprov extends Component {
    constructor(props) {
        super(props);
        console.log("PublPendApprov - props:")
        console.log(props);
        const tokenObj = props.tokenObj;
        const adminMail = props.adminData.Mail
        this.state = {
            publPendApp: [],
            tokenObj: tokenObj,
            adminMail: adminMail,
            spaceTypes: []
        }
        this.modalElement = React.createRef(); // esto hace unas magias para cambiar el estado de un componente hijo
        this.approvePublication  = this.approvePublication .bind(this);
    }
    loadSpaceTypes() {
        try {

            // call API
            var dummyData = {
                spaceTypes: [
                    {
                        "Code": 1,
                        "Description": "Oficinas y despachos"
                    },
                    {
                        "Code": 2,
                        "Description": "Coworking"
                    },
                    {
                        "Code": 3,
                        "Description": "Sala de reuniones"
                    },
                    {
                        "Code": 4,
                        "Description": "Espacios para eventos"
                    }
                ]
            };
            this.setState({ spaceTypes: dummyData.spaceTypes });

        } catch (error) {
            toast.error('Internal error', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        }
    }
    // This function will try to approve an specific publisher
    approvePublication = (key) => {
        alert("approvePublication");
    }

    approveAllPublications = () => {
        const publPendAppNew = [];
        this.submitPublication(this.state.publToApprove.map(publicationObj =>{return publicationObj.Mail}), publPendAppNew, this.state.tokenObj, this.state.adminMail);
    }

    // This function will trigger when the component is mounted, to fill the data from the state
    componentDidMount() {
        this.updateTable();
    }

    updateTable(){

        fetch('https://localhost:44372/api/publicationPendingApproval', {
            method: 'POST',
            header: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify({
                "AccessToken": this.props.tokenObj.accesToken,
                "AdminMail": this.props.adminData.Mail                   
            })
        }).then(response => response.json()).then(data => {
            if (data.responseCode == "SUCC_PUBLICATIONSOK") {
                console.log(data.Publications);
                this.setState({ 'publPendApp': data.Publications })
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

    // This function will trigger the save function inside the modal to update the values
    editPublication = (key) => {
        const publData = this.state.publPendApp.filter(publ => {
            return publ.IdPublication === key
        });

        this.modalElement.current.toggle(publData[0],this.state.tokenObj,this.state.adminData, this.state.spaceTypes);
    }

    // This funciton will call the api to submit the publisher
    submitPublisher(publishersEmails, newArrIfSuccess, tokenObj, adminMail) {
        console.log("FAbi1" + adminMail)
        fetch('https://localhost:44372/api/publisher', {
            method: 'PUT',
            header: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify({
                Mails: publishersEmails,
                AccessToken : tokenObj.accesToken,
                AdminMail : adminMail
            })
        }).then(response => response.json()).then(data => {
            console.log("data:" + JSON.stringify(data));
            if (data.responseCode == "SUCC_PUBLISHERSOK") {
                let text = "Solicitud ejecutada correctamente";
                this.setState({
                    publPendApp: newArrIfSuccess,
                });
                toast.success(text, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
                //this.props.history.push('/publishers/pendienteaprobacion')
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
                    heading="Publicaciones pendientes de aprobación"
                    subheading="En esta pantalla se mostrarán todas las publicaciones pendientes de aprobación"
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
                        <ModifyPublicationModal ref = {this.modalElement} updateTable={this.updateTable}/>
                        <Col lg="12">
                            <Card className="main-card mb-3">
                                <CardBody>
                                    <CardTitle>Pendientes de aprobación</CardTitle>
                                    <PublicationApprovTable publPendApp={this.state.publPendApp} approvePublication={this.approvePublication} editPublication={this.editPublication} spaceTypes={this.state.spaceTypes} />
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
        tokenObj: state.loginData.tokenObj,
        adminData : state.loginData.adminData
    }
}

export default connect(mapStateToProps)(PublPendApprov)