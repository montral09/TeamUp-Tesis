import React, {Component} from 'react';
import { StyleSheet,Text,View,ScrollView,Image,TouchableOpacity,ActivityIndicator} from 'react-native';
import { Header } from 'react-native-elements';
import { withNavigation } from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome';
import LoadingOverlay from 'react-native-loading-spinner-overlay';
import { connect } from 'react-redux';
import HTMLView from 'react-native-htmlview';
import { callAPI } from '../common/genericFunctions';
import MenuButton from '../components/MenuButton';
import HeartButton from '../components/HeartButton';
import Stars from '../components/StarRating';
import TabQuestions from '../components/TabQuestions';
import TabReviews from '../components/TabReviews';
import RelatedPublications from '../components/RelatedPublications';

import QAAnswer from './QAAnswer';

class SpaceView extends React.Component {

    constructor(props) {
        super(props);
        const { navigation } = this.props;
        const pubID = JSON.stringify(navigation.getParam('PubId', 'NO-ID'));//props.match.params.publicationID;
        //console.log('PUBID: ' + pubID)

        this.state = {
            pubID               : pubID,
            pubObj              : null,//{"IdPublication":1,"IdUser":0,"Mail":null,"NamePublisher":null,"LastNamePublisher":null,"PhonePublisher":null,"SpaceType":1,"CreationDate":"2019-11-23T17:55:00","Title":"Ej espacio","Description":"asdasdf","Address":"Mercedes 1483","City":"Cordón","Location":{"Latitude":-33.2604441,"Longitude":-58.0185646},"Capacity":10,"VideoURL":"https://www.youtube.com/watch?v=CJ2FWYCWGo","HourPrice":150,"DailyPrice":200,"WeeklyPrice":250,"MonthlyPrice":300,"Availability":"Lunes a viernes","Facilities":[1,3],"State":null,"ImagesURL":["https://firebasestorage.googleapis.com/v0/b/teamup-1571186671227.appspot.com/o/Images%2F5%2F1%2Fetwxl5svovz.jpeg?alt=media&token=dfecb062-4830-4b66-bbac-a8f77b335c9d"],"QuantityRented":0,"Reviews":[],"Ranking":0,"TotalViews":8,"IndividualRent":false,"Favorite":true},
            activeImage         : null,
            date                : new Date(),
            quantityPlan        : 1,
            tabDisplayed        : 1,
            relatedPublications : [],
            facilities          : [],
            pubIsLoading        : true,
            infIsLoading        : 1,
            planChosen          : "HourPrice",
            quantityPeople      : 1,
            generalError        : false,
            hoursAvailable      : ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13'
                                    , '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'],
            hourFromSelect      : '00',
            hourToSelect        : '01',
            reservationComment  : "",
            totalPrice          : 0,
            arrQA               : [],
            activeSection       : 1,
            ratingPopUp         : false,
        }
        this.bindFunctions();

    }

    bindFunctions(){
        this.loadPublicationVP        = this.loadPublicationVP.bind(this);
        //this.redirectToPub          = this.redirectToPub.bind(this);
        this.submitFavorite         = this.submitFavorite.bind(this);
        this.handleErrors           = this.handleErrors.bind(this);
        //this.reservationSuccess     = this.reservationSuccess.bind(this);
        this.confirmReservation     = this.confirmReservation.bind(this);
        this.triggerScreen          = this.triggerScreen.bind(this);
        //this.triggerSaveModal       = this.triggerSaveModal.bind(this);
        //this.saveAnswer             = this.saveAnswer.bind(this);
    }

    componentDidMount() {
        this.loadInfraestructureVP();
        this.setInitialHour();
        this.loadPublicationVP(this.state.pubID);
    }

    setInitialHour(){
        var today = new Date();
        var hourFromSelect = today.getHours();
        this.changeHour({target : {value : hourFromSelect, id: "hourFromSelect" }})

    }

    handleErrors(error) {
        this.setState({ generalError: true });
    }

    onChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value
        });
    }

    handleChange = (e) => {
        this.setState({
            date: e
        });
    }

    increaseQuantityPlan() {
        this.setState({ quantityPlan: parseInt(this.state.quantityPlan) + 1 });
    }

    decreaseQuantityPlan() {
        if (parseInt(this.state.quantityPlan) > 1) {
            this.setState({ quantityPlan: parseInt(this.state.quantityPlan) - 1 });
        }
    }

    changeQuantityPlan(value) {
        if (parseInt(value) > 0) {
            this.setState({ quantityPlan: parseInt(value) });
        }
    }

    increaseQuantityPeople() {
        this.setState({ quantityPeople: parseInt(this.state.quantityPeople) + 1 });
    }

    decreaseQuantityPeople() {
        if (parseInt(this.state.quantityPeople) > 1) {
            this.setState({ quantityPeople: parseInt(this.state.quantityPeople) - 1 });
        }
    }

    changeQuantityPeople(value) {
        if (parseInt(value) > 0) {
            this.setState({ quantityPeople: parseInt(value) });
        }
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

    submitFavorite() {
        var code = this.state.pubObj.Favorite === false ? 1 : 2;
        var fetchUrl = '';
        var method = "";

        var objToSend = {
            "AccessToken": this.props.tokenObj.accesToken,
            "Mail": this.props.userData.Mail,
            "IdPublication": this.state.pubObj.IdPublication,
            "Code": code
        }
        fetchUrl = Globals.baseURL + '/favorite';
        method = "POST";
        fetch(fetchUrl, {
            method: method,
            header: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify(objToSend)
        }).then(response => response.json()).then(data => {
            console.log("data:" + JSON.stringify(data));
            if (data.responseCode == "SUCC_FAVORITEUPDATED") {
                this.setState({ pubObj: { ...this.state.pubObj, Favorite: code === 1 ? true : false } })
            } else {
                this.handleErrors("Generic error");
            }
        }
        ).catch(error => {
            this.handleErrors(error);
        }
        )
    }

    triggerScreen(objTrigger){
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

    changeImage(image, index) {
        this.setState({ activeImage: { index: index, src: image } })
    }

    goToTab(tab) {
        this.setState({ tabDisplayed: tab })
    }

    confirmReservation(){
        var objToSend = {}
        var fetchUrl = Globals.baseURL + '/reservation';
        var method = "POST";
        var PlanSelected = "";
        switch(this.state.planChosen){
            case "HourPrice": PlanSelected ="Hour";break;
            case "DailyPrice": PlanSelected ="Day";break;
            case "WeeklyPrice" : PlanSelected ="Week";break;
            case "MonthlyPrice": PlanSelected ="Month";break;
        }

        var objToSend = {
            "AccessToken": this.props.tokenObj.accesToken,
            "VOReservation": {
                "IdPublication": this.state.pubID,
                "MailCustomer": this.props.userData.Mail,
                "PlanSelected": PlanSelected,
                "ReservedQuantity": this.state.quantityPlan,
                "DateFrom": this.state.date,
                "HourFrom": this.state.hourFromSelect,
                "HourTo": this.state.hourToSelect,
                "People": this.state.quantityPeople,
                "Comment": this.state.reservationComment,
                "TotalPrice": this.state.totalPrice
            }
        }

        this.modalSummaryElement.current.changeModalLoadingState(false);
        fetch(fetchUrl, {
            method: method,
            header: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify(objToSend)
        }).then(response => response.json()).then(data => {
            this.setState({ isLoading: false, buttonIsDisable: false });
            console.log("data:" + JSON.stringify(data));
            if (data.responseCode == "SUCC_RESERVATIONCREATED") {
                this.modalSummaryElement.current.changeModalLoadingState(true);
                this.modalElement.current.toggle(null);
            } else {
                this.modalSummaryElement.current.changeModalLoadingState(true);
                this.handleErrors(data.responseCode);
            }
        }
        ).catch(error => {
            this.handleErrors(error);
        }
        )
    }

    validateReservation(){
        if(this.state.date){}
        var objResponse = {
            valid : true,
            message : ""
        }
        return objResponse;
    }

    changeHour = (e) => {
        var newHourFromSelect = this.state.hourFromSelect;
        var newHourToSelect = this.state.hourToSelect;
        if(e.target.id == "hourFromSelect"){
            newHourFromSelect = e.target.value;
            if(parseInt(newHourFromSelect) >= parseInt(newHourToSelect)  ){
                if((parseInt(newHourFromSelect)+1) <= 9){
                    newHourToSelect = "0"+(parseInt(newHourFromSelect)+1);
                }else{
                    newHourToSelect = parseInt(newHourFromSelect)+1;
                    if(newHourToSelect == 24){
                        newHourToSelect = "00";
                    }
                }
            }
        }else{
            // hourToSelect
            newHourToSelect = e.target.value;
            if(parseInt(newHourToSelect) <= parseInt(newHourFromSelect)){
                if((parseInt(newHourFromSelect)-1) <= 9){
                    newHourFromSelect = "0"+(parseInt(newHourToSelect)-1);
                }else{
                    newHourFromSelect = parseInt(newHourFromSelect)-1;
                    if(newHourFromSelect == 0){
                        newHourFromSelect = "00";
                    }
                }
            }
        }
        if(newHourToSelect == "00" && newHourFromSelect == "00"){
            newHourToSelect = "01";
        };
        this.setState({
            hourFromSelect: newHourFromSelect,
            hourToSelect: newHourToSelect
        });
    }

    convertDate(date) {
        var today = new Date(date);
        var dd = today.getDate();
        var mm = today.getMonth() + 1; //January is 0!

        var yyyy = today.getFullYear();
        if (dd < 10) {
            dd = '0' + dd;
        }
        if (mm < 10) {
            mm = '0' + mm;
        }
        var dateConv = dd + "-" + mm + '-' + yyyy;
        return dateConv;
    }

    switchActiveSection(sectionValue){
        this.setState({activeSection:sectionValue})
    }

    handleOnPress(visible){
        this.setState({ratingPopUp: visible});
    }

    render(){
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
                            <Text style={styles.buttonText}> Recomendado!</Text>
                            </View>
                        ):(null)
                        }
                        <Image style={styles.image} source={{uri: this.state.activeImage.src}}/>
                        <Text style={styles.titleText}>{this.state.pubObj.Title}</Text>
                        <Text style={styles.capacityText}>{this.state.pubObj.QuantityRented} veces alquilado</Text>
                        <Text style={styles.capacityText}>Capacidad: {this.state.pubObj.Capacity} personas</Text>
                        <Text style={styles.capacityText}>Disponibilidad: {this.state.pubObj.Availability}</Text>
                        <View style={styles.popularityView}>
                            <TouchableOpacity
                                underlayColor = 'white'
                                activeOpacity = {0.1}
                                onPress={() => {
                                this.handleOnPress(true);
                                }}>
                            <Stars
                                votes={this.state.pubObj.Ranking}
                                size={18}
                                color='white'
                            />
                            </TouchableOpacity>
                            {this.state.pubObj.IsMyPublication != true ? (
                            <HeartButton
                                color='white'
                                selectedColor='white'
                                favoriteCode={this.state.pubObj.Favorite === false ? 1 : 2}
                                submitFavorite={this.submitFavorite}
                            />):(null)
                            }
                            <Text style={styles.priceText} /*onPress={() =>{this.handleOnPress(true)}}*/>   
                                {this.state.pubObj.HourPrice > 0 && "Por Hora : $" + this.state.pubObj.HourPrice + "\n"}
                                {this.state.pubObj.DailyPrice > 0 && "Por Día : $" + this.state.pubObj.DailyPrice + "\n"}
                                {this.state.pubObj.WeeklyPrice > 0 && "Por Semana : $" + this.state.pubObj.WeeklyPrice + "\n"}
                                {this.state.pubObj.MonthlyPrice > 0 && "Por Mes : $" + this.state.pubObj.MonthlyPrice}
                            </Text>
                        </View>
                        
                        <View style={{flexDirection: 'row'}}>
                            <TouchableOpacity style={styles.buttonTab} onPress={() => {this.switchActiveSection(1)}}>
                                <Text style={styles.buttonText}>Descripción</Text>   
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.buttonTab} onPress={() => {this.switchActiveSection(2)}}>
                                <Text style={styles.buttonText}>Preguntas</Text>   
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.buttonTab} onPress={() => {this.switchActiveSection(3)}}>
                                <Text style={styles.buttonText}>Reseñas</Text>   
                            </TouchableOpacity>                  
                        </View>
                        
                        {this.state.activeSection === 1 ? (
                            <>
                                <Text style={styles.subtitleText}>Descripción</Text>
                                <HTMLView value={this.state.pubObj.Description} stylesheet={stylesHtml}/>
                                <Text style={styles.descriptionText}>{this.state.pubObj.Description}</Text>
                                <Text style={styles.subtitleText}>Dirección</Text>
                                <Text style={styles.descriptionText}>{this.state.pubObj.Address}</Text>
                                <Text style={styles.subtitleText}>Servicios</Text>
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
                                                <Text style={styles.subtitleQuestionsText}>Preguntas</Text>    
                                                <TabQuestions arrQA={this.state.arrQA} saveQuestion={this.saveQuestionVP} triggerScreen={this.triggerScreen}
                                                            userData={this.props.userData} isMyPublication={this.state.pubObj.IsMyPublication}/>
                                            </>
                                        ) : (
                                                <>                                                
                                                    <Text style={styles.subtitleQuestionsText}>Reseñas</Text>
                                                    <TabReviews reviews={this.state.pubObj.Reviews}/> 
                                                </>
                                            )                                      
                                        }
                                    </>
                                ) 
                                               
                        }

                        <View style={styles.buttonsView}>
                            {this.state.pubObj.IsMyPublication != true ? (
                                <TouchableOpacity style={styles.button} onPress={() => {this.props.navigation.navigate('ReserveSpace', {pubObj:this.state.pubObj})}}>
                                    <Text style={styles.buttonText}>Reservar</Text>   
                                </TouchableOpacity>
                                ) : (<Text style={styles.descriptionText}>Reserva disponible para clientes</Text>)
                            }
                        </View>
                        <RelatedPublications relatedPublications={this.state.relatedPublications} push={this.props.navigation.push} title="Publicaciones relacionadas"/>
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
        userData: state.loginData.userData
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
    modalView: {
      //paddingTop: 10,
      alignSelf: 'center',
      alignItems: 'flex-start',
      marginTop: 20,
      //justifyContent: 'center',
      backgroundColor: 'white',
      borderRadius: 10,
      height: 150,
      width: 250,
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
      //marginBottom: 15,
      //paddingLeft: 25,
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
        //borderRadius: 15,
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
        height: 80,
    },

});

const stylesHtml = StyleSheet.create({
    a: {
        fontWeight: '300',
        color: 'white', // make links coloured pink
    },
});

/*{this.state.arrQA.map((pregunta, index) => {
                            return(
                                <>
                                <Text key={index+pregunta.Question.UserName+"titleQ"} style={styles.questionText}>
                                    {pregunta.Question.UserName + " "}
                                    {pregunta.Question.Date}
                                </Text>
                                <Text key={index+pregunta.Question.UserName+"textQ"} style={styles.descriptionText}>     
                                    {pregunta.Question.Text + "\n\n"}
                                    {pregunta.Answer ? (
                                        <>
                                        <Text key={index+pregunta.Answer.UserName+"titleA"} style={styles.descriptionAnswerText}>
                                            {"\t\t\t" + pregunta.Answer.UserName + " "}
                                            {pregunta.Answer.Date + "\n"}
                                        </Text>
                                        <Text key={index+pregunta.Answer.UserName+"textA"} style={styles.answerText}>                    
                                            {"\t\t\t" + pregunta.Answer.Text + "\n"}
                                        </Text>  
                                        </>         
                                    ) : (null)}
                                </Text>
                                </>
                            )
                        })}*/