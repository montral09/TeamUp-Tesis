import React, { Fragment, Component } from 'react';

// Extra

import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import PageTitle from '../../../Layout/AppMain/PageTitle';

import UpdateCommissionTable from './updateCommissionTable';
import UpdateCommissionConfirmationModal from './updateCommissionConfirmation'
import { callAPI } from '../../../config/genericFunctions';
import { connect } from 'react-redux';

// Table

import {
    Row, Col,
    Card, CardBody,
    CardTitle
} from 'reactstrap';

class UpdateCommission extends Component {
    constructor(props) {
        super(props);
        console.log("CommissionPayment - props:")
        console.log(props);
        const admTokenObj = props.admTokenObj;
        const adminMail = props.adminData.Mail
        this.state = {
            paymentsPendingPaid: [],
            admTokenObj: admTokenObj,
            adminMail: adminMail
        }
        this.modalElementUpdate = React.createRef(); // Connects the reference to the modal
        this.updateTable = this.updateTable.bind(this);
        this.changeCommission = this.changeCommission.bind(this);
    }

    changeCommission (key) {
        var id = key;
        this.modalElementUpdate.current.toggleElementUpdate(this.props.admTokenObj, this.props.adminData, id);  
    }

    // This function will trigger when the component is mounted, to fill the data from the state
    componentDidMount() {
        this.updateTable()
    }

    updateTable() {
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
        objApi.functionAfterSuccess = "getCommissionsUnpaid";
        callAPI(objApi, this);
    } 

    render() {
        return (
            <Fragment>
                <PageTitle
                    heading="Comisiones pendientes de pago"
                    subheading="En esta pantalla se mostrarán todos los pagos pendientes de comisiones."
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
                        <UpdateCommissionConfirmationModal ref = {this.modalElementUpdate} updateTable={this.updateTable}/>
                        <Col lg="12">
                            <Card className="main-card mb-3">
                                <CardBody>
                                    <CardTitle>Pendientes de pago</CardTitle>                                    
                                    <UpdateCommissionTable paymentsPendingPaid={this.state.paymentsPendingPaid} changeCommission={this.changeCommission} />
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

export default connect(mapStateToProps)(UpdateCommission)