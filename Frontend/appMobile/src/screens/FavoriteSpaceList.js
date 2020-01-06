import React, {Component} from 'react';
import { StyleSheet, Text, View, ScrollView, Keyboard, TouchableOpacity, ToastAndroid} from 'react-native';
import { connect } from 'react-redux';
import { Header } from 'react-native-elements';

import FavoriteSpacesListScrollView from '../components/FavoriteSpacesListScrollView';

import Globals from '../Globals';

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

    handleErrors(error) {
        this.setState({ generalError: true });
    }

    componentDidMount() {
        this.loadSpaceTypes();
        this.loadMyFavoritePublications();
    }

    loadSpaceTypes(){
        var objApi = {};
        objApi.objToSend = {}
        objApi.fetchUrl = Globals.baseURL + "/spaceTypes";
        objApi.method = "GET";
        objApi.responseSuccess = "SUCC_SPACETYPESOK";
        objApi.successMessage = "";
        objApi.functionAfterSuccess = "loadSpaceTypes";
        this.callAPI(objApi);
    }

    loadMyFavoritePublications(){
        var objApi = {};
        objApi.objToSend = {
            "AccessToken": this.props.tokenObj.accesToken,
            "Mail": this.props.userData.Mail
        }
        objApi.fetchUrl = Globals.baseURL + "/favorite";
        objApi.method = "PUT";
        objApi.responseSuccess = "SUCC_FAVORITESOK";
        objApi.successMessage = "";
        objApi.functionAfterSuccess = "loadMyFavoritePublications";
        
        this.callAPI(objApi);
    }

    callAPI(objApi){
        if(objApi.method == "GET"){
            fetch(objApi.fetchUrl).then(response => response.json()).then(data => {
                if (data.responseCode == objApi.responseSuccess) {
                    if(objApi.successMessage != ""){
                        ToastAndroid.showWithGravity(
                            objApi.successMessage,
                            ToastAndroid.LONG,
                            ToastAndroid.CENTER,
                        );
                    }
                    this.callFunctionAfterApiSuccess(objApi.functionAfterSuccess, data);
                } else {
                    this.handleErrors("Internal error");
                }
            }
            ).catch(error => {
                this.handleErrors(error);
            }
            )
        }else{
            fetch(objApi.fetchUrl,{
                    method: objApi.method,
                    header: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                    body: JSON.stringify(objApi.objToSend)
                }).then(response => response.json()).then(data => {
                if (data.responseCode == objApi.responseSuccess) {
                    if(objApi.successMessage != ""){
                        ToastAndroid.showWithGravity(
                            objApi.successMessage,
                            ToastAndroid.LONG,
                            ToastAndroid.CENTER,
                        );
                    }
                    this.callFunctionAfterApiSuccess(objApi.functionAfterSuccess, data);
                } else {
                    this.handleErrors("Internal error");
                }
            }
            ).catch(error => {
                this.handleErrors(error);
            }
            )
        }

    }

    callFunctionAfterApiSuccess(trigger, data){
        switch(trigger){
            case "loadMyFavoritePublications"   : this.setState({ publications: data.Publications, loadingPubs: false });   break;
            case "loadSpaceTypes"               : this.setState({ spaceTypes: data.spaceTypes, loadingSpaceTypes: false }); break;
        }
    }

    render() {
        //if (this.props.login_status != 'LOGGED_IN') return <Redirect to='/' />
        //if (this.state.generalError) return <Redirect to='/error' />
        var loadStatus = !this.state.loadingPubs && !this.state.loadingSpaceTypes ? false : true;
        return (
            <>
            {this.state.pubId == null ? (
                <View style={styles.container}>
                <Header
                    leftComponent={{ icon: 'menu', color: '#fff', flex:1, onPress: () => this.props.navigation.openDrawer()}}
                    rightComponent={{ icon: 'home', color: '#fff', flex:1, onPress: () => this.props.navigation.navigate('Home')}}
                />                    
                <Text style={styles.titleText}>Mis publicaciones favoritas</Text>
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
            </View>
            
            ): (<View style={styles.container}>
                    <Text style={styles.titleText}>Mis publicaciones favoritas</Text>
                    <Text style={styles.subTiteText}>No ha agregado publicaciones a favoritos</Text>
                </View>)
            }
            </> 
        );
    } 
      
}

const mapStateToProps = (state) => {
    return {
        login_status: state.loginData.login_status,
        tokenObj: state.loginData.tokenObj,
        userData: state.loginData.userData,
    }
}

export default connect(mapStateToProps)(FavoriteSpaceList);

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
    marginBottom: 5,
  },
  subTiteText:{
    fontSize: 24, 
    fontWeight: 'bold',
    color: "#FFF",
    marginTop: 60,
    marginBottom: 5,
  },
});