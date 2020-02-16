import React, { Component } from 'react';
import { StyleSheet, View, ScrollView, BackHandler } from 'react-native';
import { Header } from 'react-native-elements';
import { createDrawerNavigator, createAppContainer } from 'react-navigation';

import Profile from './Profile';
import FavoriteSpaceList from './FavoriteSpaceList';
import ReservationSpaceList from './ReservationSpaceList';
import RequestBePublisher from './RequestBePublisher';
import DeleteUser from './DeleteUser';
import LogOut from './LogOut';

import translations from '../common/translations';

import SearchBar from '../components/searchBar';
import Banner from '../components/BannerScrollView';
import Contact from '../components/contactUs';
import RecommendedPublications from '../components/RecommendedPublications';

class HomeC extends Component {
  constructor(props) {
    super(props);
    const { navigation } = this.props;
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
    Home: { screen: HomeC },
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

export default DrawerNavigator;

/*<Text style={styles.titleText}>
            Destacados
          </Text>
          <View style={{marginTop: 20, elevation: 3}}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
            >
              <SpacesScrollView imageUri={this.uri1} name='Test1'/>
              <SpacesScrollView imageUri={this.uri2} name='Test2'/>
              <SpacesScrollView imageUri={this.uri3} name='Test3'/>

            </ScrollView>
          </View>*/