import React, {Component} from 'react';
import {View,Text,Image,StyleSheet,Dimensions,TouchableOpacity} from 'react-native';
import { connect } from 'react-redux';
import translations from '../common/translations';

class SearchSpaceView extends Component {
    render (){
        const { systemLanguage } = this.props;
        const {IdPublication, Capacity, HourPrice, DailyPrice, WeeklyPrice, MonthlyPrice, Title, ImagesURL, City} = this.props;
        return (
            <View style={styles.spacesContainer}>
                <View style={{flexDirection: 'row'}}>
                    <Image style={styles.image} source={{uri:ImagesURL[0]}}/>
                        <View style={{marginTop: 10}}>
                            <Text style={styles.titleText}>{Title}</Text>
                            <Text style={styles.descriptionText}>{City}</Text>
                            <Text style={styles.descriptionText}>{Capacity}</Text>
                            <Text style={styles.priceText}>
                            {HourPrice != 0 ? translations[systemLanguage].messages['hour_w'] + " $" + HourPrice : '-'}{'\n'}
                            {DailyPrice != 0 ? translations[systemLanguage].messages['planSelected_Day'] + " $" + DailyPrice : '-'}{'\n'}
                            {WeeklyPrice != 0 ? translations[systemLanguage].messages['planSelected_Week'] + " $" + WeeklyPrice : '-'}{'\n'}
                            {MonthlyPrice != 0 ? translations[systemLanguage].messages['planSelected_Month'] + " $" + MonthlyPrice : '-'}
                            </Text>
                            <TouchableOpacity style={styles.button} onPress={()=>this.props.navigate('SpaceView', {PubId: IdPublication})}> 
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

export default connect(mapStateToProps)(SearchSpaceView);

const styles = StyleSheet.create({
    image:{
        width: 200,
        height: 200,  
        borderRadius: 20,
        marginRight: 10,
    },
    spacesContainer:{
        height: 200, 
        width: Dimensions.get('window').width - 20,
        borderWidth: 0.5,
        borderColor: '#0069c0',
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.3)',
        marginTop: 40,
    },
    titleText: {
        color: 'white', 
        fontWeight: 'bold', 
        fontSize: 18,
    },
    descriptionText: {
        color: '#FFF',
        fontSize: 16,
    },
    priceText: {
        color: '#FFF',
        fontSize: 16,
    },
    button: {
        width:100,
        height:30,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor:'#0069c0',
        borderRadius: 15,
        marginVertical: 8,
        elevation: 3,
        paddingHorizontal: 5,
    },
    buttonText: {
        fontSize:16,
        fontWeight:'500',
        color:'#ffffff'
    },
});