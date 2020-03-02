import React, {Component} from 'react';
import {View,Text,Image,StyleSheet,Dimensions,TouchableOpacity} from 'react-native';
import { connect } from 'react-redux';
import { Ionicons } from "@expo/vector-icons";
import Icon from 'react-native-vector-icons/FontAwesome';
import translations from '../common/translations';

class SearchSpaceView extends Component {
    render (){
        const { systemLanguage } = this.props;
        const {IdPublication, Capacity, HourPrice, DailyPrice, WeeklyPrice, MonthlyPrice, Title, ImagesURL, City, IsRecommended} = this.props;
        return (
            <View style={styles.spacesContainer}>
                <View style={{flexDirection: 'row'}}>
                    {IsRecommended == true ? (
                        <View style={styles.recommendedView}>
                            <Icon
                                name="thumbs-o-up"
                                size={18}
                                color='white'
                            />
                            <Text style={styles.buttonText}> {translations[this.props.systemLanguage].messages['recommended_w']}</Text>
                        </View>
                        ):(null)
                    }
                    <Image style={styles.image} source={{uri:ImagesURL[0]}}/>
                        <View style={{marginTop: 10}}>
                            <Text style={styles.titleText}>{Title}</Text>
                            <View style={{flexDirection:'row'}}>
                                <Ionicons name="ios-home"
                                    color="#fff"
                                    size={20}
                                />
                                <Text style={styles.descriptionText}>{City}</Text>
                            </View>
                            <View style={{flexDirection:'row'}}>
                                <Ionicons name="ios-people"
                                    color="#fff"
                                    size={20}
                                />
                                <Text style={styles.descriptionText}>{Capacity}</Text>
                            </View>
                            <View style={{flexDirection:'row'}}>
                                <Ionicons name="ios-clock"
                                    color="#fff"
                                    size={20}
                                />
                                <Text style={styles.priceText}>{HourPrice != 0 ? translations[systemLanguage].messages['hour_w'] + " $" + HourPrice : '-'}</Text>
                            </View>
                            <View style={{flexDirection:'row'}}>
                                <Ionicons name="ios-today"
                                    color="#fff"
                                    size={20}
                                />
                                <Text style={styles.priceText}>{DailyPrice != 0 ? translations[systemLanguage].messages['planSelected_Day'] + " $" + DailyPrice : '-'}</Text>
                            </View>
                            <View style={{flexDirection:'row'}}>
                                <Ionicons name="ios-calendar"
                                    color="#fff"
                                    size={20}
                                />
                                <Text style={styles.priceText}>{WeeklyPrice != 0 ? translations[systemLanguage].messages['planSelected_Week'] + " $" + WeeklyPrice : '-'}</Text>
                            </View>
                            <View style={{flexDirection:'row'}}>
                                <Ionicons name="ios-calendar"
                                    color="#fff"
                                    size={20}
                                />
                                <Text style={styles.priceText}>{MonthlyPrice != 0 ? translations[systemLanguage].messages['planSelected_Month'] + " $" + MonthlyPrice : '-'}</Text>
                            </View>
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
    image:{
        width: 200,
        height: 220,  
        borderRadius: 20,
        marginRight: 10,
    },
    spacesContainer:{
        height: 220, 
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
        marginLeft: 5,
    },
    button: {
        width:100,
        height:30,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor:'#0069c0',
        borderRadius: 15,
        marginVertical: 6,
        elevation: 3,
        paddingHorizontal: 5,
    },
    buttonText: {
        fontSize:16,
        fontWeight:'500',
        color:'#ffffff'
    },
});