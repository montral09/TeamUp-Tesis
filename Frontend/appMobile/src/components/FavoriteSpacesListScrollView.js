import React, {Component} from 'react';
import {View,Text,Image,StyleSheet,TouchableOpacity,ToastAndroid} from 'react-native';
import { Ionicons } from "@expo/vector-icons";

class FavoriteSpacesListScrollView extends Component {

    render (){
        return (
            <View style={styles.spacesContainer}>
                <View style={styles.textView}>
                    <Text style={{color: 'white', fontSize: 20}}>{this.props.parentData.Title}</Text>
                    <Text style={{color: 'white', fontSize: 16}}>{this.props.parentData.SpaceTypeDesc}</Text>
                    <View style={{flexDirection: 'row'}}>
                        <Text style={{color: 'white', fontSize: 14, paddingHorizontal: 5}}>{this.props.parentData.City} -</Text>
                        <Text style={{color: 'white', fontSize: 14, paddingHorizontal: 5}}>{this.props.parentData.Address}</Text>
                    </View>  
                    <Text style={{color: 'white', fontSize: 14, paddingHorizontal: 5}}>Capacidad: {this.props.parentData.Capacity}</Text>
                    <Text style={{color: 'white', fontSize: 18, paddingHorizontal: 5, marginTop: 5}}>Precio</Text>
                    <Text style={{color: 'white', fontSize: 14, paddingHorizontal: 5}}>{this.props.parentData.HourPrice == 0 ? ("Por Hora: N/A") : ("Por Hora: $"+this.props.parentData.HourPrice)}</Text>
                    <Text style={{color: 'white', fontSize: 14, paddingHorizontal: 5}}>{this.props.parentData.DailyPrice == 0 ? ("Por Día: N/A") : ("Por Día: $"+this.props.parentData.DailyPrice)}</Text>
                    <Text style={{color: 'white', fontSize: 14, paddingHorizontal: 5}}>{this.props.parentData.WeeklyPrice == 0 ? ("Por Semana: N/A") : ("Por Semana: $"+this.props.parentData.WeeklyPrice)}</Text>
                    <Text style={{color: 'white', fontSize: 14, paddingHorizontal: 5}}>{this.props.parentData.MonthlyPrice == 0 ? ("Por Mes: N/A") : ("Por Mes: $"+this.props.parentData.MonthlyPrice)}</Text>
                    <Text style={{color: 'white', fontSize: 14, paddingHorizontal: 5}}>Puntuación: {this.props.parentData.Ranking == 0 ? 'N/A' : this.props.parentData.Ranking}</Text>
                    <TouchableOpacity style={styles.button} onPress={()=>this.props.navigate('SpaceView', {PubId: this.props.parentData.IdPub})}> 
                        <Text style={styles.buttonText}>Ver</Text>
                    </TouchableOpacity>   
                </View>       
            </View>    
        );
    }
}

export default FavoriteSpacesListScrollView

const styles = StyleSheet.create({
    image:{
        width: 160,
        height: 160,  
        borderRadius: 20,
    },
    spacesContainer:{
        //height: 160, 
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
    imageView:{
        //flex: 2, 
    },
    textView:{
        //flex: 1,
        //paddingLeft: 10,
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
        paddingHorizontal: 5,
    },
    buttonText: {
        fontSize:16,
        fontWeight:'500',
        color:'#ffffff'
    },
});