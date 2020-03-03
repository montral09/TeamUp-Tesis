import React, {Component} from 'react';
import { StyleSheet, Text, View, ScrollView, Keyboard, TouchableOpacity, ActivityIndicator} from 'react-native';
import { connect } from 'react-redux';
import { Header } from 'react-native-elements';
import { callAPI } from '../common/genericFunctions';
import { MAX_ELEMENTS_PER_TABLE, ML_MODE } from '../common/constants';
import translations from '../common/translations';

import ReservationSpacesListScrollView from '../components/ReservationSpacesListScrollView';


class ReservationSpaceList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loadingReservations : true,
            loadingStatusChange: false,
            reservationId : null,
            reservations : [],
            reservationsToDisplay: [],
            modalConfigObj : {},
            generalError : false,
            selectedIdRes : null,
            selectedResState : "",
            pagination: [1],
            currentPage: 1,
        }
    }

    componentDidMount() {
        this.loadMyReservationsMRSL();
        this.willFocusSubscription = this.props.navigation.addListener(
          'willFocus',
          () => {
            this.setState({ loadingReservations : true });
            this.loadMyReservationsMRSL();
          }
        );
      }
    
    componentWillUnmount() {
        this.willFocusSubscription.remove();
    }

    changePage = (pageClicked) => {
        this.setState({ reservationsToDisplay: this.filterPaginationArray(this.state.reservations, (pageClicked - 1) * MAX_ELEMENTS_PER_TABLE), currentPage: pageClicked },
            () => this.setState({ reservationsToDisplay: this.filterPaginationArray(this.state.reservations, (pageClicked - 1) * MAX_ELEMENTS_PER_TABLE), currentPage: pageClicked }))
    }

    filterPaginationArray = (arrayToFilter, startIndex) => {
        return arrayToFilter.slice(startIndex, startIndex + MAX_ELEMENTS_PER_TABLE)
    }

    loadMyReservationsMRSL = () => {
        var objApi = {};
        objApi.objToSend = {
            "AccessToken": this.props.tokenObj.accesToken,
            "Mail": this.props.userData.Mail
        }
        objApi.fetchUrl = "api/reservationCustomer";
        objApi.method = "POST";
        objApi.successMSG = {
            SUCC_RESERVATIONSOK: '',
        };
        objApi.functionAfterSuccess = "loadMyReservationsMRSL";
        objApi.errorMSG = {}
        callAPI(objApi, this);
    }

    triggerScreen = (mode, IdReservation, auxParam) => {
        var screenConfigObj = {};
        switch (mode) {
            case "CANCEL": 
                screenConfigObj ={
                    title: translations[this.props.systemLanguage].messages['myReservedSpacesList_modalCancel_header'], mainText: translations[this.props.systemLanguage].messages['myReservedSpacesList_modalCancel_main'], mode : mode, saveFunction : "saveCancelRP", textboxLabel: translations[this.props.systemLanguage].messages['comment_w'],
                    textboxDisplay:true, cancelAvailable:true, confirmAvailable:true, cancelText : translations[this.props.systemLanguage].messages['no_w'], confirmText : translations[this.props.systemLanguage].messages['yes_w'] , login_status: this.props.login_status
                };
                this.props.navigation.navigate('ReservationReqInfo', {screenConfig: screenConfigObj, selectedIdRes: IdReservation, selectedResStateParam: auxParam});
            break;
            case "RATE":
                screenConfigObj = {
                    title: translations[this.props.systemLanguage].messages['myReservedSpacesList_modalRate_header'], mainText: translations[this.props.systemLanguage].messages['myReservedSpacesList_modalRate_main'], mode: mode, saveFunction: "saveRateMRSL", textboxLabel: translations[this.props.systemLanguage].messages['comment_w'],
                    textboxDisplay: true, cancelAvailable: true, confirmAvailable: true, cancelText: translations[this.props.systemLanguage].messages['cancel_w'], confirmText: translations[this.props.systemLanguage].messages['rate_w'], login_status: this.props.login_status,
                    optionDisplay: ML_MODE != 'ON', optionLabel: translations[this.props.systemLanguage].messages['score_w']
                };
                this.props.navigation.navigate('ReservationReqInfo', {screenConfig: screenConfigObj, selectedIdRes: IdReservation, selectedResState: auxParam});
                break;
            case "PAYCUSTRES":
                this.props.navigation.navigate('ReservationCustResPay', {IdReservationParam: IdReservation, auxParam: auxParam});
                break;
            case "EDIT":
                const resData = this.state.reservations.filter(res => {
                    return res.IdReservation === IdReservation
                });
                this.props.navigation.navigate('ReservationEditResCustPay', {auxParam: resData[0]});
                break;
        }
    }

    render() {
        const { systemLanguage } = this.props;
        return (
            <>
            {this.state.loadingReservations || this.state.loadingStatusChange ? 
            (
                <ActivityIndicator
                    animating = {this.state.loadingReservations || this.state.loadingStatusChange ? true : false}
                    color = 'white'
                    size = "large"
                    style = {styles.activityIndicator}
                />      
            ) : 
            (
                <View style={styles.container}>
                    <Header
                        leftComponent={{ icon: 'menu', color: '#fff', flex:1, onPress: () => this.props.navigation.openDrawer()}}
                        rightComponent={{ icon: 'home', color: '#fff', flex:1, onPress: () => this.props.navigation.navigate('Home')}}
                    />
                    <>
                    {this.state.reservationsToDisplay.length > 0 ? (
                    <>                   
                    <Text style={styles.titleText}>{translations[systemLanguage].messages['signInLinks_head_myReservations']}</Text>
                    <ScrollView vertical>
                        <View style={{flex:1}}>
                        <View style={{marginTop: 20, elevation: 3}}>
                            {this.state.reservationsToDisplay.map((reservation) => {   
                            var newObj = {
                                IdReservation: reservation.IdReservation,
                                Title: reservation.TitlePublication,
                                People: reservation.People,
                                Date: reservation.DateFromString,
                                TotalPrice: reservation.TotalPrice,
                                PlanSelected: reservation.PlanSelected,
                                HourFrom: reservation.HourFrom,
                                HourTo: reservation.HourTo,
                                StateDescription: reservation.StateDescription,
                                ReservedQuantity: reservation.ReservedQuantity,
                                Reviewed: reservation.Reviewed
                            }
                            var objReservationCustomerPayment = {
                                reservationPaymentState: reservation.CustomerPayment.PaymentDescription,
                                reservationPaymentStateText: reservation.CustomerPayment.PaymentDescription,
                                paymentDocument: reservation.CustomerPayment.PaymentEvidence,
                                paymentComment: reservation.CustomerPayment.PaymentComment,
                                reservationPaymentAmmount: reservation.TotalPrice,
                                reservationpaymentDate: reservation.CustomerPayment.PaymentDate,
                            }
                                return (<ReservationSpacesListScrollView key={reservation.IdReservation} parentData={newObj} navigate={this.props.navigation.navigate}
                                        objReservationCustomerPayment={objReservationCustomerPayment} triggerScreen={this.triggerScreen} editReservation={this.editReservation}
                                        /> );
                            })
                            }
                        </View>
                        <View style={{flexDirection: 'row'}}>
                            {this.state.pagination.map(page => {
                                return (
                                    <TouchableOpacity style={styles.button} key={page} onPress={() => this.changePage(page)}><Text style={styles.buttonText}>{page}</Text></TouchableOpacity>
                                );
                            })}  
                        </View>
                        </View>
                    </ScrollView>
                    </>
                    ) : (
                            <>
                                <Text style={styles.titleText}>{translations[systemLanguage].messages['signInLinks_head_myReservations']}</Text>
                                <Text style={styles.subTiteText}>{translations[systemLanguage].messages['elementsNotFound_w']}</Text>  
                            </>
                        )
                    }
                    </>
                </View>    
            )}
            
            </> 
        );
    } 
      
}

const mapStateToProps = (state) => {
    return {
        login_status: state.loginData.login_status,
        tokenObj: state.loginData.tokenObj,
        userData: state.loginData.userData,
        systemLanguage: state.loginData.systemLanguage
    }
}

export default connect(mapStateToProps)(ReservationSpaceList);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2196f3',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  titleText:{
    fontSize: 32, 
    fontWeight: 'bold',
    color: "#FFF",
    marginTop: 20,
    marginBottom: 5,
  },
  subTiteText:{
    fontSize: 24, 
    fontWeight: 'bold',
    color: "#FFF",
    marginTop: 60,
    marginBottom: 5,
  },
  button: {
    width:40,
    height:30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:'#0069c0',
    borderRadius: 15,
    marginVertical: 20,
    elevation: 3,
    paddingHorizontal: 5,
  },
  buttonText: {
    fontSize:16,
    fontWeight:'500',
    color:'#ffffff'
  },
  activityIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2196f3',
    height: 80,
  },
});