import React, {Component} from 'react';
import { StyleSheet,Text,View,ScrollView,Keyboard,Image,TextInput,TouchableOpacity,Modal,TouchableHighlight} from 'react-native';
import { Header } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';

import MenuButton from '../components/MenuButton';
import HeartButton from '../components/HeartButton';
import Stars from '../components/StarRating';

//const { width, height } = Dimensions.get('window');

class SpaceViewDummy extends Component{
  constructor(props){
    super(props);
    this.state = {
      ratingPopUp: false,
    }
  }

  handleOnPress(visible){
    this.setState({ratingPopUp: visible});
  }

  renderReseñas(){

    return (
      <View>
        <Modal
          animationType="fade"
          transparent={true}
          visible={this.state.ratingPopUp}
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

  }

  render(){

    return (
        <View style={styles.container}>
          <Header
            leftComponent={{ icon: 'menu', color: '#fff', flex:1, onPress: () => this.props.navigation.openDrawer()}}
            rightComponent={{ icon: 'home', color: '#fff', flex:1, onPress: () => this.props.navigation.navigate('Home')}}
          />
          <ScrollView>
            <View style={styles.recommendedView}>
              <Icon
                name="thumbs-o-up"
                size={18}
                color='white'
              />
              <Text style={styles.buttonText}> Recomendado!</Text>
            </View>
            <Image style={styles.image} source={{uri:'https://cdn.pixabay.com/photo/2015/04/20/06/43/meeting-room-730679_960_720.jpg'}}/>
          
            <Text style={styles.titleText}>Título publicación</Text>
            <Text style={styles.capacityText}>Capacidad: 10 personas</Text>
            <View style={styles.popularityView}>
              <TouchableOpacity
                        underlayColor = 'white'
                        activeOpacity = {0.1}
                        onPress={() => {
                          this.handleOnPress(true);
                        }}>
              <Stars
                  votes={4}
                  size={18}
                  color='white'
              />
              </TouchableOpacity>
              <HeartButton
                color='white'
                selectedColor='white'
              />
              <Text style={styles.priceText} onPress={() =>{this.handleOnPress(true)}}>$300 por hora</Text>
            </View>
            {this.renderReseñas()}
            <Text style={styles.subtitleText}>Descripción</Text>
            <Text style={styles.descriptionText}>  
              Descripción de prueba escrita por el usuario al momento de públicar.{"\n"}{"\n"}
              Mostrará un texto que denote que no se escribió una descripción en caso
              de que así sea.
            </Text>
            <Text style={styles.subtitleText}>Infraestructura</Text>
            <Text style={styles.descriptionText}>  
              Se mostrarán todas las opciones de infraestructura 
              seleccionadas por el usuario
            </Text>
            <View style={styles.buttonsView}>
              <TouchableOpacity style={styles.button} onPress={() => {this.props.navigation.navigate('Home')}}>
                <Text style={styles.buttonText}>Reservar</Text>   
              </TouchableOpacity>
              <TouchableOpacity style={styles.button2} onPress={() => {this.props.navigation.navigate('Home')}}>
                <Text style={styles.buttonText}>Solicitar información</Text>   
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      );
  }
}

export default SpaceViewDummy;

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
      fontSize: 24, 
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
    buttonsView: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 20,
      paddingLeft: 25,
    },
    button: {
        width:130,
        height:30,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor:'#0069c0',
        borderRadius: 15,
        marginVertical: 10,
        marginLeft: 20,
        elevation: 3,
    },
    button2: {
        width:170,
        height:30,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor:'#0069c0',
        borderRadius: 15,
        marginVertical: 10,
        marginLeft: 25,
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

});