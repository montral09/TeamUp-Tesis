import React, { Fragment, Component } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { connect } from 'react-redux';

// Extra
import PageTitle from '../../../Layout/AppMain/PageTitle';
import PreferentialPaymentsTable from './preferentialPaymentsTable';
import ApproveRejectPreferentialPaymentModal from './approveRejectPreferentialPayment';
import { callAPI } from '../../../config/genericFunctions';
import Pagination from '../../Common/pagination';

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
            preferentialPaymentsToDisplay: [],
            admTokenObj: admTokenObj,
            adminMail: adminMail,
            isLoading : true
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

    render() {
        return (
            <Fragment>
                <PageTitle
                    heading="Pagos plalnes preferenciales"
                    subheading="En esta pantalla se mostrará la información de pagos de planes preferenciales."
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
                        <ApproveRejectPreferentialPaymentModal ref = {this.modalElementAppRej} updateTable={this.loadPreferentialPayments}/>
                        <Col lg="12">
                            <Card className="main-card mb-3">
                                <CardBody>
                                    <CardTitle>Pendientes de aprobación</CardTitle>
                                    <PreferentialPaymentsTable isLoading = {this.state.isLoading} preferentialPayments={this.state.preferentialPaymentsToDisplay} rejectPreferentialPayment={this.rejectPreferentialPayment} approvePreferentialPayment={this.approvePreferentialPayment}/>
                                </CardBody>
                            </Card>
                        </Col>
                        <Col lg="12">
                            {!this.state.isLoading ? (<Pagination originalArray = {this.state.preferentialPaymentsFiltered} updateElementsToDisplay = {this.updateElementsToDisplay} />) : (null)} 
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