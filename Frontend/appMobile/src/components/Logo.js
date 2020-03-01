import React, {Component} from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { connect } from 'react-redux';

import translations from '../common/translations';


class Logo extends Component{
    render(){
        const { systemLanguage } = this.props;
        return(
            <View style={styles.container}>
            <Image style={{width:70, height: 70}} 
                   source={require('../images/Logo.png')}/>
            <Text style={styles.logoText}>{translations[systemLanguage].messages['login_welcome']}</Text>
            </View>
        )
    }

}

const mapStateToProps = (state) => {
    return {
        systemLanguage: state.loginData.systemLanguage
    }
}


export default connect(mapStateToProps)(Logo)

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
