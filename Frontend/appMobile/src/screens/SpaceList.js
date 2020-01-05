import React, {Component} from 'react';
import { StyleSheet, Text, View, ScrollView, Keyboard, ToastAndroid} from 'react-native';
import { connect } from 'react-redux';
import { Header } from 'react-native-elements';
import { createAppContainer, createStackNavigator, withNavigation } from 'react-navigation';

import SpacesListScrollView from '../components/SpacesListScrollView';
import SpaceView from '../screens/SpaceView';
import Globals from '../Globals';

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
      this.loadMyPublications = this.loadMyPublications.bind(this);
      this.editPublication = this.editPublication.bind(this);
      this.changePubState = this.changePubState.bind(this);

      this.viewSpace = this.viewSpace.bind(this);
  }

componentDidMount() {
  this.loadSpaceTypes();
  this.loadMyPublications();
  //this.reloadList()
}

loadSpaceTypes() {
      try {
          fetch(Globals.baseURL + '/spaceTypes'
          ).then(response => response.json()).then(data => {
              if (data.responseCode == "SUCC_SPACETYPESOK") {
                  this.setState({ spaceTypes: data.spaceTypes, loadingSpaceTypes: false })
              } else {
                  ToastAndroid.showWithGravity(
                    'Hubo un error',
                    ToastAndroid.LONG,
                    ToastAndroid.CENTER,
                  );
              }
          }
          ).catch(error => {
              ToastAndroid.showWithGravity(
                'Internal error',
                ToastAndroid.LONG,
                ToastAndroid.CENTER,
              );
              console.log(error);
          }
          )
      } catch (error) {
          ToastAndroid.showWithGravity(
            'Internal error',
            ToastAndroid.LONG,
            ToastAndroid.CENTER,
          );
      }
  }

  loadMyPublications(){
    try {
        fetch(Globals.baseURL + '/publisherSpaces', {
            method: 'POST',
            header: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify({
                "AccessToken": this.props.tokenObj.accesToken,
                "Mail": this.props.userData.Mail                   
            })
        }).then(response => response.json()).then(data => {
            if (data.responseCode == "SUCC_PUBLICATIONSOK") {
                this.setState({ publications: data.Publications, loadingPubs: false })
            } else {
                ToastAndroid.showWithGravity(
                  'Hubo un error',
                  ToastAndroid.LONG,
                  ToastAndroid.CENTER,
                );
            }
        }
        ).catch(error => {
            ToastAndroid.showWithGravity(
              'Internal error',
              ToastAndroid.LONG,
              ToastAndroid.CENTER,
            );
            console.log(error);
        }
    )
    }catch(error){
        ToastAndroid.showWithGravity(
          'Internal error',
          ToastAndroid.LONG,
          ToastAndroid.CENTER,
        );
        console.log(error);
    }
  }

  editPublication(pubId){
    this.setState({ pubId: pubId })
  }

  changePubState(pubState, pubId){
    var message = "";
    var nextState = "";
    if(pubState == "ACTIVE"){
        //message = "Desea pausar la publicacion?";
        nextState = "PAUSED P";
    }else if(pubState == "PAUSED P"){
        //message = "Desea reanudar la publicacion?";
        nextState = "ACTIVE";
    }
    //if(window.confirm(message)){
        //this.setState({loadingPubs: !this.state.loadingPubs});
        let objPub = {
            Mail: this.props.userData.Mail,
            RejectedReason : "",
            OldState: pubState,
            NewState: nextState,
            AccessToken: this.props.tokenObj.accesToken,
            IdPublication: pubId
        } 
        console.log('OBJPUB: ' + JSON.stringify(objPub))
        fetch(Globals.baseURL + '/publication', {
            method: 'PUT',
            header: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify(objPub)
        }).then(response => response.json()).then(data => {
            if (data.responseCode == "SUCC_PUBLICATIONUPDATED") {
                ToastAndroid.showWithGravity(
                  'Publicacion actualizada correctamente ',
                  ToastAndroid.LONG,
                  ToastAndroid.CENTER,
                );
            } else{
                this.handleErrors('Hubo un error');
                //this.setState({loadingPubs: !this.state.loadingPubs});
            }
        }
        ).catch(error => {
            this.handleErrors(error);
            //this.setState({loadingPubs: !this.state.loadingPubs});
        }
        )
    //}
    //this.reloadList()
  }

  handleErrors(error) {
    this.setState({ generalError: true });
  }

  viewSpace(PubIdSelected){
    this.props.navigation.navigate('SpaceView', {PubId: PubIdSelected})
  }

  /*reloadList(){
    return (
      this.state.publications.map((publication, key) => {
        const spaceType2 = this.state.spaceTypes.find(space => {
            return space.Code === publication.SpaceType
        });   
        var newObj = {
          IdPub: publication.IdPublication,
          Title: publication.Title,
          CreationDate: publication.CreationDate,
          State: publication.State,
          SpaceTypeDesc: spaceType2.Description,
        }
        return (<SpacesListScrollView key={publication.IdPublication} parentData={newObj} changePubState={this.changePubState}/>);
      })
    ); 
  }*/

  /*renderDetails(){
    return (
    <View>
        <Modal
        animationType="fade"
        transparent={true}
        visible={this.state.DetailsPopUp}
        onRequestClose={() => {
            Alert.alert('Modal has been closed.');
        }}>
        <View style={styles.modalView}>
            <View style={{marginBottom: 10}}>
            <Text style={styles.reseñaText}>Reseñas</Text>
            <TouchableHighlight
                onPress={() => {
                this.handleOnPress(false);
                }}>
                <Text>Hide Modal</Text>
            </TouchableHighlight>
            </View>
        </View>
        </Modal>
    </View>
    )
  }*/

  render(){

    return (
      <View style={styles.container}>
        <Header
            leftComponent={{ icon: 'menu', color: '#fff', flex:1, onPress: () => this.props.navigation.openDrawer()}}
            rightComponent={{ icon: 'home', color: '#fff', flex:1, onPress: () => this.props.navigation.navigate('Home')}}
        />                    
        <Text style={styles.titleText}>
          Espacios publicados
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
                    return (<SpacesListScrollView key={publication.IdPublication} parentData={newObj} changePubState={this.changePubState}/>);
                  })
                }
              </View>
            </View>
        </ScrollView>
      </View>
            
            
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
});