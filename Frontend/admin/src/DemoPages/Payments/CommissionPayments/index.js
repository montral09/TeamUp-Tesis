import React, { Fragment, Component } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';

// Extra

import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import PageTitle from '../../../Layout/AppMain/PageTitle';

import CommissionPaymentsTable from './commissionPaymentsTable';
import ApproveRejectCommissionPaymentModal from './approveRejectCommissionPayment';
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
        console.log("CommissionPayment - props:")
        console.log(props);
        const admTokenObj = props.admTokenObj;
        const adminMail = props.adminData.Mail
        this.state = {
            paymentsPendingConfirmation: [],
            paymentsPendingConfirmationToDisplay: [],
            paymentsComission: [],
            paymentsComissionToDisplay: [],
            admTokenObj: admTokenObj,
            adminMail: adminMail,
            isLoading: true,
            activeTab: "1",
            activeTabText: 'Pendientes de aprobación'
        }
        this.modalElementAppRej = React.createRef(); // Connects the reference to the modal
    }

    updateElementsToDisplay = (toDisplayArray) => {
        this.setState({ paymentsPendingConfirmationToDisplay: toDisplayArray })
    }
    updateElementsToDisplay = (toDisplayArray) => {
        this.setState({ paymentsComissionToDisplay: toDisplayArray })
    }
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
        this.loadPendingComissions()
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
    toggle = (tab) => {
        if (this.state.activeTab !== tab) {
            var headerText = "";
            switch (tab) {
                case "1": headerText = "Pendientes de aprobación"; break;
                case "2": headerText = "Todos"; break;
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
                                                Todos
                                                </NavLink>
                                        </NavItem>
                                    </Nav>
                                </CardHeader>
                                <CardBody>

                                    <TabContent activeTab={this.state.activeTab}>
                                        <TabPane tabId="1">
                                            <CommissionPaymentsTable onlyView = {false} isLoading={this.state.isLoading} paymentsPendingConfirmation={this.state.paymentsPendingConfirmationToDisplay} rejectCommissionPayment={this.rejectCommissionPayment} approveCommissionPayment={this.approveCommissionPayment} />
                                            {!this.state.isLoading ? (<Pagination originalArray={this.state.paymentsPendingConfirmation} updateElementsToDisplay={this.updateElementsToDisplay} />) : (null)}
                                        </TabPane>
                                        <TabPane tabId="2">
                                            <CommissionPaymentsTable onlyView = {true} isLoading={this.state.isLoading} paymentsPendingConfirmation={this.state.paymentsComissionToDisplay} rejectCommissionPayment={this.rejectCommissionPayment} approveCommissionPayment={this.approveCommissionPayment} />
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