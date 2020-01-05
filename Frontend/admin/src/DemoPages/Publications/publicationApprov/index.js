import React, { Fragment, Component } from 'react';

import {toast} from 'react-toastify';

// Extra

import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import PageTitle from '../../../Layout/AppMain/PageTitle';

import PublicationApprovTable from './publicationApprovTable';
import ModifyPublicationModal from '../modifyPublication';
import ApproveRejectPublicationModal from './approveRejectPublication';

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
        const admTokenObj = props.admTokenObj;
        const adminMail = props.adminData.Mail
        this.state = {
            publ: [],
            admTokenObj: admTokenObj,
            adminMail: adminMail,
            spaceTypes: [],
            facilities: []
        }
        this.modalElement = React.createRef(); // Connects the reference to the modal
        this.modalElementAppRej = React.createRef(); // Connects the reference to the modal
        this.approvePublication  = this.approvePublication.bind(this);
        this.rejectPublication = this.rejectPublication.bind(this);
        this.updateTable = this.updateTable.bind(this);
    }

    loadInfraestructure() {
        try {
            fetch('https://localhost:44372/api/facilities').then(response => response.json()).then(data => {
                if (data.responseCode == "SUCC_FACILITIESOK") {
                    this.setState({ facilities: data.facilities });
                    console.log(this.state.facilities)
                } else {
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

    
    changePubTransition ( newTransition, idPub ){
        try{
            console.log("changePubTransition")

            fetch('https://localhost:44372/api/publication', {
                method: 'PUT',
                header: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify({
                    AccessToken : this.props.admTokenObj.accesToken,
                    Mail: this.props.adminData.Mail,
                    IdPublication: idPub,
                    OldState: "NOT VALIDATED",
                    NewState: newTransition
                })
            }).then(response => response.json()).then(data => {
                console.log("data:" + JSON.stringify(data));
                if (data.responseCode == "SUCC_PUBLICATIONUPDATED") {
                    let text = "Solicitud ejecutada correctamente";
                    this.updateTable();
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
        }catch(error){
            console.log(error)
        }
    }
    // This function will try to approve an specific publication
    approvePublication (key) {
        var pubData = {
            id: key,
            type: "APPROVE"
        };
        this.modalElementAppRej.current.toggleAppRej(this.props.admTokenObj, this.props.adminData, pubData);        
    }

    rejectPublication (key) {
        var pubData = {
            id: key,
            type: "REJECT"
        };
        this.modalElementAppRej.current.toggleAppRej(this.props.admTokenObj, this.props.adminData, pubData);  
    }



    approveAllPublications = () => {
        const publPendAppNew = [];
        this.submitPublication(this.state.publToApprove.map(publicationObj =>{return publicationObj.Mail}), publPendAppNew, this.props.admTokenObj, this.state.adminMail);
    }

    // This function will trigger when the component is mounted, to fill the data from the state
    componentDidMount() {
        this.updateTable();
        this.loadInfraestructure()
    }

    updateTable(){

        fetch('https://localhost:44372/api/publicationPendingApproval', {
            method: 'POST',
            header: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify({
                "AccessToken": this.state.admTokenObj.accesToken,
                "AdminMail": this.state.adminMail,
                "PublicationsPerPage": 10                  
            })
        }).then(response => response.json()).then(data => {
            if (data.responseCode == "SUCC_PUBLICATIONSOK") {
                console.log(data.Publications);
                this.setState({ 'publ': data.Publications })
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
        const publData = this.state.publ.filter(publ => {
            return publ.IdPublication === key
        });

        this.modalElement.current.toggle(publData[0],this.state.admTokenObj,this.state.adminData, this.state.spaceTypes, this.state.facilities);
    }

    // This funciton will call the api to submit the publisher
    submitPublisher(publishersEmails, newArrIfSuccess, admTokenObj, adminMail) {        
        fetch('https://localhost:44372/api/publisher', {
            method: 'PUT',
            header: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify({
                Mails: publishersEmails,
                AccessToken : admTokenObj.accesToken,
                AdminMail : adminMail
            })
        }).then(response => response.json()).then(data => {
            console.log("data:" + JSON.stringify(data));
            if (data.responseCode == "SUCC_PUBLISHERSOK") {
                let text = "Solicitud ejecutada correctamente";
                this.setState({
                    publ: newArrIfSuccess,
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
                        <ModifyPublicationModal ref = {this.modalElement} updateTable={this.updateTable} disableFields = {true}/>
                        <ApproveRejectPublicationModal ref = {this.modalElementAppRej} updateTable={this.updateTable}/>
                        <Col lg="12">
                            <Card className="main-card mb-3">
                                <CardBody>
                                    <CardTitle>Pendientes de aprobación</CardTitle>
                                    <PublicationApprovTable publ={this.state.publ} rejectPublication={this.rejectPublication} approvePublication={this.approvePublication} spaceTypes={this.state.spaceTypes}/>
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
        admTokenObj: state.loginData.admTokenObj,
        adminData : state.loginData.adminData
    }
}

export default connect(mapStateToProps)(PublPendApprov)