import React, { Component, Fragment } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { connect } from 'react-redux';
import classnames from 'classnames';
import { callAPI } from '../../../config/genericFunctions';

import {
    Row, Col,
    Button,
    CardHeader,
    Card,
    CardBody,
    Progress,
    TabContent,
    TabPane,
} from 'reactstrap';

import PageTitle from '../../../Layout/AppMain/PageTitle';

import {
    AreaChart, Area, Line,
    ResponsiveContainer,
    Bar,
    BarChart,
    ComposedChart,
    CartesianGrid,
    Tooltip,
    LineChart
} from 'recharts';

const data = [
    { name: 'Page A', uv: 4000, pv: 2400, amt: 2400 },
    { name: 'Page B', uv: 3000, pv: 1398, amt: 2210 },
    { name: 'Page C', uv: 2000, pv: 9800, amt: 2290 },
    { name: 'Page D', uv: 2780, pv: 3908, amt: 2000 },
    { name: 'Page E', uv: 1890, pv: 4800, amt: 2181 },
    { name: 'Page F', uv: 2390, pv: 3800, amt: 2500 },
    { name: 'Page G', uv: 3490, pv: 4300, amt: 2100 },
    { name: 'Page C', uv: 2000, pv: 6800, amt: 2290 },
    { name: 'Page D', uv: 4780, pv: 7908, amt: 2000 },
    { name: 'Page E', uv: 2890, pv: 9800, amt: 2181 },
    { name: 'Page F', uv: 1390, pv: 3800, amt: 1500 },
    { name: 'Page G', uv: 3490, pv: 4300, amt: 2100 },
];

const data2 = [
    { name: 'Page A', uv: 5400, pv: 5240, amt: 1240 },
    { name: 'Page B', uv: 7300, pv: 4139, amt: 3221 },
    { name: 'Page C', uv: 8200, pv: 7980, amt: 5229 },
    { name: 'Page D', uv: 6278, pv: 4390, amt: 3200 },
    { name: 'Page E', uv: 3189, pv: 7480, amt: 6218 },
    { name: 'Page D', uv: 9478, pv: 6790, amt: 2200 },
    { name: 'Page E', uv: 1289, pv: 1980, amt: 7218 },
    { name: 'Page F', uv: 3139, pv: 2380, amt: 5150 },
    { name: 'Page G', uv: 5349, pv: 3430, amt: 3210 },
];

class AnalyticsDashboard1 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            admTokenObj: this.props.admTokenObj,
            adminData: this.props.adminData,
            dropdownOpen: false,
            arrDataUsers: null,
            publ: null,
            preferentialPaymentsPendConf: null,
            allPubl: null,
            paymentsPendingConfirmation: null
        };
    }
    // This function will trigger when the component is mounted, to fill the data from the state
    componentDidMount() {
        this.loadUsers();
        this.loadPublicationsPendingApproval();
        this.loadAllPublications();
        this.loadPreferentialPayments();
        this.loadPendingComissions();
    }

    loadUsers = () => {
        this.setState({ arrDataUsers: null })
        var objApi = {};
        objApi.objToSend = {
            Mail: this.state.adminData.Mail,
            AccessToken: this.state.admTokenObj.accesToken
        }
        objApi.fetchUrl = "api/users";
        objApi.method = "POST";
        objApi.successMSG = {
            SUCC_USERSOK: '',
        };
        objApi.functionAfterSuccess = "getUsers";
        callAPI(objApi, this);
    }

    loadPublicationsPendingApproval = () => {
        this.setState({ publ: null })
        var objApi = {};
        objApi.objToSend = {
            "AccessToken": this.state.admTokenObj.accesToken,
            "AdminMail": this.state.adminData.Mail,
            "PublicationsPerPage": 50
        }
        objApi.fetchUrl = "api/publicationPendingApproval";
        objApi.method = "POST";
        objApi.successMSG = {
            SUCC_PUBLICATIONSOK: '',
        };
        objApi.functionAfterSuccess = "getPublicationsPendingApproval";
        callAPI(objApi, this);
    }

    loadAllPublications = () => {
        this.setState({ allPubl: null })
        var objApi = {};
        objApi.objToSend = {
            "AccessToken": this.state.admTokenObj.accesToken,
            "AdminMail": this.state.adminData.Mail,
            "PublicationsPerPage": 10
        }
        objApi.fetchUrl = "api/publications";
        objApi.method = "POST";
        objApi.successMSG = {
            SUCC_PUBLICATIONSOK: '',
        };
        objApi.functionAfterSuccess = "getAllPublications";
        callAPI(objApi, this);
    }
    loadPreferentialPayments = () => {
        this.setState({ paymentsPendingConfirmation: null })
        var objApi = {};
        objApi.objToSend = {
            "AccessToken": this.state.admTokenObj.accesToken,
            "Mail": this.state.adminData.Mail
        }
        objApi.fetchUrl = "api/publicationPlanPaymentAdmin";
        objApi.method = "POST";
        objApi.successMSG = {
            SUCC_PUBLICATIONPLANSOK: '',
        };
        objApi.functionAfterSuccess = "getPreferentialPayments";
        callAPI(objApi, this);
    }

    loadPendingComissions = () => {
        this.setState({ paymentsPendingConfirmation: null })
        var objApi = {};
        objApi.objToSend = {
            "AccessToken": this.state.admTokenObj.accesToken,
            "Mail": this.state.adminData.Mail
        }
        objApi.fetchUrl = "api/reservationPaymentPublisher";
        objApi.method = "PUT";
        objApi.successMSG = {
            SUCC_COMMISSIONSSOK: '',
        };
        objApi.functionAfterSuccess = "getPendingCommissions";
        callAPI(objApi, this);
    }
    render() {

        return (
            <Fragment>
                <ReactCSSTransitionGroup
                    component="div"
                    transitionName="TabsAnimation"
                    transitionAppear={true}
                    transitionAppearTimeout={0}
                    transitionEnter={false}
                    transitionLeave={false}>
                    <div>
                        <PageTitle
                            heading="Admin Dashboard"
                            subheading="Admin dashboard"
                            icon="pe-7s-car icon-gradient bg-mean-fruit"
                        />
                        <Row>
                            <Col md="12" lg="6">
                                <Row>
                                    <Col md="6">
                                        <div className="card mb-3 bg-arielle-smile widget-chart text-white card-border">
                                            <div className="icon-wrapper rounded-circle">
                                                <div className="icon-wrapper-bg bg-white opacity-10" />
                                                <i className="lnr lnr-users icon-gradient bg-arielle-smile" />
                                            </div>
                                            <div className="widget-numbers">
                                                {this.state.arrDataUsers == null ? ("--") : (this.state.arrDataUsers.length)}
                                            </div>
                                            <div className="widget-subheading">
                                                Usuarios
                                            </div>
                                            <div className="widget-progress-wrapper mt-3">
                                                {this.state.arrDataUsers == null ? (<Progress className="progress-bar-sm progress-bar-animated-alt" color="primary"
                                                    value="100" />) : (null)}
                                            </div>
                                        </div>
                                    </Col>
                                    <Col md="6">
                                        <div className="card mb-3 bg-midnight-bloom widget-chart text-white card-border">
                                            <div className="icon-wrapper rounded">
                                                <div className="icon-wrapper-bg bg-dark opacity-9" />
                                                <i className="lnr-graduation-hat text-white" />
                                            </div>
                                            <div className="widget-numbers">
                                                {this.state.arrDataUsers == null ? ("--") : (this.state.arrDataUsers.filter(function (element) { return element.CheckPublisher == true }).length)}
                                            </div>
                                            <div className="widget-subheading">
                                                Gestores
                                            </div>
                                            <div className="widget-progress-wrapper mt-3">
                                                {this.state.arrDataUsers == null ? (<Progress className="progress-bar-sm progress-bar-animated-alt" color="primary"
                                                    value="100" />) : (null)}
                                            </div>
                                        </div>
                                    </Col>
                                    <Col md="6">
                                        <div className="card mb-3 bg-grow-early widget-chart text-white card-border">
                                            <div className="icon-wrapper rounded">
                                                <div className="icon-wrapper-bg bg-white opacity-10" />
                                                <i className="lnr-screen icon-gradient bg-warm-flame" />
                                            </div>
                                            <div className="widget-numbers">
                                                {this.state.allPubl == null ? ("--") : (this.state.allPubl.length)}
                                            </div>
                                            <div className="widget-subheading">
                                                Publicaciones activas
                                            </div>
                                            <div className="widget-progress-wrapper mt-3">
                                                {this.state.allPubl == null ? (<Progress className="progress-bar-sm progress-bar-animated-alt" color="primary"
                                                    value="100" />) : (null)}
                                            </div>
                                        </div>
                                    </Col>
                                    <Col md="6">
                                        <div className="card mb-3 widget-chart card-hover-shadow-2x">
                                            <div className="icon-wrapper border-light rounded">
                                                <div className="icon-wrapper-bg bg-light" />
                                                <i className="lnr-hourglass icon-gradient bg-love-kiss"> </i>
                                            </div>
                                            <div className="widget-numbers">
                                                {this.state.publ == null ? ("--") : (this.state.publ.length)}
                                            </div>
                                            <div className="widget-subheading">
                                                Gestores pendientes aprobación
                                            </div>
                                            <div className="widget-progress-wrapper mt-3">
                                                {this.state.publ == null ? (<Progress className="progress-bar-sm progress-bar-animated-alt" color="primary"
                                                    value="100" />) : (null)}
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                            </Col>
                            <Col md="12" lg="6">
                                <Row>
                                    <Col md="6">
                                        <div className="card mb-3 widget-chart bg-happy-itmeo card-border">
                                            <div className="widget-chart-content text-white">
                                                <div className="icon-wrapper rounded">
                                                    <div className="icon-wrapper-bg bg-white opacity-6" />
                                                    <i className="lnr lnr-diamond icon-gradient bg-premium-dark"> </i>
                                                </div>
                                                <div className="widget-numbers">
                                                    {this.state.preferentialPaymentsPendConf == null ? ("--") : (this.state.preferentialPaymentsPendConf.length)}
                                                </div>
                                                <div className="widget-subheading">
                                                    Pagos preferenciales pendientes aprobación
                                            </div>
                                            </div>
                                            <div className="widget-progress-wrapper mt-3">
                                                {this.state.preferentialPaymentsPendConf == null ? (<Progress className="progress-bar-sm progress-bar-animated-alt" color="primary"
                                                    value="100" />) : (null)}
                                            </div>
                                        </div>
                                    </Col>
                                    <Col md="6">
                                        <div className="card mb-3 widget-chart bg-strong-bliss card-border">
                                            <div className="widget-chart-content text-white">
                                                <div className="icon-wrapper rounded">
                                                    <div className="icon-wrapper-bg bg-white opacity-4" />
                                                    <i className="lnr lnr-star text-white" />
                                                </div>
                                                <div className="widget-numbers">
                                                    {this.state.paymentsPendingConfirmation == null ? ("--") : (this.state.paymentsPendingConfirmation.filter(function (element) { return element.CommissionState === 'PENDING CONFIRMATION' }).length)}
                                                </div>
                                                <div className="widget-subheading">
                                                    Pagos comision pendientes aprobación
                                                </div>
                                                <div className="widget-progress-wrapper mt-3">
                                                    {this.state.paymentsPendingConfirmation == null ? (<Progress className="progress-bar-sm progress-bar-animated-alt" color="primary"
                                                        value="100" />) : (null)}
                                                </div>
                                            </div>
                                        </div>
                                    </Col>
                                    <Col md="6"></Col>
                                    <Col md="6"></Col>
                                </Row>
                            </Col>
                        </Row>
                    </div>
                </ReactCSSTransitionGroup>
            </Fragment>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        login_status: state.loginData.login_status,
        adminData: state.loginData.adminData,
        admTokenObj: state.loginData.admTokenObj,
    }
}

export default connect(mapStateToProps, null)(AnalyticsDashboard1);
