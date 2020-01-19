import React, { Fragment, Component } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import PageTitle from '../../../Layout/AppMain/PageTitle';
import AllUsersTable from './AllUsersTable';
import ModifyUserModal from './ModifyUser';
import { connect } from 'react-redux';
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
            arrData: [],
            admTokenObj: this.props.admTokenObj,
            adminData: this.props.adminData,
            isLoading : true,
        }
        this.modalElement = React.createRef(); // esto hace unas magias para cambiar el estado de un componente hijo
    }
    
    // This function will trigger the save function inside the modal to update the values
    editUser = (key) => {
        const userData = this.state.arrData.filter(usr => {
            return usr.Mail === key
        });

        this.modalElement.current.toggle(userData[0],this.state.admTokenObj,this.state.adminData);
    }

    updateTable = () => {
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

    // This function will trigger when the component is mounted, to fill the data from the state
    componentDidMount() {
        this.updateTable();
    }

    render() {

        return (
            <Fragment>
                <PageTitle
                    heading="Tabla con todos los usuarios del sistema"
                    subheading="En esta pantalla se mostrarán todos los usuarios registrados"
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
                        <ModifyUserModal ref = {this.modalElement} updateTable={this.updateTable}/>
                        <Col lg="12">
                            <Card className="main-card mb-3">
                                <CardBody>
                                    <CardTitle>Tabla de usuarios</CardTitle>
                                    <AllUsersTable arrData={this.state.arrData} editUser={this.editUser} isLoading ={this.state.isLoading} />
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
        login_status: state.loginData.login_status,
        adminData: state.loginData.adminData,
        admTokenObj: state.loginData.admTokenObj,
    }
}

export default connect(mapStateToProps,null)(AllUsers);
