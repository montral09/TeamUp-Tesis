import React, { Fragment, Component } from 'react';
import { connect } from 'react-redux';

// Extra
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import PageTitle from '../../../Layout/AppMain/PageTitle';
import ModifyPublicationModal from '../modifyPublication';
import AllPublicationsTable from './AllPublicationsTable'
import Pagination from '../../Common/pagination';
import { callAPI } from '../../../config/genericFunctions';

// Table

import {
    Row, Col,
    Card, CardBody,
    CardTitle
} from 'reactstrap';

class AllPublications extends Component {
    constructor(props) {
        super(props);
        const admTokenObj = props.admTokenObj;
        const adminMail = props.adminData.Mail
        this.state = {
            allPubl: null,
            allPublToDisplay : null,
            admTokenObj: admTokenObj,
            adminMail: adminMail,
            spaceTypes: null,
            facilities: []
        }
        this.modalElement = React.createRef(); 
        this.modalElementAppRej = React.createRef();
    }

    loadSpaceTypes = () => {
        var objApi = {};
        objApi.objToSend = {}
        objApi.fetchUrl = "api/spaceTypes";
        objApi.method = "GET";
        objApi.successMSG = {
            SUCC_SPACETYPESOK : '',
        };
        objApi.functionAfterSuccess = "loadSpaceTypes";
        objApi.errorMSG= {}
        callAPI(objApi, this);
    }

    loadInfraestructure() {
        var objApi = {};        
        objApi.fetchUrl = "api/facilities";
        objApi.method = "GET";
        objApi.successMSG = {
            SUCC_FACILITIESOK : '',
        };
        objApi.functionAfterSuccess = "loadFacilities";
        callAPI(objApi, this);        
    }          

    updateElementsToDisplay = (toDisplayArray) => {
        this.setState({allPublToDisplay : toDisplayArray})
    }
    // This function will trigger when the component is mounted, to fill the data from the state
    componentDidMount() {
        this.loadAllPublications();
        this.loadInfraestructure();
        this.loadSpaceTypes();
    }

    loadAllPublications = () =>{
        this.setState({allPubl: null, allPublToDisplay : null})
        var objApi = {};
        objApi.objToSend = {
            "AccessToken": this.state.admTokenObj.accesToken,
            "AdminMail": this.state.adminMail,
            "PublicationsPerPage": 10                  
        }
        objApi.fetchUrl = "api/publications";
        objApi.method = "POST";
        objApi.successMSG = {
            SUCC_PUBLICATIONSOK : '',
        };
        objApi.functionAfterSuccess = "getAllPublications";
        callAPI(objApi, this);
    }

    // This function will trigger the save function inside the modal to update the values
    editPublication = (key) => {
        const publData = this.state.allPublToDisplay.filter(publ => {
            return publ.IdPublication === key
        });
        this.modalElement.current.toggle(publData[0], this.state.admTokenObj, this.props.adminData, this.state.spaceTypes, this.state.facilities);
    }

    pauseUnpausePub = (state) =>{
        alert("TBD");
    }
    render() {
        return (
            <Fragment>
                <PageTitle
                    heading="Publicaciones"
                    subheading="En esta pantalla se mostrarán todas las publicaciones"
                    icon="pe-7s-display2 icon-gradient bg-happy-itmeo"
                />
                <ReactCSSTransitionGroup
                    component="div"
                    transitionName="TabsAnimation"
                    transitionAppear={true}
                    transitionAppearTimeout={0}
                    transitionEnter={false}
                    transitionLeave={false}>
                    <Row>
                        <ModifyPublicationModal ref = {this.modalElement} updateTable={this.loadAllPublications} disableFields = {false}/>                        
                        <Col lg="12">
                            <Card className="main-card mb-3">
                                <CardBody>
                                    <CardTitle>Publicaciones</CardTitle>
                                    <AllPublicationsTable isLoading = {this.state.allPubl == null} publ={this.state.allPublToDisplay} 
                                    editPublication={this.editPublication} spaceTypes={this.state.spaceTypes} publisherData = {false} pauseUnpausePub={this.pauseUnpausePub}/>
                                </CardBody>
                            </Card>
                        </Col>
                        <Col lg="12">
                            {this.state.allPubl != null ? (<Pagination originalArray = {this.state.allPubl} updateElementsToDisplay = {this.updateElementsToDisplay} />) : (null)} 
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

export default connect(mapStateToProps)(AllPublications)