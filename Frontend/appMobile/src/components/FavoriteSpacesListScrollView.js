import React, {Component} from 'react';
import {View,Text,StyleSheet,TouchableOpacity} from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { connect } from 'react-redux';

import translations from '../common/translations';

class FavoriteSpacesListScrollView extends Component {

    render (){
        const { systemLanguage } = this.props;
        return (
            <View style={styles.spacesContainer}>
                <View style={styles.textView}>
                    <Text style={styles.titleText}>{this.props.parentData.Title}</Text>
                    <Text style={styles.subtitleText}>{this.props.parentData.SpaceTypeDesc}</Text>
                    <View style={{flexDirection: 'row'}}>
                        <Text style={styles.infoText}>{this.props.parentData.City} -</Text>
                        <Text style={styles.infoText}>{this.props.parentData.Address}</Text>
                    </View>  
                    <Text style={styles.infoText}>{translations[systemLanguage].messages['capacity_w']}: {this.props.parentData.Capacity}</Text>
                    <Text style={styles.subtitleText2}>{translations[systemLanguage].messages['price_w']}</Text>
                    <Text style={styles.infoText}>{this.props.parentData.HourPrice == 0 ? (translations[systemLanguage].messages['hourlyPrice_w'] + ":  N/A") : (translations[systemLanguage].messages['hourlyPrice_w'] + ": $" + this.props.parentData.HourPrice)}</Text>
                    <Text style={styles.infoText}>{this.props.parentData.DailyPrice == 0 ? (translations[systemLanguage].messages['dailyPrice_w'] + ": N/A") : (translations[systemLanguage].messages['dailyPrice_w'] + ": $" + this.props.parentData.DailyPrice)}</Text>
                    <Text style={styles.infoText}>{this.props.parentData.WeeklyPrice == 0 ? (translations[systemLanguage].messages['weeklyPrice_w'] + ": N/A") : (translations[systemLanguage].messages['weeklyPrice_w'] + ": $" + this.props.parentData.WeeklyPrice)}</Text>
                    <Text style={styles.infoText}>{this.props.parentData.MonthlyPrice == 0 ? (translations[systemLanguage].messages['monthlyPrice_w'] + ": N/A") : (translations[systemLanguage].messages['monthlyPrice_w'] + ": $" + this.props.parentData.MonthlyPrice)}</Text>
                    <Text style={styles.infoText}>{translations[systemLanguage].messages['score_w']}: {this.props.parentData.Ranking == 0 ? 'N/A' : this.props.parentData.Ranking}</Text>
                    <TouchableOpacity style={styles.button} onPress={()=>this.props.navigate('SpaceView', {PubId: this.props.parentData.IdPub})}> 
                        <Text style={styles.buttonText}>{translations[systemLanguage].messages['view_w']}</Text>
                    </TouchableOpacity>   
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

export default connect(mapStateToProps)(FavoriteSpacesListScrollView)

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
    titleText:{
        color: 'white', 
        fontSize: 20,
    },
    subtitleText:{
        color: 'white', 
        fontSize: 18,
    },
    subtitleText2:{
        color: 'white', 
        fontSize: 18,
        paddingHorizontal: 5,
        marginTop: 5,
    },
    infoText:{
        color: 'white', 
        fontSize: 14, 
        paddingHorizontal: 5,
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
        paddingHorizontal: 5,
    },
    buttonText: {
        fontSize:16,
        fontWeight:'500',
        color:'#ffffff'
    },
});