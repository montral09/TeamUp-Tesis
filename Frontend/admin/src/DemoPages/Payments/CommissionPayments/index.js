import React, { Fragment, Component } from 'react';

import {toast} from 'react-toastify';

// Extra

import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import PageTitle from '../../../Layout/AppMain/PageTitle';

import CommissionPaymentsTable from './commissionPaymentsTable';
import ApproveRejectCommissionPaymentModal from './approveRejectCommissionPayment';
import { callAPI } from '../../../config/genericFunctions';
import { connect } from 'react-redux';

// Table

import {
    Row, Col,
    Card, CardBody,
    CardTitle
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
            admTokenObj: admTokenObj,
            adminMail: adminMail,
            isLoading : true
        }        
        this.modalElementAppRej = React.createRef(); // Connects the reference to the modal
    }
        
    // This function will try to approve the payment
    approveCommissionPayment =(key)=>{
        var paymentData = {
            id: key,
            approved: true
        };
        this.modalElementAppRej.current.toggleAppRej(this.props.admTokenObj, this.props.adminData, paymentData);        
    }

    rejectCommissionPayment =(key)=>{
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

    loadPendingComissions=()=>{
        var objApi = {};
        objApi.objToSend = {
            "AccessToken": this.state.admTokenObj.accesToken,
            "Mail": this.state.adminMail               
        }
        objApi.fetchUrl = "api/reservationPaymentPublisher";
        objApi.method = "PUT";
        objApi.successMSG = {
            SUCC_COMMISSIONSSOK : '',
        };
        objApi.functionAfterSuccess = "getPendingCommissions";
        callAPI(objApi, this);
    } 

    render() {
        return (
            <Fragment>
                <PageTitle
                    heading="Comisiones pendientes de confirmacion"
                    subheading="En esta pantalla se mostrarán todos los pagos pendientes de confirmacion de comisiones."
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
                        <ApproveRejectCommissionPaymentModal ref = {this.modalElementAppRej} updateTable={this.loadPendingComissions}/>
                        <Col lg="12">
                            <Card className="main-card mb-3">
                                <CardBody>
                                    <CardTitle>Pendientes de aprobación</CardTitle>
                                    <CommissionPaymentsTable isLoading = {this.state.isLoading} paymentsPendingConfirmation={this.state.paymentsPendingConfirmation} rejectCommissionPayment={this.rejectCommissionPayment} approveCommissionPayment={this.approveCommissionPayment}/>                                    
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

export default connect(mapStateToProps)(CommissionPayments)