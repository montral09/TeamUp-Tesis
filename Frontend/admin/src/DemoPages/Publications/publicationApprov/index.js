import React, { Fragment, Component } from 'react';

import {toast} from 'react-toastify';

// Extra

import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import PageTitle from '../../../Layout/AppMain/PageTitle';

import PublicationApprovTable from './publicationApprovTable';
import ModifyPublicationModal from '../modifyPublication';
import ApproveRejectPublicationModal from './approveRejectPublication';
import { connect } from 'react-redux';
import { callAPI } from '../../../config/genericFunctions';

// Table

import {
    Row, Col,
    Card, CardBody,
    CardTitle
} from 'reactstrap';

class PublPendApprov extends Component {
    constructor(props) {
        super(props);
        const admTokenObj = props.admTokenObj;
        const adminMail = props.adminData.Mail
        this.state = {
            publ: [],
            admTokenObj: admTokenObj,
            adminMail: adminMail,
            spaceTypes: [],
            facilities: [],
            isLoading : true
        }
        this.modalElement = React.createRef(); // Connects the reference to the modal
        this.modalElementAppRej = React.createRef(); // Connects the reference to the modal
    }

    loadInfraestructure = () => {
        var objApi = {};        
        objApi.fetchUrl = "api/facilities";
        objApi.method = "GET";
        objApi.successMSG = {
            SUCC_FACILITIESOK : '',
        };
        objApi.functionAfterSuccess = "loadFacilities";
        callAPI(objApi, this);
    }

    // This function will try to approve an specific publication
    approvePublication = (key) => {
        var pubData = {
            id: key,
            type: "APPROVE"
        };
        this.modalElementAppRej.current.toggleAppRej(this.props.admTokenObj, this.props.adminData, pubData);        
    }

    rejectPublication = (key) => {
        var pubData = {
            id: key,
            type: "REJECT"
        };
        this.modalElementAppRej.current.toggleAppRej(this.props.admTokenObj, this.props.adminData, pubData);  
    }
    
    // This function will trigger when the component is mounted, to fill the data from the state
    componentDidMount() {
        this.updateTable();
        this.loadInfraestructure()
    }

    updateTable = () =>{
        var objApi = {};
        objApi.objToSend = {
            "AccessToken": this.state.admTokenObj.accesToken,
            "AdminMail": this.state.adminMail,
            "PublicationsPerPage": 10                  
        }
        objApi.fetchUrl = "api/publicationPendingApproval";
        objApi.method = "POST";
        objApi.successMSG = {
            SUCC_PUBLICATIONSOK : '',
        };
        objApi.functionAfterSuccess = "getPublicationsPendingApproval";
        callAPI(objApi, this);
    }

    // This function will trigger the save function inside the modal to update the values
    editPublication = (key) => {
        const publData = this.state.publ.filter(publ => {
            return publ.IdPublication === key
        });

        this.modalElement.current.toggle(publData[0],this.state.admTokenObj,this.state.adminData, this.state.spaceTypes, this.state.facilities);
    }   

    render() {
        return (
            <Fragment>
                <PageTitle
                    heading="Publicaciones pendientes de aprobación"
                    subheading="En esta pantalla se mostrarán todas las publicaciones pendientes de aprobación"
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
                        <ModifyPublicationModal ref = {this.modalElement} updateTable={this.updateTable} disableFields = {true}/>
                        <ApproveRejectPublicationModal ref = {this.modalElementAppRej} updateTable={this.updateTable}/>
                        <Col lg="12">
                            <Card className="main-card mb-3">
                                <CardBody>
                                    <CardTitle>Pendientes de aprobación</CardTitle>
                                    <PublicationApprovTable isLoading = {this.state.isLoading} publ={this.state.publ} rejectPublication={this.rejectPublication} editPublication={this.editPublication} approvePublication={this.approvePublication} spaceTypes={this.state.spaceTypes}/>
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

export default connect(mapStateToProps)(PublPendApprov)