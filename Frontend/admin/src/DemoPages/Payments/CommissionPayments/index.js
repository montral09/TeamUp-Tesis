import React, { Fragment, Component } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';

// Extra

import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import PageTitle from '../../../Layout/AppMain/PageTitle';

import CommissionPaymentsTable from './commissionPaymentsTable';
import ApproveRejectCommissionPaymentModal from './approveRejectCommissionPayment';
import UpdateCommissionTable from '../CommissionPayments/updateCommissionTable';
import UpdateCommissionConfirmationModal from '../CommissionPayments/updateCommissionConfirmation'
import Pagination from '../../Common/pagination';
import { callAPI } from '../../../config/genericFunctions';

// Table

import {
    TabContent, TabPane, Nav, NavItem, NavLink,
    Row, Col,
    Card, CardBody, CardHeader
} from 'reactstrap';

class CommissionPayments extends Component {
    constructor(props) {
        super(props);
        this.state = {
            paymentsPendingConfirmation: [],
            paymentsPendingConfirmationToDisplay: [],
            paymentsComission: [],
            paymentsComissionToDisplay: [],
            paymentsPendingPaid: [],
            paymentsPendingPaidToDisplay: [],
            admTokenObj: props.admTokenObj,
            adminMail: props.adminData.Mail,
            isLoading: true,
            isLoading2: true,
            activeTab: "1",
            activeTabText: 'Pendientes de aprobación'
        }
        this.modalElementAppRej = React.createRef(); // Connects the reference to the modal
        this.modalElementUpdate = React.createRef(); // Connects the reference to the modal

    }

    updateElementsToDisplay = (toDisplayArray) => {
        this.setState({ paymentsPendingConfirmationToDisplay: toDisplayArray })
    }
    updateElementsToDisplay2 = (toDisplayArray) => {
        this.setState({ paymentsComissionToDisplay: toDisplayArray })
    }

    /* Start comissions unpaid */
    updateElementsToDisplay3 = (toDisplayArray) => {
        this.setState({ paymentsPendingPaidToDisplay: toDisplayArray })
    }
    changeCommission = (key) => {
        var id = key;
        this.modalElementUpdate.current.toggleElementUpdate(id);
    }

    saveUpdatedComission = (id, comissionValue) => {
        var objApi = {};    
        objApi.objToSend = {
            Mail: this.state.adminMail,
            AccessToken: this.state.admTokenObj.accesToken,
            IdReservation: id,
            Price: comissionValue
        }
        objApi.fetchUrl = "api/reservationPaymentAdmin";
        objApi.method = "POST";
        objApi.successMSG = {
            SUCC_COMMISSIONUPDATED : 'Pago actualizado correctamente',
        };
        objApi.functionAfterSuccess = "editCommission";
        objApi.functionAfterError = "editCommission"
        callAPI(objApi, this);
    }
    /* End comissions unpaid  */

    // This function will try to approve the payment
    approveCommissionPayment = (key) => {
        var paymentData = {
            id: key,
            approved: true
        };
        this.modalElementAppRej.current.toggleAppRej(this.props.admTokenObj, this.props.adminData, paymentData);
    }
    rejectCommissionPayment = (key) => {
        var paymentData = {
            id: key,
            approved: false
        };
        this.modalElementAppRej.current.toggleAppRej(this.props.admTokenObj, this.props.adminData, paymentData);
    }
    // This function will trigger when the component is mounted, to fill the data from the state
    componentDidMount() {
        this.loadPendingComissions();
        this.loadCommissionsUnpaid();
    }

    loadPendingComissions = () => {
        var objApi = {};
        objApi.objToSend = {
            "AccessToken": this.state.admTokenObj.accesToken,
            "Mail": this.state.adminMail
        }
        objApi.fetchUrl = "api/reservationPaymentPublisher";
        objApi.method = "PUT";
        objApi.successMSG = {
            SUCC_COMMISSIONSSOK: '',
        };
        objApi.functionAfterSuccess = "getPendingCommissions";
        callAPI(objApi, this);
    }

    loadCommissionsUnpaid = () => {
        var objApi = {};
        objApi.objToSend = {
            "AccessToken": this.state.admTokenObj.accesToken,
            "Mail": this.state.adminMail
        }
        objApi.fetchUrl = "api/reservationPaymentPublisher";
        objApi.method = "PUT";
        objApi.successMSG = {
            SUCC_COMMISSIONSSOK: '',
        };
        objApi.functionAfterSuccess = "getCommissionsUnpaid";
        callAPI(objApi, this);
    }

    toggle = (tab) => {
        if (this.state.activeTab !== tab) {
            var headerText = "";
            switch (tab) {
                case "1": headerText = "Pendientes de aprobación"; break;
                case "2": headerText = "Pendientes de pago"; break;
                case "3": headerText = "Todos"; break;
            }
            this.setState({
                activeTab: tab,
                activeTabText: headerText
            });
        }
    }
    render() {
        return (
            <Fragment>
                <PageTitle
                    heading="Pago comisiones"
                    subheading="En esta pantalla se mostrará toda la información de los pagos de comisiones."
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
                        <ApproveRejectCommissionPaymentModal ref={this.modalElementAppRej} updateTable={this.loadPendingComissions} />
                        <Col lg="12">
                            <Card tabs="true" className="mb-3">
                                <CardHeader className="card-header-tab">
                                    <div className="card-header-title">
                                        {this.state.activeTabText}
                                    </div>
                                    <Nav>
                                        <NavItem>
                                            <NavLink href="javascript:void(0);"
                                                className={classnames({ active: this.state.activeTab === '1' })}
                                                onClick={() => {
                                                    this.toggle('1');
                                                }}
                                            >
                                                Pendientes de aprobación
                                                </NavLink>
                                        </NavItem>
                                        <NavItem>
                                            <NavLink href="javascript:void(0);"
                                                className={classnames({ active: this.state.activeTab === '2' })}
                                                onClick={() => {
                                                    this.toggle('2');
                                                }}
                                            >
                                                Pendientes de pago
                                                </NavLink>
                                        </NavItem>
                                        <NavItem>
                                            <NavLink href="javascript:void(0);"
                                                className={classnames({ active: this.state.activeTab === '3' })}
                                                onClick={() => {
                                                    this.toggle('3');
                                                }}
                                            >
                                                Todos
                                                </NavLink>
                                        </NavItem>
                                    </Nav>
                                </CardHeader>
                                <CardBody>
                                    <TabContent activeTab={this.state.activeTab}>
                                        <TabPane tabId="1">
                                            <CommissionPaymentsTable onlyView={false} isLoading={this.state.isLoading} paymentsPendingConfirmation={this.state.paymentsPendingConfirmationToDisplay} rejectCommissionPayment={this.rejectCommissionPayment} approveCommissionPayment={this.approveCommissionPayment} />
                                            {!this.state.isLoading ? (<Pagination originalArray={this.state.paymentsPendingConfirmation} updateElementsToDisplay={this.updateElementsToDisplay} />) : (null)}
                                        </TabPane>
                                        <TabPane tabId="2">
                                            <UpdateCommissionConfirmationModal ref={this.modalElementUpdate} saveUpdatedComission= {this.saveUpdatedComission}/>
                                            <UpdateCommissionTable isLoading={this.state.isLoading2} paymentsPendingPaid={this.state.paymentsPendingPaidToDisplay} changeCommission={this.changeCommission} />
                                            {!this.state.isLoading2 ? (<Pagination originalArray={this.state.paymentsPendingPaid} updateElementsToDisplay={this.updateElementsToDisplay3} />) : (null)}
                                        </TabPane>
                                        <TabPane tabId="3">
                                            <CommissionPaymentsTable onlyView={true} isLoading={this.state.isLoading} paymentsPendingConfirmation={this.state.paymentsComissionToDisplay} rejectCommissionPayment={this.rejectCommissionPayment} approveCommissionPayment={this.approveCommissionPayment} />
                                            {!this.state.isLoading ? (<Pagination originalArray={this.state.paymentsComission} updateElementsToDisplay={this.updateElementsToDisplay2} />) : (null)}
                                        </TabPane>
                                    </TabContent>

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
        adminData: state.loginData.adminData
    }
}

export default connect(mapStateToProps)(CommissionPayments)