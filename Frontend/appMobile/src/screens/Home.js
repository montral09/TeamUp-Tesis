import React, {Component} from 'react';
import { StyleSheet, Text, View, ScrollView, Keyboard} from 'react-native';
import { Header } from 'react-native-elements';
import { createDrawerNavigator, createAppContainer } from 'react-navigation';
//import Theme from './theme';

import SignUp from '../screens/SignUp';
import Profile from '../screens/Profile';

import MenuButton from '../components/MenuButton';
import SearchBar from '../components/searchBar';
import Banner from '../components/BannerScrollView';
import SpacesScrollView from '../components/SpacesScrollView';
import Contact from '../components/contactUs';

//Imagenes de prueba
const uri1 = 'https://cdn.pixabay.com/photo/2016/03/28/09/34/bedroom-1285156_960_720.jpg';
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
        <ScrollView vertical>
          <Header
            leftComponent={{ icon: 'menu', color: '#fff', flex:1, onPress: () => this.props.navigation.openDrawer()}}
            centerComponent={<SearchBar/>}
            //rightComponent={{ icon: 'home', color: '#fff', flex:1, onPress: () => this.props.navigation.navigate('Home')}}
          />
          <Banner/>      
          <Text style={styles.titleText}>
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
          </View>
          <Text style={styles.titleText}>
            Recomendados
          </Text> 
          <View style={{marginTop: 20}}>   
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
            >
              <SpacesScrollView imageUri={this.uri1} name='Test1'/>
              <SpacesScrollView imageUri={this.uri2} name='Test2'/>
              <SpacesScrollView imageUri={this.uri3} name='Test3'/>

            </ScrollView>
          </View>
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
  titleText:{
    fontSize: 32, 
    fontWeight: 'bold',
    color: "#FFF",
    marginTop: 20,
    marginLeft: 20,
    marginBottom: 5,
  },
});

const DrawerNavigator = createDrawerNavigator(
{
  Home: {screen: Home},
  Perfil: {screen: Profile, navigationOptions: ({ navigation }) => ({
                              header: null,
                            })},
  Test: {screen: SignUp},
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