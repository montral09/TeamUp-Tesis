import React, {Component} from 'react';
import { StyleSheet, Text, View, ScrollView, Keyboard,TouchableOpacity} from 'react-native';
import { Header } from 'react-native-elements';
import { createDrawerNavigator, createAppContainer } from 'react-navigation';
//import Theme from './theme';


import SignUp from '../screens/SignUp';
import Profile from '../screens/Profile';
import PublishSpaceMaster from '../screens/PublishSpaceMaster';
import SpaceView from '../screens/SpaceView';
import SpaceViewDummy from '../screens/SpaceViewDummy';
import SpaceList from '../screens/SpaceList';
import FavoriteSpaceList from '../screens/FavoriteSpaceList';
import ReservationSpaceList from '../screens/ReservationSpaceList';
import RequestBePublisher from '../screens/RequestBePublisher';
import ReservedPublicationsList from '../screens/ReservedPublicationsList';

import Globals from '../Globals';

import SearchPublications from './SearchPublications';

import MenuButton from '../components/MenuButton';
import SearchBar from '../components/SearchBar';
import Banner from '../components/BannerScrollView';
import SpacesScrollView from '../components/SpacesScrollView';
import Contact from '../components/contactUs';
import RecommendedPublications from '../components/RecommendedPublications';

//Imagenes de prueba
const uri1 = 'https://cdn.pixabay.com/photo/2016/11/07/19/25/meeting-room-1806702_960_720.jpg';
const uri2 = 'https://cdn.pixabay.com/photo/2015/05/15/14/22/conference-room-768441_960_720.jpg';
const uri3 = 'https://cdn.pixabay.com/photo/2015/04/20/06/43/meeting-room-730679_960_720.jpg';

class Home extends Component{
  constructor(props){
    super(props);
      this.state = {
        searchBarFocused: false,
      }
  }

  static navigationOptions = {
    header: null
  };

  render(){
        
    return (
      <View style={styles.container}>
        <Header
          leftComponent={{ icon: 'menu', color: '#fff', flex:1, onPress: () => this.props.navigation.openDrawer()}}
          centerComponent={<SearchBar parentState={this.state} onChange={this.onChange} onSelectionsChangeSpace={this.onSelectionsChangeSpace} navigate={this.props.navigation.navigate}/>}
          //rightComponent={{ icon: 'home', color: '#fff', flex:1, onPress: () => this.props.navigation.navigate('Home')}}
        />
        <ScrollView vertical>
          <Banner/>     
          <RecommendedPublications navigate={this.props.navigation.navigate}/>
          <Contact/>
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
  Home: {screen: Home},
  Perfil: {screen: Profile, navigationOptions: ({ navigation }) => ({
                              header: null,
                            })},
  Publicar: {screen: PublishSpaceMaster, navigationOptions: ({ navigation }) => ({
                                     header: null,
                                     title: 'Publicar espacio',
                                   })},
  Publicaciones: {screen: SpaceList, navigationOptions: ({ navigation }) => ({
                                     header: null,
                                     title: 'Ver publicaciones de gestor',
                                   })},
  /*SearchPublications: {screen: SearchPublications, navigationOptions: ({ navigation }) => ({
                              header: null,
                    })},*/
  FavoriteSpaceList: {screen: FavoriteSpaceList, navigationOptions: ({ navigation }) => ({
                              header: null,
                              title: 'Mis favoritos',
                    })},
  ReservationSpaceList: {screen: ReservationSpaceList, navigationOptions: ({ navigation }) => ({
                              header: null,
                              title: 'Mis reservas',
                    })}, 
  ReservedPublicationsList: {screen: ReservedPublicationsList, navigationOptions: ({ navigation }) => ({
                              header: null,
                              title: 'Mis espacios reservados',
                    })}, 
  RequestBePublisher: {screen: RequestBePublisher, navigationOptions: ({ navigation }) => ({
                              header: null,
                              title: 'Quiero publicar',
                    })},               
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