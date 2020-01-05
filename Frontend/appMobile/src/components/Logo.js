import React, {Component} from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';

export default class Logo extends Component<{}>{
    render(){
        return(
            <View style={styles.container}>
            <Image style={{width:70, height: 70}} 
                   source={require('../images/Logo.png')}/>
            <Text style={styles.logoText}>Bienvenidos</Text>
            </View>
        )
    }

}

 const styles = StyleSheet.create({
    container: {
      flexGrow: 1,
      alignItems: 'center',
      justifyContent: 'flex-end',
     },
     logoText : {
         fontSize:24,
         color:'rgba(255,255,255,1)'
     },
 });
