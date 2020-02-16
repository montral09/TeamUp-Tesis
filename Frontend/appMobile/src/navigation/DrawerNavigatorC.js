import React, {Component} from 'react';
import { createDrawerNavigator, createAppContainer } from 'react-navigation';
import { StyleSheet, Text, View, StatusBar } from 'react-native';

import HomeC from '../screens/HomeC';
import Profile from '../screens/Profile';
import FavoriteSpaceList from '../screens/FavoriteSpaceList';
import ReservationSpaceList from '../screens/ReservationSpaceList';
import RequestBePublisher from '../screens/RequestBePublisher';
import DeleteUser from '../screens/DeleteUser';
import LogOut from '../screens/LogOut';
import translations from '../common/translations';

class DrawerNavC extends Component{

    render(){

        return (
            <View style={styles.container}>
                <HomeC navigation={this.props.navigation}/>  
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#2196f3',
},
});

const DrawerNavigator = createDrawerNavigator(
    {
      Home: { screen: DrawerNavC, navigationOptions: ({ navigation }) => ({
                header: null,
                title: 'Home' 
            })
      },
      Perfil: {
        screen: Profile, navigationOptions: ({ navigation }) => ({
          header: null,
          title: translations[navigation.getParam('language', 'default value')].messages['signInLinks_head_myAccount'],
        })
      },
      ReservationSpaceList: {
        screen: ReservationSpaceList, navigationOptions: ({ navigation }) => ({
          title: translations[navigation.getParam('language', 'default value')].messages['signInLinks_head_myReservations'],
        })
      },
      FavoriteSpaceList: {
        screen: FavoriteSpaceList, navigationOptions: ({ navigation }) => ({
          title: translations[navigation.getParam('language', 'default value')].messages['signInLinks_head_favorites'],
        })
      },
      RequestBePublisher: {
        screen: RequestBePublisher, navigationOptions: ({ navigation }) => ({
          header: null,
          title: translations[navigation.getParam('language', 'default value')].messages['signInLinks_wantToPublish'],
        })
      },
      DeleteUser: {
        screen: DeleteUser, navigationOptions: ({ navigation }) => ({
          header: null,
          title: translations[navigation.getParam('language', 'default value')].messages['signInLinks_head_deleteUser'],
        })
      },
      LogOut: {
        screen: LogOut, navigationOptions: ({ navigation }) => ({
          header: null,
          title: 'Log Out',
        })
      },
    },
    {
      drawerBackgroundColor: '#0069c0',
      contentOptions: {
        labelStyle: {
          color: 'white',
        }
      }
  });
    
const AppContainer = createAppContainer(DrawerNavigator)

export default  AppContainer;