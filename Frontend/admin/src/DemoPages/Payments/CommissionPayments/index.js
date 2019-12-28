import React, { Fragment, Component } from 'react';

import {toast} from 'react-toastify';

// Extra

import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import PageTitle from '../../../Layout/AppMain/PageTitle';

import CommissionPaymentsTable from './commissionPaymentsTable';
import ApproveRejectCommissionPaymentModal from './approveRejectCommissionPayment';

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
            payments: [],
            admTokenObj: admTokenObj,
            adminMail: adminMail
        }
        this.modalElement = React.createRef(); // Connects the reference to the modal
        this.modalElementAppRej = React.createRef(); // Connects the reference to the modal
        this.approveCommissionPayment  = this.approveCommissionPayment.bind(this);
        this.rejectCommissionPayment = this.rejectCommissionPayment.bind(this);
        this.updateTable = this.updateTable.bind(this);
    }
        
    // This function will try to approve the payment
    approveCommissionPayment (key) {
        var paymentData = {
            id: key,
            approved: true
        };
        this.modalElementAppRej.current.toggleAppRej(this.props.admTokenObj, this.props.adminData, paymentData);        
    }

    rejectCommissionPayment (key) {
        var paymentData = {
            id: key,
            approved: false
        };
        this.modalElementAppRej.current.toggleAppRej(this.props.admTokenObj, this.props.adminData, paymentData);  
    }

    // This function will trigger when the component is mounted, to fill the data from the state
    componentDidMount() {
        this.updateTable()
    }

    updateTable(){
        fetch('https://localhost:44372/api/reservationPaymentPublisher', {
            method: 'PUT',
            header: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify({
                "AccessToken": this.state.admTokenObj.accesToken,
                "Mail": this.state.adminMail               
            })
        }).then(response => response.json()).then(data => {
            console.log (data);
            if (data.responseCode == "SUCC_COMMISSIONSSOK") {
                console.log(data.Commissions);
                this.setState({ 'payments': data.Commissions })
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
                        <ApproveRejectCommissionPaymentModal ref = {this.modalElementAppRej} updateTable={this.updateTable}/>
                        <Col lg="12">
                            <Card className="main-card mb-3">
                                <CardBody>
                                    <CardTitle>Pendientes de aprobación</CardTitle>
                                    <CommissionPaymentsTable payments={this.state.payments} rejectCommissionPayment={this.rejectCommissionPayment} approveCommissionPayment={this.approveCommissionPayment}/>
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