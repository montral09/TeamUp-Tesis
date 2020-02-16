import React, { Component } from 'react';
import { StyleSheet, View, ScrollView, BackHandler } from 'react-native';
import { Header } from 'react-native-elements';
import { createDrawerNavigator, createAppContainer } from 'react-navigation';
import { connect } from 'react-redux';
import Profile from '../screens/Profile';
import SpaceList from '../screens/SpaceList';
import FavoriteSpaceList from '../screens/FavoriteSpaceList';
import ReservationSpaceList from '../screens/ReservationSpaceList';
import RequestBePublisher from '../screens/RequestBePublisher';
import ReservedPublicationsList from '../screens/ReservedPublicationsList';
import DeleteUser from '../screens/DeleteUser';
import LogOut from '../screens/LogOut';
import translations from '../common/translations';
import SearchBar from '../components/searchBar';
import Banner from '../components/BannerScrollView';
import Contact from '../components/contactUs';
import RecommendedPublications from '../components/RecommendedPublications';
import { Notifications } from 'expo';
import registerForPushNotificationsAsync from '../common/registerForPushNotificationsAsync';
import { DrawerActions } from 'react-navigation-drawer';


class HomeG extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchBarFocused: false,
      notification: {},
    }
  }

  static navigationOptions = {
    header: null
  };

  componentDidMount() {
    console.log(this.props)
    //BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    console.log('before calling registerForPushNotificationsAsync');
    var response = registerForPushNotificationsAsync();
    console.log ('afterResponse' + response);
    console.log('after calling registerForPushNotificationsAsync');
    // Handle notifications that are received or selected while the app
    // is open. If the app was closed and then opened by tapping the
    // notification (rather than just tapping the app icon to open it),
    // this function will fire on the next tick after the app starts
    // with the notification data.
    this._notificationSubscription = Notifications.addListener(this._handleNotification);
    console.log('after calling _notificationSubscription');
  }

  _handleNotification = notification => {
    this.setState({ notification: notification });
  };

  /*
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
          leftComponent={{ icon: 'menu', color: '#fff', flex: 1, onPress: () => this.props.navigation.openDrawer()}}
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

const mapStateToProps = (state) => {
  return {
      userData: state.loginData.userData,
      systemLanguage: state.loginData.systemLanguage
  }
}

export default connect(mapStateToProps)(HomeG);