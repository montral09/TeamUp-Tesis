import React, { Fragment, Component } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { connect } from 'react-redux';

// Extra
import PageTitle from '../../../Layout/AppMain/PageTitle';
import AllReservationsTable from './AllReservationsTable'
import { callAPI } from '../../../config/genericFunctions';
import Pagination from '../../Common/pagination';

// Table
import {
    Row, Col,
    Card, CardBody,
    CardTitle
} from 'reactstrap';

class AllReservations extends Component {
    constructor(props) {
        super(props);
        const admTokenObj = props.admTokenObj;
        const adminMail = props.adminData.Mail
        this.state = {
            admTokenObj: admTokenObj,
            adminMail: adminMail,
            reservations: [],
            reservationsToDisplay : [],
            isLoading : true
        }
        this.modalElement = React.createRef();
    }

    loadReservations() {
        var objApi = {};
        objApi.objToSend = {
            "AccessToken": this.state.admTokenObj.accesToken,
            "Mail": this.state.adminMail               
        }   
        objApi.fetchUrl = "api/reservationAdmin";
        objApi.method = "POST";
        objApi.successMSG = {
            SUCC_RESERVATIONSOK : '',
        };
        objApi.functionAfterSuccess = "loadReservations";
        callAPI(objApi, this);
    }
         

    // This function will trigger when the component is mounted, to fill the data from the state
    componentDidMount = () => {
        this.loadReservations();
    }

    updateElementsToDisplay = (toDisplayArray) => {
        this.setState({reservationsToDisplay : toDisplayArray})
    }

    // This function will call the api to update the states of the reservations
    updateReservatonsStates = () => {
        this.setState({isLoading : true, reservationsToDisplay: [], reservations : []});
        var objApi = {};
        objApi.objToSend = {}   
        objApi.fetchUrl = "api/scheduledJobs";
        objApi.method = "POST";
        objApi.successMSG = {
            SUCC_STATESUPDATES : '',
        };
        objApi.functionAfterSuccess = "updateReservatonsStates";
        callAPI(objApi, this);
    }

    render() {
        return (
            <Fragment>
                <PageTitle
                    heading="Reservas"
                    subheading="En esta pantalla se mostrarán todas las reservas"
                    icon="pe-7s-notebook icon-gradient bg-happy-itmeo"
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
                                    <CardTitle>Reservas</CardTitle>
                                    <AllReservationsTable elements = {this.state.reservationsToDisplay} isLoading = {this.state.isLoading} updateReservatonsStates = {this.updateReservatonsStates} />
                                </CardBody>
                            </Card>
                        </Col>
                        <Col lg="12">
                            {!this.state.isLoading ? (<Pagination originalArray = {this.state.reservations} updateElementsToDisplay = {this.updateElementsToDisplay} />) : (null)} 
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

export default connect(mapStateToProps)(AllReservations)