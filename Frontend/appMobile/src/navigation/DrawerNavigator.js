import React, {Component} from 'react';
import { createDrawerNavigator, createAppContainer } from 'react-navigation';
import { StyleSheet, Text, View, StatusBar } from 'react-native';

import HomeG from '../screens/HomeG';
import Profile from '../screens/Profile';
import SpaceList from '../screens/SpaceList';
import FavoriteSpaceList from '../screens/FavoriteSpaceList';
import ReservationSpaceList from '../screens/ReservationSpaceList';
import ReservedPublicationsList from '../screens/ReservedPublicationsList';
import DeleteUser from '../screens/DeleteUser';
import LogOut from '../screens/LogOut';
import translations from '../common/translations';

class DrawerNav extends Component{

    render(){

        return (
            <View style={styles.container}>
                <HomeG navigation={this.props.navigation}/>  
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
      Home: { screen: DrawerNav, navigationOptions: ({ navigation }) => ({
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
      /*Publicar: {
        screen: PublishSpaceMaster, navigationOptions: ({ navigation }) => ({
          header: null,
          title: 'Publicar espacio',
        })
      },*/
      Publicaciones: {
        screen: SpaceList, navigationOptions: ({ navigation }) => ({
          title: translations[navigation.getParam('language', 'default value')].messages['signInLinks_head_myPublications'],
        })
      },
      ReservedPublicationsList: {
          screen: ReservedPublicationsList, navigationOptions: ({ navigation }) => ({
            title: translations[navigation.getParam('language', 'default value')].messages['signInLinks_head_myResSpaces'],
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