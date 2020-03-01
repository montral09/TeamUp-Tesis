import React from 'react';
import { StyleSheet, Text, View, StatusBar } from 'react-native';
import {createStore} from 'redux';
import {Provider} from 'react-redux';
import FlashMessage from "react-native-flash-message";

import Login from './src/screens/Login';
import store from './src/redux/store/store';

const userDataState = {
    data: null
}

const reducer = (state = userDataState, action) => {
  return state;
}

export default function App() {

  return (
    <Provider store={store}>      
        <Login/>
        <FlashMessage position="top" />
    </Provider>
  );

}




