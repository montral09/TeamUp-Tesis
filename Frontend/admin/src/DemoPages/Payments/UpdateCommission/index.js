import React, { Fragment, Component } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { connect } from 'react-redux';

// Extra
import PageTitle from '../../../Layout/AppMain/PageTitle';
import UpdateCommissionTable from './updateCommissionTable';
import UpdateCommissionConfirmationModal from './updateCommissionConfirmation'
import Pagination from '../../Common/pagination';
import { callAPI } from '../../../config/genericFunctions';

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
            paymentsPendingPaidToDisplay: [],
            admTokenObj: admTokenObj,
            adminMail: adminMail,
            isLoading : true
        }
        this.modalElementUpdate = React.createRef(); // Connects the reference to the modal
    }

    changeCommission = (key) =>{
        var id = key;
        this.modalElementUpdate.current.toggleElementUpdate(this.props.admTokenObj, this.props.adminData, id);  
    }

    // This function will trigger when the component is mounted, to fill the data from the state
    componentDidMount() {
        this.loadComissions()
    }
    updateElementsToDisplay = (toDisplayArray) => {
        this.setState({publToDisplay : toDisplayArray})
    }
    loadComissions = () =>{
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
                        <UpdateCommissionConfirmationModal ref = {this.modalElementUpdate} updateTable={this.loadComissions}/>
                        <Col lg="12">
                            <Card className="main-card mb-3">
                                <CardBody>
                                    <CardTitle>Pendientes de pago</CardTitle>                                    
                                    <UpdateCommissionTable isLoading = {this.state.isLoading} paymentsPendingPaid={this.state.paymentsPendingPaidToDisplay} changeCommission={this.changeCommission} />
                                </CardBody>
                            </Card>
                        </Col>
                        <Col lg="12">
                            {!this.state.isLoading ? (<Pagination originalArray = {this.state.paymentsPendingPaid} updateElementsToDisplay = {this.updateElementsToDisplay} />) : (null)} 
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