import React, {Component} from 'react';
import { StyleSheet, Text, View, ScrollView, ActivityIndicator} from 'react-native';
import { connect } from 'react-redux';
import { callAPI } from '../common/genericFunctions';
import { Header } from 'react-native-elements';
import { MAX_ELEMENTS_PER_TABLE } from '../common/constants';
import translations from '../common/translations';

import SpacesListScrollView from '../components/SpacesListScrollView';

class SpaceList extends Component{
  constructor(props){
    super(props);
      this.state = {
        loadingPubs : true,
        loadingSpaceTypes : true,
        pubId : null,
        publications : [],
        spaceTypes : [],
        generalError : false
      }
      this.viewSpace = this.viewSpace.bind(this);
  }

  componentDidMount() {
    this.loadSpaceTypesMPL();
    this.loadMyPublications();
  }

  // This function will call the API
  loadSpaceTypesMPL = () => {
    var objApi = {};
    objApi.objToSend = {}
    objApi.fetchUrl = "api/spaceTypes";
    objApi.method = "GET";
    objApi.successMSG = {
        SUCC_SPACETYPESOK: '',
    };
    objApi.functionAfterSuccess = "loadSpaceTypesMPL";
    objApi.errorMSG = {}
    callAPI(objApi, this);
  }

  // This function will call the API
  loadMyPublications = () => {
    var objApi = {};
    objApi.objToSend = {
        "AccessToken": this.props.tokenObj.accesToken,
        "Mail": this.props.userData.Mail
    }
    objApi.fetchUrl = "api/publisherSpaces";
    objApi.method = "POST";
    objApi.successMSG = {
        SUCC_PUBLICATIONSOK: '',
    };
    objApi.functionAfterSuccess = "loadMyPublications";
    callAPI(objApi, this);
  }

  // This function will call the API
  changePubStateMPL = (pubState, pubId) => {
    var nextState = ""; var succMsg = "";
    if (pubState === "ACTIVE") {
        nextState = "PAUSED P";
        succMsg = translations[this.props.systemLanguage].messages['SUCC_PUBLICATIONUPDATEDP'];
    } else if (pubState === "PAUSED P") {
        nextState = "ACTIVE";
        succMsg = translations[this.props.systemLanguage].messages['SUCC_PUBLICATIONUPDATEDR'];
    }
        this.setState({ loadingPubs: !this.state.loadingPubs });

        var objApi = {};
        objApi.objToSend = {
            Mail: this.props.userData.Mail,
            RejectedReason: "",
            OldState: pubState,
            NewState: nextState,
            AccessToken: this.props.tokenObj.accesToken,
            IdPublication: pubId
        }
        objApi.fetchUrl = "api/publication";
        objApi.method = "PUT";
        objApi.successMSG = {
            SUCC_PUBLICATIONUPDATED: succMsg,
        };
        objApi.functionAfterSuccess = "changePubStateMPL";
        callAPI(objApi, this);
  }

  changePage = (pageClicked) => {
    this.setState({ publicationsToDisplay: this.filterPaginationArray(this.state.publications, (pageClicked - 1) * MAX_ELEMENTS_PER_TABLE), currentPage: pageClicked },
        () => this.setState({ publicationsToDisplay: this.filterPaginationArray(this.state.publications, (pageClicked - 1) * MAX_ELEMENTS_PER_TABLE), currentPage: pageClicked }))
  }

  filterPaginationArray = (arrayToFilter, startIndex) => {
      return arrayToFilter.slice(startIndex, startIndex + MAX_ELEMENTS_PER_TABLE)
  }

  viewSpace = (PubIdSelected) => {
    this.props.navigation.navigate('SpaceView', {PubId: PubIdSelected})
  }

  render(){
    const { systemLanguage } = this.props;
    var loadStatus = !this.state.loadingPubs && !this.state.loadingSpaceTypes ? false : true;
    return (
      <>
        {loadStatus == false ? (
          <View style={styles.container}>
            <Header
                leftComponent={{ icon: 'menu', color: '#fff', flex:1, onPress: () => this.props.navigation.openDrawer()}}
                rightComponent={{ icon: 'home', color: '#fff', flex:1, onPress: () => this.props.navigation.navigate('Home')}}
            />                    
            <Text style={styles.titleText}>
              {translations[systemLanguage].messages['signInLinks_head_myPublications']}
            </Text>
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
                        CreationDate: publication.CreationDate,
                        State: publication.State,
                        TotalViews: publication.TotalViews,
                        PremiumState: publication.PreferentialPlan.StateDescription,
                        PremiumTier: publication.PreferentialPlan.Description,
                        SpaceTypeDesc: spaceType2.Description,  
                      }
                        return (<SpacesListScrollView key={publication.IdPublication} parentData={newObj} changePubState={this.changePubStateMPL}/>);
                      })
                    }
                  </View>
                </View>
            </ScrollView>
          </View>
        ) : (
              <ActivityIndicator
                animating = {loadStatus}
                color = '#bc2b78'
                size = "large"
                style = {styles.activityIndicator}
              />
            )
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
        systemLanguage: state.loginData.systemLanguage
    }
}

export default connect(mapStateToProps)(SpaceList);

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
  activityIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2196f3',
    height: 80,
  },
});