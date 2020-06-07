import React, { Fragment, Component } from 'react';
import { connect } from 'react-redux';
import {Button} from 'reactstrap';

// Extra
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import PageTitle from '../../../Layout/AppMain/PageTitle';
import ModifyPublicationModal from '../modifyPublication';
import AllPublicationsTable from './AllPublicationsTable'
import { callAPI } from '../../../config/genericFunctions';
import {MAX_ELEMENTS_PER_TABLE} from '../../../config/constants';

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
        const adminMail = props.adminData.Mail;

        this.state = {
            allPubl: null,
            allPublToDisplay : null,
            admTokenObj: admTokenObj,
            adminMail: adminMail,
            spaceTypes: null,
            facilities: [],
            pagination: [1],
            currentPage: 1,
            totalPages: 1,
            totalPublications: 0
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
            "PublicationsPerPage": MAX_ELEMENTS_PER_TABLE,
            "PageNumber": parseInt(this.state.currentPage) - 1,        
        }
        objApi.fetchUrl = "api/publications";
        objApi.method = "POST";
        objApi.successMSG = {
            SUCC_PUBLICATIONSOK : '',
        };
        objApi.functionAfterSuccess = "getAllPublications";
        callAPI(objApi, this);
    }

    changePage = (pageSelected) =>{
        this.setState({currentPage : pageSelected}, () => {this.loadAllPublications()})
    }

    // This function will trigger the save function inside the modal to update the values
    editPublication = (key) => {
        const publData = this.state.allPublToDisplay.filter(publ => {
            return publ.IdPublication === key
        });
        this.modalElement.current.toggle(publData[0], this.state.admTokenObj, this.props.adminData, this.state.spaceTypes, this.state.facilities);
    }

    pauseUnpausePub = (state, idpub) =>{

        var newState = "";
        if(state == "ACTIVE"){
            if(!window.confirm('Desea pausar la publicación?')){
                return;
            }
            newState = 'PAUSED A';
        }else if (state == "PAUSED A"){
            if(!window.confirm('Desea reanudar la publicación?')){
                return;
            }
            newState = 'ACTIVE';
        }
        this.setState({
            allPubl : null, allPublToDisplay: null
        });
        var objApi = {};    
        objApi.objToSend ={
        Mail: this.state.adminMail,
        RejectedReason : "",
        OldState: state,
        NewState: newState,
        AccessToken: this.state.admTokenObj.accesToken,
        IdPublication: idpub
        }
        objApi.fetchUrl = "api/publication";
        objApi.method = "PUT";
        objApi.successMSG = {
            SUCC_PUBLICATIONUPDATED : 'Solicitud ejecutada correctamente',
        };
        objApi.functionAfterSuccess = "pauseUnpausePub";
        callAPI(objApi, this);     
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
                            <br />
                            {this.state.allPubl != null ? (
                                <div className="row pagination-results">
                                    <div className="col-md-6 text-left">
                                        <ul className="pagination">
                                            {this.state.pagination.map(page => {
                                                return (
                                                    <Button className="mb-2 mr-2" key={page} {... (this.state.currentPage === page ? {active: true} : {})} onClick={() => this.changePage(page)} color="primary">{page}</Button>
                                                );
                                            })}
                                        </ul>
                                    </div>
                                    <div className="col-md-6 text-right">Mostrando {this.currentPage == 1 ? (this.state.allPublToDisplay.length) : ( (MAX_ELEMENTS_PER_TABLE * this.state.currentPage) - (MAX_ELEMENTS_PER_TABLE - this.state.allPubl.length ) )} de {this.state.totalPublications}</div>
                                </div>
                            ) : (null)}
                        
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