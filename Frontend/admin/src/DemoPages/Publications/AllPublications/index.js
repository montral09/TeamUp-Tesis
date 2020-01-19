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
        console.log("AllPublications - props:")
        console.log(props);
        const admTokenObj = props.admTokenObj;
        const adminMail = props.adminData.Mail
        this.state = {
            publ: [],
            publToDisplay : [],
            admTokenObj: admTokenObj,
            adminMail: adminMail,
            spaceTypes: [],
            facilities: [],
            isLoading: true
        }
        this.modalElement = React.createRef(); // esto hace unas magias para cambiar el estado de un componente hijo
        this.modalElementAppRej = React.createRef();
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
        this.setState({publToDisplay : toDisplayArray})
    }
    // This function will trigger when the component is mounted, to fill the data from the state
    componentDidMount() {
        this.loadAllPublications();
        this.loadInfraestructure()
    }

    loadAllPublications = () =>{
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
        const publData = this.state.publToDisplay.filter(publ => {
            return publ.IdPublication === key
        });

        this.modalElement.current.toggle(publData[0],this.state.admTokenObj,this.props.adminData, this.state.spaceTypes, this.state.facilities);
    }

    render() {
        return (
            <Fragment>
                <PageTitle
                    heading="Publicaciones"
                    subheading="En esta pantalla se mostrarán todas las publicaciones"
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
                        <ModifyPublicationModal ref = {this.modalElement} updateTable={this.loadAllPublications} disableFields = {false}/>                        
                        <Col lg="12">
                            <Card className="main-card mb-3">
                                <CardBody>
                                    <CardTitle>Publicaciones</CardTitle>
                                    <AllPublicationsTable isLoading = {this.state.isLoading} publ={this.state.publToDisplay} editPublication={this.editPublication} spaceTypes={this.state.spaceTypes} publisherData = {false}/>
                                </CardBody>
                            </Card>
                        </Col>
                        <Col lg="12">
                            {!this.state.isLoading ? (<Pagination originalArray = {this.state.publ} updateElementsToDisplay = {this.updateElementsToDisplay} />) : (null)} 
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