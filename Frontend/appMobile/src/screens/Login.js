import React, {Component} from 'react';
import { StyleSheet, Text, View, StatusBar, KeyboardAvoidingView } from 'react-native';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import { connect } from 'react-redux';

import Logo from '../components/Logo';
import Form from '../components/Form';
import HomeC from './HomeC';
import HomeG from './HomeG';
import SignUp from './SignUp';
import PasswordRecovery from './PasswordRecovery';
import SpaceView from './SpaceView';
import SearchPublications from './SearchPublications';
import ErrorScreen from './ErrorScreen';
import ReservationResComPay from './ReservationResComPay';
import ReservationReqInfo from './ReservationReqInfo';
import ReservationCustResPay from './ReservationCustResPay';
import ReservationResCustPay from './ReservationResCustPay';
import ReservationEditResCustPay from './ReservationEditResCustPay';
import ReserveSpace from './ReserveSpace';
import ReserveSpaceSummary from './ReserveSpaceSummary';
import QAAnswer from './QAAnswer';
import DrawerNavigator from '../navigation/DrawerNavigator';
import DrawerNavigatorC from '../navigation/DrawerNavigatorC';
import TermsAndConditions from '../common/termsAndConditions';

import translations from '../common/translations';


class Login extends Component{
   constructor() {
    super();
    this.state = {
        language: 'es',
    }
}



  static navigationOptions = {
    header: null,   
  };
   

   changeParentLanguage = (value) => {
     this.setState({language:value});
   }
   
   render(){

        return (
            <KeyboardAvoidingView style={styles.container}>
              <StatusBar backgroundColor="#0069c0" barStyle="light-content"/>
              <Logo/>
              <Form changeParentLanguage={this.changeParentLanguage}/>
              <View style={styles.signupTextCont}>
                {this.state.language === 'es' ? (<Text style={styles.signupText}>{translations.es.messages['login_dontHaveAccount']}</Text>):(<Text style={styles.signupText}>{translations.en.messages['login_dontHaveAccount']}</Text>)}
                {this.state.language === 'es' ? (<Text style={styles.signupButton} onPress={() => {this.props.navigation.navigate('SignUp')}}> {translations.es.messages['registerYourself_w']}</Text>):(<Text style={styles.signupButton} onPress={() => {this.props.navigation.navigate('SignUp')}}> {translations.en.messages['registerYourself_w']}</Text>)}
                
              </View>
            </KeyboardAvoidingView>
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
  DrawerNavigator: {screen: DrawerNavigator, navigationOptions: ({ navigation }) => ({
                        header: null,
                    })},
  DrawerNavigatorC: {screen: DrawerNavigatorC, navigationOptions: ({ navigation }) => ({
                        header: null,
                    })},
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
  ReservationResComPay: {screen: ReservationResComPay, navigationOptions: ({ navigation }) => ({
                              header: null,
                    })},
  ReservationReqInfo: {screen: ReservationReqInfo, navigationOptions: ({ navigation }) => ({
                              header: null,
                    })},
  ReservationEditResCustPay: {screen: ReservationEditResCustPay, navigationOptions: ({ navigation }) => ({
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
  TermsAndConditions: {screen: TermsAndConditions, navigationOptions: ({ navigation }) => ({
                          header: null,
                      })},
  ErrorScreen: {screen: ErrorScreen, navigationOptions: ({ navigation }) => ({
                              header: null,
                    })},
  
 });

const AppContainer = createAppContainer(StackNavigator)

export default AppContainer;


