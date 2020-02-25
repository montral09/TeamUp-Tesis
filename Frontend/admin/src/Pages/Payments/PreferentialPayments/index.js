import React, { Fragment, Component } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { connect } from 'react-redux';
import classnames from 'classnames';

// Table
import {
    TabContent, TabPane, Nav, NavItem, NavLink,
    Row, Col,
    Card, CardBody, CardHeader
} from 'reactstrap';

// Extra
import PageTitle from '../../../Layout/AppMain/PageTitle';
import PreferentialPaymentsTable from './preferentialPaymentsTable';
import ApproveRejectPreferentialPaymentModal from './approveRejectPreferentialPayment';
import { callAPI } from '../../../config/genericFunctions';
import Pagination from '../../Common/pagination';



class PreferentialPayments extends Component {
    constructor(props) {
        super(props);
        console.log("PreferentialPayments - props:")
        console.log(props);
        const admTokenObj = props.admTokenObj;
        const adminMail = props.adminData.Mail
        this.state = {
            preferentialPaymentsPendPay: null,
            preferentialPaymentsPendPayToDisplay: null,
            preferentialPaymentsPendConf: null,
            preferentialPaymentsPendConfToDisplay: null,
            paymentsAll : null,
            paymentsAllToDisplay : null,
            admTokenObj: admTokenObj,
            adminMail: adminMail,
            activeTab: "1",
            activeTabText: 'Pendientes de aprobación'
        }
        this.modalElement = React.createRef(); // Connects the reference to the modal
        this.modalElementAppRej = React.createRef(); // Connects the reference to the modal
    }

    updateElementsToDisplay = (toDisplayArray) => {
        this.setState({publToDisplay : toDisplayArray})
    }

    // This function will try to approve the payment
    approvePreferentialPayment = (key) =>{
        var paymentData = {
            id: key,
            approved: true
        };
        this.modalElementAppRej.current.toggleAppRej(this.props.admTokenObj, this.props.adminData, paymentData);        
    }

    rejectPreferentialPayment = (key) =>{
        var paymentData = {
            id: key,
            approved: false
        };
        this.modalElementAppRej.current.toggleAppRej(this.props.admTokenObj, this.props.adminData, paymentData);  
    }

    // This function will trigger when the component is mounted, to fill the data from the state
    componentDidMount() {
        this.loadPreferentialPayments()
    }

    loadPreferentialPayments = () =>{
        var objApi = {};
        objApi.objToSend = {
            "AccessToken": this.state.admTokenObj.accesToken,
            "Mail": this.state.adminMail               
        }
        objApi.fetchUrl = "api/publicationPlanPaymentAdmin";
        objApi.method = "POST";
        objApi.successMSG = {
            SUCC_PUBLICATIONPLANSOK : '',
        };
        objApi.functionAfterSuccess = "getPreferentialPayments";
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
                    heading="Pagos planes preferenciales"
                    subheading="En esta pantalla se mostrará la información de pagos de planes preferenciales."
                    icon="pe-7s-wallet icon-gradient bg-happy-itmeo"
                />
                <ReactCSSTransitionGroup
                    component="div"
                    transitionName="TabsAnimation"
                    transitionAppear={true}
                    transitionAppearTimeout={0}
                    transitionEnter={false}
                    transitionLeave={false}>
                    <Row>
                        <ApproveRejectPreferentialPaymentModal ref = {this.modalElementAppRej} updateTable={this.loadPreferentialPayments}/>
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
                                            <PreferentialPaymentsTable mode='pendingConf' isLoading = {this.state.preferentialPaymentsPendConf == null} preferentialPayments={this.state.preferentialPaymentsPendConfToDisplay} rejectPreferentialPayment={this.rejectPreferentialPayment} approvePreferentialPayment={this.approvePreferentialPayment}/>
                                            {this.state.preferentialPaymentsPendConf != null ? (<Pagination originalArray = {this.state.preferentialPaymentsPendConf} updateElementsToDisplay = {this.updateElementsToDisplay} />) : (null)} 
                                        </TabPane>
                                        <TabPane tabId="2">
                                            <PreferentialPaymentsTable mode='pendingPay' isLoading = {this.state.preferentialPaymentsPendPay == null} preferentialPayments={this.state.preferentialPaymentsPendPayToDisplay} rejectPreferentialPayment={this.rejectPreferentialPayment} approvePreferentialPayment={this.approvePreferentialPayment}/>
                                            {this.state.preferentialPaymentsPendPay != null ? (<Pagination originalArray = {this.state.preferentialPaymentsPendPay} updateElementsToDisplay = {this.updateElementsToDisplay} />) : (null)} 
                                        </TabPane>
                                        <TabPane tabId="3">
                                            <PreferentialPaymentsTable mode='all' isLoading = {this.state.paymentsAll == null} preferentialPayments={this.state.paymentsAllToDisplay} rejectPreferentialPayment={this.rejectPreferentialPayment} approvePreferentialPayment={this.approvePreferentialPayment}/>
                                            {this.state.paymentsAll != null ? (<Pagination originalArray = {this.state.paymentsAll} updateElementsToDisplay = {this.updateElementsToDisplay} />) : (null)} 

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
        adminData : state.loginData.adminData
    }
}

export default connect(mapStateToProps)(PreferentialPayments)