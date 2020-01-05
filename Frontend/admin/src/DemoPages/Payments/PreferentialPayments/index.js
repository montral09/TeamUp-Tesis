import React, { Fragment, Component } from 'react';

import {toast} from 'react-toastify';

// Extra

import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import PageTitle from '../../../Layout/AppMain/PageTitle';

import PreferentialPaymentsTable from './preferentialPaymentsTable';
import ApproveRejectPreferentialPaymentModal from './approveRejectPreferentialPayment';

import { connect } from 'react-redux';

// Table

import {
    Row, Col,
    Card, CardBody,
    CardTitle
} from 'reactstrap';

class PreferentialPayments extends Component {
    constructor(props) {
        super(props);
        console.log("PreferentialPayments - props:")
        console.log(props);
        const admTokenObj = props.admTokenObj;
        const adminMail = props.adminData.Mail
        this.state = {
            preferentialPayments: [],
            admTokenObj: admTokenObj,
            adminMail: adminMail
        }
        this.modalElement = React.createRef(); // Connects the reference to the modal
        this.modalElementAppRej = React.createRef(); // Connects the reference to the modal
        this.approvePreferentialPayment  = this.approvePreferentialPayment.bind(this);
        this.rejectPreferentialPayment = this.rejectPreferentialPayment.bind(this);
        this.updateTable = this.updateTable.bind(this);
    }
        
    // This function will try to approve the payment
    approvePreferentialPayment (key) {
        var paymentData = {
            id: key,
            approved: true
        };
        this.modalElementAppRej.current.toggleAppRej(this.props.admTokenObj, this.props.adminData, paymentData);        
    }

    rejectPreferentialPayment (key) {
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
        fetch('https://localhost:44372/api/publicationPlanPaymentAdmin', {
            method: 'POST',
            header: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify({
                "AccessToken": this.state.admTokenObj.accesToken,
                "Mail": this.state.adminMail               
            })
        }).then(response => response.json()).then(data => {
            if (data.responseCode == "SUCC_PUBLICATIONPLANSOK") {
                console.log(data.Publications);
                this.setState({ 'preferentialPayments': data.Payments })
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
                    heading="Pagos pendientes de confirmacion"
                    subheading="En esta pantalla se mostrarán todos los pagos pendientes de confirmacion de planes preferenciales."
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
                        <ApproveRejectPreferentialPaymentModal ref = {this.modalElementAppRej} updateTable={this.updateTable}/>
                        <Col lg="12">
                            <Card className="main-card mb-3">
                                <CardBody>
                                    <CardTitle>Pendientes de aprobación</CardTitle>
                                    <PreferentialPaymentsTable preferentialPayments={this.state.preferentialPayments} rejectPreferentialPayment={this.rejectPreferentialPayment} approvePreferentialPayment={this.approvePreferentialPayment}/>
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