import React, { Fragment, Component } from 'react';

// Extra

import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import PageTitle from '../../../Layout/AppMain/PageTitle';

import PublisherApprovTable from './PublisherApprovTable';
import { connect } from 'react-redux';
import { callAPI } from '../../../config/genericFunctions'

// Table

import {
    Row, Col,
    Card, CardBody,
    CardTitle
} from 'reactstrap';

class PendienteAprobacion extends Component {
    constructor(props) {
        super(props);
        console.log("AllPublishers - props:")
        console.log(props);
        const admTokenObj = props.admTokenObj;
        const adminMail = props.adminData.Mail
        this.state = {
            gestPendApr: [],
            admTokenObj: admTokenObj,
            adminMail: adminMail,
            isLoading : true
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

        this.submitPublisher([gestToApprove[0].Mail], gestPendAprNew, this.state.admTokenObj, this.state.adminMail);
    }

    approveAllPublishers = () => {
        const gestPendAprNew = [];
        this.submitPublisher(this.state.gestPendApr.map(publisherObj =>{return publisherObj.Mail}), gestPendAprNew, this.state.admTokenObj, this.state.adminMail);
    }

    // This function will trigger when the component is mounted, to fill the data from the state
    componentDidMount() {
        var objApi = {};
        objApi.objToSend = {
            Mail: this.state.adminMail,
            AccessToken : this.state.admTokenObj.accesToken,
        }
        objApi.fetchUrl = "api/publisher";
        objApi.method = "POST";
        objApi.successMSG = {
            SUCC_PUBLISHERSOK : '',
        };
        objApi.functionAfterSuccess = "loadPendingPublishers";
        callAPI(objApi, this);
    }

    // This funciton will call the api to submit the publisher
    submitPublisher(publishersEmails, newArrIfSuccess, admTokenObj, adminMail) {
        var objApi = {};
        objApi.objToSend = {
            Mails: publishersEmails,
            AccessToken : admTokenObj.accesToken,
            AdminMail : adminMail
        }
        objApi.fetchUrl = "api/publisher";
        objApi.method = "PUT";
        objApi.successMSG = {
            SUCC_PUBLISHERSOK : 'Solicitud ejecutada correctamente',
        };
        objApi.functionAfterSuccess = "submitPublisher";
        objApi.newArrIfSuccess = newArrIfSuccess;
        callAPI(objApi, this);
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
                                    <PublisherApprovTable isLoading = {this.state.isLoading} pubPendApp={this.state.gestPendApr} approvePublisher={this.approvePublisher} approveAllPublishers={this.approveAllPublishers} />
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

export default connect(mapStateToProps)(PendienteAprobacion)