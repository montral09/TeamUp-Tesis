import React, { Fragment, Component } from 'react';

import {toast} from 'react-toastify';

// Extra

import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import PageTitle from '../../../Layout/AppMain/PageTitle';

import PublisherApprovTable from './PublisherApprovTable';
import { connect } from 'react-redux';

// Table

import {
    Row, Col,
    Card, CardBody,
    CardTitle
} from 'reactstrap';

class AllPublishers extends Component {
    constructor(props) {
        super(props);
        console.log("AllPublishers - props:")
        console.log(props);
        const tokenObj = props.tokenObj;
        const adminMail = props.adminData.Mail
        this.state = {
            gestPendApr: [],
            tokenObj: tokenObj,
            adminMail : adminMail
        }
    }

    // This function will try to approve an specific publisher
    approvePublisher = (key) => {
        const gestToApprove = this.state.gestPendApr.filter(gest => {
            return gest.Mail === key
        });

        const gestPendAprNew = this.state.gestPendApr.filter(gest => {
            return gest.Mail !== key
        });

        this.submitPublisher([gestToApprove[0].Mail], gestPendAprNew, this.state.tokenObj, this.state.adminEmail);
    }

    approveAllPublishers = () => {
        const gestPendAprNew = [];
        this.submitPublisher(this.state.gestPendApr.map(publisherObj =>{return publisherObj.Mail}), gestPendAprNew, this.state.tokenObj, this.state.adminEmail);
    }

    // This function will trigger when the component is mounted, to fill the data from the state
    componentDidMount() {
        fetch('https://localhost:44372/api/publisher'
        ).then(response => response.json()).then(data => {
            if (data.responseCode == "SUCC_PUBLISHERSOK") {
                const sanitizedValues = data.voUsers.filter(voUsr =>{
                    return voUsr.PublisherValidated == false
                })
                this.setState({ 'gestPendApr': sanitizedValues })
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
    submitPublisher(publishersEmails, newArrIfSuccess, tokenObj, adminMail) {
        console.log ("entre al submit con mails y access token");
        console.log(publishersEmails);
        console.log(tokenObj);
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
                    gestPendApr: newArrIfSuccess,
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
                    heading="Gestores pendientes de aprobación"
                    subheading="En esta pantalla se mostrarán todos los gestores pendientes de aprobación"
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
                        <Col lg="12">
                            <Card className="main-card mb-3">
                                <CardBody>
                                    <CardTitle>Pendientes de aprobación</CardTitle>
                                    <PublisherApprovTable pubPendApp={this.state.gestPendApr} approvePublisher={this.approvePublisher} approveAllPublishers={this.approveAllPublishers} />
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


export default connect(mapStateToProps) (AllPublishers);