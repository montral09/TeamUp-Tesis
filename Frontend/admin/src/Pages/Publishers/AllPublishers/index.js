import React, { Fragment, Component } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { connect } from 'react-redux';

// Extra
import PageTitle from '../../../Layout/AppMain/PageTitle';
import PublisherApprovTable from './PublisherApprovTable';
import {callAPI} from '../../../config/genericFunctions'
import Pagination from '../../Common/pagination';

// Table

import {
    Row, Col,
    Card, CardBody,
    CardTitle
} from 'reactstrap';

class AllPublishers extends Component {
    constructor(props) {
        super(props);
        const admTokenObj = props.admTokenObj;
        const adminMail = props.adminData.Mail
        this.state = {
            gestPendApr: [],
            gestPendAprToDisplay : [],
            admTokenObj: admTokenObj,
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

        this.submitPublisher([gestToApprove[0].Mail], gestPendAprNew, this.state.admTokenObj, this.state.adminEmail);
    }

    approveAllPublishers = () => {
        const gestPendAprNew = [];
        this.submitPublisher(this.state.gestPendApr.map(publisherObj =>{return publisherObj.Mail}), gestPendAprNew, this.state.admTokenObj, this.state.adminEmail);
    }

    // This function will trigger when the component is mounted, to fill the data from the state
    componentDidMount() {
        this.gestPendApp();
    }

    gestPendApp = () => {
        var objApi = {};        
        objApi.fetchUrl = "api/publisher";
        objApi.method = "GET";
        objApi.successMSG = {
            SUCC_PUBLISHERSOK : '',
        };
        objApi.functionAfterSuccess = "gestPendApp";
        callAPI(objApi, this);      
    }

    updateElementsToDisplay = (toDisplayArray) => {
        this.setState({publToDisplay : toDisplayArray})
    }

    // This funciton will call the api to submit the publisher
    submitPublisher = (publishersEmails, newArrIfSuccess, admTokenObj, adminMail) => {
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
        objApi.functionAfterSuccess = "appRejPreferentialPayment";
        objApi.functionAfterError = "appRejPreferentialPayment"
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
                                    <PublisherApprovTable pubPendApp={this.state.gestPendAprToDisplay} approvePublisher={this.approvePublisher} approveAllPublishers={this.approveAllPublishers} />
                                </CardBody>
                            </Card>
                        </Col>
                        <Col lg="12">
                            {!this.state.isLoading ? (<Pagination originalArray = {this.state.gestPendApr} updateElementsToDisplay = {this.updateElementsToDisplay} />) : (null)} 
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


export default connect(mapStateToProps) (AllPublishers);