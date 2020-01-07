import React, {Component} from 'react';
import {View,Text,Image,StyleSheet,Dimensions,TouchableOpacity} from 'react-native';

export default class SearchSpaceView extends Component {
    render (){
        const {IdPublication, Description, Capacity, HourPrice, DailyPrice, WeeklyPrice, MonthlyPrice, Title, ImagesURL, City, Ranking} = this.props;
        return (
            <View style={styles.spacesContainer}>
                <View style={{flexDirection: 'row'}}>
                    <Image style={styles.image} source={{uri:ImagesURL[0]}}/>
                        <View style={{marginTop: 10}}>
                            <Text style={styles.titleText}>{Title}</Text>
                            <Text style={styles.descriptionText}>{City}</Text>
                            <Text style={styles.descriptionText}>{Capacity}</Text>
                            <Text style={styles.priceText}>
                            {HourPrice != 0 ? "Hora $" + HourPrice :
                                    (DailyPrice != 0 ? "Día $" + DailyPrice :
                                    WeeklyPrice != 0 ? "Semana $" + WeeklyPrice :
                                        MonthlyPrice != 0 ? "Mes $" + MonthlyPrice : (null))
                            }
                            </Text>
                            <TouchableOpacity style={styles.button} onPress={()=>this.props.navigate('SpaceView', {PubId: IdPublication})}> 
                                <Text style={styles.buttonText}>Ver</Text>
                            </TouchableOpacity>
                        </View>

                </View>
            </View>  
        );
    }

}

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
        //elevation: 3,
        borderWidth: 0.5,
        borderColor: '#0069c0',
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.3)',
        //marginLeft: 20,
        //marginRight: 20,
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
        //marginLeft: 25,
        //marginTop: 10,
    },
    priceText: {
        color: '#FFF',
        fontSize: 22,
        //marginLeft: 25,
        //marginTop: 10,
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