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
  console.log(state)
  return state;
}

// <StatusBar backgroundColor="#0069c0" barStyle="light-content"/>
export default function App() {

  return (
    //<View style={styles.container}>
    <Provider store={store}>      
        <Login/>
        <FlashMessage position="top" />
    </Provider>
    //</View>
  );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2196f3',
    alignItems: 'center',
    justifyContent: 'center',
  },
});


