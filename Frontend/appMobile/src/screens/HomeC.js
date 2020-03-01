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
import { Notifications } from 'expo';
import registerForPushNotificationsAsync from '../common/registerForPushNotificationsAsync';

class HomeC extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchBarFocused: false,
    }
  }

  static navigationOptions = {
    header: null
  };

  componentDidMount() {
     var response = registerForPushNotificationsAsync();
     // Handle notifications that are received or selected while the app
     // is open. If the app was closed and then opened by tapping the
     // notification (rather than just tapping the app icon to open it),
     // this function will fire on the next tick after the app starts
     // with the notification data.
     this._notificationSubscription = Notifications.addListener(this._handleNotification);
  }

  _handleNotification = notification => {
    // do whatever you want to do with the notification
    this.setState({ notification: notification });
  };

  render() {
    return (
      <View style={styles.container}>
        <Header
          leftComponent={{ icon: 'menu', color: '#fff', flex: 1, onPress: () => this.props.navigation.openDrawer() }}
          centerComponent={<SearchBar parentState={this.state} onChange={this.onChange} onSelectionsChangeSpace={this.onSelectionsChangeSpace} navigate={this.props.navigation.navigate} />}
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

export default HomeC;