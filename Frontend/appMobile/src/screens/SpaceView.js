import React, {Component} from 'react';
import { StyleSheet,Text,View,ScrollView,Dimensions,TouchableOpacity,ActivityIndicator} from 'react-native';
import { Header } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { connect } from 'react-redux';
import HTMLView from 'react-native-htmlview';
import { callAPI } from '../common/genericFunctions';
import translations from '../common/translations';

import SpaceImages from '../components/SpaceImagesScrollView';
import HeartButton from '../components/HeartButton';
import Stars from '../components/StarRating';
import TabQuestions from '../components/TabQuestions';
import TabReviews from '../components/TabReviews';
import TabVideo from '../components/TabVideo';
import RelatedPublications from '../components/RelatedPublications';

class SpaceView extends Component {

    constructor(props) {
        super(props);
        const { navigation } = this.props;
        const pubID = JSON.stringify(navigation.getParam('PubId', 'NO-ID'));

        this.state = {
            pubID               : pubID,
            pubObj              : null,
            activeImage         : null,
            date                : new Date(),
            quantityPlan        : 1,
            tabDisplayed        : 1,
            relatedPublications : [],
            otherPublicationConfig : [],
            facilities          : [],
            pubIsLoading        : true,
            infIsLoading        : 1,
            generalError        : false,
            descriptionCropped  : '',
            arrQA               : [],
            activeSection       : 1,
            ratingPopUp         : false,
        }
    }

    componentDidMount() {
        this.loadInfraestructureVP();
        this.loadPublicationVP(this.state.pubID);
    }

    loadInfraestructureVP = () => {
        var objApi = {};
        objApi.objToSend = {}
        objApi.fetchUrl = "api/facilities";
        objApi.method = "GET";
        objApi.successMSG = {
            SUCC_FACILITIESOK : "",
        };
        objApi.functionAfterSuccess = "loadInfraestructureVP";
        objApi.functionAfterError = "loadInfraestructureVP";
        objApi.errorMSG= {}
        callAPI(objApi, this);
    }

    loadPublicationVP = (pubID) => {
        var objApi = {};
        objApi.objToSend = {}
        var url = 'api/publication?idPublication=' + pubID + '&mail';
        if (this.props.userData.Mail != null) {
            url = url + '=' + this.props.userData.Mail;
        }
        objApi.fetchUrl = url;
        objApi.method = "GET";
        objApi.successMSG = {
            SUCC_PUBLICATIONSOK : "",
        };
        objApi.functionAfterSuccess = "loadPublicationVP";
        objApi.functionAfterError = "loadPublicationVP";
        objApi.errorMSG= {}
        if(this.state.pubIsLoading == false) this.setState({ pubIsLoading: true });
        callAPI(objApi, this);
    }

    triggerScreen = (objTrigger) => {
        var screenConfigObj = {};
        if(objTrigger.mode === "ANSWER"){
            screenConfigObj ={
                title: 'Responder', mainText: 'Pregunta:' + ' "'+objTrigger.questionObj.Question+'"', mode : objTrigger.mode, saveFunction : "saveAnswerVP", textboxLabel: 'Respuesta',
                textboxDisplay:true, cancelAvailable:true, confirmAvailable:true, cancelText :'Cancelar', confirmText :'Responder' , login_status: this.props.login_status, IdQuestion : objTrigger.questionObj.IdQuestion
            };
            this.props.navigation.navigate('QAAnswer', {screenConfig: screenConfigObj});
        }else{
            screenConfigObj ={
                title: 'Reserva enviada', mainText: 'Su reserva ha sido enviada correctamente, revise su casilla de correo para más informacion. ',
                textboxDisplay: false, cancelAvailable: true, cancelText : 'Entendido', mode : objTrigger.mode, saveFunction : "reservationSuccess"
            };
            this.props.navigation.navigate('ReservationReqInfo', {screenConfig: screenConfigObj});
        }   
    }

    goToTab = (tab) => {
        this.setState({ tabDisplayed: tab })
    }

    saveQuestionVP = (question, tabQuestionThis) => {
        var objApi = {};
        objApi.objToSend = {
            "AccessToken": this.props.tokenObj.accesToken,
            "Mail": this.props.userData.Mail,
            "IdPublication": this.state.pubID,
            "Question": question
        }
        objApi.fetchUrl = 'api/publicationQuestions';
        objApi.method = "POST";
        objApi.successMSG = {
            SUCC_QUESTIONCREATED: translations[this.props.systemLanguage].messages['SUCC_QUESTIONCREATED'],
        };
        objApi.functionAfterSuccess = "saveQuestionVP";
        objApi.functionAfterError = "saveQuestionVP";
        objApi.errorMSG = {};
        objApi.tabQuestionThis = tabQuestionThis;
        if(this.state.pubIsLoading == false) this.setState({ pubIsLoading: true });
        callAPI(objApi, this);
    }

    submitFavoriteVP = () => {
        var objApi = {};
        var code = this.state.pubObj.Favorite === false ? 1 : 2;
        objApi.objToSend = {
            "AccessToken": this.props.tokenObj.accesToken,
            "Mail": this.props.userData.Mail,
            "IdPublication": this.state.pubObj.IdPublication,
            "Code": code
        }

        objApi.fetchUrl = 'api/favorite';
        objApi.method = "POST";
        objApi.successMSG = {
            SUCC_FAVORITEUPDATED: code === 1 ? translations[this.props.systemLanguage].messages['viewPub_addedToFav'] : translations[this.props.systemLanguage].messages['viewPub_removedFromFav'],
        };
        objApi.functionAfterSuccess = "submitFavoriteVP";
        objApi.functionAfterError = "submitFavoriteVP";
        objApi.errorMSG = {}
        callAPI(objApi, this);
    }

    switchActiveSection = (sectionValue) => {
        this.setState({activeSection:sectionValue})
    }

    render(){
        const { systemLanguage } = this.props;
        var loadStatus = !this.state.pubIsLoading && !this.state.infIsLoading ? false : true;
    return ( 
        <>
            {this.state.pubIsLoading == false && this.state.infIsLoading == false ? ( 
                <View style={styles.container}>
                    <Header
                        //leftComponent={{ icon: 'menu', color: '#fff', flex:1, onPress: () => this.props.navigation.openDrawer()}}
                        rightComponent={{ icon: 'home', color: '#fff', flex:1, onPress: () => this.props.navigation.navigate('Home')}}
                    />
                    <ScrollView>
                        {this.state.pubObj.IsRecommended == true ? (
                            <View style={styles.recommendedView}>
                            <Icon
                                name="thumbs-o-up"
                                size={18}
                                color='white'
                            />
                            <Text style={styles.buttonText}> {translations[this.props.systemLanguage].messages['recommended_w']}</Text>
                            </View>
                        ):(null)
                        }
                        <SpaceImages ImagesURL={this.state.pubObj.ImagesURL}/>
                        <Text style={styles.titleText}>{this.state.pubObj.Title}</Text>
                        <Text style={styles.capacityText}>{this.state.pubObj.QuantityRented} {translations[this.props.systemLanguage].messages['viewPub_timesRented']}</Text>
                        <Text style={styles.capacityText}>{translations[this.props.systemLanguage].messages['capacity_w']}: {this.state.pubObj.Capacity} {translations[this.props.systemLanguage].messages['people_w']}</Text>
                        <Text style={styles.capacityText}>{translations[this.props.systemLanguage].messages['availability_w']}: {this.state.pubObj.Availability}</Text>
                        <View style={styles.popularityView}>
                            <Stars
                                votes={this.state.pubObj.Ranking}
                                size={18}
                                color='white'
                            />
                            {this.state.pubObj.IsMyPublication != true ? (
                            <HeartButton
                                color='white'
                                selectedColor='white'
                                favoriteCode={this.state.pubObj.Favorite === false ? 1 : 2}
                                submitFavorite={this.submitFavoriteVP}
                            />):(null)
                            }
                            <Text style={styles.priceText}>   
                                {this.state.pubObj.HourPrice > 0 ? (translations[this.props.systemLanguage].messages['hour_w']+ ': $' + this.state.pubObj.HourPrice + "\n") : (translations[this.props.systemLanguage].messages['hour_w'] + '-' + '\n')}
                                {this.state.pubObj.DailyPrice > 0 ? (translations[this.props.systemLanguage].messages['day_w'] + ': $' + this.state.pubObj.DailyPrice + "\n") : (translations[this.props.systemLanguage].messages['day_w'] + '-' + '\n')}
                                {this.state.pubObj.WeeklyPrice > 0 ? (translations[this.props.systemLanguage].messages['week_w'] + ': $' + this.state.pubObj.WeeklyPrice + "\n") : (translations[this.props.systemLanguage].messages['week_w'] + '-' + '\n')}
                                {this.state.pubObj.MonthlyPrice > 0 ? (translations[this.props.systemLanguage].messages['month_w'] + ': $' + this.state.pubObj.MonthlyPrice) : (translations[this.props.systemLanguage].messages['month_w'] + '-' + '\n')}
                            </Text>
                        </View>
                        
                        <View style={{flexDirection: 'row'}}>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                <TouchableOpacity style={styles.buttonTab} onPress={() => {this.switchActiveSection(1)}}>
                                    <Text style={styles.buttonText}>{translations[systemLanguage].messages['description_w']}</Text>   
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.buttonTab} onPress={() => {this.switchActiveSection(2)}}>
                                    <Text style={styles.buttonText}>{translations[systemLanguage].messages['questions_w']}</Text>   
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.buttonTab} onPress={() => {this.switchActiveSection(3)}}>
                                    <Text style={styles.buttonText}>{translations[systemLanguage].messages['reviews_w']}</Text>   
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.buttonTab} onPress={() => {this.switchActiveSection(4)}}>
                                    <Text style={styles.buttonText}>{translations[systemLanguage].messages['video_w']}</Text>   
                                </TouchableOpacity>
                            </ScrollView>                  
                        </View>
                        
                        {this.state.activeSection === 1 ? (
                            <>
                                <Text style={styles.subtitleText}>{translations[this.props.systemLanguage].messages['description_w']}</Text>
                                <View style={styles.descriptionContainer}>
                                    <ScrollView vertical>
                                        <View style={{marginLeft: 10, marginTop: 10, marginRight: 10, marginBottom: 10}}>
                                            <HTMLView value={this.state.pubObj.Description} stylesheet={stylesHtml}/>
                                        </View>
                                    </ScrollView>
                                </View>                              
                                <Text style={styles.subtitleText}>{translations[this.props.systemLanguage].messages['address_w']}</Text>
                                <Text style={styles.descriptionText}>{this.state.pubObj.Address}</Text>
                                <Text style={styles.subtitleText}>{translations[this.props.systemLanguage].messages['services_w']}</Text>
                                <>            
                                {this.state.pubObj.Facilities.map((inf, index) => {
                                    const infText = this.state.facilities.filter(function (fac) {
                                        return parseInt(fac.Code) == parseInt(inf)
                                    })
                                    return (
                                        <Text key={index} style={styles.descriptionText}>
                                            {infText[0].Description}
                                        </Text>
                                    );
                                                        
                                })}
                                </> 
                            </>  
                            ) : (
                                    <>
                                        {this.state.activeSection === 2 ? (
                                            <>
                                                <Text style={styles.subtitleQuestionsText}>{translations[this.props.systemLanguage].messages['questions_w']}</Text>    
                                                <TabQuestions arrQA={this.state.arrQA} saveQuestionVP={this.saveQuestionVP} triggerScreen={this.triggerScreen}
                                                            userData={this.props.userData} isMyPublication={this.state.pubObj.IsMyPublication}/>
                                            </>
                                        ) : (
                                                <>
                                                    {this.state.activeSection === 3 ? (
                                                        <>                                                
                                                            <Text style={styles.subtitleQuestionsText}>{translations[this.props.systemLanguage].messages['reviews_w']}</Text>
                                                            <TabReviews reviews={this.state.pubObj.Reviews}/> 
                                                        </>
                                                    ) : (
                                                            <>
                                                                <Text style={styles.subtitleQuestionsText}>{translations[this.props.systemLanguage].messages['video_w']}</Text>
                                                                <TabVideo youtubeUrl={this.state.pubObj.VideoURL}/>
                                                            </>
                                                        )
                                                    }
                                                </>
                                            )                                     
                                        }
                                    </>
                                ) 
                                               
                        }

                        <View style={styles.buttonsView}>
                            {this.state.pubObj.IsMyPublication != true ? (
                                <TouchableOpacity style={styles.button} onPress={() => {this.props.navigation.navigate('ReserveSpace', {pubObj:this.state.pubObj})}}>
                                    <Text style={styles.buttonText}>{translations[systemLanguage].messages['makeReservation_w']}</Text>   
                                </TouchableOpacity>
                                ) : (<View style={styles.buttonsView}>
                                        <Text style={styles.descriptionText}>{styles.buttonText}>{translations[systemLanguage].messages['viewPub_resAvToCustomers']}</Text>
                                     </View>
                                    )
                            }
                        </View>
                        <RelatedPublications relatedPublications={this.state.otherPublicationConfig} push={this.props.navigation.push} title={translations[this.props.systemLanguage].messages['viewPub_splitSpaces']} />
                        <RelatedPublications relatedPublications={this.state.relatedPublications} push={this.props.navigation.push} title={translations[this.props.systemLanguage].messages['viewPub_relatedPublications']}/>
                    </ScrollView>      
                </View>    
            ) : (<ActivityIndicator
                    animating = {this.state.pubIsLoading}
                    color = '#bc2b78'
                    size = "large"
                    style = {styles.activityIndicator}
                 />
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

export default connect(mapStateToProps)(SpaceView);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#2196f3',
        alignItems: 'flex-start',
    },
    recommendedView: {
        width: 140,
        height: 30,
        borderRadius: 4,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0069c0',
        position: 'absolute',
        paddingHorizontal: 5,
        elevation: 1,
        left: 8,
        top: 15,
    },
    image: {
        width: 412,
        height: 300,
    },
    titleText: {
        fontSize: 24, 
        fontWeight: 'bold',
        color: '#FFF',
        marginTop: 20,
        marginBottom: 5,
        paddingLeft: 25,
    },
    capacityText: {
        fontSize: 12, 
        fontWeight: 'bold',
        color: '#FFF',
        marginBottom: 5,
        paddingLeft: 25,
    },
    popularityView: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 20,
      paddingLeft: 25,
    },
    priceText: {
      fontSize: 12, 
      fontWeight: 'bold',
      color: '#FFF',
      paddingLeft: 45,
    },
    subtitleText: {
      fontSize: 18, 
      fontWeight: 'bold',
      color: '#FFF',
      marginTop: 20,
      marginBottom: 15,
      paddingLeft: 25,
    },
    subtitleQuestionsText: {
        fontSize: 18, 
        fontWeight: 'bold',
        color: '#FFF',
        marginTop: 20,
        paddingLeft: 25,
    },
    reseñaView: {
      alignItems: 'flex-start',
    },
    reseñaText: {
      fontSize: 18, 
      fontWeight: 'bold',
      color: '#2196f3',
      marginTop: 20,
    },
    descriptionText: {
      color: '#FFF',
      marginLeft: 25,
    },
    descriptionAnswerText: {
      color: '#FFF',
      fontSize: 18,
      paddingLeft: 45,
    },
    questionText: {
      color: '#FFF',
      fontSize: 18,
      marginLeft: 25,
    },
    answerText: {
      color: '#FFF',
      paddingLeft: 45,
    },
    buttonsView: {
      alignItems: 'center',
      paddingVertical: 20,
    },
    button: {
        width:130,
        height:30,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor:'#0069c0',
        borderRadius: 15,
        marginVertical: 10,
        elevation: 3,
    },
    buttonTab: {
        width:130,
        height:50,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor:'#0069c0',
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderLeftColor: 'white',
        borderRightColor: 'white',
        marginVertical: 10,
        elevation: 3,
    },
    buttonText: {
        fontSize:16,
        fontWeight:'500',
        color:'#ffffff',
    },
    destinations: {
        flex: 1,
        justifyContent: 'space-between',
        paddingBottom: 30,
    },
    activityIndicator: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#2196f3',
        height: 80,
    },
    descriptionContainer: {
        backgroundColor: 'rgba(255,255,255,0.3)',
        borderRadius: 25,
        marginLeft: 20,
        width: Dimensions.get('window').width - 40,
    }
});

const stylesHtml = StyleSheet.create({
    a: {
        fontWeight: '300',
    },
});


//<Text style={styles.descriptionText}>{this.state.pubObj.Description}</Text>