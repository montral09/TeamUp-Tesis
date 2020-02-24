import React, {Component} from 'react';
import { StyleSheet, Text, View, ScrollView, ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';
import { Header } from 'react-native-elements';
import { callAPI } from '../common/genericFunctions';
import translations from '../common/translations';

import FavoriteSpacesListScrollView from '../components/FavoriteSpacesListScrollView';

class FavoriteSpaceList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loadingPubs : true,
            loadingSpaceTypes : true,
            pubId : null,
            publications : [],
            spaceTypes : [],
            generalError : false,
            objPaymentDetails : {}
        }
        this.loadMyFavoritePublications = this.loadMyFavoritePublications.bind(this);
    }

    componentDidMount() {
        this.loadSpaceTypesFP();
        this.loadMyFavoritePublications();
    }

    // This function will call the API
    loadSpaceTypesFP = () => {
        var objApi = {};
        objApi.objToSend = {}
        objApi.fetchUrl = "api/spaceTypes";
        objApi.method = "GET";
        objApi.successMSG = {
            SUCC_SPACETYPESOK: '',
        };
        objApi.functionAfterSuccess = "loadSpaceTypesFP";
        objApi.errorMSG = {}
        callAPI(objApi, this);
    }

    // This function will call the API
    loadMyFavoritePublications = () => {
        var objApi = {};
        objApi.objToSend = {
            "AccessToken": this.props.tokenObj.accesToken,
            "Mail": this.props.userData.Mail
        }
        objApi.fetchUrl = "api/favorite";
        objApi.method = "PUT";
        objApi.successMSG = {
            SUCC_FAVORITESOK: '',
        };
        objApi.functionAfterSuccess = "loadMyFavoritePublications";
        objApi.errorMSG = {}
        objApi.logOut = this.props.logOut;
        callAPI(objApi, this);
    }

    render() {
        const { systemLanguage } = this.props;
        var loadStatus = !this.state.loadingPubs && !this.state.loadingSpaceTypes ? false : true;
        return (
            <>
            {loadStatus == false ? (
                <>
                    <View style={styles.container}>
                        <Header
                            leftComponent={{ icon: 'menu', color: '#fff', flex:1, onPress: () => this.props.navigation.openDrawer()}}
                            rightComponent={{ icon: 'home', color: '#fff', flex:1, onPress: () => this.props.navigation.navigate('Home')}}
                        />     
                        {this.state.publications.length > 0 ? (     
                        <>          
                        <Text style={styles.titleText}>{translations[systemLanguage].messages['favPublications_head']}</Text>
                        <ScrollView vertical>
                            <View style={{flex:1}}>
                            <View style={{marginTop: 20, elevation: 3}}>
                                {
                                this.state.publications.map((publication) => {
                                const spaceType2 = this.state.spaceTypes.find(space => {
                                    return space.Code === publication.SpaceType
                                });   
                                var newObj = {
                                    IdPub: publication.IdPublication,
                                    Title: publication.Title,
                                    Capacity: publication.Capacity,
                                    City: publication.City,
                                    Address: publication.Address,
                                    HourPrice: publication.HourPrice,
                                    DailyPrice: publication.DailyPrice,
                                    WeeklyPrice: publication.WeeklyPrice,
                                    MonthlyPrice: publication.MonthlyPrice,
                                    Ranking: publication.Ranking,
                                    SpaceTypeDesc: spaceType2.Description,  
                                }
                                    return (<FavoriteSpacesListScrollView key={publication.IdPublication} parentData={newObj} navigate={this.props.navigation.navigate}/>);
                                })
                                }
                            </View>
                            </View>
                        </ScrollView>
                        </>
                        ) : (
                                <>
                                    <Text style={styles.titleText}>{translations[systemLanguage].messages['favPublications_head']}</Text>
                                    <Text style={styles.subTiteText}>{translations[systemLanguage].messages['elementsNotFound_w']}</Text>
                                </>
                            )
                        }
                    </View>
                </> 
            ) : (
                <ActivityIndicator
                    animating = {loadStatus}
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
        systemLanguage: state.loginData.systemLanguage,
    }
}

export default connect(mapStateToProps)(FavoriteSpaceList);

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
  activityIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2196f3',
    height: 80,
  },
});