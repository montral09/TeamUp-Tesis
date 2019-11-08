import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import Login from '../Login';
import Main from '../Main';
 
class Home extends React.Component {

    constructor(props) {
        super(props);
    }
    render() {
       let { login_status } = this.props;
       let showMainOrLogin = login_status == 'LOGGED_IN' ? <Main /> : <Login />
       return (
        <Fragment>
             {showMainOrLogin}
        </ Fragment>
       
       );
    }
 }
 const mapStateToProps = (state) =>{
    return {
        login_status: state.loginData.login_status,
    }
}

export default connect(mapStateToProps, null)(Home);