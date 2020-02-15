import React, {Component} from 'react';
import { StyleSheet, Text, View, StatusBar } from 'react-native';
import { createStackNavigator, createAppContainer } from 'react-navigation';

import Logo from '../components/Logo';
import Form from '../components/Form';
import HomeC from './HomeC';
import HomeG from './HomeG';
import SignUp from './SignUp';
import PasswordRecovery from './PasswordRecovery';
import SpaceView from './SpaceView';
import SearchPublications from './SearchPublications';
import ErrorScreen from './ErrorScreen';
import ReservationPaymentComDetails from './ReservationPaymentComDetails';
import ReservationReqInfo from './ReservationReqInfo';
import ReservationCustResPay from './ReservationCustResPay';
import ReservationResCustPay from './ReservationResCustPay';
import ReserveSpace from './ReserveSpace';
import ReserveSpaceSummary from './ReserveSpaceSummary';
import QAAnswer from './QAAnswer';

class Login extends Component{
   static navigationOptions = {
     header: null
   };
   
   render(){

        return (
            <View style={styles.container}>
              <StatusBar backgroundColor="#0069c0" barStyle="light-content"/>
              <Logo/>
              <Form/>
              <View style={styles.signupTextCont}>
                <Text style={styles.signupText}>¿No tienes una cuenta?</Text>
                <Text style={styles.signupButton} onPress={() => {this.props.navigation.navigate('SignUp')}}> Regístrate</Text>
              </View>
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
  signupTextCont: {
    flexGrow: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingVertical: 16
  },
  signupText: {
    color: 'rgba(255,255,255,1.0)',
    fontSize:16
  },
  signupButton: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10
  }
});

const StackNavigator = createStackNavigator({
  Login: {screen: Login},
  HomeC: {screen: HomeC, navigationOptions: ({ navigation }) => ({
                              header: null,
                       })},
  HomeG: {screen: HomeG, navigationOptions: ({ navigation }) => ({
                            header: null,
                      })},
  SignUp: {screen: SignUp, navigationOptions: ({ navigation }) => ({
                              header: null,
                       })},
  PasswordRecovery: {screen: PasswordRecovery, navigationOptions: ({ navigation }) => ({
                              header: null,
                    })},
  /*PublishSpaceStep2: {screen: PublishSpaceStep2, navigationOptions: ({ navigation }) => ({
                              header: null,
                      })},*/
  SpaceView: {screen: SpaceView, navigationOptions: ({ navigation }) => ({
                              header: null,
                    })},
  SearchPublications: {screen: SearchPublications, navigationOptions: ({ navigation }) => ({
                              header: null,
                    })},
  ReservationCustResPay: {screen: ReservationCustResPay, navigationOptions: ({ navigation }) => ({
                              header: null,
                    })},      
  ReservationResCustPay: {screen: ReservationResCustPay, navigationOptions: ({ navigation }) => ({
                              header: null,
                    })},            
  ReservationPaymentComDetails: {screen: ReservationPaymentComDetails, navigationOptions: ({ navigation }) => ({
                              header: null,
                    })},
  ReservationReqInfo: {screen: ReservationReqInfo, navigationOptions: ({ navigation }) => ({
                              header: null,
                    })},
  ReserveSpace: {screen: ReserveSpace, navigationOptions: ({ navigation }) => ({
                    header: null,
                })},
  ReserveSpaceSummary: {screen: ReserveSpaceSummary, navigationOptions: ({ navigation }) => ({
                  header: null,
                })},                
  QAAnswer: {screen: QAAnswer, navigationOptions: ({ navigation }) => ({
                header: null,
            })},
  ErrorScreen: {screen: ErrorScreen, navigationOptions: ({ navigation }) => ({
                              header: null,
                    })},
  
 });

const AppContainer = createAppContainer(StackNavigator)

export default AppContainer;


