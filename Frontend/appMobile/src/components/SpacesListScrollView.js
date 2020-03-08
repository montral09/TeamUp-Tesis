import React, {Component} from 'react';
import {View,Text,StyleSheet,TouchableOpacity} from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { connect } from 'react-redux';
import { displayInfoMessage } from '../common/genericFunctions';

import translations from '../common/translations';

class SpacesListScrollView extends Component {

    notAvailableMobile(){ 
        displayInfoMessage(translations[this.props.systemLanguage].messages['unavailable_function']);
    } 

    render (){
        const { systemLanguage } = this.props;
        return (
                <View style={styles.spacesContainer}>
                    <View style={{flexDirection: 'row', position: 'absolute', right: 25, top: 10}}>
                        <Ionicons name="md-eye" size={24} color="white"></Ionicons>
                        <Text style={{color: 'white', fontSize: 14, paddingTop: 3, paddingLeft: 5}}>{this.props.parentData.TotalViews}</Text>
                    </View>
                    <View style={styles.textView}>
                        <Text style={{color: 'white', fontSize: 20}}>{this.props.parentData.Title}</Text>
                        <Text style={{color: 'white', fontSize: 16}}>{this.props.parentData.SpaceTypeDesc}</Text>
                        <View style={{flexDirection: 'row'}}>
                            <Text style={{color: 'white', fontSize: 14, paddingHorizontal: 5}}>{this.props.parentData.CreationDate}</Text>
                            <Text style={{color: 'white', fontSize: 14}}>{translations[systemLanguage].messages['status_w']}: {translations[systemLanguage].messages['pubState_'+this.props.parentData.State.replace(/\s/g,'')]}</Text>
                        </View>
                        {this.props.parentData.PremiumState !== null ? (
                            <View style={[styles.premiumContainer, this.props.parentData.PremiumTier === 'GOLD' ? styles.premiumGold : this.props.parentData.PremiumTier === 'SILVER' ? styles.premiumSilver : this.props.parentData.PremiumTier === 'BRONZE' ? styles.premiumBronze : null]}>
                                <Text style={{color: 'white', fontSize: 16, paddingHorizontal: 20, paddingTop: 10}}>{translations[systemLanguage].messages['paymentP_w']}</Text>
                                <Text style={{color: 'white', fontSize: 14}}>{translations[systemLanguage].messages['status_w']}: {translations[systemLanguage].messages['payState_'+this.props.parentData.PremiumState.replace(/\s/g,'')]}</Text>
                                <TouchableOpacity style={styles.button}> 
                                    <Text style={styles.buttonText} onPress={() => this.notAvailableMobile()}>{translations[systemLanguage].messages['details_w']}</Text>
                                </TouchableOpacity>
                            </View>
                            ) : (null) 
                        }    
                        <View style={{flexDirection: 'row'}}>
                            {this.props.parentData.State === 'ACTIVE' ? (
                                    <>
                                        <TouchableOpacity style={styles.button} onPress={() => this.props.changePubState(this.props.parentData.State, this.props.parentData.IdPub)}> 
                                            <Text style={styles.buttonText}>{translations[systemLanguage].messages['pause_w']}</Text>
                                        </TouchableOpacity>
                                    </>
                                ) : (
                                    <TouchableOpacity style={styles.button} onPress={() => this.props.changePubState(this.props.parentData.State, this.props.parentData.IdPub)}> 
                                        <Text style={styles.buttonText}>{translations[systemLanguage].messages['resume_w']}</Text>
                                    </TouchableOpacity>
                                )
                            } 
                            <TouchableOpacity style={styles.button} onPress={()=>this.props.navigate('SpaceView', {PubId: this.props.parentData.IdPub})}> 
                                <Text style={styles.buttonText}>{translations[systemLanguage].messages['view_w']}</Text>
                            </TouchableOpacity>   
                        </View>
                    </View>       
                </View>    
        );
    }

}

const mapStateToProps = (state) => {
    return {
        systemLanguage: state.loginData.systemLanguage
    }
}

export default connect(mapStateToProps)(SpacesListScrollView)

const styles = StyleSheet.create({
    image:{
        width: 160,
        height: 160,  
        borderRadius: 20,
    },
    spacesContainer:{
        width: 360,
        borderWidth: 0.5,
        borderColor: '#0069c0',
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.3)',
        marginLeft: 20,
        marginRight: 20,
        marginBottom: 20,
        alignItems: 'center'
    },
    textView:{
        paddingTop: 10,
        color: 'white',
        alignItems: 'center',
    },
    premiumContainer: {
        marginTop: 10,
        paddingHorizontal: 10,
        borderRadius: 20,
        borderWidth: 2,
        alignItems: 'center',
    },
    premiumGold: {
        borderColor: '#FFD700',
    },
    premiumSilver: {
        borderColor: '#C0C0C0',
    },
    premiumBronze: {
        borderColor: '#cd7f32',
    },
    premiumFree: {
        borderColor: 'white',
    },
    shadow:{
        shadowColor: 'black',
        elevation:12,
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 1,
        shadowRadius: 20,
        backgroundColor: "#FFF",
    },
    button: {
        width:100,
        height:30,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor:'#0069c0',
        borderRadius: 15,
        marginVertical: 20,
        elevation: 3,
        marginHorizontal: 10,
    },
    buttonText: {
        fontSize:16,
        fontWeight:'500',
        color:'#ffffff'
    },
});