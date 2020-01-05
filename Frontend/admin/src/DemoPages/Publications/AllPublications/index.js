import React, { Fragment, Component } from 'react';
// Extra

import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import PageTitle from '../../../Layout/AppMain/PageTitle';
import ModifyPublicationModal from '../modifyPublication';
import AllPublicationsTable from './AllPublicationsTable'
import { callAPI } from '../../../config/genericFunctions';
import { connect } from 'react-redux';

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
            admTokenObj: admTokenObj,
            adminMail: adminMail,
            spaceTypes: [],
            facilities: []
        }
        this.modalElement = React.createRef(); // esto hace unas magias para cambiar el estado de un componente hijo
        this.modalElementAppRej = React.createRef();
        this.updateTable = this.updateTable.bind(this);
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

    // This function will trigger when the component is mounted, to fill the data from the state
    componentDidMount() {
        this.updateTable();
        this.loadInfraestructure()
    }

    updateTable(){
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
        const publData = this.state.publ.filter(publ => {
            return publ.IdPublication === key
        });

        this.modalElement.current.toggle(publData[0],this.state.admTokenObj,this.props.adminData, this.state.spaceTypes, this.state.facilities);
    }

    // This funciton will call the api to submit the publisher
 

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
                        <ModifyPublicationModal ref = {this.modalElement} updateTable={this.updateTable} disableFields = {false}/>                        
                        <Col lg="12">
                            <Card className="main-card mb-3">
                                <CardBody>
                                    <CardTitle>Publicaciones</CardTitle>
                                    <AllPublicationsTable publ={this.state.publ} editPublication={this.editPublication} spaceTypes={this.state.spaceTypes} publisherData = {false}/>
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

export default connect(mapStateToProps)(AllPublications)