import React, {Component} from 'react';
import {View,Text,Image,StyleSheet,ToastAndroid,TouchableOpacity} from 'react-native';
import { connect } from 'react-redux';

import Globals from '../Globals';

class RequestBePublisher extends Component {
    constructor(props) {
        super(props);
        this.state = {
            PublisherValidated: props.userData.PublisherValidated,
            Mail: props.userData.Mail,
            tokenObj: props.tokenObj,  
        }
    }

    requestBePublisher(){
      fetch(Globals.baseURL + '/customer', {
          method: 'PUT',
          header: { 'Content-Type': 'application/json', 'Accept': 'application/json' },

          body: JSON.stringify({
              Mail: Mail,
              AccessToken : tokenObj.accesToken
          })
      }).then(response => response.json()).then(data => {
          console.log("data:" + JSON.stringify(data));
          if (data.responseCode == "SUCC_USRUPDATED") {
            ToastAndroid.showWithGravity(
                'Solicitud enviada correctamente',
                ToastAndroid.LONG,
                ToastAndroid.CENTER,
            );
          } else{
                ToastAndroid.showWithGravity(
                    'Hubo un error',
                    ToastAndroid.LONG,
                    ToastAndroid.CENTER,
                );
          }
      }
      ).catch(error => {
          toast.error('Internal error', {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
          });
          console.log(error);
      }
      )
      
    }

    render (){

        return (
                <View style={styles.container}>
                    <Text style={styles.titleText}>Quiero publicar</Text>
                    <Text style={styles.infoText}>Si quieres ser uno de nuestros colaboradores, pudiendo realizar publicaciones en el sito, haz click en el boton 'Quiero!'. Se enviará una solicitud y uno de nuestros representantes se comunicará contigo a la brevedad.</Text>
                    <View style={{flexDirection: 'row'}}>
                        <TouchableOpacity style={styles.button} onPress={() => {this.props.navigation.navigate('Home')}}>
                            <Text style={styles.buttonText}>Me lo pierdo</Text>   
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={() => {this.requestBePublisher}}>
                            <Text style={styles.buttonText}>Quiero</Text>   
                        </TouchableOpacity>
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
    titleText:{
        fontSize: 32, 
        fontWeight: 'bold',
        color: "#FFF",
        marginTop: 20,
        marginLeft: 20,
        marginBottom: 5,
    },
    infoText:{
        fontSize: 18, 
        color: "#FFF",
        paddingHorizontal: 20,
        marginBottom: 5,
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
    buttonText: {
        fontSize:16,
        fontWeight:'500',
        color:'#ffffff',
    },
});

const mapStateToProps = (state) => {
    return {
        userData: state.loginData.userData,
        tokenObj: state.loginData.tokenObj,
    }
}

const mapDispatchToProps = (dispatch) =>{
    return {
        logOut: () => dispatch(logOut())
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(RequestBePublisher);