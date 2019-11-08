import React, {Component} from 'react';
import {View,Text,Image,StyleSheet} from 'react-native';

const images = [
            {
                source: {
                    uri: 'https://cdn.pixabay.com/photo/2016/03/28/09/34/bedroom-1285156_960_720.jpg'
                },
            },
            {
                source: {
                    uri: 'https://cdn.pixabay.com/photo/2015/05/15/14/22/conference-room-768441_960_720.jpg'
                },
            },
            {
                source: {
                    uri: 'https://cdn.pixabay.com/photo/2015/04/20/06/43/meeting-room-730679_960_720.jpg'
                },
            },
        ];


export default class Spaces extends Component {
    render (){
        return (
                <View style={styles.spacesContainer}>
                    <View style={styles.imageView}>
                        <Image style={styles.image} source={{uri:'https://cdn.pixabay.com/photo/2016/03/28/09/34/bedroom-1285156_960_720.jpg'}}/>
                    </View>
                    <View style={styles.textView}>
                        <Text style={{color: 'white'}}>{this.props.name}</Text>
                    </View>
                </View>    
        );
    }

        //return null;
}

const styles = StyleSheet.create({
    image:{
        width: 130,
        height: 130,  
        borderRadius: 20,
    },
    spacesContainer:{
        height: 200, 
        width: 130,
        elevation: 3,
        borderWidth: 0.5,
        borderColor: '#0069c0',
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.3)',
        marginLeft: 20,
        marginRight: 20,
        marginBottom: 20,
    },
    imageView:{
        flex: 2, 
    },
    textView:{
        flex: 1,
        paddingLeft: 10,
        paddingTop: 10,
        color: 'white',
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
});