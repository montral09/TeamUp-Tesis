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
        console.log("AllReservations - props:")
        console.log(props);
        const admTokenObj = props.admTokenObj;
        const adminMail = props.adminData.Mail
        this.state = {
            admTokenObj: admTokenObj,
            adminMail: adminMail,
            reservations: [],
            reservationsToDisplay : [],
            isLoading : true
        }
        this.modalElement = React.createRef(); // esto hace unas magias para cambiar el estado de un componente hijo
    }

    loadReservations() {
        /*
        var objApi = {};        
        objApi.fetchUrl = "api/facilities";
        objApi.method = "GET";
        objApi.successMSG = {
            SUCC_FACILITIESOK : '',
        };
        objApi.functionAfterSuccess = "loadReservations";
        callAPI(objApi, this); */
        var resObj = {
            Reservations: [
                {
                    "IdReservation": 1,
                    "IdPublication": 23,
                    "TitlePublication": "Super coworking",
                    "StateDescription": "PENDING",
                    "CustomerPayment": {
                        "PaymentState": 2,
                        "PaymentDescription": "PENDING CONFIRMATION",
                        "PaymentComment": "",
                        "PaymentEvidence": "https://firebasestorage.googleapis.com/v0/b/teamup-1571186671227.appspot.com/o/Payments%2FReservations%2F11%2FCustomer%2F8hzfszgjc1e3.PDF?alt=media&token=a76b1338-0465-4c24-bb99-ec139c2bca14",
                        "PaymentDate": "10/12/2019"
                    },

                    "MailCustomer": "teamup_cliente1@yopmail.com",
                    "MailPublisher": "teamup_gestor1@yopmail.com",
                    "PlanSelected": "Hour",
                    "ReservedQuantity": 0,
                    "DateFromString": "25-06-2020",
                    "DateToString": "25-06-2020",
                    "HourFrom": "7",
                    "HourTo": "11",
                    "People": 3,
                    "TotalPrice": 480,

                }
            ],
            "responseCode": "SUCC_RESERVATIONSOK"
        }
        this.setState ({ reservations : [], isLoading : false});
    }
         

    // This function will trigger when the component is mounted, to fill the data from the state
    componentDidMount = () => {
        this.loadReservations()
    }

    updateElementsToDisplay = (toDisplayArray) => {
        this.setState({publToDisplay : toDisplayArray})
    }
    // This function will trigger the save function inside the modal to update the values
    editPublication = (key) => {
        const publData = this.state.publ.filter(publ => {
            return publ.IdPublication === key
        });

        //this.modalElement.current.toggle(publData[0],this.state.admTokenObj,this.props.adminData, this.state.spaceTypes, this.state.facilities);
    }

    render() {
        return (
            <Fragment>
                <PageTitle
                    heading="Reservas"
                    subheading="En esta pantalla se mostrarán todas las reservas"
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
                        <Col lg="12">
                            <Card className="main-card mb-3">
                                <CardBody>
                                    <CardTitle>Reservas</CardTitle>
                                    <AllReservationsTable elements = {this.state.reservationsToDisplay} isLoading = {this.state.isLoading} />
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