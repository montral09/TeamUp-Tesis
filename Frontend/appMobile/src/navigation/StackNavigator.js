import React, {Component} from 'react';
import { StyleSheet, Text, View, StatusBar } from 'react-native';
import { createStackNavigator } from 'react-navigation';

import Login from './src/screens/Login';
import Home from './src/screens/Home';

const StackNavigator = createStackNavigator({
  Login: {screen: Login},
  Home: {screen: Home}
});

export default StackNavigator;