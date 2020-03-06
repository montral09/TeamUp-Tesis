import React, { Fragment, Component } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { connect } from 'react-redux';

// Extra
import PageTitle from '../../../Layout/AppMain/PageTitle';
import AllUsersTable from './AllUsersTable';
import ModifyUserModal from './ModifyUser';
import Pagination from '../../Common/pagination';
import { callAPI } from '../../../config/genericFunctions'

// Table
import {
    Row, Col,
    Card, CardBody,
    CardTitle
} from 'reactstrap';

class AllUsers extends Component {
    constructor(props) {
        super(props);
        this.state = {
            arrDataUsers: [],
            arrDataUsersToDisplay: [],
            admTokenObj: this.props.admTokenObj,
            adminData: this.props.adminData,
            isLoading : true,
        }
        this.modalElement = React.createRef(); // esto hace unas magias para cambiar el estado de un componente hijo
    }
    
    // This function will trigger the save function inside the modal to update the values
    editUser = (key) => {
        const userData = this.state.arrDataUsers.filter(usr => {
            return usr.Mail === key
        });

        this.modalElement.current.toggle(userData[0],this.state.admTokenObj,this.state.adminData);
    }

    loadUsers = () => {
        var objApi = {};
        objApi.objToSend = {
            Mail: this.state.adminData.Mail,
            AccessToken: this.state.admTokenObj.accesToken
        }
        objApi.fetchUrl = "api/users";
        objApi.method = "POST";
        objApi.successMSG = {
            SUCC_USERSOK : '',
        };
        objApi.functionAfterSuccess = "getUsers";
        callAPI(objApi, this);        
    }

    updateElementsToDisplay = (toDisplayArray) => {
        this.setState({arrDataUsersToDisplay : toDisplayArray})
    }

    // This function will trigger when the component is mounted, to fill the data from the state
    componentDidMount() {
        this.loadUsers();
    }

    render() {

        return (
            <Fragment>
                <PageTitle
                    heading="Tabla con todos los usuarios del sistema"
                    subheading="En esta pantalla se mostrarán todos los usuarios registrados"
                    icon="pe-7s-users icon-gradient bg-happy-itmeo"
                />
                <ReactCSSTransitionGroup
                    component="div"
                    transitionName="TabsAnimation"
                    transitionAppear={true}
                    transitionAppearTimeout={0}
                    transitionEnter={false}
                    transitionLeave={false}>
                    <Row>
                        <ModifyUserModal ref = {this.modalElement} updateTable={this.loadUsers}/>
                        <Col lg="12">
                            <Card className="main-card mb-3">
                                <CardBody>
                                    <CardTitle>Tabla de usuarios</CardTitle>
                                    <AllUsersTable arrData={this.state.arrDataUsersToDisplay} editUser={this.editUser} isLoading ={this.state.isLoading} />
                                </CardBody>
                            </Card>
                        </Col>
                        <Col lg="12">
                            {!this.state.isLoading ? (<Pagination originalArray = {this.state.arrDataUsers} updateElementsToDisplay = {this.updateElementsToDisplay} />) : (null)} 
                        </Col>
                    </Row>
                </ReactCSSTransitionGroup>
            </Fragment>
        );
    }
}
const mapStateToProps = (state) => {
    return {
        login_status: state.loginData.login_status,
        adminData: state.loginData.adminData,
        admTokenObj: state.loginData.admTokenObj,
    }
}

export default connect(mapStateToProps,null)(AllUsers);
