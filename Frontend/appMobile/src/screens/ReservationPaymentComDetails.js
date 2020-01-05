import React, {Component} from 'react';
import { StyleSheet, Text, View, ScrollView, Keyboard, TouchableOpacity} from 'react-native';
import { connect } from 'react-redux';

import { logOut, updateToken } from '../redux/actions/accountActions';

import Globals from '../Globals';

class ReservationPaymentComDetails extends Component {




}

const mapStateToProps = (state) => {
    return {
        login_status: state.loginData.login_status,
        tokenObj: state.loginData.tokenObj,
        userData: state.loginData.userData,
    }
}

const mapDispatchToProps = (dispatch) =>{
    return{
        logOut: () => dispatch(logOut()),
        updateToken: (tokenObj) => dispatch(updateToken(tokenObj))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ReservationPaymentComDetails);