import React from 'react';
import { Platform, Dimensions } from 'react-native';
import { createDrawerNavigator, createAppContainer } from 'react-navigation';

import Home from '../screens/Home';
import Login from '../screens/Login';

const winWidth = Dimensions.get('window').width;
const DrawerConfig = {
    drawerWidth: winWidth*0.03
}
const DrawerNavigator = createDrawerNavigator({
        Home: {
            screen: Home
        },
        //Esto es una prueba, borrar luego
        Login: {
            screen: Login
        }
    },
    DrawerConfig
})

export default createAppContainer(DrawerNavigator);