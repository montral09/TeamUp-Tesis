import React, { Component } from 'react';
import { StyleSheet, View, ScrollView} from 'react-native';
import { Header } from 'react-native-elements';
import { connect } from 'react-redux';
import SearchBar from '../components/searchBar';
import Banner from '../components/BannerScrollView';
import Contact from '../components/contactUs';
import RecommendedPublications from '../components/RecommendedPublications';
import { Notifications } from 'expo';
import registerForPushNotificationsAsync from '../common/registerForPushNotificationsAsync';



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
    var response = registerForPushNotificationsAsync();
    // Handle notifications that are received or selected while the app
    // is open. If the app was closed and then opened by tapping the
    // notification (rather than just tapping the app icon to open it),
    // this function will fire on the next tick after the app starts
    // with the notification data.
    this._notificationSubscription = Notifications.addListener(this._handleNotification);
  }

  _handleNotification = notification => {
    this.setState({ notification: notification });
  };

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