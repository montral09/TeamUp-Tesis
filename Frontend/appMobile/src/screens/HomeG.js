import React, { Component } from 'react';
import { StyleSheet, View, ScrollView, BackHandler } from 'react-native';
import { Header } from 'react-native-elements';
import { createDrawerNavigator, createAppContainer } from 'react-navigation';

import Profile from '../screens/Profile';
import SpaceList from '../screens/SpaceList';
import FavoriteSpaceList from '../screens/FavoriteSpaceList';
import ReservationSpaceList from '../screens/ReservationSpaceList';
import RequestBePublisher from '../screens/RequestBePublisher';
import ReservedPublicationsList from '../screens/ReservedPublicationsList';
import DeleteUser from '../screens/DeleteUser';
import LogOut from '../screens/LogOut';

import SearchBar from '../components/searchBar';
import Banner from '../components/BannerScrollView';
import Contact from '../components/contactUs';
import RecommendedPublications from '../components/RecommendedPublications';

class HomeG extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchBarFocused: false,
    }
  }

  static navigationOptions = {
    header: null
  };

  /*componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
  }

  componentWillUnmount() {
      BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  }

  handleBackButton() {
      return true;
  }*/

  render() {

    return (
      <View style={styles.container}>
        <Header
          leftComponent={{ icon: 'menu', color: '#fff', flex: 1, onPress: () => this.props.navigation.openDrawer() }}
          centerComponent={<SearchBar parentState={this.state} onChange={this.onChange} onSelectionsChangeSpace={this.onSelectionsChangeSpace} navigate={this.props.navigation.navigate} />}
          //rightComponent={{ icon: 'home', color: '#fff', flex:1, onPress: () => this.props.navigation.navigate('Home')}}
        />
        <ScrollView vertical>
          <Banner />
          <RecommendedPublications navigate={this.props.navigation.navigate} />
          <Contact />
        </ScrollView>
      </View>


    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2196f3',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const DrawerNavigator = createDrawerNavigator(
  {
    Home: { screen: HomeG },
    Perfil: {
      screen: Profile, navigationOptions: ({ navigation }) => ({
        header: null,
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
        title: 'Mis publicaciones',
      })
    },
    ReservedPublicationsList: {
        screen: ReservedPublicationsList, navigationOptions: ({ navigation }) => ({
          title: 'Mis espacios reservados',
        })
    },
    ReservationSpaceList: {
        screen: ReservationSpaceList, navigationOptions: ({ navigation }) => ({
          title: 'Mis reservas',
        })
      },
    FavoriteSpaceList: {
      screen: FavoriteSpaceList, navigationOptions: ({ navigation }) => ({
        title: 'Mis favoritos',
      })
    },
    DeleteUser: {
      screen: DeleteUser, navigationOptions: ({ navigation }) => ({
        header: null,
        title: 'Darme de baja',
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
  
export default DrawerNavigator;