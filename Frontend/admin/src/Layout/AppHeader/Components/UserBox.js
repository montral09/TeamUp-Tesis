import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { logOut } from '../../../reducers/auth/actions';
import Login from '../../../DemoPages/Login';
import {
    DropdownToggle, DropdownMenu,
    Nav, NavItem, UncontrolledButtonDropdown
} from 'reactstrap';

import { faAngleDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import avatar1 from '../../../assets/utils/images/avatars/1.png';

class UserBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            active: false,
        };
        if (!this.props.adminData.Mail) {
            this.props.logOut()
        }
    }

    render() {

        return (
            <Fragment>
                <div className="header-btn-lg pr-0">
                    <div className="widget-content p-0">
                        <div className="widget-content-wrapper">
                            {this.props.adminData.Mail ? (
                                <Fragment>
                                    <div className="widget-content-left">

                                        <UncontrolledButtonDropdown>
                                            {
                                                <DropdownToggle color="link" className="p-0">
                                                    <img width={42} className="rounded-circle" src={avatar1} alt="" />
                                                    <FontAwesomeIcon className="ml-2 opacity-8" icon={faAngleDown} />
                                                </DropdownToggle>
                                            }
                                            <DropdownMenu right className="rm-pointers dropdown-menu-lg">
                                                <Nav vertical>
                                                    <NavItem>
                                                        <a onClick={() => (this.props.logOut())}><i className='pe-7s-back-2'> </i> Cerrar sesión</a>
                                                    </NavItem>
                                                </Nav>
                                            </DropdownMenu>
                                        </UncontrolledButtonDropdown>
                                    </div>
                                    <div className="widget-content-left  ml-3 header-user-info">
                                        <div className="widget-heading">
                                            Administrador
                                                            </div>
                                        <div className="widget-subheading">
                                            {this.props.adminData.Mail}
                                        </div>
                                    </div>
                                </Fragment>
                            ) : (

                                    <Login />
                                )}

                        </div>
                    </div>
                </div>
            </Fragment>
        )
    }
}
const mapStateToProps = (state) => {
    return {
        adminData: state.loginData.adminData,
        admTokenObj: state.loginData.admTokenObj,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        logOut: () => dispatch(logOut())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserBox);