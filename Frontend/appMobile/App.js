import React from 'react';
import { StyleSheet, Text, View, StatusBar } from 'react-native';

import Login from './src/screens/Login';

// <StatusBar backgroundColor="#0069c0" barStyle="light-content"/>
export default function App() {

  return (
    //<View style={styles.container}>
        <Login/>
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


